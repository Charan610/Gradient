'use client';
import {useEffect} from 'react';
import {createScrollReveals} from '@/lib/motion/scroll-reveals';

export function ScrollEffects({targetId,selector='h1,h2'}:{targetId:string;selector?:string}){
 useEffect(()=>{
  const root=document.getElementById(targetId);
  if(root)return createScrollReveals(root,selector);
 },[targetId,selector]);
 return null;
}
