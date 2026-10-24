'use client';

import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Link as LinkIcon } from 'lucide-react';
import { DayTask, UserTaskProgress } from '@/lib/db/types';
import styles from './TaskRow.module.scss';
import clsx from 'clsx';

interface TaskRowProps {
  task: DayTask;
  progress?: UserTaskProgress;
  onToggle: (taskId: string, completed: boolean) => Promise<void>;
  onSaveEvidence: (taskId: string, evidenceText: string) => Promise<void>;
}

export function TaskRow({
  task,
  progress,
  onToggle,
  onSaveEvidence
}: TaskRowProps) {
  const isCompleted = progress?.status === 'completed';
  const [expanded, setExpanded] = useState(false);
  const [evidence, setEvidence] = useState(progress?.evidence_text || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleCheckboxClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await onToggle(task.id, !isCompleted);
  };

  const handleEvidenceBlur = async () => {
    if (evidence !== progress?.evidence_text) {
      setIsSaving(true);
      await onSaveEvidence(task.id, evidence);
      setIsSaving(false);
    }
  };

  return (
    <div
      className={clsx(styles.taskRow, isCompleted && styles.completed)}
      id={`task-row-${task.id}`}
    >
      <div className={styles.mainContent}>
        <div className={styles.checkboxContainer}>
          <button
            type="button"
            role="checkbox"
            aria-checked={isCompleted}
            aria-label={`Mark task "${task.title}" as ${isCompleted ? 'incomplete' : 'complete'}`}
            className={clsx(styles.checkbox, isCompleted && styles.checked)}
            onClick={handleCheckboxClick}
          >
            {isCompleted && <Check size={13} strokeWidth={2.5} />}
          </button>
        </div>

        <div className={styles.textBlock}>
          <div className={styles.headerRow}>
            <span className={styles.kindBadge}>{task.kind}</span>
            {!task.required && <span className={styles.optionalBadge}>Optional</span>}
            <span className={styles.estimate}>{task.estimate_minutes} min</span>
          </div>

          <h3 className={styles.taskTitle}>{task.title}</h3>
          <p className={styles.instructions}>{task.instructions}</p>

          <button
            type="button"
            className="buttonTertiary"
            onClick={() => setExpanded(!expanded)}
            style={{ padding: '2px 0', fontSize: '12px' }}
          >
            {expanded ? (
              <>
                <span>Hide evidence & criteria</span>
                <ChevronUp size={13} />
              </>
            ) : (
              <>
                <span>Add proof / note / criteria</span>
                <ChevronDown size={13} />
              </>
            )}
          </button>

          {expanded && (
            <div className={styles.evidenceSection}>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                <strong>Validation Criteria:</strong> {task.validation_criteria}
              </div>

              <input
                type="text"
                placeholder="Paste GitHub commit URL or note your proof of work..."
                value={evidence}
                onChange={e => setEvidence(e.target.value)}
                onBlur={handleEvidenceBlur}
                className={styles.evidenceInput}
              />
              {isSaving && <span className={styles.evidenceSaved}>Saving evidence...</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
