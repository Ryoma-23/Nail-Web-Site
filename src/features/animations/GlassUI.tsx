'use client';
import { useState, type CSSProperties } from 'react';
import { PhotoView } from '../profile/ui';
import { salonPhotos } from './data';
import { AnimationFrame, Options, Slider, type Playback } from './ui';
import s from './animation.module.css';
function Scene({run,started}:Playback){
  const [mode,setMode]=useState('ガラス風');
  const [opacity,setOpacity]=useState(76);
  const [blur,setBlur]=useState(8);
  return <><Options label="カードの表現" options={['ガラス風','通常表示']} value={mode} change={setMode}/>
    <div className={s.row}><Slider label="背景の不透明度（%）" value={opacity} min={62} max={95} change={setOpacity}/>
    <Slider label="背景ぼかし（px）" value={blur} min={0} max={18} change={setBlur}/></div>
    <div className={s.glassStage}><PhotoView photo={salonPhotos[2]} eager/>
      {mode==='ガラス風'&&<div aria-hidden="true" className={s.ripple+(started?' '+s.motion:'')} key={run}/>}
      <article data-glass={mode==='ガラス風'} className={s.glassCard} style={{'--glass-alpha':opacity/100,'--blur':blur+'px'} as CSSProperties}>
        <span className={s.eyebrow}>MELLOW PRIVATE STUDIO</span><h4>窓辺の施術席</h4><p>色見本を手元に置き、光の下でゆっくりお選びいただけます。</p>
      </article>
    </div></>;
}

export default function GlassUI(){
  return <AnimationFrame id="A26" title="水面・ガラス風UI" guide="ガラス風と通常表示を比べ、透明度とぼかしを調整できます。" example="予約やアクセス情報を写真の上に載せる。" Scene={Scene} />;
}
