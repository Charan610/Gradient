import { LEARNING_DAYS, PHASES, PROJECT_TEMPLATES, RESOURCES } from './curriculum-data';
import { COURSE_INDEX } from './course-index';

export interface LibraryResult { id: string; title: string; href: string; kind: string; external?: boolean; }
const destinations: LibraryResult[] = [
  { id: 'today', title: 'Home · your next learning step', href: '/app/today', kind: 'Workspace' },
  { id: 'courses', title: 'Learn · browse your courses', href: '/app/subjects', kind: 'Workspace' },
  { id: 'progress', title: 'Progress · your saved learning', href: '/app/insights', kind: 'Workspace' },
  { id: 'career', title: 'Career · projects and opportunities', href: '/app/career', kind: 'Workspace' },
  { id: 'roadmap', title: 'Roadmap · the full study sequence', href: '/app/roadmap', kind: 'Workspace' },
  { id: 'review', title: 'Review · practice recall', href: '/app/review', kind: 'Workspace' },
  { id: 'settings', title: 'Settings · preferences and backups', href: '/app/settings', kind: 'Workspace' },
];
const items: LibraryResult[] = [
  ...destinations,
  ...COURSE_INDEX.map(course => ({ id: `course-${course.id}`, title: course.title, href: `/app/subjects/${course.id.toLowerCase()}`, kind: 'Course' })),
  ...LEARNING_DAYS.map(day => ({ id: day.id, title: `${day.stable_code} · ${day.title}`, href: `/app/learn/${day.phase_id}/${day.id}`, kind: 'Lesson' })),
  ...PHASES.map(phase => ({ id: phase.id, title: `${phase.phase_code} · ${phase.title}`, href: `/app/roadmap/${phase.id}`, kind: 'Phase' })),
  ...PROJECT_TEMPLATES.map(project => ({ id: project.id, title: project.name, href: `/app/projects/${project.id}`, kind: 'Project' })),
  ...RESOURCES.map(resource => ({ id: resource.id, title: `${resource.id} · ${resource.title}`, href: resource.url, kind: 'Resource', external: true })),
];
export function searchLibrary(query: string): LibraryResult[] {
  const term = query.trim().toLowerCase();
  if (!term) return destinations;
  return items.filter(item => item.title.toLowerCase().includes(term)).slice(0, 12);
}
