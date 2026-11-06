import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const site = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
  // Only public, evergreen pages. Workspace and account URLs stay out.
  return ['/', '/explore', '/setup/cpp', '/privacy', '/terms', '/contact'].map(path => ({
    url: new URL(path, site).href
  }));
}
