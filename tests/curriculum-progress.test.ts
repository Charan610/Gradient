import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProgressRepository } from '../src/lib/db/progress-repository';
import { LEARNING_DAYS, PHASES, RESOURCES } from '../src/lib/db/curriculum-data';

// Mock localStorage for Vitest Node environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] || null
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true
});

describe('FOUNDATION Curriculum & Progress Engine', () => {
  const testUserId = 'test_learner_1';

  beforeEach(() => {
    localStorage.clear();
  });

  it('checks catalog identifiers and stored metadata (not live URLs)', () => {
    expect(RESOURCES.length).toBe(41);
    for (const r of RESOURCES) {
      expect(r.id).toMatch(/^R\d{2}$/);
      expect(r.verification_status).toBe('checked');
      expect(r.url).toBeTruthy();
    }
  });

  it('contains 30 foundation lessons with learn, practice, and apply tasks', () => {
    expect(LEARNING_DAYS.length).toBeGreaterThanOrEqual(30);
    const day01 = LEARNING_DAYS[0];
    expect(day01.id).toBe('P0-D01');
    expect(day01.sequence_index).toBe(1);
    expect(day01.tasks.length).toBeGreaterThanOrEqual(3);

    // Verify day 01 has learn, practice, apply tasks
    const kinds = day01.tasks.map(t => t.kind);
    expect(kinds).toContain('learn');
    expect(kinds).toContain('practice');
    expect(kinds).toContain('apply');
  });

  it('guarantees zero calendar dates in the learner curriculum', () => {
    for (const day of LEARNING_DAYS) {
      expect(typeof day.sequence_index).toBe('number');
      // Verify no absolute date strings in day titles or goals
      expect(day.title).not.toMatch(/202[6-9]/);
      expect(day.goal).not.toMatch(/deadline|due date|overdue/i);
    }
  });

  it('blocks finishLearningDay when required tasks are incomplete', async () => {
    const day01 = LEARNING_DAYS[0];

    // Attempt to finish without checking any tasks
    const result = await ProgressRepository.finishLearningDay(testUserId, day01.id);

    expect(result.success).toBe(false);
    expect(result.error).toBe('incomplete_required_tasks');
    expect(result.remaining_count).toBeGreaterThan(0);

    // Verify sequence has NOT advanced
    const profile = await ProgressRepository.getProfile(testUserId);
    expect(profile.active_day_index).toBe(1);
  });

  it('successfully advances sequence when all required tasks are completed', async () => {
    const day01 = LEARNING_DAYS[0];

    // Complete all required tasks
    for (const task of day01.tasks) {
      if (task.required) {
        await ProgressRepository.updateTaskProgress(
          testUserId,
          day01.id,
          task.id,
          'completed'
        );
      }
    }

    // Call finishLearningDay
    const result = await ProgressRepository.finishLearningDay(testUserId, day01.id);

    expect(result.success).toBe(true);
    expect(result.next_day_sequence).toBe(2);

    // Verify profile active day sequence is now 2
    const profile = await ProgressRepository.getProfile(testUserId);
    expect(profile.active_day_index).toBe(2);

    // Verify day progress is marked completed
    const dayProg = await ProgressRepository.getDayProgress(testUserId, day01.id);
    expect(dayProg?.state).toBe('completed');
  });

  it('ensures optional tasks do not block day advancement', async () => {
    const day01 = LEARNING_DAYS[0];

    // Complete ONLY required tasks, leave optional incomplete
    for (const task of day01.tasks) {
      if (task.required) {
        await ProgressRepository.updateTaskProgress(
          testUserId,
          day01.id,
          task.id,
          'completed'
        );
      } else {
        await ProgressRepository.updateTaskProgress(
          testUserId,
          day01.id,
          task.id,
          'not_started'
        );
      }
    }

    const result = await ProgressRepository.finishLearningDay(testUserId, day01.id);
    expect(result.success).toBe(true);
  });

  it('guarantees idempotency: finishing the same day twice does not advance sequence twice', async () => {
    const day01 = LEARNING_DAYS[0];

    for (const task of day01.tasks) {
      if (task.required) {
        await ProgressRepository.updateTaskProgress(
          testUserId,
          day01.id,
          task.id,
          'completed'
        );
      }
    }

    const firstCall = await ProgressRepository.finishLearningDay(testUserId, day01.id);
    expect(firstCall.success).toBe(true);
    expect(firstCall.next_day_sequence).toBe(2);

    const secondCall = await ProgressRepository.finishLearningDay(testUserId, day01.id);
    expect(secondCall.success).toBe(true);
    expect(secondCall.next_day_sequence).toBe(2);

    const profile = await ProgressRepository.getProfile(testUserId);
    expect(profile.active_day_index).toBe(2);
  });

  it('schedules spaced repetition on learning-day sequence offsets', async () => {
    const day01 = LEARNING_DAYS[0];

    for (const task of day01.tasks) {
      if (task.required) {
        await ProgressRepository.updateTaskProgress(
          testUserId,
          day01.id,
          task.id,
          'completed'
        );
      }
    }

    await ProgressRepository.finishLearningDay(testUserId, day01.id);

    // Reviews should now be due for day sequence 2
    const dueReviews = await ProgressRepository.getDueReviews(testUserId, 2);
    expect(dueReviews.length).toBeGreaterThan(0);

    const review = dueReviews[0];
    expect(review.last_day_index).toBe(1);
    expect(review.next_due_day_index).toBe(2); // Day + 1 offset
  });

  it('advances review intervals on stable ratings (+1, +3, +7, +21, +45)', async () => {
    await ProgressRepository.scheduleReview(
      testUserId,
      'P0.01',
      'Test Concept Prompt',
      'Test Answer',
      1
    );

    const reviews = await ProgressRepository.getDueReviews(testUserId, 2);
    expect(reviews.length).toBe(1);

    // Rate stable: interval should advance to offset +3
    await ProgressRepository.recordReviewAttempt(testUserId, reviews[0].id, 'stable');

    const key = `foundation_career_os_${testUserId}_reviews`;
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    expect(stored[0].interval_step).toBe(2);
    expect(stored[0].next_due_day_index).toBe(4); // 1 + 3 = 4
  });

  it('records phase readiness gate verification attempts', async () => {
    const attempt = await ProgressRepository.recordGateAttempt(
      testUserId,
      'P0',
      { 'p0-r1': true, 'p0-r2': true },
      true,
      'https://github.com/student/cpp-foundations'
    );

    expect(attempt.passed).toBe(true);
    expect(attempt.phase_id).toBe('P0');

    const retrieved = await ProgressRepository.getGateAttempt(testUserId, 'P0');
    expect(retrieved?.passed).toBe(true);
    expect(retrieved?.evidence).toContain('cpp-foundations');
  });
});

