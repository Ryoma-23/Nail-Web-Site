'use client';
import { useState, type CSSProperties } from 'react';
import { AnimationFrame, Contents, Hero, Slider, useScrollPlayback, useScrollProgress, type Playback } from './ui';
import s from './animation.module.css';

function Scene(playback: Playback) {
  const [strength,setStrength]=useState(65);
  const {ref,progress}=useScrollProgress();
  useScrollPlayback(ref,playback);
  return <>
    <Slider label="奥行きの強さ" min={0} max={120} value={strength} change={setStrength}/>
    <div ref={ref} className={s.scroller} tabIndex={0} aria-label="パララックスのスクロール領域">
      <Hero effect="parallax" style={{'--shift':(playback.reduced?0:progress*strength)+'px'} as CSSProperties}/><Contents/>
    </div>
  </>;
}

export default function Parallax(){
  return <AnimationFrame id="A08" title="パララックス" guide="枠内をスクロールし、写真と手前の文字の速度差を比べます。" example="写真の奥行きでサロンの空間を伝える。" Scene={Scene} />;
}
