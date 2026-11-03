'use client';

import { guidedCourseFor, lessonPosition } from '@/lib/db/guided-courses';
import { LEARNING_DAYS } from '@/lib/db/curriculum-data';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Compass,
  BookOpen,
  Map,
  RotateCcw,
  Briefcase,
  FolderGit2,
  Library,
  BarChart3,
  Settings,
  Moon,
  Sun
} from 'lucide-react';
import { BrandMark } from '@/components/ui/BrandMark';
import { useTheme } from '@/components/context/ThemeContext';
import { CommandPalette } from '@/components/ui/CommandPalette';
import styles from './TopHeader.module.scss';

interface TopHeaderProps {
  currentPhaseCode?: string;
  currentDaySeq?: number;
}

export function TopHeader({
  currentPhaseCode = 'P0',
  currentDaySeq = 1
}: TopHeaderProps) {
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

          {/* Top-Right Capsule with Gradient Logo, Name, and 3-Line Menu */}
          <div className={styles.brandCapsule}>
            <Link href="/app/today" className={styles.capsuleBrand} title="Gradient Home">
              <span className={styles.capsuleLogo} aria-hidden="true">
                <BrandMark />
              </span>
              <span className={styles.capsuleName}>Gradient</span>
            </Link>
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
              <Link href="/app/today" onClick={() => setMenuOpen(false)} role="menuitem">
                <Compass size={15} />
                <span>Today</span>
              </Link>
              <Link href="/app/subjects" onClick={() => setMenuOpen(false)} role="menuitem">
                <BookOpen size={15} />
                <span>Subjects</span>
              </Link>
              <Link href="/app/roadmap" onClick={() => setMenuOpen(false)} role="menuitem">
                <Map size={15} />
                <span>Roadmap</span>
              </Link>
              <Link href="/app/review" onClick={() => setMenuOpen(false)} role="menuitem">
                <RotateCcw size={15} />
                <span>Review</span>
              </Link>
              <Link href="/app/career" onClick={() => setMenuOpen(false)} role="menuitem">
                <Briefcase size={15} />
                <span>Career</span>
              </Link>
              <Link href="/app/projects" onClick={() => setMenuOpen(false)} role="menuitem">
                <FolderGit2 size={15} />
                <span>Projects</span>
              </Link>
              <Link href="/app/resources" onClick={() => setMenuOpen(false)} role="menuitem">
                <Library size={15} />
                <span>Resources</span>
              </Link>
              <Link href="/app/insights" onClick={() => setMenuOpen(false)} role="menuitem">
                <BarChart3 size={15} />
                <span>Insights</span>
              </Link>
              <Link href="/app/settings" onClick={() => setMenuOpen(false)} role="menuitem">
                <Settings size={15} />
                <span>Settings</span>
              </Link>

              <div className={styles.menuDivider} aria-hidden="true" />

              <button
                type="button"
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
