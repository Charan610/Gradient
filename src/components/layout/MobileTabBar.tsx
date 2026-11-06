'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, BookOpen, RotateCcw, FolderGit2, User } from 'lucide-react';
import styles from './MobileTabBar.module.scss';
import clsx from 'clsx';
import { WORKSPACE_NAV, workspaceGroup } from './workspace-navigation';

const ICONS = { home: Compass, learn: BookOpen, practice: RotateCcw, build: FolderGit2 };

export function MobileTabBar() {
  const pathname = usePathname();

  const tabs = [
    ...WORKSPACE_NAV.flatMap(item => item.group === 'career' ? [] : [{ ...item, icon: ICONS[item.group] }]),
    { label: 'You', href: '/app/settings', group: 'profile', icon: User }
  ];

  return (
    <nav className={styles.mobileBar} aria-label="Mobile Bottom Navigation">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive =
          workspaceGroup(pathname) === tab.group;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? 'page' : undefined}
            className={clsx(styles.tabItem, isActive && styles.active)}
          >
            <Icon className={styles.tabIcon} aria-hidden="true" strokeWidth={1.7} />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
