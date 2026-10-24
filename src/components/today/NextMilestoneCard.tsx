'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { PHASES } from '@/lib/db/curriculum-data';
import styles from './NextMilestoneCard.module.scss';

interface NextMilestoneCardProps {
  currentPhaseId?: string;
  isPassed?: boolean;
}

export function NextMilestoneCard({
  currentPhaseId = 'P0',
  isPassed = false
}: NextMilestoneCardProps) {
  const phase = PHASES.find(p => p.id === currentPhaseId) || PHASES[0];

  return (
    <div className={styles.card} aria-labelledby="milestone-heading">
      <div className={styles.eyebrow}>Next Phase Milestone Gate</div>
      <h3 id="milestone-heading" className={styles.gateTitle}>
        {phase.gate_definition.title}
      </h3>
      <p className={styles.criteria}>{phase.gate_definition.pass_criteria}</p>

      <div className={styles.footer}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <ShieldCheck size={14} color={isPassed ? 'var(--accent)' : 'var(--muted)'} />
          <span style={{ color: isPassed ? 'var(--accent)' : 'var(--muted)', fontFamily: 'monospace' }}>
            {isPassed ? 'Gate Verified' : 'Gate Pending'}
          </span>
        </div>

        <Link href={`/app/roadmap/${phase.id}`} className="buttonSecondary" style={{ minHeight: '34px', fontSize: '12px' }}>
          <span>View Gate Rubric</span>
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
