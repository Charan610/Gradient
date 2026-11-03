'use client';
import {createContext,useContext,useEffect,useRef,useState} from 'react';
import {usePathname} from 'next/navigation';
import type {StudyAccount} from '@/lib/account/validation';
import {initializeWorkspace,workspaceStorageKey} from '@/lib/account/workspace';
import {ProgressRepository} from '@/lib/db/progress-repository';
import {AccountForm} from './AccountForm';
import {RecoveryExport} from './RecoveryExport';
import {readRecoveryIdentity,RECOVERY_SESSION_KEY,RecoveryIdentity} from '@/lib/db/backup-tools';
import {BrandLoader} from '@/components/ui/BrandLoader';

type AccountState={loading:boolean;configured:boolean;account:StudyAccount|null;localReady:boolean;error:string};
const Context=createContext<AccountState>({loading:true,configured:false,account:null,localReady:false,error:''});
export const useAccount=()=>useContext(Context);
export async function accountRequest(action:string,body:Record<string,unknown>={}){
 const response=await fetch(`/api/account/${action}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 const result=await response.json();if(!response.ok)throw new Error(result.error||'Please try again.');return result;
}
export function AccountProvider({children}:{children:React.ReactNode}){
 const pathname=usePathname();
 const [recovery,setRecovery]=useState<RecoveryIdentity|null>(null);
 const [state,setState]=useState<AccountState>({loading:true,configured:false,account:null,localReady:false,error:''});
 const [isExiting,setIsExiting]=useState(false);
 const [loaderVisible,setLoaderVisible]=useState(true);
 const mountTimeRef=useRef<number>(Date.now());

 useEffect(()=>{
  let cancelled=false;
  let accountChecked=false;
  let verified:RecoveryIdentity|null=null;
  const controller=new AbortController();
  const timeout=window.setTimeout(()=>controller.abort(),8000);
  (async()=>{
   try{
    const response=await fetch('/api/account',{cache:'no-store',signal:controller.signal});const data=await response.json();if(!response.ok)throw new Error(data.error);
    if(cancelled)return;
    accountChecked=true;
    let previousIdentity:RecoveryIdentity|null=null;
    try{previousIdentity=readRecoveryIdentity(sessionStorage)}catch{}
    verified=data.account?{id:data.account.id,username:data.account.username}:!data.configured&&previousIdentity?.id===null?previousIdentity:null;
    try{if(verified)sessionStorage.setItem(RECOVERY_SESSION_KEY,JSON.stringify(verified));else sessionStorage.removeItem(RECOVERY_SESSION_KEY)}catch{}
    initializeWorkspace(data.account?.id||null);
    if(data.account&&!localStorage.getItem(workspaceStorageKey('foundation_career_os_local_user_profile'))){await ProgressRepository.updateProfile('local_user',{alias:data.account.username,academic_semester:data.account.semester,preferred_daily_minutes:data.account.minutes});}
    const profile=await ProgressRepository.getProfile();
    const localReady=localStorage.getItem('gradient_onboarding_complete')==='yes'||profile.alias!=='Student Engineer';
    try{if(data.account||!data.configured&&localReady)sessionStorage.setItem(RECOVERY_SESSION_KEY,JSON.stringify({id:data.account?.id||null,username:data.account?.username||profile.alias}));}catch{}
    if(!cancelled)setState({loading:false,configured:data.configured,account:data.account,localReady,error:''});
   }catch{if(!cancelled){try{setRecovery(verified??readRecoveryIdentity(sessionStorage))}catch{}setState(previous=>({...previous,loading:false,error:accountChecked?'Your account check finished, but browser storage could not open your saved work. Keep a copy below if available, check browser storage, then try again.':'We couldn’t check your sign-in. Your saved work has not been reset. Try again when the connection is ready.'}));}}finally{window.clearTimeout(timeout);}
  })();return()=>{cancelled=true;window.clearTimeout(timeout);controller.abort()};
 },[]);

 useEffect(()=>{
  if(!state.loading){
   const needsSetup=!state.account&&(!state.localReady||state.configured);
   if(state.error||needsSetup){
    setLoaderVisible(false);
   }else{
    const elapsed=Date.now()-mountTimeRef.current;
    const remainingWait=Math.max(0,550-elapsed);
    const timer=window.setTimeout(()=>setIsExiting(true),remainingWait);
    return ()=>window.clearTimeout(timer);
   }
  }
 },[state.loading,state.error,state.account,state.localReady,state.configured]);

 const workspace=pathname.startsWith('/app/');
 const needsSetup=!state.account&&(!state.localReady||state.configured);

 return <Context.Provider value={state}>
  {workspace&&(state.error||needsSetup)&&!loaderVisible?(
   <main className="workspaceEntry">
    {state.error?<section className="workspaceEntryCard"><h1>Let’s reconnect.</h1><p role="alert">{state.error}</p><button className="buttonPrimary" onClick={()=>window.location.reload()}>Try again</button>{recovery&&<RecoveryExport identity={recovery}/>}</section>:<AccountForm/>}
   </main>
  ):(
   <>
    {(!workspace||!state.loading||isExiting)&&children}
    {workspace&&loaderVisible&&(
     <BrandLoader
      message="Opening your workspace…"
      fullscreen
      exiting={isExiting}
      onExited={()=>setLoaderVisible(false)}
     />
    )}
   </>
  )}
 </Context.Provider>;
}
