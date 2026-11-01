import { LEARNING_DAYS } from './curriculum-data';
import { UserProfile, UserTaskProgress } from './types';

export function resolveHomeJourney(sequence: number, completedIds: string[], tasks: Record<string, UserTaskProgress>, mode: UserProfile['preferred_mode']) {
  const completedLessons = LEARNING_DAYS.filter(day => completedIds.includes(day.id)).length;
  const day = LEARNING_DAYS.find(item => item.sequence_index === sequence);
  const required = day?.tasks.filter(task => task.required) ?? [];
  const completedTasks = required.filter(task => tasks[task.id]?.status === 'completed').length;
  const nextTask = required.find(task => tasks[task.id]?.status !== 'completed');
  const finished = completedLessons === LEARNING_DAYS.length;
  const state = finished ? 'finished' : !day ? 'unavailable' : mode === 'maintenance' ? 'maintenance' : sequence === 1 && completedLessons === 0 && completedTasks === 0 ? 'new' : 'returning';
  return { state, day, nextTask, completedTasks, requiredTasks: required.length, completedLessons,
    upcoming: day ? LEARNING_DAYS.filter(item => item.sequence_index > sequence).slice(0, 2) : [] };
}
