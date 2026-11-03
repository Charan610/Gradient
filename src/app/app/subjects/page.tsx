'use client';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, Search, BookOpen, CheckCircle2 } from 'lucide-react';
import { ReactiveSurface } from '@/components/ui/ReactiveSurface';
import { AppShell } from '@/components/layout/AppShell';
import { COURSE_GUIDES } from '@/lib/db/course-guides';
import { LEARNING_DAYS } from '@/lib/db/curriculum-data';
import { courseLessons, guidedCourseFor, lessonPosition, GUIDED_COURSES } from '@/lib/db/guided-courses';
import { CourseInterest } from '@/components/courses/CourseInterest';
import { useLibraryFilters, useStudyLibrary } from '@/components/courses/useStudyLibrary';
import styles from '@/components/courses/Courses.module.scss';

const COURSE_FILTERS = ['all', 'guided', 'outlines'] as const;
export default function SubjectsPage() {
  const { query, setQuery, filter, setFilter } = useLibraryFilters(COURSE_FILTERS);
  const { loading, error, completedIds, activeSequence } = useStudyLibrary();
  const active = !loading && !error ? LEARNING_DAYS.find(day => day.sequence_index === activeSequence) : undefined;
  const activeCourse = active ? guidedCourseFor(active) : undefined;
  const featuredCourse = activeCourse ?? GUIDED_COURSES[0];
  const featuredLessons = courseLessons(featuredCourse.id);
  const featuredCompleted = featuredLessons.filter(day => completedIds.includes(day.id)).length;
  const featuredActive = active && activeCourse?.id === featuredCourse.id ? active : undefined;
  const courses = COURSE_GUIDES.filter(course => {
    const matches = `${course.title} ${course.description}`.toLowerCase().includes(query.trim().toLowerCase());
    const guided = GUIDED_COURSES.some(item => item.id === course.id);
    return matches && (filter === 'all' || (filter === 'guided' ? guided : !guided));
  });
  return <AppShell><div className={styles.page}>
    <header className={styles.heading}>
      <div><span className={styles.eyebrow}>THE LEARNING LIBRARY</span><h1>Build your engineering foundation.</h1><p>One clear path through the essentials. Start with the guided lessons, then explore the skills that turn practice into real projects.</p></div>
      <Link href="/app/roadmap" className="buttonSecondary">View roadmap <ArrowUpRight size={15} aria-hidden="true" /></Link>
    </header>
    <ReactiveSurface className={styles.featured} label="Your guided course">
      <div className={styles.featuredContent}>
        <span className={styles.eyebrow}>{featuredActive ? 'YOUR CURRENT COURSE' : 'YOUR STARTING POINT'}</span>
        <h2>{featuredCourse.title}</h2>
        <p>{featuredCourse.description} {featuredLessons.length} guided lessons, each with an exercise and a way to check your understanding.</p>
        <div className={styles.featuredActions}>
          <Link href={featuredActive ? `/app/learn/${featuredActive.phase_id}/${featuredActive.id}` : `/app/subjects/${featuredCourse.id.toLowerCase()}`}>{featuredActive ? `Continue lesson ${lessonPosition(featuredActive)}` : 'Explore the course'} <ArrowRight size={16} aria-hidden="true" /></Link>
          <Link href={`/app/subjects/${featuredCourse.id.toLowerCase()}`}>Browse all lessons</Link>
        </div>
      </div>
      <div className={styles.featuredProgress}>
        <span>YOUR COURSE PROGRESS</span>
        <strong>{loading || error ? '—' : featuredCompleted}<small> / {featuredLessons.length}</small></strong>
        <progress max={featuredLessons.length || 1} value={loading || error ? 0 : featuredCompleted} aria-label={`Completed ${featuredCourse.title} lessons`} />
        <p>{error ? 'Saved progress could not be loaded. Reload to try again.' : 'Your completed lessons in this course. Take the next step when you’re ready.'}</p>
      </div>
    </ReactiveSurface>
    <div className={styles.toolbar}>
      <div className={styles.filters} aria-label="Filter courses">{[['all','All courses'],['guided','Guided lessons'],['outlines','Study outlines']].map(([id,label])=><button key={id} aria-pressed={filter===id} onClick={()=>setFilter(id)}>{label}</button>)}</div>
      <label className={styles.search}><Search size={16} aria-hidden="true" /><input aria-label="Search courses" placeholder="Search a skill or topic…" value={query} onChange={e=>setQuery(e.target.value)} /></label>
    </div>
    <div className={styles.sectionHeading}><h2>Your course collection</h2><span aria-live="polite">{courses.length} courses</span></div>
    <div className={styles.grid}>{courses.map(course => {
      const index = COURSE_GUIDES.indexOf(course);
      const guided = GUIDED_COURSES.some(item => item.id === course.id);
      const days = courseLessons(course.id);
      const lessonCount = days.length;
      return <article key={course.id} className={styles.card} data-tone={index}>
        <div className={styles.cover} data-tone={index}><span className={styles.coverLabel}>TRACK {String(index+1).padStart(2,'0')}<br />{guided ? GUIDED_COURSES.find(item => item.id === course.id)?.phaseId : course.phase}</span><svg className={styles.courseDiagram} viewBox="0 0 240 140" fill="none" aria-hidden="true"><path d={index % 2 === 0 ? 'M10 110 H55 V70 H115 V30 H180 V70 H230' : 'M10 30 H65 V90 H125 V50 H180 V110 H230'} /><path d="M10 130 H95 V110 H155 V10 H230" strokeDasharray="3 5" />{[55,115,180].map((x,i)=><g key={x}><circle cx={x} cy={[70,30,70][i]} r="11" /><circle cx={x} cy={[70,30,70][i]} r="3" /></g>)}</svg><span className={styles.symbol} aria-hidden="true">{course.symbol}</span></div>
        <div className={styles.cardBody}>
          <span className={styles.badge}>{guided?<CheckCircle2 size={13} aria-hidden="true" />:<BookOpen size={13} aria-hidden="true" />}{guided?`${lessonCount} guided lessons`:'Self-directed study outline'}</span>
          <h2>{course.title}</h2><p>{course.tagline}</p>
          {!guided && <CourseInterest courseId={course.id} />}
          <details className={styles.quickPreview}><summary>Inside this course <span aria-hidden="true">+</span></summary><div><span className={styles.previewLabel}>WHAT YOU’LL PRACTICE</span><ol>{guided ? days.map(day=><li key={day.id}>{day.title}</li>) : course.topics.map(topic=><li key={topic.title}>{topic.title}</li>)}</ol><span className={styles.previewLabel}>BEFORE YOU START</span><p>{course.prerequisite}</p></div></details>
          <div className={styles.cardFooter}><span>{guided ? `${lessonCount} lessons` : `${course.topics.length} topic groups`}</span><Link href={`/app/subjects/${course.id.toLowerCase()}`}>{guided?'Explore lessons':'Explore outline'}<ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> for {course.title}</span></Link></div>
        </div>
      </article>;
    })}</div>
    {courses.length===0 && <div className={styles.empty}><h2>No courses match that search</h2><p>Try a broader topic or show the full collection.</p><button className="buttonSecondary" onClick={()=>{setQuery('');setFilter('all');}}>Clear filters</button></div>}
    <p className={styles.note}>Guided lessons save task progress and schedule recall. Study outlines provide prerequisites, practice checkpoints, and resources; their daily lesson plans are not yet available.</p>
  </div></AppShell>;
}
