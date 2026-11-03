import {workspaceStorageKey} from '@/lib/account/workspace';
import {parseStudyBackup} from './study-backup';

// Leave headroom below common serverless request/response limits. Local exports
// retain their existing 5 MiB limit and never depend on this optional service.
export const MAX_CLOUD_BACKUP_BYTES=3*1024*1024;
export type CloudCopy={id:string;created_at:string;byte_length:number};
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export class CloudBackupOutcomeUnknown extends Error {
 constructor(){super('The cloud save outcome is unknown. Refresh cloud copies before saving again; a copy may already exist. Your local work has not changed.');this.name='CloudBackupOutcomeUnknown'}
}
export function parseCloudCopies(value:unknown):CloudCopy[]{
 if(!Array.isArray(value)||value.length>10||value.some(row=>!row||typeof row.id!=='string'||!uuid.test(row.id)||typeof row.created_at!=='string'||!Number.isFinite(Date.parse(row.created_at))||!Number.isInteger(row.byte_length)||row.byte_length<2||row.byte_length>MAX_CLOUD_BACKUP_BYTES))throw Error('The cloud backup list could not be read. Your local work has not changed.');
 return value.map(({id,created_at,byte_length})=>({id,created_at,byte_length}));
}
export async function cloudBackupRequest(accountId:string,method:'GET'|'POST'|'DELETE',options:{id?:string;source?:string}={}):Promise<Response>{
 const check=()=>{if(workspaceStorageKey('')!==`gradient_workspace_${accountId}_`)throw Error('Your workspace changed. Reload before using cloud backups.')};
 check();
 if(options.id&&!uuid.test(options.id))throw Error('Choose a valid cloud copy.');
 if(method==='POST'){
  if(!options.source||new TextEncoder().encode(options.source).length>MAX_CLOUD_BACKUP_BYTES)throw Error('Cloud copies must be smaller than 3 MB. Keep a local JSON backup instead.');
  parseStudyBackup(options.source);
 }
 let response:Response;
 try{response=await fetch(`/api/backups${options.id?'?id='+encodeURIComponent(options.id):''}`,{method,credentials:'same-origin',cache:'no-store',redirect:'error',headers:{'Content-Type':'application/json','x-gradient-account':accountId},body:method==='POST'?options.source:undefined,signal:AbortSignal.timeout(15000)})}
 catch{if(method==='POST')throw new CloudBackupOutcomeUnknown();throw Error('The cloud request could not finish. Refresh the list before retrying. Your local work has not changed.')}
 check();
 if(!response.ok){if(method==='POST'&&response.status>=500)throw new CloudBackupOutcomeUnknown();let message='Cloud backups are unavailable. Your local work has not changed.';try{const body=await response.json();if(typeof body.error==='string')message=body.error}catch{}throw Error(message)}
 return response;
}
