'use client';
import { use, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, Search, Check, Play, BookOpen } from 'lucide-react';
import { StudyGuide } from '@/components/learn/StudyGuide';
import { AppShell } from '@/components/layout/AppShell';
import { COURSE_GUIDES } from '@/lib/db/course-guides';
import { LEARNING_DAYS, SUBJECTS } from '@/lib/db/curriculum-data';
import { filterLessons, getLessonState, LessonFilter } from '@/lib/db/learning-library';
import { useStudyLibrary } from '@/components/courses/useStudyLibrary';
import styles from '@/components/courses/Courses.module.scss';

export default function SubjectDetailPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = use(params);
  const subject = SUBJECTS.find(item => item.id.toLowerCase() === subjectId.toLowerCase() || item.slug === subjectId.toLowerCase());
  const course = COURSE_GUIDES.find(item => item.id === subject?.id);
  const { loading, error, completedIds, activeSequence } = useStudyLibrary();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<LessonFilter>('all');
  if (!course) return <AppShell><div className={styles.empty}><h1>Course not found</h1><p>This course is not in your learning library.</p><Link className="buttonSecondary" href="/app/subjects">Browse courses</Link></div></AppShell>;
  const guided = course.id === 'CPP';
  const lessons = filterLessons(LEARNING_DAYS, query, filter, activeSequence, completedIds);
  const active = LEARNING_DAYS.find(day => day.sequence_index === activeSequence);
  return <AppShell><div className={styles.page}>
    <Link href="/app/subjects" className={styles.back}><ArrowLeft size={14} aria-hidden="true" />All courses</Link>
    <header className={styles.heading}>
      <div><span className={styles.eyebrow}>{course.phase} · {guided?'GUIDED COURSE':'SELF-DIRECTED OUTLINE'}</span><h1>{course.title}</h1><p>{course.description}</p></div>
      {guided && <Link href={active?`/app/learn/${active.phase_id}/${active.id}`:'/app/roadmap/P0'} className="buttonPrimary">{active?'Continue learning':'Check readiness'} <ArrowRight size={16} aria-hidden="true" /></Link>}
    </header>
    {guided && active && !loading && !error && <details className={styles.guidePreview}><summary>Your next lesson · Day {String(active.sequence_index).padStart(2, '0')}<span>Open study guide +</span></summary><StudyGuide day={active} /></details>}
    <div className={styles.detailLayout}>
      <section>
        {guided ? <>
          <div className={styles.sectionHeading}><h2>Your lesson path</h2><span>{loading?'Loading progress…':error?'Progress unavailable':`${completedIds.length} of 30 complete`}</span></div>
          <div className={styles.toolbar}>
            <div className={styles.filters} aria-label="Filter lessons">{(['all','remaining','completed'] as LessonFilter[]).map(value=><button key={value} aria-pressed={filter===value} onClick={()=>setFilter(value)}>{value==='all'?'All lessons':value==='remaining'?'Remaining':'Completed'}</button>)}</div>
            <label className={styles.search}><Search size={16} aria-hidden="true" /><input aria-label="Search lessons" placeholder="Search a topic or day code…" value={query} onChange={e=>setQuery(e.target.value)} /></label>
          </div>
          <p className={styles.note}>Follow the sequence at your own pace. You can preview future lessons; finishing them unlocks only after your current learning day.</p>
          <div className={styles.lessonList}>{lessons.map(day=>{
            const state = getLessonState(day,activeSequence,completedIds);
            return <Link key={day.id} className={styles.lesson} data-state={state} href={`/app/learn/${day.phase_id}/${day.id}`}>
              <span className={styles.lessonNumber}>{state==='completed'?<Check size={15} aria-hidden="true" />:String(day.sequence_index).padStart(2,'0')}</span>
              <div><h3>{day.title}</h3><p>{day.estimated_minutes} min estimated · {loading?'Loading status':error?'Status unavailable':state==='current'?'Your current lesson':state==='completed'?'Completed':state==='preview'?'Preview lesson':'Available to revisit'}</p></div>
              <span className={styles.lessonAction}>{state==='current'?<Play size={15} aria-hidden="true" />:<ArrowUpRight size={16} aria-hidden="true" />}</span>
            </Link>;
          })}</div>
          {lessons.length===0&&<div className={styles.empty}><h2>No lessons in this view</h2><p>Try a different topic or show all lessons.</p><button className="buttonSecondary" onClick={()=>{setQuery('');setFilter('all');}}>Show all lessons</button></div>}
        </>:<>
          <div className={styles.sectionHeading}><h2>A practical study sequence</h2><span>{course.topics.length} checkpoints</span></div>
          <p className={styles.note}>Use this as a self-directed outline, not a daily schedule. These checkpoints are not graded or included in your guided-lesson progress.</p>
          {course.topics.map((topic,index)=><details key={topic.title} className={styles.topic} open={index===0}>
            <summary><span>{String(index+1).padStart(2,'0')}</span>{topic.title}</summary>
            <div className={styles.topicBody}>
              <div><h3>Understand</h3><p>{topic.learn}</p></div>
              <div><h3>Build or practice</h3><p>{topic.practice}</p></div>
              <div><h3>Evidence to check</h3><p>{topic.proof}</p></div>
            </div>
          </details>)}
          <div className={styles.panel}><span className={styles.panelLabel}>BEFORE YOU MOVE ON</span><p>Explain your solution without looking at notes, reproduce the result, and write down one failure you diagnosed. Revisit a checkpoint when you cannot yet do that independently.</p></div>
        </>}
      </section>
      <aside aria-label="Course guidance">
        <section className={styles.panel}><span className={styles.panelLabel}>THE FINISH LINE</span><h2>What you’ll be able to demonstrate</h2><p>{course.outcome}</p></section>
        <section className={styles.panel}><span className={styles.panelLabel}>BEFORE YOU START</span><p>{course.prerequisite}</p></section>
        <section className={styles.panel}><span className={styles.panelLabel}>YOUR REFERENCE SHELF</span><h2>Study less. Practice more.</h2><p>Use a source when you need an explanation, then return to your own implementation.</p>{course.resources.map(resource=><div key={resource.url} className={styles.resource}><a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.title}<ArrowUpRight size={14} aria-hidden="true" /></a><p>{resource.focus}</p></div>)}</section>
        <section className={styles.panel}><span className={styles.panelLabel}>SAVE FOR LATER</span><p>{course.defer}</p></section>
        <Link href="/app/roadmap" className="buttonSecondary"><BookOpen size={15} aria-hidden="true" />See where this fits</Link>
      </aside>
    </div>
  </div></AppShell>;
}
