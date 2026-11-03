import {afterEach,expect,it,vi} from 'vitest';
import * as backups from '../src/lib/db/backup-tools';
import {studyLockName} from '../src/lib/db/study-lock';
import {initializeWorkspace,workspaceStorageKey} from '../src/lib/account/workspace';
import {studyRestoreJournalKey} from '../src/lib/db/restore-recovery';

afterEach(()=>{initializeWorkspace(null);vi.unstubAllGlobals()});
it('waits for the verified account lock before reading any backup records',async()=>{
 let enter!:()=>void;
 const request=vi.fn((_name:string,_options:unknown,callback:()=>unknown)=>new Promise(resolve=>{enter=()=>resolve(callback())}));
 vi.stubGlobal('navigator',{locks:{request}});initializeWorkspace('different-active-account');
 const profile={user_id:'local_user',alias:'Restored',academic_semester:'2-2',target_role:'Learning',preferred_daily_minutes:60,preferred_mode:'normal',theme:'light',onboarding_status:'completed',active_day_index:1};
 const key='gradient_workspace_verified_foundation_career_os_local_user_profile';
 const values={[key]:JSON.stringify(profile)};
 const getItem=vi.fn((k:string)=>values[k as keyof typeof values]??null);
 const storage={length:1,key:()=>key,getItem,setItem:vi.fn(),removeItem:vi.fn(),clear:vi.fn()} as Storage;
 const safe=(backups as unknown as {exportRecoveryBackupSafely:(s:Storage,i:backups.RecoveryIdentity)=>Promise<string>}).exportRecoveryBackupSafely;
 expect(safe).toBeTypeOf('function');
 const result=safe(storage,{id:'verified',username:'Learner'});
 expect(getItem).not.toHaveBeenCalled();
 expect(request.mock.calls[0][0]).toBe(studyLockName(key));
 enter();expect(JSON.parse(await result).profile.alias).toBe('Restored');
 expect(workspaceStorageKey('test')).toBe('gradient_workspace_different-active-account_test');
 expect(storage.setItem).not.toHaveBeenCalled();expect(storage.removeItem).not.toHaveBeenCalled();
});

it('refuses an uncoordinated emergency snapshot without reading or modifying records',async()=>{
 vi.stubGlobal('navigator',{});
 const storage={getItem:vi.fn(),setItem:vi.fn(),removeItem:vi.fn()} as unknown as Storage;
 const safe=(backups as unknown as {exportRecoveryBackupSafely:(s:Storage,i:backups.RecoveryIdentity)=>Promise<string>}).exportRecoveryBackupSafely;
 expect(safe).toBeTypeOf('function');
 await expect(safe(storage,{id:'verified',username:'Learner'})).rejects.toThrow('coordinate');
 expect(storage.getItem).not.toHaveBeenCalled();expect(storage.setItem).not.toHaveBeenCalled();
});

it('recovers only the downloaded journal for the active verified account',async()=>{
 vi.stubGlobal('navigator',{locks:{request:async(_n:unknown,_o:unknown,run:()=>unknown)=>run()}});
 initializeWorkspace('verified');
 const key=workspaceStorageKey('foundation_career_os_local_user_profile');
 const journal=JSON.stringify({version:1,before:{[key]:'original bytes'}});
 const values=new Map([[key,'partial bytes'],[studyRestoreJournalKey(),journal]]);
 const storage={getItem:(k:string)=>values.get(k)??null,setItem:(k:string,v:string)=>values.set(k,v),removeItem:(k:string)=>values.delete(k)} as unknown as Storage;
 const recover=(backups as unknown as {recoverDownloadedStudyBackup:(s:Storage,i:backups.RecoveryIdentity,j:string)=>Promise<boolean>}).recoverDownloadedStudyBackup;
 expect(recover).toBeTypeOf('function');
 expect(await recover(storage,{id:'verified',username:'Learner'},'different journal')).toBe(false);
 expect(storage.getItem(key)).toBe('partial bytes');
 await expect(recover(storage,{id:'another',username:'Other'},journal)).rejects.toThrow('Workspace changed');
 expect(await recover(storage,{id:'verified',username:'Learner'},journal)).toBe(true);
 expect(storage.getItem(key)).toBe('original bytes');expect(storage.getItem(studyRestoreJournalKey())).toBeNull();
});

it('identifies a local-only recovery copy in a fresh tab without reading account workspaces',async()=>{
 vi.stubGlobal('navigator',{locks:{request:async(_n:unknown,_o:unknown,run:()=>unknown)=>run()}});
 const profile={user_id:'local_user',alias:'Local Learner',academic_semester:'2-2',target_role:'Learning',preferred_daily_minutes:60,preferred_mode:'normal',theme:'light',onboarding_status:'completed',active_day_index:1};
 const journal=JSON.stringify({version:1,before:{foundation_career_os_local_user_profile:JSON.stringify(profile)}});
 const values=new Map([['gradient_restore_journal',journal],['gradient_workspace_other_foundation_career_os_local_user_profile','private']]);
 const storage={get length(){return values.size},key:(i:number)=>[...values.keys()][i]??null,getItem:(k:string)=>values.get(k)??null,setItem:vi.fn(),removeItem:vi.fn()} as unknown as Storage;
 const localIdentity=(backups as unknown as {readLocalRecoveryIdentity:(s:Storage)=>Promise<backups.RecoveryIdentity|null>}).readLocalRecoveryIdentity;
 expect(localIdentity).toBeTypeOf('function');
 expect(await localIdentity(storage)).toEqual({id:null,username:'Local Learner'});
 expect(storage.setItem).not.toHaveBeenCalled();expect(storage.removeItem).not.toHaveBeenCalled();
});
