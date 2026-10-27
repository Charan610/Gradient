import { flushSync } from 'react-dom';

type Transition = { skipTransition: () => void; finished: Promise<void>; ready: Promise<void> };
let current: Transition | undefined;
/** Enhancement only: unsupported browsers and reduced-motion users update immediately. */
export function transitionView(update: () => void) {
  const doc = document as Document & { startViewTransition?: (callback: () => void) => Transition };
  current?.skipTransition();
  if (!doc.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { update(); return; }
  const transition = doc.startViewTransition(() => flushSync(update));
  current = transition;
  void transition.ready.catch(() => {});
  void transition.finished.catch(() => {}).finally(() => { if (current === transition) current = undefined; });
}
