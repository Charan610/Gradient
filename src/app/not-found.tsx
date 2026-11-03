import Link from 'next/link';
import { BrandMark } from '@/components/ui/BrandMark';
import styles from './not-found.module.scss';

export default function NotFound() {
  return <div className={styles.page}>
    <header className={styles.header}><Link className={styles.brand} href="/" aria-label="Gradient home"><BrandMark />Gradient</Link></header>
    <main className={styles.main}><p className={styles.caption}>404 · Page not found</p><h1>A small detour.</h1><p>This page may have moved, or the address may be incomplete. You can return home and choose your next step.</p><Link className="buttonPrimary" href="/">Back to Gradient</Link></main>
    <footer className={styles.footer}><Link href="/setup/cpp">C++ setup guide</Link><Link href="/privacy">Privacy</Link></footer>
  </div>;
}
