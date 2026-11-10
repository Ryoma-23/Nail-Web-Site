'use client';
import { useState, type CSSProperties } from 'react';
import { AnimationFrame, Options, Slider, type Playback } from './ui';
import s from './animation.module.css';

function Scene({ started, run }: Playback) {
  const [language,setLanguage]=useState('日本語');
  const [mode,setMode]=useState('タイプライター');
  const [delay,setDelay]=useState(75);
  const copy=language==='日本語'?'指先に、季節のひかり。':'A little light on your fingertips.';
  return <>
    <Options label="コピーの言語" options={['日本語','English']} value={language} change={setLanguage}/>
    <Options label="文字の見せ方" options={['タイプライター','文字フェード']} value={mode} change={setMode}/>
    <Slider label="文字間隔（ミリ秒）" value={delay} min={25} max={180} change={setDelay}/>
    <div className={s.wordHero}><span className={s.eyebrow}>MELLOW NAIL STUDIO</span>
      <h4 key={run+'-'+language+'-'+mode} aria-label={copy}>{Array.from(copy).map((char,index)=>
        <span key={index} aria-hidden="true" className={started?s.motion:undefined} data-letter={mode==='文字フェード'?'fade':'type'}
          style={{ '--letter-delay':index*delay+'ms' } as CSSProperties}>{char===' '?'\u00a0':char}</span>)}</h4>
    </div>
  </>;
}

export default function TextReveal(){
  return <AnimationFrame id="A04" title="文字の逐次表示" guide="日本語と英語を切り替え、タイプライター風とフェードを比較します。" example="短いキャッチコピーに視線を集める。" Scene={Scene} />;
}
