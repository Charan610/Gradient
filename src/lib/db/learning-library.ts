import { LearningDay } from './types';

export type LessonState = 'completed' | 'current' | 'available' | 'preview';
export type LessonFilter = 'all' | 'completed' | 'remaining';

export function getLessonState(day: LearningDay, activeSequence: number, completedIds: string[]): LessonState {
  if (completedIds.includes(day.id)) return 'completed';
  if (day.sequence_index === activeSequence) return 'current';
  return day.sequence_index > activeSequence ? 'preview' : 'available';
}

export function filterLessons(days: LearningDay[], query: string, filter: LessonFilter, activeSequence: number, completedIds: string[]) {
  const term = query.trim().toLowerCase();
  return days.filter(day => {
    const matches = `${day.title} ${day.goal} ${day.stable_code}`.toLowerCase().includes(term);
    const completed = getLessonState(day, activeSequence, completedIds) === 'completed';
    return matches && (filter === 'all' || (filter === 'completed' ? completed : !completed));
  });
}
