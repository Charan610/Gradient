'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Map, RotateCcw, Briefcase, User } from 'lucide-react';
import styles from './MobileTabBar.module.scss';
import clsx from 'clsx';

export function MobileTabBar() {
  const pathname = usePathname();

  const tabs = [
    { label: 'Today', href: '/app/today', icon: Compass },
    { label: 'Roadmap', href: '/app/roadmap', icon: Map },
    { label: 'Review', href: '/app/review', icon: RotateCcw },
    { label: 'Career', href: '/app/career/applications', icon: Briefcase },
    { label: 'You', href: '/app/settings', icon: User }
  ];

  return (
    <nav className={styles.mobileBar} aria-label="Mobile Bottom Navigation">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive =
          pathname === tab.href ||
          (tab.href !== '/app/today' && pathname.startsWith(tab.href));
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={clsx(styles.tabItem, isActive && styles.active)}
          >
            <Icon className={styles.tabIcon} strokeWidth={1.7} />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
