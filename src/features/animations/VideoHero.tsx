'use client';
import { useEffect, useRef, useState } from 'react';
import { PhotoView } from '../profile/ui';
import { hero, salonPhotos } from './data';
import { AnimationFrame, type Playback } from './ui';
import s from './animation.module.css';

function Scene({ playing, run, speed, reduced }: Playback) {
  const [muted,setMuted]=useState(true);
  const [failed,setFailed]=useState(false);
  const [blocked,setBlocked]=useState(false);
  const video=useRef<HTMLVideoElement>(null);
  const lastRun=useRef(0);
  useEffect(()=>{
    const node=video.current;
    if(!node)return;
    if(run!==lastRun.current){node.currentTime=0;lastRun.current=run;}
    node.playbackRate=speed;
    let active=true;
    if(playing)void node.play().then(()=>{if(active)setBlocked(false);}).catch(()=>{if(active)setBlocked(true);});
    else node.pause();
    return ()=>{active=false;node.pause();};
  },[playing,run,speed,failed]);
  return <>
    <div className={s.mediaHero}>
      {failed||reduced?<PhotoView photo={salonPhotos[2]} eager/>:
        <video ref={video} src="/profile-demo/intro.webm" poster={salonPhotos[2].src} preload="none" loop muted={muted} playsInline onError={()=>setFailed(true)} aria-label="mellowの紹介動画"/>}
      <div className={s.mediaCopy}><span>{hero.eyebrow}</span><h4>{hero.title}</h4></div>
    </div>
    {failed?<p role="status">動画を読み込めなかったため、店内写真を表示しています。</p>:!reduced&&<div className={s.row}>
      <button type="button" aria-pressed={muted} onClick={()=>setMuted(value=>!value)}>{muted?'ミュートを解除':'ミュートにする'}</button>
      {blocked&&<button type="button" onClick={()=>void video.current?.play().then(()=>setBlocked(false)).catch(()=>setFailed(true))}>動画を直接再生</button>}
    </div>}
  </>;
}

export default function VideoHero(){
  return <AnimationFrame id="A07" title="動画ヒーロー" guide="ポスターを確認してから再生できます。音声は初期設定でミュートです。" example="店内や施術の雰囲気を冒頭で伝える。" Scene={Scene} />;
}
