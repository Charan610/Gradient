'use client';

import React from 'react';
import { ShieldCheck, Clock, CheckCircle2, MessageSquare, Terminal } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';

export default function PlacementsPage() {
  const mockPhases = [
    { time: '0–5 min', title: 'Clarify & Constraints', desc: 'Restate problem, confirm inputs, outputs, edge cases (empty, negative, max size).' },
    { time: '5–12 min', title: 'Design & Complexity', desc: 'Discuss brute force, formulate optimal approach, state time & space complexity before coding.' },
    { time: '12–30 min', title: 'Clean Implementation', desc: 'Write readable, modular code with clean variable names; explain logic while typing.' },
    { time: '30–38 min', title: 'Edge Case Testing', desc: 'Dry-run with sample test cases, trace off-by-one boundaries, fix bugs calmly.' },
    { time: '38–45 min', title: 'Optimization & Trade-offs', desc: 'Discuss alternative data structures, concurrency, or scaling considerations.' }
  ];

  const starStories = [
    { title: 'Difficult Bug Diagnosis', desc: 'Diagnosing an off-by-one error or database connection leak using logs and tests.' },
    { title: 'Technical Collaboration', desc: 'Working through a merge conflict or design disagreement on an API contract.' },
    { title: 'Rapid Tool Adoption', desc: 'Learning FastAPI or PostgreSQL migrations within days to deliver a functional project.' },
    { title: 'Accepting Constructive Critique', desc: 'Incorporating peer code review feedback to simplify a complex function.' },
    { title: 'Simplifying Overengineered Code', desc: 'Refactoring redundant microservices into a clean, testable monolith.' },
    { title: 'Accountability After Failure', desc: 'Addressing a failed mock or broken test suite with disciplined root-cause analysis.' }
  ];

  return (
    <AppShell>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>
          New-Grad Placement Sprint Playbooks
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--ink-secondary)', maxWidth: '72ch', lineHeight: 1.55 }}>
          Disciplined interview execution frameworks for online assessments (OA), 45-minute live coding mocks, and behavioral STAR rounds.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: '14px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Clock size={18} color="var(--accent)" />
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)' }}>
              45-Minute Coding Mock Structure
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {mockPhases.map((phase, idx) => (
              <div key={idx} style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--surface-soft)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <strong style={{ fontSize: '13.5px', color: 'var(--ink)' }}>{phase.title}</strong>
                  <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--accent)' }}>{phase.time}</span>
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.4 }}>{phase.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: '14px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <MessageSquare size={18} color="var(--accent)" />
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)' }}>
              6 Real STAR Behavioral Stories
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {starStories.map((story, idx) => (
              <div key={idx} style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--hairline)' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '2px' }}>
                  {idx + 1}. {story.title}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--ink-secondary)', lineHeight: 1.4 }}>
                  {story.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
