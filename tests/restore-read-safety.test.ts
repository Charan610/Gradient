import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {initializeWorkspace,workspaceStorageKey,projectStorageKey} from '../src/lib/account/workspace';
import {ProgressRepository} from '../src/lib/db/progress-repository';
import {readProjectProgress,saveProjectProgress} from '../src/lib/db/project-progress';
import {studyRestoreJournalKey} from '../src/lib/db/restore-recovery';

let values:Map<string,string>;
beforeEach(()=>{
 initializeWorkspace('restore-reader');values=new Map();vi.stubGlobal('navigator',{});
 vi.stubGlobal('localStorage',{getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>values.set(key,value),removeItem:(key:string)=>values.delete(key),get length(){return values.size},key:(i:number)=>[...values.keys()][i]??null});
});
afterEach(()=>{initializeWorkspace(null);vi.unstubAllGlobals()});

it('does not roll back imported records when an ordinary reader sees a stale restore journal',async()=>{
 await ProgressRepository.updateProfile('local_user',{alias:'Original'});
 const key=workspaceStorageKey('foundation_career_os_local_user_profile');const original=localStorage.getItem(key);
 await ProgressRepository.updateProfile('local_user',{alias:'Imported'});
 localStorage.setItem(studyRestoreJournalKey(),JSON.stringify({version:1,before:{[key]:original}}));
 const before=new Map(values);
 await expect(ProgressRepository.getProfile()).rejects.toThrow('restore');
 await expect(ProgressRepository.updateProfile('local_user',{alias:'Queued edit'})).rejects.toThrow('restore');
 expect(values).toEqual(before);
});

it('preserves project records and the recovery journal during reads and saves',async()=>{
 const key=projectStorageKey('project');
 localStorage.setItem(key,JSON.stringify({milestones:{done:true},notes:'Imported work',repoUrl:''}));
 localStorage.setItem(studyRestoreJournalKey(),JSON.stringify({version:1,before:{[key]:null}}));
 const before=new Map(values);
 await expect(readProjectProgress('project')).rejects.toThrow('restore');
 await expect(saveProjectProgress('project',{notes:'Queued edit'})).rejects.toThrow('restore');
 expect(values).toEqual(before);
});
