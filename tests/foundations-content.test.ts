import { execFileSync } from 'node:child_process';
import { expect, it } from 'vitest';
import { foundationsManifest } from '../src/lib/content/foundations';

it('keeps the reviewed-source foundations batch in draft', () => {
  const batch = foundationsManifest.lessons.filter(lesson => lesson.id.startsWith('LESSON-PY-') || lesson.id === 'LESSON-GIT-STAGED-SNAPSHOT');
  expect(batch).toHaveLength(5);
  for (const lesson of batch) {
    expect(lesson.status).toBe('draft');
    expect(lesson.review).toBeUndefined();
    expect(foundationsManifest.resources.some(resource => resource.id === lesson.resourceIds[0])).toBe(true);
  }
});

it('runs the original example and its boundary test without network dependencies', () => {
  const cwd = 'tests/fixtures/content';
  const run = (file: string) => execFileSync('python3', ['-B', file], {
    cwd, encoding: 'utf8', timeout: 10_000, stdio: ['ignore', 'pipe', 'pipe'],
  });
  expect(run('threshold.py')).toBe('3\n');
  run('test_threshold.py');
  run('test_git_snapshot.py');
  run('test_python_basics.py');
});
