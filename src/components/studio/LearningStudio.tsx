'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, BookOpen, Brain, Check, ChevronRight, Pause, Play, RotateCcw, Timer } from 'lucide-react';
import { LearningDay } from '@/lib/db/types';
import { STUDY_GUIDANCE } from '@/lib/db/study-guidance';
import { ReactiveSurface } from '@/components/ui/ReactiveSurface';
import styles from './LearningStudio.module.scss';

type View = 'focus' | 'recall' | 'plan';
const views = [{ id: 'focus', label: 'Focus session', icon: Timer }, { id: 'recall', label: 'Quick recall', icon: Brain }, { id: 'plan', label: 'Lesson plan', icon: BookOpen }] as const;

export function LearningStudio({ day, preview = false }: { day: LearningDay; preview?: boolean }) {
  const [view, setView] = useState<View>('focus');
  const [minutes, setMinutes] = useState(25);
  const [remaining, setRemaining] = useState(25 * 60);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [step, setStep] = useState(0);
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const guide = STUDY_GUIDANCE[day.sequence_index];
  const tasks = day.tasks.filter(task => task.required);
  const task = tasks[Math.min(step, tasks.length - 1)];
  const running = deadline !== null;

  useEffect(() => {
    if (deadline === null) return;
    const tick = () => {
      const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(seconds);
      if (seconds === 0) setDeadline(null);
    };
    tick();
    const timer = window.setInterval(tick, 250);
    document.addEventListener('visibilitychange', tick);
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', tick); };
  }, [deadline]);

  const reset = () => { setDeadline(null); setRemaining(minutes * 60); };
  const toggleTimer = () => {
    if (deadline !== null) {
      setRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
      setDeadline(null);
    } else {
      const seconds = remaining || minutes * 60;
      setRemaining(seconds);
      setDeadline(Date.now() + seconds * 1000);
    }
  };
  const formatted = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;
  const progress = 1 - remaining / (minutes * 60);

  return (
    <ReactiveSurface className={styles.studio} label={preview ? 'Interactive workspace preview' : 'Study tools'}>
      <div className={styles.topline}><span><span className={styles.dot} />{preview ? 'INTERACTIVE PREVIEW · DAY 01' : `STUDY STUDIO · DAY ${String(day.sequence_index).padStart(2, '0')}`}</span><span>MAKE SPACE TO LEARN</span></div>
      <div className={styles.instrumentBar} aria-hidden="true"><span>01 / FOCUS</span><span>02 / RECALL</span><span>03 / APPLY</span><span className={styles.signal}>▂ ▄ ▆ ▄ ▂</span></div>
      <div className={styles.layout}>
        <div className={styles.navigation}>
          <h2>Less friction.<br /><span>More focus.</span></h2>
          <p>Small tools for the part that matters: doing the work.</p>
          <div role="tablist" aria-label="Study tool" className={styles.tabs}>
            {views.map(({ id: tab, label, icon: Icon }, index) => <button key={tab} ref={el => { tabs.current[index] = el; }} type="button" role="tab" id={`${id}-${tab}`} aria-controls={`${id}-panel`} aria-selected={view === tab} tabIndex={view === tab ? 0 : -1} onClick={() => setView(tab)} onKeyDown={event => {
              const target = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? (index + 1) % views.length : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? (index + views.length - 1) % views.length : event.key === 'Home' ? 0 : event.key === 'End' ? views.length - 1 : null;
              if (target !== null) { event.preventDefault(); setView(views[target].id); tabs.current[target]?.focus(); }
            }}><Icon size={16} aria-hidden="true" /><span>{label}</span>{tab === 'focus' && running ? <span className={styles.running}>ON</span> : <ChevronRight size={14} aria-hidden="true" />}</button>)}
          </div>
        </div>
        <div className={styles.panel} role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${view}`} tabIndex={0}>
          <div key={view} className={styles.panelContent}>
            {view === 'focus' && <div className={styles.focusView}>
              <div className={styles.dial} data-running={running}>
                <svg viewBox="0 0 200 200" aria-hidden="true"><g className={styles.ticks}>{Array.from({ length: 60 }, (_, index) => <line key={index} x1="100" y1="7" x2="100" y2={index % 5 === 0 ? '14' : '10'} transform={`rotate(${index * 6} 100 100)`} />)}</g><circle className={styles.track} cx="100" cy="100" r="79" /><circle className={styles.arc} cx="100" cy="100" r="79" strokeDasharray={496.4} strokeDashoffset={496.4 * progress} /></svg>
                <div><span className={styles.micro}>{running ? 'IN YOUR FLOW' : remaining === 0 ? 'SESSION COMPLETE' : 'ONE THING AT A TIME'}</span><strong role="timer" aria-label={`${Math.floor(remaining / 60)} minutes ${remaining % 60} seconds remaining`}>{formatted}</strong><span className={styles.micro}>{running ? 'You’ve got this.' : remaining === 0 ? 'Take a breath. Then reflect.' : 'Ready when you are.'}</span></div>
              </div>
              <div className={styles.focusControls}>
                <span className={styles.micro}>YOUR FOCUS WINDOW</span>
                <h3>{minutes} quiet minutes.</h3>
                <p>Pick one task. Put the distractions aside. Give it your full attention.</p>
                <label htmlFor={`${id}-duration`} className={styles.sliderLabel}>Session length <span>{minutes} min</span></label>
                <input id={`${id}-duration`} type="range" min={5} max={60} step={5} value={minutes} disabled={running || remaining !== minutes * 60} onChange={e => { const value = Number(e.target.value); setMinutes(value); setRemaining(value * 60); }} aria-describedby={`${id}-timer-note`} />
                <div className={styles.rangeEnds}><span>5 MIN</span><span>60 MIN</span></div>
                <div className={styles.controls}><button className={styles.primary} onClick={toggleTimer}>{running ? <Pause size={15} /> : <Play size={15} />} {running ? 'Pause session' : remaining === 0 ? 'Start again' : remaining !== minutes * 60 ? 'Resume session' : 'Start session'}</button><button className={styles.reset} onClick={reset} aria-label="Reset focus timer"><RotateCcw size={16} /></button></div>
                <p id={`${id}-timer-note`} className={styles.note}>Reset to change duration. Keep this page open; the timer does not mark lessons complete.</p>
                <span role="status" className={styles.completion}>{remaining === 0 ? 'Session complete. Save your evidence when you’re ready.' : ''}</span>
              </div>
            </div>}
            {view === 'recall' && <div className={styles.recallView}>
              <div className={styles.recallMeta}><span className={styles.micro}>RETRIEVE BEFORE YOU REVEAL</span><Brain size={20} aria-hidden="true" /></div>
              <h3>{guide?.prompt || day.goal}</h3>
              <p className={styles.note}>Say your answer out loud, or write it down. Then compare.</p>
              <button className={styles.primary} aria-expanded={revealed} aria-controls={`${id}-answer`} onClick={() => setRevealed(value => !value)}>{revealed ? 'Hide explanation' : 'Reveal explanation'} <ChevronRight size={15} /></button>
              {revealed && <div id={`${id}-answer`} className={styles.answer}><span className={styles.micro}>CHECK YOUR THINKING</span><p>{guide?.answer || 'Compare your explanation with the lesson’s validation criteria.'}</p></div>}
              <p className={styles.note}>A quick practice card. Your spaced-review queue stays unchanged.</p>
            </div>}
            {view === 'plan' && <div className={styles.planView}>
              <div className={styles.recallMeta}><span className={styles.micro}>TODAY, IN SMALL STEPS</span><span className={styles.micro}>{tasks.length} REQUIRED TASKS</span></div>
              <div className={styles.stepPicker}>{tasks.map((item, index) => <button key={item.id} aria-pressed={step === index} onClick={() => setStep(index)}><span>{String(index + 1).padStart(2, '0')}</span>{item.kind}</button>)}</div>
              {task && <div key={task.id} className={styles.taskPreview}><span className={styles.micro}>{task.estimate_minutes} MIN ESTIMATED</span><h3>{task.title}</h3><p>{task.instructions}</p><div className={styles.criteria}><Check size={15} aria-hidden="true" /><span>{task.validation_criteria}</span></div></div>}
              <Link className={styles.textLink} href={`/app/learn/${day.phase_id}/${day.id}`}>Open this lesson <ArrowUpRight size={16} /></Link>
            </div>}
          </div>
        </div>
      </div>
    </ReactiveSurface>
  );
}
