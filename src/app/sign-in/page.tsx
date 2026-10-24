'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Key, Mail, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setErrorMsg(error.message);
        setIsSubmitting(false);
        return;
      }
    }

    // Navigate to user workspace
    router.push('/app/today');
  };

  const handleDemoSignIn = () => {
    router.push('/app/today');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--canvas)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '20px 24px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--muted)' }}>
          <ArrowLeft size={14} />
          <span>Home</span>
        </Link>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div
          style={{
            width: '100%',
            maxWidth: '420px',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--hairline)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: 'var(--shadow-subtle)'
          }}
        >
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--ink)',
                color: 'var(--canvas)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontFamily: 'monospace',
                fontSize: '14px',
                marginBottom: '12px'
              }}
            >
              FD
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>
              Sign In to FOUNDATION
            </h1>
            <p style={{ fontSize: '13.5px', color: 'var(--muted)' }}>
              Resume your personal day-based study sequence.
            </p>
          </div>

          {errorMsg && (
            <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--danger-soft)', color: 'var(--danger)', fontSize: '13px', marginBottom: '16px' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: 550, color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="student@college.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--hairline)', backgroundColor: 'var(--canvas)', fontSize: '13.5px', color: 'var(--ink)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12.5px', fontWeight: 550, color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--hairline)', backgroundColor: 'var(--canvas)', fontSize: '13.5px', color: 'var(--ink)' }}
              />
            </div>

            <button type="submit" className="buttonPrimary" disabled={isSubmitting} style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}>
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
              <span className="iconCapsule">
                <ArrowUpRight size={14} />
              </span>
            </button>
          </form>

          <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--hairline)' }} />
            <span style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'monospace' }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--hairline)' }} />
          </div>

          <button
            type="button"
            className="buttonSecondary"
            onClick={handleDemoSignIn}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <span>Continue with Local Storage Workspace</span>
          </button>

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--muted)' }}>
            Need an account?{' '}
            <Link href="/sign-up" style={{ color: 'var(--accent)', fontWeight: 550 }}>
              Create Account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
