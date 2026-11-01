import { describe, expect, it } from 'vitest';
import { resolveHomeJourney } from '../src/lib/db/home-journey';
import { LEARNING_DAYS } from '../src/lib/db/curriculum-data';

describe('student home journey', () => {
  it('starts with the first actual activity for a new learner', () => {
    const result = resolveHomeJourney(1, [], {}, 'normal');
    expect(result.state).toBe('new');
    expect(result.nextTask?.id).toBe(LEARNING_DAYS[0].tasks.find(t => t.required)?.id);
  });
  it('resumes at the first unfinished required task without counting optional work', () => {
    const task = LEARNING_DAYS[0].tasks.find(t => t.required)!;
    const result = resolveHomeJourney(1, [], { [task.id]: { user_id: 'local_user', day_task_id: task.id, status: 'completed' } }, 'normal');
    expect(result.state).toBe('returning');
    expect(result.nextTask?.id).not.toBe(task.id);
    expect(result.completedTasks).toBe(1);
  });
  it('does not assume a learner with a later saved position is a beginner', () => {
    expect(resolveHomeJourney(5, [], {}, 'normal').state).toBe('returning');
  });
  it('shows maintenance instead of prompting new required work', () => {
    expect(resolveHomeJourney(2, ['P0-D01'], {}, 'maintenance').state).toBe('maintenance');
  });
  it('only celebrates completion when all lesson records are complete', () => {
    expect(resolveHomeJourney(31, LEARNING_DAYS.map(d => d.id), {}, 'normal').state).toBe('finished');
    expect(resolveHomeJourney(31, [], {}, 'normal').state).toBe('unavailable');
  });
  it('does not silently turn a corrupt or missing sequence into the last lesson', () => {
    for (const index of [0, -1, NaN, 999, 1.5]) expect(resolveHomeJourney(index, [], {}, 'normal').state).toBe('unavailable');
  });
  it('does not mistake unknown completion IDs for curriculum progress', () => {
    expect(resolveHomeJourney(1, ['unknown'], {}, 'normal').completedLessons).toBe(0);
  });
});
