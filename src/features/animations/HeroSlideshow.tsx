'use client';
import { useEffect, useState } from 'react';
import { PhotoView } from '../profile/ui';
import { hero, salonPhotos } from './data';
import { AnimationFrame, Options, Slider, type Playback } from './ui';
import s from './animation.module.css';

function Scene({ playing, run, speed }: Playback) {
  const [mode,setMode]=useState('フェード');
  const [interval,setInterval]=useState(3);
  const [position,setPosition]=useState({run:0,index:0,previous:0});
  const visible=position.run===run?position.index:0;
  const previous=position.run===run?position.previous:0;
  const index=((visible%salonPhotos.length)+salonPhotos.length)%salonPhotos.length;
  useEffect(()=>{
    if(!playing)return;
    const timer=window.setInterval(()=>setPosition(value=>{
      const index=value.run===run?value.index:0;
      return {run,index:index+1,previous:index};
    }),interval*1000/speed);
    return ()=>window.clearInterval(timer);
  },[playing,run,speed,interval]);
  function move(delta:number){
    setPosition({run,index:visible+delta,previous:visible});
  }
  return <>
    <Options label="切り替え方法" options={['フェード','スライド']} value={mode} change={setMode}/>
    <Slider label="切り替え間隔（秒）" value={interval} min={1} max={6} change={setInterval}/>
    <div className={s.mediaHero}>
      <div className={s.mediaImage}><PhotoView photo={salonPhotos[((previous%salonPhotos.length)+salonPhotos.length)%salonPhotos.length]} eager/></div>
      <div className={s.mediaImage} data-transition={mode==='フェード'?'fade':'slide'} key={run+'-'+visible+'-'+mode}><PhotoView photo={salonPhotos[index]} eager/></div>
      <div className={s.mediaCopy}><span>{hero.eyebrow}</span><h4>{hero.title}</h4></div>
    </div>
    <div className={s.row}><button type="button" onClick={()=>move(-1)}>前の写真</button><span role="status">{index+1} / {salonPhotos.length}</span><button type="button" onClick={()=>move(1)}>次の写真</button></div>
  </>;
}

export default function HeroSlideshow(){
  return <AnimationFrame id="A06" title="背景画像スライドショー" guide="再生で自動切り替え。前へ・次へでも写真を送れます。" example="施術・仕上がり・サロンの雰囲気を順番に見せる。" Scene={Scene} />;
}
