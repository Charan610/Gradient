import Link from 'next/link';
import {BrandMark} from '@/components/ui/BrandMark';
import {FirstProgramDemo} from '@/components/learn/FirstProgramDemo';
import {HeroDepth} from '@/components/marketing/HeroDepth';
import {MarketingNav} from '@/components/marketing/MarketingNav';
import styles from './Home.module.scss';
import {ScrollEffects} from '@/components/motion/ScrollEffects';
import {RevealWords} from '@/components/motion/RevealWords';

const questions = [
  ['Can I start without coding experience?', 'Yes. C++ Foundations begins with your first program. You’ll need a computer and a C++ compiler for the exercises. The first lesson helps you get set up.'],
  ['What is included in the guided curriculum?', 'There are 30 guided C++ lessons and 20 introductory DSA lessons in C++. They include exercises, self checks, and recall prompts. Other subjects are study outlines, and the introductory DSA course does not cover the entire Phase 2 outline.'],
  ['Does Gradient run or grade my code?', 'No. Compile and test your code in your own development environment, then compare your work with the lesson criteria. The example on this page is a prediction exercise.'],
  ['How do recall prompts work?', 'Recall prompts return as you advance through learning steps. When you’re ready, choose the next recall set yourself. The aim is to revisit ideas, not race a calendar.'],
  ['Where is my progress saved?', 'Your study progress and notes stay in this browser. Export a JSON backup in Settings to move or restore them. Automatic cloud sync is not available. A username identifies your workspace; optional password sign in depends on account services being available.'],
  ['What if a lesson takes more than one session?', 'Keep going at your own pace. Learning days advance when you complete their required activities. Your session budget helps you plan; it is not a deadline.'],
];

export default function HomePage() {
  return <div className={styles.home}>
    <a className={styles.skip} href="#main">Skip to content</a>
    <MarketingNav/>
    <main id="main" tabIndex={-1}>
      <ScrollEffects targetId="main" selector="[data-scroll-reveal],[data-scroll-word]"/>
      <section className={styles.hero} aria-labelledby="hero-heading">
        <HeroDepth/>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>C++ first. A stronger foundation next.</span>
          <h1 id="hero-heading" className={styles['heading-1']}>Learn C++.<br/>Understand the code<br/>you write.</h1>
          <p className={styles['body-3']}>Go from your first program to data structures and algorithms. One focused lesson, one exercise, one idea you can explain.</p>
          <Link href="/sign-up" className={styles.primary}>Start learning <span aria-hidden="true">↗</span></Link>
          <p className={styles.heroNote}>Begin with the basics. Move at your pace.</p>
          <div className={styles.proof} aria-label="Guided curriculum"><div><strong>30</strong><span>guided C++ lessons</span></div><div><strong>20</strong><span>guided DSA lessons</span></div></div>
        </div>
        <div className={styles.heroPreview}>
          <div className={styles.previewNote}><span className={styles.eyebrow}>A first idea, in practice</span><span>01 / 50</span></div>
          <FirstProgramDemo/>
          <p className={styles.demoCaption}><span aria-hidden="true">↳</span> Read the code. Predict the output. See why.</p>
        </div>
      </section>

      <section id="curriculum" className={styles.section} aria-labelledby="curriculum-heading">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>The learning path</span><h2 data-scroll-reveal="" id="curriculum-heading" className={styles['heading-2']}>Build from the basics.</h2></div><p>Two guided courses. A clear place to begin.<br/>More subjects to explore when you’re ready.</p></div>
        <div className={styles.courses}>
          <Link href="/app/subjects/cpp" className={styles.course}><div className={styles.courseTop}><span className={styles.eyebrow}>01 / Start here</span><span aria-hidden="true">↗</span></div><span className={styles.courseSymbol} aria-hidden="true">C++</span><h3 data-scroll-reveal="" className={styles['heading-4']}>C++ Foundations</h3><p>Start with hello, world. Learn the language through programs you can test and explain.</p><span className={styles.courseMeta}>30 guided lessons <span>View course <span aria-hidden="true">↗</span></span></span></Link>
          <Link href="/app/subjects/dsa" className={styles.course}><div className={styles.courseTop}><span className={styles.eyebrow}>02 / Keep building</span><span aria-hidden="true">↗</span></div><span className={`${styles.courseSymbol} ${styles.dsaSymbol}`} aria-hidden="true">[ → ]</span><h3 data-scroll-reveal="" className={styles['heading-4']}>Data structures &amp; algorithms</h3><p>Put C++ to work. Explore introductory DSA through exercises and recall.</p><span className={styles.courseMeta}>20 guided lessons <span>View course <span aria-hidden="true">↗</span></span></span></Link>
        </div>
        <div className={styles.roadmap}><p><span>Beyond the guided courses</span> SQL, computer science, backend engineering, and AI study outlines.</p><Link href="/explore">Explore the roadmap <span aria-hidden="true">↗</span></Link></div>
      </section>

      <section id="how-it-works" className={styles.section} aria-labelledby="approach-heading">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>A rhythm for learning</span><h2 data-scroll-reveal="" id="approach-heading" className={styles['heading-2']}>Read it. Try it. Recall it.</h2></div><p>Each learning step gives an idea somewhere to go, from understanding to practice.</p></div>
        <div className={styles.steps}>{[
          ['01', 'Understand one idea', 'Read a focused lesson and work through the example. Start with a question you can answer.'],
          ['02', 'Put it into practice', 'Write and test code in your own environment. Keep your code links and notes beside the lesson.'],
          ['03', 'Bring it back to mind', 'Return to recall prompts as you advance through learning steps. Choose the next recall set when you’re ready.'],
        ].map(([number, title, text]) => <article key={number}><span className={styles.stepNumber}>{number}</span><h3 data-scroll-reveal="" className={styles['heading-6']}>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className={styles.statement} aria-labelledby="statement-heading"><span className={styles.eyebrow}>Progress without the pressure</span><h2 id="statement-heading" className={styles['heading-2']}><RevealWords text="A little more understanding."/><br/><span><RevealWords text="A foundation you can build on." offset={4}/></span></h2><p>No streak to rescue. No missed day penalties. Finish a learning step, then move forward. Your notes and progress stay in this browser, with backup export in Settings.</p></section>

      <section id="questions" className={`${styles.section} ${styles.faqSection}`} aria-labelledby="faq-heading"><div><span className={styles.eyebrow}>Before you begin</span><h2 data-scroll-reveal="" id="faq-heading" className={styles['heading-2']}>Good questions.<br/>Clear answers.</h2><Link href="/setup/cpp" className={styles.textLink}>Set up C++ <span aria-hidden="true">↗</span></Link></div><div className={styles.faq}>{questions.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>

      <section className={styles.closing} aria-labelledby="closing-heading"><span className={styles.eyebrow}>Your first learning step</span><h2 data-scroll-reveal="" id="closing-heading" className={styles['heading-2']}>Start with one program.<br/>Give yourself room to grow.</h2><Link href="/sign-up" className={styles.primary}>Start learning <span aria-hidden="true">↗</span></Link></section>
    </main>
    <footer className={styles.footer}><Link href="/" className={styles.brand}><BrandMark/>Gradient</Link><p>One idea. Then the next.</p><nav aria-label="Footer navigation"><Link href="/explore">Roadmap</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/sign-in">Sign in</Link></nav></footer>
  </div>;
}
