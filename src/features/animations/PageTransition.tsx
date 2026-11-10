'use client';
import { useState } from 'react';
import { Art } from '../gallery/ui';
import { works } from './data';
import { AnimationFrame, Hero, Options, type Playback } from './ui';
import s from './animation.module.css';
const modes={フェード:'fade',スライド:'slide',オーバーレイ:'overlay'} as const;
function Scene({run}:Playback){
  const [mode,setMode]=useState<keyof typeof modes>('フェード');
  const [manual,setManual]=useState<{run:number;works:boolean}>();
  const gallery=manual?.run===run?manual.works:run%2===1;
  return <><Options label="切り替え演出" options={Object.keys(modes) as (keyof typeof modes)[]} value={mode} change={setMode}/>
    <div className={s.stage}><div className={s.stack} key={run+'-'+String(gallery)+'-'+mode} data-transition={modes[mode]}>
      {gallery?<div className={s.contents}><h4>季節のデザイン</h4><div className={s.grid}>{works.slice(0,3).map(item=>
        <article key={item.id} className={s.card}><Art src={item.images[0]} alt={item.title+'の作品見本'}/><p>{item.title}</p></article>)}</div></div>:<Hero/>}
    </div>{mode==='オーバーレイ'&&<div key={'cover'+run+String(gallery)} className={s.pageWipe} aria-hidden="true"/>}</div>
    <p role="status">{gallery?'作品ページ':'サロンページ'}</p>
    <button type="button" onClick={()=>setManual({run,works:!gallery})}>{gallery?'サロンページへ戻る':'作品ページへ'}</button>
  </>;
}

export default function PageTransition(){
  return <AnimationFrame id="A20" title="ページ切り替え演出" guide="枠の中の2ページを往復し、切り替え方を比較してください。" example="サロン紹介から作品一覧へ移る場面。" Scene={Scene} />;
}
