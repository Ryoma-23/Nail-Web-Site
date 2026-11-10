'use client';
import { useState, type CSSProperties } from 'react';
import { AnimationFrame, Options, type Playback } from './ui';
import s from './animation.module.css';
const modes={フェード:'fade',ライン描画:'line',文字展開:'letters'} as const;
function Scene({run,started}:Playback){
  const [mode,setMode]=useState<keyof typeof modes>('フェード');
  return <><Options label="ロゴの動き" options={Object.keys(modes) as (keyof typeof modes)[]} value={mode} change={setMode}/>
    <div className={s.logoStage} data-logo={modes[mode]} key={run+'-'+mode}>
      {mode==='ライン描画'&&<svg viewBox="0 0 80 80" aria-hidden="true" className={started?s.motion:undefined}>
        <path pathLength="1" d="M40 65C9 55 16 26 40 44C21 24 39 9 49 22C57 33 47 43 40 44C61 20 74 41 58 54C54 59 47 62 40 65Z"/>
        <path pathLength="1" d="M40 65Q42 48 40 44"/>
      </svg>}
      <span aria-label="mellow" className={s.logoWord+(started&&mode==='フェード'?' '+s.motion:'')}>
        {mode==='文字展開'?Array.from('mellow').map((char,index)=><i key={index} aria-hidden="true" className={started?s.motion:undefined} style={{'--delay':index*.12+'s'} as CSSProperties}>{char}</i>):'mellow'}
      </span><small>PRIVATE NAIL STUDIO</small>
    </div></>;
}

export default function LogoAnimation(){
  return <AnimationFrame id="A29" title="ロゴアニメーション" guide="架空のサロンロゴで、フェード・線の描画・文字の展開を試せます。" example="冒頭に屋号を短く表示する。" Scene={Scene} />;
}
