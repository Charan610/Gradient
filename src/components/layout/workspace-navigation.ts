export const WORKSPACE_NAV = [
  { label: 'Home', href: '/app/today', group: 'home' },
  { label: 'Learn', href: '/app/subjects', group: 'learn' },
  { label: 'Progress', href: '/app/insights', group: 'progress' },
  { label: 'Career', href: '/app/career', group: 'career' },
] as const;

export function workspaceGroup(path: string) {
  if (path.startsWith('/app/career')) return 'career';
  if (path.startsWith('/app/insights') || path.startsWith('/app/review')) return 'progress';
  if (['/app/subjects', '/app/learn', '/app/roadmap', '/app/resources', '/app/projects'].some(route => path.startsWith(route))) return 'learn';
  return path.startsWith('/app/settings') ? 'profile' : 'home';
}

export const WORKSPACE_LINKS = {
  learn: [
    { label: 'Courses', href: '/app/subjects' },
    { label: 'Full roadmap', href: '/app/roadmap' },
    { label: 'Resources', href: '/app/resources' },
    { label: 'Projects', href: '/app/projects' },
  ],
  progress: [
    { label: 'Overview', href: '/app/insights' },
    { label: 'Practice recall', href: '/app/review' },
  ],
  career: [
    { label: 'Career guide', href: '/app/career' },
    { label: 'Internships', href: '/app/career/internships' },
    { label: 'Placements', href: '/app/career/placements' },
    { label: 'Applications', href: '/app/career/applications' },
  ],
};
