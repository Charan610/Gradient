'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PhaseRail } from '@/components/roadmap/PhaseRail';
import { LEARNING_DAYS, PHASES } from '@/lib/db/curriculum-data';
import { ProgressRepository } from '@/lib/db/progress-repository';
import { UserProfile } from '@/lib/db/types';
import styles from './Roadmap.module.scss';

export default function RoadmapPage() {
  const [passed,setPassed]=useState<string[]>([]);
  const [error,setError]=useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    Promise.all([ProgressRepository.getProfile(),Promise.all(PHASES.map(p=>ProgressRepository.getGateAttempt('local_user',p.id)))]).then(([p,gates])=>{setProfile(p);setPassed(PHASES.filter((_,i)=>gates[i]?.passed).map(p=>p.id));}).catch(()=>setError(true));
  }, []);

  const activeDay = LEARNING_DAYS.find(day => day.sequence_index === profile?.active_day_index);

  return (
    <AppShell>
      <div className={styles.headerArea}>
        <h1 className={styles.title}>A path with room to grow.</h1>
        <p className={styles.subtitle}>
          A nine-phase path from programming foundations to interview preparation. Phase 0 has 30 guided C++ lessons; Phase 2 includes 20 introductory guided DSA lessons. The rest of Phase 2, including SQL and Python, and all other phases remain study outlines with self-assessment rubrics.
        </p>
      </div>

      {error&&<p role="alert">Saved readiness checks could not be loaded. Reload to try again.</p>}
      <div className={styles.layoutGrid}>
        <section aria-label="Phase sequence rail">
          <PhaseRail
            phases={PHASES}
            activePhaseId={activeDay?.phase_id}
            passedPhaseIds={passed}
          />
        </section>

        <aside className={styles.sidePanel}>
          <h2 className={styles.panelTitle}>Make the path your own</h2>
          <p className={styles.panelText}>
            <strong>Check your understanding:</strong> Each phase concludes with an objective, user-executed readiness gate. A phase cannot be marked complete simply because time passed or cards were viewed.
          </p>
          <p className={styles.panelText}>
            <strong>Take the time you need:</strong> Breaks, college internal exams, and illness do not create &quot;overdue&quot; debt. You resume at the exact learning day sequence you left.
          </p>
          <p className={styles.panelText}>
            <strong>Build on what you know:</strong> Follow prerequisites before starting advanced topics. The outlines are available to browse; their readiness rubrics are self-assessments, not automated skill verification.
          </p>
        </aside>
      </div>
    </AppShell>
  );
}
