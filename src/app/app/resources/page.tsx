'use client';

import Link from 'next/link';
import libraryStyles from '@/components/courses/Courses.module.scss';
import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Search, ExternalLink, AlertTriangle, Flag } from 'lucide-react';
import { useStudyLibrary } from '@/components/courses/useStudyLibrary';
import { ReactiveSurface } from '@/components/ui/ReactiveSurface';
import { RESOURCES, LEARNING_DAYS } from '@/lib/db/curriculum-data';
import styles from './Resources.module.scss';

export default function ResourcesPage() {
  const [query, setQuery] = useState('');
  const [reportedIds, setReportedIds] = useState<Record<string, boolean>>({});

  const [scope, setScope] = useState('all');
  const [provider, setProvider] = useState('all');
  const { activeSequence, loading, error } = useStudyLibrary();
  const active = !loading && !error ? LEARNING_DAYS.find(day => day.sequence_index === activeSequence) : undefined;
  const assignedIds = new Set(active?.tasks.flatMap(task => task.assigned_resources?.map(item => item.resource_id) || []) || []);
  const providers = [...new Set(RESOURCES.map(resource => resource.provider))].sort();
  const filtered = RESOURCES.filter(resource =>
    [resource.title, resource.provider, resource.stable_code, resource.source_notes].join(' ').toLowerCase().includes(query.trim().toLowerCase()) &&
    (provider === 'all' || resource.provider === provider) &&
    (scope === 'all' || (scope === 'lesson' ? assignedIds.has(resource.id) : resource.access_level === 'free'))
  );
  const resetFilters = () => { setQuery(''); setScope('all'); setProvider('all'); };

  return (
    <AppShell>
      <header className={libraryStyles.heading}>
        <div><span className={libraryStyles.eyebrow}>YOUR REFERENCE SHELF</span><h1>Good sources. Less searching.</h1>
        <p className={styles.subtitle}>
          {RESOURCES.length} learning resources collected in the study roadmap. Start with your lesson’s assigned source; you do not need to complete every course. Availability and chapter numbering can change.
        </p></div><Link href="/app/subjects" className="buttonSecondary">Find your course</Link>
      </header>

      <ReactiveSurface className={styles.orientation} label="How to use your resources">
        <div><span className={libraryStyles.eyebrow}>A REFERENCE, NOT ANOTHER TO-DO LIST</span><h2>Read with a question.<br />Leave with something you can build.</h2><p>Choose the source assigned to your lesson. Read the relevant section, close it, and try the exercise yourself.</p>{active && <Link className="buttonSecondary" href={`/app/learn/${active.phase_id}/${active.id}`}>Return to Day {String(active.sequence_index).padStart(2, '0')} ↗</Link>}</div>
        <ol><li><span>01</span><div><strong>Find the explanation</strong><p>Follow the exact sections in your study guide.</p></div></li><li><span>02</span><div><strong>Turn reading into practice</strong><p>Write a small example without copying.</p></div></li><li><span>03</span><div><strong>Keep evidence, not open tabs</strong><p>Save the result and what you learned.</p></div></li></ol>
      </ReactiveSurface>
      <div className={styles.controls}>
        <div className={libraryStyles.filters} aria-label="Resource collection">{[['all','All resources'],['lesson','Current lesson'],['free','Listed as free']].map(([value,label]) => <button key={value} aria-pressed={scope === value} onClick={() => setScope(value)} disabled={value === 'lesson' && !active}>{label}</button>)}</div>
        <label className={styles.providerFilter}>Provider<select aria-label="Filter by provider" value={provider} onChange={event => setProvider(event.target.value)}><option value="all">All providers</option>{providers.map(name => <option key={name} value={name}>{name}</option>)}</select></label>
      </div>
      {error && <p role="status">Your saved lesson could not be loaded. You can still browse every resource.</p>}
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
        <span aria-live="polite" style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'monospace' }}>
          {filtered.length} of {RESOURCES.length}
        </span>
      </div>

      {filtered.length === 0 && <div className={libraryStyles.empty}><h2>No matching resources</h2><p>Try another topic or provider, or clear all filters.</p><button className="buttonSecondary" onClick={resetFilters}>Clear filters</button></div>}
      <p className={styles.accessNote}>Access labels reflect the saved catalog; providers may change availability or pricing. Flags stay on this page for this visit and do not send a report.</p>
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

            <div className={styles.tags}><span>{r.access_level === 'free' ? 'Listed as free' : r.access_level === 'paid_optional' ? 'Optional paid access' : 'Paid access'}</span>{assignedIds.has(r.id) && <span>In your current lesson</span>}</div>
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
                <span>Open resource<span className="sr-only">: {r.title} (opens in a new tab)</span></span>
                <ExternalLink size={13} />
              </a>

              <button
                type="button"
                className="buttonTertiary"
                onClick={() => setReportedIds(previous => ({ ...previous, [r.id]: !previous[r.id] }))}
                aria-pressed={!!reportedIds[r.id]}
                style={{ fontSize: '12px', minHeight: 44 }}
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
