import {beforeEach,afterEach,describe,it,expect,vi} from 'vitest';
import {ProgressRepository} from '../src/lib/db/progress-repository';
import {lessonDraftRevision} from '../src/lib/db/lesson-drafts';
import {restoreStudyBackup} from '../src/lib/db/study-backup';
import {initializeWorkspace,workspaceStorageKey} from '../src/lib/account/workspace';
import {LEARNING_DAYS} from '../src/lib/db/curriculum-data';
let values:Map<string,string>;
beforeEach(()=>{initializeWorkspace('phase2');values=new Map();vi.stubGlobal('localStorage',{getItem:(k:string)=>values.get(k)??null,setItem:(k:string,v:string)=>values.set(k,v),removeItem:(k:string)=>values.delete(k),get length(){return values.size},key:(i:number)=>[...values.keys()][i]??null,clear:()=>values.clear()});});
afterEach(()=>{initializeWorkspace(null);vi.unstubAllGlobals()});
const key=(s:string)=>workspaceStorageKey(`foundation_career_os_local_user_${s}`);
describe('Review-only learning steps',()=>{
 it('brings the next scheduled set forward without changing the active lesson',async()=>{
  await ProgressRepository.updateProfile('local_user',{active_day_index:31});
  await ProgressRepository.scheduleReview('local_user','P0.01','Compile?','Translate.',31);
  const result=await ProgressRepository.startNextRecallSession();
  expect(result).toMatchObject({advanced:true,step:32});
  expect((await ProgressRepository.getProfile()).active_day_index).toBe(31);
  expect(await ProgressRepository.getDueReviews('local_user',result.step)).toHaveLength(1);
 });
 it('does not skip concepts already ready or advance an empty queue',async()=>{
  expect((await ProgressRepository.startNextRecallSession()).advanced).toBe(false);
  await ProgressRepository.scheduleReview('local_user','P0.01','Compile?','Translate.',0);
  expect((await ProgressRepository.startNextRecallSession()).advanced).toBe(false);
 });
 it('schedules newly completed work relative to the review cursor, not an old lesson number',async()=>{
  await ProgressRepository.updateProfile('local_user',{recall_step:70});
  const day=LEARNING_DAYS[0];
  for(const t of day.tasks.filter(t=>t.required))await ProgressRepository.updateTaskProgress('local_user',day.id,t.id,'completed');
  await ProgressRepository.finishLearningDay('local_user',day.id);
  const profile=await ProgressRepository.getProfile();
  expect(profile.active_day_index).toBe(2);expect(profile.recall_step).toBe(71);
  const [review]=await ProgressRepository.getDueReviews('local_user',71);
  expect(review.last_day_index).toBe(70);expect(review.next_due_day_index).toBe(71);
  const backup=await ProgressRepository.exportUserData();restoreStudyBackup(backup,localStorage);
  expect((await ProgressRepository.getProfile()).recall_step).toBe(71);
 });
});
describe('Saved lesson reflections',()=>{
 it('preserves notes before completion, after completion, and in a portable backup',async()=>{
  await ProgressRepository.updateDayNotes('local_user','P0-D01','My first\ncompiler diagnostic.');
  for(const t of LEARNING_DAYS[0].tasks.filter(t=>t.required))await ProgressRepository.updateTaskProgress('local_user','P0-D01',t.id,'completed');
  await ProgressRepository.finishLearningDay('local_user','P0-D01');
  expect((await ProgressRepository.getDayProgress('local_user','P0-D01'))?.notes).toBe('My first\ncompiler diagnostic.');
  await ProgressRepository.updateDayNotes('local_user','P0-D01','A later reflection.');
  const source=await ProgressRepository.exportUserData();restoreStudyBackup(source,localStorage);
  expect((await ProgressRepository.getDayProgress('local_user','P0-D01'))?.notes).toBe('A later reflection.');
  expect((await ProgressRepository.getProfile()).active_day_index).toBe(2);
 });
 it('refuses an unknown lesson and keeps a failed note write from destroying the previous note',async()=>{
  await expect(ProgressRepository.updateDayNotes('local_user','unknown','x')).rejects.toThrow();
  await ProgressRepository.updateDayNotes('local_user','P0-D01','Keep this');
  const set=localStorage.setItem;localStorage.setItem=(k,v)=>{if(k===key('day_P0-D01'))throw Error('quota');set(k,v)};
  await expect(ProgressRepository.updateDayNotes('local_user','P0-D01','New draft')).rejects.toThrow();
  expect((await ProgressRepository.getDayProgress('local_user','P0-D01'))?.notes).toBe('Keep this');
 });
});

it('keeps concurrent course interests and includes them in portable backups',async()=>{
 await ProgressRepository.updateProfile('local_user',{active_day_index:7});
 await Promise.all([ProgressRepository.setCourseInterest('local_user','DB',true),ProgressRepository.setCourseInterest('local_user','AI',true)]);
 expect((await ProgressRepository.getProfile()).saved_course_ids?.sort()).toEqual(['AI','DB']);
 const backup=await ProgressRepository.exportUserData();restoreStudyBackup(backup,localStorage);
 expect((await ProgressRepository.getProfile()).active_day_index).toBe(7);
 await ProgressRepository.setCourseInterest('local_user','AI',false);
 expect((await ProgressRepository.getProfile()).saved_course_ids).toEqual(['DB']);
});

it('invalidates tab drafts after restore or reset while preserving another workspace',async()=>{
 const drafts=new Map<string,string>();vi.stubGlobal('sessionStorage',{getItem:(k:string)=>drafts.get(k)??null,setItem:(k:string,v:string)=>drafts.set(k,v),removeItem:(k:string)=>drafts.delete(k),get length(){return drafts.size},key:(i:number)=>[...drafts.keys()][i]??null});
 const own=workspaceStorageKey('gradient_lesson_draft_P0-D01_initial');
 const other='gradient_workspace_someone-else_gradient_lesson_draft_P0-D01_initial';
 sessionStorage.setItem(own,'Stale text');sessionStorage.setItem(other,'Other account');
 const backup=await ProgressRepository.exportUserData();restoreStudyBackup(backup,localStorage);
 expect(sessionStorage.getItem(own)).toBeNull();expect(sessionStorage.getItem(other)).toBe('Other account');
 const revisionKey=workspaceStorageKey('gradient_notes_revision');const restored=localStorage.getItem(revisionKey);expect(restored).toBeTruthy();
 sessionStorage.setItem(own,'Another stale draft');await ProgressRepository.clearAllUserData();
 expect(sessionStorage.getItem(own)).toBeNull();expect(sessionStorage.getItem(other)).toBe('Other account');expect(localStorage.getItem(revisionKey)).not.toBe(restored);
});

it('keeps a blocked draft revision read from throwing through the editor',()=>{
 localStorage.getItem=()=>{throw Error('Storage blocked')};
 expect(()=>lessonDraftRevision()).not.toThrow();expect(lessonDraftRevision()).toBeNull();
});
