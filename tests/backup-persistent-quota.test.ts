import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { restoreStudyBackup } from '../src/lib/db/study-backup';
import { ProgressRepository } from '../src/lib/db/progress-repository';
import { initializeWorkspace } from '../src/lib/account/workspace';

let entries: Map<string, string>;
let storage: Storage;
beforeEach(() => {
  initializeWorkspace(null);
  entries = new Map();
  storage = { get length() { return entries.size; }, key: index => [...entries.keys()][index] ?? null,
    getItem: key => entries.get(key) ?? null, setItem: (key, value) => { entries.set(key, value); },
    removeItem: key => { entries.delete(key); }, clear: () => entries.clear() };
  vi.stubGlobal('localStorage', storage);
});
afterEach(() => { initializeWorkspace(null); vi.unstubAllGlobals(); });

it('retains original records when quota prevents every restore and rollback write', async () => {
  await ProgressRepository.updateProfile('local_user', { alias: 'Backup profile' });
  const source = await ProgressRepository.exportUserData();
  await ProgressRepository.updateProfile('local_user', { alias: 'Original profile' });
  storage.setItem('foundation_career_os_local_user_reviews', '[]');
  storage.setItem('unrelated', 'preserve');
  const original = new Map(entries);
  storage.setItem = () => { throw new Error('Persistent quota exceeded'); };
  expect(() => restoreStudyBackup(source, storage)).toThrow('Persistent quota exceeded');
  expect(entries).toEqual(original);
});

import { recoverStudyRestore, studyRestoreJournalKey } from '../src/lib/db/restore-recovery';

it('keeps a durable before image when writes fail persistently after deletion, and recovers later', async () => {
  await ProgressRepository.updateProfile('local_user', { alias: 'Backup' });
  const source = await ProgressRepository.exportUserData();
  await ProgressRepository.updateProfile('local_user', { alias: 'Original' });
  storage.setItem('gradient_backup_checkpoint', '5');
  storage.setItem('gradient_notes_revision', 'old-revision');
  const original = new Map(entries);
  const set = storage.setItem;
  let writes = 0;
  storage.setItem = (key, value) => { if (++writes >= 2) throw Error('Persistent quota'); set(key, value); };
  expect(() => restoreStudyBackup(source, storage)).toThrow('Persistent quota');
  expect(storage.getItem(studyRestoreJournalKey())).not.toBeNull();
  expect(() => recoverStudyRestore(storage)).toThrow('Persistent quota');
  expect(storage.getItem(studyRestoreJournalKey())).not.toBeNull();
  storage.setItem = set;
  recoverStudyRestore(storage);
  expect(entries).toEqual(original);
  recoverStudyRestore(storage);
  expect(entries).toEqual(original);
});

it('rejects a journal targeting a different account before mutating any key', () => {
  initializeWorkspace('owner');
  const foreign = 'gradient_workspace_other_foundation_career_os_local_user_profile';
  storage.setItem(foreign, 'private');
  storage.setItem(studyRestoreJournalKey(), JSON.stringify({ version: 1, before: { [foreign]: null } }));
  const original = new Map(entries);
  expect(() => recoverStudyRestore(storage)).toThrow('Invalid study restore journal');
  expect(entries).toEqual(original);
});

it('round trips version 1 profiles without equating mutable top-level and stored fields', async () => {
  await ProgressRepository.updateProfile('local_user', { alias: 'Stored legacy name' });
  const bundle = JSON.parse(await ProgressRepository.exportUserData());
  bundle.profile.alias = 'Top-level legacy name';
  delete bundle.profile.recall_step;
  delete bundle.profile.saved_course_ids;
  const raw = bundle.local_records.foundation_career_os_local_user_profile;
  restoreStudyBackup(JSON.stringify(bundle), storage);
  expect(storage.getItem('foundation_career_os_local_user_profile')).toBe(raw);
});

it('rejects duplicate application IDs before replacing saved records', async () => {
  const bundle = JSON.parse(await ProgressRepository.exportUserData());
  const application = { id: 'legacy-app-id', user_id: 'local_user', company: 'Company', role: 'Engineer', location: '', kind: 'internship', status: 'saved', created_at: '', updated_at: '' };
  bundle.local_records.foundation_career_os_local_user_applications = JSON.stringify([application, { ...application, company: 'Other company' }]);
  const original = new Map(entries);
  expect(() => restoreStudyBackup(JSON.stringify(bundle), storage)).toThrow();
  expect(entries).toEqual(original);
});

it('recovers original values even when a larger partial replacement consumes quota', () => {
  const key = 'foundation_career_os_local_user_profile';
  const second = 'foundation_career_os_local_user_reviews';
  storage.setItem(key, 'large replacement'.repeat(30));
  storage.setItem(second, '[]');
  storage.setItem(studyRestoreJournalKey(), JSON.stringify({ version: 1, before: { [key]: 'original', [second]: 'original reviews' } }));
  const set = storage.setItem;
  storage.setItem = (target, value) => {
    const total = [...entries].reduce((size, [k, v]) => size + (k === target ? 0 : v.length), 0) + value.length;
    if (total > 350) throw Error('quota');
    set(target, value);
  };
  recoverStudyRestore(storage);
  expect(storage.getItem(key)).toBe('original');
  expect(storage.getItem(second)).toBe('original reviews');
  expect(storage.getItem(studyRestoreJournalKey())).toBeNull();
});

import { readStudyRestoreBefore } from '../src/lib/db/restore-recovery';
import { workspaceStorageKey } from '../src/lib/account/workspace';

it('reads a verified account before image while writes are unavailable without switching identity', () => {
  initializeWorkspace('active');
  const scope = 'gradient_workspace_verified_';
  const before = { [scope + 'foundation_career_os_local_user_profile']: 'original profile', [scope + 'foundation_proj_old']: null };
  storage.setItem(studyRestoreJournalKey(scope), JSON.stringify({ version: 1, before }));
  const original = new Map(entries);
  storage.setItem = () => { throw Error('quota'); };
  storage.removeItem = () => { throw Error('must be read only'); };
  expect(readStudyRestoreBefore(storage, scope)).toEqual(before);
  expect(readStudyRestoreBefore(storage)).toBeNull();
  expect(workspaceStorageKey('test')).toBe('gradient_workspace_active_test');
  expect(entries).toEqual(original);
});

it('supports explicit legacy scope without consuming an active account journal', () => {
  initializeWorkspace('active');
  const before = { foundation_career_os_local_user_profile: 'legacy' };
  storage.setItem(studyRestoreJournalKey(''), JSON.stringify({ version: 1, before }));
  expect(readStudyRestoreBefore(storage, '')).toEqual(before);
  expect(readStudyRestoreBefore(storage)).toBeNull();
  recoverStudyRestore(storage, '');
  expect(storage.getItem('foundation_career_os_local_user_profile')).toBe('legacy');
  expect(workspaceStorageKey('test')).toBe('gradient_workspace_active_test');
});

it('rejects foreign entries under an explicit verified scope without writes', () => {
  const scope = 'gradient_workspace_verified_';
  storage.setItem(studyRestoreJournalKey(scope), JSON.stringify({ version: 1, before: { gradient_workspace_other_foundation_career_os_local_user_profile: 'foreign' } }));
  const original = new Map(entries);
  expect(() => readStudyRestoreBefore(storage, scope)).toThrow('Invalid study restore journal');
  expect(entries).toEqual(original);
});
