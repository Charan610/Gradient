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
      <span className="phaseBadge">NO ACCOUNT NEEDED</span>
      <h1>Make it yours. Then begin.</h1>
      <p>Set your name and learning preferences, then start immediately. Your 30 guided C++ foundation lessons follow a simple rhythm: exercise, self-check, clear next step.</p>
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
      <p className="workspaceEntryNote">Saved locally in this browser. Transfer your progress with a JSON backup from Settings. No account required. Automatic cloud sync is not available.</p>
    </section>
  </main>;
}
