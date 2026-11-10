'use client';
import { useState, type CSSProperties } from 'react';
import { AnimationFrame, Hero, Options, type Playback } from './ui';
import s from './animation.module.css';
function Scene({started,run,reduced}:Playback){
  const [mode,setMode]=useState('円形');
  const [position,setPosition]=useState<{x:number;y:number;action:boolean}|null>(null);
  const [selected,setSelected]=useState(false);
  return <><Options label="カーソルの見せ方" options={['円形','追従']} value={mode} change={setMode}/>
    <div className={s.cursorStage} data-cursor={mode==='追従'?'follow':'circle'}
      onPointerMove={event=>{
        if(reduced||event.pointerType!=='mouse')return;
        const bounds=event.currentTarget.getBoundingClientRect();setPosition({x:event.clientX-bounds.left,y:event.clientY-bounds.top,
          action:event.target instanceof Element&&!!event.target.closest('button,a')});
      }} onPointerLeave={()=>setPosition(null)}>
      <Hero><button type="button" onClick={()=>setSelected(true)}>作品をチェック</button>{selected&&<p role="status">ローズ色の仕上がりを紹介しています。</p>}</Hero>
      {!reduced&&position&&<span aria-hidden="true" className={s.cursorDot} data-action={position.action}
        style={{'--cursor-x':position.x+'px','--cursor-y':position.y+'px'} as CSSProperties}/>}
      {!reduced&&started&&!position&&<span aria-hidden="true" key={run} className={s.cursorGhost+' '+s.motion}/>}
    </div><p className={s.note}>タッチ端末では通常のボタンとして操作できます。</p>
  </>;
}

export default function CustomCursor(){
  return <AnimationFrame id="A28" title="カスタムカーソル" guide="PCではマウスに円が追従し、ボタンの上で形が変わります。" example="作品とボタンの操作箇所をさりげなく示す。" Scene={Scene} />;
}
