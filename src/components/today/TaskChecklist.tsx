'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { LearningDay, UserTaskProgress } from '@/lib/db/types';
import { ProgressRepository } from '@/lib/db/progress-repository';
import { UndoToast } from '@/components/ui/UndoToast';
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
  const locks = useRef(new Set<string>());
  const [pending, setPending] = useState<string[]>([]);
  const [undo, setUndo] = useState<{taskId:string; status:UserTaskProgress['status']; expected:UserTaskProgress['status']; message:string} | null>(null);
  const finishing = useRef(false);
  const markPending = (taskId:string, value:boolean) => {
    if (value) locks.current.add(taskId); else locks.current.delete(taskId);
    setPending([...locks.current]);
  };
  const [taskMap, setTaskMap] = useState<Record<string, UserTaskProgress>>(initialTaskMap);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setTaskMap(initialTaskMap);
    setUndo(null);
    setValidationError(null);
    setSuccessMessage(null);
  }, [day.id, initialTaskMap]);

  const updateStatus = async (taskId: string, status: UserTaskProgress['status'], offerUndo = true) => {
    if (locks.current.has(taskId) || finishing.current) return;
    const previous = taskMap[taskId];
    markPending(taskId, true);
    if (offerUndo) setUndo(null);
    setTaskMap(prev => ({ ...prev, [taskId]: { ...previous, user_id:'local_user', day_task_id:taskId, status } }));
    try {
      const updated = await ProgressRepository.updateTaskProgress('local_user', day.id, taskId, status);
      setTaskMap(prev => ({ ...prev, [taskId]: updated }));
      setValidationError(null);
      if (offerUndo) setUndo({ taskId, status:previous?.status || 'not_started', expected:status, message:status === 'completed' ? 'Task completed.' : 'Task reopened.' });
    } catch (error) {
      setTaskMap(prev => { const next = { ...prev }; if (previous) next[taskId] = previous; else delete next[taskId]; return next; });
      throw error;
    } finally { markPending(taskId, false); }
  };
  const handleToggle = (taskId: string, completed: boolean) => updateStatus(taskId, completed ? 'completed' : 'not_started');

  const handleSaveEvidence = async (taskId: string, evidenceText: string) => {
    if (locks.current.has(taskId) || finishing.current) return;
    markPending(taskId, true);
    try {
    const currentStatus = taskMap[taskId]?.status || 'not_started';
    const updated = await ProgressRepository.updateTaskProgress(
      'local_user',
      day.id,
      taskId,
      currentStatus,
      evidenceText
    );
    setTaskMap(prev => ({ ...prev, [taskId]: updated }));
    } finally { markPending(taskId, false); }
  };

  const handleFinishDay = async () => {
    if (finishing.current || locks.current.size) return;
    finishing.current = true;
    setUndo(null);
    setIsSubmitting(true);
    setValidationError(null);
    setSuccessMessage(null);

    let result;
    try {
      result = await ProgressRepository.finishLearningDay('local_user', day.id);
    } catch {
      setValidationError('Could not save progress. Check browser storage and try again.');
      setIsSubmitting(false);
      finishing.current = false;
      return;
    }
    setIsSubmitting(false);
    finishing.current = false;

    if (!result.success) {
      if (result.error === 'incomplete_required_tasks') {
        setValidationError(
          `Cannot finish day: ${result.remaining_count} required task(s) remain incomplete. Complete all mandatory items before advancing.`
        );
      } else if (result.error === 'out_of_sequence') {
        setValidationError('This is a preview. Finish your current learning day before advancing this one.');
      } else if (result.error === 'maintenance_mode') {
        setValidationError('New lessons are paused in maintenance mode. Resume normal mode in Settings when ready.');
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

  const completedCount = day.tasks.filter(t => taskMap[t.id]?.status === 'completed').length;
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
              disabled={pending.includes(t.id) || isSubmitting}
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
              disabled={pending.includes(t.id) || isSubmitting}
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
              disabled={pending.includes(t.id) || isSubmitting}
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
              disabled={pending.includes(t.id) || isSubmitting}
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
          {isDayCompleted ? 'Required tasks marked complete.' : 'Required tasks must be checked to finish.'}
        </span>

        <button
          type="button"
          className="buttonPrimary"
          id="finish-day-button"
          onClick={handleFinishDay}
          disabled={isSubmitting || isDayCompleted || pending.length > 0}
        >
          <span>{isDayCompleted ? 'Day Completed' : 'Finish Day & Advance Sequence'}</span>
          <span className="iconCapsule">
            <ArrowRight size={15} />
          </span>
        </button>
      </div>
      {undo && <UndoToast key={`${undo.taskId}-${undo.status}`} message={undo.message} onClose={() => setUndo(null)} onUndo={async () => {
        const record = await ProgressRepository.getDayProgress('local_user', day.id);
        if (record?.state === 'completed') { setUndo(null); return; }
        const latest = await ProgressRepository.getDayTaskProgresses('local_user', day.id);
        if ((latest[undo.taskId]?.status || 'not_started') !== undo.expected) { setValidationError('This task changed in another window. Reload to see the latest progress.'); return; }
        await updateStatus(undo.taskId, undo.status, false);
      }} />}
    </section>
  );
}
