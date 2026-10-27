import type { Metadata, Viewport } from 'next';
import { AccountProvider } from '@/components/account/AccountProvider';
import { ThemeProvider } from '@/components/context/ThemeContext';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'GRADIENT — Day-Based Career Preparation Operating System',
  description:
    'Build your C++ foundations with 30 guided lessons, focused practice, and spaced recall. Self-paced learning with browser-local progress and JSON backups. Choose a username. Password optional.',
  keywords: [
    'Career Roadmap',
    'SDE Preparation',
    'DSA in C++',
    'Backend Engineering',
    'FastAPI',
    'PostgreSQL',
    'Interview Readiness',
    'Spaced Repetition'
  ]
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F7F4EF' },
    { media: '(prefers-color-scheme: dark)', color: '#1B1816' }
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body>
        <ThemeProvider><AccountProvider>{children}</AccountProvider></ThemeProvider>
      </body>
    </html>
  );
}
