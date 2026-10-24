'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Compass, Map, RotateCcw, Briefcase, Terminal, BookOpen } from 'lucide-react';
import styles from './CommandPalette.module.scss';
import clsx from 'clsx';
import { PHASES, SUBJECTS, RESOURCES, PROJECT_TEMPLATES } from '@/lib/db/curriculum-data';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Close on Escape, toggle on Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    { id: 'act-today', title: 'Continue Daily Study Session', href: '/app/today', tag: 'Action', icon: Compass },
    { id: 'act-roadmap', title: 'View Sequence Roadmap (P0-P8)', href: '/app/roadmap', tag: 'Navigate', icon: Map },
    { id: 'act-review', title: 'Open Spaced Repetition Queue', href: '/app/review', tag: 'Practice', icon: RotateCcw },
    { id: 'act-apps', title: 'Job Application Tracker', href: '/app/career/applications', tag: 'Career', icon: Briefcase },
    { id: 'act-projects', title: 'Projects Portfolio Studio', href: '/app/projects', tag: 'Build', icon: Terminal }
  ];

  const filteredPhases = PHASES.filter(
    p => p.title.toLowerCase().includes(query.toLowerCase()) || p.phase_code.toLowerCase().includes(query.toLowerCase())
  ).map(p => ({
    id: p.id,
    title: `${p.phase_code}: ${p.title}`,
    href: `/app/roadmap/${p.id}`,
    tag: 'Phase',
    icon: Map
  }));

  const filteredSubjects = SUBJECTS.filter(s =>
    s.title.toLowerCase().includes(query.toLowerCase()) || s.slug.toLowerCase().includes(query.toLowerCase())
  ).map(s => ({
    id: s.id,
    title: s.title,
    href: `/app/subjects/${s.id.toLowerCase()}`,
    tag: 'Subject',
    icon: BookOpen
  }));

  const filteredProjects = PROJECT_TEMPLATES.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  ).map(p => ({
    id: p.id,
    title: p.name,
    href: `/app/projects/${p.id}`,
    tag: 'Project',
    icon: Terminal
  }));

  const allItems = [...quickActions, ...filteredPhases, ...filteredSubjects, ...filteredProjects];

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.inputWrapper}>
          <Search className={styles.searchIcon} />
          <input
            autoFocus
            type="text"
            placeholder="Search phases, topics, resources, actions..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className={styles.input}
          />
          <span className={styles.escBadge}>ESC</span>
        </div>

        <ul className={styles.resultsList}>
          {allItems.length === 0 ? (
            <li className={styles.resultItem}>
              <span className={styles.itemSub}>No results found for &quot;{query}&quot;</span>
            </li>
          ) : (
            allItems.slice(0, 10).map((item, idx) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.id}
                  className={clsx(styles.resultItem, idx === selectedIndex && styles.selected)}
                  onClick={() => handleSelect(item.href)}
                >
                  <div className={styles.itemMain}>
                    <Icon size={16} className={styles.searchIcon} />
                    <span className={styles.itemTitle}>{item.title}</span>
                  </div>
                  <span className={styles.itemTag}>{item.tag}</span>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
