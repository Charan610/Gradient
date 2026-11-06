import {applyPracticeAction,emptyEvidence,practiceEvidenceSchema,type PracticeAction} from './practice-evidence';
import { LESSON_STORAGE_SUFFIX } from './lesson-identity';
import {withStudyLock} from './study-lock';
import {assertNoPendingStudyRestore, studyRestoreJournalKey} from './restore-recovery';
import {lessonDraftRevision,lessonDraftRevisionKey,newLessonDraftRevision,clearLessonDrafts} from './lesson-drafts';
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
import {COURSE_INDEX} from './course-index';
import { EXPANDED_RECALL } from './expanded-curriculum';
import { STUDY_GUIDANCE } from './study-guidance';
import { LEARNING_DAYS } from './curriculum-data';
import {workspaceStorageKey,portableStorageKey} from '@/lib/account/workspace';
import { createClient } from '../supabase/client';
import {REVIEW_OFFSETS,recallStep} from './review-schedule';

const LOCAL_STORAGE_KEY_PREFIX = 'foundation_career_os_';

export class ProgressRepository {
  private static getStorageKey(userId: string, suffix: string): string {
    const key = `${LOCAL_STORAGE_KEY_PREFIX}${userId}_${suffix}`;
    return userId === 'local_user' ? workspaceStorageKey(key) : key;
  }

  private static ownsLocalKey(userId: string, key: string): boolean {
    if (userId === 'local_user') { const portable = portableStorageKey(key); if (!portable) return false; key = portable; if (key.startsWith('foundation_proj_')) return true; }
    const prefix = `${LOCAL_STORAGE_KEY_PREFIX}${userId}_`;
    if (!key.startsWith(prefix)) return false;
    const suffix = key.slice(prefix.length);
    return ['profile', 'reviews', 'applications'].includes(suffix) ||
      LESSON_STORAGE_SUFFIX.test(suffix) || /^gate_P\d+$/.test(suffix);
  }

  /** Finish an interrupted local commit before exposing its profile or completion. */
  private static recoverCompletion(userId:string) {
    if(typeof localStorage==='undefined')return;
    if(userId==='local_user')assertNoPendingStudyRestore(localStorage);
    const journalKey=this.getStorageKey(userId,'completion_journal');
    const raw=localStorage.getItem(journalKey);
    if(!raw)return;
    const journal=JSON.parse(raw);
    const day=LEARNING_DAYS.find(day=>day.id===journal.dayId);
    if(journal.version!==1||!day||!journal.records||typeof journal.records!=='object')throw new Error('The saved lesson needs recovery. Keep a backup before resetting.');
    const allowed=['profile','reviews',`day_${day.id}`].map(suffix=>this.getStorageKey(userId,suffix));
    if(Object.keys(journal.records).length!==3||Object.entries(journal.records).some(([key,value])=>!allowed.includes(key)||typeof value!=='string'))throw new Error('Invalid completion recovery record.');
    const profile=JSON.parse(journal.records[allowed[0]]);
    const completion=JSON.parse(journal.records[allowed[2]]);
    if(profile.user_id!==userId||!Number.isInteger(profile.active_day_index)||profile.active_day_index<day.sequence_index+1||completion.user_id!==userId||completion.learning_day_id!==day.id||completion.state!=='completed'||!Array.isArray(JSON.parse(journal.records[allowed[1]])))throw new Error('Invalid completion recovery data.');
    // localStorage writes are synchronous. The journal survives interruption and
    // is scoped to this workspace; retrying finishes the same authorized commit.
    for(const key of allowed)localStorage.setItem(key,journal.records[key]);
    localStorage.removeItem(journalKey);
  }

