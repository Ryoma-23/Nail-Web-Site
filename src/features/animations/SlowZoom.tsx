'use client';
import { useState, type CSSProperties } from 'react';
import { AnimationFrame, Hero, Options, Slider, type Playback } from './ui';

function Scene({ started, run }: Playback) {
  const [direction,setDirection]=useState('ズームイン');
  const [zoom,setZoom]=useState(1.2);
  return <>
    <Options label="ズーム方向" options={['ズームイン','ズームアウト']} value={direction} change={setDirection}/>
    <Slider label="倍率" value={zoom} min={1.05} max={1.55} step={.05} change={setZoom}/>
    <Hero key={run} effect={started?'zoom':undefined} style={{'--duration':'5s','--zoom':zoom,'--zoom-direction':direction==='ズームイン'?'normal':'reverse'} as CSSProperties}/>
  </>;
}

export default function SlowZoom(){
  return <AnimationFrame id="A03" title="ゆっくりズーム" guide="写真が枠内に収まったまま、ゆっくり拡大・縮小します。" example="ネイルのつやや細部に自然に目を引く。" Scene={Scene} />;
}
