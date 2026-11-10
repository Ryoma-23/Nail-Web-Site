'use client';
import { useEffect, useRef, useState } from 'react';
import { Art } from '../gallery/ui';
import { works } from './data';
import { AnimationFrame, type Playback } from './ui';
import s from './animation.module.css';
function Scene({run,playing,reduced}:Playback){
  const rail=useRef<HTMLOListElement>(null);
  const drag=useRef<{id:number;x:number;left:number}|null>(null);
  const replay=useRef(0);
  const [index,setIndex]=useState(0);
  function move(delta:number){
    const node=rail.current;const card=node?.children[Math.max(0,Math.min(works.length-1,index+delta))];
    if(node&&card instanceof HTMLElement)node.scrollTo({left:card.offsetLeft,behavior:reduced?'instant':'smooth'});
  }
  useEffect(()=>{
    const node=rail.current;
    if(!node||!run||replay.current===run||(!playing&&!reduced))return;
    replay.current=run;
    const card=node.children[1];
    if(card instanceof HTMLElement)node.scrollTo({left:card.offsetLeft,behavior:reduced?'instant':'smooth'});
  },[run,playing,reduced]);
  return <>
    <ol ref={rail} className={s.rail} data-rail tabIndex={0} aria-label="作品を横に閲覧"
      onScroll={event=>{const node=event.currentTarget;const children=Array.from(node.children) as HTMLElement[];
        const nearest=children.reduce((best,child,i)=>Math.abs(child.offsetLeft-node.scrollLeft)<Math.abs(children[best].offsetLeft-node.scrollLeft)?i:best,0);
        setIndex(node.scrollLeft>=node.scrollWidth-node.clientWidth-3&&node.scrollLeft>0?works.length-1:nearest);
      }}
      onPointerDown={event=>{if(event.pointerType!=='mouse'||event.button!==0)return;const node=event.currentTarget;
        drag.current={id:event.pointerId,x:event.clientX,left:node.scrollLeft};node.setPointerCapture(event.pointerId);node.style.scrollSnapType='none';}}
      onPointerMove={event=>{const current=drag.current;if(current?.id===event.pointerId)event.currentTarget.scrollLeft=current.left+current.x-event.clientX;}}
      onLostPointerCapture={event=>{drag.current=null;event.currentTarget.style.scrollSnapType='';}}>
      {works.map(item=><li key={item.id} className={s.card}><Art src={item.images[0]} alt={item.title+'の作品見本'}/><h4>{item.title}</h4></li>)}
    </ol>
    <div className={s.row}><button type="button" disabled={index===0} onClick={()=>move(-1)}>前の作品</button><span role="status">{index+1} / {works.length}</span>
      <button type="button" disabled={index===works.length-1} onClick={()=>move(1)}>次の作品</button></div>
  </>;
}

export default function HorizontalGallery(){
  return <AnimationFrame id="A15" title="横スクロールギャラリー" guide="スワイプ、マウスでのドラッグ、矢印ボタンで作品を送れます。" example="次の作品が見える横並びギャラリー。" Scene={Scene} />;
}
