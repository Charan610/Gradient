import { describe, expect, it, vi } from 'vitest';
import { createStaleResource } from '../src/lib/db/stale-resource';

describe('stale resource', () => {
  it('deduplicates concurrent refreshes and publishes the result', async () => {
    const load = vi.fn().mockResolvedValue({ count: 3 });
    const resource = createStaleResource({ count: 0 }, load);
    const first = resource.refresh();
    expect(resource.refresh()).toBe(first);
    await first;
    expect(load).toHaveBeenCalledTimes(1);
    expect(resource.getSnapshot()).toEqual({ data: { count: 3 }, loading: false, refreshing: false, error: false });
    expect(resource.getServerSnapshot().data.count).toBe(0);
  });
  it('keeps stale data during refresh and after failures, then recovers', async () => {
    const load = vi.fn().mockResolvedValueOnce(3).mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(4);
    const resource = createStaleResource(0, load);
    await resource.refresh();
    const second = resource.refresh();
    expect(resource.getSnapshot().data).toBe(3);
    expect(resource.getSnapshot().refreshing).toBe(true);
    await second;
    expect(resource.getSnapshot().data).toBe(3);
    expect(resource.getSnapshot().error).toBe(true);
    await resource.refresh();
    expect(resource.getSnapshot().data).toBe(4);
    expect(resource.getSnapshot().error).toBe(false);
  });
  it('stops notifying unsubscribed consumers', async () => {
    const resource = createStaleResource(0, async () => 1);
    const listener = vi.fn();
    const off = resource.subscribe(listener);
    off();
    await resource.refresh();
    expect(listener).not.toHaveBeenCalled();
  });
});
