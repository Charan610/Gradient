'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Clock, Check, AlertCircle } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PHASES, MODULES } from '@/lib/db/curriculum-data';
import { ProgressRepository } from '@/lib/db/progress-repository';
import { GateAttempt } from '@/lib/db/types';
import styles from './PhaseDetail.module.scss';

interface PageProps {
  params: Promise<{
    phaseId: string;
  }>;
}

export default function PhaseDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const phaseId = resolvedParams.phaseId.toUpperCase();
  const phase = PHASES.find(p => p.id === phaseId) || PHASES[0];
  const phaseModules = MODULES.filter(m => m.phase_id === phase.id);

  const [gateAttempt, setGateAttempt] = useState<GateAttempt | null>(null);
  const [evidenceText, setEvidenceText] = useState('');
  const [checkedRubric, setCheckedRubric] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    ProgressRepository.getGateAttempt('local_user', phase.id).then(att => {
      if (att) {
        setGateAttempt(att);
        setEvidenceText(att.evidence);
      }
    });
  }, [phase.id]);

  const toggleRubric = (id: string) => {
    setCheckedRubric(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleGateSubmit = async () => {
    setIsSubmitting(true);
    setFeedback(null);

    const rubricItems = phase.gate_definition.rubric_items;
    const allChecked = rubricItems.every(r => checkedRubric[r.id]);

    if (!evidenceText.trim()) {
      setFeedback('Please provide written evidence or code reflection for your gate defense.');
      setIsSubmitting(false);
      return;
    }

    if (!allChecked) {
      setFeedback(
        `Gate check incomplete. You must verify and confirm all ${rubricItems.length} rubric criteria before recording a successful self-assessment.`
      );
      setIsSubmitting(false);
      return;
    }

    const attempt = await ProgressRepository.recordGateAttempt(
      'local_user',
      phase.id,
      checkedRubric,
      true,
      evidenceText
    );

    setGateAttempt(attempt);
    setFeedback('Congratulations! Self-assessment saved. Revisit any criterion you cannot demonstrate independently.');
    setIsSubmitting(false);
  };

  return (
    <AppShell>
      <div className={styles.header}>
        <Link href="/app/roadmap" className={styles.backLink}>
          <ArrowLeft size={14} />
          <span>Back to Roadmap Overview</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="phaseBadge">{phase.phase_code}</span>
          <span style={{ fontSize: '13px', color: 'var(--muted)', fontFamily: 'monospace' }}>
            {phase.estimated_hours} · {phase.approx_study_days}
          </span>
        </div>

        <Link href={phase.id === 'P0' ? '/app/subjects/cpp' : '/app/subjects'} className="buttonSecondary" style={{ margin: '12px 0 20px' }}>
          {phase.id === 'P0' ? 'Browse all 30 foundation lessons' : 'Explore related courses'}
        </Link>
        <h1 className={styles.title}>{phase.title}</h1>
        <p className={styles.description}>{phase.description}</p>
      </div>

      <div className={styles.detailGrid}>
        <section aria-labelledby="modules-heading">
          <h2 id="modules-heading" style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
            Curriculum Modules ({phaseModules.length})
          </h2>
          <div className={styles.moduleList}>
            {phaseModules.map(mod => (
              <div key={mod.id} className={styles.moduleCard}>
                <div className={styles.moduleHeader}>
                  <span className={styles.moduleCode}>{mod.stable_code}</span>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'monospace' }}>
                    ~{mod.expected_minutes} min
                  </span>
                </div>
                <h3 className={styles.moduleTitle}>{mod.title}</h3>
                <ul className={styles.outcomeList}>
                  {mod.learning_outcomes.map((out, idx) => (
                    <li key={idx}>{out}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <aside className={styles.gatePanel} aria-labelledby="gate-heading">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <ShieldCheck size={18} color="var(--accent)" />
            <h2 id="gate-heading" className={styles.gateTitle}>
              {phase.gate_definition.title}
            </h2>
          </div>

          <p className={styles.gateInstructions}>{phase.gate_definition.instructions}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--muted)', marginBottom: '16px', fontFamily: 'monospace' }}>
            <Clock size={13} />
            <span>Time constraint: {phase.gate_definition.time_limit_minutes} minutes</span>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px', textTransform: 'uppercase', fontFamily: 'monospace' }}>
              Rubric Criteria Checklist
            </div>
            {phase.gate_definition.rubric_items.map(item => (
              <label key={item.id} className={styles.rubricItem}>
                <input
                  type="checkbox"
                  checked={!!checkedRubric[item.id] || gateAttempt?.passed}
                  onChange={() => toggleRubric(item.id)}
                  disabled={gateAttempt?.passed}
                />
                <span>{item.criterion} ({item.weight}%)</span>
              </label>
            ))}
          </div>

          <div className={styles.evidenceArea}>
            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px', color: 'var(--ink)' }}>
              Artifact Evidence or Code Reflection
            </label>
            <textarea
              className={styles.textarea}
              placeholder="Paste your GitHub commit link, error diagnosis log, or written reflection proving capability..."
              value={evidenceText}
              onChange={e => setEvidenceText(e.target.value)}
              disabled={gateAttempt?.passed}
            />
          </div>

          {feedback && (
            <div
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                fontSize: '13px',
                marginBottom: '16px',
                backgroundColor: gateAttempt?.passed ? 'var(--accent-soft)' : 'var(--warning-soft)',
                color: gateAttempt?.passed ? 'var(--accent)' : 'var(--warning)',
                border: `1px solid ${gateAttempt?.passed ? 'var(--accent)' : 'var(--warning)'}`
              }}
            >
              {feedback}
            </div>
          )}

          {gateAttempt?.passed ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontWeight: 600, fontSize: '14px' }}>
              <Check size={16} strokeWidth={2.5} />
              <span>Readiness Gate Verified & Passed</span>
            </div>
          ) : (
            <button
              type="button"
              className="buttonPrimary"
              onClick={handleGateSubmit}
              disabled={isSubmitting}
              style={{ width: '100%' }}
            >
              <span>{isSubmitting ? 'Evaluating...' : 'Submit Gate for Verification'}</span>
              <span className="iconCapsule">✓</span>
            </button>
          )}
        </aside>
      </div>
    </AppShell>
  );
}
