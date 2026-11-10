'use client';
import { useRef, useState } from 'react';
import { AnimationFrame, Contents, Hero, Options, type Playback } from './ui';
import s from './animation.module.css';
const indicators={矢印:'arrow',ライン:'line',マウス:'mouse'} as const;
function Scene({ started, reduced }: Playback) {
  const [mode,setMode]=useState<keyof typeof indicators>('矢印');
  const scroller=useRef<HTMLDivElement>(null);
  const target=useRef<HTMLDivElement>(null);
  return <><Options label="誘導の種類" options={Object.keys(indicators) as (keyof typeof indicators)[]} value={mode} change={setMode}/>
    <div ref={scroller} className={s.scroller} tabIndex={0} aria-label="スクロール誘導のプレビュー">
      <Hero><button type="button" aria-label="作品紹介へ" className={s.scrollButton} onClick={()=>{
        const root=scroller.current;const item=target.current;
        if(!root||!item)return;
        root.scrollTo({top:item.offsetTop,behavior:reduced?'instant':'smooth'});
        item.focus({preventScroll:true});
      }}><span aria-hidden="true" data-indicator={indicators[mode]} className={started?s.motion:undefined}>{mode==='矢印'?'↓':''}</span>作品紹介へ</button></Hero>
      <div ref={target} tabIndex={-1} aria-label="作品紹介"><Contents/></div>
    </div>
  </>;
}

export default function ScrollIndicator(){
  return <AnimationFrame id="A10" title="スクロール誘導" guide="矢印・ライン・マウスを切り替え、押して枠内の作品紹介へ移動します。" example="トップページの続きがあることを伝える。" Scene={Scene} />;
}