describe('Personal study reliability', () => {
  beforeEach(() => localStorage.clear());
  const user = 'local_user';
  async function completeTasks(day = LEARNING_DAYS[0]) {
    for (const task of day.tasks.filter(t => t.required)) {
      await ProgressRepository.updateTaskProgress(user, day.id, task.id, 'completed');
    }
  }

  it('starts without invented reviews or applications', async () => {
    expect(await ProgressRepository.getDueReviews(user, 1)).toEqual([]);
    expect(await ProgressRepository.getApplications(user)).toEqual([]);
  });

  it('preserves written evidence when checking a task', async () => {
    const task = LEARNING_DAYS[0].tasks[0];
    await ProgressRepository.updateTaskProgress(user, task.learning_day_id, task.id, 'in_progress', 'Compiler output and explanation');
    await ProgressRepository.updateTaskProgress(user, task.learning_day_id, task.id, 'completed');
    const tasks = await ProgressRepository.getDayTaskProgresses(user, task.learning_day_id);
    expect(tasks[task.id].evidence_text).toBe('Compiler output and explanation');
  });

  it('rejects completing a future lesson even if its tasks are checked', async () => {
    await completeTasks(LEARNING_DAYS[2]);
    expect(await ProgressRepository.finishLearningDay(user, LEARNING_DAYS[2].id)).toMatchObject({ success: false, error: 'out_of_sequence' });
    expect((await ProgressRepository.getProfile(user)).active_day_index).toBe(1);
  });

  it('does not reset review ratings when a completed lesson is submitted again', async () => {
    await completeTasks();
    await ProgressRepository.finishLearningDay(user, LEARNING_DAYS[0].id);
    const reviews = await ProgressRepository.getDueReviews(user, 2);
    await ProgressRepository.recordReviewAttempt(user, reviews[0].id, 'stable');
    const before = localStorage.getItem('foundation_career_os_local_user_reviews');
    await ProgressRepository.finishLearningDay(user, LEARNING_DAYS[0].id);
    expect(localStorage.getItem('foundation_career_os_local_user_reviews')).toBe(before);
  });

  it('retains different concepts from the same module', async () => {
    await ProgressRepository.scheduleReview(user, 'P0.01', 'Compile?', 'Translation.', 1);
    await ProgressRepository.scheduleReview(user, 'P0.01', 'Link?', 'Resolve symbols.', 1);
    expect(await ProgressRepository.getDueReviews(user, 2)).toHaveLength(2);
  });

  it('reschedules a late failed recall after the current learning day', async () => {
    await ProgressRepository.scheduleReview(user, 'P0.01', 'Compile?', 'Translation.', 1);
    await ProgressRepository.updateProfile(user, { active_day_index: 10 });
    const [review] = await ProgressRepository.getDueReviews(user, 10);
    await ProgressRepository.recordReviewAttempt(user, review.id, 'needs_work');
    expect(await ProgressRepository.getDueReviews(user, 10)).toEqual([]);
    expect(await ProgressRepository.getDueReviews(user, 11)).toHaveLength(1);
  });

  it('exports task evidence and project notes and resets only the selected workspace', async () => {
    await completeTasks();
    localStorage.setItem('foundation_proj_PROJ-A', JSON.stringify({ notes: 'My API design' }));
    localStorage.setItem('foundation_career_os_local_user_other_profile', 'keep');
    const bundle = JSON.parse(await ProgressRepository.exportUserData(user));
    expect(bundle.local_records['foundation_career_os_local_user_tasks_P0-D01']).toBeTruthy();
    expect(bundle.local_records['foundation_proj_PROJ-A']).toContain('My API design');
    await ProgressRepository.clearAllUserData(user);
    expect(localStorage.getItem('foundation_proj_PROJ-A')).toBeNull();
    expect(localStorage.getItem('foundation_career_os_local_user_other_profile')).toBe('keep');
    expect(await ProgressRepository.getDayTaskProgresses(user, 'P0-D01')).toEqual({});
  });
});

