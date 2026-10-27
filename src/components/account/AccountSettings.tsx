'use client';
import {useState} from 'react';
import Link from 'next/link';
import {useAccount,accountRequest} from './AccountProvider';
import {passwordSchema} from '@/lib/account/validation';
import styles from './Account.module.scss';
export function AccountSettings(){
 const {account}=useAccount();const [password,setPassword]=useState('');const [busy,setBusy]=useState(false);const [error,setError]=useState('');
 if(!account)return <section className={styles.panel}><h2>Your account</h2><p>You’re using a local workspace on this device.</p><Link className="buttonSecondary" href="/sign-up">Create an account</Link></section>;
 return <section className={styles.panel}><h2>Signed in as {account.username}</h2><p>{account.hasPassword?'Your account is protected with a password.':'You’re using a password-free account. Add a password to sign in on another browser.'} Study progress stays on this device; use a JSON backup to move it.</p>
 {!account.hasPassword&&<form onSubmit={async e=>{e.preventDefault();const result=passwordSchema.safeParse(password);if(!result.success){setError(result.error.issues[0].message);return;}setBusy(true);setError('');try{await accountRequest('password',{password});window.location.reload();}catch(caught){setError(caught instanceof Error?caught.message:'Please try again.');setBusy(false);}}}><label htmlFor="add-account-password">Choose a password</label><input id="add-account-password" type="password" autoComplete="new-password" minLength={10} maxLength={128} required value={password} onChange={e=>setPassword(e.target.value)} disabled={busy}/><p>At least 10 characters. Email password recovery is not available.</p><button className="buttonPrimary" disabled={busy}>Save password</button></form>}
 {error&&<p role="alert" className={styles.error}>{error}</p>}
 <button className="buttonSecondary" disabled={busy} onClick={async()=>{setBusy(true);setError('');try{await accountRequest('signout');window.location.replace('/');}catch(caught){setError(caught instanceof Error?caught.message:'Please try again.');setBusy(false);}}}>Sign out</button></section>;
}
