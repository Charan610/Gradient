import { LEARNING_DAYS } from '../db/curriculum-data';
import { guidedCourseFor } from '../db/guided-courses';

const trackIds = { CPP:'CPP', DSA:'DSA', DB:'SQL', CS:'CS', BE:'WEB', AI:'AI' } as const;

/** Read-only inventory; topic candidates imply no competency equivalence. */
export function legacyMapping() {
  return LEARNING_DAYS.map(day => ({
    lessonId: day.id,
    sequence: day.sequence_index,
    route: `/app/learn/${day.phase_id}/${day.id}`,
    taskIds: day.tasks.map(task => task.id),
    candidateTrackId: trackIds[guidedCourseFor(day).id],
    relation: 'unreviewed' as const,
  }));
}
