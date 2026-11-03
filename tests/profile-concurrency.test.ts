import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {ProgressRepository} from '../src/lib/db/progress-repository';
import {initializeWorkspace} from '../src/lib/account/workspace';
beforeEach(()=>{initializeWorkspace('concurrency');const records=new Map<string,string>();vi.stubGlobal('localStorage',{getItem:(k:string)=>records.get(k)??null,setItem:(k:string,v:string)=>records.set(k,v),removeItem:(k:string)=>records.delete(k),get length(){return records.size},key:(i:number)=>[...records.keys()][i]??null});});
afterEach(()=>{initializeWorkspace(null);vi.unstubAllGlobals()});
it('merges overlapping preference edits instead of discarding one saved field',async()=>{
 await ProgressRepository.getProfile();
 await Promise.all([ProgressRepository.updateProfile('local_user',{alias:'Kept name'}),ProgressRepository.updateProfile('local_user',{preferred_daily_minutes:45})]);
 expect(await ProgressRepository.getProfile()).toMatchObject({alias:'Kept name',preferred_daily_minutes:45});
});
it('keeps unrelated profile edits made while a lesson completion validates tasks',async()=>{
 const id='P0-D01';
 const {LEARNING_DAYS}=await import('../src/lib/db/curriculum-data');
 for(const t of LEARNING_DAYS[0].tasks.filter(t=>t.required))await ProgressRepository.updateTaskProgress('local_user',id,t.id,'completed');
 await Promise.all([ProgressRepository.finishLearningDay('local_user',id),ProgressRepository.updateProfile('local_user',{alias:'Still my name'})]);
 expect(await ProgressRepository.getProfile()).toMatchObject({alias:'Still my name',active_day_index:2});
});
