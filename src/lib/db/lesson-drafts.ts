import {workspaceStorageKey,portableStorageKey} from '@/lib/account/workspace';
export const lessonDraftRevisionKey=()=>workspaceStorageKey('gradient_notes_revision');
export const newLessonDraftRevision=()=>`${Date.now()}-${Math.random().toString(36).slice(2)}`;
export function lessonDraftRevision(){try{return typeof localStorage==='undefined'?'initial':localStorage.getItem(lessonDraftRevisionKey())??'initial'}catch{return null}}
/** Only clear this workspace's tab drafts. A shared revision invalidates other tabs. */
export function clearLessonDrafts(){
 try{if(typeof sessionStorage==='undefined')return;const keys:string[]=[];for(let i=0;i<sessionStorage.length;i++){const key=sessionStorage.key(i)!;if(portableStorageKey(key)?.startsWith('gradient_lesson_draft_'))keys.push(key)}keys.forEach(key=>sessionStorage.removeItem(key))}catch{/* Storage may be unavailable; the revision still invalidates old drafts. */}
}
