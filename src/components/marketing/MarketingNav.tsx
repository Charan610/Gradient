'use client';

import Link from 'next/link';
import {useEffect, useRef, useState} from 'react';
import {BrandMark} from '@/components/ui/BrandMark';
import styles from '@/app/Home.module.scss';

const links = [['#curriculum', 'Curriculum'], ['#how-it-works', 'The approach'], ['#questions', 'FAQ']] as const;

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
      if (event.key === 'Tab') {
        const items = [toggle.current, ...Array.from(panel.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [])].filter(Boolean) as HTMLElement[];
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    const desktop = window.matchMedia('(min-width: 761px)');
    const onDesktop = () => { if (desktop.matches) { setOpen(false); toggle.current?.closest('header')?.querySelector('a')?.focus(); } };
    desktop.addEventListener('change', onDesktop);
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKey); desktop.removeEventListener('change', onDesktop); };
  }, [open]);

  const close = () => { setOpen(false); toggle.current?.focus(); };
  return <header className={styles.nav}>
    <Link href="/" aria-label="Gradient home" aria-current="page" className={styles.brand}><BrandMark/>Gradient</Link>
    <nav className={styles.desktopNav} aria-label="Main navigation">{links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}</nav>
    <Link href="/sign-in" className={styles.signin}>Sign in <span aria-hidden="true">↗</span></Link>
    <button ref={toggle} className={styles.menuToggle} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(!open)} data-open={open}><span/><span/><span/></button>
    {open && <nav ref={panel} id="mobile-navigation" aria-label="Mobile navigation" className={styles.mobileNav}>{links.map(([href, label]) => <a key={href} href={href} onClick={close}>{label}<span aria-hidden="true">↗</span></a>)}<Link href="/sign-in" onClick={close}>Sign in<span aria-hidden="true">↗</span></Link></nav>}
  </header>;
}