  // ----------------------------------------------------------------------------
  // 1. Profile Management
  // ----------------------------------------------------------------------------
  private static async getProfileUnlocked(userId: string = 'local_user'): Promise<UserProfile> {
    this.recoverCompletion(userId);
    const supabase = userId === 'local_user' ? null : createClient();
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
      if (stored !== null) {
        const parsed = JSON.parse(stored) as UserProfile;
        if (!parsed || Array.isArray(parsed) || parsed.user_id !== userId || !Number.isInteger(parsed.active_day_index) || parsed.active_day_index < 1) throw new Error('Saved profile is invalid. Keep a recovery copy before changing it.');
        return parsed;
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

  private static async updateProfileUnlocked(userId: string = 'local_user', updates: Partial<UserProfile>): Promise<UserProfile> {
    const workspace = this.getStorageKey(userId, 'profile');
    const revision = userId==='local_user'?lessonDraftRevision():null;
    const supabase = userId === 'local_user' ? null : createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .select()
        .single();
      if (data && !error) return data as UserProfile;
    }

    const fallback = await this.getProfileUnlocked(userId);
    if (workspace !== this.getStorageKey(userId, 'profile') || userId==='local_user'&&(revision===null||revision!==lessonDraftRevision())) throw new Error('Workspace changed before saving.');
    // Another caller may have saved while getProfile yielded. Merge at the write boundary.
    this.recoverCompletion(userId);
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(this.getStorageKey(userId, 'profile')) : null;
    const current = raw ? JSON.parse(raw) as UserProfile : fallback;
    const updated = { ...current, ...updates, updated_at: new Date().toISOString() };
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.getStorageKey(userId, 'profile'), JSON.stringify(updated));
    }
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('foundation-progress'));
    return updated;
  }

  private static async setCourseInterestUnlocked(userId:string='local_user',courseId:string,interested:boolean):Promise<UserProfile> {
    const workspace = this.getStorageKey(userId, 'profile');
    const revision = userId==='local_user'?lessonDraftRevision():null;
    if(!COURSE_INDEX.some(course=>course.id===courseId))throw new Error('Unknown course.');
    const fallback=await this.getProfileUnlocked(userId);
    if (workspace !== this.getStorageKey(userId, 'profile') || userId==='local_user'&&(revision===null||revision!==lessonDraftRevision())) throw new Error('Workspace changed before saving.');
    if(typeof localStorage==='undefined')throw new Error('Browser storage is unavailable.');
    const key=this.getStorageKey(userId,'profile');
    const current=JSON.parse(localStorage.getItem(key)||'null') as UserProfile|null;
    const profile=current||fallback;
    const saved=new Set(profile.saved_course_ids||[]);
    if(interested)saved.add(courseId);else saved.delete(courseId);
    const updated={...profile,saved_course_ids:[...saved],updated_at:new Date().toISOString()};
    localStorage.setItem(key,JSON.stringify(updated));
    if(typeof window!=='undefined')window.dispatchEvent(new Event('foundation-progress'));
    return updated;
  }

  // ----------------------------------------------------------------------------
  // 2. Task & Day Progress
  // ----------------------------------------------------------------------------
  private static async getDayTaskProgressesUnlocked(userId: string = 'local_user', dayId: string): Promise<Record<string, UserTaskProgress>> {
    this.recoverCompletion(userId);
    const supabase = userId === 'local_user' ? null : createClient();
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

  private static async updateTaskProgressUnlocked(
    userId: string = 'local_user',
    dayId: string,
    taskId: string,
    status: TaskProgressStatus,
    evidenceText?: string,
    evidenceUrl?: string
  ): Promise<UserTaskProgress> {
    const workspace = this.getStorageKey(userId, 'profile');
    const revision = userId==='local_user'?lessonDraftRevision():null;
    const existing = (await this.getDayTaskProgressesUnlocked(userId, dayId))[taskId];
    if (workspace !== this.getStorageKey(userId, 'profile') || userId==='local_user'&&(revision===null||revision!==lessonDraftRevision())) throw new Error('Workspace changed before saving.');
    const progress: UserTaskProgress = {
      user_id: userId,
      day_task_id: taskId,
      status,
      evidence_text: evidenceText ?? existing?.evidence_text,
      evidence_url: evidenceUrl ?? existing?.evidence_url,
      completed_at: status === 'completed' ? new Date().toISOString() : undefined
    };

    const supabase = userId === 'local_user' ? null : createClient();
    if (supabase) {
      await supabase.from('user_task_progress').upsert(progress);
    }

    if (typeof localStorage !== 'undefined') {
      if (workspace !== this.getStorageKey(userId, 'profile') || userId==='local_user'&&(revision===null||revision!==lessonDraftRevision())) throw new Error('Workspace changed before saving.');
      this.recoverCompletion(userId);
      // Keep the local read/merge/write synchronous so overlapping saves cannot
      // replace a sibling task with an older snapshot.
      const stored = localStorage.getItem(this.getStorageKey(userId, `tasks_${dayId}`));
      const tasksMap: Record<string, UserTaskProgress> = stored ? JSON.parse(stored) : {};
      progress.evidence_text = evidenceText ?? tasksMap[taskId]?.evidence_text ?? progress.evidence_text;
      progress.evidence_url = evidenceUrl ?? tasksMap[taskId]?.evidence_url ?? progress.evidence_url;
      tasksMap[taskId] = progress;
      localStorage.setItem(this.getStorageKey(userId, `tasks_${dayId}`), JSON.stringify(tasksMap));
    }

    return progress;
  }

  private static async getDayProgressUnlocked(userId: string = 'local_user', dayId: string): Promise<UserDayProgress | null> {
    this.recoverCompletion(userId);
    const supabase = userId === 'local_user' ? null : createClient();
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

  /** Save a reflection without changing completion, task evidence, or the current lesson. */
  private static async updateDayNotesUnlocked(userId:string='local_user',dayId:string,notes:string):Promise<UserDayProgress> {
    if(!LEARNING_DAYS.some(day=>day.id===dayId))throw new Error('Unknown lesson.');
    this.recoverCompletion(userId);
    if(typeof localStorage==='undefined')throw new Error('Browser storage is unavailable.');
    const key=this.getStorageKey(userId,`day_${dayId}`);
    const current=JSON.parse(localStorage.getItem(key)||'null') as UserDayProgress|null;
    const updated:UserDayProgress={user_id:userId,learning_day_id:dayId,state:'in_progress',time_spent_minutes:0,...current,notes};
    localStorage.setItem(key,JSON.stringify(updated));
    return updated;
  }

  // ----------------------------------------------------------------------------
  // 3. Atomic finishLearningDay Transaction
  // ----------------------------------------------------------------------------
  private static completionRequests = new Map<string, Promise<{success:boolean; error?:string; remaining_count?:number; next_day_sequence?:number}>>();

  // Stable local operation identity deduplicates double clicks and overlapping callers.
  // Persisted day completion remains the guard for later retries.
  static finishLearningDay(userId: string = 'local_user', dayId: string) {
    const key = JSON.stringify([this.getStorageKey(userId, 'profile'), dayId]);
    const pending = this.completionRequests.get(key);
    if (pending) return pending;
    const request = this.runOperation(userId,()=>this.completeLearningDay(userId, dayId),true).finally(() => this.completionRequests.delete(key));
    this.completionRequests.set(key, request);
    return request;
  }

  private static async completeLearningDay(userId: string = 'local_user', dayId: string): Promise<{
    success: boolean;
    error?: string;
    remaining_count?: number;
    next_day_sequence?: number;
  }> {
    const day = LEARNING_DAYS.find(d => d.id === dayId);
    if (!day) {
      return { success: false, error: 'invalid_day' };
    }

    const workspace = this.getStorageKey(userId, 'profile');
    const revision = userId==='local_user'?lessonDraftRevision():null;
    let profile = await this.getProfileUnlocked(userId);
    const previous = await this.getDayProgressUnlocked(userId, dayId);
    if (previous?.state !== 'completed' && day.sequence_index !== profile.active_day_index) {
      return { success: false, error: 'out_of_sequence' };
    }
    if (previous?.state !== 'completed' && profile.preferred_mode === 'maintenance') {
      return { success: false, error: 'maintenance_mode' };
    }
    const taskMap = await this.getDayTaskProgressesUnlocked(userId, dayId);
    const requiredTasks = day.tasks.filter(t => t.required);
    const incompleteTasks = requiredTasks.filter(t => taskMap[t.id]?.status !== 'completed');

    // Strict validation: must NOT silently advance if mandatory tasks are incomplete
    if (previous?.state !== 'completed' && incompleteTasks.length > 0) {
      return {
        success: false,
        error: 'incomplete_required_tasks',
        remaining_count: incompleteTasks.length
      };
    }

    const supabase = userId === 'local_user' ? null : createClient();
    if (supabase) {
      const { data, error } = await supabase.rpc('finish_learning_day', { p_day_id: dayId });
      if (data && !error) {
        return data as { success: boolean; error?: string; remaining_count?: number; next_day_sequence?: number };
      }
    }

    const guidance = STUDY_GUIDANCE[day.sequence_index] ?? EXPANDED_RECALL[day.sequence_index];
    if (workspace !== this.getStorageKey(userId, 'profile') || userId==='local_user'&&(revision===null||revision!==lessonDraftRevision())) throw new Error('Workspace changed before completing the lesson.');
    // Preserve preferences/recall edits saved during asynchronous task validation.
    if(typeof localStorage!=='undefined'){
      const raw=localStorage.getItem(this.getStorageKey(userId,'profile'));
      if(raw)profile=JSON.parse(raw) as UserProfile;
    }
    if(previous?.state!=='completed'&&day.sequence_index!==profile.active_day_index)return {success:false,error:'out_of_sequence'};
    if(previous?.state!=='completed'&&profile.preferred_mode==='maintenance')return {success:false,error:'maintenance_mode'};
    const nextSeq = Math.max(profile.active_day_index, day.sequence_index + 1);
    const step=recallStep(profile);
    const nextRecallStep=previous?.state==='completed'?Math.max(step,nextSeq):step+1;
    const moduleId = day.tasks.find(t => t.module_id)?.module_id;
    const reviewsKey=this.getStorageKey(userId,'reviews');
    const reviews:ConceptReview[]=typeof localStorage!=='undefined'?JSON.parse(localStorage.getItem(reviewsKey)||'[]'):[];
    const review=guidance&&moduleId?this.initialReview(userId,moduleId,guidance.prompt,guidance.answer,previous?.state==='completed'?day.sequence_index:step):null;
    const missingReview=review&&!reviews.some(item=>item.id===review.id);
    if(previous?.state==='completed'&&nextSeq===profile.active_day_index&&!missingReview)return {success:true,next_day_sequence:nextSeq};
    if(missingReview)reviews.push(review!);
    const latest=typeof localStorage!=='undefined'?JSON.parse(localStorage.getItem(this.getStorageKey(userId,`day_${dayId}`))||'null') as UserDayProgress|null:null;
    const dayProgress:UserDayProgress=latest??previous??{user_id:userId,learning_day_id:dayId,state:'completed',completed_at:new Date().toISOString(),time_spent_minutes:day.estimated_minutes};
    if(typeof localStorage!=='undefined'){
      const records={
        [this.getStorageKey(userId,'profile')]:JSON.stringify({...profile,active_day_index:nextSeq,recall_step:nextRecallStep,updated_at:new Date().toISOString()}),
        [reviewsKey]:JSON.stringify(reviews),
        [this.getStorageKey(userId,`day_${dayId}`)]:JSON.stringify({...dayProgress,state:'completed',completed_at:dayProgress.completed_at||new Date().toISOString()}),
      };
      localStorage.setItem(this.getStorageKey(userId,'completion_journal'),JSON.stringify({version:1,dayId,records}));
      this.recoverCompletion(userId);
    }
    if(typeof window!=='undefined')window.dispatchEvent(new Event('foundation-progress'));

    return {
      success: true,
      next_day_sequence: nextSeq
    };
  }

  // ----------------------------------------------------------------------------
  // 4. Spaced Repetition Review System (+1, +3, +7, +21, +45 day offsets)
  // ----------------------------------------------------------------------------
  private static initialReview(userId:string,moduleId:string,prompt:string,answer:string,currentSeq:number):ConceptReview {
    return {
      id: `rev_${moduleId}_${encodeURIComponent(prompt)}`,
      user_id: userId,
      module_id: moduleId,
      concept_prompt: prompt,
      concept_answer: answer,
      last_day_index: currentSeq,
      next_due_day_index: currentSeq + 1, // First review due at Day + 1
      interval_step: 1,
      latest_confidence: 'needs_work'
    };
  }

  private static async scheduleReviewUnlocked(
    userId: string,
    moduleId: string,
    prompt: string,
    answer: string,
    currentSeq: number
  ): Promise<void> {
    this.recoverCompletion(userId);
    const review=this.initialReview(userId,moduleId,prompt,answer,currentSeq);

    const supabase = userId === 'local_user' ? null : createClient();
    if (supabase) {
      await supabase.from('concept_reviews').upsert(review);
    }

    if (typeof localStorage !== 'undefined') {
      const key = this.getStorageKey(userId, 'reviews');
      const stored = localStorage.getItem(key);
      const list: ConceptReview[] = stored ? JSON.parse(stored) : [];
      if (list.some(r => r.id === review.id)) return;
      const filtered = list;
      filtered.push(review);
      localStorage.setItem(key, JSON.stringify(filtered));
    }
  }

  private static async getDueReviewsUnlocked(userId: string = 'local_user', activeDayIndex: number): Promise<ConceptReview[]> {
    this.recoverCompletion(userId);
    this.recoverCompletion(userId);
    const supabase = userId === 'local_user' ? null : createClient();
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

    return [];
  }

  private static async recordReviewAttemptUnlocked(
    userId: string = 'local_user',
    reviewId: string,
    rating: 'needs_work' | 'stable'
  ): Promise<void> {
    const INTERVAL_STEPS = REVIEW_OFFSETS;
    const profile = await this.getProfileUnlocked(userId);

    if (typeof localStorage !== 'undefined') {
      const key = this.getStorageKey(userId, 'reviews');
      const stored = localStorage.getItem(key);
      if (stored) {
        const list: ConceptReview[] = JSON.parse(stored);
        const item = list.find(r => r.id === reviewId);
        if (item) {
          item.latest_confidence = rating;
          item.last_day_index = recallStep(profile);
          if (rating === 'stable') {
            const nextStepIndex = Math.min(item.interval_step, INTERVAL_STEPS.length - 1);
            const offset = INTERVAL_STEPS[nextStepIndex];
            item.next_due_day_index = item.last_day_index + offset;
            item.interval_step = Math.min(item.interval_step + 1, INTERVAL_STEPS.length);
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

  /** Explicitly bring forward the next set; never changes lesson position or ratings. */
  private static async startNextRecallSessionUnlocked(userId:string='local_user') {
    const profile=await this.getProfileUnlocked(userId);
    const step=recallStep(profile);
    const reviews=await this.getDueReviewsUnlocked(userId,Number.MAX_SAFE_INTEGER);
    if(reviews.some(review=>review.next_due_day_index<=step))return {advanced:false,step};
    const next=Math.min(...reviews.map(review=>review.next_due_day_index));
    if(!Number.isFinite(next))return {advanced:false,step};
    await this.updateProfileUnlocked(userId,{recall_step:next});
    return {advanced:true,step:next};
  }

  // ----------------------------------------------------------------------------
  // 5. Job Application CRM Pipeline
  // ----------------------------------------------------------------------------
  private static async getApplicationsUnlocked(userId: string = 'local_user'): Promise<JobApplication[]> {
    this.recoverCompletion(userId);
    const supabase = userId === 'local_user' ? null : createClient();
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

    return [];
  }

  private static async saveApplicationUnlocked(
    userId: string = 'local_user',
    app: Omit<JobApplication, 'id' | 'user_id' | 'created_at' | 'updated_at'> & { id?: string }
  ): Promise<JobApplication> {
    const existingList = await this.getApplicationsUnlocked(userId);
    const id = app.id || `app_${Date.now()}`;
    const now = new Date().toISOString();

    const fullApp: JobApplication = {
      ...app,
      id,
      user_id: userId,
      created_at: existingList.find(a => a.id === id)?.created_at ?? now,
      updated_at: now
    };

    const supabase = userId === 'local_user' ? null : createClient();
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

  private static async deleteApplicationUnlocked(userId: string = 'local_user', appId: string): Promise<void> {
    const supabase = userId === 'local_user' ? null : createClient();
    if (supabase) {
      await supabase.from('applications').delete().eq('id', appId).eq('user_id', userId);
    }

    if (typeof localStorage !== 'undefined') {
      const existingList = await this.getApplicationsUnlocked(userId);
      const filtered = existingList.filter(a => a.id !== appId);
      localStorage.setItem(this.getStorageKey(userId, 'applications'), JSON.stringify(filtered));
    }
  }

  // ----------------------------------------------------------------------------
  // 6. Phase Gates & Readiness Verification
  // ----------------------------------------------------------------------------
  private static async getGateAttemptUnlocked(userId: string = 'local_user', phaseId: string): Promise<GateAttempt | null> {
    this.recoverCompletion(userId);
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

  private static async recordGateAttemptUnlocked(
    userId: string = 'local_user',
    phaseId: string,
    scoreJson: Record<string, any>,
    passed: boolean,
    evidence: string
  ): Promise<GateAttempt> {
    this.recoverCompletion(userId);
    const attempt: GateAttempt = {
      id: `gate_attempt_${Date.now()}`,
      user_id: userId,
      phase_id: phaseId,
      score_json: scoreJson,
      passed,
      evidence,
      created_at: new Date().toISOString()
    };

    const supabase = userId === 'local_user' ? null : createClient();
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
  private static async exportUserDataUnlocked(userId: string = 'local_user'): Promise<string> {
    const profile = await this.getProfileUnlocked(userId);
    const applications = await this.getApplicationsUnlocked(userId);

    const local_records: Record<string, string> = {};
    if (typeof localStorage !== 'undefined') {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && this.ownsLocalKey(userId, key)) {
          const portable = userId === 'local_user' ? portableStorageKey(key)! : key;
          local_records[portable] = localStorage.getItem(key)!;
        }
      }
    }
    const exportBundle = {
      format_version: 1,
      storage_mode: 'local',
      local_records,
      exported_at: new Date().toISOString(),
      profile,
      applications
    };

    return JSON.stringify(exportBundle, null, 2);
  }

  private static async clearAllUserDataUnlocked(userId: string = 'local_user'): Promise<void> {
    if(userId==='local_user'&&typeof localStorage!=='undefined')localStorage.removeItem(studyRestoreJournalKey());
    if(typeof localStorage!=='undefined'){localStorage.removeItem(this.getStorageKey(userId,'completion_journal'));if(userId==='local_user')localStorage.removeItem(workspaceStorageKey('gradient_backup_checkpoint'));}
    if (typeof localStorage !== 'undefined') {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && this.ownsLocalKey(userId, key)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      if(userId==='local_user'){localStorage.setItem(lessonDraftRevisionKey(),newLessonDraftRevision());clearLessonDrafts();}
    }
  }

  // Public boundaries acquire one account-scoped cross-tab lock. Internal calls
  // use the unlocked methods to avoid recursive-lock deadlocks.
  private static runOperation<T>(userId:string, operation:()=>Promise<T>, writing=false):Promise<T>{
    const profileKey=this.getStorageKey(userId,'profile');
    const revision=userId==='local_user'?lessonDraftRevision():null;
    return withStudyLock(profileKey,()=>{
      if(profileKey!==this.getStorageKey(userId,'profile')||writing&&userId==='local_user'&&(revision===null||revision!==lessonDraftRevision()))throw new Error('Workspace changed before the operation could run.');
      if(userId==='local_user'&&typeof localStorage!=='undefined')assertNoPendingStudyRestore(localStorage);
      return operation();
    });
  }
  /** Read the library under one account lock rather than queueing one lock per lesson. */
  static getStudySnapshot(){
    const workspace=this.getStorageKey('local_user','profile');
    return this.runOperation('local_user',async()=>{
      const profile=await this.getProfileUnlocked();
      if(workspace!==this.getStorageKey('local_user','profile'))throw new Error('Workspace changed before reading progress.');
      const completedIds:string[]=[];
      if(typeof localStorage!=='undefined'){
        for(const day of LEARNING_DAYS){
          const raw=localStorage.getItem(this.getStorageKey('local_user',`day_${day.id}`));
          if(raw){
            try{
              const record=JSON.parse(raw);
              if(record?.state==='completed'&&record.learning_day_id===day.id&&record.user_id==='local_user')completedIds.push(day.id);
            }catch{/* Malformed records are retained and not counted. */}
          }
        }
      }
      return {profile,completedIds};
    });
  }
  /** Keep evidence in the existing scoped profile so export, restore, and reset cover it. */
  static savePracticeAction(action: PracticeAction) {
    return this.runOperation('local_user', async () => {
      const key = this.getStorageKey('local_user', 'profile');
      const revision = lessonDraftRevision();
      const profile = await this.getProfileUnlocked();
      if (key !== this.getStorageKey('local_user', 'profile') || revision === null || revision !== lessonDraftRevision()) {
        throw new Error('Workspace changed before saving practice.');
      }
      const current = profile.practice_evidence === undefined ? emptyEvidence : practiceEvidenceSchema.parse(profile.practice_evidence);
      const next = applyPracticeAction(current, action, Date.now());
      if (next !== current) await this.updateProfileUnlocked('local_user', { practice_evidence: practiceEvidenceSchema.parse(next) });
      return next;
    }, true);
  }
  static getProfile(...args:Parameters<typeof ProgressRepository.getProfileUnlocked>):ReturnType<typeof ProgressRepository.getProfileUnlocked>{return this.runOperation(args[0]??'local_user',()=>this.getProfileUnlocked(...args),false);}
  static updateProfile(...args:Parameters<typeof ProgressRepository.updateProfileUnlocked>):ReturnType<typeof ProgressRepository.updateProfileUnlocked>{return this.runOperation(args[0]??'local_user',()=>this.updateProfileUnlocked(...args),true);}
  static setCourseInterest(...args:Parameters<typeof ProgressRepository.setCourseInterestUnlocked>):ReturnType<typeof ProgressRepository.setCourseInterestUnlocked>{return this.runOperation(args[0]??'local_user',()=>this.setCourseInterestUnlocked(...args),true);}
  static getDayTaskProgresses(...args:Parameters<typeof ProgressRepository.getDayTaskProgressesUnlocked>):ReturnType<typeof ProgressRepository.getDayTaskProgressesUnlocked>{return this.runOperation(args[0]??'local_user',()=>this.getDayTaskProgressesUnlocked(...args),false);}
  static updateTaskProgress(...args:Parameters<typeof ProgressRepository.updateTaskProgressUnlocked>):ReturnType<typeof ProgressRepository.updateTaskProgressUnlocked>{return this.runOperation(args[0]??'local_user',()=>this.updateTaskProgressUnlocked(...args),true);}
  static getDayProgress(...args:Parameters<typeof ProgressRepository.getDayProgressUnlocked>):ReturnType<typeof ProgressRepository.getDayProgressUnlocked>{return this.runOperation(args[0]??'local_user',()=>this.getDayProgressUnlocked(...args),false);}
  static updateDayNotes(...args:Parameters<typeof ProgressRepository.updateDayNotesUnlocked>):ReturnType<typeof ProgressRepository.updateDayNotesUnlocked>{return this.runOperation(args[0]??'local_user',()=>this.updateDayNotesUnlocked(...args),true);}
  static scheduleReview(...args:Parameters<typeof ProgressRepository.scheduleReviewUnlocked>):ReturnType<typeof ProgressRepository.scheduleReviewUnlocked>{return this.runOperation(args[0]??'local_user',()=>this.scheduleReviewUnlocked(...args),true);}
  static getDueReviews(...args:Parameters<typeof ProgressRepository.getDueReviewsUnlocked>):ReturnType<typeof ProgressRepository.getDueReviewsUnlocked>{return this.runOperation(args[0]??'local_user',()=>this.getDueReviewsUnlocked(...args),false);}
  static recordReviewAttempt(...args:Parameters<typeof ProgressRepository.recordReviewAttemptUnlocked>):ReturnType<typeof ProgressRepository.recordReviewAttemptUnlocked>{return this.runOperation(args[0]??'local_user',()=>this.recordReviewAttemptUnlocked(...args),true);}
  static startNextRecallSession(...args:Parameters<typeof ProgressRepository.startNextRecallSessionUnlocked>):ReturnType<typeof ProgressRepository.startNextRecallSessionUnlocked>{return this.runOperation(args[0]??'local_user',()=>this.startNextRecallSessionUnlocked(...args),true);}
  static getApplications(...args:Parameters<typeof ProgressRepository.getApplicationsUnlocked>):ReturnType<typeof ProgressRepository.getApplicationsUnlocked>{return this.runOperation(args[0]??'local_user',()=>this.getApplicationsUnlocked(...args),false);}
  static saveApplication(...args:Parameters<typeof ProgressRepository.saveApplicationUnlocked>):ReturnType<typeof ProgressRepository.saveApplicationUnlocked>{return this.runOperation(args[0]??'local_user',()=>this.saveApplicationUnlocked(...args),true);}
  static deleteApplication(...args:Parameters<typeof ProgressRepository.deleteApplicationUnlocked>):ReturnType<typeof ProgressRepository.deleteApplicationUnlocked>{return this.runOperation(args[0]??'local_user',()=>this.deleteApplicationUnlocked(...args),true);}
  static getGateAttempt(...args:Parameters<typeof ProgressRepository.getGateAttemptUnlocked>):ReturnType<typeof ProgressRepository.getGateAttemptUnlocked>{return this.runOperation(args[0]??'local_user',()=>this.getGateAttemptUnlocked(...args),false);}
  static recordGateAttempt(...args:Parameters<typeof ProgressRepository.recordGateAttemptUnlocked>):ReturnType<typeof ProgressRepository.recordGateAttemptUnlocked>{return this.runOperation(args[0]??'local_user',()=>this.recordGateAttemptUnlocked(...args),true);}
  static exportUserData(...args:Parameters<typeof ProgressRepository.exportUserDataUnlocked>):ReturnType<typeof ProgressRepository.exportUserDataUnlocked>{return this.runOperation(args[0]??'local_user',()=>this.exportUserDataUnlocked(...args),false);}
  static clearAllUserData(...args:Parameters<typeof ProgressRepository.clearAllUserDataUnlocked>):ReturnType<typeof ProgressRepository.clearAllUserDataUnlocked>{return this.runOperation(args[0]??'local_user',()=>this.clearAllUserDataUnlocked(...args),true);}
}
