import { LESSON_ID, LESSON_STORAGE_SUFFIX } from './lesson-identity';
import {readStudyRestoreBefore,recoverStudyRestore,studyRestoreJournalKey} from './restore-recovery';
import {parseStudyBackup} from './study-backup';
import {workspaceStorageKey} from '@/lib/account/workspace';
import {withStudyLock} from './study-lock';

export type RecoveryIdentity={id:string|null;username:string};
export const RECOVERY_SESSION_KEY='gradient_verified_workspace';
function recoveryScope(identity:RecoveryIdentity):string {
 if(identity.id!==null&&!/^[a-zA-Z0-9_-]{1,128}$/.test(identity.id))throw Error('Invalid recovery identity.');
 return identity.id?`gradient_workspace_${identity.id}_`:'';
}
/** Browser boundary: use the verified identity's lock, without changing accounts.
 * Read the undo image directly rather than running destructive recovery.
 */
export async function exportRecoverySnapshotSafely(storage:Storage,identity:RecoveryIdentity):Promise<{source:string;journal:string|null}>{
 const scope=recoveryScope(identity);
 return withStudyLock(`${scope}foundation_career_os_local_user_profile`,()=>({source:exportRecoveryBackup(storage,identity),journal:storage.getItem(studyRestoreJournalKey(scope))}),true);
}
export async function exportRecoveryBackupSafely(storage:Storage,identity:RecoveryIdentity):Promise<string>{
 return (await exportRecoverySnapshotSafely(storage,identity)).source;
}
/** Call only after the server confirms accounts are unconfigured. This validates
 * legacy local records without discovering or selecting any account workspace.
 */
export async function readLocalRecoveryIdentity(storage:Storage):Promise<RecoveryIdentity|null>{
 try{
  const source=await exportRecoveryBackupSafely(storage,{id:null,username:'Local learner'});
  return {id:null,username:JSON.parse(source).profile.alias};
 }catch{return null;}
}
/** Explicit retry after offering a download, never an ordinary read-side rollback.
 * A changed/finished journal requires a fresh account check, not replay of old work.
 */
export async function recoverDownloadedStudyBackup(storage:Storage,identity:RecoveryIdentity,journal:string):Promise<boolean>{
 const scope=recoveryScope(identity);
 return withStudyLock(`${scope}foundation_career_os_local_user_profile`,()=>{
  if(workspaceStorageKey('')!==scope)throw Error('Workspace changed before recovery.');
  if(storage.getItem(studyRestoreJournalKey(scope))!==journal)return false;
  recoverStudyRestore(storage,scope);
  return true;
 },true);
}
export function readRecoveryIdentity(storage:Storage):RecoveryIdentity|null {
 try {const value=JSON.parse(storage.getItem(RECOVERY_SESSION_KEY)||'null');return value&&typeof value.username==='string'&&(value.id===null||typeof value.id==='string'&&/^[a-zA-Z0-9_-]{1,128}$/.test(value.id))?value:null;}catch{return null;}
}
/** Read only the identity already verified in this tab, without switching the active workspace. */
export function exportRecoveryBackup(storage:Storage,identity:RecoveryIdentity):string {
 const scope=identity.id?`gradient_workspace_${identity.id}_`:'';
 const prefix='foundation_career_os_local_user_';
 const local_records:Record<string,string>={};
 const before=readStudyRestoreBefore(storage,scope);
 for(let i=0;i<storage.length;i++){
  const full=storage.key(i)!;
  if(scope&&!full.startsWith(scope))continue;
  const key=scope?full.slice(scope.length):full;
  if(key.startsWith('gradient_workspace_'))continue;
  const suffix=key.startsWith(prefix)?key.slice(prefix.length):'';
  if(key.startsWith('foundation_proj_')||['profile','reviews','applications'].includes(suffix)||LESSON_STORAGE_SUFFIX.test(suffix)||/^gate_P\d+$/.test(suffix))local_records[key]=storage.getItem(full)!;
 }
 // A failed restore may leave only a partial physical set. Export the durable
 // original image without attempting storage writes, even if quota is still blocked.
 if(before)for(const [full,value] of Object.entries(before)){
  const key=full.slice(scope.length);
  const suffix=key.startsWith(prefix)?key.slice(prefix.length):'';
  if(key.startsWith('foundation_proj_')||['profile','reviews','applications'].includes(suffix)||LESSON_STORAGE_SUFFIX.test(suffix)||/^gate_P\d+$/.test(suffix)){
   if(value===null)delete local_records[key];else local_records[key]=value;
  }
 }
 // A pending completion contains the coherent intended state of those records.
 const completionKey=`${scope}${prefix}completion_journal`;
 const pending=before&&Object.prototype.hasOwnProperty.call(before,completionKey)?before[completionKey]:storage.getItem(completionKey);
 if(pending){
  const journal=JSON.parse(pending);
  if(journal.version!==1||!LESSON_ID.test(journal.dayId)||!journal.records)throw new Error('This workspace needs save recovery before it can be exported. Retry opening it first.');
  const allowed=['profile','reviews',`day_${journal.dayId}`].map(suffix=>`${scope}${prefix}${suffix}`);
  if(Object.keys(journal.records).length!==3||Object.keys(journal.records).some(key=>!allowed.includes(key)))throw new Error('The saved recovery record could not be read.');
  for(const full of allowed)local_records[full.slice(scope.length)]=journal.records[full];
 }
 const profile=JSON.parse(local_records[`${prefix}profile`]||'null');
 if(!profile)throw new Error('No saved study profile is available for this workspace.');
 const source=JSON.stringify({format_version:1,storage_mode:'local',exported_at:new Date().toISOString(),profile,local_records},null,2);
 parseStudyBackup(source);
 return source;
}
export function offerBackup(completed:number,checkpoint:number|null):boolean {
 return completed>0&&(checkpoint===null||completed-checkpoint>=5);
}
export function backupCheckpoint(storage:Storage):number|null {
 try{const raw=storage.getItem(workspaceStorageKey('gradient_backup_checkpoint'));if(raw===null)return null;const n=Number(raw);return Number.isInteger(n)&&n>=0?n:null;}catch{return null;}
}
export function acknowledgeBackup(completed:number){
 try{localStorage.setItem(workspaceStorageKey('gradient_backup_checkpoint'),String(completed));}catch{/* Download success does not depend on remembering this preference. */}
 window.dispatchEvent(new Event('gradient-backup'));
}
/** Browser download initiation is observable; saving a file to disk is not. */
export function downloadBackup(source:string){
 const blob=new Blob([source],{type:'application/json'});
 const url=URL.createObjectURL(blob);
 const a=document.createElement('a');a.href=url;a.download=`gradient_study_${new Date().toISOString().replace(/[:.]/g,'-')}.json`;
 document.body.appendChild(a);a.click();a.remove();
 window.setTimeout(()=>URL.revokeObjectURL(url),1000);
}
