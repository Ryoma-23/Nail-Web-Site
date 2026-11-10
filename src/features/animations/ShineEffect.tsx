'use client';
import { useState, type CSSProperties } from 'react';
import { PhotoView } from '../profile/ui';
import { hero } from './data';
import { AnimationFrame, Options, Slider, type Playback } from './ui';
import s from './animation.module.css';
function Scene({run,started}:Playback){
  const [target,setTarget]=useState('写真カード');
  const [direction,setDirection]=useState('左から右');
  const [duration,setDuration]=useState(1.3);
  const [active,setActive]=useState(false);
  return <><Options label="光を当てる対象" options={['写真カード','ボタン']} value={target} change={setTarget}/>
    <Options label="光の向き" options={['左から右','右から左','上から下']} value={direction} change={setDirection}/>
    <Slider label="通過時間（秒）" min={.4} max={3} step={.1} value={duration} change={setDuration}/>
    <div className={s.shineStage} data-shine={target==='ボタン'?'button':'photo'}>
      <div className={s.shineTarget}>
        {target==='写真カード'?<PhotoView photo={hero.image} eager/>:<button type="button" className={s.primary} onClick={()=>setActive(true)}>予約の流れを見る</button>}
        {started&&<span key={run+'-'+direction+'-'+target} aria-hidden="true" className={s.beam+' '+s.motion}
          data-direction={direction==='右から左'?'reverse':direction==='上から下'?'down':'forward'} style={{'--duration':duration+'s'} as CSSProperties}/>}
      </div>{active&&target==='ボタン'&&<p role="status">希望のメニューと日時を確認する想定です。</p>}
    </div></>;
}

export default function ShineEffect(){
  return <AnimationFrame id="A27" title="光沢エフェクト" guide="光を当てる対象と、光の進む向き・速さを切り替えます。" example="仕上がりのつやや予約ボタンをさりげなく強調する。" Scene={Scene} />;
}
