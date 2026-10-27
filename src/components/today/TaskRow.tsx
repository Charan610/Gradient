'use client';

import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Link as LinkIcon } from 'lucide-react';
import { DayTask, UserTaskProgress } from '@/lib/db/types';
import styles from './TaskRow.module.scss';
import clsx from 'clsx';

interface TaskRowProps {
  task: DayTask;
  disabled?: boolean;
  progress?: UserTaskProgress;
  onToggle: (taskId: string, completed: boolean) => Promise<void>;
  onSaveEvidence: (taskId: string, evidenceText: string) => Promise<void>;
}

export function TaskRow({
  task,
  disabled = false,
  progress,
  onToggle,
  onSaveEvidence
}: TaskRowProps) {
  const isCompleted = progress?.status === 'completed';
  const [expanded, setExpanded] = useState(false);
  const [evidence, setEvidence] = useState(progress?.evidence_text || '');
  const [isSaving, setIsSaving] = useState(false);

  const [saveError, setSaveError] = useState('');

  const handleCheckboxClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try { await onToggle(task.id, !isCompleted); setSaveError(''); }
    catch { setSaveError('Could not save. Please try again.'); }
  };

  const handleEvidenceBlur = async () => {
    if (evidence !== progress?.evidence_text) {
      setIsSaving(true);
      try { await onSaveEvidence(task.id, evidence); setSaveError(''); }
      catch { setSaveError('Evidence could not be saved. Keep a copy and retry.'); }
      finally { setIsSaving(false); }
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
            disabled={disabled || isSaving}
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
                disabled={disabled}
                type="text"
                aria-label={`Evidence for ${task.title}`}
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
      {saveError && <p role="alert" style={{ color: 'var(--danger)', fontSize: 12, marginTop: 8 }}>{saveError}</p>}
    </div>
  );
}
