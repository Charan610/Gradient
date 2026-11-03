import {afterEach,expect,it,vi} from 'vitest';
import {withStudyLock,studyLockName} from '../src/lib/db/study-lock';
afterEach(()=>vi.unstubAllGlobals());
it('serializes operations in one context and releases after errors',async()=>{
 vi.stubGlobal('navigator',{});const seen:string[]=[];let release!:()=>void;
 const first=withStudyLock('a',async()=>{seen.push('first');await new Promise<void>(r=>release=r);throw Error('first fails')});
 const firstResult=first.catch(()=>undefined);const second=withStudyLock('a',()=>seen.push('second'));
 await new Promise(r=>setTimeout(r,0));expect(seen).toEqual(['first']);release();await firstResult;await second;expect(seen).toEqual(['first','second']);
});
it('uses the same exclusive Web Lock for reads and destructive restore',async()=>{
 const request=vi.fn(async(_name,_options,callback)=>callback());vi.stubGlobal('navigator',{locks:{request}});
 await withStudyLock('account-a',()=>1);await withStudyLock('account-a',()=>2,true);
 expect(request.mock.calls.map(x=>x[0])).toEqual([studyLockName('account-a'),studyLockName('account-a')]);
 expect(request.mock.calls[0][1]).toEqual({mode:'exclusive'});
});
it('refuses destructive restore without cross-tab coordination before touching storage',async()=>{
 vi.stubGlobal('navigator',{});const mutate=vi.fn();await expect(withStudyLock('account-a',mutate,true)).rejects.toThrow('cannot safely coordinate');expect(mutate).not.toHaveBeenCalled();
});
it('does not serialize unrelated accounts together',async()=>{
 vi.stubGlobal('navigator',{});let release!:()=>void;const first=withStudyLock('a',()=>new Promise<void>(r=>release=r));
 await new Promise(r=>setTimeout(r,0));expect(await withStudyLock('b',()=>42)).toBe(42);release();await first;
});

it('hands off Web Locks sequentially across concurrent callers and releases after errors',async()=>{
 const queues=new Map<string,Promise<unknown>>();
 const request=vi.fn((name:string,_options:{mode:string},callback:()=>Promise<unknown>)=>{
  const prev=queues.get(name)??Promise.resolve();
  const current=prev.catch(()=>{}).then(()=>callback());
  queues.set(name,current);
  return current;
 });
 vi.stubGlobal('navigator',{locks:{request}});

 const order:string[]=[];
 let release1!:()=>void;
 const p1=withStudyLock('acc',async()=>{
  order.push('p1:start');
  await new Promise<void>(r=>release1=r);
  order.push('p1:end');
  throw new Error('p1 error');
 });
 const p2=withStudyLock('acc',async()=>{
  order.push('p2:start');
  order.push('p2:end');
  return 'p2 done';
 });

 await new Promise(r=>setTimeout(r,0));
 expect(order).toEqual(['p1:start']);
 release1();
 await expect(p1).rejects.toThrow('p1 error');
 expect(await p2).toBe('p2 done');
 expect(order).toEqual(['p1:start','p1:end','p2:start','p2:end']);
});

it('rejects stale cross-tab writes waiting behind a restore while allowing waiting readers to observe restored data',async()=>{
 const queues=new Map<string,Promise<unknown>>();
 const request=vi.fn((name:string,_options:{mode:string},callback:()=>Promise<unknown>)=>{
  const prev=queues.get(name)??Promise.resolve();
  const current=prev.catch(()=>{}).then(()=>callback());
  queues.set(name,current);
  return current;
 });
 vi.stubGlobal('navigator',{locks:{request}});

 const {ProgressRepository}=await import('../src/lib/db/progress-repository');
 const {restoreStudyBackupSafely}=await import('../src/lib/db/study-backup');
 const storageMap=new Map<string,string>();
 const fakeStorage:Storage={
  getItem:(k:string)=>storageMap.get(k)??null,
  setItem:(k:string,v:string)=>{storageMap.set(k,v)},
  removeItem:(k:string)=>{storageMap.delete(k)},
  get length(){return storageMap.size},
  key:(i:number)=>[...storageMap.keys()][i]??null,
  clear:()=>storageMap.clear()
 };
 vi.stubGlobal('localStorage',fakeStorage);

 await ProgressRepository.updateProfile('local_user',{alias:'Original Student'});
 const backupPayload=JSON.stringify({
  format_version:1,
  storage_mode:'local',
  profile:{user_id:'local_user',alias:'Restored Student',academic_semester:'3-1',target_role:'Backend',preferred_daily_minutes:90,preferred_mode:'normal',theme:'system',onboarding_status:'completed',active_day_index:5},
  local_records:{
   foundation_career_os_local_user_profile:JSON.stringify({user_id:'local_user',alias:'Restored Student',academic_semester:'3-1',target_role:'Backend',preferred_daily_minutes:90,preferred_mode:'normal',theme:'system',onboarding_status:'completed',active_day_index:5})
  }
 });

 // Tab 1 simulates a restore operation holding the lock
 let finishRestore!:()=>void;
 const restorePromise=restoreStudyBackupSafely(backupPayload,fakeStorage);

 // Tab 2 simulates an overlapping write queued before restore completes
 const queuedWrite=ProgressRepository.updateProfile('local_user',{alias:'Stale Tab 2 Edit'});

 // Tab 3 simulates an overlapping read queued behind restore
 const queuedRead=ProgressRepository.getProfile('local_user');

 // Awaiting all operations
 await expect(restorePromise).resolves.toBeGreaterThanOrEqual(1);
 await expect(queuedWrite).rejects.toThrow('Workspace changed before the operation could run.');
 const finalProfile=await queuedRead;
 expect(finalProfile.alias).toBe('Restored Student');
 expect(finalProfile.active_day_index).toBe(5);
});
