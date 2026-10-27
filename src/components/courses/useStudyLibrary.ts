'use client';
import { useEffect, useSyncExternalStore } from 'react';
import { LEARNING_DAYS } from '@/lib/db/curriculum-data';
import { ProgressRepository } from '@/lib/db/progress-repository';
import { createStaleResource } from '@/lib/db/stale-resource';

// Populated only by client effects. Server rendering always uses the empty snapshot.
const library = createStaleResource({ activeSequence: 1, completedIds: [] as string[] }, async () => {
  const [profile, records] = await Promise.all([
    ProgressRepository.getProfile(),
    Promise.all(LEARNING_DAYS.map(day => ProgressRepository.getDayProgress('local_user', day.id))),
  ]);
  return { activeSequence: profile.active_day_index,
    completedIds: records.filter(record => record?.state === 'completed').map(record => record!.learning_day_id) };
});

export function useStudyLibrary() {
  const state = useSyncExternalStore(library.subscribe, library.getSnapshot, library.getServerSnapshot);
  useEffect(() => {
    const refresh = () => { void library.refresh(); };
    const onStorage = (event: StorageEvent) => { if (!event.key || event.key.startsWith('foundation_')) refresh(); };
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
