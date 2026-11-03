import {withStudyLock} from './study-lock';
import {beginStudyRestore,recoverStudyRestore,finishStudyRestore} from './restore-recovery';
import {lessonDraftRevisionKey,newLessonDraftRevision,clearLessonDrafts} from './lesson-drafts';
import {workspaceStorageKey,portableStorageKey} from '@/lib/account/workspace';
import { z } from 'zod';
import {REVIEW_OFFSETS} from './review-schedule';

const text = z.string();
const integer = z.number().int().nonnegative();
const user = z.literal('local_user');
const profile = z.object({
  user_id: user, alias: text, academic_semester: text, target_role: text,
  preferred_daily_minutes: z.number().positive().max(1440),
  preferred_mode: z.enum(['light', 'normal', 'deep', 'maintenance']),
  theme: z.enum(['light', 'dark', 'system']), onboarding_status: z.enum(['pending', 'completed']),
  active_day_index: z.number().int().positive(),
  recall_step:z.number().int().positive().optional(),
  saved_course_ids:z.array(z.string()).optional(),
}).passthrough();
const task = z.object({ user_id: user, day_task_id: text,
  status: z.enum(['not_started', 'in_progress', 'completed', 'skipped_optional']),
  evidence_text: text.optional(), evidence_url: text.optional(), completed_at: text.optional(),
}).passthrough();
const day = z.object({ user_id: user, learning_day_id: text,
  state: z.enum(['not_started', 'in_progress', 'completed', 'skipped']), time_spent_minutes: z.number().nonnegative(),
  notes: text.optional(), completed_at: text.optional(), started_at: text.optional(),
  self_rating: z.enum(['confident', 'needs_review']).optional(),
}).passthrough();
const review = z.object({ id: text, user_id: user, module_id: text, concept_prompt: text, concept_answer: text,
  last_day_index: integer, next_due_day_index: integer, interval_step: integer.max(REVIEW_OFFSETS.length),
  latest_confidence: z.enum(['needs_work', 'stable']), mistake_tag: text.optional(),
}).passthrough();
const application = z.object({ id: text, user_id: user, company: text, role: text, location: text,
  kind: z.enum(['internship', 'full_time', 'research', 'open_source']),
  status: z.enum(['saved', 'applied', 'oa', 'interview', 'offer', 'rejected', 'withdrawn']),
  created_at: text, updated_at: text, url: text.optional(), notes: text.optional(), eligibility_note: text.optional(),
}).passthrough();
const gate = z.object({ id: text, user_id: user, phase_id: text, score_json: z.record(z.union([z.number(), z.boolean(), text])),
  passed: z.boolean(), evidence: text, created_at: text,
}).passthrough();
const project = z.object({ milestones: z.record(z.boolean()), repoUrl: text, notes: text });
const prefix = 'foundation_career_os_local_user_';
export const MAX_BACKUP_BYTES = 5 * 1024 * 1024;

