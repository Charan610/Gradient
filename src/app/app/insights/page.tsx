'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, RotateCcw, BookOpen } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { WorkspaceSkeleton } from '@/components/ui/WorkspaceSkeleton';
import { ProgressRepository } from '@/lib/db/progress-repository';
import { LEARNING_DAYS, PHASES } from '@/lib/db/curriculum-data';
import { ConceptReview } from '@/lib/db/types';
import styles from '@/components/journey/Journey.module.scss';

type ProgressData = { completed: string[]; reviews: ConceptReview[]; applications: number };
export default function InsightsPage() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [error, setError] = useState(false);
  const load = useCallback(async () => {
    try {
      const [records, reviews, applications] = await Promise.all([
        Promise.all(LEARNING_DAYS.map(day => ProgressRepository.getDayProgress('local_user', day.id))),
        ProgressRepository.getDueReviews('local_user', Number.MAX_SAFE_INTEGER),
        ProgressRepository.getApplications(),
      ]);
      setData({ completed: records.filter(record => record?.state === 'completed').map(record => record!.learning_day_id), reviews, applications: applications.length });
      setError(false);
    } catch { setError(true); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const completed = LEARNING_DAYS.filter(day => data?.completed.includes(day.id));
  const estimatedMinutes = completed.reduce((sum, day) => sum + day.estimated_minutes, 0);
  return <AppShell><div className={styles.page}>
    <header className={styles.heading}><span>SEE HOW FAR YOU’VE COME</span><h1>Small steps add up.</h1><p>Your completed lessons and recall practice, drawn from your saved work. Take a moment to notice what you can do now.</p></header>
    {error ? <section className={styles.feature} role="alert"><h2>Your progress couldn’t be loaded</h2><p>Try again to read your saved records.</p><button className="buttonSecondary" onClick={load}>Try again</button></section> : !data ? <WorkspaceSkeleton /> : <>
      <section className={styles.feature}><span className="phaseBadge">C++ FOUNDATIONS</span><h2>{completed.length ? `${completed.length} lessons behind you. More possibility ahead.` : 'Your first small win is waiting.'}</h2><p>{completed.length ? 'Revisit any completed lesson, or continue with your next step.' : 'Complete your first lesson to start building a record of your learning.'}</p><progress value={completed.length} max={LEARNING_DAYS.length} aria-label="Completed C++ lessons" /><p>{completed.length} of {LEARNING_DAYS.length} guided lessons completed</p><Link href="/app/today" className="buttonPrimary">{completed.length ? 'Continue learning' : 'Start your first lesson'} <ArrowRight size={16} /></Link></section>
      <div className={styles.grid}>
        <section className={styles.card}><BookOpen size={21} /><span>CURRICULUM EFFORT</span><strong>{Math.round(estimatedMinutes / 60 * 10) / 10}h</strong><p>Estimated lesson time for completed work. This is a curriculum estimate, not a timer record.</p></section>
        <section className={styles.card}><RotateCcw size={21} /><span>RECALL PRACTICE</span><strong>{data.reviews.filter(review => review.latest_confidence === 'stable').length}</strong><p>Concepts you last rated confident. Revisit them to check what you remember.</p><Link href="/app/review">Practice recall <ArrowRight size={15} /></Link></section>
        <section className={styles.card}><CheckCircle2 size={21} /><span>APPLICATIONS SAVED</span><strong>{data.applications}</strong><p>Opportunities recorded in your application tracker.</p><Link href="/app/career/applications">View applications <ArrowRight size={15} /></Link></section>
      </div>
      <section className={styles.feature}><h2>Revisit your work</h2>{completed.length ? <ul className={styles.list}>{completed.slice(-5).reverse().map(day => <li key={day.id}><Link href={`/app/learn/${day.phase_id}/${day.id}`}><div>{day.title}<br /><span>Lesson {String(day.sequence_index).padStart(2,'0')} · Completed</span></div><ArrowRight size={16} /></Link></li>)}</ul> : <p>Completed lessons will appear here. You can come back to them whenever you need a refresher.</p>}<Link className="buttonSecondary" href="/app/subjects/cpp">Browse all lessons</Link></section>
      <details className={styles.feature}><summary>See the full preparation roadmap</summary><ul className={styles.list}>{PHASES.map(phase => { const days = LEARNING_DAYS.filter(day => day.phase_id === phase.id); return <li key={phase.id}><Link href={`/app/roadmap/${phase.id}`}><div>{phase.title}<br /><span>{days.length ? `${days.filter(day => data.completed.includes(day.id)).length} of ${days.length} lessons complete` : 'Self-directed outline · daily lessons not available'}</span></div><ArrowRight size={16} /></Link></li>; })}</ul></details>
      <p className={styles.note}>Task completion and readiness checks are self-assessed. Use your saved code, test cases, and explanations to assess your understanding.</p>
    </>}
  </div></AppShell>;
}
