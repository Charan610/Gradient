 'use client';
import {useId,useState} from 'react';
import {Check,ArrowRight} from 'lucide-react';
import styles from './FirstProgramDemo.module.scss';
export function FirstProgramDemo() {
 const radioName=useId();
 const [choice,setChoice]=useState(''); const [checked,setChecked]=useState(false);
 return <section className={styles.demo} aria-label="Try a C++ prediction"><div className={styles.bar}><span>hello.cpp</span><span>C++ · A FIRST LOOK</span></div><pre><code><span>#include &lt;iostream&gt;</span>{'\n\n'}int main() {'{'}{'\n'}  std::cout &lt;&lt; <b>"Hello, world!"</b>;{'\n'}  return 0;{'\n'}{'}'}</code></pre><form onSubmit={e=>{e.preventDefault();if(choice)setChecked(true);}}><fieldset><legend>What will appear on screen?</legend>{['Hello, world!','0','Nothing yet'].map(answer=><label key={answer} data-selected={choice===answer}><input type="radio" name={radioName} value={answer} checked={choice===answer} onChange={()=>{setChoice(answer);setChecked(false);}}/>{answer}</label>)}</fieldset><button className="buttonSecondary" disabled={!choice}>Check my prediction <ArrowRight size={14} aria-hidden="true"/></button><div className={styles.feedback} role="status" aria-live="polite" aria-atomic="true">{checked&&(choice==='Hello, world!'?<p><Check size={15} aria-hidden="true"/>Exactly. <code>std::cout</code> displays the message. Your first idea, understood.</p>:<p>Look at the text inside the quotes. <code>std::cout</code> prints that message; <code>return 0</code> reports that the program finished.</p>)}</div><small>A prediction exercise. This example does not run or save code.</small></form></section>;
}
