'use client';
import { useState } from 'react';
import { Particles } from './Particles';
import { AnimationFrame, Hero, Slider, type Playback } from './ui';
import s from './animation.module.css';
function Scene(playback:Playback){
  const [count,setCount]=useState(10),[duration,setDuration]=useState(7);
  return <><div className={s.row}><Slider label="花びら数" min={3} max={25} value={count} change={setCount}/>
    <Slider label="落ちる時間（秒）" min={3} max={12} value={duration} change={setDuration}/></div>
    <div className={s.stage}><Hero/><Particles kind="petal" count={count} color="#eeb5c7" duration={duration} playback={playback}/></div>
  </>;
}

export default function FloatingPetals(){
  return <AnimationFrame id="A24" title="浮遊する花びら" guide="花びらの数と落ちる速さを切り替えられます。" example="春のコレクションに季節感を添える。" Scene={Scene} />;
}
