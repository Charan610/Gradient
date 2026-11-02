'use client';

import { StudyGuide } from '@/components/learn/StudyGuide';
import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import {LessonNotes} from '@/components/learn/LessonNotes';
import { ArrowLeft, Clock, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { TaskChecklist } from '@/components/today/TaskChecklist';
import { LEARNING_DAYS, MODULES } from '@/lib/db/curriculum-data';
import { ProgressRepository } from '@/lib/db/progress-repository';
import { LearningDay, UserTaskProgress } from '@/lib/db/types';
import styles from './LearnDay.module.scss';

interface PageProps {
  params: Promise<{
    phaseId: string;
    dayId: string;
  }>;
}

export default function LearnDayPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { phaseId, dayId } = resolvedParams;

  const [day, setDay] = useState<LearningDay | null>(null);
  const [taskMap, setTaskMap] = useState<Record<string, UserTaskProgress>>({});
  const [isDayCompleted, setIsDayCompleted] = useState(false);
  const [notes,setNotes]=useState('');
  const [minutes, setMinutes] = useState(90);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [activeSequence, setActiveSequence] = useState(1);

  const loadDayData = React.useCallback(async () => {
    setLoadError(false);
    try {
      const foundDay = LEARNING_DAYS.find(d => d.id === dayId && d.phase_id === phaseId);
      if (!foundDay) { setDay(null); setLoading(false); return; }
      const [profile, tasks, dayProg] = await Promise.all([
        ProgressRepository.getProfile(),
        ProgressRepository.getDayTaskProgresses('local_user', foundDay.id),
        ProgressRepository.getDayProgress('local_user', foundDay.id),
      ]);
      setMinutes(profile.preferred_daily_minutes);
      setActiveSequence(profile.active_day_index);
      setNotes(dayProg?.notes||'');
      setDay(foundDay);
      setTaskMap(tasks);
      setIsDayCompleted(dayProg?.state === 'completed');
    } catch { setLoadError(true); }
    finally { setLoading(false); }
  }, [dayId, phaseId]);

  useEffect(() => {
    setLoading(true);
    void loadDayData();
  }, [loadDayData]);

  if (loadError) return <AppShell><section className={styles.sideCard} role="alert"><h1>Your lesson couldn’t be loaded</h1><p>Your saved progress has not been reset. Check browser storage, then retry.</p><button className="buttonSecondary" onClick={loadDayData}>Try again</button></section></AppShell>;

  if (!loading && !day) return <AppShell><h1>Lesson unavailable</h1><Link href="/app/today">Return to your active lesson</Link></AppShell>;

  if (loading || !day) {
    return (
      <AppShell>
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--muted)' }}>
          Loading study session...
        </div>
      </AppShell>
    );
  }

  const module = MODULES.find(item => day.tasks.some(task => task.module_id === item.id));
  const resumeTask=day.tasks.find(task=>task.required&&taskMap[task.id]?.status!=='completed');
  const hasWork=notes.length>0||Object.values(taskMap).some(task=>task.status==='completed'||task.evidence_text);
  const isPreview = day.sequence_index > activeSequence && !isDayCompleted;

  // Previous and next learning days
  const currentIndex = LEARNING_DAYS.findIndex(d => d.id === day.id);
  const prevDay = currentIndex > 0 ? LEARNING_DAYS[currentIndex - 1] : null;
  const nextDay = currentIndex < LEARNING_DAYS.length - 1 ? LEARNING_DAYS[currentIndex + 1] : null;

  return (
    <AppShell>
      <div className={styles.learnLayout}>
        <div className={styles.mainColumn}>
          <div className={styles.headerBar}>
            <Link href="/app/today" className={styles.backLink}>
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="phaseBadge">Phase {day.phase_id.replace('P', '')}</span>
              <span style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'monospace' }}>
                Lesson {day.sequence_index < 10 ? `0${day.sequence_index}` : day.sequence_index}
              </span>
            </div>

            <h1 className={styles.dayTitle}>{day.title}</h1>
          </div>

          <div className={styles.goalCard}>
            <div style={{ fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '4px' }}>
              What you’ll learn
            </div>
            <p className={styles.goalText}>{day.goal}</p>
          </div>

          {hasWork&&!isDayCompleted&&<section className={styles.resume}><h2>Pick up where you left off</h2><p>Your saved notes and checked activities are here.</p><a href={resumeTask?`#task-row-${resumeTask.id}`:'#finish-day-button'}>{resumeTask?`Resume: ${resumeTask.title}`:'Finish this lesson'} →</a></section>}
          <StudyGuide day={day} minutes={minutes} />

          {isPreview && <div className={styles.previewNotice} role="note"><strong>You’re previewing a future lesson.</strong><p>You can read ahead. Finish your current lesson before completing this one.</p><Link href="/app/today">Return to your current lesson →</Link></div>}

          {isDayCompleted && <section className={styles.completion} aria-label="Lesson completed"><CheckCircle size={22} /><div><h2>Lesson complete. Nicely done.</h2><p>Your work is saved. {nextDay ? 'Ready for the next small step?' : 'You’ve reached the end of the guided foundation lessons.'}</p><Link className="buttonPrimary" href={nextDay ? `/app/learn/${nextDay.phase_id}/${nextDay.id}` : '/app/roadmap/P0'}>{nextDay ? 'Continue to next lesson' : 'Check foundation readiness'} <ChevronRight size={16} /></Link></div></section>}

          <div style={{ marginTop: '24px' }}>
            <TaskChecklist
              key={day.id}
              day={day}
              initialTaskMap={taskMap}
              isDayCompleted={isDayCompleted}
              onDayCompletedChange={loadDayData}
            />
          </div>
        </div>

        <div className={styles.sideColumn}>
          <LessonNotes key={day.id} dayId={day.id} initialNotes={notes}/>
          <div className={styles.sideCard}>
            <div className={styles.sideHeading}>Make this fit your day</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', marginBottom: '12px' }}>
              <Clock size={16} color="var(--accent)" />
              <strong>{day.estimated_minutes} Minutes</strong>
              <span style={{ color: 'var(--muted)', fontSize: '12px' }}>(Recommended pacing)</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', lineHeight: 1.5 }}>
              Your session preference is {minutes} minutes. Take breaks whenever you need. This lesson stays here until you finish its required activities.
            </p>
          </div>

          <details className={styles.sideCard}>
            <summary className={styles.sideHeading}>How to check your work</summary>
            <ul className={styles.criteriaList}>
              {day.tasks.filter(t => t.required).map(t => (
                <li key={t.id}>{t.validation_criteria}</li>
              ))}
            </ul>
          </details>

          <div className={styles.sideCard}>
            <div className={styles.sideHeading}>Why this lesson matters</div>
            <p className={styles.context}>{module?.learning_outcomes[0] || day.goal}</p>
            <p className={styles.context}>{prevDay ? `Builds on lesson ${prevDay.sequence_index}: ${prevDay.title}. Revisit it if you need a refresher.` : 'No programming experience needed. Start with the reading, then try the exercise in your own editor.'}</p>
          </div>
          <div className={styles.sideCard}>
            <div className={styles.sideHeading}>Find your way</div>
            <Link href="/app/subjects/cpp" className="buttonTertiary" style={{ marginBottom: 16 }}>Browse all 30 lessons ↗</Link>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
              {prevDay ? (
                <Link
                  href={`/app/learn/${prevDay.phase_id}/${prevDay.id}`}
                  className="buttonSecondary"
                  style={{ minHeight: '38px', fontSize: '12px', flex: 1 }}
                >
                  <ChevronLeft size={13} />
                  <span>Lesson {prevDay.sequence_index}</span>
                </Link>
              ) : (
                <div style={{ flex: 1 }} />
              )}

              {nextDay ? (
                <Link
                  href={`/app/learn/${nextDay.phase_id}/${nextDay.id}`}
                  className="buttonSecondary"
                  style={{ minHeight: '38px', fontSize: '12px', flex: 1 }}
                >
                  <span>{isDayCompleted ? "Next" : "Preview"} {nextDay.sequence_index}</span>
                  <ChevronRight size={13} />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>

    </AppShell>
  );
}
