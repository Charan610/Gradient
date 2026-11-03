'use client';
import {useRef,useState} from 'react';
import {useAccount} from '@/components/account/AccountProvider';
import {ProgressRepository} from '@/lib/db/progress-repository';
import {cloudBackupRequest,parseCloudCopies,CloudCopy,MAX_CLOUD_BACKUP_BYTES,CloudBackupOutcomeUnknown} from '@/lib/db/cloud-backup-client';
import {parseStudyBackup} from '@/lib/db/study-backup';
import {downloadBackup} from '@/lib/db/backup-tools';
import styles from './Backup.module.scss';

export function CloudBackupControls(){
 const {account}=useAccount();
 const [copies,setCopies]=useState<CloudCopy[]>([]),[selected,setSelected]=useState('');
 const [busy,setBusy]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState('');
 const [needsRefresh,setNeedsRefresh]=useState(true);
 const active=useRef(false);
 if(!account)return null;
 const id=account.id;
 const refresh=async()=>{
  try{
  const response=await cloudBackupRequest(id,'GET');const data=await response.json();const rows=parseCloudCopies(data.backups);
  setCopies(rows);setSelected(previous=>rows.some(row=>row.id===previous)?previous:rows[0]?.id??'');
  setNeedsRefresh(false);
  return rows;
  }catch(error){setNeedsRefresh(true);throw error}
 };
 const run=async(operation:()=>Promise<void>)=>{
  if(active.current)return;active.current=true;setBusy(true);setError('');setMessage('');
  try{await operation()}catch(error){if(error instanceof CloudBackupOutcomeUnknown)setNeedsRefresh(true);setError(error instanceof Error?error.message:'Cloud backups are unavailable. Your local work has not changed.')}
  finally{active.current=false;setBusy(false)}
 };
 const refreshAfterMutation=async(success:string)=>{
  try{await refresh();setMessage(success)}
  catch{setNeedsRefresh(true);setMessage(`${success} The list could not refresh. Choose Refresh cloud copies before saving another.`)}
 };
 return <details onToggle={event=>{if(event.currentTarget.open)void run(async()=>{const rows=await refresh();if(!rows.length)setMessage('No cloud copies yet. Nothing is uploaded until you choose Save cloud copy.')})}}>
  <summary className={styles.fileLabel}>Optional cloud backups</summary>
  <p>Save a private copy to your signed-in account when you choose. Up to ten copies, 3 MB each. Cloud copies include your saved notes, projects, and applications. They do not sync automatically or replace this browser’s progress.</p>
  <div className={styles.actions} aria-busy={busy}>
   <button type="button" className="buttonSecondary" disabled={busy||needsRefresh} onClick={()=>{void run(async()=>{
    const source=await ProgressRepository.exportUserData();await cloudBackupRequest(id,'POST',{source});
    await refreshAfterMutation('Cloud copy saved. Your local progress has not changed.');
   })}}>Save cloud copy</button>
   <button type="button" className="buttonTertiary" disabled={busy} onClick={()=>{void run(async()=>{await refresh();setMessage('Cloud backup list refreshed.')})}}>Refresh cloud copies</button>
  </div>
  {copies.length>0&&<>
   <label htmlFor="cloud-copy" className={styles.fileLabel}>Saved cloud copy</label>
   <select id="cloud-copy" disabled={busy} value={selected} onChange={event=>setSelected(event.target.value)} style={{width:'100%',padding:'8px 10px',borderRadius:'8px',border:'1px solid var(--hairline)',backgroundColor:'var(--canvas)',color:'var(--ink)',fontSize:'13px'}}>
    {copies.map(copy=><option key={copy.id} value={copy.id}>{new Date(copy.created_at).toLocaleString()} · {Math.ceil(copy.byte_length/1024)} KB · {copy.id.slice(0,8)}</option>)}
   </select>
   <div className={styles.actions}>
    <button type="button" className="buttonSecondary" disabled={busy||!selected} onClick={()=>{void run(async()=>{
     const response=await cloudBackupRequest(id,'GET',{id:selected});const source=await response.text();
     if(new TextEncoder().encode(source).length>MAX_CLOUD_BACKUP_BYTES)throw Error('This cloud copy exceeds the supported size. Your local work has not changed.');
     parseStudyBackup(source);downloadBackup(source);setMessage('Cloud copy download started. Use Restore a study backup below to review it before replacing local records.');
    })}}>Download selected copy</button>
    <button type="button" className="buttonTertiary" disabled={busy||!selected} onClick={()=>{if(!window.confirm('Delete this cloud copy? Your local progress and other cloud copies will stay.'))return;void run(async()=>{
     await cloudBackupRequest(id,'DELETE',{id:selected});setCopies(previous=>previous.filter(copy=>copy.id!==selected));setSelected('');await refreshAfterMutation('Selected cloud copy deleted. Your local progress has not changed.');
    })}}>Delete selected cloud copy</button>
   </div>
  </>}
  {message&&<p role="status">{message}</p>}{error&&<p role="alert" className={styles.error}>{error}</p>}
 </details>;
}
