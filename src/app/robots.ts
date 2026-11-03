import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const site = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
  return {
    // Pages with noindex must remain crawlable so crawlers can read that directive.
    rules: { userAgent: '*', allow: '/', disallow: ['/api', '/auth'] },
    sitemap: new URL('/sitemap.xml', site).href
  };
}
