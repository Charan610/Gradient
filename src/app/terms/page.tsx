import type { Metadata } from 'next';
import Link from 'next/link';
import { BrandMark } from '@/components/ui/BrandMark';
import styles from './Terms.module.scss';

export const metadata: Metadata = {
  title: 'Terms of use', description: 'Simple terms for using Gradient lessons, your account, and browser-local study tools.',
  alternates: { canonical: '/terms' }
};
const sections = [
  ['Use Gradient to learn', 'Gradient offers guided C++ and data structures lessons, practice tasks, and study tools. Lessons support your own practice and judgment. They do not guarantee a grade, qualification, interview, placement, or job. Check code and explanations before relying on them.'],
  ['Look after your access and records', 'Keep your account credentials private. A password is optional, and password-free access depends on the current browser session. Email password recovery is not available. Study records stay in this browser and do not automatically sync across devices. Export backups regularly and keep downloaded files secure.'],
  ['Use the service respectfully', 'Do not attempt to access another person’s account, interfere with the service, or misuse its account endpoints. Only import backups you trust and are entitled to use.'],
  ['Availability and linked resources', 'Features and lesson content may change, and the service may be interrupted. Keep a separate copy of work you need. External learning resources are run by their respective providers and have their own terms.'],
  ['Privacy and reset controls', 'The privacy page explains account storage, cookies, local study records, and backups. Resetting a browser workspace does not delete the associated account or downloaded backups.']
];
export default function TermsPage() {
  return <div className={styles.page}>
    <header className={styles.header}><Link className={styles.brand} href="/" aria-label="Gradient home"><BrandMark />Gradient</Link><Link href="/">Back home</Link></header>
    <main className={styles.main}><p className={styles.caption}>Using Gradient · Updated 3 November 2026</p><h1>Terms of use.</h1><p>A few practical expectations for this learning space and the records you keep here.</p>{sections.map(([title, body]) => <section className={styles.panel} key={title}><h2>{title}</h2><p>{body}</p></section>)}</main>
    <footer className={styles.footer}><Link href="/">Gradient home</Link><Link href="/privacy">Privacy</Link></footer>
  </div>;
}
