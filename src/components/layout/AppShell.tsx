'use client';

import Link from 'next/link';
import {useAccount} from '@/components/account/AccountProvider';
import { HardDrive, ArrowUpRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { SidebarNavigation } from './SidebarNavigation';
import { MobileTabBar } from './MobileTabBar';
import { WorkspaceLinks } from './WorkspaceLinks';
import { TopHeader } from './TopHeader';
import { ProgressRepository } from '@/lib/db/progress-repository';
import { LEARNING_DAYS } from '@/lib/db/curriculum-data';
import { UserProfile } from '@/lib/db/types';
import styles from './AppShell.module.scss';

export function AppShell({ children }: { children: React.ReactNode }) {
  const {account}=useAccount();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const refresh = () => { ProgressRepository.getProfile().then(p => setProfile(p)).catch(() => setProfile(null)); };
    refresh();
    window.addEventListener('foundation-progress', refresh);
    return () => window.removeEventListener('foundation-progress', refresh);
  }, []);

  const activeDay = LEARNING_DAYS.find(day => day.sequence_index === profile?.active_day_index);
  const lastDay = LEARNING_DAYS[LEARNING_DAYS.length - 1];
  const phaseCode = activeDay?.phase_id ?? (profile && lastDay && profile.active_day_index > lastDay.sequence_index ? lastDay.phase_id : '—');

  return (
    <div className={styles.shellContainer}>
      <a href="#workspace-content" className={styles.skipLink}>Skip to content</a>
      <SidebarNavigation
        userAlias={profile?.alias}
        semester={profile?.academic_semester}
      />
      <div className={styles.mainWrapper}>
        <TopHeader
          currentPhaseCode={phaseCode}
          currentDaySeq={profile?.active_day_index ?? 1}
        />
        <main tabIndex={-1} id="workspace-content" className={styles.contentContainer}>
          <div className={styles.workspaceStatus}>
            <span><HardDrive size={13} aria-hidden="true" /> {account?`Signed in as ${account.username}`:'Personal workspace'} <span className={styles.statusDot} aria-hidden="true" /> Saved on this device</span>
            <Link href="/app/settings">Manage backups <ArrowUpRight size={13} aria-hidden="true" /></Link>
          </div>
          <WorkspaceLinks />
          {children}
        </main>
      </div>
      <MobileTabBar />
    </div>
  );
}
