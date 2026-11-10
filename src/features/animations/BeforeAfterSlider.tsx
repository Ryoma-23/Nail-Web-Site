'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Art } from '../gallery/ui';
import { comparisonImages } from './data';
import { AnimationFrame, type Playback } from './ui';
import s from './animation.module.css';
function Scene({run,playing,reduced,speed}:Playback){
  const [position,setPosition]=useState(50);
  const manual=useRef(0);
  const progress=useRef({run:0,time:0});
  useEffect(()=>{
    if(!playing||!run||manual.current===run||reduced)return;
    if(progress.current.run!==run)progress.current={run,time:0};
    let frame=0,last=0;
    function tick(now:number){
      if(manual.current===run)return;
      if(last)progress.current.time+=Math.min(now-last,35)*speed;
      last=now;
      const step=Math.min(1,progress.current.time/1500);
      setPosition(Math.round(15+step*70));
      if(step<1)frame=requestAnimationFrame(tick);
    }
    frame=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(frame);
  },[run,playing,reduced,speed]);
  return <><p>説明用イラストで、同じネイルチップの着色前と着色後を比べます。</p>
    <div className={s.compare} data-comparison style={{'--split':position+'%'} as CSSProperties}>
      <Art src={comparisonImages[1].src} alt={comparisonImages[1].alt}/>
      <div className={s.compareBefore}><Art src={comparisonImages[0].src} alt={comparisonImages[0].alt}/></div>
      <div className={s.compareLine} aria-hidden="true"/><span className={s.beforeLabel}>Before</span><span className={s.afterLabel}>After</span>
      <input type="range" aria-label="比較位置" min={0} max={100} value={position} onChange={event=>{manual.current=run;setPosition(Number(event.target.value));}}/>
    </div><p>比較位置 · {position}%</p>
  </>;
}

export default function BeforeAfterSlider(){
  return <AnimationFrame id="A17" title="Before / Afterスライダー" guide="境界線を指やマウスで動かします。キーボードの矢印キーでも比較できます。" example="同じネイルチップの仕上げ前後を比較する。" Scene={Scene} />;
}
