'use client';

import Link from 'next/link';
import { HardDrive, ArrowUpRight } from 'lucide-react';
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
    const refresh = () => { ProgressRepository.getProfile().then(p => setProfile(p)); };
    refresh();
    window.addEventListener('foundation-progress', refresh);
    return () => window.removeEventListener('foundation-progress', refresh);
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
        <main className={styles.contentContainer}>
          <div className={styles.workspaceStatus}>
            <span><HardDrive size={13} aria-hidden="true" /> Personal workspace <span className={styles.statusDot} aria-hidden="true" /> Saved on this device</span>
            <Link href="/app/settings">Manage backups <ArrowUpRight size={13} aria-hidden="true" /></Link>
          </div>
          {children}
        </main>
      </div>
      <MobileTabBar />
    </div>
  );
}
