import Link from 'next/link';
import { ArrowRight, Briefcase, FileText, GraduationCap } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import styles from '@/components/journey/Journey.module.scss';

export default function CareerPage() {
  return <AppShell><div className={styles.page}>
    <header className={styles.heading}><span>FROM PRACTICE TO OPPORTUNITY</span><h1>Build skills you can show.</h1><p>Your learning connects to real work through projects, clear explanations, and thoughtful applications. Start with the step that fits where you are.</p></header>
    <section className={styles.feature}><span className="phaseBadge">START WITH EVIDENCE</span><h2>Make something you can explain.</h2><p>A small, tested project gives you something concrete to discuss. Keep your implementation notes, tradeoffs, and lessons learned together.</p><Link className="buttonPrimary" href="/app/projects">Explore your projects <ArrowRight size={16} /></Link></section>
    <div className={styles.grid}>{[
      { icon: GraduationCap, title: 'Explore internships', text: 'Understand eligibility, readiness, and where to look for opportunities while you study.', href: '/app/career/internships', action: 'Internship guide' },
      { icon: FileText, title: 'Prepare for placements', text: 'Bring together problem solving, core CS, project discussions, and interview practice.', href: '/app/career/placements', action: 'Placement guide' },
      { icon: Briefcase, title: 'Organize your applications', text: 'Keep track of roles, applications, assessments, and interviews in one place.', href: '/app/career/applications', action: 'Open application tracker' },
    ].map(({ icon: Icon, title, text, href, action }) => <section className={styles.card} key={href}><Icon size={23} aria-hidden="true" /><h2>{title}</h2><p>{text}</p><Link href={href}>{action} <ArrowRight size={15} /></Link></section>)}</div>
    <p className={styles.note}>Readiness checks are self-assessed. Always confirm eligibility on the employer’s official listing.</p>
  </div></AppShell>;
}
