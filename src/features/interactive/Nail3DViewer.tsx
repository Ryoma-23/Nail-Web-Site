'use client';
import { useEffect, useRef, useState } from 'react';
import { Art } from '../gallery/ui';
import { Choices } from '../marketing/ui';
import { clamp } from './canvas';
import { defaultView, drawNailModel, type View3D } from './nailMesh';
import { Lab, Range } from './ui';
import s from './interactive.module.css';

export default function Nail3DViewer(){
  const [view,setView]=useState(defaultView);
  const [available,setAvailable]=useState(true);
  const [supported,setSupported]=useState(true);
  const canvas=useRef<HTMLCanvasElement>(null);
  const drag=useRef<{id:number;x:number;y:number} | undefined>(undefined);
  function update(values:Partial<View3D>){setView(previous=>({...previous,...values}));}
  function rotate(dx:number,dy:number){setView(previous=>({...previous,yaw:((previous.yaw+dx+180)%360+360)%360-180,pitch:clamp(previous.pitch+dy,-80,80)}));}
  useEffect(()=>{
    if(!available||!supported)return;
    const ctx=canvas.current?.getContext('2d');
    const frame=requestAnimationFrame(()=>{
      if(ctx) drawNailModel(ctx,view);
      else setSupported(false);
    });
    return ()=>cancelAnimationFrame(frame);
  },[available,supported,view]);

  return <Lab id="I10" title="爪の形と質感を立体で見る" guide="ドラッグ・タッチ・矢印キーで回転できます。WebGLを使わずにブラウザ内で3Dモデルを描画します。">
    {available&&supported?<canvas className={s.surface} ref={canvas} width={840} height={560} tabIndex={0} aria-label="回転できる立体ネイルモデル。矢印キーで回転"
      onKeyDown={event=>{
        const offsets:Record<string,[number,number]>={ArrowLeft:[-10,0],ArrowRight:[10,0],ArrowUp:[0,10],ArrowDown:[0,-10]};
        if(Object.hasOwn(offsets,event.key)){event.preventDefault();rotate(...offsets[event.key]);}
      }}
      onPointerDown={event=>{
        if(!event.isPrimary||event.button!==0)return;
        event.currentTarget.setPointerCapture(event.pointerId);drag.current={id:event.pointerId,x:event.clientX,y:event.clientY};
      }}
      onPointerMove={event=>{
        const previous=drag.current;if(previous?.id!==event.pointerId)return;
        rotate((event.clientX-previous.x)*.8,(event.clientY-previous.y)*.8);
        drag.current={id:event.pointerId,x:event.clientX,y:event.clientY};
      }}
      onLostPointerCapture={()=>{drag.current=undefined;}}/>:<div className={s.panel}><p>立体表示が使えないときの画像見本です。</p><Art src="/gallery-demo/rose.svg" alt="ローズ色のネイルチップ見本"/></div>}
    <div className={s.controls}>
      <Range label="ズーム" min={.55} max={1.65} step={.05} value={view.zoom} change={zoom=>update({zoom})}/>
      <Range label="左右の回転" min={-180} max={180} value={view.yaw} change={yaw=>update({yaw})}/>
      <Range label="上下の回転" min={-80} max={80} value={view.pitch} change={pitch=>update({pitch})}/>
      <label>ネイルカラー<input type="color" value={view.color} onChange={event=>update({color:event.target.value})}/></label>
      <label>背景色<input type="color" value={view.background} onChange={event=>update({background:event.target.value})}/></label>
    </div>
    <Choices label="表面の質感" options={['光沢','マット']} value={view.gloss?'光沢':'マット'} change={value=>update({gloss:value==='光沢'})}/>
    <div className={s.row}><button type="button" onClick={()=>setView(defaultView)}>視点と色をリセット</button>
      <button type="button" aria-pressed={!available} onClick={()=>setAvailable(value=>!value)}>代替画像を試す</button></div>
  </Lab>;
}
