'use client';

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
      <div className={styles.headerArea}>
        <h1 className={styles.title}>Annotated Resource Catalog (R01–R41)</h1>
        <p className={styles.subtitle}>
          All 41 verified learning resources from the master source document. Direct canonical URLs, exact assigned sections, and explicit guidance on what to skip.
        </p>
      </div>

      <div className={styles.searchBar}>
        <Search size={16} color="var(--muted)" />
        <input
          type="text"
          placeholder="Filter resources by title, provider, code, or topic..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className={styles.input}
        />
        <span style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'monospace' }}>
          {filtered.length} of {RESOURCES.length}
        </span>
      </div>

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
                title="Submit a broken link review request"
              >
                <Flag size={11} />
                <span>{reportedIds[r.id] ? 'Reported' : 'Report'}</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
