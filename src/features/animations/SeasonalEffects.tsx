'use client';
import { useState } from 'react';
import { seasons } from './data';
import { Particles } from './Particles';
import { AnimationFrame, Hero, Options, type Playback } from './ui';
import s from './animation.module.css';
function Scene(playback:Playback){
  const [season,setSeason]=useState<keyof typeof seasons>('Spring');
  const theme=seasons[season];
  return <><Options label="季節" options={Object.keys(seasons) as (keyof typeof seasons)[]} value={season} change={setSeason}/>
    <div className={s.seasonStage} data-season={season} style={{background:theme.color}}>
      <Hero><p>{theme.label} · 季節のコレクション</p></Hero>
      <Particles key={season} kind={theme.decoration} count={season==='Summer'?9:14} color={season==='Autumn'?'#b86943':season==='Spring'?'#e89db6':'#fff'} duration={8} playback={playback}/>
    </div></>;
}

export default function SeasonalEffects(){
  return <AnimationFrame id="A30" title="季節演出" guide="季節を選ぶと、桜・水面の光・落ち葉・雪を比較できます。" example="季節のおすすめやキャンペーンの背景に使う。" Scene={Scene} />;
}
