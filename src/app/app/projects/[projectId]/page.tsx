'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Terminal, ExternalLink, HelpCircle } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PROJECT_TEMPLATES } from '@/lib/db/curriculum-data';

interface PageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default function ProjectDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.projectId.toUpperCase();
  const project =
    PROJECT_TEMPLATES.find(p => p.id === projectId) || PROJECT_TEMPLATES[0];

  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({});
  const [repoUrl, setRepoUrl] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const key = `foundation_proj_${project.id}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCompletedMilestones(parsed.milestones || {});
        setRepoUrl(parsed.repoUrl || '');
        setNotes(parsed.notes || '');
      } catch {
        // ignore
      }
    }
  }, [project.id]);

  const toggleMilestone = (code: string) => {
    const updated = { ...completedMilestones, [code]: !completedMilestones[code] };
    setCompletedMilestones(updated);
    localStorage.setItem(
      `foundation_proj_${project.id}`,
      JSON.stringify({ milestones: updated, repoUrl, notes })
    );
  };

  const handleSaveRepo = () => {
    localStorage.setItem(
      `foundation_proj_${project.id}`,
      JSON.stringify({ milestones: completedMilestones, repoUrl, notes })
    );
  };

  return (
    <AppShell>
      <div style={{ marginBottom: '28px' }}>
        <Link
          href="/app/projects"
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
          <span>Back to Projects</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="phaseBadge">Phase {project.phase_id.replace('P', '')} Target</span>
          <span style={{ fontSize: '13px', color: 'var(--muted)', fontFamily: 'monospace' }}>
            {project.id}
          </span>
        </div>

        <h1 style={{ fontSize: '26px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
          {project.name}
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--ink-secondary)', lineHeight: 1.55, maxWidth: '72ch' }}>
          {project.description}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'start'
        }}
      >
        <section aria-labelledby="milestones-heading">
          <h2 id="milestones-heading" style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
            Sequential Milestones ({project.milestones.length})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {project.milestones.map(m => {
              const isDone = !!completedMilestones[m.code];
              return (
                <div
                  key={m.code}
                  style={{
                    backgroundColor: isDone ? 'var(--surface-soft)' : 'var(--surface)',
                    border: '1px solid var(--hairline)',
                    borderRadius: '12px',
                    padding: '20px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isDone}
                      onClick={() => toggleMilestone(m.code)}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '5px',
                        border: '1.5px solid var(--hairline)',
                        backgroundColor: isDone ? 'var(--accent)' : 'var(--surface)',
                        color: 'var(--canvas)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        marginTop: '2px'
                      }}
                    >
                      {isDone && <Check size={13} strokeWidth={2.5} />}
                    </button>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--accent)' }}>
                          {m.code} · {m.estimated_hours}
                        </span>
                      </div>
                      <h3
                        style={{
                          fontSize: '15px',
                          fontWeight: 600,
                          color: isDone ? 'var(--muted)' : 'var(--ink)',
                          textDecoration: isDone ? 'line-through' : 'none',
                          marginBottom: '6px'
                        }}
                      >
                        {m.title}
                      </h3>
                      <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', lineHeight: 1.5, marginBottom: '10px' }}>
                        {m.description}
                      </p>

                      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                        <strong>Required Deliverables:</strong> {m.deliverables.join(' · ')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--hairline)',
              borderRadius: '14px',
              padding: '20px'
            }}
          >
            <h3 style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'monospace', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '12px' }}>
              Project Proof & Artifact Link
            </h3>
            <label style={{ fontSize: '12.5px', color: 'var(--ink)', display: 'block', marginBottom: '6px' }}>
              GitHub Repository URL:
            </label>
            <input
              type="url"
              placeholder="https://github.com/your-username/project-repo"
              value={repoUrl}
              onChange={e => setRepoUrl(e.target.value)}
              onBlur={handleSaveRepo}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--hairline)',
                backgroundColor: 'var(--canvas)',
                fontSize: '13px',
                marginBottom: '12px',
                color: 'var(--ink)'
              }}
            />

            <label style={{ fontSize: '12.5px', color: 'var(--ink)', display: 'block', marginBottom: '6px' }}>
              Architecture & Diagnosis Log:
            </label>
            <textarea
              placeholder="Record one real bug diagnosed, performance index choice, or security decision..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              onBlur={handleSaveRepo}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--hairline)',
                backgroundColor: 'var(--canvas)',
                fontSize: '13px',
                minHeight: '80px',
                resize: 'vertical',
                color: 'var(--ink)'
              }}
            />
          </div>

          <div
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--hairline)',
              borderRadius: '14px',
              padding: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <HelpCircle size={16} color="var(--accent)" />
              <h3 style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'monospace', textTransform: 'uppercase', color: 'var(--ink)' }}>
                Interview Defense Questions
              </h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--ink-secondary)' }}>
              {project.interview_questions.map((q, idx) => (
                <li key={idx} style={{ paddingLeft: '14px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--accent)' }}>•</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
