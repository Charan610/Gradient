import {workspaceStorageKey,portableStorageKey} from '@/lib/account/workspace';
import { z } from 'zod';

const text = z.string();
const integer = z.number().int().nonnegative();
const user = z.literal('local_user');
const profile = z.object({
  user_id: user, alias: text, academic_semester: text, target_role: text,
  preferred_daily_minutes: z.number().positive().max(1440),
  preferred_mode: z.enum(['light', 'normal', 'deep', 'maintenance']),
  theme: z.enum(['light', 'dark', 'system']), onboarding_status: z.enum(['pending', 'completed']),
  active_day_index: z.number().int().positive(),
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
  last_day_index: integer, next_due_day_index: integer, interval_step: integer.max(4),
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
    if (!schema || !schema.safeParse(JSON.parse(raw)).success) throw new Error('Backup contains an unsupported or invalid study record.');
    records[key] = raw;
  }
  // A fresh workspace export may only have the top-level default profile.
  records[`${prefix}profile`] ??= JSON.stringify(bundle.data.profile);
  return records;
}

/** Replace study records only; roll back on quota/write failure. */
export function restoreStudyBackup(source: string, storage: Storage): number {
  const records = Object.fromEntries(Object.entries(parseStudyBackup(source)).map(([key,value])=>[workspaceStorageKey(key),value]));
  const previous = new Map<string, string>();
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i)!;
    const portable = portableStorageKey(key); if (!portable) continue;
    const suffix = portable.startsWith(prefix) ? portable.slice(prefix.length) : '';
    if (portable.startsWith('foundation_proj_') || ['profile', 'reviews', 'applications'].includes(suffix) || /^(tasks|day)_P\d+-D\d+$/.test(suffix) || /^gate_P\d+$/.test(suffix)) previous.set(key, storage.getItem(key)!);
  }
  const touched = new Set([...previous.keys(), ...Object.keys(records)]);
  try {
    previous.forEach((_, key) => storage.removeItem(key));
    Object.entries(records).forEach(([key, value]) => storage.setItem(key, value));
  } catch (error) {
    touched.forEach(key => storage.removeItem(key));
    previous.forEach((value, key) => storage.setItem(key, value));
    throw error;
  }
  return Object.keys(records).length;
}
