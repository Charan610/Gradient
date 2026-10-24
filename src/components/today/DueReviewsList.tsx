'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { RotateCcw, Check, HelpCircle } from 'lucide-react';
import { ConceptReview } from '@/lib/db/types';
import { ProgressRepository } from '@/lib/db/progress-repository';
import styles from './DueReviewsList.module.scss';

interface DueReviewsListProps {
  reviews: ConceptReview[];
  onReviewCompleted?: () => void;
}

export function DueReviewsList({ reviews, onReviewCompleted }: DueReviewsListProps) {
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [items, setItems] = useState<ConceptReview[]>(reviews);

  const toggleReveal = (id: string) => {
    setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRate = async (id: string, rating: 'needs_work' | 'stable') => {
    await ProgressRepository.recordReviewAttempt('local_user', id, rating);
    setItems(prev => prev.filter(r => r.id !== id));
    if (onReviewCompleted) onReviewCompleted();
  };

  if (items.length === 0) {
    return (
      <div className={styles.reviewCard}>
        <div className={styles.header}>
          <h2 className={styles.title}>Spaced Review Queue</h2>
          <span style={{ fontSize: '12px', color: 'var(--accent)', fontFamily: 'monospace' }}>
            ✓ All clear
          </span>
        </div>
        <p style={{ fontSize: '13.5px', color: 'var(--muted)' }}>
          No reviews due for your current active study sequence. New reviews will be scheduled automatically when you finish daily modules.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.reviewCard} aria-labelledby="due-reviews-heading">
      <div className={styles.header}>
        <h2 id="due-reviews-heading" className={styles.title}>
          Due Spaced Reviews ({items.length})
        </h2>
        <Link href="/app/review" className="buttonTertiary">
          <RotateCcw size={13} />
          <span>Full Queue</span>
        </Link>
      </div>

      {items.map(item => {
        const isRevealed = !!revealedIds[item.id];
        return (
          <div key={item.id} className={styles.reviewItem}>
            <div className={styles.promptText}>{item.concept_prompt}</div>

            {isRevealed ? (
              <div className={styles.answerBlock}>{item.concept_answer}</div>
            ) : (
              <button
                type="button"
                className="buttonTertiary"
                onClick={() => toggleReveal(item.id)}
                style={{ alignSelf: 'flex-start', padding: '4px 0' }}
              >
                <HelpCircle size={13} />
                <span>Show answer & reasoning</span>
              </button>
            )}

            {isRevealed && (
              <div className={styles.actionButtons}>
                <button
                  type="button"
                  className="buttonSecondary"
                  onClick={() => handleRate(item.id, 'needs_work')}
                  style={{ minHeight: '34px', fontSize: '12px', padding: '4px 10px' }}
                >
                  Needs Work (Revisit Day + 1)
                </button>
                <button
                  type="button"
                  className="buttonSecondary"
                  onClick={() => handleRate(item.id, 'stable')}
                  style={{
                    minHeight: '34px',
                    fontSize: '12px',
                    padding: '4px 10px',
                    borderColor: 'var(--accent)',
                    color: 'var(--accent)'
                  }}
                >
                  <Check size={12} />
                  <span>Stable Concept</span>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
