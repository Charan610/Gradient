'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Trash2, ExternalLink, Briefcase, Filter } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { ProgressRepository } from '@/lib/db/progress-repository';
import { JobApplication, ApplicationStatus, ApplicationKind } from '@/lib/db/types';

export default function ApplicationsPage() {
  const [apps, setApps] = useState<JobApplication[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New application form state
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('Bengaluru / Remote');
  const [url, setUrl] = useState('');
  const [kind, setKind] = useState<ApplicationKind>('internship');
  const [status, setStatus] = useState<ApplicationStatus>('saved');
  const [eligibilityNote, setEligibilityNote] = useState('');
  const [notes, setNotes] = useState('');

  const loadApps = async () => {
    const data = await ProgressRepository.getApplications();
    setApps(data);
  };

  useEffect(() => {
    loadApps();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    await ProgressRepository.saveApplication('local_user', {
      company,
      role,
      location,
      url,
      kind,
      status,
      eligibility_note: eligibilityNote,
      notes
    });

    setIsModalOpen(false);
    setCompany('');
    setRole('');
    setUrl('');
    setEligibilityNote('');
    setNotes('');
    await loadApps();
  };

  const handleStatusChange = async (app: JobApplication, newStatus: ApplicationStatus) => {
    await ProgressRepository.saveApplication('local_user', {
      ...app,
      status: newStatus
    });
    await loadApps();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this application entry from your tracker?')) {
      await ProgressRepository.deleteApplication('local_user', id);
      await loadApps();
    }
  };

  const filteredApps =
    filterStatus === 'all'
      ? apps
      : apps.filter(a => a.status === filterStatus);

  const statusOptions: ApplicationStatus[] = [
    'saved',
    'applied',
    'oa',
    'interview',
    'offer',
    'rejected',
    'withdrawn'
  ];

  return (
    <AppShell>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
            Personal Application Pipeline
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--ink-secondary)', maxWidth: '64ch', lineHeight: 1.5 }}>
            Private CRM for tracking your real internship and placement applications. Displayed in recency order with zero fabricated listings.
          </p>
        </div>

        <button
          type="button"
          className="buttonPrimary"
          onClick={() => setIsModalOpen(true)}
          id="add-application-button"
        >
          <span>Add Application</span>
          <span className="iconCapsule">
            <Plus size={15} />
          </span>
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => setFilterStatus('all')}
          style={{
            fontFamily: 'monospace',
            fontSize: '12px',
            padding: '6px 12px',
            borderRadius: '6px',
            backgroundColor: filterStatus === 'all' ? 'var(--ink)' : 'var(--surface)',
            color: filterStatus === 'all' ? 'var(--canvas)' : 'var(--muted)',
            border: '1px solid var(--hairline)',
            cursor: 'pointer'
          }}
        >
          All ({apps.length})
        </button>
        {statusOptions.map(st => {
          const count = apps.filter(a => a.status === st).length;
          return (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              style={{
                fontFamily: 'monospace',
                fontSize: '12px',
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: filterStatus === st ? 'var(--ink)' : 'var(--surface)',
                color: filterStatus === st ? 'var(--canvas)' : 'var(--muted)',
                border: '1px solid var(--hairline)',
                cursor: 'pointer',
                textTransform: 'uppercase'
              }}
            >
              {st} ({count})
            </button>
          );
        })}
      </div>

      {filteredApps.length === 0 ? (
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--muted)', backgroundColor: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--hairline)' }}>
          <Briefcase size={32} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>
            No applications in this category
          </h3>
          <p style={{ fontSize: '13.5px' }}>
            Click &quot;Add Application&quot; to log an internship or placement role you are tracking.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredApps.map(app => (
            <div
              key={app.id}
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--hairline)',
                borderRadius: '12px',
                padding: '18px 20px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px'
              }}
            >
              <div style={{ flex: 1, minWidth: '240px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)' }}>{app.company}</h3>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--muted)' }}>
                    · {app.kind}
                  </span>
                  {app.url && (
                    <a
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open job posting"
                      style={{ color: 'var(--accent)' }}
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>

                <div style={{ fontSize: '14px', color: 'var(--ink-secondary)', marginBottom: '6px' }}>
                  {app.role} · <span style={{ color: 'var(--muted)' }}>{app.location}</span>
                </div>

                {app.eligibility_note && (
                  <div style={{ fontSize: '12px', color: 'var(--warning)', marginBottom: '4px' }}>
                    <strong>Eligibility:</strong> {app.eligibility_note}
                  </div>
                )}

                {app.notes && (
                  <div style={{ fontSize: '12.5px', color: 'var(--muted)', fontStyle: 'italic' }}>
                    {app.notes}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <select
                  value={app.status}
                  onChange={e => handleStatusChange(app, e.target.value as ApplicationStatus)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: '1px solid var(--hairline)',
                    backgroundColor: 'var(--surface-soft)',
                    fontSize: '13px',
                    fontWeight: 550,
                    color: 'var(--ink)',
                    cursor: 'pointer'
                  }}
                >
                  {statusOptions.map(st => (
                    <option key={st} value={st}>
                      {st.toUpperCase()}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => handleDelete(app.id)}
                  style={{
                    padding: '6px',
                    color: 'var(--muted)',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                  title="Delete application"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog for Adding Application */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(18, 20, 18, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 100
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: 'var(--surface)',
              borderRadius: '16px',
              border: '1px solid var(--hairline)',
              padding: '24px',
              boxShadow: 'var(--shadow-float)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)', marginBottom: '16px' }}>
              Add New Application
            </h2>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 550, color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google, Atlassian, Microsoft..."
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--hairline)', backgroundColor: 'var(--canvas)', color: 'var(--ink)', fontSize: '13.5px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 550, color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
                  Role Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Software Engineer Intern (Summer 2028)"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--hairline)', backgroundColor: 'var(--canvas)', color: 'var(--ink)', fontSize: '13.5px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 550, color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
                    Type
                  </label>
                  <select
                    value={kind}
                    onChange={e => setKind(e.target.value as ApplicationKind)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--hairline)', backgroundColor: 'var(--canvas)', color: 'var(--ink)', fontSize: '13px' }}
                  >
                    <option value="internship">Internship</option>
                    <option value="full_time">Full-Time (New Grad)</option>
                    <option value="research">Research Assistantship</option>
                    <option value="open_source">Open Source Fellowship</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 550, color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as ApplicationStatus)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--hairline)', backgroundColor: 'var(--canvas)', color: 'var(--ink)', fontSize: '13px' }}
                  >
                    {statusOptions.map(st => (
                      <option key={st} value={st}>
                        {st.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 550, color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
                  Official Job Posting URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--hairline)', backgroundColor: 'var(--canvas)', color: 'var(--ink)', fontSize: '13.5px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 550, color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
                  Eligibility Verification Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Verified 2028 batch eligible, no backlog constraints"
                  value={eligibilityNote}
                  onChange={e => setEligibilityNote(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--hairline)', backgroundColor: 'var(--canvas)', color: 'var(--ink)', fontSize: '13.5px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 550, color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
                  Notes & Interview Reflections
                </label>
                <textarea
                  placeholder="Notes on OA instructions, referral status, or questions asked..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--hairline)', backgroundColor: 'var(--canvas)', color: 'var(--ink)', fontSize: '13.5px', minHeight: '60px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="buttonSecondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="buttonPrimary">
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
