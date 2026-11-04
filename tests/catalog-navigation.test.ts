import { describe, expect, it } from 'vitest';
import { catalogHref, subjectHref } from '../src/lib/db/catalog-navigation';

describe('course catalog return link', () => {
  it('preserves the catalog query while lesson filters and search change independently', () => {
    const detail = new URL(subjectHref('DB', 'sql & joins', 'remaining'), 'https://example.test');
    detail.searchParams.set('q', 'left join');
    detail.searchParams.set('filter', 'completed');
    expect(detail.pathname).toBe('/app/subjects/db');
    expect(catalogHref(detail.search)).toBe('/app/subjects?q=sql+%26+joins&filter=remaining');
  });
  it('does not carry an unrecognized filter or unrelated query parameter', () => {
    expect(catalogHref('?q=local&filter=completed&catalogFilter=bogus&private=notes')).toBe('/app/subjects');
  });
});
