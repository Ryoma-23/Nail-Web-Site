'use client';
import { useState } from 'react';
import { PhotoView } from '../profile/ui';
import { salonPhotos } from './data';
import { AnimationFrame, Hero, type Playback } from './ui';
import s from './animation.module.css';

function Scene({ started, run, reduced }: Playback) {
  const [skipped,setSkipped]=useState(-1);
  return <>
    <button type="button" disabled={!started || reduced || skipped===run} onClick={()=>setSkipped(run)}>イントロをスキップ</button>
    <div className={s.stage}><Hero/>
      {started&&!reduced&&skipped!==run&&<div key={run} className={s.cinema} aria-hidden="true" onAnimationEnd={event=>{if(event.target===event.currentTarget)setSkipped(run);}}>
        <PhotoView photo={salonPhotos[2]} eager/><PhotoView photo={salonPhotos[0]} eager/><span>mellow</span><strong>私らしい色と出会う場所</strong>
      </div>}
    </div>
  </>;
}

export default function CinematicIntro(){
  return <AnimationFrame id="A05" title="シネマティックイントロ" guide="短いイントロからHeroへ移行します。途中でスキップできます。" example="サロンのブランド紹介に短い余韻を添える。" Scene={Scene} />;
}