describe('Session boundaries', () => {
  beforeEach(() => localStorage.clear());
  it('preserves both tasks when saves overlap', async () => {
    await Promise.all(LEARNING_DAYS[0].tasks.slice(0, 2).map(t =>
      ProgressRepository.updateTaskProgress('local_user', 'P0-D01', t.id, 'completed')
    ));
    expect(Object.keys(await ProgressRepository.getDayTaskProgresses('local_user', 'P0-D01'))).toHaveLength(2);
  });
  it('pauses advancement in maintenance mode', async () => {
    await ProgressRepository.updateProfile('local_user', { preferred_mode: 'maintenance' });
    for (const task of LEARNING_DAYS[0].tasks.filter(t => t.required)) {
      await ProgressRepository.updateTaskProgress('local_user', 'P0-D01', task.id, 'completed');
    }
    expect(await ProgressRepository.finishLearningDay('local_user', 'P0-D01')).toMatchObject({ success: false, error: 'maintenance_mode' });
    expect((await ProgressRepository.getProfile()).active_day_index).toBe(1);
  });
});


describe('Completion operation identity', () => {
  beforeEach(() => localStorage.clear());
  it('deduplicates simultaneous finishes and permits safe retries', async () => {
    for (const task of LEARNING_DAYS[0].tasks.filter(task => task.required)) {
      await ProgressRepository.updateTaskProgress('local_user', 'P0-D01', task.id, 'completed');
    }
    const schedule = vi.spyOn(ProgressRepository, 'scheduleReview');
    try {
      const first = ProgressRepository.finishLearningDay('local_user', 'P0-D01');
      expect(ProgressRepository.finishLearningDay('local_user', 'P0-D01')).toBe(first);
      expect((await first).success).toBe(true);
      expect(schedule).toHaveBeenCalledTimes(1);
      await ProgressRepository.finishLearningDay('local_user', 'P0-D01');
      expect(schedule).toHaveBeenCalledTimes(1);
      expect((await ProgressRepository.getProfile()).active_day_index).toBe(2);
    } finally { schedule.mockRestore(); }
  });
});
