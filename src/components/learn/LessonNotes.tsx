'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {ProgressRepository} from '@/lib/db/progress-repository';
import {workspaceStorageKey} from '@/lib/account/workspace';
import styles from './LessonNotes.module.scss';
export function LessonNotes({dayId,initialNotes}:{dayId:string;initialNotes:string}){
 const [value,setValue]=useState(initialNotes);
 const [status,setStatus]=useState<'saved'|'editing'|'saving'|'error'>('saved');
 const [recovered,setRecovered]=useState(false);
 const latest=useRef(initialNotes);const saved=useRef(initialNotes);const mounted=useRef(true);
 const draftKey=useRef(workspaceStorageKey(`gradient_lesson_draft_${dayId}`)).current;
 const save=useCallback(async(text=latest.current)=>{
  if(text===saved.current)return;
  if(mounted.current)setStatus('saving');
  try{
   await ProgressRepository.updateDayNotes('local_user',dayId,text);saved.current=text;
   if(latest.current===text){try{sessionStorage.removeItem(draftKey)}catch{}if(mounted.current){setStatus('saved');setRecovered(false)}}
  }catch{if(mounted.current)setStatus('error');}
 },[dayId,draftKey]);
 useEffect(()=>{
  mounted.current=true;
  try{const draft=sessionStorage.getItem(draftKey);if(draft!==null&&draft!==initialNotes){latest.current=draft;setValue(draft);setStatus('editing');setRecovered(true)}}catch{}
  return()=>{mounted.current=false;if(latest.current!==saved.current)void save(latest.current)};
 // The keyed lesson component owns its draft for this mount.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[dayId,draftKey,save]);
 useEffect(()=>{if(latest.current===saved.current)return;const timer=window.setTimeout(()=>{void save()},900);return()=>window.clearTimeout(timer)},[value,save]);
 useEffect(()=>{const guard=(event:BeforeUnloadEvent)=>{if(latest.current!==saved.current){event.preventDefault();event.returnValue=''}};window.addEventListener('beforeunload',guard);return()=>window.removeEventListener('beforeunload',guard)},[]);
 return <section className={styles.card} aria-labelledby={`notes-title-${dayId}`}><h2 id={`notes-title-${dayId}`}>Your lesson notes</h2><label htmlFor={`notes-${dayId}`}>Keep an explanation, a code link, or a question.</label><textarea id={`notes-${dayId}`} rows={7} value={value} aria-describedby={`notes-status-${dayId}`} placeholder="What made sense? What would you try next?" onChange={event=>{const text=event.target.value;latest.current=text;setValue(text);setStatus(text===saved.current?'saved':'editing');try{sessionStorage.setItem(draftKey,text)}catch{}}} onBlur={()=>{void save()}}/><div className={styles.footer}><button type="button" className="buttonSecondary" disabled={status==='saving'||value===saved.current} onClick={()=>{void save()}}>{status==='saving'?'Saving…':'Save notes'}</button><span id={`notes-status-${dayId}`} role={status==='error'?'alert':'status'}>{status==='error'?'Notes could not be saved. Your text is still here; keep a copy and retry.':status==='saving'?'Saving on this device…':recovered?'Recovered a draft from this tab.':status==='editing'?'Changes waiting to save.':value?'Saved on this device.':'Notes save on this device as you write.'}</span></div><p>Saved notes are included in your study backup. Unsaved tab drafts are not.</p></section>;
}
