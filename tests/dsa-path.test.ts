import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {LEARNING_DAYS,MODULES} from '../src/lib/db/curriculum-data';
import {DSA_LESSONS} from '../src/lib/db/dsa-curriculum';
import {STUDY_GUIDANCE} from '../src/lib/db/study-guidance';
import {courseLessons,guidedCourseFor,lessonPosition} from '../src/lib/db/guided-courses';
import {ProgressRepository} from '../src/lib/db/progress-repository';
import {initializeWorkspace} from '../src/lib/account/workspace';
import {restoreStudyBackup} from '../src/lib/db/study-backup';
beforeEach(()=>{initializeWorkspace('dsa-tests');const values=new Map<string,string>();vi.stubGlobal('localStorage',{getItem:(k:string)=>values.get(k)??null,setItem:(k:string,v:string)=>values.set(k,v),removeItem:(k:string)=>values.delete(k),key:(i:number)=>[...values.keys()][i]??null,get length(){return values.size}})});
afterEach(()=>{initializeWorkspace(null);vi.unstubAllGlobals()});
describe('Two guided paths',()=>{
 it('preserves the 30 foundation IDs and appends 20 uniquely sequenced DSA lessons',()=>{
  expect(courseLessons('CPP')).toHaveLength(30);expect(courseLessons('DSA')).toHaveLength(20);expect(courseLessons('DB')).toEqual([]);
  expect(LEARNING_DAYS.map(d=>d.sequence_index)).toEqual(Array.from({length:50},(_,i)=>i+1));
  expect(new Set(LEARNING_DAYS.map(d=>d.id)).size).toBe(50);
  expect(LEARNING_DAYS.slice(0,30).map(d=>d.id)).toEqual(Array.from({length:30},(_,i)=>`P0-D${String(i+1).padStart(2,'0')}`));
  expect(lessonPosition(LEARNING_DAYS[30])).toBe(1);expect(guidedCourseFor(LEARNING_DAYS[30]).id).toBe('DSA');
 });
 it('provides teachable guidance, independent checks and valid task references for every DSA lesson',()=>{
  expect(DSA_LESSONS).toHaveLength(20);
  for(const day of courseLessons('DSA')){
   const guide=STUDY_GUIDANCE[day.sequence_index];
   for(const text of [guide.explanation,guide.example?.input,guide.example?.output,guide.example?.reasoning,guide.exercise,guide.checks,guide.hint,guide.prompt,guide.answer])expect(text?.trim()).toBeTruthy();
   expect(guide.reference?.url).toMatch(/^https:\/\//);
   expect(day.tasks.filter(t=>t.required)).toHaveLength(3);
   expect(day.tasks.reduce((total,t)=>total+t.estimate_minutes,0)).toBe(day.estimated_minutes);
   for(const task of day.tasks)expect(MODULES.some(m=>m.id===task.module_id)).toBe(true);
  }
 });
 it('completes CPP then DSA without losing notes or stranding recall at the end',async()=>{
  for(const day of LEARNING_DAYS){
   await ProgressRepository.updateDayNotes('local_user',day.id,`Reflection: ${day.id}\nMy edge case.`);
   for(const task of day.tasks.filter(t=>t.required))await ProgressRepository.updateTaskProgress('local_user',day.id,task.id,'completed');
   expect((await ProgressRepository.finishLearningDay('local_user',day.id)).success).toBe(true);
   expect((await ProgressRepository.getProfile()).active_day_index).toBe(day.sequence_index+1);
  }
  expect(await ProgressRepository.getDueReviews('local_user',Number.MAX_SAFE_INTEGER)).toHaveLength(50);
  const backup=await ProgressRepository.exportUserData();restoreStudyBackup(backup,localStorage);
  expect((await ProgressRepository.getDayProgress('local_user','P2-D20'))?.notes).toContain('P2-D20');
  const ready=await ProgressRepository.getDueReviews('local_user',51);
  for(const review of ready)await ProgressRepository.recordReviewAttempt('local_user',review.id,'stable');
  const next=await ProgressRepository.startNextRecallSession();expect(next.advanced).toBe(true);
  expect((await ProgressRepository.getProfile()).active_day_index).toBe(51);
  expect((await ProgressRepository.getDueReviews('local_user',next.step)).length).toBeGreaterThan(0);
 });
});
