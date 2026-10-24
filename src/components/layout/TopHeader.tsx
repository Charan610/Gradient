'use client';

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

  const dayFormatted = currentDaySeq < 10 ? `0${currentDaySeq}` : `${currentDaySeq}`;

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
            <span>{currentDaySeq > LEARNING_DAYS.length ? 'Lessons complete' : `Day ${dayFormatted}`}</span>
          </div>
        </div>

        <div className={styles.rightArea}>
          <button
            onClick={() => setPaletteOpen(true)}
            className={styles.searchButton}
            aria-label="Search curriculum or execute command"
          >
            <Search size={15} />
            <span>Search your library</span>
            <kbd className={styles.kbdShortcut}>Ctrl / ⌘ K</kbd>
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
