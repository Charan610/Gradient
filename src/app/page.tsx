import Link from 'next/link';
import { ArrowUpRight, Compass, Shield, ShieldCheck, BookOpen, RotateCcw, Map, Terminal, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--canvas)', color: 'var(--ink)' }}>
      {/* Navigation Bar */}
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
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              backgroundColor: 'var(--ink)',
              color: 'var(--canvas)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontFamily: 'monospace',
              fontSize: '13px'
            }}
          >
            GR
          </div>
          <span style={{ fontWeight: 600, letterSpacing: '0.04em', fontSize: '15px' }}>
            GRADIENT
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/explore" className="buttonTertiary">
            <span>Explore Curriculum</span>
          </Link>
          <Link href="/app/today" className="buttonPrimary" id="enter-app-button">
            <span>Open Workspace</span>
            <span className="iconCapsule">
              <ArrowUpRight size={14} />
            </span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '64px 24px 80px' }}>
        <div style={{ marginBottom: '20px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'monospace',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--accent)',
              backgroundColor: 'var(--accent-soft)',
              padding: '4px 10px',
              borderRadius: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            Personal Study Operating System
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 600,
            lineHeight: 1.18,
            letterSpacing: '-0.03em',
            color: 'var(--ink)',
            marginBottom: '20px'
          }}
        >
          Build the skills. Keep the evidence. Know your next step.
        </h1>

        <p
          style={{
            fontSize: '17px',
            lineHeight: 1.6,
            color: 'var(--ink-secondary)',
            maxWidth: '68ch',
            marginBottom: '36px'
          }}
        >
          Thirty guided C++ foundation lessons, concrete exercises, and spaced recall for your personal study routine. Follow a broader nine-phase career roadmap at your own pace. Your progress stays in this browser.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '56px' }}>
          <Link href="/sign-up" className="buttonPrimary" style={{ fontSize: '15px', padding: '10px 14px 10px 20px' }}>
            <span>Set up my study plan</span>
            <span className="iconCapsule">
              <ArrowUpRight size={16} />
            </span>
          </Link>

          <Link href="/explore" className="buttonSecondary" style={{ fontSize: '15px' }}>
            <span>Browse 9-Phase Roadmap</span>
          </Link>
        </div>

        {/* Core Principles Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--hairline)',
              borderRadius: '14px',
              padding: '24px'
            }}
          >
            <div style={{ color: 'var(--accent)', marginBottom: '12px' }}>
              <Compass size={22} />
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
              Day-by-Day Sequence
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--ink-secondary)', lineHeight: 1.5 }}>
              Progress is tracked through Learning Day 01, 02, 03... instead of fixed calendar dates. Taking a break never creates overdue task debt.
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--hairline)',
              borderRadius: '14px',
              padding: '24px'
            }}
          >
            <div style={{ color: 'var(--accent)', marginBottom: '12px' }}>
              <RotateCcw size={22} />
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
              Spaced Repetition Engine
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--ink-secondary)', lineHeight: 1.5 }}>
              Key concepts resurface after +1, +3, +7, +21, +45 completed study days. Use recall prompts to discover what needs another attempt.
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--hairline)',
              borderRadius: '14px',
              padding: '24px'
            }}
          >
            <div style={{ color: 'var(--accent)', marginBottom: '12px' }}>
              <ShieldCheck size={22} />
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
              Phase Readiness Gates
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--ink-secondary)', lineHeight: 1.5 }}>
              Use self-assessment rubrics and saved code evidence to decide what needs more practice before moving on.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--hairline)',
          backgroundColor: 'var(--surface)',
          padding: '24px',
          textAlign: 'center',
          fontSize: '13px',
          color: 'var(--muted)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '8px' }}>
          <Link href="/explore">Explore</Link>
          <Link href="/app/today">Workspace</Link>
          <Link href="/privacy">Privacy Pledge</Link>
        </div>
        <div>GRADIENT Career Preparation Operating System · Personal learning workspace</div>
      </footer>
    </div>
  );
}
