'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {ProgressRepository} from '@/lib/db/progress-repository';
import {parseStudyBackup} from '@/lib/db/study-backup';
import {offerBackup,backupCheckpoint,acknowledgeBackup,downloadBackup} from '@/lib/db/backup-tools';
import styles from './Backup.module.scss';
export function BackupReminder({completed}:{completed:number}){
 const [visible,setVisible]=useState(false);const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [message,setMessage]=useState('');
 useEffect(()=>{const refresh=()=>setVisible(offerBackup(completed,backupCheckpoint(localStorage)));refresh();window.addEventListener('gradient-backup',refresh);return()=>window.removeEventListener('gradient-backup',refresh);},[completed]);
 if(!visible)return message?<p className={styles.confirmation} role="status">{message}</p>:null;
 return <aside className={styles.reminder} aria-label="Keep a study backup"><div><h2>A copy you can keep</h2><p>Your work lives in this browser. Download a backup to keep it if you change devices or clear browser data.</p><Link href="/app/settings">How to restore a backup</Link></div><div className={styles.actions}><button className="buttonSecondary" disabled={busy} onClick={async()=>{setBusy(true);setError('');try{const source=await ProgressRepository.exportUserData();parseStudyBackup(source);downloadBackup(source);setMessage('Backup download started. Keep the JSON file somewhere you can find it.');acknowledgeBackup(completed);}catch{setError('Your backup could not be prepared. Keep this browser open and try again.');}finally{setBusy(false);}}}>{busy?'Preparing…':'Download backup'}</button><button className="buttonTertiary" disabled={busy} onClick={()=>acknowledgeBackup(completed)}>Later</button></div>{error&&<p role="alert" className={styles.error}>{error}</p>}</aside>;
}
