'use client';
import { useEffect, useRef, useState } from 'react';
import { PhotoView } from '../profile/ui';
import { sections } from './data';
import { AnimationFrame, Slider, useScrollPlayback, type Playback } from './ui';
import s from './animation.module.css';

function Scene(playback:Playback){
  const root=useRef<HTMLDivElement>(null);
  const [threshold,setThreshold]=useState(35);
  const [seen,setSeen]=useState<{run:number;items:number[]}>({run:0,items:[]});
  useScrollPlayback(root,playback);
  const {run,reduced}=playback;
  useEffect(()=>{
    const node=root.current;
    if(!node||reduced||typeof IntersectionObserver==='undefined')return;
    const observer=new IntersectionObserver(entries=>{
      const found=entries.filter(entry=>entry.intersectionRatio>=threshold/100).map(entry=>Number((entry.target as HTMLElement).dataset.index));
      if(found.length)setSeen(old=>({run,items:[...new Set([...(old.run===run?old.items:[]),...found])]}));
    },{root:node,threshold:threshold/100});
    node.querySelectorAll('[data-index]').forEach(item=>observer.observe(item));
    return ()=>observer.disconnect();
  },[run,reduced,threshold]);
  return <><Slider label="表示開始位置（%）" value={threshold} min={5} max={70} change={setThreshold}/>
    <div className={s.scroller} ref={root} tabIndex={0} aria-label="スクロールフェードの領域">
      <div className={s.scrollCover}><span className={s.eyebrow}>MELLOW COLLECTION</span><h4>写真を見ながら、下へ</h4><p>枠の中をスクロール</p></div>
      <div className={s.contents}>{sections.map((item,index)=><article className={s.card+' '+s.reveal} data-index={index} key={item.title}
        data-revealed={reduced||(seen.run===run&&seen.items.includes(index))}>
        <PhotoView photo={item.photo}/><h4>{item.title}</h4><p>{item.text}</p></article>)}</div>
    </div>
  </>;
}

export default function ScrollFade(){
  return <AnimationFrame id="A11" title="スクロールフェード" guide="枠内をスクロールすると、入ってきた作品カードが現れます。" example="下へ読み進める際に写真と説明を自然に紹介する。" Scene={Scene} />;
}
