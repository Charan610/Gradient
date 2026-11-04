import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { parseStudyBackup, restoreStudyBackup } from '../src/lib/db/study-backup';
import { ProgressRepository } from '../src/lib/db/progress-repository';
import { initializeWorkspace } from '../src/lib/account/workspace';

const prefix = 'foundation_career_os_local_user_';
let values: Map<string, string>;
let storage: Storage;
beforeEach(() => {
  initializeWorkspace(null);
  values = new Map();
  storage = { get length() { return values.size; }, key: i => [...values.keys()][i] ?? null,
    getItem: key => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value); },
    removeItem: key => { values.delete(key); }, clear: () => values.clear() };
  vi.stubGlobal('localStorage', storage);
});
afterEach(() => { initializeWorkspace(null); vi.unstubAllGlobals(); });
async function backup(records: Record<string, unknown>) {
  const bundle = JSON.parse(await ProgressRepository.exportUserData());
  bundle.local_records = Object.fromEntries(Object.entries(records).map(([key, value]) => [prefix + key, JSON.stringify(value)]));
  return JSON.stringify(bundle);
}
const task = (id: string) => ({ user_id: 'local_user', day_task_id: id, status: 'completed', evidence_text: 'Keep evidence' });
const day = (id: string) => ({ user_id: 'local_user', learning_day_id: id, state: 'completed', time_spent_minutes: 10 });
const review = { id: 'legacy-review-id', user_id: 'local_user', module_id: 'P0.01', concept_prompt: 'Explain?', concept_answer: 'Answer', last_day_index: 1, next_due_day_index: 2, interval_step: 1, latest_confidence: 'stable' };

for (const [name, records] of Object.entries({
  'cross-course day identity': { 'day_DB-D01': day('CS-D01') },
  'cross-course task lesson identity': { 'tasks_BE-D01': { 'AI-D01-T01': task('AI-D01-T01') } },
  'day identity': { 'day_P0-D01': day('P0-D02') },
  'task map identity': { 'tasks_P0-D01': { 'P0-D01-T1': task('P0-D01-T2') } },
  'task lesson identity': { 'tasks_P0-D01': { 'P0-D02-T1': task('P0-D02-T1') } },
  'duplicate review identity': { reviews: [review, { ...review, module_id: 'P0.02' }] },
  'gate phase identity': { gate_P0: { id: 'legacy-gate', user_id: 'local_user', phase_id: 'P2', score_json: {}, passed: true, evidence: '', created_at: '' } },
})) it(`rejects mismatched ${name} before modifying storage`, async () => {
  const source = await backup(records);
  storage.setItem(prefix + 'day_P0-D02', JSON.stringify(day('P0-D02')));
  storage.setItem('unrelated', 'keep');
  const previous = new Map(values);
  expect(() => restoreStudyBackup(source, storage)).toThrow();
  expect(values).toEqual(previous);
});

it('rejects foreign profile identity in both profile locations', async () => {
  const bundle = JSON.parse(await ProgressRepository.exportUserData());
  for (const topLevel of [true, false]) {
    const invalid = { ...bundle.profile, user_id: 'other_user' };
    const source = JSON.stringify({ ...bundle, ...(topLevel ? { profile: invalid } : { local_records: { [prefix + 'profile']: JSON.stringify(invalid) } }) });
    const previous = new Map(values);
    expect(() => restoreStudyBackup(source, storage)).toThrow();
    expect(values).toEqual(previous);
  }
});

it('preserves version 1 legacy task and review IDs, unknown historical lessons, and raw evidence', async () => {
  const source = await backup({ tasks_P0_D01: {} });
  const bundle = JSON.parse(source);
  bundle.local_records = {
    [prefix + 'tasks_P0-D01']: JSON.stringify({ 'P0-D01-T1': task('P0-D01-T1'), 'P0-D01-T02': task('P0-D01-T02') }),
    [prefix + 'day_P9-D99']: JSON.stringify(day('P9-D99')),
    [prefix + 'reviews']: JSON.stringify([review]),
  };
  const parsed = parseStudyBackup(JSON.stringify(bundle));
  for (const [key, raw] of Object.entries(bundle.local_records)) expect(parsed[key]).toBe(raw);
});

it('rolls back identity-validated records after a partial write failure', async () => {
  const source = await backup({ 'day_P0-D01': day('P0-D01'), reviews: [review] });
  storage.setItem(prefix + 'day_P0-D02', JSON.stringify(day('P0-D02')));
  storage.setItem(prefix + 'day_DB-D01', JSON.stringify(day('DB-D01')));
  const previous = new Map(values);
  const set = storage.setItem;
  let writes = 0;
  storage.setItem = (key, value) => { if (++writes === 2) throw Error('quota'); set(key, value); };
  expect(() => restoreStudyBackup(source, storage)).toThrow('quota');
  expect(values).toEqual(previous);
});
