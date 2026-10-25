'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Clock, Target, CheckCircle2 } from 'lucide-react';
import { LearningDay } from '@/lib/db/types';
import styles from './DayHero.module.scss';

interface DayHeroProps {
  day: LearningDay;
  isCompleted?: boolean;
}

export function DayHero({ day, isCompleted = false }: DayHeroProps) {
  const dayStr = day.sequence_index < 10 ? `0${day.sequence_index}` : `${day.sequence_index}`;

  return (
    <section className={styles.heroCard} aria-labelledby="today-hero-heading">
      <div className={styles.heroArt} aria-hidden="true"><span>DAY</span><strong>{dayStr}</strong><span>LEARN / BUILD / REPEAT</span></div>
      <div className={styles.eyebrowRow}>
        <span className={styles.eyebrow}>
          C++ FOUNDATIONS · CONTINUE LEARNING
        </span>
        <span className={styles.modeBadge}>
          <Clock size={12} />
          <span>{day.estimated_minutes} min estimated</span>
        </span>
      </div>

      <h2 id="today-hero-heading" className={styles.title}>
        Day {dayStr}: {day.title}
      </h2>

      <p className={styles.goal}>
        <strong>Objective:</strong> {day.goal}
      </p>

      <div className={styles.actionRow}>
        <Link
          href={`/app/learn/${day.phase_id}/${day.id}`}
          className="buttonPrimary"
          id="continue-learning-action"
        >
          <span>{isCompleted ? `Review Day ${dayStr}` : `Open Day ${dayStr}`}</span>
          <span className="iconCapsule">
            <ArrowUpRight size={15} />
          </span>
        </Link>

        <div className={styles.metaInfo}>
          <span className={styles.metaItem}>
            <Target size={14} />
            <span>{day.tasks.filter(t => t.required).length} Required Tasks</span>
          </span>
          {isCompleted && (
            <span className={styles.metaItem} style={{ color: 'var(--accent)' }}>
              <CheckCircle2 size={14} />
              <span>Day Completed</span>
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
