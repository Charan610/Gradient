import { describe, expect, it } from 'vitest';
import { searchLibrary } from '../src/lib/db/library-search';

describe('Workspace search', () => {
  it('finds lesson codes without unrelated quick actions taking the result slots', () => {
    expect(searchLibrary('p0-d06').map(item => item.href)).toEqual(['/app/learn/P0/P0-D06']);
  });
  it('returns an empty result for an unknown phrase', () => {
    expect(searchLibrary('zxqv-no-such-topic')).toEqual([]);
  });
  it('includes the course collection when no query is entered', () => {
    expect(searchLibrary('').some(item => item.href === '/app/subjects')).toBe(true);
  });
});
