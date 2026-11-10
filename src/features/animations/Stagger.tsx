'use client';
import { useState, type CSSProperties } from 'react';
import { Art } from '../gallery/ui';
import { works } from './data';
import { AnimationFrame, Options, Slider, type Playback } from './ui';
import s from './animation.module.css';
function Scene({started,run}:Playback){
  const [direction,setDirection]=useState('左から');
  const [delay,setDelay]=useState(.16);
  return <><Options label="カードの順番" options={['左から','右から']} value={direction} change={setDirection}/>
    <Slider label="カードの間隔（秒）" value={delay} min={.05} max={.6} step={.05} change={setDelay}/>
    <div className={s.grid} key={run}>{works.map((design,index)=><article key={design.id} className={s.card+(started?' '+s.motion+' '+s.stagger:'')}
      style={{'--delay':delay*(direction==='左から'?index:works.length-1-index)+'s','--x':direction==='左から'?'-22px':'22px'} as CSSProperties}>
      <Art src={design.images[0]} alt={design.title+'の作品見本'}/><h4>{design.title}</h4></article>)}</div>
  </>;
}

export default function Stagger(){
  return <AnimationFrame id="A12" title="スタッガー表示" guide="カードの間隔と、どちらから順に現れるかを選べます。" example="新作一覧を一枚ずつ紹介する。" Scene={Scene} />;
}
