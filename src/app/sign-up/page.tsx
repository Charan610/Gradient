'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { ProgressRepository } from '@/lib/db/progress-repository';

export default function SignUpPage() {
  const router = useRouter();
  const [alias, setAlias] = useState('');
  const [minutes, setMinutes] = useState(90);
  const [semester, setSemester] = useState('2-2');
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    ProgressRepository.getProfile().then(p => {
      setAlias(p.alias === 'Student Engineer' ? '' : p.alias);
      setMinutes(p.preferred_daily_minutes);
      setSemester(p.academic_semester);
    }).catch(() => setError('Could not read browser storage. Check that storage is allowed.')).finally(() => setBusy(false));
  }, []);
  return <main className="workspaceEntry">
    <Link href="/" className="buttonTertiary"><ArrowLeft size={14} /> Home</Link>
    <section className="workspaceEntryCard">
      <span className="phaseBadge">A PERSONAL STUDY WORKSPACE</span>
      <h1>Build a foundation. One lesson at a time.</h1>
      <p>Start with 30 guided C++ foundation lessons. Read a little, write code, test it, and explain what you learned.</p>
      <form onSubmit={async e => {
        e.preventDefault(); setBusy(true); setError('');
        try {
          await ProgressRepository.updateProfile('local_user', { alias: alias.trim() || 'Student Engineer', preferred_daily_minutes: minutes, academic_semester: semester });
          router.push('/app/today');
        } catch { setError('Your preferences could not be saved. Check browser storage and try again.'); setBusy(false); }
      }}>
        <label htmlFor="learner-name">What should we call you?</label>
        <input id="learner-name" autoComplete="given-name" maxLength={60} value={alias} onChange={e => setAlias(e.target.value)} placeholder="Your name" />
        <label htmlFor="learner-semester">Current semester</label>
        <select id="learner-semester" value={semester} onChange={e => setSemester(e.target.value)}>
          {['1-1','1-2','2-1','2-2','3-1','3-2','4-1','4-2'].map(value => <option key={value}>{value}</option>)}
        </select>
        <label htmlFor="learner-budget">Time you can comfortably give a session</label>
        <select id="learner-budget" value={minutes} onChange={e => setMinutes(Number(e.target.value))}>
          {[45,60,90,120,150].map(value => <option key={value} value={value}>{value} minutes</option>)}
        </select>
        <p className="workspaceEntryNote">A learning day can span several sessions. Breaks never reset your progress. Updating these preferences preserves your completed work.</p>
        {error && <p role="alert">{error}</p>}
        <button className="buttonPrimary" disabled={busy}>{busy ? 'Preparing…' : 'Open my study plan'} <ArrowUpRight size={16} /></button>
      </form>
      <p className="workspaceEntryNote">Saved on this browser only. No email, password, or cloud account required. Back up your progress from Settings.</p>
    </section>
  </main>;
}
