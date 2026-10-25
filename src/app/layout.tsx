import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '@/components/context/ThemeContext';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'GRADIENT — Day-Based Career Preparation Operating System',
  description:
    'A personal study operating system for ambitious undergraduate software engineers. Ordered learning days, concrete practice, local progress storage, spaced repetition, and placement tracking without arbitrary calendar anxiety.',
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
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F5F4EE' },
    { media: '(prefers-color-scheme: dark)', color: '#151B17' }
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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
