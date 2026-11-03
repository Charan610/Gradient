import {Fragment} from 'react';

/** Preserve actual whitespace, wrapping and screen-reader text; no duplicate copy. */
export function RevealWords({text,offset=0}:{text:string;offset?:number}){
 let order=offset;
 return <>{text.split(/(\s+)/).map((part,index)=>/^\s+$/.test(part)?<Fragment key={index}>{part}</Fragment>:<span key={index} data-scroll-word="" data-scroll-order={order++} style={{color:'inherit'}}>{part}</span>)}</>;
}
