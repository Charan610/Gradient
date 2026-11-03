import { describe, expect, it } from 'vitest';
import { buildFeedbackUrl } from '../src/lib/support/feedback';

describe('GitHub feedback review link', () => {
  it('encodes only a title and body with safe route context at the verified destination', () => {
    const href = buildFeedbackUrl('/app/settings');
    const url = new URL(href);

    expect(`${url.origin}${url.pathname}`).toBe('https://github.com/Charan610/Gradient/issues/new');
    expect([...url.searchParams.keys()].sort()).toEqual(['body', 'title']);
    expect(url.searchParams.get('title')).toBe('Issue on /app/settings');
    expect(url.searchParams.get('body')).toBe('Route: /app/settings');
    expect(href).toContain('title=Issue+on+%2Fapp%2Fsettings');
    expect(url.hash).toBe('');
  });

  it('drops queries and fragments containing private workspace context', () => {
    const href = buildFeedbackUrl('/app/settings?alias=Alice&notes=private&application=Acme&token=secret#alice@example.com');

    expect(new URL(href).searchParams.get('body')).toBe('Route: /app/settings');
    for (const privateValue of ['Alice', 'private', 'Acme', 'secret', 'alice', 'alias', 'notes', 'application', 'token']) {
      expect(decodeURIComponent(href)).not.toContain(privateValue);
    }
  });

  it.each([
    ['/app/subjects/alice-personal-topic', '/app/subjects/[subjectId]'],
    ['/app/projects/private-application', '/app/projects/[projectId]'],
    ['/app/roadmap/private-name', '/app/roadmap/[phaseId]'],
    ['/app/learn/P0/P0-D06?notes=private#secret', '/app/learn/[phaseId]/[dayId]'],
  ])('replaces dynamic values in %s with route placeholders', (input, route) => {
    const url = new URL(buildFeedbackUrl(input));

    expect(url.searchParams.get('title')).toBe(`Issue on ${route}`);
    expect(url.searchParams.get('body')).toBe(`Route: ${route}`);
    expect(url.searchParams.size).toBe(2);
  });

  it.each([
    undefined, '', 'app/settings', 'https://example.com/app/settings?token=secret',
    '//example.com/app/settings', 'javascript:alert(1)', '/\\example.com/app/settings',
    '/app/../app/settings', '/app/%2e%2e/settings', '/app/settings\n',
    '/app/settings/extra/private-name', '/alice@example.com', '/app/unknown-private-alias',
    '/app/subjects/%61lice', '/api/account',
  ])('uses a safe fallback for invalid, external, or unknown path %s', (input) => {
    const url = new URL(buildFeedbackUrl(input));

    expect(url.searchParams.get('title')).toBe('Issue on Unknown route');
    expect(url.searchParams.get('body')).toBe('Route: Unknown route');
    expect(url.origin).toBe('https://github.com');
    expect(url.pathname).toBe('/Charan610/Gradient/issues/new');
    expect(url.searchParams.size).toBe(2);
  });

  it.each(['/', '/explore', '/setup/cpp', '/app/today', '/app/career/applications'])('preserves known static route %s', (route) => {
    expect(new URL(buildFeedbackUrl(route)).searchParams.get('body')).toBe(`Route: ${route}`);
  });

  it('normalizes a trailing slash without leaking a fragment', () => {
    expect(new URL(buildFeedbackUrl('/app/settings/#private')).searchParams.get('body')).toBe('Route: /app/settings');
  });
});
