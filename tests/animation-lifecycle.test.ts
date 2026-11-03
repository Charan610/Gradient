import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createLoaderExit, createMotionLoop } from '../src/lib/motion/animation-lifecycle';

class MotionQuery extends EventTarget {
  matches = false;
  change(matches: boolean) {
    this.matches = matches;
    this.dispatchEvent(new Event('change'));
  }
}

class Page extends EventTarget {
  hidden = false;
  hide(hidden: boolean) {
    this.hidden = hidden;
    this.dispatchEvent(new Event('visibilitychange'));
  }
}

let media: MotionQuery;
let page: Page;
let frames: Map<number, FrameRequestCallback>;
let nextId: number;
const disposers: (() => void)[] = [];
function frame(now = 16) {
  const pending = [...frames.values()];
  frames.clear();
  pending.forEach(callback => callback(now));
}
function loop(render: (now: number, reduced: boolean) => void | false) {
  const lifecycle = createMotionLoop(render);
  disposers.push(lifecycle.dispose);
  return lifecycle;
}
function exit(callback: () => void) {
  const lifecycle = createLoaderExit(callback);
  disposers.push(lifecycle.dispose);
  return lifecycle;
}

beforeEach(() => {
  vi.useFakeTimers();
  media = new MotionQuery();
  page = new Page();
  frames = new Map();
  nextId = 0;
  vi.stubGlobal('window', { matchMedia: () => media });
  vi.stubGlobal('document', page);
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.set(++nextId, callback);
    return nextId;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));
});
afterEach(() => {
  disposers.splice(0).forEach(dispose => dispose());
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('motion lifecycle', () => {
  it('keeps one loop through motion and visibility changes in any order', () => {
    let renders = 0;
    loop(() => { renders++; });
    expect(frames.size).toBe(1);
    frame();
    expect(renders).toBe(1);
    page.hide(true);
    expect(frames.size).toBe(0);
    media.change(true);
    media.change(false);
    expect(frames.size).toBe(0);
    page.hide(false);
    page.hide(false);
    media.change(false);
    expect(frames.size).toBe(1);
    frame();
    expect(renders).toBe(2);
    expect(frames.size).toBe(1);
  });

  it('renders a static reduced scene initially and on invalidation, never continuously', () => {
    media.matches = true;
    const modes: boolean[] = [];
    const lifecycle = loop((_, reduced) => { modes.push(reduced); });
    expect(modes).toEqual([true]);
    expect(frames.size).toBe(0);
    lifecycle.invalidate();
    expect(modes).toEqual([true, true]);
    page.hide(true);
    lifecycle.invalidate();
    expect(modes).toHaveLength(2);
    page.hide(false);
    expect(modes).toHaveLength(3);
    media.change(false);
    expect(frames.size).toBe(1);
    frame();
    media.change(true);
    expect(frames.size).toBe(0);
    expect(modes.slice(-2)).toEqual([false, true]);
  });

  it('does not start hidden, resume a lost context, or render stale callbacks after cleanup', () => {
    page.hidden = true;
    let renders = 0;
    const lifecycle = loop(() => { renders++; });
    expect(frames.size).toBe(0);
    page.hide(false);
    const stale = [...frames.values()][0];
    lifecycle.setAvailable(false);
    page.hide(true);
    page.hide(false);
    media.change(false);
    expect(frames.size).toBe(0);
    lifecycle.setAvailable(true);
    lifecycle.setAvailable(true);
    expect(frames.size).toBe(1);
    lifecycle.dispose();
    stale?.(16);
    page.hide(false);
    media.change(true);
    lifecycle.invalidate();
    expect(renders).toBe(0);
    expect(frames.size).toBe(0);
  });

  it('rejects a canceled callback after resume without disturbing the new pending frame', () => {
    let renders = 0;
    loop(() => { renders++; });
    const stale = [...frames.values()][0];
    page.hide(true);
    page.hide(false);
    stale(16);
    expect(renders).toBe(0);
    expect(frames.size).toBe(1);
    frame();
    expect(renders).toBe(1);
    expect(frames.size).toBe(1);
  });

  it('removes motion and visibility listeners rather than leaving inactive handlers attached', () => {
    const removeMotion = vi.spyOn(media, 'removeEventListener');
    const removeVisibility = vi.spyOn(page, 'removeEventListener');
    const lifecycle = loop(() => {});
    lifecycle.dispose();
    expect(removeMotion).toHaveBeenCalledWith('change', expect.any(Function));
    expect(removeVisibility).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
    expect(frames.size).toBe(0);
  });

  it('stops permanently when rendering reports completion, including during invalidation', () => {
    let renders = 0;
    const lifecycle = loop(() => { renders++; return false; });
    frame();
    lifecycle.invalidate();
    media.change(true);
    page.hide(false);
    expect(renders).toBe(1);
    expect(frames.size).toBe(0);
  });

  it('cleans up on remount without allowing an old queued callback into the new loop', () => {
    let renders = 0;
    const first = loop(() => { renders++; });
    const stale = [...frames.values()][0];
    first.dispose();
    loop(() => { renders++; });
    stale?.(16);
    frame();
    expect(renders).toBe(1);
    expect(frames.size).toBe(1);
  });
});

describe('loader exit lifecycle', () => {
  it('keeps the normal fallback delay and completes only once if animation wins', () => {
    let completions = 0;
    const lifecycle = exit(() => { completions++; });
    vi.advanceTimersByTime(819);
    expect(completions).toBe(0);
    lifecycle.finish();
    vi.advanceTimersByTime(1000);
    lifecycle.finish();
    expect(completions).toBe(1);
  });

  it('finishes even without WebGL frames or a visible page', () => {
    page.hidden = true;
    let completions = 0;
    exit(() => { completions++; });
    vi.advanceTimersByTime(909);
    expect(completions).toBe(0);
    vi.advanceTimersByTime(1);
    expect(completions).toBe(1);
  });

  it.each([true, false])('finishes promptly for initial/runtime reduced preference (initial=%s)', initial => {
    media.matches = initial;
    let completions = 0;
    exit(() => { completions++; });
    if (!initial) {
      vi.advanceTimersByTime(100);
      media.change(true);
    }
    vi.advanceTimersByTime(0);
    expect(completions).toBe(1);
    vi.advanceTimersByTime(1000);
    expect(completions).toBe(1);
  });

  it('cancels timers and listeners on teardown', () => {
    let completions = 0;
    const lifecycle = exit(() => { completions++; });
    lifecycle.dispose();
    media.change(true);
    lifecycle.finish();
    vi.runAllTimers();
    expect(completions).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
  });
});
