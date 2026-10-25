import Link from 'next/link';
import { ArrowUpRight, Check, Route } from 'lucide-react';
import { LEARNING_DAYS } from '@/lib/db/curriculum-data';
import styles from './JourneyCard.module.scss';

export function JourneyCard({ completedIds, activeDayId }: { completedIds: string[]; activeDayId: string }) {
  const completed = new Set(completedIds);
  const count = LEARNING_DAYS.filter(day => completed.has(day.id)).length;
  return (
    <section className={styles.card} aria-labelledby="journey-heading">
      <div className={styles.heading}><span className={styles.icon}><Route size={18} /></span><div><span className={styles.eyebrow}>YOUR LEARNING PATH</span><h2 id="journey-heading">Build your foundation</h2></div></div>
      <div className={styles.summary}><strong>{Math.round(count / LEARNING_DAYS.length * 100)}<small>%</small></strong><span>{count} of {LEARNING_DAYS.length} lessons complete</span></div>
      <progress aria-label="Foundation lessons completed" value={count} max={LEARNING_DAYS.length} />
      <div className={styles.lessonMap}>
        {LEARNING_DAYS.map(day => <Link key={day.id} href={`/app/learn/${day.phase_id}/${day.id}`} data-state={completed.has(day.id) ? 'complete' : day.id === activeDayId ? 'current' : 'upcoming'} aria-label={`Day ${day.sequence_index}: ${day.title}${completed.has(day.id) ? ', completed' : day.id === activeDayId ? ', current lesson' : ', preview'}`} title={day.title}>{completed.has(day.id) ? <Check size={15} /> : String(day.sequence_index).padStart(2, '0')}</Link>)}
      </div>
      <p>Each tile is a lesson. Revisit a win or explore what’s next.</p>
      <Link className={styles.footer} href="/app/subjects/CPP">Explore the full course <ArrowUpRight size={16} /></Link>
    </section>
  );
}
