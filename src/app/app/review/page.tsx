'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { HelpCircle, Check, RotateCcw } from 'lucide-react';
import { ProgressRepository } from '@/lib/db/progress-repository';
import { ConceptReview, UserProfile } from '@/lib/db/types';
import styles from './Review.module.scss';
import clsx from 'clsx';

export default function ReviewPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [reviews, setReviews] = useState<ConceptReview[]>([]);
  const [activeTab, setActiveTab] = useState<'ready' | 'later' | 'stable'>('ready');
  const [revealedMap, setRevealedMap] = useState<Record<string, boolean>>({});

  const loadReviews = async () => {
    const prof = await ProgressRepository.getProfile();
    setProfile(prof);

    // Fetch all reviews
    const all = await ProgressRepository.getDueReviews('local_user', 9999);
    setReviews(all);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const currentSeq = profile?.active_day_index ?? 1;

  const readyReviews = reviews.filter(r => r.next_due_day_index <= currentSeq);
  const laterReviews = reviews.filter(r => r.next_due_day_index > currentSeq);
  const stableReviews = reviews.filter(r => r.latest_confidence === 'stable');

  const toggleReveal = (id: string) => {
    setRevealedMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRate = async (id: string, rating: 'needs_work' | 'stable') => {
    await ProgressRepository.recordReviewAttempt('local_user', id, rating);
    setRevealedMap({});
    await loadReviews();
  };

  const displayedList =
    activeTab === 'ready'
      ? readyReviews
      : activeTab === 'later'
      ? laterReviews
      : stableReviews;

  return (
    <AppShell>
      <div className={styles.headerArea}>
        <h1 className={styles.title}>Spaced Repetition Review Queue</h1>
        <p className={styles.subtitle}>
          Review gaps of 1, 3, 7, 21, and 45 learning days, measured from your latest attempt, never calendar dates. Reinforce mental models with active recall before starting new material.
        </p>
      </div>

      <div className={styles.tabsRow}>
        <button
          type="button"
          className={clsx(styles.tabBtn, activeTab === 'ready' && styles.active)}
          onClick={() => setActiveTab('ready')}
        >
          Ready to Review ({readyReviews.length})
        </button>
        <button
          type="button"
          className={clsx(styles.tabBtn, activeTab === 'later' && styles.active)}
          onClick={() => setActiveTab('later')}
        >
          Review Later ({laterReviews.length})
        </button>
        <button
          type="button"
          className={clsx(styles.tabBtn, activeTab === 'stable' && styles.active)}
          onClick={() => setActiveTab('stable')}
        >
          Stable Concepts ({stableReviews.length})
        </button>
      </div>

      {displayedList.length === 0 ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--muted)' }}>
          No concepts in this category. Complete daily learning lessons to populate your spaced recall queue.
        </div>
      ) : (
        <div className={styles.flashcardGrid}>
          {displayedList.map(item => {
            const isRevealed = !!revealedMap[item.id];
            return (
              <div key={item.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.intervalBadge}>Step {item.interval_step}</span>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'monospace' }}>
                    Due Sequence Day {item.next_due_day_index}
                  </span>
                </div>

                <div className={styles.prompt}>{item.concept_prompt}</div>

                {isRevealed ? (
                  <div className={styles.answerBlock}>{item.concept_answer}</div>
                ) : (
                  <button
                    type="button"
                    className="buttonTertiary"
                    onClick={() => toggleReveal(item.id)}
                    style={{ alignSelf: 'flex-start', padding: '6px 0', marginBottom: '16px' }}
                  >
                    <HelpCircle size={14} />
                    <span>Reveal explanation</span>
                  </button>
                )}

                {isRevealed && (
                  <div className={styles.buttonRow}>
                    <button
                      type="button"
                      className="buttonSecondary"
                      onClick={() => handleRate(item.id, 'needs_work')}
                      style={{ flex: 1, minHeight: '36px', fontSize: '12.5px' }}
                    >
                      <span>Needs Work (+1 Day)</span>
                    </button>
                    <button
                      type="button"
                      className="buttonSecondary"
                      onClick={() => handleRate(item.id, 'stable')}
                      style={{
                        flex: 1,
                        minHeight: '36px',
                        fontSize: '12.5px',
                        borderColor: 'var(--accent)',
                        color: 'var(--accent)'
                      }}
                    >
                      <Check size={13} />
                      <span>Stable Concept</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
