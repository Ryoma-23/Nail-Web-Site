'use client';
import { useState, type CSSProperties } from 'react';
import { AnimationFrame, Contents, Options, useScrollPlayback, useScrollProgress, type Playback } from './ui';
import s from './animation.module.css';
function Scene(playback:Playback){
  const [mode,setMode]=useState('上部バー');
  const {ref,progress}=useScrollProgress();
  useScrollPlayback(ref,playback);
  const value=Math.round(progress*100);
  return <><Options label="進捗の表示" options={['上部バー','円形']} value={mode} change={setMode}/>
    <div ref={ref} className={s.scroller} tabIndex={0} aria-label="閲覧進捗のスクロール領域">
      <div role="progressbar" aria-label="枠内の閲覧進捗" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}
        className={mode==='円形'?s.progressCircle:s.progressBar} style={{'--progress':progress} as CSSProperties}>
        {mode==='円形'?<><svg viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="23" pathLength="100"/><circle cx="28" cy="28" r="23" pathLength="100" strokeDasharray="100" strokeDashoffset={100-value}/></svg><span>{value}%</span></>:<><span/><small>{value}%</small></>}
      </div><Contents/>
    </div>
  </>;
}

export default function ScrollProgress(){
  return <AnimationFrame id="A31" title="スクロール進捗バー" guide="枠内の閲覧位置を、上部バーか円形の表示で確認します。" example="長いサロン紹介や記事で、読み進めた位置を伝える。" Scene={Scene} />;
}
