'use client';

import React, { useEffect, useState, useRef } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { HelpCircle, Check, RotateCcw } from 'lucide-react';
import { ProgressRepository } from '@/lib/db/progress-repository';
import { ConceptReview, UserProfile } from '@/lib/db/types';
import styles from './Review.module.scss';
import clsx from 'clsx';
import Link from 'next/link';
import {recallStep} from '@/lib/db/review-schedule';

export default function ReviewPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [reviews, setReviews] = useState<ConceptReview[]>([]);
  const [activeTab, setActiveTab] = useState<'ready' | 'later' | 'stable'>('ready');
  const [revealedMap, setRevealedMap] = useState<Record<string, boolean>>({});

  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [saveError,setSaveError]=useState('');
  const [saving,setSaving]=useState(false);
  const savingRef=useRef(false);
  const loadReviews = async () => {
    setError('');
    try {
    const prof = await ProgressRepository.getProfile();
    setProfile(prof);

    // Fetch all reviews
    const all = await ProgressRepository.getDueReviews('local_user', 9999);
    setReviews(all);
    } catch { setError("Your recall queue could not be loaded. Please try again."); } finally { setLoading(false); }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const currentSeq = profile?recallStep(profile):1;

  const readyReviews = reviews.filter(r => r.next_due_day_index <= currentSeq);
  const laterReviews = reviews.filter(r => r.next_due_day_index > currentSeq);
  const stableReviews = reviews.filter(r => r.latest_confidence === 'stable');

  const toggleReveal = (id: string) => {
    setRevealedMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRate = async (id: string, rating: 'needs_work' | 'stable') => {
    if(savingRef.current)return;
    savingRef.current=true;setSaving(true);setSaveError('');
    try {
      await ProgressRepository.recordReviewAttempt('local_user', id, rating);
      setRevealedMap({});
      await loadReviews();
    } catch { setSaveError('Your review could not be saved. Select your rating again to retry.'); }
    finally { savingRef.current=false;setSaving(false); }
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
        <h1 className={styles.title}>A little recall goes a long way.</h1>
        <p className={styles.subtitle}>
          Try answering from memory, then reveal the explanation. Spacing follows learning steps, never calendar deadlines. A lesson moves one step; you can bring the next set forward whenever you want.
        </p>
      </div>

      {saveError&&<p role="alert" className={styles.answerBlock}>{saveError}</p>}
      {error&&<div role="alert" className={styles.answerBlock}>{error} <button className="buttonSecondary" onClick={loadReviews}>Try again</button></div>}
      <div className={styles.tabsRow}>
        <button
          type="button"
          className={clsx(styles.tabBtn, activeTab === 'ready' && styles.active)}
          aria-pressed={activeTab==='ready'} onClick={() => setActiveTab('ready')}
        >
          Ready now ({readyReviews.length})
        </button>
        <button
          type="button"
          className={clsx(styles.tabBtn, activeTab === 'later' && styles.active)}
          aria-pressed={activeTab==='later'} onClick={() => setActiveTab('later')}
        >
          For later ({laterReviews.length})
        </button>
        <button
          type="button"
          className={clsx(styles.tabBtn, activeTab === 'stable' && styles.active)}
          aria-pressed={activeTab==='stable'} onClick={() => setActiveTab('stable')}
        >
          Feeling confident ({stableReviews.length})
        </button>
      </div>

      {loading ? <p role="status">Opening your recall queue…</p> : error ? null : displayedList.length === 0 ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--muted)' }}>
          <h2>{reviews.length?'A good place to pause.':'Room for your next idea.'}</h2><p>{reviews.length?'No concepts are ready at this step. You can bring the next scheduled set forward without changing your current lesson.':'Finish a guided lesson to add its concepts here. Nothing is overdue.'}</p>{laterReviews.length>0?<button className="buttonPrimary" disabled={saving} onClick={async()=>{if(savingRef.current)return;savingRef.current=true;setSaving(true);setSaveError('');try{await ProgressRepository.startNextRecallSession();setActiveTab('ready');setRevealedMap({});await loadReviews();}catch{setSaveError('The next set could not be opened. Your ratings are saved; try again.')}finally{savingRef.current=false;setSaving(false)}}}>Practice next set</button>:null}<Link href="/app/today" className="buttonTertiary">Back to your next lesson</Link>
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
                    {item.next_due_day_index<=currentSeq?'Ready in this set':`Learning step ${item.next_due_day_index}`}
                  </span>
                </div>

                <div className={styles.prompt}>{item.concept_prompt}</div>

                {item.next_due_day_index>currentSeq&&<p className={styles.previewNote}>A preview for another visit. Ratings open when this concept joins your current set.</p>}
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

                {isRevealed && item.next_due_day_index<=currentSeq && (
                  <div className={styles.buttonRow}>
                    <button
                      type="button"
                      className="buttonSecondary"
                      disabled={saving} onClick={() => handleRate(item.id, 'needs_work')}
                      style={{ flex: 1, minHeight: '44px', fontSize: '12.5px' }}
                    >
                      <span>Practice again (+1 step)</span>
                    </button>
                    <button
                      type="button"
                      className="buttonSecondary"
                      disabled={saving} onClick={() => handleRate(item.id, 'stable')}
                      style={{
                        flex: 1,
                        minHeight: '44px',
                        fontSize: '12.5px',
                        borderColor: 'var(--accent)',
                        color: 'var(--accent)'
                      }}
                    >
                      <Check size={13} />
                      <span>I remembered this</span>
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
