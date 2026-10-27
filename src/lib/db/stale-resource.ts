export function createStaleResource<T>(initial: T, load: () => Promise<T>) {
  let snapshot = { data: initial, loading: true, refreshing: false, error: false };
  const serverSnapshot = snapshot;
  let pending: Promise<void> | null = null;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach(listener => listener());
  return {
    getSnapshot: () => snapshot,
    getServerSnapshot: () => serverSnapshot,
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    refresh: () => {
      if (pending) return pending;
      snapshot = { ...snapshot, refreshing: true };
      pending = Promise.resolve().then(load).then(data => {
        snapshot = { data, loading: false, refreshing: false, error: false };
      }).catch(() => {
        snapshot = { ...snapshot, loading: false, refreshing: false, error: true };
      }).finally(() => { pending = null; emit(); });
      emit();
      return pending;
    },
  };
}
