import {accountJson,validAccountOrigin} from '@/lib/account/server';
import {createServerSideClient} from '@/lib/supabase/server';
import {parseStudyBackup} from '@/lib/db/study-backup';
import {MAX_CLOUD_BACKUP_BYTES} from '@/lib/db/cloud-backup-client';

export const dynamic='force-dynamic';
const table='gradient_study_backups';
const metadata='id,created_at,byte_length';
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
class BackupRequestError extends Error {constructor(message:string,readonly status:number){super(message)}}
async function context(request:Request,writing=false){
 if(writing&&!validAccountOrigin(request))throw new BackupRequestError('Submit this request from Gradient.',403);
 if(process.env.GRADIENT_CLOUD_BACKUPS_ENABLED!=='true')throw new BackupRequestError('Cloud backups are not configured yet. Local backups still work.',503);
 const client=await createServerSideClient();
 if(!client)throw new BackupRequestError('Cloud backups are unavailable. Local backups still work.',503);
 const {data:{user},error}=await client.auth.getUser();
 if(error||!user)throw new BackupRequestError('Sign in to use cloud backups.',401);
 // A session can change while a browser export is being prepared. Never put
 // account A's captured copy into account B just because its cookie changed.
 if(request.headers.get('x-gradient-account')!==user.id)throw new BackupRequestError('Your account changed. Reload before using cloud backups.',409);
 return {client,user};
}
function fail(error:unknown){return error instanceof BackupRequestError?accountJson({error:error.message},error.status):accountJson({error:'Cloud backups are unavailable. Your local records have not changed.'},503)}
function selectedId(request:Request,required=false){
 const id=new URL(request.url).searchParams.get('id');
 if((required||id!==null)&&(!id||!uuid.test(id)))throw new BackupRequestError('Choose a valid cloud backup.',400);
 return id;
}
async function boundedSource(request:Request):Promise<string>{
 if(!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))throw new BackupRequestError('Upload a Gradient JSON backup.',415);
 const declared=request.headers.get('content-length');
 if(declared&&Number(declared)>MAX_CLOUD_BACKUP_BYTES)throw new BackupRequestError('Cloud copies must be smaller than 3 MB. Keep a local JSON backup instead.',413);
 const reader=request.body?.getReader();if(!reader)throw new BackupRequestError('Choose a study backup.',400);
 const decoder=new TextDecoder('utf-8',{fatal:true});let bytes=0,source='';
 try{
  for(;;){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>MAX_CLOUD_BACKUP_BYTES){await reader.cancel();throw new BackupRequestError('Cloud copies must be smaller than 3 MB. Keep a local JSON backup instead.',413)}source+=decoder.decode(value,{stream:true})}
  source+=decoder.decode();
 }finally{reader.releaseLock()}
 try{parseStudyBackup(source)}catch{throw new BackupRequestError('Choose a valid version 1 Gradient study backup.',400)}
 return source;
}
export async function GET(request:Request){
 try{
  const {client,user}=await context(request);const id=selectedId(request);
  if(id){
   const {data,error}=await client.from(table).select('source').eq('user_id',user.id).eq('id',id).maybeSingle();
   if(error)throw error;if(!data)throw new BackupRequestError('This cloud backup was not found.',404);
   parseStudyBackup(data.source);
   return new Response(data.source,{headers:{'Content-Type':'application/json; charset=utf-8','Content-Disposition':'attachment; filename="gradient_cloud_backup.json"','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
  }
  const {data,error}=await client.from(table).select(metadata).eq('user_id',user.id).order('created_at',{ascending:false}).limit(10);
  if(error)throw error;return accountJson({backups:data??[]});
 }catch(error){return fail(error)}
}
export async function POST(request:Request){
 try{
  const {client,user}=await context(request,true);const source=await boundedSource(request);
  const {data:occupied,error:readError}=await client.from(table).select('slot').eq('user_id',user.id);
  if(readError)throw readError;
  const used=new Set((occupied??[]).map(row=>row.slot));
  const slot=Array.from({length:10},(_,i)=>i+1).find(value=>!used.has(value));
  if(!slot)throw new BackupRequestError('All ten cloud copies are in use. Download and delete a copy before saving another.',409);
  // Insert-only slots make racing saves fail with a conflict, never overwrite.
  const {data,error}=await client.from(table).insert({user_id:user.id,slot,source}).select(metadata).single();
  if(error?.code==='23505')throw new BackupRequestError('Another cloud copy was just saved. Refresh the cloud list and try again.',409);
  if(error)throw error;return accountJson({backup:data},201);
 }catch(error){return fail(error)}
}
export async function DELETE(request:Request){
 try{
  const {client,user}=await context(request,true);const id=selectedId(request,true)!;
  const {data,error}=await client.from(table).delete().eq('user_id',user.id).eq('id',id).select('id');
  if(error)throw error;if(!data?.length)throw new BackupRequestError('This cloud backup was not found.',404);
  return accountJson({deleted:id});
 }catch(error){return fail(error)}
}
