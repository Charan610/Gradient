/** Progressive enhancement: base content is always visible, including without JS.
 * One observer and mutation-batched scans; no wheel interception or scroll loop.
 */
export function createScrollReveals(root:HTMLElement,selector:string):()=>void {
 if(typeof IntersectionObserver==='undefined'||typeof window.matchMedia!=='function')return ()=>{};
 const media=window.matchMedia('(prefers-reduced-motion: reduce)');
 const seen=new WeakSet<Element>(),watched=new Set<HTMLElement>(),active=new Set<Animation>();
 let disposed=false,scheduled:number|null=null,navigationSuppressed=false;
 const cancel=()=>{for(const animation of active)animation.cancel();active.clear()};
 const suppressNavigation=()=>{navigationSuppressed=true;cancel()};
 const resumeScrolling=()=>{navigationSuppressed=false};
 const onKey=(event:KeyboardEvent)=>{
  if((event.target as HTMLElement|null)?.closest?.('input,textarea,select,[contenteditable="true"]'))return;
  if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key))resumeScrolling();
 };
 const isHashTarget=(element:HTMLElement)=>{
  const target=element.id?element:element.closest('[id]');
  try{return !!target?.id&&decodeURIComponent(window.location?.hash?.slice(1)??'')===target.id}
  catch{return false}
 };
 const observer=new IntersectionObserver(entries=>{
  if(disposed||media.matches||document.hidden)return;
  for(const entry of entries){
   const element=entry.target as HTMLElement;
   if(!entry.isIntersecting||seen.has(element)||!watched.has(element))continue;
   observer.unobserve(element);watched.delete(element);seen.add(element);
   // Hash jumps and restored browser positions should land on fully readable text.
   if(navigationSuppressed||isHashTarget(element)||element.getBoundingClientRect().top<=0||typeof element.animate!=='function')continue;
   const word=element.dataset.scrollWord!==undefined;
   const order=Math.max(0,Math.min(8,Number(element.dataset.scrollOrder)||0));
   try{
    const animation=element.animate(word?[{opacity:.35},{opacity:1}]:[{opacity:.4,transform:'translate3d(0,12px,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],{duration:word?400:500,delay:word?order*30:0,easing:'cubic-bezier(0.22,1,0.36,1)',fill:word?'backwards':'none'});
    active.add(animation);
    animation.onfinish=animation.oncancel=()=>active.delete(animation);
   }catch{/* Unsupported animation options must never hide learning content. */}
  }
 },{threshold:.12,rootMargin:'0px 0px -24px 0px'});
 const scan=()=>{
  if(disposed||media.matches||document.hidden)return;
  for(const element of watched)if(!root.contains(element)){observer.unobserve(element);watched.delete(element)}
  for(const element of root.querySelectorAll<HTMLElement>(selector)){
   if(seen.has(element)||watched.has(element)||element.closest('[data-scroll-static],dialog,[role="alert"]'))continue;
   const bounds=element.getBoundingClientRect();
   if(bounds.height===0)continue;
   // Leave the initial viewport and everything already passed completely still.
   if(bounds.top<window.innerHeight){seen.add(element);continue}
   observer.observe(element);watched.add(element);
  }
 };
 const reconcile=()=>{
  if(media.matches||document.hidden){observer.disconnect();watched.clear();cancel()}
  else scan();
 };
 const mutations=new MutationObserver(()=>{
  if(scheduled!==null||disposed)return;
  scheduled=requestAnimationFrame(()=>{scheduled=null;scan()});
 });
 mutations.observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['open']});
 media.addEventListener('change',reconcile);
 document.addEventListener('visibilitychange',reconcile);
 root.addEventListener('focusin',suppressNavigation);
 window.addEventListener('hashchange',suppressNavigation);
 window.addEventListener('wheel',resumeScrolling,{passive:true});
 window.addEventListener('touchstart',resumeScrolling,{passive:true});
 window.addEventListener('keydown',onKey);
 window.addEventListener('beforeprint',cancel);
 reconcile();
 return ()=>{
  disposed=true;if(scheduled!==null)cancelAnimationFrame(scheduled);
  observer.disconnect();mutations.disconnect();watched.clear();cancel();
  media.removeEventListener('change',reconcile);document.removeEventListener('visibilitychange',reconcile);
  root.removeEventListener('focusin',suppressNavigation);window.removeEventListener('beforeprint',cancel);
  window.removeEventListener('hashchange',suppressNavigation);window.removeEventListener('wheel',resumeScrolling);
  window.removeEventListener('touchstart',resumeScrolling);window.removeEventListener('keydown',onKey);
 };
}
