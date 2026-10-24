'use client';

import { StudyGuide } from '@/components/learn/StudyGuide';
import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, BookOpen, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { ResourceAssignmentCard } from '@/components/learn/ResourceAssignmentCard';
import { TaskChecklist } from '@/components/today/TaskChecklist';
import { LEARNING_DAYS } from '@/lib/db/curriculum-data';
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
  const router = useRouter();
  const resolvedParams = use(params);
  const { phaseId, dayId } = resolvedParams;

  const [day, setDay] = useState<LearningDay | null>(null);
  const [taskMap, setTaskMap] = useState<Record<string, UserTaskProgress>>({});
  const [isDayCompleted, setIsDayCompleted] = useState(false);
  const [minutes, setMinutes] = useState(90);
  const [loading, setLoading] = useState(true);

  const loadDayData = async () => {
    const foundDay = LEARNING_DAYS.find(d => d.id === dayId && d.phase_id === phaseId);
    if (!foundDay) { setDay(null); setLoading(false); return; }
    setMinutes((await ProgressRepository.getProfile()).preferred_daily_minutes);
    setDay(foundDay);

    const tasks = await ProgressRepository.getDayTaskProgresses('local_user', foundDay.id);
    setTaskMap(tasks);

    const dayProg = await ProgressRepository.getDayProgress('local_user', foundDay.id);
    setIsDayCompleted(dayProg?.state === 'completed');

    setLoading(false);
  };

  useEffect(() => {
    loadDayData();
  }, [dayId]);

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

  // Find assigned resources from tasks
  const allAssignments = day.tasks.flatMap(t => t.assigned_resources || []);

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
              <span>Back to Daily Cockpit</span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="phaseBadge">Phase {day.phase_id.replace('P', '')}</span>
              <span style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'monospace' }}>
                Sequence Day {day.sequence_index < 10 ? `0${day.sequence_index}` : day.sequence_index}
              </span>
            </div>

            <h1 className={styles.dayTitle}>{day.title}</h1>
          </div>

          <div className={styles.goalCard}>
            <div style={{ fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '4px' }}>
              Learning Day Target
            </div>
            <p className={styles.goalText}>{day.goal}</p>
          </div>

          <StudyGuide day={day} minutes={minutes} />

          {allAssignments.length > 0 && (
            <div>
              <div className={styles.sectionHeading}>
                <BookOpen size={16} />
                <span>Assigned Source Study Material</span>
              </div>
              {allAssignments.map((assignment, idx) => (
                <ResourceAssignmentCard
                  key={`${assignment.resource_id}-${idx}`}
                  assignment={assignment}
                />
              ))}
            </div>
          )}

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
          <div className={styles.sideCard}>
            <div className={styles.sideHeading}>Session Allocation</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', marginBottom: '12px' }}>
              <Clock size={16} color="var(--accent)" />
              <strong>{day.estimated_minutes} Minutes</strong>
              <span style={{ color: 'var(--muted)', fontSize: '12px' }}>(Recommended pacing)</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', lineHeight: 1.5 }}>
              Take breaks as needed. Your active study day does not advance automatically due to elapsed time. Advance only when you complete required work.
            </p>
          </div>

          <div className={styles.sideCard}>
            <div className={styles.sideHeading}>Required Proof Criteria</div>
            <ul className={styles.criteriaList}>
              {day.tasks.filter(t => t.required).map(t => (
                <li key={t.id}>{t.validation_criteria}</li>
              ))}
            </ul>
          </div>

          <div className={styles.sideCard}>
            <div className={styles.sideHeading}>Sequence Navigation</div>
            <Link href="/app/subjects/cpp" className="buttonTertiary" style={{ marginBottom: 16 }}>Browse all 30 lessons ↗</Link>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
              {prevDay ? (
                <Link
                  href={`/app/learn/${prevDay.phase_id}/${prevDay.id}`}
                  className="buttonSecondary"
                  style={{ minHeight: '38px', fontSize: '12px', flex: 1 }}
                >
                  <ChevronLeft size={13} />
                  <span>Day {prevDay.sequence_index}</span>
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
                  <span>Day {nextDay.sequence_index}</span>
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
