'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  BookOpen,
  Briefcase,
  RotateCcw, FolderGit2,
  Settings,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '@/components/context/ThemeContext';
import styles from './SidebarNavigation.module.scss';
import clsx from 'clsx';
import {BrandMark} from '@/components/ui/BrandMark';
import { WORKSPACE_NAV, workspaceGroup } from './workspace-navigation';

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

  const primaryNav = WORKSPACE_NAV.map((item, index) => ({ ...item, icon: [Compass, BookOpen, RotateCcw, FolderGit2, Briefcase][index] }));

  return (
    <aside className={styles.sidebar} aria-label="Desktop Navigation">
      <Link href="/app/today" className={styles.brand}>
        <span style={{color:"var(--accent)"}}><BrandMark/></span>
        <div className={styles.brandInfo}>
          <span className={styles.brandName}>Gradient</span>
          <span className={styles.brandSub}>Learning workspace</span>
        </div>
      </Link>

      <nav className={styles.navSection} aria-label="Your workspace">
        <div className={styles.sectionLabel}>Your workspace</div>
        <ul className={styles.navList}>
          {primaryNav.map(item => {
            const Icon = item.icon;
            const isActive =
              workspaceGroup(pathname) === item.group;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={clsx(styles.navItem, isActive && styles.active)}
                >
                  <Icon className={styles.navIcon} aria-hidden="true" strokeWidth={1.7} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={styles.sidebarFooter}>
        <div className={styles.userCard}>
          <div>
            <Link href="/app/settings" className={styles.userAlias}>{userAlias}</Link>
            <div className={styles.userSemester}>Semester {semester}</div>
          </div>
          <button
            onClick={toggleTheme}
            type="button"
            className={`buttonTertiary ${styles.themeToggle}`}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={15} aria-hidden="true" /> : <Sun size={15} aria-hidden="true" />}
          </button>
        </div>

        <Link
          href="/app/settings"
          aria-current={workspaceGroup(pathname) === 'profile' ? 'page' : undefined}
          className={clsx(styles.navItem, pathname === '/app/settings' && styles.active)}
        >
          <Settings className={styles.navIcon} aria-hidden="true" strokeWidth={1.7} />
          <span>Profile & settings</span>
        </Link>
      </div>
    </aside>
  );
}
