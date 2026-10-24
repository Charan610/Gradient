'use client';

import React, { useEffect, useState } from 'react';
import { SidebarNavigation } from './SidebarNavigation';
import { MobileTabBar } from './MobileTabBar';
import { TopHeader } from './TopHeader';
import { ProgressRepository } from '@/lib/db/progress-repository';
import { UserProfile } from '@/lib/db/types';
import styles from './AppShell.module.scss';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    ProgressRepository.getProfile().then(p => setProfile(p));
  }, []);

  return (
    <div className={styles.shellContainer}>
      <SidebarNavigation
        userAlias={profile?.alias}
        semester={profile?.academic_semester}
      />
      <div className={styles.mainWrapper}>
        <TopHeader
          currentPhaseCode="P0"
          currentDaySeq={profile?.active_day_index ?? 1}
        />
        <main className={styles.contentContainer}>{children}</main>
      </div>
      <MobileTabBar />
    </div>
  );
}
