'use client';

import Link from 'next/link';
import { LearningStudio } from '@/components/studio/LearningStudio';
import { JourneyCard } from '@/components/today/JourneyCard';
import { StudyGuide } from '@/components/learn/StudyGuide';
import React, { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { DayHero } from '@/components/today/DayHero';
import { MetricStrip } from '@/components/today/MetricStrip';
import { TaskChecklist } from '@/components/today/TaskChecklist';
import { DueReviewsList } from '@/components/today/DueReviewsList';
import { NextMilestoneCard } from '@/components/today/NextMilestoneCard';
import { ProgressRepository } from '@/lib/db/progress-repository';
import { LEARNING_DAYS, MODULES } from '@/lib/db/curriculum-data';
import { UserProfile, UserTaskProgress, ConceptReview, LearningDay } from '@/lib/db/types';
import styles from './Today.module.scss';

export default function TodayPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeDay, setActiveDay] = useState<LearningDay>(LEARNING_DAYS[0]);
  const [taskMap, setTaskMap] = useState<Record<string, UserTaskProgress>>({});
  const [isDayCompleted, setIsDayCompleted] = useState<boolean>(false);
  const [dueReviews, setDueReviews] = useState<ConceptReview[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [curriculumFinished, setCurriculumFinished] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
    const prof = await ProgressRepository.getProfile();
    setProfile(prof);

    // Find the learning day corresponding to user's active_day_index
    const day =
      LEARNING_DAYS.find(d => d.sequence_index === prof.active_day_index) ||
      LEARNING_DAYS[LEARNING_DAYS.length - 1];
    setCurriculumFinished(prof.active_day_index > LEARNING_DAYS[LEARNING_DAYS.length - 1].sequence_index);
    setActiveDay(day);

    const tasks = await ProgressRepository.getDayTaskProgresses('local_user', day.id);
    setTaskMap(tasks);

    const dayProg = await ProgressRepository.getDayProgress('local_user', day.id);
    setIsDayCompleted(dayProg?.state === 'completed');

    const reviews = await ProgressRepository.getDueReviews('local_user', prof.active_day_index);
    setDueReviews(reviews);

    const records = await Promise.all(LEARNING_DAYS.map(d => ProgressRepository.getDayProgress('local_user', d.id)));
    setCompletedIds(records.filter(r => r?.state === 'completed').map(r => r!.learning_day_id));
    setLoadError(false);
    } catch { setLoadError(true); }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const completedDaysCount = completedIds.length;
  const phase0Modules = MODULES.filter(m => m.phase_id === 'P0');

  return (
    <AppShell>
      <header className={styles.pageHeading}>
        <div><span className={styles.kicker}>YOUR DAILY WORKSPACE</span><h1>{profile?.alias && profile.alias !== 'Student Engineer' ? `Let’s make progress, ${profile.alias}.` : 'A little progress. Every day.'}</h1><p>A clear plan, a little practice, and something to show for it.</p></div>
        <Link href="/app/subjects" className="buttonSecondary">Browse your courses <span aria-hidden="true">↗</span></Link>
      </header>
      {loadError ? <p role="alert">Could not load your saved progress. <button className="buttonSecondary" onClick={loadData}>Try again</button></p> : loading ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--muted)' }}>
          Loading daily study workspace...
        </div>
      ) : (
        <>
            <MetricStrip
              completedDaysCount={completedDaysCount}
              phaseModulesCount={phase0Modules.filter(m => { const days = LEARNING_DAYS.filter(d => d.tasks.some(t => t.required && t.module_id === m.id)); return days.length > 0 && days.every(d => completedIds.includes(d.id)); }).length}
              totalPhaseModules={phase0Modules.length}
              dueReviewsCount={dueReviews.length}
            />
        <div className={styles.dashboardGrid}>
          <div className={styles.primaryColumn}>
            {curriculumFinished ? (
              <section style={{ padding: 28, marginBottom: 24, border: '1px solid var(--hairline)', borderRadius: 16, background: 'var(--surface)' }}>
                <h1>Your foundation lessons are complete</h1>
                <p style={{ margin: '12px 0 20px', color: 'var(--muted)' }}>You have reached the end of the 30 available guided lessons. Check the Phase 0 rubric, revisit weak topics, and use the later phases as study outlines. Their daily lessons are not yet available.</p>
                <Link className="buttonPrimary" href="/app/roadmap/P0">Check foundation readiness</Link>
              </section>
            ) : profile?.preferred_mode === 'maintenance' ? (
              <section style={{ padding: 28, marginBottom: 24, background: 'var(--accent-soft)', borderRadius: 16 }}>
                <h1>Keep it light today</h1>
                <p style={{ margin: '12px 0' }}>Your learning day is paused. Spend 15–30 minutes recalling a concept or revisiting an earlier exercise. No new lesson is required.</p>
                <Link className="buttonSecondary" href="/app/settings">Resume normal study in Settings</Link>
              </section>
            ) : <>
              <DayHero day={activeDay} isCompleted={isDayCompleted} />
              <LearningStudio key={activeDay.id} day={activeDay} />
              <StudyGuide day={activeDay} minutes={profile?.preferred_daily_minutes} />
            </>}
            {!curriculumFinished && profile?.preferred_mode !== 'maintenance' &&
            <TaskChecklist
              key={activeDay.id}
              day={activeDay}
              initialTaskMap={taskMap}
              isDayCompleted={isDayCompleted}
              onDayCompletedChange={loadData}
            />}
          </div>

          <div className={styles.supportingColumn}>
            <JourneyCard completedIds={completedIds} activeDayId={activeDay.id} />
            <DueReviewsList reviews={dueReviews} onReviewCompleted={loadData} />
            <NextMilestoneCard currentPhaseId={activeDay.phase_id} />
          </div>
        </div>
        </>
      )}
    </AppShell>
  );
}
