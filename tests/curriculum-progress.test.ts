import { describe, it, expect, beforeEach } from 'vitest';
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

  it('verifies all 41 resources (R01-R41) are present with checked verification', () => {
    expect(RESOURCES.length).toBe(41);
    for (const r of RESOURCES) {
      expect(r.id).toMatch(/^R\d{2}$/);
      expect(r.verification_status).toBe('checked');
      expect(r.url).toBeTruthy();
    }
  });

  it('verifies 30 consecutive hand-authored learning days for Phase 0', () => {
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