/** Validate the entire backup before any browser storage is changed. */
export function parseStudyBackup(source: string): Record<string, string> {
  if (new TextEncoder().encode(source).length > MAX_BACKUP_BYTES) throw new Error('Backup must be smaller than 5 MB.');
  const bundle = z.object({ format_version: z.literal(1), storage_mode: z.literal('local'),
    local_records: z.record(text), profile,
  }).safeParse(JSON.parse(source));
  if (!bundle.success) throw new Error('Choose a version 1 study backup exported by this app.');
  const records: Record<string, string> = {};
  for (const [key, raw] of Object.entries(bundle.data.local_records)) {
    const suffix = key.startsWith(prefix) ? key.slice(prefix.length) : '';
    const schema = key.startsWith('foundation_proj_') ? project
      : suffix === 'profile' ? profile
      : suffix === 'reviews' ? z.array(review)
      : suffix === 'applications' ? z.array(application)
      : /^tasks_P\d+-D\d+$/.test(suffix) ? z.record(task)
      : /^day_P\d+-D\d+$/.test(suffix) ? day
      : /^gate_P\d+$/.test(suffix) ? gate : null;
    const parsed = schema?.safeParse(JSON.parse(raw));
    if (!parsed?.success) throw new Error('Backup contains an unsupported or invalid study record.');
    // Keep historical IDs and raw payloads, but bind records to their storage identity.
    // Curriculum membership is deliberately not required: older exports can contain
    // lessons and task IDs that are no longer in the current curriculum.
    const value = JSON.parse(raw);
    if (suffix.startsWith('day_') && value.learning_day_id !== suffix.slice(4)) {
      throw new Error('Backup day record does not match its lesson key.');
    }
    if (suffix.startsWith('tasks_')) {
      const lessonId = suffix.slice(6);
      for (const [taskId, record] of Object.entries(value)) {
        if (taskId !== (record as { day_task_id: string }).day_task_id || !taskId.startsWith(`${lessonId}-`)) {
          throw new Error('Backup task record does not match its task or lesson key.');
        }
      }
    }
    if (suffix.startsWith('gate_') && value.phase_id !== suffix.slice(5)) {
      throw new Error('Backup gate record does not match its phase key.');
    }
    if (suffix === 'reviews' || suffix === 'applications') {
      const ids = new Set<string>();
      for (const item of value as { id: string; module_id?: string }[]) {
        if (!item.id.trim() || (suffix === 'reviews' && !item.module_id?.trim()) || ids.has(item.id)) {
          throw new Error('Backup record identities must be nonempty and unique.');
        }
        ids.add(item.id);
      }
    }
    records[key] = raw;
  }
  // A fresh workspace export may only have the top-level default profile.
  records[`${prefix}profile`] ??= JSON.stringify(bundle.data.profile);
  return records;
}

/** Replace study records only; roll back on quota/write failure. */
export function restoreStudyBackup(source: string, storage: Storage): number {
  const records = Object.fromEntries(Object.entries(parseStudyBackup(source)).map(([key,value])=>[workspaceStorageKey(key),value]));
  recoverStudyRestore(storage);
  const previous = new Map<string, string>();
  const checkpointKey=workspaceStorageKey('gradient_backup_checkpoint');
  const checkpoint=storage.getItem(checkpointKey);
  if(checkpoint!==null)previous.set(checkpointKey,checkpoint);
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i)!;
    const portable = portableStorageKey(key); if (!portable) continue;
    const suffix = portable.startsWith(prefix) ? portable.slice(prefix.length) : '';
    if (portable.startsWith('foundation_proj_') || ['profile', 'reviews', 'applications', 'completion_journal'].includes(suffix) || /^(tasks|day)_P\d+-D\d+$/.test(suffix) || /^gate_P\d+$/.test(suffix)) previous.set(key, storage.getItem(key)!);
  }
  const revisionKey=lessonDraftRevisionKey();
  const oldRevision=storage.getItem(revisionKey);
  if(oldRevision!==null)previous.set(revisionKey,oldRevision);
  records[revisionKey]=newLessonDraftRevision();
  const touched = new Set([...previous.keys(), ...Object.keys(records)]);
  beginStudyRestore(storage, Object.fromEntries([...touched].map(key => [key, previous.get(key) ?? null])));
  try {
    previous.forEach((_, key) => storage.removeItem(key));
    Object.entries(records).forEach(([key, value]) => storage.setItem(key, value));
    finishStudyRestore(storage);
  } catch (error) {
    try { recoverStudyRestore(storage); } catch { /* The persisted journal allows a later read to retry. */ }
    throw error;
  }
  clearLessonDrafts();
  return Object.keys(records).length-1;
}

/** UI restore boundary: coordinate with every repository reader/writer across tabs. */
export function restoreStudyBackupSafely(source:string,storage:Storage):Promise<number>{
 const profileKey=workspaceStorageKey('foundation_career_os_local_user_profile');
 return withStudyLock(profileKey,()=>{
  if(profileKey!==workspaceStorageKey('foundation_career_os_local_user_profile'))throw new Error('Workspace changed before restoring.');
  return restoreStudyBackup(source,storage);
 },true);
}
