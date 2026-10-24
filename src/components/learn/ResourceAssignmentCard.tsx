'use client';

import React from 'react';
import { ExternalLink, BookOpen, AlertTriangle } from 'lucide-react';
import { TaskResourceAssignment, ResourceItem } from '@/lib/db/types';
import { RESOURCES } from '@/lib/db/curriculum-data';
import styles from './ResourceAssignmentCard.module.scss';

interface ResourceAssignmentCardProps {
  assignment: TaskResourceAssignment;
}

export function ResourceAssignmentCard({ assignment }: ResourceAssignmentCardProps) {
  const resource = RESOURCES.find(r => r.id === assignment.resource_id);

  if (!resource) return null;

  return (
    <div className={styles.card} aria-labelledby={`resource-${resource.id}`}>
      <div className={styles.eyebrow}>
        <span className={styles.providerBadge}>{resource.provider}</span>
        <span style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'monospace' }}>
          {resource.access_level === 'free' ? '100% Free Resource' : 'Optional Paid Features'}
        </span>
      </div>

      <h3 id={`resource-${resource.id}`} className={styles.title}>
        {resource.title}
      </h3>

      <div className={styles.sectionGuide}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, marginBottom: '4px' }}>
          <BookOpen size={14} />
          <span>Assigned Study Section:</span>
        </div>
        <div>{assignment.exact_assigned_sections}</div>
      </div>

      <p className={styles.purpose}>
        <strong>Purpose:</strong> {assignment.purpose}
      </p>

      {resource.avoid_notes && (
        <div className={styles.skipNote}>
          <AlertTriangle size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
          <strong>What to skip:</strong> {resource.avoid_notes}
        </div>
      )}

      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.openLink}
      >
        <span>Open authoritative resource</span>
        <ExternalLink size={13} />
      </a>
    </div>
  );
}
