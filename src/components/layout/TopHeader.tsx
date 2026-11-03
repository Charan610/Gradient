'use client';

import { guidedCourseFor, lessonPosition } from '@/lib/db/guided-courses';
import { LEARNING_DAYS } from '@/lib/db/curriculum-data';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  Search,
  Compass,
  BookOpen,
  BarChart2,
  Briefcase,
  Map,
  RotateCcw,
  FolderGit2,
  Library,
  Settings,
  Moon,
  Sun
} from 'lucide-react';
import { BrandMark } from '@/components/ui/BrandMark';
import { useTheme } from '@/components/context/ThemeContext';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { workspaceGroup } from './workspace-navigation';
import styles from './TopHeader.module.scss';

interface TopHeaderProps {
  currentPhaseCode?: string;
  currentDaySeq?: number;
  userAlias?: string;
  semester?: string;
}

const PRIMARY_TABS = [
  { label: 'Home', href: '/app/today', group: 'home', icon: Compass },
  { label: 'Learn', href: '/app/subjects', group: 'learn', icon: BookOpen },
  { label: 'Progress', href: '/app/insights', group: 'progress', icon: BarChart2 },
  { label: 'Career', href: '/app/career', group: 'career', icon: Briefcase },
] as const;

export function TopHeader({
  currentPhaseCode = 'P0',
  currentDaySeq = 1,
  userAlias = 'Student Engineer',
  semester = '2-2'
}: TopHeaderProps) {
  const pathname = usePathname();
  const [isPaletteOpen, setPaletteOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen(open => !open);
      }
      if (event.key === 'Escape' && isMenuOpen) {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMenuOpen]);

  // Click outside to close dropdown menu
  useEffect(() => {
    if (!isMenuOpen) return;
    const onClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !menuButtonRef.current?.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [isMenuOpen]);

  const activeDay = LEARNING_DAYS.find(day => day.sequence_index === currentDaySeq);
  const lessonLabel = activeDay
    ? `${guidedCourseFor(activeDay).id} · Lesson ${String(lessonPosition(activeDay)).padStart(2, '0')}`
    : 'Find your lesson';

  const currentGroup = workspaceGroup(pathname);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.leftArea}>
          <Link href="/app/today" className={styles.mobileBrand}>
            GRADIENT
          </Link>
          <div className={styles.phaseBadge} title="Active Learning Progression Sequence">
            <span>Phase {currentPhaseCode.replace('P', '')}</span>
            <span className={styles.phaseDot}>·</span>
            <span className={styles.phaseLesson}>{currentDaySeq > LEARNING_DAYS.length ? 'Lessons complete' : lessonLabel}</span>
          </div>
        </div>

        <div className={styles.rightArea}>
          <button
            onClick={() => setPaletteOpen(true)}
            className={styles.searchButton}
            title="Search your library"
            aria-keyshortcuts="Control+K Meta+K"
          >
            <Search size={15} />
            <span>Search your library</span>
            <kbd aria-hidden="true" className={styles.kbdShortcut}>Ctrl / ⌘ K</kbd>
          </button>

          {/* Top-Right Unified Capsule with Brand, Tabs (Home, Learn, Progress, Career) and 3-Line Menu */}
          <div className={styles.brandCapsule}>
            <Link href="/app/today" className={styles.capsuleBrand} title="Gradient Home">
              <span className={styles.capsuleLogo} aria-hidden="true">
                <BrandMark />
              </span>
              <span className={styles.capsuleName}>Gradient</span>
            </Link>

            <span className={clsx(styles.capsuleDivider, styles.tabsDivider)} aria-hidden="true" />

            {/* Desktop Tabs inside Capsule: Home, Learn, Progress, Career */}
            <nav className={styles.capsuleTabs} aria-label="Main navigation">
              {PRIMARY_TABS.map(tab => {
                const Icon = tab.icon;
                const isActive = currentGroup === tab.group;
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={clsx(styles.capsuleTab, isActive && styles.activeTab)}
                  >
                    <Icon size={14} className={styles.tabIcon} aria-hidden="true" strokeWidth={1.8} />
                    <span>{tab.label}</span>
                  </Link>
                );
              })}
            </nav>

            <span className={styles.capsuleDivider} aria-hidden="true" />

            <button
              ref={menuButtonRef}
              className={styles.capsuleMenuBtn}
              onClick={() => setMenuOpen(open => !open)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              data-open={isMenuOpen}
            >
              <span className={styles.menuLine} />
              <span className={styles.menuLine} />
              <span className={styles.menuLine} />
            </button>
          </div>

          {/* Sleek Dropdown Navigation Menu */}
          {isMenuOpen && (
            <div ref={dropdownRef} className={styles.dropdownMenu} role="menu" aria-label="Quick navigation">
              {/* User Identity Header */}
              <div className={styles.dropdownUserCard}>
                <div className={styles.dropdownUserAlias}>{userAlias}</div>
                <div className={styles.dropdownUserSemester}>Semester {semester}</div>
              </div>

              <div className={styles.menuDivider} aria-hidden="true" />

              {/* Core Tabs: Home, Learn, Progress, Career */}
              <div className={styles.dropdownSectionLabel}>Workspace</div>
              {PRIMARY_TABS.map(tab => {
                const Icon = tab.icon;
                const isActive = currentGroup === tab.group;
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    onClick={() => setMenuOpen(false)}
                    role="menuitem"
                    className={clsx(styles.dropdownItem, isActive && styles.activeDropdownItem)}
                  >
                    <Icon size={15} />
                    <span>{tab.label}</span>
                  </Link>
                );
              })}

              <div className={styles.menuDivider} aria-hidden="true" />

              <div className={styles.dropdownSectionLabel}>Curriculum & Projects</div>
              <Link href="/app/roadmap" onClick={() => setMenuOpen(false)} role="menuitem" className={styles.dropdownItem}>
                <Map size={15} />
                <span>Roadmap</span>
              </Link>
              <Link href="/app/review" onClick={() => setMenuOpen(false)} role="menuitem" className={styles.dropdownItem}>
                <RotateCcw size={15} />
                <span>Practice Recall</span>
              </Link>
              <Link href="/app/projects" onClick={() => setMenuOpen(false)} role="menuitem" className={styles.dropdownItem}>
                <FolderGit2 size={15} />
                <span>Projects</span>
              </Link>
              <Link href="/app/resources" onClick={() => setMenuOpen(false)} role="menuitem" className={styles.dropdownItem}>
                <Library size={15} />
                <span>Resources</span>
              </Link>

              <div className={styles.menuDivider} aria-hidden="true" />

              <Link href="/app/settings" onClick={() => setMenuOpen(false)} role="menuitem" className={styles.dropdownItem}>
                <Settings size={15} />
                <span>Profile & settings</span>
              </Link>

              <button
                type="button"
                className={styles.dropdownItem}
                onClick={() => {
                  toggleTheme();
                  setMenuOpen(false);
                }}
                role="menuitem"
              >
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
              </button>

              <button
                type="button"
                className={styles.dropdownItem}
                onClick={() => {
                  setPaletteOpen(true);
                  setMenuOpen(false);
                }}
                role="menuitem"
              >
                <Search size={15} />
                <span>Quick search (⌘K)</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
    </>
  );
}
