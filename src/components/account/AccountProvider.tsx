'use client';
import {createContext,useContext,useEffect,useState} from 'react';
import {usePathname} from 'next/navigation';
import type {StudyAccount} from '@/lib/account/validation';
import {initializeWorkspace,workspaceStorageKey} from '@/lib/account/workspace';
import {ProgressRepository} from '@/lib/db/progress-repository';
import {AccountForm} from './AccountForm';
import styles from './Account.module.scss';
type AccountState={loading:boolean;configured:boolean;account:StudyAccount|null;localReady:boolean;error:string};
const Context=createContext<AccountState>({loading:true,configured:false,account:null,localReady:false,error:''});
export const useAccount=()=>useContext(Context);
export async function accountRequest(action:string,body:Record<string,unknown>={}){
 const response=await fetch(`/api/account/${action}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 const result=await response.json();if(!response.ok)throw new Error(result.error||'Please try again.');return result;
}
export function AccountProvider({children}:{children:React.ReactNode}){
 const pathname=usePathname();
 const [state,setState]=useState<AccountState>({loading:true,configured:false,account:null,localReady:false,error:''});
 const [dismissed,setDismissed]=useState(false);
 useEffect(()=>{
  let cancelled=false;
  (async()=>{
   try{
    const response=await fetch('/api/account',{cache:'no-store'});const data=await response.json();if(!response.ok)throw new Error(data.error);
    if(cancelled)return;
    initializeWorkspace(data.account?.id||null);
    if(data.account&&!localStorage.getItem(workspaceStorageKey('foundation_career_os_local_user_profile'))){await ProgressRepository.updateProfile('local_user',{alias:data.account.username,academic_semester:data.account.semester,preferred_daily_minutes:data.account.minutes});}
    const profile=await ProgressRepository.getProfile();
    const localReady=localStorage.getItem('gradient_onboarding_complete')==='yes'||profile.alias!=='Student Engineer';
    if(!cancelled)setState({loading:false,configured:data.configured,account:data.account,localReady,error:''});
   }catch{if(!cancelled)setState(previous=>({...previous,loading:false,error:'We couldn’t check your sign-in. Please reload to try again.'}));}
  })();return()=>{cancelled=true};
 },[]);
 const workspace=pathname.startsWith('/app/');
 const needsSetup=!state.account&&(!state.localReady||state.configured);
 const showPopup=pathname==='/'&&!state.loading&&!state.error&&needsSetup&&!dismissed;
 return <Context.Provider value={state}>
  {workspace&&(state.loading||state.error||needsSetup)?<main className="workspaceEntry">{state.loading?<p role="status">Opening your workspace…</p>:state.error?<section className="workspaceEntryCard"><h1>Let’s reconnect.</h1><p role="alert">{state.error}</p><button className="buttonPrimary" onClick={()=>window.location.reload()}>Try again</button></section>:<AccountForm/>}</main>:children}
  {showPopup&&<WelcomeDialog onClose={()=>setDismissed(true)}/>}
 </Context.Provider>;
}
function WelcomeDialog({onClose}:{onClose:()=>void}){
 useEffect(()=>{const dialog=document.getElementById('gradient-welcome') as HTMLDialogElement;const previous=document.activeElement;dialog.showModal();return()=>{dialog.close();if(previous instanceof HTMLElement)previous.focus()};},[]);
 return <dialog id="gradient-welcome" className={styles.dialog} onCancel={onClose}><button className={styles.close} aria-label="Explore the website first" onClick={onClose}>×</button><AccountForm compact/><button className={styles.explore} onClick={onClose}>Explore the website first</button></dialog>;
}
