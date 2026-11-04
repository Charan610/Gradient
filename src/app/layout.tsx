import type { Metadata, Viewport } from 'next';
import { AccountProvider } from '@/components/account/AccountProvider';
import { ThemeProvider } from '@/components/context/ThemeContext';
import '@/styles/globals.scss';

// Required in production: set NEXT_PUBLIC_SITE_URL to the public canonical origin.
// Local development falls back to localhost; never infer a production domain.
const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: 'Gradient — 136 guided engineering lessons', template: '%s | Gradient' },
  description: 'Learn C++, algorithms, SQL, systems, backend engineering, and applied AI through 136 guided lessons, small practice tasks, and spaced recall. Study at your pace with browser-local notes and JSON backups.',
  applicationName: 'Gradient',
  alternates: { canonical: './' },
  keywords: ['C++ lessons', 'data structures and algorithms', 'guided practice', 'spaced recall'],
  robots: { index: true, follow: true },
  icons: { icon: [{ url: '/favicon.ico', sizes: '32x32' }, { url: '/icon.svg', type: 'image/svg+xml' }], apple: '/apple-icon.png' },
  openGraph: {
    type: 'website', siteName: 'Gradient', locale: 'en_US',
    title: 'Gradient — 136 guided engineering lessons',
    description: 'A calm place to learn C++, practise data structures, and return to what you learned.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Gradient — 136 guided engineering lessons' }]
  },
  twitter: {
    card: 'summary_large_image', title: 'Gradient — 136 guided engineering lessons',
    description: 'Small practice tasks, spaced recall, and notes that stay in your browser.',
    images: ['/twitter-image']
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF7F0' },
    { media: '(prefers-color-scheme: dark)', color: '#181818' }
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider><AccountProvider>{children}</AccountProvider></ThemeProvider>
      </body>
    </html>
  );
}
