import { workspaceStorageKey } from '@/lib/account/workspace';

const prefix = 'foundation_career_os_local_user_';
function restoreScope(scope?: string): string {
  const resolved = scope ?? workspaceStorageKey('');
  if (resolved !== '' && !/^gradient_workspace_[a-zA-Z0-9_-]{1,128}_$/.test(resolved)) throw Error('Invalid study restore scope.');
  return resolved;
}
export const studyRestoreJournalKey = (scope?: string) => `${restoreScope(scope)}gradient_restore_journal`;

function allowedKey(key: string, scope: string): boolean {
  if (!key.startsWith(scope)) return false;
  const portable = key.slice(scope.length);
  if (!portable || portable.startsWith('gradient_workspace_')) return false;
  if (['gradient_notes_revision', 'gradient_backup_checkpoint'].includes(portable)) return true;
  if (/^foundation_proj_.+$/.test(portable)) return true;
  if (!portable.startsWith(prefix)) return false;
  const suffix = portable.slice(prefix.length);
  return ['profile', 'reviews', 'applications', 'completion_journal'].includes(suffix)
    || /^(tasks|day)_P\d+-D\d+$/.test(suffix) || /^gate_P\d+$/.test(suffix);
}

function validateJournal(value: unknown, scope: string): Record<string, string | null> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error('Invalid study restore journal.');
  const journal = value as { version?: unknown; before?: unknown };
  if (journal.version !== 1 || !journal.before || typeof journal.before !== 'object' || Array.isArray(journal.before)) throw Error('Invalid study restore journal.');
  const entries = Object.entries(journal.before);
  if (!entries.length || entries.some(([key, raw]) => !allowedKey(key, scope) || (raw !== null && typeof raw !== 'string'))) throw Error('Invalid study restore journal records.');
  return Object.fromEntries(entries) as Record<string, string | null>;
}

/** Persist the full undo record before any destructive operation. */
export function beginStudyRestore(storage: Storage, before: Record<string, string | null>): void {
  const journal = { version: 1, before };
  validateJournal(journal, restoreScope());
  storage.setItem(studyRestoreJournalKey(), JSON.stringify(journal));
}

/** Synchronous and retryable; a failed recovery retains the complete before image. */
export function recoverStudyRestore(storage: Storage, scope?: string): void {
  const resolved = restoreScope(scope);
  const key = studyRestoreJournalKey(resolved);
  const before = readStudyRestoreBefore(storage, resolved);
  if (before === null) return;
  // The journal is durable. Free partially restored values before rebuilding the
  // original set, which fitted alongside this journal before restore began.
  for (const target of Object.keys(before)) storage.removeItem(target);
  for (const [target, value] of Object.entries(before)) if (value !== null && storage.getItem(target) !== value) storage.setItem(target, value);
  storage.removeItem(key);
}

export function finishStudyRestore(storage: Storage): void {
  storage.removeItem(studyRestoreJournalKey());
}

/** Read the coherent original records without writes or changing workspace identity.
 * Keys are fully scoped storage keys; null means the key did not exist before restore.
 * Omitted scope uses the active workspace; '' selects legacy unscoped storage.
 */
export function readStudyRestoreBefore(storage: Storage, scope?: string): Record<string, string | null> | null {
  const resolved = restoreScope(scope);
  const raw = storage.getItem(studyRestoreJournalKey(resolved));
  return raw === null ? null : validateJournal(JSON.parse(raw), resolved);
}
