import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {LEARNING_DAYS,MODULES} from '../src/lib/db/curriculum-data';
import {DSA_LESSONS} from '../src/lib/db/dsa-curriculum';
import {EXPANDED_RECALL} from '../src/lib/db/expanded-curriculum';
import {loadExpandedGuidance} from '../src/lib/db/expanded-guidance';
import {STUDY_GUIDANCE} from '../src/lib/db/study-guidance';
import {courseLessons,guidedCourseFor,lessonPosition} from '../src/lib/db/guided-courses';
import {ProgressRepository} from '../src/lib/db/progress-repository';
import {initializeWorkspace} from '../src/lib/account/workspace';
import {restoreStudyBackup} from '../src/lib/db/study-backup';
beforeEach(()=>{initializeWorkspace('dsa-tests');const values=new Map<string,string>();vi.stubGlobal('localStorage',{getItem:(k:string)=>values.get(k)??null,setItem:(k:string,v:string)=>values.set(k,v),removeItem:(k:string)=>values.delete(k),key:(i:number)=>[...values.keys()][i]??null,get length(){return values.size}})});
afterEach(()=>{initializeWorkspace(null);vi.unstubAllGlobals()});
describe('Expanded guided curriculum',()=>{
 it('preserves the original 50 positions and assigns all 136 lessons to six courses',()=>{
  for(const [course,count] of Object.entries({CPP:45,DSA:45,DB:12,CS:12,BE:12,AI:10}))expect(courseLessons(course)).toHaveLength(count);
  expect(LEARNING_DAYS.map(d=>d.sequence_index)).toEqual(Array.from({length:136},(_,i)=>i+1));
  expect(new Set(LEARNING_DAYS.map(d=>d.id)).size).toBe(136);
  expect(LEARNING_DAYS.slice(0,30).map(d=>d.id)).toEqual(Array.from({length:30},(_,i)=>`P0-D${String(i+1).padStart(2,'0')}`));
  expect(LEARNING_DAYS.slice(30,50).map(d=>d.id)).toEqual(Array.from({length:20},(_,i)=>`P2-D${String(i+1).padStart(2,'0')}`));
  expect(LEARNING_DAYS[50].id).toBe('P1-D01');
  expect(lessonPosition(LEARNING_DAYS[30])).toBe(1);expect(guidedCourseFor(LEARNING_DAYS[30]).id).toBe('DSA');
 });
 it('provides teachable guidance, independent checks and valid task references for every guided lesson beyond Phase 0',async()=>{
  expect(DSA_LESSONS).toHaveLength(20);
  for(const day of LEARNING_DAYS.slice(30)){
   const guide=STUDY_GUIDANCE[day.sequence_index]??await loadExpandedGuidance(day.id);
   if(day.sequence_index>50){
    const full=await loadExpandedGuidance(day.id);
    expect(day.title).toBe(full.title.replace(`${day.id} — `,''));
    expect(day.goal).toBe(full.goal);
    expect(day.estimated_minutes).toBe(full.minutes);
    expect(EXPANDED_RECALL[day.sequence_index]).toEqual({prompt:full.prompt,answer:full.answer});
   }
   for(const text of [guide.explanation,guide.example?.input,guide.example?.output,guide.example?.reasoning,guide.exercise,guide.checks,guide.hint,guide.prompt,guide.answer])expect(text?.trim()).toBeTruthy();
   expect(guide.reference?.url).toMatch(/^https:\/\//);
   expect(day.tasks.filter(t=>t.required)).toHaveLength(3);
   expect(day.tasks.reduce((total,t)=>total+t.estimate_minutes,0)).toBe(day.estimated_minutes);
   for(const task of day.tasks)expect(MODULES.some(m=>m.id===task.module_id)).toBe(true);
  }
 });
 it('completes the expanded sequence and round-trips notes, evidence and recall',async()=>{
  for(const day of LEARNING_DAYS){
   await ProgressRepository.updateDayNotes('local_user',day.id,`Reflection: ${day.id}\nMy edge case.`);
   for(const task of day.tasks.filter(t=>t.required))await ProgressRepository.updateTaskProgress('local_user',day.id,task.id,'completed');
   expect((await ProgressRepository.finishLearningDay('local_user',day.id)).success).toBe(true);
   expect((await ProgressRepository.getProfile()).active_day_index).toBe(day.sequence_index+1);
  }
  expect(await ProgressRepository.getDueReviews('local_user',Number.MAX_SAFE_INTEGER)).toHaveLength(136);
  const backup=await ProgressRepository.exportUserData();restoreStudyBackup(backup,localStorage);
  expect((await ProgressRepository.getDayProgress('local_user','P2-D20'))?.notes).toContain('P2-D20');
  for(const id of ['P1-D01','P3-D01','DB-D01','CS-D01','BE-D01','AI-D10']) {
    expect((await ProgressRepository.getDayProgress('local_user',id))?.notes).toContain(id);
    expect(Object.keys(await ProgressRepository.getDayTaskProgresses('local_user',id))).toContain(`${id}-T02`);
  }
  expect((await ProgressRepository.getStudySnapshot()).completedIds).toHaveLength(136);
  const ready=await ProgressRepository.getDueReviews('local_user',137);
  for(const review of ready)await ProgressRepository.recordReviewAttempt('local_user',review.id,'stable');
  const next=await ProgressRepository.startNextRecallSession();expect(next.advanced).toBe(true);
  expect((await ProgressRepository.getProfile()).active_day_index).toBe(137);
  expect((await ProgressRepository.getDueReviews('local_user',next.step)).length).toBeGreaterThan(0);
 });
});
