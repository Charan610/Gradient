'use client';

import React, { useState } from 'react';
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

  const dayFormatted = currentDaySeq < 10 ? `0${currentDaySeq}` : `${currentDaySeq}`;

  return (
    <>
      <header className={styles.header}>
        <div className={styles.leftArea}>
          <Link href="/app/today" className={styles.mobileBrand}>
            FOUNDATION
          </Link>
          <div className={styles.phaseBadge} title="Active Learning Progression Sequence">
            <span>Phase {currentPhaseCode.replace('P', '')}</span>
            <span>·</span>
            <span>Day {dayFormatted}</span>
          </div>
        </div>

        <div className={styles.rightArea}>
          <button
            onClick={() => setPaletteOpen(true)}
            className={styles.searchButton}
            aria-label="Search curriculum or execute command"
          >
            <Search size={15} />
            <span>Search or command...</span>
            <kbd className={styles.kbdShortcut}>⌘K</kbd>
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
