'use client';

import React from 'react';
import styles from './MetricStrip.module.scss';

interface MetricStripProps {
  completedDaysCount: number;
  phaseModulesCount: number;
  totalPhaseModules: number;
  dueReviewsCount: number;
}

export function MetricStrip({
  completedDaysCount,
  phaseModulesCount,
  totalPhaseModules,
  dueReviewsCount
}: MetricStripProps) {
  return (
    <div className={styles.stripGrid} aria-label="Study Progress Indicators">
      <div className={styles.metricCard}>
        <span className={styles.label}>Active Study Days</span>
        <div className={styles.valueRow}>
          <span className={styles.numeral}>{completedDaysCount}</span>
          <span className={styles.subText}>completed in sequence</span>
        </div>
      </div>

      <div className={styles.metricCard}>
        <span className={styles.label}>Foundation Modules Practiced</span>
        <div className={styles.valueRow}>
          <span className={styles.numeral}>
            {phaseModulesCount} / {totalPhaseModules}
          </span>
          <span className={styles.subText}>all assigned days completed</span>
        </div>
      </div>

      <div className={styles.metricCard}>
        <span className={styles.label}>Queued Concept Reviews</span>
        <div className={styles.valueRow}>
          <span className={styles.numeral}>{dueReviewsCount}</span>
          <span className={styles.subText}>spaced recall items</span>
        </div>
      </div>
    </div>
  );
}
