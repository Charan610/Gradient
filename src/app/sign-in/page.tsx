import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, HardDrive } from 'lucide-react';

export default function SignInPage() {
  return <main className="workspaceEntry">
    <Link href="/" className="buttonTertiary"><ArrowLeft size={14} /> Home</Link>
    <section className="workspaceEntryCard">
      <HardDrive size={24} />
      <h1>Welcome back.</h1>
      <p>Your study workspace is saved in this browser. Pick up where you left off, at your own pace.</p>
      <Link href="/app/today" className="buttonPrimary">Continue studying <ArrowUpRight size={16} /></Link>
      <Link href="/sign-up" className="buttonSecondary">Set up your study preferences</Link>
      <p className="workspaceEntryNote">No account or password is needed. Progress does not sync across devices. Export a backup from Settings before clearing browser data.</p>
    </section>
  </main>;
}
