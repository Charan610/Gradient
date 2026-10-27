'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { LibraryResult, searchLibrary } from '@/lib/db/library-search';
import styles from './CommandPalette.module.scss';

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dragStart = useRef<number | null>(null);
  const [drag, setDrag] = useState(0);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const results = searchLibrary(query);
  useEffect(() => {
    if (!isOpen) return;
    setQuery(''); setSelected(0); setDrag(0);
    const focused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => { dialog?.close(); focused?.focus(); };
  }, [isOpen]);
  useEffect(() => {
    dialogRef.current?.querySelector('[data-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [selected]);
  const choose = (result: LibraryResult) => {
    onClose();
    if (result.external) window.open(result.href, '_blank', 'noopener,noreferrer');
    else router.push(result.href);
  };
  if (!isOpen) return null;
  return <dialog ref={dialogRef} className={styles.modal} data-dragging={drag > 0} aria-label="Search your learning workspace"
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === event.currentTarget) { const r=event.currentTarget.getBoundingClientRect(); if (event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) onClose(); } }}>
    <div className={styles.sheetHandle} aria-hidden="true"
      onPointerDown={event => { dragStart.current = event.clientY; event.currentTarget.setPointerCapture(event.pointerId); }}
      onPointerMove={event => { if (dragStart.current !== null) { const distance = Math.max(0, event.clientY - dragStart.current); setDrag(distance); dialogRef.current?.style.setProperty('--sheet-drag', `${distance}px`); } }}
      onPointerUp={event => { const distance = dragStart.current === null ? 0 : event.clientY - dragStart.current; dragStart.current = null; setDrag(0); dialogRef.current?.style.setProperty('--sheet-drag', '0px'); if (distance > 80) onClose(); }}
      onPointerCancel={() => { dragStart.current = null; setDrag(0); dialogRef.current?.style.setProperty('--sheet-drag', '0px'); }}><span /></div>
    <div className={styles.inputWrapper}>
      <Search size={18} aria-hidden="true" />
      <input autoFocus className={styles.input} aria-label="Search lessons, courses, and resources" placeholder="Find a lesson, course, or resource…" value={query}
        onChange={event=>{setQuery(event.target.value);setSelected(0);}}
        onKeyDown={event=>{
          if(event.key==='ArrowDown'){event.preventDefault();setSelected(index=>Math.min(index+1,Math.max(0,results.length-1)));}
          if(event.key==='ArrowUp'){event.preventDefault();setSelected(index=>Math.max(0,index-1));}
          if(event.key==='Enter'&&results[selected]){event.preventDefault();choose(results[selected]);}
        }} />
      <button className={styles.close} onClick={onClose} aria-label="Close search"><X size={18} aria-hidden="true" /></button>
    </div>
    <div className={styles.hint}>Search by topic or lesson code, such as P0-D06. Use the arrow keys to choose a result.</div>
    <ul className={styles.resultsList} aria-label="Search results">
      {results.map((item,index)=><li key={item.id}><a data-selected={index===selected} className={`${styles.resultItem} ${index===selected?styles.selected:''}`} href={item.href}
        target={item.external?'_blank':undefined} rel={item.external?'noopener noreferrer':undefined}
        onMouseEnter={()=>setSelected(index)} onFocus={()=>setSelected(index)}
        onClick={event=>{if(!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey){event.preventDefault();choose(item);}}}>
        <span className={styles.itemTitle}>{item.title}</span><span className={styles.itemTag}>{item.kind}{item.external&&<ArrowUpRight size={12} aria-label="Opens in a new tab" />}</span>
      </a></li>)}
      {results.length===0&&<li className={styles.hint}>No matching results. Try a shorter topic or a day code.</li>}
    </ul>
    <footer className={styles.shortcuts}><span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span><span><kbd>Enter</kbd> Open</span><span><kbd>Esc</kbd> Close</span></footer>
  </dialog>;
}
