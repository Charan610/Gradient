'use client';

import React, { useEffect, useState } from 'react';
import { BarChart2, ShieldCheck, CheckCircle2, Clock, Target, Briefcase } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { ProgressRepository } from '@/lib/db/progress-repository';
import { UserProfile, JobApplication, ConceptReview } from '@/lib/db/types';
import { PHASES, LEARNING_DAYS, SUBJECTS } from '@/lib/db/curriculum-data';

export default function InsightsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [apps, setApps] = useState<JobApplication[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [reviews, setReviews] = useState<ConceptReview[]>([]);

  useEffect(() => {
    Promise.all([
      ProgressRepository.getProfile(),
      ProgressRepository.getApplications(),
      ProgressRepository.getDueReviews('local_user', 9999),
      Promise.all(LEARNING_DAYS.map(d => ProgressRepository.getDayProgress('local_user', d.id)))
    ]).then(([p, a, r, days]) => {
      setProfile(p);
      setApps(a);
      setReviews(r);
      setCompletedIds(days.filter(d => d?.state === 'completed').map(d => d!.learning_day_id));
    });
  }, []);

  const activeDay = profile?.active_day_index ?? 1;
  const completedDays = completedIds.length;
  const totalMinutesEstimated = completedDays * 90;

  const stableReviewsCount = reviews.filter(r => r.latest_confidence === 'stable').length;

  return (
    <AppShell>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>
          Your Study Progress
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--ink-secondary)', maxWidth: '72ch', lineHeight: 1.55 }}>
          Completed lessons and self-rated recall from your saved records. These show practice activity, not a guarantee of interview readiness.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}
      >
        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '6px' }}>
            Study Days Completed
          </div>
          <div style={{ fontSize: '28px', fontWeight: 600, fontFamily: 'monospace', color: 'var(--ink)', marginBottom: '4px' }}>
            {completedDays}
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--muted)' }}>
            Sequential active sessions
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '6px' }}>
            Estimated Logged Work
          </div>
          <div style={{ fontSize: '28px', fontWeight: 600, fontFamily: 'monospace', color: 'var(--ink)', marginBottom: '4px' }}>
            {Math.round(totalMinutesEstimated / 60)}h
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--muted)' }}>
            Focused preparation effort
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '6px' }}>
            Concepts Mastered
          </div>
          <div style={{ fontSize: '28px', fontWeight: 600, fontFamily: 'monospace', color: 'var(--ink)', marginBottom: '4px' }}>
            {stableReviewsCount}
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--muted)' }}>
            Rated stable in spaced recall
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '6px' }}>
            Applications Tracked
          </div>
          <div style={{ fontSize: '28px', fontWeight: 600, fontFamily: 'monospace', color: 'var(--ink)', marginBottom: '4px' }}>
            {apps.length}
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--muted)' }}>
            Active opportunities in pipeline
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '24px' }}>
        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: '14px', padding: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)', marginBottom: '16px' }}>
            Curriculum Phase Sequence Progress
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {PHASES.map(p => {
              const isCurrent = p.id === 'P0';
              const days = LEARNING_DAYS.filter(d => d.phase_id === p.id);
              const percent = days.length ? Math.round(days.filter(d => completedIds.includes(d.id)).length / days.length * 100) : 0;
              return (
                <div key={p.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 550, color: 'var(--ink)' }}>{p.phase_code}: {p.title}</span>
                    <span style={{ fontFamily: 'monospace', color: 'var(--muted)' }}>{days.length ? `${percent}%` : 'Outline only'}</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', borderRadius: '3px', backgroundColor: 'var(--surface-soft)', overflow: 'hidden' }}>
                    <div style={{ width: `${percent}%`, height: '100%', backgroundColor: 'var(--accent)', transition: 'width 200ms ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: '14px', padding: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)', marginBottom: '16px' }}>
            Evidence & Verification Integrity
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--ink-secondary)', lineHeight: 1.5 }}>
            <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--surface-soft)' }}>
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '2px' }}>Self-Reported Tasks:</div>
              <div>Checked checklist tasks and self-ratings recorded in daily sessions.</div>
            </div>

            <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--surface-soft)' }}>
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '2px' }}>Gate-Verified Proof:</div>
              <div>Self-assessed rubric criteria and written evidence. No automated assessment is performed.</div>
            </div>

            <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--surface-soft)' }}>
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '2px' }}>External Verification:</div>
              <div>Repository links and test results you provide. This workspace does not independently verify them.</div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
