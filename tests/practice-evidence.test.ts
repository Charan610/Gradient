import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {ProgressRepository} from '../src/lib/db/progress-repository';
import {initializeWorkspace} from '../src/lib/account/workspace';
import {parseStudyBackup,restoreStudyBackup} from '../src/lib/db/study-backup';
import {applyPracticeAction,emptyEvidence} from '../src/lib/db/practice-evidence';

const pass = {type:'submit',id:'00000000-0000-4000-8000-000000000001',answer:'3, 4',assisted:false} as const;
const fail = {...pass,id:'00000000-0000-4000-8000-000000000002',answer:'4, 4'} as const;
const review = {...pass,id:'00000000-0000-4000-8000-000000000003'} as const;
const day = 86400000;

beforeEach(()=>{
 initializeWorkspace('practice-a');
 const records = new Map<string,string>();
 vi.stubGlobal('localStorage',{getItem:(key:string)=>records.get(key)??null,setItem:(key:string,value:string)=>records.set(key,value),removeItem:(key:string)=>records.delete(key),get length(){return records.size},key:(i:number)=>[...records.keys()][i]??null});
});
afterEach(()=>{initializeWorkspace(null);vi.unstubAllGlobals()});

it('keeps guided evidence distinct and preserves a pass through failure and a later review',()=>{
 const guided=applyPracticeAction(emptyEvidence,{...pass,assisted:true},0);
 expect(guided).toMatchObject({guided:true,independentAttempts:0,firstPassAt:null});
 const first=applyPracticeAction(emptyEvidence,pass,day);
 const failed=applyPracticeAction(first,fail,2*day);
 expect(failed).toMatchObject({firstPassAt:day,needsReview:true,dueAt:4*day});
 expect(applyPracticeAction(failed,pass,4*day)).toBe(failed);
 expect(applyPracticeAction(failed,review,4*day)).toMatchObject({retrieved:1,needsReview:false,dueAt:14*day});
 expect(applyPracticeAction(failed,{type:'snooze'},4*day).dueAt).toBe(5*day);
});
it('merges concurrent submissions, round trips version-one backups and leaves lesson position unchanged',async()=>{
 await ProgressRepository.updateProfile('local_user',{active_day_index:51});
 await Promise.all([ProgressRepository.savePracticeAction(pass),ProgressRepository.savePracticeAction(fail)]);
 const profile=await ProgressRepository.getProfile();
 expect(profile.practice_evidence?.independentAttempts).toBe(2);
 const backup=await ProgressRepository.exportUserData();
 expect(parseStudyBackup(backup)).toBeTruthy();
 initializeWorkspace('practice-b');
 expect((await ProgressRepository.getProfile()).practice_evidence).toBeUndefined();
 restoreStudyBackup(backup,localStorage);
 expect(await ProgressRepository.getProfile()).toMatchObject({active_day_index:51,practice_evidence:profile.practice_evidence});
});
it('rejects a queued submission if the workspace switches',async()=>{
 const pending=ProgressRepository.savePracticeAction(pass);
 initializeWorkspace('practice-b');
 await expect(pending).rejects.toThrow(/Workspace changed/);
 expect((await ProgressRepository.getProfile()).practice_evidence).toBeUndefined();
});
