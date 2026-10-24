'use client';

import React, { useEffect, useState } from 'react';
import { Settings, Download, Trash2, ShieldCheck, Sun, Moon, AlertTriangle } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { ProgressRepository } from '@/lib/db/progress-repository';
import { UserProfile } from '@/lib/db/types';
import { useTheme } from '@/components/context/ThemeContext';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [alias, setAlias] = useState('');
  const [semester, setSemester] = useState('2-2');
  const [dailyMinutes, setDailyMinutes] = useState(90);
  const [mode, setMode] = useState<'light' | 'normal' | 'deep' | 'maintenance'>('normal');
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  useEffect(() => {
    ProgressRepository.getProfile().then(p => {
      setProfile(p);
      setAlias(p.alias);
      setSemester(p.academic_semester);
      setDailyMinutes(p.preferred_daily_minutes);
      setMode(p.preferred_mode);
    });
  }, []);

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await ProgressRepository.updateProfile('local_user', {
      alias,
      academic_semester: semester,
      preferred_daily_minutes: dailyMinutes,
      preferred_mode: mode
    });
    setProfile(updated);
    setSavedFeedback('Preferences successfully saved.');
    setTimeout(() => setSavedFeedback(null), 3000);
  };

  const handleExportData = async () => {
    const jsonStr = await ProgressRepository.exportUserData('local_user');
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `foundation_study_export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = async () => {
    if (confirm('Warning: This will permanently erase all local study progress, checked tasks, and job applications. Continue?')) {
      await ProgressRepository.clearAllUserData('local_user');
      window.location.reload();
    }
  };

  return (
    <AppShell>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>
          Preferences & Data Governance
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--ink-secondary)', maxWidth: '72ch', lineHeight: 1.55 }}>
          Adjust your daily learning allocation, toggle exam maintenance mode, or export your saved study records.
        </p>
      </div>

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
            <label style={{ fontSize: '12.5px', fontWeight: 550, color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
              Your Alias / Name
            </label>
            <input
              type="text"
              value={alias}
              onChange={e => setAlias(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--hairline)', backgroundColor: 'var(--canvas)', color: 'var(--ink)', fontSize: '13.5px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 550, color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
              Current Academic Semester
            </label>
            <select
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
            <label style={{ fontSize: '12.5px', fontWeight: 550, color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
              Daily Study Time Budget
            </label>
            <select
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
            <label style={{ fontSize: '12.5px', fontWeight: 550, color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
              Study Operating Mode
            </label>
            <select
              value={mode}
              onChange={e => setMode(e.target.value as any)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--hairline)', backgroundColor: 'var(--canvas)', color: 'var(--ink)', fontSize: '13px' }}
            >
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
            <div style={{ fontSize: '13px', color: 'var(--accent)', fontFamily: 'monospace' }}>
              ✓ {savedFeedback}
            </div>
          )}

          <button type="submit" className="buttonPrimary" style={{ marginTop: '8px' }}>
            <span>Save Preferences</span>
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: '14px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>
              Data Export & Ownership
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              You own 100% of your progress history, notes, and application records. Download your local study records, including task evidence, reviews, and project notes in JSON format.
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
