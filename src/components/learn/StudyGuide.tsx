'use client';
import {useEffect,useState} from 'react';
import {loadExpandedGuidance} from '@/lib/db/expanded-guidance';
import { RESOURCES } from '@/lib/db/curriculum-data';
import { LearningDay } from '@/lib/db/types';
import { STUDY_GUIDANCE, type StudyGuidance } from '@/lib/db/study-guidance';
import styles from './StudyGuide.module.scss';
import Link from 'next/link';
import {FirstProgramDemo} from './FirstProgramDemo';

export function StudyGuide({ day, minutes = 90 }: { day: LearningDay; minutes?: number }) {
  const legacy = STUDY_GUIDANCE[day.sequence_index];
  const [attempt,retry] = useState(0);
  const [result,setResult] = useState<{id:string; guide?:StudyGuidance}>();
  useEffect(()=>{
    if(legacy)return;
    let current=true;
    loadExpandedGuidance(day.id).then(
      guide=>{if(current)setResult({id:day.id,guide})},
      ()=>{if(current)setResult({id:day.id})}
    );
    return ()=>{current=false};
  },[day.id,legacy,attempt]);
  const current = result?.id===day.id ? result : undefined;
  const guide = legacy ?? current?.guide;
  if (!guide) return <section className={styles.card} aria-busy={!current}>
    {current ? <><p role="alert">The study guide couldn’t be loaded.</p><button className="buttonSecondary" type="button" onClick={()=>{setResult(undefined);retry(count=>count+1)}}>Try again</button></>
      : <p role="status">Loading study guide…</p>}
  </section>;
  const requiredMinutes = day.tasks.filter(t => t.required).reduce((sum, t) => sum + t.estimate_minutes, 0);
  return (
    <section className={styles.card} aria-labelledby={`guide-${day.id}`}>
      <div className={styles.eyebrow}>LEARN → PRACTICE → RECALL</div>
      <h2 id={`guide-${day.id}`}>One idea. Then make it yours.</h2>
      <p className={styles.pacing}>Your budget: {minutes} min per session · About {requiredMinutes} min of required work.
        {minutes < requiredMinutes ? ` Plan for ${Math.ceil(requiredMinutes / minutes)} sessions. Save your work and resume this same learning day.` : ' Stop when the checks pass; extra practice is optional.'}</p>
      {day.sequence_index === 1 && <><div className={styles.setup}><strong>First time running C++?</strong><p>Install a compiler and build hello.cpp with a short guide for your operating system.</p><Link href="/setup/cpp">Set up C++ →</Link></div><FirstProgramDemo/></>}
      {guide.explanation && <div className={styles.source}><h3>The idea</h3><p>{guide.explanation}</p></div>}
      {guide.example && <div className={styles.source}><h3>Trace a worked example</h3><p><strong>Input:</strong> {guide.example.input}</p><p><strong>Expected output:</strong> {guide.example.output}</p><p>{guide.example.reasoning}</p></div>}
      <ol className={styles.steps}>
        <li><strong>Read with one question in mind</strong><p>{guide.prompt} Use the assigned resource, then close it and explain in your own words.</p></li>
        <li><strong>Build independently</strong><p>{guide.exercise}</p></li>
        <li><strong>Check before marking complete</strong><p>{guide.checks}</p></li>
      </ol>
      <details className={styles.help} open>
        <summary>Start with these lesson resources</summary>
        <p>Use the sections below for this lesson. You do not need to finish the whole resource.</p>
        {guide.reference && <div className={styles.source}><a href={guide.reference.url} target="_blank" rel="noopener noreferrer">{guide.reference.title} ↗<span className="sr-only"> (opens in a new tab)</span></a><p><strong>Focus:</strong> {guide.reference.focus}</p></div>}
        {day.tasks.flatMap(task => (task.assigned_resources || []).map((assignment, index) => {
          const resource = RESOURCES.find(item => item.id === assignment.resource_id);
          return resource ? <div className={styles.source} key={`${task.id}-${index}`}><a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.title} ↗<span className="sr-only"> (opens in a new tab)</span></a><p><strong>Read:</strong> {assignment.exact_assigned_sections}</p><p><strong>Use it to:</strong> {assignment.purpose}</p>{assignment.note_what_to_skip && <p><strong>Save for later:</strong> {assignment.note_what_to_skip}</p>}</div> : null;
        }))}
      </details>
      <details className={styles.help}>
        <summary>Check your understanding: {guide.prompt}</summary>
        <p>Try answering before opening this explanation.</p><p>{guide.answer}</p>
      </details>
      <details className={styles.help}>
        <summary>Stuck? Follow this recovery plan</summary>
        {guide.hint && <p><strong>Lesson hint:</strong> {guide.hint}</p>}
        <p>Write the input and expected output for the smallest example. Trace your variables on paper. {day.sequence_index <= 50 ? 'Read the first compiler error, fix one thing, and rerun.' : 'Read the first failing check or diagnostic. Change one thing and rerun the smallest case.'} After 15–20 minutes without progress, revisit the relevant explanation or ask for a hint using your code and failing example.</p>
        <p>If you use a worked solution, close it and rebuild from scratch. Save the failing case, your fix, and what you learned in the task evidence. Leave the task incomplete until you can explain it.</p>
      </details>
      <details className={styles.help}>
        <summary>Finish with a useful record</summary>
        <p>Save your code link, one normal input, one boundary case, and the result you expected. Add a sentence about an error you fixed. Mark the task complete only when you can explain the solution without copying.</p>
        <p>Next session, try the recall question before opening your notes. If you cannot answer yet, review the explanation and try a fresh example.</p>
      </details>
      <p className={styles.note}>Checks are self-assessed. This workspace does not execute or grade your code.</p>
    </section>
  );
}
