import { existsSync } from 'node:fs';
import { expect, it } from 'vitest';
import { engineeringManifest } from '../src/lib/content/engineering-batches';
import { foundationsManifest } from '../src/lib/content/foundations';

it('extends the curriculum with five fixture-backed drafts without changing existing units', () => {
  expect(engineeringManifest.lessons.slice(0, foundationsManifest.lessons.length)).toEqual(foundationsManifest.lessons);
  const batch = engineeringManifest.lessons.slice(foundationsManifest.lessons.length);
  expect(batch).toHaveLength(5);
  for (const unit of batch) {
    expect(unit.status).toBe('draft');
    const exercise = engineeringManifest.exercises.find(item => item.id === unit.exerciseIds[0]);
    expect(exercise && existsSync('tests/fixtures/content/' + exercise.fixture)).toBe(true);
  }
});
