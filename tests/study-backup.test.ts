import { beforeEach, describe, expect, it, vi } from 'vitest';
import { parseStudyBackup, restoreStudyBackup } from '../src/lib/db/study-backup';
import { ProgressRepository } from '../src/lib/db/progress-repository';
const prefix = 'foundation_career_os_local_user_';
let entries: Map<string, string>;
let storage: Storage;
beforeEach(() => {
  entries = new Map();
  storage = {
    get length() { return entries.size; }, key: i => [...entries.keys()][i] ?? null,
    getItem: key => entries.get(key) ?? null,
    setItem: (key, value) => { entries.set(key, value); },
    removeItem: key => { entries.delete(key); }, clear: () => entries.clear(),
  };
  vi.stubGlobal('localStorage', storage);
});
describe('Study backup restore', () => {
  it('round trips actual exported progress, evidence and project notes', async () => {
    await ProgressRepository.updateProfile('local_user', { alias: 'Learner', active_day_index: 2 });
    await ProgressRepository.updateTaskProgress('local_user', 'P0-D01', 'P0-D01-T1', 'completed', 'My evidence');
    const projectKey = 'foundation_proj_PRJ1';
    storage.setItem(projectKey, JSON.stringify({ milestones: { first: true }, repoUrl: '', notes: 'Saved notes' }));
    const backup = await ProgressRepository.exportUserData();
    const original = new Map(entries);
    storage.clear();
    storage.setItem('theme', 'dark');
    storage.setItem(`${prefix}extra_profile`, 'another user');
    storage.setItem(`${prefix}reviews`, '[]');
    restoreStudyBackup(backup, storage);
    original.forEach((value, key) => expect(storage.getItem(key)).toBe(value));
    expect(storage.getItem('theme')).toBe('dark');
    expect(storage.getItem(`${prefix}extra_profile`)).toBe('another user');
    expect(storage.getItem(`${prefix}reviews`)).toBeNull();
  });
  it('supports exports from a fresh workspace', async () => {
    const backup = await ProgressRepository.exportUserData();
    restoreStudyBackup(backup, storage);
    expect(JSON.parse(storage.getItem(`${prefix}profile`)!).active_day_index).toBe(1);
  });
  it('rejects foreign keys, invalid record shapes and unsupported versions without mutations', async () => {
    const bundle = JSON.parse(await ProgressRepository.exportUserData());
    storage.setItem('theme', 'dark');
    const original = new Map(entries);
    for (const change of [
      { format_version: 2 },
      { local_records: { theme: '"light"' } },
      { local_records: { [`${prefix}reviews`]: '{"bad":true}' } },
      { local_records: { [`${prefix}profile`]: '{"alias":"Bad"}' } },
    ]) {
      expect(() => restoreStudyBackup(JSON.stringify({ ...bundle, ...change }), storage)).toThrow();
      expect(entries).toEqual(original);
    }
    expect(() => parseStudyBackup('not json')).toThrow();
  });
  it('rolls back a partial write if browser quota is exceeded', async () => {
    await ProgressRepository.updateProfile('local_user', { alias: 'Backup' });
    storage.setItem(`${prefix}reviews`, '[]');
    const backup = await ProgressRepository.exportUserData();
    storage.clear();
    await ProgressRepository.updateProfile('local_user', { alias: 'Original' });
    const original = new Map(entries);
    const set = storage.setItem;
    let writes = 0;
    storage.setItem = (key, value) => {
      if (++writes === 2) throw new Error('Quota exceeded');
      set(key, value);
    };
    expect(() => restoreStudyBackup(backup, storage)).toThrow('Quota exceeded');
    expect(entries).toEqual(original);
  });
});
