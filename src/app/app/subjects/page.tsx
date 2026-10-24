'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, Search, BookOpen, CheckCircle2 } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { COURSE_GUIDES } from '@/lib/db/course-guides';
import { LEARNING_DAYS } from '@/lib/db/curriculum-data';
import { useStudyLibrary } from '@/components/courses/useStudyLibrary';
import styles from '@/components/courses/Courses.module.scss';

export default function SubjectsPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const { loading, error, completedIds, activeSequence } = useStudyLibrary();
  const active = LEARNING_DAYS.find(day => day.sequence_index === activeSequence);
  const courses = COURSE_GUIDES.filter(course => {
    const matches = `${course.title} ${course.description}`.toLowerCase().includes(query.trim().toLowerCase());
    return matches && (filter === 'all' || (filter === 'guided' ? course.id === 'CPP' : course.id !== 'CPP'));
  });
  return <AppShell><div className={styles.page}>
    <header className={styles.heading}>
      <div><span className={styles.eyebrow}>THE LEARNING LIBRARY</span><h1>Build your engineering foundation.</h1><p>One clear path through the essentials. Start with the guided lessons, then explore the skills that turn practice into real projects.</p></div>
      <Link href="/app/roadmap" className="buttonSecondary">View roadmap <ArrowUpRight size={15} aria-hidden="true" /></Link>
    </header>
    <section className={styles.featured} aria-label="Your foundation course">
      <div className={styles.featuredContent}>
        <span className={styles.eyebrow}>{completedIds.length ? 'PICK UP WHERE YOU LEFT OFF' : 'YOUR STARTING POINT'}</span>
        <h2>C++ Foundations</h2>
        <p>From your first line of code to a program you can build, test, and explain. 30 lessons, each with an exercise and a way to check your understanding.</p>
        <div className={styles.featuredActions}>
          <Link href={active ? `/app/learn/${active.phase_id}/${active.id}` : '/app/roadmap/P0'}>{loading ? 'Open current lesson' : active ? `Continue Day ${String(active.sequence_index).padStart(2,'0')}` : 'Check your readiness'} <ArrowRight size={16} aria-hidden="true" /></Link>
          <Link href="/app/subjects/cpp">Browse all lessons</Link>
        </div>
      </div>
      <div className={styles.featuredProgress}>
        <span>YOUR FOUNDATION PROGRESS</span>
        <strong>{loading || error ? '—' : completedIds.length}<small> / 30</small></strong>
        <progress max={30} value={completedIds.length} aria-label="Completed foundation lessons" />
        <p>{error ? 'Saved progress could not be loaded. Reload to try again.' : 'Completed learning days. No streaks. No deadlines.'}</p>
      </div>
    </section>
    <div className={styles.toolbar}>
      <div className={styles.filters} aria-label="Filter courses">{[['all','All courses'],['guided','Guided lessons'],['outlines','Study outlines']].map(([id,label])=><button key={id} aria-pressed={filter===id} onClick={()=>setFilter(id)}>{label}</button>)}</div>
      <label className={styles.search}><Search size={16} aria-hidden="true" /><input aria-label="Search courses" placeholder="Search a skill or topic…" value={query} onChange={e=>setQuery(e.target.value)} /></label>
    </div>
    <div className={styles.sectionHeading}><h2>Your course collection</h2><span aria-live="polite">{courses.length} courses</span></div>
    <div className={styles.grid}>{courses.map(course => {
      const index = COURSE_GUIDES.indexOf(course);
      return <article key={course.id} className={styles.card}>
        <div className={styles.cover} data-tone={index}><span className={styles.coverLabel}>TRACK {String(index+1).padStart(2,'0')}<br />{course.phase}</span><span className={styles.symbol} aria-hidden="true">{course.symbol}</span></div>
        <div className={styles.cardBody}>
          <span className={styles.badge}>{course.id==='CPP'?<CheckCircle2 size={13} aria-hidden="true" />:<BookOpen size={13} aria-hidden="true" />}{course.id==='CPP'?'30 guided lessons':'Self-directed study outline'}</span>
          <h2>{course.title}</h2><p>{course.tagline}</p>
          <div className={styles.cardFooter}><span>{course.topics.length} topic groups</span><Link href={`/app/subjects/${course.id.toLowerCase()}`}>{course.id==='CPP'?'Explore lessons':'Explore outline'}<ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> for {course.title}</span></Link></div>
        </div>
      </article>;
    })}</div>
    {courses.length===0 && <div className={styles.empty}><h2>No courses match that search</h2><p>Try a broader topic or show the full collection.</p><button className="buttonSecondary" onClick={()=>{setQuery('');setFilter('all');}}>Clear filters</button></div>}
    <p className={styles.note}>Guided lessons save task progress and schedule recall. Study outlines provide prerequisites, practice checkpoints, and resources; their daily lesson plans are not yet available.</p>
  </div></AppShell>;
}
