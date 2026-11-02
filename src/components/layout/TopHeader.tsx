'use client';

import {guidedCourseFor,lessonPosition} from '@/lib/db/guided-courses';
import { LEARNING_DAYS } from '@/lib/db/curriculum-data';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
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

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); setPaletteOpen(open => !open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const activeDay=LEARNING_DAYS.find(day=>day.sequence_index===currentDaySeq);
  const lessonLabel=activeDay?`${guidedCourseFor(activeDay).id} · Lesson ${String(lessonPosition(activeDay)).padStart(2,'0')}`:'Find your lesson';

  return (
    <>
      <header className={styles.header}>
        <div className={styles.leftArea}>
          <Link href="/app/today" className={styles.mobileBrand}>
            GRADIENT
          </Link>
          <div className={styles.phaseBadge} title="Active Learning Progression Sequence">
            <span>Phase {currentPhaseCode.replace('P', '')}</span>
            <span>·</span>
            <span>{currentDaySeq > LEARNING_DAYS.length ? 'Lessons complete' : lessonLabel}</span>
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
        </div>
      </header>

      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
    </>
  );
}
