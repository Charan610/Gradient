import {projectStorageKey,workspaceStorageKey} from '@/lib/account/workspace';
import {withStudyLock} from './study-lock';
import {lessonDraftRevision} from './lesson-drafts';
import {recoverStudyRestore} from './restore-recovery';
export type ProjectProgress={milestones:Record<string,boolean>;repoUrl:string;notes:string};
function read(key:string):ProjectProgress{
 const raw=localStorage.getItem(key);if(raw===null)return {milestones:{},repoUrl:'',notes:''};
 const value=JSON.parse(raw);
 if(!value||typeof value!=='object'||!value.milestones||typeof value.milestones!=='object'||Array.isArray(value.milestones)||Object.values(value.milestones).some(v=>typeof v!=='boolean')||typeof value.repoUrl!=='string'||typeof value.notes!=='string')throw Error('Saved project records are invalid; keep a recovery copy.');
 return value;
}
function operation<T>(id:string,run:(key:string)=>T,writing=false):Promise<T>{
 const revision=lessonDraftRevision();
 const profileKey=workspaceStorageKey('foundation_career_os_local_user_profile');const key=projectStorageKey(id);
 return withStudyLock(profileKey,()=>{if(key!==projectStorageKey(id)||writing&&(revision===null||revision!==lessonDraftRevision()))throw Error('Workspace changed before saving project work.');recoverStudyRestore(localStorage);return run(key)});
}
export function readProjectProgress(id:string){return operation(id,read)}
export function saveProjectProgress(id:string,patch:Partial<ProjectProgress>){return operation(id,key=>{const current=read(key);const next={...current,...patch,milestones:{...current.milestones,...patch.milestones}};localStorage.setItem(key,JSON.stringify(next));if(typeof window!=='undefined')window.dispatchEvent(new Event('foundation-progress'));return next},true)}
