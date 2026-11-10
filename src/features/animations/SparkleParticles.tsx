'use client';
import { useState } from 'react';
import { Particles } from './Particles';
import { AnimationFrame, Hero, Slider, type Playback } from './ui';
import s from './animation.module.css';
function Scene(playback:Playback){
  const [count,setCount]=useState(14),[speed,setSpeed]=useState(5),[color,setColor]=useState('#ffe3b8');
  return <><div className={s.row}><Slider label="粒子数" min={4} max={32} value={count} change={setCount}/>
    <Slider label="移動の目安（秒）" min={2} max={10} value={speed} change={setSpeed}/>
    <label>光の色<input type="color" value={color} onChange={event=>setColor(event.target.value)}/></label></div>
    <div className={s.stage}><Hero/><Particles kind="sparkle" count={count} color={color} duration={speed} playback={playback}/></div>
  </>;
}

export default function SparkleParticles(){
  return <AnimationFrame id="A23" title="キラキラパーティクル" guide="光の粒の数・移動速度・色を選べます。" example="光沢のあるネイル作品に小さな輝きを添える。" Scene={Scene} />;
}
