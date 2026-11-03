'use client';
import {useCallback,useEffect,useLayoutEffect,useRef,useState} from 'react';
import {ProgressRepository} from '@/lib/db/progress-repository';
import {lessonDraftRevision} from '@/lib/db/lesson-drafts';
import {workspaceStorageKey} from '@/lib/account/workspace';
import styles from './LessonNotes.module.scss';
export function LessonNotes({dayId,initialNotes}:{dayId:string;initialNotes:string}){
 const [value,setValue]=useState(initialNotes);
 const [status,setStatus]=useState<'saved'|'editing'|'saving'|'error'>('saved');
 const [recovered,setRecovered]=useState(false);
 const latest=useRef(initialNotes);const saved=useRef(initialNotes);const mounted=useRef(true);
 const [revision]=useState(()=>lessonDraftRevision());
 const draftKey=useRef(workspaceStorageKey(`gradient_lesson_draft_${dayId}_${revision}`)).current;
 const pending=useRef(Promise.resolve());
 const pendingCount=useRef(0);
 const save=useCallback((text=latest.current)=>{
  pendingCount.current++;
  const request=pending.current.then(async()=>{
   if(revision===null||workspaceStorageKey(`gradient_lesson_draft_${dayId}_${revision}`)!==draftKey||revision!==lessonDraftRevision()){if(mounted.current)setStatus('error');return;}
   if(text===saved.current){
    if(latest.current===text){try{sessionStorage.removeItem(draftKey)}catch{}if(mounted.current)setStatus('saved');}
    return;
   }
   if(mounted.current)setStatus('saving');
   try{
    await ProgressRepository.updateDayNotes('local_user',dayId,text);
    // A restore may invalidate this editor while its write is completing.
    if(workspaceStorageKey(`gradient_lesson_draft_${dayId}_${revision}`)!==draftKey||revision!==lessonDraftRevision()){if(mounted.current)setStatus('error');return;}
    saved.current=text;
    if(latest.current===text){try{sessionStorage.removeItem(draftKey)}catch{}if(mounted.current){setStatus('saved');setRecovered(false)}}
    else {try{sessionStorage.setItem(draftKey,latest.current)}catch{}}
   }catch{if(mounted.current)setStatus('error');}
  }).finally(()=>{pendingCount.current--;});
  pending.current=request;
  return request;
 },[dayId,draftKey,revision]);
 useEffect(()=>{
  mounted.current=true;
  try{const draft=sessionStorage.getItem(draftKey);if(draft!==null&&draft!==initialNotes){latest.current=draft;setValue(draft);setStatus('editing');setRecovered(true)}}catch{}
  return()=>{mounted.current=false;if(pendingCount.current||latest.current!==saved.current)void save(latest.current)};
 // The keyed lesson component owns its draft for this mount.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[dayId,draftKey,save]);
 useLayoutEffect(()=>{if(!pendingCount.current&&latest.current===saved.current)return;try{sessionStorage.setItem(draftKey,latest.current)}catch{}const timer=window.setTimeout(()=>{void save()},900);return()=>window.clearTimeout(timer)},[value,save,draftKey]);
 useEffect(()=>{const guard=(event:BeforeUnloadEvent)=>{if(pendingCount.current||latest.current!==saved.current){event.preventDefault();event.returnValue=''}};window.addEventListener('beforeunload',guard);return()=>window.removeEventListener('beforeunload',guard)},[]);
 return <section className={styles.card} aria-labelledby={`notes-title-${dayId}`}><h2 id={`notes-title-${dayId}`}>Your lesson notes</h2><label htmlFor={`notes-${dayId}`}>Keep an explanation, a code link, or a question.</label><textarea id={`notes-${dayId}`} rows={7} value={value} aria-describedby={`notes-status-${dayId}`} placeholder="What made sense? What would you try next?" onChange={event=>{const text=event.target.value;latest.current=text;setValue(text);setStatus(text===saved.current?'saved':'editing');try{if(text===saved.current)sessionStorage.removeItem(draftKey);else sessionStorage.setItem(draftKey,text)}catch{}}} onBlur={()=>{void save()}}/><div className={styles.footer}><button type="button" className="buttonSecondary" disabled={status==='saving'||value===saved.current} onClick={()=>{void save()}}>{status==='saving'?'Saving…':'Save notes'}</button><span id={`notes-status-${dayId}`} role={status==='error'?'alert':'status'}>{status==='error'?'Notes could not be saved. Your text is still here; keep a copy and retry.':status==='saving'?'Saving on this device…':recovered?'Recovered a draft from this tab.':status==='editing'?'Changes waiting to save.':value?'Saved on this device.':'Notes save on this device as you write.'}</span></div><p>Saved notes are included in your study backup. Unsaved tab drafts are not.</p></section>;
}
