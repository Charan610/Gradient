import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, BookOpen, Clock, ShieldCheck, Map } from 'lucide-react';
import { PHASES, MODULES, RESOURCES } from '@/lib/db/curriculum-data';

export default function ExplorePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--canvas)', color: 'var(--ink)' }}>
      <header
        style={{
          height: '64px',
          borderBottom: '1px solid var(--hairline)',
          backgroundColor: 'var(--surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--muted)' }}>
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>

        <Link href="/app/today" className="buttonPrimary">
          <span>Enter Workspace</span>
          <span className="iconCapsule">
            <ArrowUpRight size={14} />
          </span>
        </Link>
      </header>

      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>
            Curriculum Specification (Public Read-Only)
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--ink-secondary)', lineHeight: 1.55 }}>
            Explore the complete 9-phase sequence, topic dependencies, and 41 annotated resources. Sign in to your workspace to save progress and track daily lessons.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {PHASES.map(phase => {
            const phaseModules = MODULES.filter(m => m.phase_id === phase.id);

            return (
              <section
                key={phase.id}
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--hairline)',
                  borderRadius: '14px',
                  padding: '24px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="phaseBadge">{phase.phase_code}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--muted)' }}>
                    {phase.estimated_hours} · {phase.approx_study_days}
                  </span>
                </div>

                <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
                  {phase.title}
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--ink-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {phase.description}
                </p>

                <div style={{ padding: '12px 14px', borderRadius: '8px', backgroundColor: 'var(--surface-soft)', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>
                    <ShieldCheck size={14} color="var(--accent)" />
                    <span>Readiness Gate: {phase.gate_definition.title}</span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--ink-secondary)' }}>
                    {phase.gate_definition.pass_criteria}
                  </div>
                </div>

                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'monospace' }}>
                  Modules ({phaseModules.length}):
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '8px' }}>
                  {phaseModules.map(m => (
                    <div
                      key={m.id}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: '1px solid var(--hairline)',
                        fontSize: '12.5px',
                        color: 'var(--ink)'
                      }}
                    >
                      <span style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 600, marginRight: '6px' }}>
                        {m.stable_code}
                      </span>
                      <span>{m.title}</span>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
