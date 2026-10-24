'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PhaseRail } from '@/components/roadmap/PhaseRail';
import { PHASES } from '@/lib/db/curriculum-data';
import { ProgressRepository } from '@/lib/db/progress-repository';
import { UserProfile } from '@/lib/db/types';
import styles from './Roadmap.module.scss';

export default function RoadmapPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    ProgressRepository.getProfile().then(p => setProfile(p));
  }, []);

  return (
    <AppShell>
      <div className={styles.headerArea}>
        <h1 className={styles.title}>Engineering Curriculum Roadmap</h1>
        <p className={styles.subtitle}>
          A nine-phase study outline from programming foundations to interview preparation. Phase 0 has 30 guided daily lessons; Phases 1–8 currently provide outlines and self-assessment rubrics, not daily lesson plans.
        </p>
      </div>

      <div className={styles.layoutGrid}>
        <section aria-label="Phase sequence rail">
          <PhaseRail
            phases={PHASES}
            activePhaseId="P0"
            passedPhaseIds={[]}
          />
        </section>

        <aside className={styles.sidePanel}>
          <h2 className={styles.panelTitle}>Governing Learning Rules</h2>
          <p className={styles.panelText}>
            <strong>Phase Readiness Gates:</strong> Each phase concludes with an objective, user-executed readiness gate. A phase cannot be marked complete simply because time passed or cards were viewed.
          </p>
          <p className={styles.panelText}>
            <strong>Zero Calendar Guilt:</strong> Breaks, college internal exams, and illness do not create &quot;overdue&quot; debt. You resume at the exact learning day sequence you left.
          </p>
          <p className={styles.panelText}>
            <strong>Prerequisite Protection:</strong> Follow prerequisites before starting advanced topics. The outlines are available to browse; their readiness rubrics are self-assessments, not automated skill verification.
          </p>
        </aside>
      </div>
    </AppShell>
  );
}
