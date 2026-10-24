'use client';

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
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const prof = await ProgressRepository.getProfile();
    setProfile(prof);

    // Find the learning day corresponding to user's active_day_index
    const day =
      LEARNING_DAYS.find(d => d.sequence_index === prof.active_day_index) ||
      LEARNING_DAYS[0];
    setActiveDay(day);

    const tasks = await ProgressRepository.getDayTaskProgresses('local_user', day.id);
    setTaskMap(tasks);

    const dayProg = await ProgressRepository.getDayProgress('local_user', day.id);
    setIsDayCompleted(dayProg?.state === 'completed');

    const reviews = await ProgressRepository.getDueReviews('local_user', prof.active_day_index);
    setDueReviews(reviews);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const completedDaysCount = Math.max(0, (profile?.active_day_index ?? 1) - (isDayCompleted ? 0 : 1));
  const phase0Modules = MODULES.filter(m => m.phase_id === 'P0');

  return (
    <AppShell>
      {loading ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--muted)' }}>
          Loading daily study workspace...
        </div>
      ) : (
        <div className={styles.dashboardGrid}>
          <div className={styles.primaryColumn}>
            <DayHero day={activeDay} isCompleted={isDayCompleted} />
            <TaskChecklist
              day={activeDay}
              initialTaskMap={taskMap}
              isDayCompleted={isDayCompleted}
              onDayCompletedChange={loadData}
            />
          </div>

          <div className={styles.supportingColumn}>
            <MetricStrip
              completedDaysCount={completedDaysCount}
              phaseModulesCount={Math.min(5, Math.ceil(activeDay.sequence_index / 6))}
              totalPhaseModules={phase0Modules.length}
              dueReviewsCount={dueReviews.length}
            />
            <DueReviewsList reviews={dueReviews} onReviewCompleted={loadData} />
            <NextMilestoneCard currentPhaseId={activeDay.phase_id} />
          </div>
        </div>
      )}
    </AppShell>
  );
}
