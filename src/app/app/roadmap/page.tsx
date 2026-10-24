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
          The authoritative 9-phase sequence from first principles to top-tier product company software engineering. Advance strictly when readiness gates are proven, not when arbitrary calendar time elapses.
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
            <strong>Prerequisite Protection:</strong> Advanced topics (such as Graphs and Dynamic Programming) unlock only after Tree and Recursion fundamentals are solidly proven.
          </p>
        </aside>
      </div>
    </AppShell>
  );
}
