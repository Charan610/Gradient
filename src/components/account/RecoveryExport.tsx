'use client';
import {useState} from 'react';
import {downloadBackup,exportRecoverySnapshotSafely,RecoveryIdentity} from '@/lib/db/backup-tools';
export function RecoveryExport({identity,onRecoveryReady}:{identity:RecoveryIdentity;onRecoveryReady?:(journal:string)=>void}){
 const [message,setMessage]=useState('');const [error,setError]=useState('');
 return <section><h2 style={{fontSize:18}}>Keep a copy of your saved work</h2><p>Your workspace could not finish opening. This tab previously verified the workspace for <strong>{identity.username}</strong>. You can download its saved study records while you restore access.</p><button className="buttonSecondary" onClick={async()=>{try{const snapshot=await exportRecoverySnapshotSafely(localStorage,identity);downloadBackup(snapshot.source);if(snapshot.journal&&onRecoveryReady){onRecoveryReady(snapshot.journal);setMessage('Backup download started. Keep the JSON file. Choose Try again to restore the original records from before the interrupted import.');}else setMessage('Backup download started. Keep the JSON file somewhere you can find it.');setError('');}catch(error){setError(error instanceof Error?error.message:'The saved work could not be read. Retry opening the workspace.');}}}>Download saved study backup</button>{message&&<p role="status">{message}</p>}{error&&<p role="alert">{error}</p>}</section>;
}
