'use client';
import { useState, type CSSProperties } from 'react';
import { AnimationFrame, Hero, Options, Slider, type Playback } from './ui';

function Scene({ started, run }: Playback) {
  const [direction,setDirection]=useState('左');
  const [distance,setDistance]=useState(90);
  const x=direction==='左'?-distance:direction==='右'?distance:0;
  const y=direction==='上'?-distance:direction==='下'?distance:0;
  return <>
    <Options label="登場する方向" options={['上','下','左','右']} value={direction} change={setDirection}/>
    <Slider label="移動距離（px）" value={distance} min={20} max={240} change={setDistance}/>
    <Hero key={run} effect={started?'slide':undefined} style={{ '--x':x+'px','--y':y+'px' } as CSSProperties}/>
  </>;
}

export default function SlideIn(){
  return <AnimationFrame id="A02" title="スライドイン" guide="方向と移動距離を選んで再生してください。" example="新作の写真と見出しを同時に紹介する。" Scene={Scene} />;
}
