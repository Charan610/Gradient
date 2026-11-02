import {parseStudyBackup} from './study-backup';
import {workspaceStorageKey} from '@/lib/account/workspace';

export type RecoveryIdentity={id:string|null;username:string};
export const RECOVERY_SESSION_KEY='gradient_verified_workspace';
export function readRecoveryIdentity(storage:Storage):RecoveryIdentity|null {
 try {const value=JSON.parse(storage.getItem(RECOVERY_SESSION_KEY)||'null');return value&&typeof value.username==='string'&&(value.id===null||typeof value.id==='string'&&/^[a-zA-Z0-9_-]{1,128}$/.test(value.id))?value:null;}catch{return null;}
}
/** Read only the identity already verified in this tab, without switching the active workspace. */
export function exportRecoveryBackup(storage:Storage,identity:RecoveryIdentity):string {
 const scope=identity.id?`gradient_workspace_${identity.id}_`:'';
 const prefix='foundation_career_os_local_user_';
 const local_records:Record<string,string>={};
 for(let i=0;i<storage.length;i++){
  const full=storage.key(i)!;
  if(scope&&!full.startsWith(scope))continue;
  const key=scope?full.slice(scope.length):full;
  if(key.startsWith('gradient_workspace_'))continue;
  const suffix=key.startsWith(prefix)?key.slice(prefix.length):'';
  if(key.startsWith('foundation_proj_')||['profile','reviews','applications'].includes(suffix)||/^(tasks|day)_P\d+-D\d+$/.test(suffix)||/^gate_P\d+$/.test(suffix))local_records[key]=storage.getItem(full)!;
 }
 // A pending completion contains the coherent intended state of those records.
 const pending=storage.getItem(`${scope}${prefix}completion_journal`);
 if(pending){
  const journal=JSON.parse(pending);
  if(journal.version!==1||!/^P\d+-D\d+$/.test(journal.dayId)||!journal.records)throw new Error('This workspace needs save recovery before it can be exported. Retry opening it first.');
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
