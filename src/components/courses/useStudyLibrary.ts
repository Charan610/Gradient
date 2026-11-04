'use client';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { isWorkspaceStorageEventKey } from '@/lib/account/workspace';
import { ProgressRepository } from '@/lib/db/progress-repository';
import { createStaleResource } from '@/lib/db/stale-resource';

// Populated only by client effects. Server rendering always uses the empty snapshot.
const library = createStaleResource({ activeSequence: 1, completedIds: [] as string[] }, async () => {
  const {profile,completedIds}=await ProgressRepository.getStudySnapshot();
  return {activeSequence:profile.active_day_index,completedIds};
});

export function useStudyLibrary() {
  const state = useSyncExternalStore(library.subscribe, library.getSnapshot, library.getServerSnapshot);
  useEffect(() => {
    const refresh = () => { void library.refresh(); };
    const onStorage = (event: StorageEvent) => { if (isWorkspaceStorageEventKey(event.key)) refresh(); };
    const onVisibility = () => { if (document.visibilityState === 'visible') refresh(); };
    refresh();
    window.addEventListener('focus', refresh);
    window.addEventListener('foundation-progress', refresh);
    window.addEventListener('storage', onStorage);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('foundation-progress', refresh);
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);
  return { ...state.data, loading: state.loading, refreshing: state.refreshing, error: state.error };
}

// Hydrate URL state in an effect so static rendering needs no search-param boundary.
export function useLibraryFilters<T extends string>(allowed: readonly T[]) {
  const pathname = usePathname();
  const [query, setQueryState] = useState('');
  const [filter, setFilterState] = useState<T>('all' as T);
  useEffect(() => {
    const sync = () => {
      const params = new URLSearchParams(window.location.search);
      setQueryState(params.get('q') ?? '');
      const value = params.get('filter') ?? 'all';
      setFilterState(allowed.includes(value as T) ? value as T : 'all' as T);
    };
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, [pathname, allowed]);
  const update = (key: 'q' | 'filter', value: string) => {
    // Read the current URL so consecutive existing setters compose when clearing.
    const url = new URL(window.location.href);
    if (!value || (key === 'filter' && value === 'all')) url.searchParams.delete(key);
    else url.searchParams.set(key, value);
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  };
  const setQuery = (value: string) => { setQueryState(value); update('q', value); };
  const setFilter = (value: string) => {
    const next = allowed.includes(value as T) ? value as T : 'all' as T;
    setFilterState(next); update('filter', next);
  };
  return { query, setQuery, filter, setFilter };
}
