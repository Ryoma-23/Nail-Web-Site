'use client';
import { useState, type CSSProperties } from 'react';
import { PhotoView } from '../profile/ui';
import { hero } from './data';
import { AnimationFrame, Slider, type Playback } from './ui';
import s from './animation.module.css';
function Scene({started,run,reduced}:Playback){
  const [strength,setStrength]=useState(12);
  const [pointer,setPointer]=useState<{x:number;y:number}|null>(null);
  const [preview,setPreview]=useState(false);
  const tilt=pointer??(preview?{x:.65,y:-.42}:{x:0,y:0});
  const x=reduced?0:-tilt.y*strength,y=reduced?0:tilt.x*strength;
  return <><Slider label="傾きの強さ" value={strength} min={4} max={24} change={setStrength}/>
    <button type="button" aria-pressed={preview} onClick={()=>{setPointer(null);setPreview(value=>!value);}}>傾きを試す</button>
    <div className={s.tiltBox} onPointerMove={event=>{
      if(event.pointerType!=='mouse'||reduced)return;
      const box=event.currentTarget.getBoundingClientRect();setPointer({x:(event.clientX-box.left)/box.width*2-1,y:(event.clientY-box.top)/box.height*2-1});
    }} onPointerLeave={()=>setPointer(null)}>
      <figure key={run} className={s.tiltCard+(started&&!pointer&&!preview?s.motion+' '+s.tiltReplay:'')} data-tilt
        style={{'--tilt-x':x+'deg','--tilt-y':y+'deg','--glint':(50+tilt.x*35)+'%','--tilt-limit':strength+'deg'} as CSSProperties}>
        <PhotoView photo={hero.image} eager/><figcaption>ROSE GLOW · 窓辺の光で見るつや</figcaption></figure>
    </div></>;
}

export default function TiltCard(){
  return <AnimationFrame id="A19" title="3Dカード傾斜" guide="写真の上でマウスを動かすとカードが傾きます。ボタンでも傾きを試せます。" example="作品カードに控えめな奥行きを加える。" Scene={Scene} />;
}
