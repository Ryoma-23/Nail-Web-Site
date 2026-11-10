'use client';
import { useState, type CSSProperties } from 'react';
import { AnimationFrame, Hero, Options, Slider, type Playback } from './ui';

function Scene({ started, run }: Playback) {
  const [duration, setDuration] = useState(1.2);
  const [easing, setEasing] = useState('ゆっくり減速');
  return <>
    <Slider label="表示時間（秒）" value={duration} min={.3} max={3} step={.1} change={setDuration}/>
    <Options label="動きの加減速" options={['ゆっくり減速','一定','なめらか']} value={easing} change={setEasing}/>
    <Hero key={run} effect={started ? 'fade' : undefined} style={{ '--duration': duration+'s', '--ease': easing==='一定'?'linear':easing==='なめらか'?'ease-in-out':'ease-out' } as CSSProperties}/>
  </>;
}

export default function FadeIn(){
  return <AnimationFrame id="A01" title="フェードイン" guide="再生すると、写真・見出し・文章が柔らかく現れます。" example="トップページの第一印象を整える。" Scene={Scene} />;
}
