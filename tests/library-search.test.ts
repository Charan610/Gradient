import { describe, expect, it } from 'vitest';
import { searchLibrary } from '../src/lib/db/library-search';
import {COURSE_GUIDES} from '../src/lib/db/course-guides';
import {COURSE_INDEX} from '../src/lib/db/course-index';

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
  it('keeps the lightweight index and searchable course destinations identical to the catalog',()=>{
    expect(COURSE_INDEX).toEqual(COURSE_GUIDES.map(({id,title})=>({id,title})));
    for(const course of COURSE_INDEX)expect(searchLibrary(course.title)).toContainEqual({id:`course-${course.id}`,title:course.title,href:`/app/subjects/${course.id.toLowerCase()}`,kind:'Course'});
  });
});
