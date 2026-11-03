const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/** Owns exactly one RAF chain; reduced scenes render only on invalidation. */
export function createMotionLoop(render: (now: number, reduced: boolean) => void | false) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  let pending: number | null = null;
  let generation = 0;
  let disposed = false;
  let completed = false;
  let available = true;

  const canRender = () => !disposed && !completed && available && !document.hidden;
  const cancel = () => {
    generation++;
    if (pending !== null) cancelAnimationFrame(pending);
    pending = null;
  };
  const draw = (now: number) => {
    if (render(now, media.matches) === false) {
      completed = true;
      cancel();
    }
  };
  const schedule = () => {
    if (!canRender() || media.matches || pending !== null) return;
    const ticket = generation;
    pending = requestAnimationFrame(now => {
      if (ticket !== generation || !canRender()) return;
      pending = null;
      draw(now);
      schedule();
    });
  };
  const invalidate = () => {
    if (!canRender()) return;
    if (media.matches) draw(performance.now());
    else schedule();
  };
  const reconcile = () => {
    if (!canRender() || media.matches) cancel();
    invalidate();
  };

  media.addEventListener('change', reconcile);
  document.addEventListener('visibilitychange', reconcile);
  reconcile();

  return {
    invalidate,
    setAvailable(value: boolean) {
      available = value;
      reconcile();
    },
    dispose() {
      disposed = true;
      cancel();
      media.removeEventListener('change', reconcile);
      document.removeEventListener('visibilitychange', reconcile);
    }
  };
}

/** Animation and fallback share one completion gate, independent of RAF visibility. */
export function createLoaderExit(onExited: () => void) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  let done = false;
  let timer: ReturnType<typeof setTimeout>;
  const dispose = () => {
    done = true;
    clearTimeout(timer);
    media.removeEventListener('change', onMotionChange);
  };
  const finish = () => {
    if (done) return;
    dispose();
    onExited();
  };
  const onMotionChange = () => {
    if (!done && media.matches) {
      clearTimeout(timer);
      timer = setTimeout(finish, 0);
    }
  };
  timer = setTimeout(finish, media.matches ? 0 : 910);
  media.addEventListener('change', onMotionChange);
  return { finish, dispose };
}
