/** Opening this URL only prepares an issue for review on GitHub; it submits nothing. */
export const FEEDBACK_LINK_LABEL = 'Report an issue on GitHub';
export const FEEDBACK_REVIEW_NOTICE = 'Review before submitting on GitHub. Submitted issues are public.';

const ISSUE_REVIEW_URL = 'https://github.com/Charan610/Gradient/issues/new';

// Never echo arbitrary path segments: they may contain aliases or other private data.
const STATIC_ROUTES = new Set([
  '/', '/contact', '/explore', '/setup/cpp', '/sign-in', '/sign-up', '/privacy', '/terms',
  '/app/today', '/app/review', '/app/subjects', '/app/resources', '/app/projects',
  '/app/roadmap', '/app/career', '/app/career/applications',
  '/app/career/internships', '/app/career/placements', '/app/settings', '/app/insights',
]);

function safeRouteContext(pathname: string | undefined): string {
  if (typeof pathname !== 'string') return 'Unknown route';

  const path = pathname.split(/[?#]/, 1)[0];
  if (!/^\/[A-Za-z0-9/_-]*$/.test(path) || path.includes('//')) return 'Unknown route';
  const route = path === '/' ? path : path.replace(/\/$/, '');
  if (STATIC_ROUTES.has(route)) return route;

  if (/^\/app\/subjects\/[^/]+$/.test(route)) return '/app/subjects/[subjectId]';
  if (/^\/app\/projects\/[^/]+$/.test(route)) return '/app/projects/[projectId]';
  if (/^\/app\/roadmap\/[^/]+$/.test(route)) return '/app/roadmap/[phaseId]';
  if (/^\/app\/learn\/[^/]+\/[^/]+$/.test(route)) return '/app/learn/[phaseId]/[dayId]';
  return 'Unknown route';
}

/** Accept only route context, never account details, notes, applications, or page data. */
export function buildFeedbackUrl(pathname?: string): string {
  const route = safeRouteContext(pathname);
  const url = new URL(ISSUE_REVIEW_URL);
  url.searchParams.set('title', `Issue on ${route}`);
  url.searchParams.set('body', `Route: ${route}`);
  return url.toString();
}
