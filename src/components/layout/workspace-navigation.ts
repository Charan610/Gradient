export const WORKSPACE_NAV = [
  { label: 'Home', href: '/app/today', group: 'home' },
  { label: 'Learn', href: '/app/subjects', group: 'learn' },
  { label: 'Practice', href: '/app/review', group: 'practice' },
  { label: 'Build', href: '/app/projects', group: 'build' },
  { label: 'Career', href: '/app/career', group: 'career' },
] as const;

export function workspaceGroup(path: string) {
  if (path.startsWith('/app/career')) return 'career';
  if (path.startsWith('/app/review')) return 'practice';
  if (path.startsWith('/app/projects')) return 'build';
  if (path.startsWith('/app/insights')) return 'progress';
  if (['/app/subjects', '/app/learn', '/app/roadmap', '/app/resources'].some(route => path.startsWith(route))) return 'learn';
  return path.startsWith('/app/settings') ? 'profile' : 'home';
}

export const WORKSPACE_LINKS = {
  learn: [
    { label: 'Courses', href: '/app/subjects' },
    { label: 'Resume lesson', href: '/app/learn' },
    { label: 'Full roadmap', href: '/app/roadmap' },
    { label: 'Resources', href: '/app/resources' },
  ],
  practice: [
    { label: 'Practice recall', href: '/app/review' },
    { label: 'Progress overview', href: '/app/insights' },
  ],
  build: [
    { label: 'Project library', href: '/app/projects' },
    { label: 'Full roadmap', href: '/app/roadmap' },
  ],
  progress: [
    { label: 'Overview', href: '/app/insights' },
    { label: 'Profile & settings', href: '/app/settings' },
    { label: 'Practice recall', href: '/app/review' },
  ],
  career: [
    { label: 'Career guide', href: '/app/career' },
    { label: 'Internships', href: '/app/career/internships' },
    { label: 'Placements', href: '/app/career/placements' },
    { label: 'Applications', href: '/app/career/applications' },
  ],
};
