'use client';

import React from 'react';
import { CalendarCheck, Layers, RotateCcw } from 'lucide-react';
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
        <span className={styles.label}><CalendarCheck size={16} />Study days completed</span>
        <div className={styles.valueRow}>
          <span className={styles.numeral}>{completedDaysCount}</span>
          <span className={styles.subText}>completed in sequence</span>
        </div>
      </div>

      <div className={styles.metricCard}>
        <span className={styles.label}><Layers size={16} />Modules practiced</span>
        <div className={styles.valueRow}>
          <span className={styles.numeral}>
            {phaseModulesCount} / {totalPhaseModules}
          </span>
          <span className={styles.subText}>all assigned days completed</span>
        </div>
      </div>

      <div className={styles.metricCard}>
        <span className={styles.label}><RotateCcw size={16} />Reviews ready</span>
        <div className={styles.valueRow}>
          <span className={styles.numeral}>{dueReviewsCount}</span>
          <span className={styles.subText}>spaced recall items</span>
        </div>
      </div>
    </div>
  );
}
