'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { LearningDay, UserTaskProgress } from '@/lib/db/types';
import { ProgressRepository } from '@/lib/db/progress-repository';
import { TaskRow } from './TaskRow';
import styles from './TaskChecklist.module.scss';

interface TaskChecklistProps {
  day: LearningDay;
  initialTaskMap: Record<string, UserTaskProgress>;
  isDayCompleted: boolean;
  onDayCompletedChange?: () => void;
}

export function TaskChecklist({
  day,
  initialTaskMap,
  isDayCompleted,
  onDayCompletedChange
}: TaskChecklistProps) {
  const router = useRouter();
  const [taskMap, setTaskMap] = useState<Record<string, UserTaskProgress>>(initialTaskMap);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggle = async (taskId: string, completed: boolean) => {
    const status = completed ? 'completed' : 'not_started';
    const updated = await ProgressRepository.updateTaskProgress(
      'local_user',
      day.id,
      taskId,
      status
    );
    setTaskMap(prev => ({ ...prev, [taskId]: updated }));
    setValidationError(null);
  };

  const handleSaveEvidence = async (taskId: string, evidenceText: string) => {
    const currentStatus = taskMap[taskId]?.status || 'not_started';
    const updated = await ProgressRepository.updateTaskProgress(
      'local_user',
      day.id,
      taskId,
      currentStatus,
      evidenceText
    );
    setTaskMap(prev => ({ ...prev, [taskId]: updated }));
  };

  const handleFinishDay = async () => {
    setIsSubmitting(true);
    setValidationError(null);
    setSuccessMessage(null);

    const result = await ProgressRepository.finishLearningDay('local_user', day.id);
    setIsSubmitting(false);

    if (!result.success) {
      if (result.error === 'incomplete_required_tasks') {
        setValidationError(
          `Cannot finish day: ${result.remaining_count} required task(s) remain incomplete. Complete all mandatory items before advancing.`
        );
      } else {
        setValidationError('An error occurred while completing the learning day.');
      }
      return;
    }

    setSuccessMessage('Day completed! Next session unlocked in your sequence.');
    if (onDayCompletedChange) {
      onDayCompletedChange();
    }
    // Refresh router
    router.refresh();
  };

  const completedCount = Object.values(taskMap).filter(t => t.status === 'completed').length;
  const totalCount = day.tasks.length;

  const learnTasks = day.tasks.filter(t => t.kind === 'learn');
  const practiceTasks = day.tasks.filter(t => t.kind === 'practice');
  const applyTasks = day.tasks.filter(t => t.kind === 'apply');
  const reviewTasks = day.tasks.filter(t => t.kind === 'review');

  return (
    <section className={styles.checklistSection} aria-labelledby="checklist-heading">
      <div className={styles.sectionHeader}>
        <h2 id="checklist-heading" className={styles.heading}>
          Today&apos;s Focus Tasks
        </h2>
        <span className={styles.progressCounter}>
          {completedCount} of {totalCount} Completed
        </span>
      </div>

      {learnTasks.length > 0 && (
        <>
          <div className={styles.groupTitle}>1. Learn & Comprehend</div>
          {learnTasks.map(t => (
            <TaskRow
              key={t.id}
              task={t}
              progress={taskMap[t.id]}
              onToggle={handleToggle}
              onSaveEvidence={handleSaveEvidence}
            />
          ))}
        </>
      )}

      {practiceTasks.length > 0 && (
        <>
          <div className={styles.groupTitle}>2. Practice & Code</div>
          {practiceTasks.map(t => (
            <TaskRow
              key={t.id}
              task={t}
              progress={taskMap[t.id]}
              onToggle={handleToggle}
              onSaveEvidence={handleSaveEvidence}
            />
          ))}
        </>
      )}

      {applyTasks.length > 0 && (
        <>
          <div className={styles.groupTitle}>3. Apply & Artifact</div>
          {applyTasks.map(t => (
            <TaskRow
              key={t.id}
              task={t}
              progress={taskMap[t.id]}
              onToggle={handleToggle}
              onSaveEvidence={handleSaveEvidence}
            />
          ))}
        </>
      )}

      {reviewTasks.length > 0 && (
        <>
          <div className={styles.groupTitle}>4. Spaced Retrieval</div>
          {reviewTasks.map(t => (
            <TaskRow
              key={t.id}
              task={t}
              progress={taskMap[t.id]}
              onToggle={handleToggle}
              onSaveEvidence={handleSaveEvidence}
            />
          ))}
        </>
      )}

      {validationError && (
        <div className={styles.validationAlert} role="alert">
          <AlertCircle size={16} />
          <span>{validationError}</span>
        </div>
      )}

      {successMessage && (
        <div className={styles.successAlert} role="status">
          <CheckCircle size={16} />
          <span>{successMessage}</span>
        </div>
      )}

      <div className={styles.footerBar}>
        <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
          {isDayCompleted ? 'All mandatory items verified.' : 'Required tasks must be checked to finish.'}
        </span>

        <button
          type="button"
          className="buttonPrimary"
          id="finish-day-button"
          onClick={handleFinishDay}
          disabled={isSubmitting}
        >
          <span>{isDayCompleted ? 'Re-confirm Day Completion' : 'Finish Day & Advance Sequence'}</span>
          <span className="iconCapsule">
            <ArrowRight size={15} />
          </span>
        </button>
      </div>
    </section>
  );
}
