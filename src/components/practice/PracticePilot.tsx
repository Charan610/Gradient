'use client';

import { useEffect, useRef, useState } from 'react';
import { ProgressRepository } from '@/lib/db/progress-repository';
import { emptyEvidence, practiceEvidenceSchema, type PracticeAction } from '@/lib/db/practice-evidence';
import styles from './PracticePilot.module.scss';

const answers = ['3, 3', '3, 4', '4, 4'] as const;

export function PracticePilot() {
  const [evidence, setEvidence] = useState(emptyEvidence);
  const [ready, setReady] = useState(false);
  const [answer, setAnswer] = useState<(typeof answers)[number]>();
  const [revealed, setRevealed] = useState(false);
  const [hint, setHint] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const saving = useRef(false);
  const [loadAttempt, retry] = useState(0);
  useEffect(() => {
    let active = true;
    ProgressRepository.getProfile().then(profile => {
      const parsed = profile.practice_evidence === undefined ? emptyEvidence : practiceEvidenceSchema.parse(profile.practice_evidence);
      if (active) { setEvidence(parsed); setReady(true); setError(''); }
    }).catch(() => { if (active) setError('Saved practice could not be read. Your records have not been reset.'); });
    return () => { active = false; };
  }, [loadAttempt]);

  async function save(action: PracticeAction, message: string) {
    if (saving.current || !ready) return;
    saving.current = true;
    setBusy(true);
    setError('');
    setFeedback('');
    try {
      setEvidence(await ProgressRepository.savePracticeAction(action));
      setFeedback(message);
      if (action.type === 'submit' && action.answer === '3, 4') setRevealed(true);
    } catch {
      setError('Practice could not be saved. Check browser storage and try again.');
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }

  return <section className={styles.card} aria-labelledby="practice-pilot-title">
    <header><p className={styles.label}>PRACTICE PILOT · C++</p><h2 id="practice-pilot-title">Which call changes the original?</h2>
      <p>Predict the value of <code>x</code> after each call. Your result applies to this question only.</p></header>
    <pre><code>{'void copy(int n) { ++n; }\nvoid change(int& n) { ++n; }\n\nint x = 3;\ncopy(x);    // first value of x\nchange(x);  // second value of x'}</code></pre>
    <form onSubmit={event => {
      event.preventDefault();
      if (!answer) return;
      const explanation = answer === '3, 4'
        ? 'Correct: the copy leaves x at 3, then the reference changes x to 4.'
        : 'Try tracing which parameter refers to x itself. The copy does not change the original.';
      void save({type:'submit', id:crypto.randomUUID(), answer, assisted:hint || revealed}, explanation);
    }}>
      <fieldset disabled={!ready || busy}>
        <legend>Values after the first and second calls</legend>
        {answers.map(value => <label key={value}><input type="radio" name="reference-values" value={value} checked={answer === value} onChange={() => setAnswer(value)} />{value}</label>)}
      </fieldset>
      <div className={styles.actions}>
        <button className="buttonPrimary" disabled={!ready || busy || !answer} type="submit">Check answer</button>
        <button className="buttonSecondary" disabled={!ready || busy || hint} type="button" onClick={() => {
          setHint(true);
          void save({type:'hint'}, 'An int parameter gets its own value; an int& refers to the caller’s object.');
        }}>Show hint</button>
      </div>
    </form>
    {(hint || revealed) && <p>Further checks on this visit count as guided practice.</p>}
    {feedback && <p role="status">{feedback}</p>}
    {error && <p role="alert">{error} {!ready && <button className="buttonTertiary" onClick={() => retry(count => count+1)}>Retry</button>}</p>}
    {ready && <div className={styles.evidence}>
      <strong>{evidence.firstPassAt !== null ? 'Independent answer passed' : evidence.guided ? 'Guided practice recorded' : 'No independent pass yet'}</strong>
      <p>Independent attempts: {evidence.independentAttempts} · Later successful reviews: {evidence.retrieved}</p>
      {evidence.needsReview && <p>Needs another try. Earlier passes stay saved.</p>}
      {evidence.dueAt !== null && <p>{evidence.dueAt <= Date.now() ? 'Review is due.' : `Next review: ${new Date(evidence.dueAt).toLocaleDateString()}.`} {evidence.dueAt <= Date.now() && <button className="buttonTertiary" disabled={busy} onClick={() => void save({type:'snooze'}, 'Review postponed by one day.')}>Snooze one day</button>}</p>}
    </div>}
  </section>;
}
