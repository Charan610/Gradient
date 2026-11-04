import index from './expanded-lesson-index.json';
import type { LearningDay, ModuleItem } from './types';

const blocks = [
  ['P1', 'CPP', 'P1', index.P1, 0, 15, 'C++ systems depth'],
  ['P2', 'DB', 'DB', index.DB, 0, 6, 'Relational design and SQL'],
  ['P3', 'DSA', 'P3', index.P3, 0, 11, 'Advanced data structures and search'],
  ['P3', 'DB', 'DB', index.DB, 6, 12, 'Transactions and database performance'],
  ['P3', 'CS', 'CS', index.CS, 0, 6, 'Processes, memory and concurrency'],
  ['P3', 'BE', 'BE', index.BE, 0, 7, 'Building and securing APIs'],
  ['P4', 'DSA', 'P3', index.P3, 11, 25, 'Graphs and dynamic programming'],
  ['P4', 'CS', 'CS', index.CS, 6, 12, 'Networking and system design'],
  ['P4', 'BE', 'BE', index.BE, 7, 12, 'Operating and delivering APIs'],
  ['P7', 'AI', 'AI', index.AI, 0, 10, 'Grounded search and retrieval'],
] as const;

export const EXPANDED_DAYS: LearningDay[] = [];
export const EXPANDED_MODULES: ModuleItem[] = [];
export const EXPANDED_RECALL: Record<number, {prompt:string;answer:string}> = {};

for (const [phase, subject, prefix, lessons, start, end, title] of blocks) {
  const moduleId = `${phase}.guided.${subject}`;
  EXPANDED_MODULES.push({
    id: moduleId, phase_id: phase, subject_id: subject, stable_code: moduleId,
    order_index: 100 + EXPANDED_MODULES.length, title,
    expected_minutes: lessons.slice(start, end).reduce((sum, lesson) => sum + lesson.minutes, 0),
    learning_outcomes: lessons.slice(start, end).map(lesson => lesson.goal), prereq_codes: [],
  });
  for (let index = start; index < end; index++) {
    const lesson = lessons[index];
    if (!lesson) throw new Error(`Missing guided lesson: ${prefix} ${index + 1}`);
    const id = `${prefix}-D${String(index + 1).padStart(2, '0')}`;
    const sequence = 51 + EXPANDED_DAYS.length;
    const practiceMinutes = lesson.minutes - 25;
    EXPANDED_RECALL[sequence] = {prompt:lesson.prompt,answer:lesson.answer};
    EXPANDED_DAYS.push({
      id, phase_id: phase, sequence_index: sequence, stable_code: id,
      title: lesson.title.replace(`${id} — `, ''), goal: lesson.goal, estimated_minutes: lesson.minutes,
      tasks: [
        { id: `${id}-T01`, learning_day_id: id, module_id: moduleId, task_order: 1, kind: 'learn', required: true,
          title: 'Explain the idea', instructions: 'Read The idea and trace the worked example in your study guide.', estimate_minutes: 15, validation_criteria: 'Explain the invariant in your own words before opening the self-check.' },
        { id: `${id}-T02`, learning_day_id: id, module_id: moduleId, task_order: 2, kind: 'practice', required: true,
          title: 'Build and test independently', instructions: 'Run the independent lab from the study guide in a local practice environment.', estimate_minutes: practiceMinutes, validation_criteria: 'Compare your actual results with the normal and boundary cases in the guide.' },
        { id: `${id}-T03`, learning_day_id: id, module_id: moduleId, task_order: 3, kind: 'apply', required: true,
          title: 'Record the result and explain an edge case', instructions: 'Answer the self-check question and record a test result that supports your answer.',
          estimate_minutes: 10, validation_criteria: 'Record expected and actual results and explain the invariant or failure mode in your own words.' },
      ],
    });
  }
}
