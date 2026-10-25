import Link from 'next/link';
import { ArrowDown, ArrowUpRight, BookOpen, Check, Command, Layers, LockKeyhole, RotateCcw, Terminal } from 'lucide-react';
import { ScrollReveal } from '@/components/studio/ScrollReveal';
import { LearningStudio } from '@/components/studio/LearningStudio';
import { LEARNING_DAYS } from '@/lib/db/curriculum-data';
import styles from './Home.module.scss';

export default function HomePage() {
  return (
    <div className={styles.home}>
      <a className={styles.skip} href="#main">Skip to content</a>
      <header className={styles.nav}>
        <Link href="/" className={styles.brand}><span>G<span className={styles.brandDot}>.</span></span><strong>Gradient</strong></Link>
        <nav aria-label="Main navigation"><a href="#features">Features</a><a href="#studio">Inside the workspace</a><a href="#questions">Questions</a></nav>
        <Link href="/app/today" className={styles.navAction}>Open workspace <ArrowUpRight size={15} /></Link>
      </header>
      <main id="main">
        <section className={styles.hero}>
          <div className={styles.heroLabel}><span /> YOUR PERSONAL LEARNING SPACE</div>
          <h1>A little direction.<br />A lot of <em>possibility.</em></h1>
          <p>The next lesson. A place to focus. Proof of what you built.<br className={styles.desktopBreak} /> Bring your learning together, one small step at a time.</p>
          <div className={styles.heroActions}><Link href="/sign-up" className={styles.cta}>Build my study routine <ArrowUpRight size={16} /></Link><a href="#studio" className={styles.quietLink}>Try the workspace <ArrowDown size={15} /></a></div>
          <div className={styles.heroFacts}><span><Check size={13} />30 guided C++ lessons</span><span><Check size={13} />No account needed</span><span><Check size={13} />Your own pace</span></div>
          <div className={styles.heroWindow}>
            <div className={styles.windowBar}><span><i /><i /><i /></span><span>gradient / your next step</span><Command size={13} /></div>
            <div className={styles.windowContent}>
              <div className={styles.windowIntro}><span className={styles.label}>THE FIRST OF MANY SMALL WINS</span><h2>Hello, world.<br /><span>Hello, possibility.</span></h2><p>Your first program doesn’t need to be impressive. It needs to run. Start there.</p><Link href="/app/learn/P0/P0-D01">Explore lesson 01 <ArrowUpRight size={15} /></Link></div>
              <div className={styles.codeCard}><div><Terminal size={14} /><span>hello.cpp</span><span>C++</span></div><pre><code><span>#include &lt;iostream&gt;</span>{'\n\n'}int main() {'{'}{'\n'}  std::cout &lt;&lt; <b>"Hello, world!"</b>;{'\n'}  return 0;{'\n'}{'}'}</code></pre><div className={styles.terminal}><span>OUTPUT</span><p>Hello, world!</p><span><Check size={12} /> Illustrative example</span></div></div>
            </div>
          </div>
        </section>

        <section id="features" className={styles.section}>
          <div className={styles.sectionIntro}><span className={styles.label}>01 / BUILT AROUND YOUR LEARNING</span><h2>Everything you need to begin.<br /><span>Room to find your rhythm.</span></h2><p>Less collecting resources. More putting ideas into practice. A workspace that gives each part of learning its own place.</p></div>
          <ScrollReveal><div className={styles.features}>
            <Link href="/app/subjects" className={styles.feature}><BookOpen size={20} /><h3>A path, not another playlist.</h3><p>Thirty ordered lessons with an exercise, a check, and a clear next step.</p><div className={styles.miniList}>{['Understand the idea', 'Build something small', 'Explain what changed'].map((text,index)=><div key={text}><span>0{index+1}</span>{text}<Chevron /></div>)}</div><span className={styles.featureLink}>Browse the course <ArrowUpRight size={15} /></span></Link>
            <Link href="/app/review" className={styles.feature}><RotateCcw size={20} /><h3>Make it stick.</h3><p>Recall prompts bring concepts back after completed study days. Practice retrieving, not just rereading.</p><div className={styles.recallVisual}><span>READ → RECALL → REVISIT</span><strong>“Could I explain this<br />without my notes?”</strong><div>{[1,3,7,21,45].map(n=><span key={n}>+{n}</span>)}</div></div><span className={styles.featureLink}>Open review queue <ArrowUpRight size={15} /></span></Link>
            <Link href="/app/projects" className={styles.feature}><Layers size={20} /><h3>Keep something to show.</h3><p>Save notes, code links, and project milestones. Make the work visible to your future self.</p><div className={styles.evidenceVisual}><div><Terminal size={14} /><span>YOUR WORK, COLLECTED</span></div><span>Code & build notes</span><span>Checks & edge cases</span><span>What I would improve</span></div><span className={styles.featureLink}>Explore projects <ArrowUpRight size={15} /></span></Link>
          </div></ScrollReveal>
        </section>

        <section id="studio" className={styles.section}>
          <div className={styles.sectionIntro}><span className={styles.label}>02 / TOUCH THE CONTROLS</span><h2>This is your space.<br /><span>Make yourself at home.</span></h2><p>Set a focus window. Test a concept. Look inside a lesson. These tools work right here—try the tabs and move the slider.</p></div>
          <ScrollReveal><LearningStudio day={LEARNING_DAYS[0]} preview /></ScrollReveal>
          <p className={styles.caption}>A live preview of Day 01. Practicing here won’t change your saved study progress.</p>
        </section>

        <section className={`${styles.section} ${styles.ownership}`}><div><span className={styles.label}>03 / YOUR PROGRESS BELONGS TO YOU</span><h2>Pick up where<br />you left off.</h2><p>Your study records stay in this browser. Export a backup and restore it on another device or website address. No account required.</p><Link href="/app/settings" className={styles.quietLink}>Manage your data <ArrowUpRight size={16} /></Link></div><div className={styles.backupCard}><LockKeyhole size={22} /><span className={styles.label}>A WORKSPACE YOU OWN</span><h3>Keep the work.<br /><span>Carry it forward.</span></h3><div><span>Task evidence</span><Check size={14} /></div><div><span>Study notes & reviews</span><Check size={14} /></div><div><span>Project milestones</span><Check size={14} /></div><p>Saved locally · Transfer by JSON backup</p></div></section>

        <section id="questions" className={styles.section}><div className={styles.sectionIntro}><span className={styles.label}>04 / BEFORE YOU BEGIN</span><h2>A few things to know.</h2></div><div className={styles.faq}>{[
          ['Do I need to create an account?', 'No. Set your name and study preferences, then start. This version saves progress locally in your browser.'],
          ['Is the entire roadmap a guided course?', 'C++ foundations has 30 guided daily lessons. DSA, SQL, CS core, backend, and AI currently offer self-directed outlines, practice checkpoints, and references.'],
          ['What happens if I miss a day?', 'Nothing falls behind. Learning days advance when you complete them, not when the calendar changes. Resume at your next step.'],
          ['Does Gradient check my code automatically?', 'No. Exercises include checks and evidence prompts for self-assessment. Compile and test your work, then compare it with the lesson criteria.'],
          ['Will my progress appear on another computer?', 'Use Settings to export a backup, then restore it in the other browser. Automatic cloud sync is not available.'],
        ].map(([question, answer])=><details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>
        <section className={styles.closing}><span className={styles.label}>THE NEXT STEP IS SMALL.</span><h2>Start with today.</h2><Link href="/app/today" className={styles.cta}>Enter your workspace <ArrowUpRight size={16} /></Link></section>
      </main>
      <footer className={styles.footer}><Link href="/" className={styles.brand}><strong>Gradient<span className={styles.brandDot}>.</span></strong></Link><p>Your personal study workspace.</p><div><Link href="/app/subjects">Courses</Link><Link href="/explore">Roadmap</Link><Link href="/privacy">Privacy</Link></div></footer>
    </div>
  );
}
function Chevron() { return <ArrowUpRight size={12} aria-hidden="true" />; }
