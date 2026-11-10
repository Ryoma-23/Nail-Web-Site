'use client';
import { useState, type CSSProperties } from 'react';
import { PhotoView } from '../profile/ui';
import { hero } from './data';
import { AnimationFrame, Contents, Slider, useScrollPlayback, useScrollProgress, type Playback } from './ui';
import s from './animation.module.css';
function Scene(playback:Playback){
  const [strength,setStrength]=useState(40);
  const {ref,progress}=useScrollProgress();
  useScrollPlayback(ref,playback);
  const amount=playback.reduced?0:progress*strength/100;
  return <><Slider label="写真の変化の強さ" value={strength} min={0} max={90} change={setStrength}/>
    <div ref={ref} className={s.scroller} tabIndex={0} aria-label="写真演出のスクロール領域">
      <div className={s.scrollPhoto} data-scroll-photo style={{'--zoom':1+amount,'--float':amount*-82+'px'} as CSSProperties}>
        <PhotoView photo={hero.image} eager/><div><span>MELLOW / CLOSE UP</span><h4>ひかりを受ける指先</h4></div>
      </div><Contents/>
    </div></>;
}

export default function ScrollImageAnimation(){
  return <AnimationFrame id="A21" title="スクロール連動写真演出" guide="枠内を動かすと、写真の大きさと手前の文字の位置が変わります。" example="特集ページの作品写真に視線を導く。" Scene={Scene} />;
}
