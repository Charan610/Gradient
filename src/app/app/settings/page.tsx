'use client';

import React, { useEffect, useState } from 'react';
import { Download, Upload, Trash2, Sun, Moon, AlertTriangle } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { ProgressRepository } from '@/lib/db/progress-repository';
import { UserProfile } from '@/lib/db/types';
import { MAX_BACKUP_BYTES, parseStudyBackup, restoreStudyBackup } from '@/lib/db/study-backup';
import { useTheme } from '@/components/context/ThemeContext';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [alias, setAlias] = useState('');
  const [semester, setSemester] = useState('2-2');
  const [dailyMinutes, setDailyMinutes] = useState(90);
  const [mode, setMode] = useState<'light' | 'normal' | 'deep' | 'maintenance'>('normal');
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    ProgressRepository.getProfile().then(p => {
      setProfile(p);
      setAlias(p.alias);
      setSemester(p.academic_semester);
      setDailyMinutes(p.preferred_daily_minutes);
      setMode(p.preferred_mode);
    }).catch(() => setError('Your saved preferences could not be loaded. Reload and try again.'));
  }, []);

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setSavedFeedback(null);
    setError(null);
    try {
      const updated = await ProgressRepository.updateProfile('local_user', {
        alias: alias.trim(),
        academic_semester: semester,
        preferred_daily_minutes: dailyMinutes,
        preferred_mode: mode
      });
      setProfile(updated);
      setSavedFeedback('Preferences successfully saved.');
    } catch {
      setError('Preferences could not be saved. Check browser storage and try again.');
    } finally { setBusy(false); }
  };

  const handleExportData = async () => {
    setError(null);
    try {
      const jsonStr = await ProgressRepository.exportUserData('local_user');
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gradient_study_export_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { setError('Backup could not be exported. Please try again.'); }
  };

  const handleImportData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      if (file.size > MAX_BACKUP_BYTES) throw new Error('Backup must be smaller than 5 MB.');
      const source = await file.text();
      const records = parseStudyBackup(source);
      if (!confirm(`Restore ${Object.keys(records).length} study records? This replaces this browser's current progress, notes, and applications. Export a backup first if you want to keep them.`)) return;
      restoreStudyBackup(source, localStorage);
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? `Restore failed: ${err.message}` : 'Restore failed. Your previous records were kept.');
    } finally { setBusy(false); }
  };

  const handleResetData = async () => {
    if (confirm('Warning: This will permanently erase all local study progress, checked tasks, and job applications. Continue?')) {
      try {
        await ProgressRepository.clearAllUserData('local_user');
        window.location.reload();
      } catch { setError('Data could not be reset. Check browser storage and try again.'); }
    }
  };

  return (
    <AppShell>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>
          Settings & study backups
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--ink-secondary)', maxWidth: '72ch', lineHeight: 1.55 }}>
          Adjust your daily learning allocation, toggle exam maintenance mode, or export your saved study records.
        </p>
      </div>

      {error && <p role="alert" style={{ color: 'var(--danger)', marginBottom: '16px' }}>{error}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '24px', alignItems: 'start' }}>
        <form
          onSubmit={handleSavePreferences}
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--hairline)',
            borderRadius: '14px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)' }}>Learner Profile</h2>

          <div>
            <label htmlFor="study-alias" style={{ fontSize: '12.5px', fontWeight: 550, color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
              Your Alias / Name
            </label>
            <input id="study-alias"
              type="text"
              value={alias}
              onChange={e => setAlias(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--hairline)', backgroundColor: 'var(--canvas)', color: 'var(--ink)', fontSize: '13.5px' }}
            />
          </div>

          <div>
            <label htmlFor="study-semester" style={{ fontSize: '12.5px', fontWeight: 550, color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
              Current Academic Semester
            </label>
            <select id="study-semester"
              value={semester}
              onChange={e => setSemester(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--hairline)', backgroundColor: 'var(--canvas)', color: 'var(--ink)', fontSize: '13px' }}
            >
              <option value="2-2">Second Year Second Semester (2-2)</option>
              <option value="3-1">Third Year First Semester (3-1) — Primary Intern Window</option>
              <option value="3-2">Third Year Second Semester (3-2) — Summer Intern Target</option>
              <option value="4-1">Fourth Year First Semester (4-1) — Full-Time Placement Sprint</option>
              <option value="4-2">Fourth Year Second Semester (4-2) — Graduation Conversion</option>
            </select>
          </div>

          <div>
            <label htmlFor="study-minutes" style={{ fontSize: '12.5px', fontWeight: 550, color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
              Daily Study Time Budget
            </label>
            <select id="study-minutes"
              value={dailyMinutes}
              onChange={e => setDailyMinutes(Number(e.target.value))}
              style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--hairline)', backgroundColor: 'var(--canvas)', color: 'var(--ink)', fontSize: '13px' }}
            >
              <option value={45}>Light Focus: 45 Minutes</option>
              <option value={60}>Standard: 60 Minutes</option>
              <option value={90}>Default Normal: 90 Minutes</option>
              <option value={120}>Deep Session: 120 Minutes</option>
              <option value={150}>Extended Intensive: 150 Minutes</option>
            </select>
          </div>

          <div>
            <label htmlFor="study-mode" style={{ fontSize: '12.5px', fontWeight: 550, color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
              Study Operating Mode
            </label>
            <select id="study-mode"
              value={mode}
              onChange={e => setMode(e.target.value as UserProfile['preferred_mode'])}
              style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--hairline)', backgroundColor: 'var(--canvas)', color: 'var(--ink)', fontSize: '13px' }}
            >
              <option value="light">Light Study Mode</option>
              <option value="normal">Normal Study Mode (New material + Reviews)</option>
              <option value="maintenance">Maintenance Mode (Exams: 15-30m reviews only)</option>
              <option value="deep">Deep Focus Mode (Extended practice drills)</option>
            </select>
            {mode === 'maintenance' && (
              <p style={{ fontSize: '12px', color: 'var(--warning)', marginTop: '6px' }}>
                Maintenance mode active: New required lessons are paused so you can protect college GPA during exams.
              </p>
            )}
          </div>

          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 550, color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
              Interface Theme
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="buttonSecondary"
                aria-pressed={theme === 'light'}
                onClick={() => setTheme('light')}
                style={{
                  flex: 1,
                  borderColor: theme === 'light' ? 'var(--accent)' : 'var(--hairline)',
                  color: theme === 'light' ? 'var(--accent)' : 'var(--ink)'
                }}
              >
                <Sun size={14} />
                <span>Light Theme</span>
              </button>
              <button
                type="button"
                className="buttonSecondary"
                aria-pressed={theme === 'dark'}
                onClick={() => setTheme('dark')}
                style={{
                  flex: 1,
                  borderColor: theme === 'dark' ? 'var(--accent)' : 'var(--hairline)',
                  color: theme === 'dark' ? 'var(--accent)' : 'var(--ink)'
                }}
              >
                <Moon size={14} />
                <span>Dark Theme</span>
              </button>
            </div>
          </div>

          {savedFeedback && (
            <div role="status" style={{ fontSize: '13px', color: 'var(--accent)', fontFamily: 'monospace' }}>
              ✓ {savedFeedback}
            </div>
          )}

          <button disabled={busy || !profile} type="submit" className="buttonPrimary" style={{ marginTop: '8px' }}>
            <span>Save Preferences</span>
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: '14px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>
              Back up & move your progress
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Progress is saved in this browser, separately on each website address. To move from localhost to the live site or another computer, export here, then restore the file there. Backups include task evidence, reviews, project notes, and applications.
            </p>
            <button
              type="button"
              className="buttonSecondary"
              onClick={handleExportData}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Download size={14} />
              <span>Export Private Data (JSON)</span>
            </button>
            <label htmlFor="study-backup" style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '20px', marginBottom: '8px', fontWeight: 600 }}>
              <Upload size={14} /> Restore a study backup
            </label>
            <input id="study-backup" type="file" accept=".json,application/json" disabled={busy} onChange={handleImportData} style={{ width: '100%', minWidth: 0 }} aria-describedby="backup-help" />
            <p id="backup-help" style={{ fontSize: '12px', color: 'var(--ink-secondary)', marginTop: '8px', lineHeight: 1.5 }}>
              Choose an exported JSON file (up to 5 MB). You will confirm before existing study records are replaced. Keep your backup private; it contains your notes.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)', marginBottom: '8px' }}>
              <AlertTriangle size={16} />
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Danger Zone</h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Reset all study progress back to Day 01 and erase locally saved task completions and applications.
            </p>
            <button
              type="button"
              className="buttonSecondary"
              onClick={handleResetData}
              style={{ width: '100%', justifyContent: 'center', borderColor: 'var(--danger)', color: 'var(--danger)' }}
            >
              <Trash2 size={14} />
              <span>Reset All Local Study Data</span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
