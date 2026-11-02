import {LEARNING_DAYS} from './curriculum-data';
import type {LearningDay} from './types';
export const GUIDED_COURSES=[
 {id:'CPP',phaseId:'P0',title:'C++ Foundations',description:'Build, test, and explain your first C++ programs.'},
 {id:'DSA',phaseId:'P2',title:'DSA in C++',description:'Practice data structures and algorithms with worked examples, independent exercises, and recall.'},
] as const;
export function courseLessons(id:string){const course=GUIDED_COURSES.find(course=>course.id===id);return course?LEARNING_DAYS.filter(day=>day.phase_id===course.phaseId):[];}
export function guidedCourseFor(day:LearningDay){return GUIDED_COURSES.find(course=>course.phaseId===day.phase_id)!;}
export function lessonPosition(day:LearningDay){return courseLessons(guidedCourseFor(day).id).findIndex(item=>item.id===day.id)+1;}
