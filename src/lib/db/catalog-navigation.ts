const filters = ['all', 'guided', 'remaining', 'completed'] as const;

function catalogParams(query: string, filter: string, prefix: 'catalog' | '') {
  const params = new URLSearchParams();
  if (query) params.set(prefix ? 'catalogQ' : 'q', query);
  if (filter !== 'all' && filters.some(value => value === filter)) {
    params.set(prefix ? 'catalogFilter' : 'filter', filter);
  }
  return params.size ? `?${params}` : '';
}

export function subjectHref(id: string, query: string, filter: string) {
  return `/app/subjects/${encodeURIComponent(id.toLowerCase())}${catalogParams(query, filter, 'catalog')}`;
}

export function catalogHref(search: string) {
  const params = new URLSearchParams(search);
  return `/app/subjects${catalogParams(params.get('catalogQ') ?? '', params.get('catalogFilter') ?? 'all', '')}`;
}
