'use client';
import { useState, type CSSProperties } from 'react';
import { Art } from '../gallery/ui';
import { works } from './data';
import { AnimationFrame, Options, Slider, type Playback } from './ui';
import s from './animation.module.css';
const words=['SEASONAL COLORS','NAIL ART','PRIVATE STUDIO','MELLOW'];
function Scene({started,run}:Playback){
  const [mode,setMode]=useState('テキスト');
  const [direction,setDirection]=useState('左へ');
  const [seconds,setSeconds]=useState(12);
  return <><Options label="流す内容" options={['テキスト','画像']} value={mode} change={setMode}/>
    <Options label="進む方向" options={['左へ','右へ']} value={direction} change={setDirection}/>
    <Slider label="1周の目安（秒）" min={6} max={24} value={seconds} change={setSeconds}/>
    <div className={s.marqueeBox} aria-label={mode==='画像'?'季節のネイル作品':'季節の色、ネイルアート、プライベートサロン'} data-marquee={direction==='右へ'?'right':'left'}>
      <div key={run} className={s.marqueeTrack+(started?' '+s.motion:'')} style={{'--duration':seconds+'s'} as CSSProperties}>
        {[0,1].map(copy=><div className={s.marqueeGroup} key={copy} aria-hidden={copy===1}>{mode==='画像'?works.slice(0,4).map(item=>
          <Art key={item.id} src={item.images[0]} alt={item.title+'の作品見本'}/>):words.map(word=><span key={word}>{word}</span>)}</div>)}
      </div>
    </div>
  </>;
}

export default function Marquee(){
  return <AnimationFrame id="A16" title="マーキー" guide="文字または写真を流し、向き・速さを比べます。停止ボタンでいつでも止められます。" example="新作や季節のテーマを繰り返し紹介する。" Scene={Scene} />;
}
