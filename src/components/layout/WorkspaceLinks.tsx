'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WORKSPACE_LINKS, workspaceGroup } from './workspace-navigation';
import styles from './WorkspaceLinks.module.scss';

export function WorkspaceLinks() {
  const pathname = usePathname();
  const group = workspaceGroup(pathname);
  if (group === 'home' || group === 'profile') return null;
  return <nav className={styles.links} aria-label={`${group} navigation`}>
    {WORKSPACE_LINKS[group].map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? 'page' : undefined}>{link.label}</Link>)}
  </nav>;
}
