import { describe, expect, it } from 'vitest';
import { filterLessons, getLessonState } from '../src/lib/db/learning-library';
import { LEARNING_DAYS } from '../src/lib/db/curriculum-data';

describe('Learning library navigation', () => {
  it('uses saved completion rather than assuming earlier lessons are complete', () => {
    expect(getLessonState(LEARNING_DAYS[0], 5, [])).toBe('available');
    expect(getLessonState(LEARNING_DAYS[0], 5, ['P0-D01'])).toBe('completed');
    expect(getLessonState(LEARNING_DAYS[4], 5, [])).toBe('current');
    expect(getLessonState(LEARNING_DAYS[5], 5, [])).toBe('preview');
  });
  it('combines a case-insensitive topic search with a completion filter', () => {
    const found = filterLessons(LEARNING_DAYS, '  array  ', 'completed', 20, ['P0-D16', 'P0-D17']);
    expect(found.map(d => d.id)).toEqual(['P0-D16', 'P0-D17']);
    expect(filterLessons(LEARNING_DAYS, 'not a topic', 'all', 1, [])).toEqual([]);
  });
  it('finds a lesson by its stable code', () => {
    expect(filterLessons(LEARNING_DAYS, 'p0-d06', 'all', 1, []).map(d => d.id)).toEqual(['P0-D06']);
  });
});
