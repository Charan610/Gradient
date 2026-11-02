import {beforeEach,afterEach,describe,it,expect,vi} from 'vitest';
import {ProgressRepository} from '../src/lib/db/progress-repository';
import {parseStudyBackup,restoreStudyBackup} from '../src/lib/db/study-backup';
import {LEARNING_DAYS} from '../src/lib/db/curriculum-data';
import {initializeWorkspace,workspaceStorageKey} from '../src/lib/account/workspace';

let values:Map<string,string>;
let storage:Storage;
beforeEach(()=>{
 initializeWorkspace('phase1-account');values=new Map();
 storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>{values.set(k,v)},removeItem:k=>{values.delete(k)},key:i=>[...values.keys()][i]??null,get length(){return values.size},clear:()=>values.clear()};
 vi.stubGlobal('localStorage',storage);
});
afterEach(()=>{initializeWorkspace(null);vi.unstubAllGlobals()});
const key=(suffix:string)=>workspaceStorageKey(`foundation_career_os_local_user_${suffix}`);
async function ready(){await ProgressRepository.getProfile();for(const t of LEARNING_DAYS[0].tasks.filter(t=>t.required))await ProgressRepository.updateTaskProgress('local_user','P0-D01',t.id,'completed','Original evidence');}

describe('Completion failure recovery',()=>{
 for(const suffix of ['day_P0-D01','profile','reviews'])it(`can retry when the ${suffix} write fails`,async()=>{
  await ready();const set=storage.setItem;let failed=false;
  storage.setItem=(k,v)=>{if(k===key(suffix)&&!failed){failed=true;throw new Error('Storage unavailable')}set(k,v)};
  await expect(ProgressRepository.finishLearningDay('local_user','P0-D01')).rejects.toThrow();
  storage.setItem=set;
  expect((await ProgressRepository.finishLearningDay('local_user','P0-D01')).success).toBe(true);
  expect((await ProgressRepository.getProfile()).active_day_index).toBe(2);
  expect((await ProgressRepository.getDayProgress('local_user','P0-D01'))?.state).toBe('completed');
  expect(await ProgressRepository.getDueReviews('local_user',2)).toHaveLength(1);
  expect(Object.values(await ProgressRepository.getDayTaskProgresses('local_user','P0-D01'))[0].evidence_text).toBe('Original evidence');
 });
 it('repairs legacy completed records whose profile and recall writes were interrupted',async()=>{
  await ready();storage.setItem(key('day_P0-D01'),JSON.stringify({user_id:'local_user',learning_day_id:'P0-D01',state:'completed',time_spent_minutes:90,notes:'Keep this reflection'}));
  await ProgressRepository.finishLearningDay('local_user','P0-D01');
  expect((await ProgressRepository.getProfile()).active_day_index).toBe(2);
  expect(await ProgressRepository.getDueReviews('local_user',2)).toHaveLength(1);
  expect((await ProgressRepository.getDayProgress('local_user','P0-D01'))?.notes).toBe('Keep this reflection');
 });
});
describe('Portable mature recall history',()=>{
 it('round trips all five actual scheduler states without resetting confidence',async()=>{
  await ProgressRepository.scheduleReview('local_user','P0.01','Compile?','Translation.',1);
  const [review]=await ProgressRepository.getDueReviews('local_user',2);
  for(let i=1;i<=5;i++){
   const source=await ProgressRepository.exportUserData();
   expect(()=>parseStudyBackup(source)).not.toThrow();
   const before=storage.getItem(key('reviews'));
   restoreStudyBackup(source,storage);
   expect(storage.getItem(key('reviews'))).toBe(before);
   await ProgressRepository.recordReviewAttempt('local_user',review.id,'stable');
  }
 });
});

it('finishes an interrupted commit when the workspace is reopened, without a second completion click',async()=>{
 await ready();const set=storage.setItem;let fail=true;
 storage.setItem=(k,v)=>{if(k===key('reviews')&&fail)throw new Error('quota');set(k,v)};
 await expect(ProgressRepository.finishLearningDay('local_user','P0-D01')).rejects.toThrow('quota');
 fail=false;
 expect((await ProgressRepository.getProfile()).active_day_index).toBe(2);
 expect((await ProgressRepository.getDayProgress('local_user','P0-D01'))?.state).toBe('completed');
 expect(await ProgressRepository.getDueReviews('local_user',2)).toHaveLength(1);
 expect(storage.getItem(key('completion_journal'))).toBeNull();
});
it('a local reset removes an interrupted commit so it cannot resurrect erased study records',async()=>{
 await ready();const set=storage.setItem;
 storage.setItem=(k,v)=>{if(k===key('reviews'))throw new Error('quota');set(k,v)};
 await expect(ProgressRepository.finishLearningDay('local_user','P0-D01')).rejects.toThrow();
 storage.setItem=set;await ProgressRepository.clearAllUserData();
 expect((await ProgressRepository.getProfile()).active_day_index).toBe(1);
 expect(await ProgressRepository.getDayProgress('local_user','P0-D01')).toBeNull();
 expect(await ProgressRepository.getDueReviews('local_user',2)).toEqual([]);
});
