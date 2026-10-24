'use client';

import React from 'react';
import { ExternalLink, ShieldCheck, CheckCircle2, AlertTriangle, Calendar, Search } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { COMPANY_PORTALS } from '@/lib/db/curriculum-data';

export default function InternshipsPage() {
  const readinessChecklist = [
    { title: 'One-page truthful student resume', desc: 'Action verbs, measurable results, Project A/B links, zero fabricated metrics.' },
    { title: 'Phase 2 & 3 DSA foundations', desc: 'Comfortable solving unseen Easy/Medium problems in arrays, maps, two pointers, trees.' },
    { title: 'Project A deployed & test-backed', desc: 'FastAPI + PostgreSQL task API with 20+ automated pytest tests and clear README.' },
    { title: 'Core CS interview readiness', desc: 'Can clearly explain processes vs threads, ACID transactions, and HTTP status codes.' },
    { title: 'Eligibility verified before applying', desc: 'Graduation year and academic degree batch explicitly verified on official job posting.' }
  ];

  return (
    <AppShell>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>
          Internship Readiness & Official Company Portals
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--ink-secondary)', maxWidth: '72ch', lineHeight: 1.55 }}>
          Academic semester target: Apply during 3-1 for summer 3-2 opportunities. Always verify graduating batch eligibility directly on official company portals.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: '14px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <ShieldCheck size={18} color="var(--accent)" />
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)' }}>
              Internship Readiness Checklist
            </h2>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {readinessChecklist.map((item, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 550, color: 'var(--ink)' }}>{item.title}</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.4 }}>{item.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: '14px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Calendar size={18} color="var(--accent)" />
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)' }}>
              Sunday 30-Minute Opportunity Sweep
            </h2>
          </div>
          <ol style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--ink-secondary)', lineHeight: 1.5 }}>
            <li>Visit official career portals (listed below) and filter by &quot;India&quot; + &quot;Internship&quot; / &quot;University Graduate&quot;.</li>
            <li>Read <strong>actual</strong> batch eligibility before applying (e.g. 2028 vs 2029 graduates).</li>
            <li>Record URL, location, and requirements in your personal application tracker.</li>
            <li>Submit directly via official portal; do not wait to solve 500 DSA problems.</li>
            <li>Track application status and save rejection / feedback notes honestly.</li>
          </ol>
        </div>
      </div>

      <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)', marginBottom: '16px' }}>
        Verified Company Career Portals
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {COMPANY_PORTALS.map(portal => (
          <div
            key={portal.company}
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--hairline)',
              borderRadius: '12px',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)' }}>{portal.company}</h3>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--muted)' }}>
                {portal.location}
              </span>
            </div>

            <div style={{ fontSize: '13px', color: 'var(--ink-secondary)', marginBottom: '8px' }}>
              <strong>Focus:</strong> {portal.focus}
            </div>

            <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '14px' }}>
              <strong>Verification:</strong> {portal.verification}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--hairline)' }}>
              <a
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="buttonSecondary"
                style={{ width: '100%', justifyContent: 'space-between', minHeight: '36px', fontSize: '12.5px' }}
              >
                <span>Visit Career Portal</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
