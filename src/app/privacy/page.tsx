import type { Metadata } from 'next';
import Link from 'next/link';
import { BrandMark } from '@/components/ui/BrandMark';
import styles from './Privacy.module.scss';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'How Gradient handles account identity, sign-in cookies, browser-local study records, and optional cloud backups.',
  alternates: { canonical: '/privacy' }
};

const sections = [
  ['Your account and sign-in cookies', 'When you create an account, Supabase stores your username, sign-in identity, and account preferences such as semester and daily study time. Optional passwords are handled by Supabase Auth. Sign-in uses HttpOnly session cookies. Password-free access depends on this browser session; adding a password lets you sign in elsewhere. Email password recovery is not available.'],
  ['Your study records start in this browser', 'Study progress, lesson notes, evidence, reviews, project notes, and application records are stored locally in your browser, separated by account. They do not automatically sync to Supabase or another device. Nothing is uploaded as a study backup unless you choose Save cloud copy in Settings. These local records are not encrypted. Someone with access to your browser profile may be able to read them. Theme preferences also use browser storage.'],
  ['Saved interests are not subscriptions', 'Saving a course outline records an interest locally on this device. It does not subscribe you to email, push messages, or release notifications.'],
  ['Local and optional cloud backups', 'Settings lets you export local study records as a JSON file and import a compatible backup. A backup can contain personal notes and application records. Keep it somewhere you trust. When cloud backups are configured, signed-in users can manually save up to ten private copies, 3 MB each, in Supabase. Account ownership rules restrict access; these copies are not end-to-end encrypted, and service administrators can access them. A cloud copy remains until you delete it or the account is deleted. Download a cloud copy and use the existing restore preview to move it to another browser; signing in alone never replaces local work. Clearing browser data can make local records unavailable.'],
  ['Resetting a workspace is not deleting an account', 'The reset control in Settings resets study data in this browser workspace. It does not delete your Supabase account, sign-in identity, account preferences, downloaded files, or cloud copies. Delete cloud copies separately in the optional cloud backup controls. The app currently has no account deletion control. Export the records you want to keep before resetting. Signing out is also separate from deleting an account.'],
  ['Requests to services', 'The hosting service receives requests when you open Gradient. Account actions and optional cloud backup operations send data to Supabase; the account gateway derives a keyed identifier from the request IP address for abuse protection. The GitHub feedback link opens an issue draft containing only a sanitized page route. You review and submit it yourself; submitted issues are public, so leave private notes and account details out. Opening external resources sends you to those providers, whose privacy practices apply. This page does not promise that hosting providers keep no operational logs.']
];

export default function PrivacyPage() {
  return <div className={styles.page}>
    <header className={styles.header}><Link className={styles.brand} href="/" aria-label="Gradient home"><BrandMark />Gradient</Link><Link href="/">Back home</Link></header>
    <main className={styles.main}>
      <p className={styles.caption}>Your data, explained · Updated 3 November 2026</p>
      <h1>Privacy, in plain language.</h1>
      <p>Your account helps you sign in. Study notes stay in this browser unless you choose to export or upload a backup. Here is what that means in practice.</p>
      {sections.map(([title, body]) => <section className={styles.panel} key={title}><h2>{title}</h2><p>{body}</p></section>)}
    </main>
    <footer className={styles.footer}><Link href="/">Gradient home</Link><Link href="/terms">Terms of use</Link><Link href="/app/settings">Data and backup settings</Link></footer>
  </div>;
}
