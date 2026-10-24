'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ProgressRepository } from '@/lib/db/progress-repository';

export default function SignUpPage() {
  const router = useRouter();
  const [alias, setAlias] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [semester, setSemester] = useState('2-2');
  const [minutes, setMinutes] = useState(90);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            alias,
            academic_semester: semester,
            preferred_daily_minutes: minutes
          }
        }
      });

      if (error) {
        setErrorMsg(error.message);
        setIsSubmitting(false);
        return;
      }
    }

    // Save profile locally
    await ProgressRepository.updateProfile('local_user', {
      alias: alias || 'Student Engineer',
      academic_semester: semester,
      preferred_daily_minutes: minutes,
      active_day_index: 1
    });

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
            maxWidth: '460px',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--hairline)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: 'var(--shadow-subtle)'
          }}
        >
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>
              Create Your Study Workspace
            </h1>
            <p style={{ fontSize: '13.5px', color: 'var(--muted)' }}>
              Configure your daily budget and start Day 01.
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
                Your Name / Alias
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Charan"
                value={alias}
                onChange={e => setAlias(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--hairline)', backgroundColor: 'var(--canvas)', fontSize: '13.5px', color: 'var(--ink)' }}
              />
            </div>

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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 550, color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
                  Semester
                </label>
                <select
                  value={semester}
                  onChange={e => setSemester(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--hairline)', backgroundColor: 'var(--canvas)', color: 'var(--ink)', fontSize: '13px' }}
                >
                  <option value="2-2">2-2</option>
                  <option value="3-1">3-1</option>
                  <option value="3-2">3-2</option>
                  <option value="4-1">4-1</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 550, color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
                  Daily Minutes
                </label>
                <select
                  value={minutes}
                  onChange={e => setMinutes(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--hairline)', backgroundColor: 'var(--canvas)', color: 'var(--ink)', fontSize: '13px' }}
                >
                  <option value={45}>45 min</option>
                  <option value={90}>90 min</option>
                  <option value={120}>120 min</option>
                </select>
              </div>
            </div>

            <button type="submit" className="buttonPrimary" disabled={isSubmitting} style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}>
              <span>{isSubmitting ? 'Setting up...' : 'Create Workspace & Start Day 01'}</span>
              <span className="iconCapsule">
                <ArrowUpRight size={14} />
              </span>
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--muted)' }}>
            Already have a workspace?{' '}
            <Link href="/sign-in" style={{ color: 'var(--accent)', fontWeight: 550 }}>
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
