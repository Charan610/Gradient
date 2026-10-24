import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Download, Trash2 } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--canvas)', color: 'var(--ink)' }}>
      <header
        style={{
          height: '64px',
          borderBottom: '1px solid var(--hairline)',
          backgroundColor: 'var(--surface)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          maxWidth: '960px',
          margin: '0 auto'
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--muted)' }}>
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>
      </header>

      <main style={{ maxWidth: '780px', margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', marginBottom: '8px' }}>
          <Shield size={20} />
          <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
            Privacy Architecture
          </span>
        </div>

        <h1 style={{ fontSize: '30px', fontWeight: 600, color: 'var(--ink)', marginBottom: '16px' }}>
          Our Privacy & Data Integrity Pledge
        </h1>

        <p style={{ fontSize: '16px', color: 'var(--ink-secondary)', lineHeight: 1.6, marginBottom: '32px' }}>
          FOUNDATION is an intentional study operating system built for technical mastery, not ad-targeting, behavioral tracking, or surveillance capitalism.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: '14px', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>
              1. Zero Ad Trackers & Zero Analytics Pixels
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--ink-secondary)', lineHeight: 1.55 }}>
              There are no third-party tracking scripts, Facebook pixels, Google Analytics beacons, or commercial session replayers. We do not sell, rent, or monetize your study habits.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: '14px', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>
              2. Strict Multi-Tenant Row Level Security (RLS)
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--ink-secondary)', lineHeight: 1.55 }}>
              All private data—including task progress, study logs, private notes, and job application tracking—is protected by PostgreSQL Row Level Security. No other student or unauthorized client can ever read or modify your records.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: '14px', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>
              3. Unconditional Data Export & Deletion
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--ink-secondary)', lineHeight: 1.55 }}>
              You can export your complete study telemetry at any moment in open JSON format via Settings. You can also permanently purge your account and records with a single click.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
