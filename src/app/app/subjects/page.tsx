'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Terminal, Database, Server, Cpu, Sparkles } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { SUBJECTS, MODULES } from '@/lib/db/curriculum-data';

export default function SubjectsPage() {
  const getSubjectIcon = (id: string) => {
    switch (id) {
      case 'CPP': return Terminal;
      case 'DSA': return BookOpen;
      case 'DB': return Database;
      case 'CS': return Server;
      case 'BE': return Cpu;
      case 'AI': return Sparkles;
      default: return BookOpen;
    }
  };

  return (
    <AppShell>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>
          Core Engineering Subject Syllabi
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--ink-secondary)', maxWidth: '72ch', lineHeight: 1.55 }}>
          In-depth skill breakdowns across systems programming, algorithms, database architecture, and backend engineering. Structured to teach exactly what to master and what to defer.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}
      >
        {SUBJECTS.map(subj => {
          const Icon = getSubjectIcon(subj.id);
          const subjModules = MODULES.filter(m => m.subject_id === subj.id);

          return (
            <div
              key={subj.id}
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--hairline)',
                borderRadius: '14px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--surface-soft)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent)'
                  }}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--muted)' }}>
                    {subj.id} · {subjModules.length} Modules
                  </span>
                  <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)' }}>{subj.title}</h2>
                </div>
              </div>

              <p style={{ fontSize: '13.5px', color: 'var(--ink-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
                {subj.description}
              </p>

              <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--hairline)' }}>
                <Link
                  href={`/app/subjects/${subj.id.toLowerCase()}`}
                  className="buttonSecondary"
                  style={{ width: '100%', justifyContent: 'space-between', minHeight: '38px', fontSize: '13px' }}
                >
                  <span>Explore Detailed Syllabus</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
