'use client';

import Link from 'next/link';
import libraryStyles from '@/components/courses/Courses.module.scss';
import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Search, ExternalLink, AlertTriangle, ShieldCheck, Flag } from 'lucide-react';
import { RESOURCES } from '@/lib/db/curriculum-data';
import styles from './Resources.module.scss';

export default function ResourcesPage() {
  const [query, setQuery] = useState('');
  const [reportedIds, setReportedIds] = useState<Record<string, boolean>>({});

  const filtered = RESOURCES.filter(
    r =>
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.provider.toLowerCase().includes(query.toLowerCase()) ||
      r.stable_code.toLowerCase().includes(query.toLowerCase()) ||
      r.source_notes.toLowerCase().includes(query.toLowerCase())
  );

  const handleReportBroken = (id: string) => {
    setReportedIds(prev => ({ ...prev, [id]: true }));
  };

  return (
    <AppShell>
      <header className={libraryStyles.heading}>
        <div><span className={libraryStyles.eyebrow}>YOUR REFERENCE SHELF</span><h1>Good sources. Less searching.</h1>
        <p className={styles.subtitle}>
          41 learning resources collected in the study roadmap. Start with your lesson’s assigned source; you do not need to complete every course. Availability and chapter numbering can change.
        </p></div><Link href="/app/subjects" className="buttonSecondary">Find your course</Link>
      </header>

      <div className={styles.searchBar}>
        <Search size={16} color="var(--muted)" />
        <input
          type="text"
          aria-label="Search learning resources"
          placeholder="Filter resources by title, provider, code, or topic..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className={styles.input}
        />
        <span style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'monospace' }}>
          {filtered.length} of {RESOURCES.length}
        </span>
      </div>

      {filtered.length === 0 && <div className={libraryStyles.empty}><h2>No matching resources</h2><p>Try a topic, provider, or resource code.</p><button className="buttonSecondary" onClick={() => setQuery('')}>Clear search</button></div>}
      <div className={styles.resourceGrid}>
        {filtered.map(r => (
          <article key={r.id} className={styles.card} aria-labelledby={`res-title-${r.id}`}>
            <div className={styles.cardHeader}>
              <span className={styles.codeBadge}>{r.stable_code}</span>
              <span className={styles.provider}>{r.provider}</span>
            </div>

            <h2 id={`res-title-${r.id}`} className={styles.resourceTitle}>
              {r.title}
            </h2>

            <p className={styles.notes}>{r.source_notes}</p>

            {r.avoid_notes && (
              <div className={styles.avoidText}>
                <AlertTriangle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                <span>{r.avoid_notes}</span>
              </div>
            )}

            <div className={styles.cardFooter}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.openLink}
              >
                <span>Open Resource</span>
                <ExternalLink size={13} />
              </a>

              <button
                type="button"
                className="buttonTertiary"
                onClick={() => handleReportBroken(r.id)}
                style={{ fontSize: '11px', padding: '2px 6px' }}
                title="Flag this resource for this visit; no report is sent"
              >
                <Flag size={11} />
                <span>{reportedIds[r.id] ? 'Flagged for this visit' : 'Flag for review'}</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
