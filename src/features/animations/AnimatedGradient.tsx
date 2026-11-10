'use client';
import { useState, type CSSProperties } from 'react';
import { AnimationFrame, Hero, Options, Slider, type Playback } from './ui';
import s from './animation.module.css';
const palettes={ローズ:'#e9b8cc,#f5dcd5,#d9c3eb',ブルー:'#c7dfe6,#e4f1e8,#c5c9ec',ベージュ:'#edd7b8,#f5e8dc,#d6bfc9'} as const;
function Scene({run,started}:Playback){
  const [palette,setPalette]=useState<keyof typeof palettes>('ローズ');
  const [direction,setDirection]=useState('横方向');
  const [duration,setDuration]=useState(5);
  return <><Options label="配色" options={Object.keys(palettes) as (keyof typeof palettes)[]} value={palette} change={setPalette}/>
    <Options label="動く方向" options={['横方向','縦方向']} value={direction} change={setDirection}/>
    <Slider label="移動時間（秒）" min={2} max={12} value={duration} change={setDuration}/>
    <div className={s.gradient} data-gradient={direction==='縦方向'?'vertical':'horizontal'}>
      <div aria-hidden="true" key={run} className={s.gradientField+(started?' '+s.motion:'')}
        style={{'--colors':palettes[palette],'--duration':duration+'s'} as CSSProperties}/>
      <Hero/>
    </div></>;
}

export default function AnimatedGradient(){
  return <AnimationFrame id="A25" title="流れるグラデーション" guide="配色・方向・移動時間を選び、背景の流れを比較できます。" example="季節特集の背景に色の変化を加える。" Scene={Scene} />;
}
