'use client';
import {useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight,Eye,EyeOff,LockKeyhole} from 'lucide-react';
import {signupSchema,signinSchema} from '@/lib/account/validation';
import {ProgressRepository} from '@/lib/db/progress-repository';
import {useAccount,accountRequest} from './AccountProvider';
import styles from './Account.module.scss';
export function AccountForm({signin=false,compact=false}:{signin?:boolean;compact?:boolean}){
 const {loading,configured,error:serviceError}=useAccount();
 const [username,setUsername]=useState('');const [password,setPassword]=useState('');const [protect,setProtect]=useState(signin);const [visible,setVisible]=useState(false);
 const [minutes,setMinutes]=useState(90);const [semester,setSemester]=useState('2-2');const [busy,setBusy]=useState(false);const [error,setError]=useState('');
 return <section className={`workspaceEntryCard ${styles.formCard}`} data-compact={compact}>
  <span className="phaseBadge"><LockKeyhole size={12} aria-hidden="true"/> {signin?'WELCOME BACK':'YOUR PERSONAL LEARNING SPACE'}</span>
  <h1>{signin?'Your next step is waiting.':'A name. A place to begin.'}</h1>
  <p>{signin?'Sign in with the username and password you chose.':'Choose your username. Add a password if you want to sign in again on another browser.'}</p>
  <form onSubmit={async event=>{
   event.preventDefault();if(busy||loading)return;setError('');
   if(serviceError){setError(serviceError);return;}
   const result=(signin?signinSchema:signupSchema).safeParse({username,password:signin||protect?password:'',minutes,semester});
   if(!result.success){setError(result.error.issues[0].message);return;}
   setBusy(true);
   try{
    if(configured)await accountRequest(signin?'signin':'signup',result.data);
    else if(!signin){await ProgressRepository.updateProfile('local_user',{alias:result.data.username,preferred_daily_minutes:minutes,academic_semester:semester});localStorage.setItem('gradient_onboarding_complete','yes');}
    else throw new Error('Account sign-in is temporarily unavailable. Please try again later.');
    window.location.assign('/app/today');
   }catch(caught){setError(caught instanceof Error?caught.message:'Could not save your details. Please try again.');setBusy(false);}
  }}>
   <label htmlFor={compact?'welcome-username':'account-username'}>Your username</label>
   <input id={compact?'welcome-username':'account-username'} autoFocus autoComplete="username" spellCheck={false} autoCapitalize="none" required minLength={3} maxLength={24} placeholder="e.g. charan_01" value={username} onChange={event=>setUsername(event.target.value)} aria-describedby={compact?'welcome-name-help':'name-help'} disabled={busy}/>
   <small id={compact?'welcome-name-help':'name-help'} className={styles.help}>3–24 characters. Start with a letter; dots and underscores are welcome.</small>
   {!signin&&configured&&<label className={styles.check}><input type="checkbox" checked={protect} onChange={event=>setProtect(event.target.checked)} disabled={busy}/>Protect my account with a password <span>Optional</span></label>}
   {(signin||protect)&&<><label htmlFor={compact?'welcome-password':'account-password'}>{signin?'Password':'Choose a password'}</label><div className={styles.password}><input id={compact?'welcome-password':'account-password'} type={visible?'text':'password'} autoComplete={signin?'current-password':'new-password'} minLength={signin?1:10} maxLength={128} required value={password} onChange={event=>setPassword(event.target.value)} disabled={busy}/><button type="button" aria-label={visible?'Hide password':'Show password'} onClick={()=>setVisible(value=>!value)}>{visible?<EyeOff size={17}/>:<Eye size={17}/>}</button></div>{!signin&&<small className={styles.help}>At least 10 characters. Keep it somewhere safe; email recovery is not available.</small>}</>}
   {!signin&&!compact&&<div className={styles.preferences}><div><label htmlFor="account-semester">Current semester</label><select id="account-semester" value={semester} onChange={e=>setSemester(e.target.value)} disabled={busy}>{['1-1','1-2','2-1','2-2','3-1','3-2','4-1','4-2'].map(value=><option key={value}>{value}</option>)}</select></div><div><label htmlFor="account-minutes">Session budget</label><select id="account-minutes" value={minutes} onChange={e=>setMinutes(Number(e.target.value))} disabled={busy}>{[45,60,90,120,150].map(value=><option key={value} value={value}>{value} minutes</option>)}</select></div></div>}
   {error&&<p className={styles.error} role="alert">{error}</p>}
   <button className="buttonPrimary" disabled={busy||loading}>{busy?'Opening your workspace…':loading?'Checking account access…':signin?'Sign in':configured?'Create my workspace':'Start on this device'}<ArrowUpRight size={16}/></button>
  </form>
  {!loading&&<p className="workspaceEntryNote">{configured?(signin?'Your account is saved securely. Study progress stays in this browser; use JSON backup to transfer it.':protect?'Your password is securely hashed. Study progress stays in this browser; use JSON backup to transfer it.':'Without a password, access stays with this browser. You can add a password later in Settings.'):'Account sign-in is temporarily unavailable. Your study profile can still be saved on this device.'}</p>}
  <p className={styles.switch}>{signin?<>New to Gradient? <Link href="/sign-up">Create a workspace</Link></>:configured?<>Already have a password? <Link href="/sign-in">Sign in</Link></>:<Link href="/">Back to Gradient</Link>}</p>
 </section>;
}
