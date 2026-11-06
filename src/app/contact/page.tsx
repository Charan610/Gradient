import type { Metadata } from 'next';
import Link from 'next/link';
import { BrandMark } from '@/components/ui/BrandMark';
import { buildFeedbackUrl, FEEDBACK_LINK_LABEL, FEEDBACK_REVIEW_NOTICE } from '@/lib/support/feedback';
import styles from '../privacy/Privacy.module.scss';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Find Gradient setup and account help, or report an issue.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return <div className={styles.page}>
    <header className={styles.header}>
      <Link href="/" className={styles.brand} aria-label="Gradient home"><BrandMark />Gradient</Link>
      <Link href="/">Back home</Link>
    </header>
    <main className={styles.main}>
      <h1>Contact and support</h1>
      <p>Find help getting started, or let us know what isn’t working.</p>
      <section className={styles.panel}>
        <h2>Report a bug or suggest an improvement</h2>
        <p>{FEEDBACK_REVIEW_NOTICE} Leave out account details and private notes.</p>
        <a className="buttonTertiary" href={buildFeedbackUrl('/contact')} target="_blank" rel="noopener noreferrer">{FEEDBACK_LINK_LABEL}</a>
      </section>
      <section className={styles.panel}>
        <h2>Help with your workspace</h2>
        <p>Visit <Link className="buttonTertiary" href="/setup/cpp">C++ setup</Link> for compiler help or <Link className="buttonTertiary" href="/app/settings">Settings and backups</Link> for your saved work.</p>
      </section>
    </main>
  </div>;
}
