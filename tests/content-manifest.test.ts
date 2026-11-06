import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { validateManifest } from '../src/lib/content/manifest';
import { pilotInput, pilotManifest } from '../src/lib/content/pilot';
import { legacyMapping } from '../src/lib/content/legacy';

describe('Gradient 2.0 pilot', () => {
  it('validates the draft lessons and fixture paths without publishing them', () => {
    expect(pilotManifest.lessons).toHaveLength(3);
    expect(pilotManifest.lessons.every(lesson => lesson.status === 'draft')).toBe(true);
    expect(pilotManifest.exercises.every(exercise => existsSync('tests/fixtures/content/' + exercise.fixture))).toBe(true);
  });
  it('rejects cycles, orphan prerequisites and duplicate IDs', () => {
    const cycle = structuredClone(pilotInput);
    cycle.skills[0].prerequisites = ['DSA-03'];
    expect(() => validateManifest(cycle)).toThrow(/cycle/);
    cycle.skills[0].prerequisites = ['MISSING-SKILL'];
    expect(() => validateManifest(cycle)).toThrow(/reference/);
    expect(() => validateManifest({ ...pilotInput, lessons: [...pilotInput.lessons, pilotInput.lessons[0]] })).toThrow(/Duplicate/);
  });
  it('blocks unreviewed publication and wrong assessment links', () => {
    const draft = structuredClone(pilotInput);
    draft.lessons[0].status = 'published';
    expect(() => validateManifest(draft)).toThrow(/Missing lesson review/);
    draft.lessons[0].status = 'draft';
    draft.lessons[0].exerciseIds = ['EX-DSA-BOUNDARY'];
    expect(() => validateManifest(draft)).toThrow(/does not assess/);
  });
  it('maps every existing route without moving any legacy progress cursor', () => {
    const rows = legacyMapping();
    expect(new Set(rows.map(row => row.lessonId)).size).toBe(136);
    expect(rows.map(row => row.sequence).sort((a,b) => a-b)).toEqual(Array.from({length:136}, (_,i) => i+1));
    expect(rows.find(row => row.lessonId === 'P0-D01')?.route).toBe('/app/learn/P0/P0-D01');
    expect(rows.every(row => row.relation === 'unreviewed')).toBe(true);
  });
});
