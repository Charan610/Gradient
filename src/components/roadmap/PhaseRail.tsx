'use client';

import React from 'react';
import Link from 'next/link';
import { Check, ArrowRight, ShieldCheck, Clock, BookOpen } from 'lucide-react';
import { PhaseItem } from '@/lib/db/types';
import styles from './PhaseRail.module.scss';
import clsx from 'clsx';

interface PhaseRailProps {
  phases: PhaseItem[];
  activePhaseId?: string;
  passedPhaseIds?: string[];
}

export function PhaseRail({
  phases,
  activePhaseId = 'P0',
  passedPhaseIds = []
}: PhaseRailProps) {
  return (
    <div className={styles.railContainer} aria-label="Curriculum Journey Sequence">
      {phases.map(phase => {
        const isPassed = passedPhaseIds.includes(phase.id);
        const isActive = activePhaseId === phase.id;

        return (
          <div
            key={phase.id}
            className={clsx(styles.phaseNode, isActive && styles.active)}
            id={`phase-node-${phase.id}`}
          >
            <div
              className={clsx(
                styles.statusDisc,
                isPassed && styles.passed,
                isActive && !isPassed && styles.inProgress
              )}
            >
              {isPassed && <Check size={12} strokeWidth={2.5} />}
            </div>

            <div className={styles.headerRow}>
              <span className={styles.phaseBadge}>{phase.phase_code}</span>
              {phase.optional_parallel && (
                <span style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'monospace' }}>
                  Parallel Elective
                </span>
              )}
            </div>

            <h3 className={styles.title}>{phase.title}</h3>
            <p className={styles.description}>{phase.description}</p>

            <div className={styles.footerRow}>
              <div className={styles.metaTags}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} />
                  <span>{phase.estimated_hours}</span>
                </span>
                <span>·</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <BookOpen size={12} />
                  <span>{phase.approx_study_days}</span>
                </span>
              </div>

              <Link
                href={`/app/roadmap/${phase.id}`}
                className="buttonSecondary"
                style={{ minHeight: '34px', fontSize: '12.5px', padding: '4px 12px' }}
              >
                <span>Modules & Gate</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
