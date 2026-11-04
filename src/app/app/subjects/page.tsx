'use client';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, Search, CheckCircle2 } from 'lucide-react';
import { ReactiveSurface } from '@/components/ui/ReactiveSurface';
import { AppShell } from '@/components/layout/AppShell';
import { COURSE_GUIDES } from '@/lib/db/course-guides';
import { LEARNING_DAYS } from '@/lib/db/curriculum-data';
import { courseLessons, guidedCourseFor, lessonPosition, GUIDED_COURSES } from '@/lib/db/guided-courses';
import { subjectHref } from '@/lib/db/catalog-navigation';
import { useLibraryFilters, useStudyLibrary } from '@/components/courses/useStudyLibrary';
import styles from '@/components/courses/Courses.module.scss';

const COURSE_FILTERS = ['all', 'guided', 'remaining', 'completed'] as const;
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
    const done = courseLessons(course.id).every(day => completedIds.includes(day.id));
    return matches && (filter === 'completed' ? !loading && !error && done : filter === 'remaining' ? !loading && !error && !done : true);
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
          <Link href={featuredActive ? `/app/learn/${featuredActive.phase_id}/${featuredActive.id}` : subjectHref(featuredCourse.id,query,filter)}>{featuredActive ? `Continue lesson ${lessonPosition(featuredActive)}` : 'Explore the course'} <ArrowRight size={16} aria-hidden="true" /></Link>
          <Link href={subjectHref(featuredCourse.id,query,filter)}>Browse all lessons</Link>
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
      <div className={styles.filters} aria-label="Filter courses">{[['all','All courses'],['remaining','Remaining'],['completed','Completed']].map(([id,label])=><button key={id} aria-pressed={(filter==='guided'?'all':filter)===id} onClick={()=>setFilter(id)}>{label}</button>)}</div>
      <label className={styles.search}><Search size={16} aria-hidden="true" /><input aria-label="Search courses" placeholder="Search a skill or topic…" value={query} onChange={e=>setQuery(e.target.value)} /></label>
    </div>
    <div className={styles.sectionHeading}><h2>Your course collection</h2><span aria-live="polite">{courses.length} courses · {LEARNING_DAYS.length} guided lessons overall</span></div>
    <div className={styles.grid}>{courses.map(course => {
      const index = COURSE_GUIDES.indexOf(course);
      const days = courseLessons(course.id);
      const lessonCount = days.length;
      return <article key={course.id} className={styles.card} data-tone={index}>
        <div className={styles.cover} data-tone={index}><span className={styles.coverLabel}>TRACK {String(index+1).padStart(2,'0')}<br />{GUIDED_COURSES.find(item => item.id === course.id)?.phaseId}</span><svg className={styles.courseDiagram} viewBox="0 0 240 140" fill="none" aria-hidden="true"><path d={index % 2 === 0 ? 'M10 110 H55 V70 H115 V30 H180 V70 H230' : 'M10 30 H65 V90 H125 V50 H180 V110 H230'} /><path d="M10 130 H95 V110 H155 V10 H230" strokeDasharray="3 5" />{[55,115,180].map((x,i)=><g key={x}><circle cx={x} cy={[70,30,70][i]} r="11" /><circle cx={x} cy={[70,30,70][i]} r="3" /></g>)}</svg><span className={styles.symbol} aria-hidden="true">{course.symbol}</span></div>
        <div className={styles.cardBody}>
          <span className={styles.badge}><CheckCircle2 size={13} aria-hidden="true" />{lessonCount} guided lessons</span>
          <h2>{course.title}</h2><p>{course.tagline}</p>
          <details className={styles.quickPreview}><summary>Inside this course <span aria-hidden="true">+</span></summary><div><span className={styles.previewLabel}>WHAT YOU’LL PRACTICE</span><ol>{days.map(day=><li key={day.id}>{day.title}</li>)}</ol><span className={styles.previewLabel}>BEFORE YOU START</span><p>{course.prerequisite}</p></div></details>
          <div className={styles.cardFooter}><span>{`${lessonCount} lessons`}</span><Link href={subjectHref(course.id,query,filter)}>Explore lessons<ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> for {course.title}</span></Link></div>
        </div>
      </article>;
    })}</div>
    {courses.length===0 && (loading || error) && (filter==='completed'||filter==='remaining') ? <p role="status">{loading?'Loading course progress…':'Course progress is unavailable.'}</p> : courses.length===0 && <div className={styles.empty}><h2>No courses match that search</h2><p>Try a broader topic or show the full collection.</p><button className="buttonSecondary" onClick={()=>{setQuery('');setFilter('all');}}>Clear filters</button></div>}
    <p className={styles.note}>Guided lessons save task progress and schedule recall across all six courses. Use the roadmap to find related projects and readiness checks.</p>
  </div></AppShell>;
}
