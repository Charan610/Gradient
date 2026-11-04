'use client';
import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, Search, Check, Play, BookOpen } from 'lucide-react';
import { StudyGuide } from '@/components/learn/StudyGuide';
import { AppShell } from '@/components/layout/AppShell';
import { catalogHref } from '@/lib/db/catalog-navigation';
import { COURSE_GUIDES } from '@/lib/db/course-guides';
import { SUBJECTS } from '@/lib/db/curriculum-data';
import { filterLessons, getLessonState, LessonFilter } from '@/lib/db/learning-library';
import { courseLessons, guidedCourseFor, lessonPosition, GUIDED_COURSES } from '@/lib/db/guided-courses';
import { CourseInterest } from '@/components/courses/CourseInterest';
import { useLibraryFilters, useStudyLibrary } from '@/components/courses/useStudyLibrary';
import styles from '@/components/courses/Courses.module.scss';

const LESSON_FILTERS = ['all', 'remaining', 'completed'] as const;
export default function SubjectDetailPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = use(params);
  const subject = SUBJECTS.find(item => item.id.toLowerCase() === subjectId.toLowerCase() || item.slug === subjectId.toLowerCase());
  const course = COURSE_GUIDES.find(item => item.id === subject?.id);
  const { loading, error, completedIds, activeSequence } = useStudyLibrary();
  const { query, setQuery, filter, setFilter } = useLibraryFilters(LESSON_FILTERS);
  const [backHref,setBackHref]=useState('/app/subjects');
  useEffect(()=>{
    const sync=()=>setBackHref(catalogHref(window.location.search));
    sync();
    window.addEventListener('popstate',sync);
    return ()=>window.removeEventListener('popstate',sync);
  },[subjectId]);
  const track=GUIDED_COURSES.find(item=>item.id===course?.id);
  if (!course || !track) return <AppShell><div className={styles.empty}><h1>Course not found</h1><p>This course is not in your learning library.</p><Link className="buttonSecondary" href="/app/subjects">Browse courses</Link></div></AppShell>;
  const courseDays = courseLessons(course.id);
  const courseCompletedIds = courseDays.filter(day => completedIds.includes(day.id)).map(day => day.id);
  const lessons = filterLessons(courseDays, query, filter, activeSequence, courseCompletedIds);
  const active = !loading && !error ? courseDays.find(day => day.sequence_index === activeSequence && guidedCourseFor(day)?.id === course.id) : undefined;
  const firstLesson = courseDays[0];
  return <AppShell><div className={styles.page}>
    <Link href={backHref} className={styles.back}><ArrowLeft size={14} aria-hidden="true" />All courses</Link>
    <header className={styles.heading}>
      <div><span className={styles.eyebrow}>{track.phaseId} · GUIDED COURSE</span><h1>{course.title}</h1><p>{course.description}</p></div>
      {(active || firstLesson) && <Link href={active ? `/app/learn/${active.phase_id}/${active.id}` : `/app/learn/${firstLesson.phase_id}/${firstLesson.id}`} className="buttonPrimary">{active ? `Continue lesson ${lessonPosition(active)}` : 'Explore the first lesson'} <ArrowRight size={16} aria-hidden="true" /></Link>}
    </header>
    {active && !loading && !error && <details className={styles.guidePreview}><summary>Your current lesson · Lesson {lessonPosition(active)} of {courseDays.length}<span>Open study guide +</span></summary><StudyGuide day={active} /></details>}
    <div className={styles.detailLayout}>
      <section>
          <div className={styles.sectionHeading}><h2>Your lesson path</h2><span>{loading?'Loading progress…':error?'Progress unavailable':`${courseCompletedIds.length} of ${courseDays.length} complete`}</span></div>
          <div className={styles.toolbar}>
            <div className={styles.filters} aria-label="Filter lessons">{(['all','remaining','completed'] as LessonFilter[]).map(value=><button key={value} aria-pressed={filter===value} onClick={()=>setFilter(value)}>{value==='all'?'All lessons':value==='remaining'?'Remaining':'Completed'}</button>)}</div>
            <label className={styles.search}><Search size={16} aria-hidden="true" /><input aria-label="Search lessons" placeholder="Search a topic or day code…" value={query} onChange={e=>setQuery(e.target.value)} /></label>
          </div>
          <p className={styles.note}>Follow these {courseDays.length} lessons at your own pace. You can explore future lessons while your learning path keeps track of the next available step.</p>
          <div className={styles.lessonList}>{lessons.map(day=>{
            const state = getLessonState(day,activeSequence,courseCompletedIds);
            return <Link key={day.id} className={styles.lesson} data-state={state} href={`/app/learn/${day.phase_id}/${day.id}`}>
              <span className={styles.lessonNumber}>{state==='completed'?<Check size={15} aria-hidden="true" />:String(lessonPosition(day)).padStart(2,'0')}</span>
              <div><h3>{day.title}</h3><p>{day.estimated_minutes} min estimated · {loading?'Loading status':error?'Status unavailable':state==='current'?'Your current lesson':state==='completed'?'Completed':state==='preview'?'Preview lesson':'Available to revisit'}</p></div>
              <span className={styles.lessonAction}>{state==='current'?<Play size={15} aria-hidden="true" />:<ArrowUpRight size={16} aria-hidden="true" />}</span>
            </Link>;
          })}</div>
          {lessons.length===0&&<div className={styles.empty}><h2>No lessons in this view</h2><p>Try a different topic or show all lessons.</p><button className="buttonSecondary" onClick={()=>{setQuery('');setFilter('all');}}>Show all lessons</button></div>}
        <details className={styles.topic}>
          <summary>Practice checkpoints</summary>
          <div className={styles.topicBody}>{course.topics.map(topic=><div key={topic.title}>
            <h3>{topic.title}</h3><p>{topic.learn}</p><p>{topic.practice}</p><p>{topic.proof}</p>
          </div>)}</div>
        </details>
        <CourseInterest key={course.id} courseId={course.id} />
      </section>
      <aside aria-label="Course guidance">
        <section className={styles.panel}><span className={styles.panelLabel}>THE OUTCOME</span><h2>What you’ll be able to demonstrate</h2><p>{course.outcome}</p></section>
        <section className={styles.panel}><span className={styles.panelLabel}>BEFORE YOU START</span><p>{course.prerequisite}</p></section>
        <section className={styles.panel}><span className={styles.panelLabel}>YOUR REFERENCE SHELF</span><h2>Study less. Practice more.</h2><p>Use a source when you need an explanation, then return to your own implementation.</p>{course.resources.map(resource=><div key={resource.url} className={styles.resource}><a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.title}<ArrowUpRight size={14} aria-hidden="true" /></a><p>{resource.focus}</p></div>)}</section>
        <section className={styles.panel}><span className={styles.panelLabel}>SAVE FOR LATER</span><p>{course.defer}</p></section>
        <Link href="/app/roadmap" className="buttonSecondary"><BookOpen size={15} aria-hidden="true" />See where this fits</Link>
      </aside>
    </div>
  </div></AppShell>;
}
