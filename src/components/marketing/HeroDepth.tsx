'use client';

import {useEffect, useRef} from 'react';
import styles from './HeroDepth.module.scss';

const cards = [
  {label:'01 / C++', symbol:'{ }', lines:['int main() {', '  return 0;', '}']},
  {label:'02 / STRUCTURES', symbol:'[ → ]', lines:['vector<int> ideas;', 'ideas.push_back(1);']},
  {label:'03 / UNDERSTAND', symbol:'</>', lines:['read();', 'try_it();', 'explain();']},
];

/** Decorative DOM layers: one coalesced frame loop, asleep when settled or offscreen. */
export function HeroDepth() {
  const scene = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = scene.current;
    const hero = root?.parentElement;
    if (!root || !hero) return;
    const layers = Array.from(root.children) as HTMLElement[];
    const media = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    let stop = () => {};
    const configure = () => {
      stop();
      if (!media.matches) return;
      let frame = 0, previous = 0, visible = true;
      let x = 0, y = 0, scroll = 0, targetX = 0, targetY = 0, targetScroll = 0;
      let pointer: {x:number;y:number}|null = null;
      const tick = (time:number) => {
        frame = 0;
        if (!visible || document.hidden) { previous = 0; return; }
        const bounds = hero.getBoundingClientRect();
        targetX = pointer ? Math.max(-1, Math.min(1, (pointer.x - bounds.left) / bounds.width * 2 - 1)) : 0;
        targetY = pointer ? Math.max(-1, Math.min(1, (pointer.y - bounds.top) / bounds.height * 2 - 1)) : 0;
        targetScroll = Math.max(-1, Math.min(1, -bounds.top / bounds.height));
        const blend = 1 - Math.exp(-Math.min(previous ? time - previous : 16, 64) / 130);
        previous = time;
        x += (targetX - x) * blend; y += (targetY - y) * blend; scroll += (targetScroll - scroll) * blend;
        layers.forEach((layer,index) => {
          const depth = index + 1;
          layer.style.transform = `translate3d(${(x * depth * 5).toFixed(2)}px,${(y * depth * 4 - scroll * depth * 9).toFixed(2)}px,0) rotateX(${(-y * 3).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg) rotateZ(${[-12,10,-6][index]}deg)`;
        });
        if (Math.abs(x-targetX)+Math.abs(y-targetY)+Math.abs(scroll-targetScroll) > .002) frame = requestAnimationFrame(tick);
        else previous = 0;
      };
      const queue = () => { if (!frame && visible && !document.hidden) frame = requestAnimationFrame(tick); };
      const move = (event:PointerEvent) => { if(event.pointerType!=='mouse') return; pointer={x:event.clientX,y:event.clientY}; queue(); };
      const leave = () => { pointer=null; queue(); };
      const observer = new IntersectionObserver(([entry]) => { visible=entry.isIntersecting; if(visible) queue(); else {cancelAnimationFrame(frame);frame=0;previous=0;} });
      observer.observe(hero);
      hero.addEventListener('pointermove',move,{passive:true});
      hero.addEventListener('pointerleave',leave);
      window.addEventListener('scroll',queue,{passive:true});
      document.addEventListener('visibilitychange',queue);
      queue();
      stop = () => {
        cancelAnimationFrame(frame); observer.disconnect();
        hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',leave);
        window.removeEventListener('scroll',queue);document.removeEventListener('visibilitychange',queue);
        layers.forEach(layer=>layer.style.removeProperty('transform'));
      };
    };
    configure();media.addEventListener('change',configure);
    return () => {stop();media.removeEventListener('change',configure);};
  },[]);

  return <div ref={scene} className={styles.scene} aria-hidden="true">{cards.map((card,index)=><div className={`${styles.card} ${styles[`card${index}`]}`} key={card.label}><span className={styles.label}>{card.label}<i/><i/><i/></span><span className={styles.symbol}>{card.symbol}</span><span className={styles.code}>{card.lines.map((line,i)=><span key={i}>{line}</span>)}</span></div>)}</div>;
}
