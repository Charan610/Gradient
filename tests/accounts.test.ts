import {beforeEach,describe,expect,it} from 'vitest';
import {signupSchema,signinSchema} from '../src/lib/account/validation';
import {initializeWorkspace,workspaceStorageKey,portableStorageKey} from '../src/lib/account/workspace';

describe('account credentials',()=>{
 it('normalizes a username without changing the password',()=>{
  const result=signupSchema.parse({username:'  Charan_01  ',password:'  secret phrase  '});
  expect(result.username).toBe('charan_01');
  expect(result.password).toBe('  secret phrase  ');
 });
 it('allows username-only guest access and rejects weak passwords',()=>{
  expect(signupSchema.parse({username:'learner',password:''}).password).toBeUndefined();
  expect(signupSchema.safeParse({username:'learner',password:'short'}).success).toBe(false);
  expect(signupSchema.safeParse({username:'../oops',password:''}).success).toBe(false);
 });
 it('requires a password for returning sign-in',()=>{
  expect(signinSchema.safeParse({username:'learner',password:''}).success).toBe(false);
 });
});

describe('workspace ownership',()=>{
 beforeEach(()=>initializeWorkspace(null));
 it('keeps legacy guest keys and isolates signed-in study data',()=>{
  const key='foundation_career_os_local_user_profile';
  expect(workspaceStorageKey(key)).toBe(key);
  initializeWorkspace('account-a');const a=workspaceStorageKey(key);
  initializeWorkspace('account-b');const b=workspaceStorageKey(key);
  expect(a).not.toBe(b);
  expect(portableStorageKey(a)).toBeNull();
  expect(portableStorageKey(b)).toBe(key);
 });
 it('scopes project evidence and converts only the current owner to portable backup keys',()=>{
  initializeWorkspace('account-a');
  const project=workspaceStorageKey('foundation_proj_A');
  expect(portableStorageKey(project)).toBe('foundation_proj_A');
  initializeWorkspace(null);
  expect(portableStorageKey(project)).toBeNull();
 });
});

import {vi,afterEach} from 'vitest';
import {ProgressRepository} from '../src/lib/db/progress-repository';
import {restoreStudyBackup} from '../src/lib/db/study-backup';
afterEach(()=>{initializeWorkspace(null);vi.unstubAllGlobals();});
it('exports, restores and resets only the current account, including project evidence',async()=>{
 const values=new Map<string,string>();
 const storage={getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>values.set(key,value),removeItem:(key:string)=>values.delete(key),key:(index:number)=>[...values.keys()][index]??null,get length(){return values.size;},clear:()=>values.clear()} as Storage;
 vi.stubGlobal('localStorage',storage);
 initializeWorkspace('a');await ProgressRepository.updateProfile('local_user',{alias:'Account A'});
 storage.setItem(workspaceStorageKey('foundation_proj_A'),JSON.stringify({milestones:{},repoUrl:'',notes:'A private note'}));
 const backupA=await ProgressRepository.exportUserData();
 initializeWorkspace('b');await ProgressRepository.updateProfile('local_user',{alias:'Account B'});
 const backupB=JSON.parse(await ProgressRepository.exportUserData());
 expect(backupB.profile.alias).toBe('Account B');
 expect(JSON.stringify(backupB)).not.toContain('A private note');
 restoreStudyBackup(backupA,storage);
 expect((await ProgressRepository.getProfile()).alias).toBe('Account A');
 await ProgressRepository.clearAllUserData();
 initializeWorkspace('a');
 expect((await ProgressRepository.getProfile()).alias).toBe('Account A');
 expect(storage.getItem(workspaceStorageKey('foundation_proj_A'))).toContain('A private note');
});
