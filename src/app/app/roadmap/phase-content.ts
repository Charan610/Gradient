import { LEARNING_DAYS, PHASES, PROJECT_TEMPLATES } from '@/lib/db/curriculum-data';

const phaseUpdates: Record<string, { title?: string; description: string }> = {
  P1: { title: 'C++ Depth, OOP, RAII & Developer Tools', description: 'Practice object lifetimes, smart pointers, templates, modern STL, and developer workflows.' },
  P2: { title: 'DSA Foundations, SQL Entry & Complexity', description: 'Practice core data structures and algorithms alongside relational modeling and SQL queries.' },
  P3: { description: 'Build advanced search and data structure skills, study databases and operating systems, and secure a real API in Project A.' },
  P4: { description: 'Work through graphs, dynamic programming, and production backend topics, then defend your trade-offs in Project B.' },
  P7: { title: 'Advanced Engineering & Applied AI Systems', description: 'Build lexical and hybrid retrieval, evaluate grounded answers, and audit AI-generated code in Project C.' },
};

export const roadmapPhases = PHASES.map(phase => ({ ...phase, ...phaseUpdates[phase.id] }));

export const lessonHref = (lesson: { phase_id: string; id: string }) =>
  `/app/learn/${lesson.phase_id}/${lesson.id}`;

function lessonLinks(ids: string[], action: string) {
  return LEARNING_DAYS.filter(lesson => ids.includes(lesson.id)).map(lesson => ({
    href: lessonHref(lesson),
    label: `${lesson.id} · ${lesson.title}`,
    action,
  }));
}

const appliedLinks: Record<string, { href: string; label: string; action: string }[]> = {
  P0: [{ href: '/setup/cpp', label: 'C++ setup guide', action: 'Compile and run your first program locally.' }],
  P5: [
    ...lessonLinks(['P3-D25'], 'Run a timed online assessment and record what slowed you down.'),
    { href: '/app/career/internships', label: 'Internship readiness checklist', action: 'Review your evidence and identify the next gap to close.' },
    { href: '/app/career/placements', label: 'Coding mocks and STAR stories', action: 'Run a 45-minute coding mock and prepare six STAR stories.' },
  ],
  P6: [
    { href: '/app/review', label: 'Spaced recall queue', action: 'Review due cards from DSA, databases, systems, and backend lessons.' },
    { href: '/app/career/applications', label: 'Application tracker', action: 'Record target roles, interview stages, and follow-ups.' },
  ],
  P8: [
    ...lessonLinks(['BE-D11', 'BE-D12'], 'Use the production readiness checks to review a project before handoff.'),
    { href: '/app/projects/PROJ-B', label: 'Review your system design trade-offs', action: 'Use the Project B defense questions to explain your transaction, indexing, and caching choices.' },
    { href: '/app/career', label: 'Career center', action: 'Review your transition plan and prepare for onboarding.' },
    { href: '/app/career/applications', label: 'Track offers and next steps', action: 'Record offer outcomes, deadlines, and follow-ups.' },
  ],
};

export function phaseDeliverables(phaseId: string) {
  return [
    ...(appliedLinks[phaseId] ?? []),
    ...PROJECT_TEMPLATES.filter(project => project.phase_id === phaseId).map(project => ({
      href: `/app/projects/${project.id}`,
      label: project.name,
      action: 'Complete the project milestones and prepare evidence for your readiness gate.',
    })),
  ];
}
