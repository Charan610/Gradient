'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Terminal, Server, Sparkles, CheckCircle2 } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PROJECT_TEMPLATES } from '@/lib/db/curriculum-data';

export default function ProjectsPage() {
  return (
    <AppShell>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>
          Engineering Project Portfolio
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--ink-secondary)', maxWidth: '72ch', lineHeight: 1.55 }}>
          Two flagship backend engineering builds plus one optional differentiator. Tested with automated suites, backed by real databases, and documented for technical interview defense.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        {PROJECT_TEMPLATES.map(proj => (
          <div
            key={proj.id}
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--hairline)',
              borderRadius: '14px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="phaseBadge">Required in Phase {proj.phase_id.replace('P', '')}</span>
              <span style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'monospace' }}>
                {proj.milestones.length} Sequential Milestones
              </span>
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
              {proj.name}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '14px', fontStyle: 'italic' }}>
              {proj.tagline}
            </p>
            <p style={{ fontSize: '14px', color: 'var(--ink-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              {proj.description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
              {proj.tech_stack.map(tech => (
                <span
                  key={tech}
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--surface-soft)',
                    color: 'var(--ink)'
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--hairline)' }}>
              <Link
                href={`/app/projects/${proj.id}`}
                className="buttonSecondary"
                style={{ width: '100%', justifyContent: 'space-between', minHeight: '40px', fontSize: '13px' }}
              >
                <span>Open Project Workspace & Milestones</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
