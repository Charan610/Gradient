'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  Map,
  BookOpen,
  Library,
  RotateCcw,
  Briefcase,
  Terminal,
  BarChart2,
  Settings,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '@/components/context/ThemeContext';
import styles from './SidebarNavigation.module.scss';
import clsx from 'clsx';

interface SidebarNavProps {
  userAlias?: string;
  semester?: string;
}

export function SidebarNavigation({
  userAlias = 'Student Engineer',
  semester = '2-2'
}: SidebarNavProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const primaryNav = [
    { label: 'Today', href: '/app/today', icon: Compass },
    { label: 'Roadmap', href: '/app/roadmap', icon: Map },
    { label: 'Subjects', href: '/app/subjects', icon: BookOpen },
    { label: 'Resources', href: '/app/resources', icon: Library },
    { label: 'Review Queue', href: '/app/review', icon: RotateCcw }
  ];

  const engineeringNav = [
    { label: 'Projects', href: '/app/projects', icon: Terminal },
    { label: 'Internships', href: '/app/career/internships', icon: Briefcase },
    { label: 'Applications', href: '/app/career/applications', icon: Briefcase },
    { label: 'Insights', href: '/app/insights', icon: BarChart2 }
  ];

  return (
    <aside className={styles.sidebar} aria-label="Desktop Navigation">
      <Link href="/app/today" className={styles.brand}>
        <div className={styles.logoGlyph}>FD</div>
        <div className={styles.brandInfo}>
          <span className={styles.brandName}>FOUNDATION</span>
          <span className={styles.brandSub}>Operating System</span>
        </div>
      </Link>

      <div className={styles.navSection}>
        <div className={styles.sectionLabel}>Learning Engine</div>
        <ul className={styles.navList}>
          {primaryNav.map(item => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || (item.href !== '/app/today' && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(styles.navItem, isActive && styles.active)}
                >
                  <Icon className={styles.navIcon} strokeWidth={1.7} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.navSection}>
        <div className={styles.sectionLabel}>Engineering & Career</div>
        <ul className={styles.navList}>
          {engineeringNav.map(item => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(styles.navItem, isActive && styles.active)}
                >
                  <Icon className={styles.navIcon} strokeWidth={1.7} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.sidebarFooter}>
        <div className={styles.userCard}>
          <div>
            <div className={styles.userAlias}>{userAlias}</div>
            <div className={styles.userSemester}>Semester {semester}</div>
          </div>
          <button
            onClick={toggleTheme}
            className="buttonTertiary"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
          </button>
        </div>

        <Link
          href="/app/settings"
          className={clsx(styles.navItem, pathname === '/app/settings' && styles.active)}
        >
          <Settings className={styles.navIcon} strokeWidth={1.7} />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
