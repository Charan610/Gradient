'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, CheckCircle2 } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { SUBJECTS, MODULES } from '@/lib/db/curriculum-data';

interface PageProps {
  params: Promise<{
    subjectId: string;
  }>;
}

export default function SubjectDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const subjectId = resolvedParams.subjectId.toUpperCase();
  const subject =
    SUBJECTS.find(s => s.id === subjectId || s.slug === resolvedParams.subjectId.toLowerCase()) ||
    SUBJECTS[0];

  const subjectModules = MODULES.filter(m => m.subject_id === subject.id);

  return (
    <AppShell>
      <div style={{ marginBottom: '28px' }}>
        <Link
          href="/app/subjects"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: 'var(--muted)',
            marginBottom: '12px'
          }}
        >
          <ArrowLeft size={14} />
          <span>Back to All Subjects</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="phaseBadge">{subject.id}</span>
          <span style={{ fontSize: '13px', color: 'var(--muted)', fontFamily: 'monospace' }}>
            {subjectModules.length} Focused Modules
          </span>
        </div>

        <h1 style={{ fontSize: '26px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>
          {subject.title}
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--ink-secondary)', maxWidth: '72ch', lineHeight: 1.55 }}>
          {subject.description}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {subjectModules.map(mod => (
          <div
            key={mod.id}
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--hairline)',
              borderRadius: '12px',
              padding: '20px 24px'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}
            >
              <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 600, color: 'var(--accent)' }}>
                {mod.stable_code}
              </span>
              <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--muted)' }}>
                ~{mod.expected_minutes} min study allocation
              </span>
            </div>

            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>
              {mod.title}
            </h2>

            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'monospace' }}>
              Verified Learning Outcomes
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13.5px', color: 'var(--ink-secondary)' }}>
              {mod.learning_outcomes.map((outcome, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>✓</span>
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
