// ==============================================================================
// PROGRESS REPOSITORY: DUAL SUPABASE / LOCAL PERSISTENCE LAYER
// Authoritative Server & Client State Engine
// ==============================================================================

import {
  UserProfile,
  UserDayProgress,
  UserTaskProgress,
  ConceptReview,
  JobApplication,
  GateAttempt,
  TaskProgressStatus
} from './types';
import { LEARNING_DAYS } from './curriculum-data';
import { createClient } from '../supabase/client';

const LOCAL_STORAGE_KEY_PREFIX = 'foundation_career_os_';

export class ProgressRepository {
  private static getStorageKey(userId: string, suffix: string): string {
    return `${LOCAL_STORAGE_KEY_PREFIX}${userId}_${suffix}`;
  }

  // ----------------------------------------------------------------------------
  // 1. Profile Management
  // ----------------------------------------------------------------------------
  static async getProfile(userId: string = 'local_user'): Promise<UserProfile> {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (data && !error) return data as UserProfile;
    }

    // Local persistence fallback
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(this.getStorageKey(userId, 'profile'));
      if (stored) {
        try {
          return JSON.parse(stored) as UserProfile;
        } catch {
          // ignore parsing error
        }
      }
    }

    // Default Profile
    const defaultProfile: UserProfile = {
      user_id: userId,
      alias: 'Student Engineer',
      academic_semester: '2-2',
      target_role: 'Software Development Engineer / Backend',
      optional_cgpa: null,
      preferred_daily_minutes: 90,
      preferred_mode: 'normal',
      theme: 'light',
      onboarding_status: 'completed',
      active_day_index: 1
    };

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.getStorageKey(userId, 'profile'), JSON.stringify(defaultProfile));
    }

    return defaultProfile;
  }

  static async updateProfile(userId: string = 'local_user', updates: Partial<UserProfile>): Promise<UserProfile> {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .select()
        .single();
      if (data && !error) return data as UserProfile;
    }

    const current = await this.getProfile(userId);
    const updated = { ...current, ...updates, updated_at: new Date().toISOString() };
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.getStorageKey(userId, 'profile'), JSON.stringify(updated));
    }
    return updated;
  }

  // ----------------------------------------------------------------------------
  // 2. Task & Day Progress
  // ----------------------------------------------------------------------------
  static async getDayTaskProgresses(userId: string = 'local_user', dayId: string): Promise<Record<string, UserTaskProgress>> {
    const supabase = createClient();
    if (supabase) {
      const day = LEARNING_DAYS.find(d => d.id === dayId);
      if (day) {
        const taskIds = day.tasks.map(t => t.id);
        const { data, error } = await supabase
          .from('user_task_progress')
          .select('*')
          .eq('user_id', userId)
          .in('day_task_id', taskIds);
        if (data && !error) {
          const map: Record<string, UserTaskProgress> = {};
          for (const item of data) {
            map[item.day_task_id] = item as UserTaskProgress;
          }
          return map;
        }
      }
    }

    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(this.getStorageKey(userId, `tasks_${dayId}`));
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignore error
        }
      }
    }
    return {};
  }

  static async updateTaskProgress(
    userId: string = 'local_user',
    dayId: string,
    taskId: string,
    status: TaskProgressStatus,
    evidenceText?: string,
    evidenceUrl?: string
  ): Promise<UserTaskProgress> {
    const progress: UserTaskProgress = {
      user_id: userId,
      day_task_id: taskId,
      status,
      evidence_text: evidenceText,
      evidence_url: evidenceUrl,
      completed_at: status === 'completed' ? new Date().toISOString() : undefined
    };

    const supabase = createClient();
    if (supabase) {
      await supabase.from('user_task_progress').upsert(progress);
    }

    if (typeof localStorage !== 'undefined') {
      const tasksMap = await this.getDayTaskProgresses(userId, dayId);
      tasksMap[taskId] = progress;
      localStorage.setItem(this.getStorageKey(userId, `tasks_${dayId}`), JSON.stringify(tasksMap));
    }

    return progress;
  }

  static async getDayProgress(userId: string = 'local_user', dayId: string): Promise<UserDayProgress | null> {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('user_day_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('learning_day_id', dayId)
        .single();
      if (data && !error) return data as UserDayProgress;
    }

    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(this.getStorageKey(userId, `day_${dayId}`));
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignore
        }
      }
    }
    return null;
  }

  // ----------------------------------------------------------------------------
  // 3. Atomic finishLearningDay Transaction
  // ----------------------------------------------------------------------------
  static async finishLearningDay(userId: string = 'local_user', dayId: string): Promise<{
    success: boolean;
    error?: string;
    remaining_count?: number;
    next_day_sequence?: number;
  }> {
    const day = LEARNING_DAYS.find(d => d.id === dayId);
    if (!day) {
      return { success: false, error: 'invalid_day' };
    }

    const taskMap = await this.getDayTaskProgresses(userId, dayId);
    const requiredTasks = day.tasks.filter(t => t.required);
    const incompleteTasks = requiredTasks.filter(t => taskMap[t.id]?.status !== 'completed');

    // Strict validation: must NOT silently advance if mandatory tasks are incomplete
    if (incompleteTasks.length > 0) {
      return {
        success: false,
        error: 'incomplete_required_tasks',
        remaining_count: incompleteTasks.length
      };
    }

    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase.rpc('finish_learning_day', { p_day_id: dayId });
      if (data && !error) {
        return data as { success: boolean; error?: string; remaining_count?: number; next_day_sequence?: number };
      }
    }

    // Local transactional simulation
    const dayProgress: UserDayProgress = {
      user_id: userId,
      learning_day_id: dayId,
      state: 'completed',
      completed_at: new Date().toISOString(),
      time_spent_minutes: day.estimated_minutes
    };

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.getStorageKey(userId, `day_${dayId}`), JSON.stringify(dayProgress));
    }

    const currentProfile = await this.getProfile(userId);
    const nextSeq = Math.max(currentProfile.active_day_index, day.sequence_index + 1);
    await this.updateProfile(userId, { active_day_index: nextSeq });

    // Schedule spaced review for the day's modules (+1 day sequence offset)
    for (const task of day.tasks) {
      if (task.module_id) {
        await this.scheduleReview(userId, task.module_id, task.title, task.validation_criteria, day.sequence_index);
      }
    }

    return {
      success: true,
      next_day_sequence: nextSeq
    };
  }

  // ----------------------------------------------------------------------------
  // 4. Spaced Repetition Review System (+1, +3, +7, +21, +45 day offsets)
  // ----------------------------------------------------------------------------
  static async scheduleReview(
    userId: string,
    moduleId: string,
    prompt: string,
    answer: string,
    currentSeq: number
  ): Promise<void> {
    const review: ConceptReview = {
      id: `rev_${moduleId}_${Date.now()}`,
      user_id: userId,
      module_id: moduleId,
      concept_prompt: prompt,
      concept_answer: answer,
      last_day_index: currentSeq,
      next_due_day_index: currentSeq + 1, // First review due at Day + 1
      interval_step: 1,
      latest_confidence: 'needs_work'
    };

    const supabase = createClient();
    if (supabase) {
      await supabase.from('concept_reviews').upsert(review);
    }

    if (typeof localStorage !== 'undefined') {
      const key = this.getStorageKey(userId, 'reviews');
      const stored = localStorage.getItem(key);
      const list: ConceptReview[] = stored ? JSON.parse(stored) : [];
      const filtered = list.filter(r => r.module_id !== moduleId);
      filtered.push(review);
      localStorage.setItem(key, JSON.stringify(filtered));
    }
  }

  static async getDueReviews(userId: string = 'local_user', activeDayIndex: number): Promise<ConceptReview[]> {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('concept_reviews')
        .select('*')
        .eq('user_id', userId)
        .lte('next_due_day_index', activeDayIndex);
      if (data && !error) return data as ConceptReview[];
    }

    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(this.getStorageKey(userId, 'reviews'));
      if (stored) {
        try {
          const list: ConceptReview[] = JSON.parse(stored);
          return list.filter(r => r.next_due_day_index <= activeDayIndex);
        } catch {
          // ignore
        }
      }
    }

    // Default seed review for first day
    return [
      {
        id: 'rev_default_1',
        user_id: userId,
        module_id: 'P0.01',
        concept_prompt: 'Explain what happens between pressing compile and the OS launching your program.',
        concept_answer: 'Source code is parsed by compiler into machine object code, linker resolves standard library symbols, producing an executable loaded into RAM by OS.',
        last_day_index: 1,
        next_due_day_index: 1,
        interval_step: 1,
        latest_confidence: 'needs_work'
      }
    ];
  }

  static async recordReviewAttempt(
    userId: string = 'local_user',
    reviewId: string,
    rating: 'needs_work' | 'stable'
  ): Promise<void> {
    const INTERVAL_STEPS = [1, 3, 7, 21, 45];

    if (typeof localStorage !== 'undefined') {
      const key = this.getStorageKey(userId, 'reviews');
      const stored = localStorage.getItem(key);
      if (stored) {
        const list: ConceptReview[] = JSON.parse(stored);
        const item = list.find(r => r.id === reviewId);
        if (item) {
          item.latest_confidence = rating;
          if (rating === 'stable') {
            const nextStepIndex = Math.min(item.interval_step, INTERVAL_STEPS.length - 1);
            const offset = INTERVAL_STEPS[nextStepIndex];
            item.next_due_day_index = item.last_day_index + offset;
            item.interval_step += 1;
          } else {
            // Repeat on next active day
            item.next_due_day_index = item.last_day_index + 1;
            item.interval_step = 1;
          }
          localStorage.setItem(key, JSON.stringify(list));
        }
      }
    }
  }

  // ----------------------------------------------------------------------------
  // 5. Job Application CRM Pipeline
  // ----------------------------------------------------------------------------
  static async getApplications(userId: string = 'local_user'): Promise<JobApplication[]> {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });
      if (data && !error) return data as JobApplication[];
    }

    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(this.getStorageKey(userId, 'applications'));
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignore
        }
      }
    }

    // Default sample starter application for learner tracking
    const initialApps: JobApplication[] = [
      {
        id: 'app_seed_1',
        user_id: userId,
        company: 'Atlassian',
        role: 'Software Engineer Intern (India)',
        location: 'Bengaluru / Remote',
        url: 'https://www.atlassian.com/company/careers/earlycareers',
        kind: 'internship',
        status: 'saved',
        eligibility_note: 'Recruiting window begins in July for 3-1 students.',
        notes: 'Target project: Task API with pytest coverage.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.getStorageKey(userId, 'applications'), JSON.stringify(initialApps));
    }
    return initialApps;
  }

  static async saveApplication(
    userId: string = 'local_user',
    app: Omit<JobApplication, 'id' | 'user_id' | 'created_at' | 'updated_at'> & { id?: string }
  ): Promise<JobApplication> {
    const existingList = await this.getApplications(userId);
    const id = app.id || `app_${Date.now()}`;
    const now = new Date().toISOString();

    const fullApp: JobApplication = {
      ...app,
      id,
      user_id: userId,
      created_at: now,
      updated_at: now
    };

    const supabase = createClient();
    if (supabase) {
      await supabase.from('applications').upsert(fullApp);
    }

    if (typeof localStorage !== 'undefined') {
      const updatedList = existingList.filter(a => a.id !== id);
      updatedList.unshift(fullApp);
      localStorage.setItem(this.getStorageKey(userId, 'applications'), JSON.stringify(updatedList));
    }

    return fullApp;
  }

  static async deleteApplication(userId: string = 'local_user', appId: string): Promise<void> {
    const supabase = createClient();
    if (supabase) {
      await supabase.from('applications').delete().eq('id', appId).eq('user_id', userId);
    }

    if (typeof localStorage !== 'undefined') {
      const existingList = await this.getApplications(userId);
      const filtered = existingList.filter(a => a.id !== appId);
      localStorage.setItem(this.getStorageKey(userId, 'applications'), JSON.stringify(filtered));
    }
  }

  // ----------------------------------------------------------------------------
  // 6. Phase Gates & Readiness Verification
  // ----------------------------------------------------------------------------
  static async getGateAttempt(userId: string = 'local_user', phaseId: string): Promise<GateAttempt | null> {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(this.getStorageKey(userId, `gate_${phaseId}`));
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignore
        }
      }
    }
    return null;
  }

  static async recordGateAttempt(
    userId: string = 'local_user',
    phaseId: string,
    scoreJson: Record<string, any>,
    passed: boolean,
    evidence: string
  ): Promise<GateAttempt> {
    const attempt: GateAttempt = {
      id: `gate_attempt_${Date.now()}`,
      user_id: userId,
      phase_id: phaseId,
      score_json: scoreJson,
      passed,
      evidence,
      created_at: new Date().toISOString()
    };

    const supabase = createClient();
    if (supabase) {
      await supabase.from('gate_attempts').insert(attempt);
    }

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.getStorageKey(userId, `gate_${phaseId}`), JSON.stringify(attempt));
    }

    return attempt;
  }

  // ----------------------------------------------------------------------------
  // 7. Privacy: Export & Delete All User Data
  // ----------------------------------------------------------------------------
  static async exportUserData(userId: string = 'local_user'): Promise<string> {
    const profile = await this.getProfile(userId);
    const applications = await this.getApplications(userId);

    const exportBundle = {
      exported_at: new Date().toISOString(),
      profile,
      applications
    };

    return JSON.stringify(exportBundle, null, 2);
  }

  static async clearAllUserData(userId: string = 'local_user'): Promise<void> {
    if (typeof localStorage !== 'undefined') {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`${LOCAL_STORAGE_KEY_PREFIX}${userId}`)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    }
  }
}
