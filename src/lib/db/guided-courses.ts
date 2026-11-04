import { LEARNING_DAYS } from './curriculum-data';
import type { LearningDay } from './types';

export const GUIDED_COURSES = [
  {id:'CPP', phaseId:'P0 → P1', prefixes:['P0','P1'], title:'C++ Foundations', description:'Build, test, and explain C++ programs, from the first executable to resource ownership.'},
  {id:'DSA', phaseId:'P2 → P4', prefixes:['P2','P3'], title:'DSA in C++', description:'Practice data structures and algorithms with worked examples, independent exercises, and recall.'},
  {id:'DB', phaseId:'P2 → P3', prefixes:['DB'], title:'SQL & Database Design', description:'Design relational schemas, write queries, and verify transactions and performance.'},
  {id:'CS', phaseId:'P3 → P4', prefixes:['CS'], title:'Computer Science Core', description:'Trace programs through processes, memory, networks, and failure scenarios.'},
  {id:'BE', phaseId:'P3 → P4', prefixes:['BE'], title:'Backend Engineering', description:'Build, secure, test, and operate a reproducible API.'},
  {id:'AI', phaseId:'P7', prefixes:['AI'], title:'Applied AI & Retrieval', description:'Build a grounded search service and evaluate it against a baseline.'},
] as const;

const courseByPrefix = new Map(GUIDED_COURSES.flatMap(course => course.prefixes.map(prefix => [prefix,course] as const)));
function courseForId(id: string) {
  return courseByPrefix.get(id.split('-')[0] as Parameters<typeof courseByPrefix.get>[0]);
}
export function courseLessons(id:string) {
  return LEARNING_DAYS.filter(day => courseForId(day.id)?.id === id);
}
export function guidedCourseFor(day:LearningDay) {
  const course = courseForId(day.id);
  if (!course) throw new Error(`Unknown course for lesson ${day.id}`);
  return course;
}
export function lessonPosition(day:LearningDay) {
  return courseLessons(guidedCourseFor(day).id).findIndex(item => item.id === day.id) + 1;
}
