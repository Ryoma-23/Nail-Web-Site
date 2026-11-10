'use client';
import { useState } from 'react';
import { AnimationFrame, Hero, Options, type Playback } from './ui';
const masks={横方向:'mask-x',縦方向:'mask-y',円形:'mask-circle'} as const;
function Scene({ started, run }: Playback) {
  const [mask,setMask]=useState<keyof typeof masks>('横方向');
  return <><Options label="マスクの形" options={Object.keys(masks) as (keyof typeof masks)[]} value={mask} change={setMask}/>
    <Hero key={run} effect={started?masks[mask]:undefined}/>
  </>;
}

export default function ImageMask(){
  return <AnimationFrame id="A09" title="画像マスク演出" guide="横、縦、円形のマスクを選んで写真の現れ方を比べます。" example="作品特集の写真を印象的に紹介する。" Scene={Scene} />;
}
