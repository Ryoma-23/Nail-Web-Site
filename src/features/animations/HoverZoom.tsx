'use client';
import { useState, type CSSProperties } from 'react';
import { PhotoView } from '../profile/ui';
import { hero } from './data';
import { AnimationFrame, Slider, type Playback } from './ui';
import s from './animation.module.css';
function Scene({started,run}:Playback){
  const [zoom,setZoom]=useState(1.2);
  const [active,setActive]=useState(false);
  return <><Slider label="拡大倍率" value={zoom} min={1.05} max={1.55} step={.05} change={setZoom}/>
    <button type="button" aria-label="写真を拡大" aria-pressed={active} onClick={()=>setActive(value=>!value)} className={s.hoverPhoto}
      style={{'--zoom':zoom} as CSSProperties}>
      <div className={started&&!active?s.motion+' '+s.zoomPreview:undefined} key={run}><PhotoView photo={hero.image} eager/></div>
      <span>ローズのつや · 写真を拡大</span></button>
  </>;
}

export default function HoverZoom(){
  return <AnimationFrame id="A13" title="ホバー拡大" guide="写真にマウスを乗せるか、押して拡大を切り替えます。" example="写真の質感を一覧から確かめやすくする。" Scene={Scene} />;
}
