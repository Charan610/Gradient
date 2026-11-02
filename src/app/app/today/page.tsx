'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Check, ChevronRight, Coffee, RotateCcw, Sprout } from 'lucide-react';
import {BackupReminder} from '@/components/backup/BackupReminder';
import { AppShell } from '@/components/layout/AppShell';
import { WorkspaceSkeleton } from '@/components/ui/WorkspaceSkeleton';
import { ProgressRepository } from '@/lib/db/progress-repository';
import { LEARNING_DAYS } from '@/lib/db/curriculum-data';
import { resolveHomeJourney } from '@/lib/db/home-journey';
import {recallStep} from '@/lib/db/review-schedule';
import {guidedCourseFor,courseLessons,lessonPosition} from '@/lib/db/guided-courses';
import { UserProfile, UserTaskProgress, ConceptReview } from '@/lib/db/types';
import styles from './Today.module.scss';

type HomeData = { profile: UserProfile; completed: string[]; tasks: Record<string, UserTaskProgress>; reviews: ConceptReview[] };

export default function TodayPage() {
  const [data, setData] = useState<HomeData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    try {
      const [profile, records] = await Promise.all([
        ProgressRepository.getProfile(),
        Promise.all(LEARNING_DAYS.map(day => ProgressRepository.getDayProgress('local_user', day.id))),
      ]);
      const day = LEARNING_DAYS.find(item => item.sequence_index === profile.active_day_index);
      const [tasks, reviews] = await Promise.all([
        day ? ProgressRepository.getDayTaskProgresses('local_user', day.id) : Promise.resolve({}),
        ProgressRepository.getDueReviews('local_user', Number.MAX_SAFE_INTEGER),
      ]);
      setData({ profile, tasks, completed: records.filter(record => record?.state === 'completed').map(record => record!.learning_day_id), reviews });
      setError(false);
    } catch { setError(true); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    void load();
    const refresh = () => { void load(); };
    window.addEventListener('focus', refresh);
    window.addEventListener('foundation-progress', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('foundation-progress', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [load]);

  const journey = data ? resolveHomeJourney(data.profile.active_day_index, data.completed, data.tasks, data.profile.preferred_mode) : null;
  const name = data?.profile.alias && data.profile.alias !== 'Student Engineer' ? `, ${data.profile.alias}` : '';
  const day = journey?.day;
  const course=day?guidedCourseFor(day):null;
  const courseDays=course?courseLessons(course.id):[];
  const ready=data?data.reviews.filter(review=>review.next_due_day_index<=recallStep(data.profile)):[];
  const revisit=ready.length?ready.slice(0,2):data?[...data.reviews].sort((a,b)=>a.next_due_day_index-b.next_due_day_index).slice(0,2):[];
  const first = journey?.state === 'new';
  const lessonHref = day ? `/app/learn/${day.phase_id}/${day.id}` : '/app/subjects';

  return <AppShell><div className={styles.home}>
    <header className={styles.heading}>
      <span className={styles.eyebrow}>YOUR NEXT SMALL STEP</span>
      <h1>{first ? `A good place to begin${name}.` : `Welcome back${name}.`}</h1>
      <p>{first ? 'You don’t need to know how to code. Just start with one lesson.' : 'Pick up where you left off. Your progress is right here.'}</p>
    </header>
    {error ? <section className={styles.empty} role="alert"><h2>Your progress couldn’t be loaded</h2><p>Check that browser storage is available, then try again. Your saved work has not been reset.</p><button className="buttonPrimary" onClick={load}>Try again</button></section>
    : loading || !journey || !data ? <WorkspaceSkeleton /> : <>
      {journey.state === 'finished' ? <section className={styles.focusCard}>
        <span className={styles.tag}><Check size={15} /> {LEARNING_DAYS.length} LESSONS COMPLETED</span><h2>You’ve worked through both guided paths.</h2><p>Revisit a tricky concept, practice another recall set, or explore a self-directed outline. Your saved lessons stay available.</p><Link className="buttonPrimary" href="/app/review">Practice recall <ArrowRight size={16} /></Link>
      </section> : journey.state === 'maintenance' ? <section className={styles.focusCard}>
        <span className={styles.tag}><Coffee size={15} /> TAKING IT LIGHT</span><h2>A little recall is enough.</h2><p>Your next lesson is safely paused. Revisit something you’ve learned, or change your study mode when you’re ready.</p><Link className="buttonPrimary" href="/app/review">Practice recall <ArrowRight size={16} /></Link><Link className={styles.textLink} href="/app/settings">Change study mode</Link>
      </section> : journey.state === 'unavailable' || !day ? <section className={styles.empty}>
        <h2>Let’s find your place</h2><p>Your saved lesson position doesn’t match the available lessons. Browse your course or restore a backup in Settings. Your completed work is preserved.</p><Link className="buttonPrimary" href="/app/subjects/cpp">Find a lesson <ArrowRight size={16} /></Link><Link className={styles.textLink} href="/app/settings">Open backup settings</Link>
      </section> : <section className={styles.focusCard} aria-labelledby="current-lesson-title">
        <div className={styles.cardTop}><span className={styles.tag}><Sprout size={15} /> {course?.title}</span><span className={styles.lessonNumber}>LESSON {String(lessonPosition(day)).padStart(2, '0')} / {courseDays.length}</span></div>
        <div className={styles.focusLayout}><div>
          <span className={styles.overline}>{first ? 'START HERE' : 'YOUR CURRENT LESSON'}</span>
          <h2 id="current-lesson-title">{day.title}</h2><p>{day.goal}</p>
          <Link href={lessonHref} className="buttonPrimary" id="continue-learning-action">{first ? 'Start learning' : 'Continue learning'} <span className="iconCapsule"><ArrowRight size={16} /></span></Link>
          <span className={styles.pacing}>{data.profile.preferred_daily_minutes} min session preference · Pause whenever you need.</span>
        </div><div className={styles.lessonArt} aria-hidden="true"><span>ONE CONCEPT AT A TIME</span><strong>{'</>'}</strong><div><i /><i /><i /></div><span>READ → TRY → UNDERSTAND</span></div></div>
        <div className={styles.nextTask}><span className={styles.stepIcon}><ArrowRight size={17} /></span><div><strong>{journey.nextTask ? 'Your next step' : 'Ready to finish this lesson'}</strong><p>{journey.nextTask?.title ?? 'All required activities are checked. Open the lesson to save completion and unlock the next one.'}</p></div><span className={styles.taskCount}>{journey.completedTasks}/{journey.requiredTasks}<small>activities done</small></span></div>
      </section>}
      <div className={styles.progressLine}><div><strong>{journey.completedLessons} of {LEARNING_DAYS.length} lessons completed</strong><span>Every completed lesson stays with you.</span></div><progress value={journey.completedLessons} max={LEARNING_DAYS.length} aria-label="All guided lessons completed" /><Link href="/app/insights">Your progress <ChevronRight size={15} /></Link></div>
      <section className={styles.recallPreview} aria-labelledby="revisit-title"><div><span className={styles.eyebrow}>A LITTLE RETRIEVAL</span><h2 id="revisit-title">{ready.length?'What you can revisit now':'For another visit'}</h2><p>{revisit.length?'Try answering before you open the explanation. No calendar deadlines.':'Earlier concepts return in small recall sets after you finish a lesson.'}</p></div>{revisit.length>0&&<ul>{revisit.map(review=><li key={review.id}>{review.concept_prompt}</li>)}</ul>}<Link href="/app/review">{ready.length?'Open this recall set':'Explore recall'} <ArrowRight size={15}/></Link></section>
      <div className={styles.below}>
        <section className={styles.upNext}><div className={styles.sectionTitle}><h2>{first ? 'A simple learning rhythm' : 'Coming up next'}</h2><span>{first ? 'AT YOUR OWN PACE' : 'A PREVIEW, NOT A DEADLINE'}</span></div>
          {first ? <ol className={styles.rhythm}>{[['01','Learn one idea','Read a short explanation and work through an example.'],['02','Try it yourself','Write a little code and check what happens.'],['03','Make it stick','Explain what you learned, then take your next step.']].map(([n,title,description]) => <li key={n}><span>{n}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol>
          : journey.upcoming.length ? <ol className={styles.rhythm}>{journey.upcoming.map(item => <li key={item.id}><span>{String(item.sequence_index).padStart(2,'0')}</span><div><Link href={`/app/learn/${item.phase_id}/${item.id}`}><h3>{item.title} <ChevronRight size={14} /></h3></Link><p>{item.goal}</p></div></li>)}</ol> : <p className={styles.quiet}>Keep practicing with your review queue, or explore the full learning roadmap.</p>}
        </section>
        <aside className={styles.sideNote}>
          <BookOpen size={21} /><h2>{first?'Already know the basics?':'Your path, your pace.'}</h2><p>{first?'Explore the learning paths. Each course tells you what to know before starting.':'Explore another subject whenever you want. Your lesson progress stays saved.'}</p><Link href="/app/subjects">Explore learning paths <ArrowRight size={15}/></Link>
        </aside>
      </div>
      <BackupReminder completed={journey.completedLessons}/>
      <footer className={styles.footnote}>Your work is saved in this browser. <Link href="/app/settings">Keep a backup</Link> to carry it to another device.</footer>
    </>}
  </div></AppShell>;
}
