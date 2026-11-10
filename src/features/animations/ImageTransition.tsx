'use client';
import { useState } from 'react';
import { PhotoView } from '../profile/ui';
import { salonPhotos } from './data';
import { AnimationFrame, Options, type Playback } from './ui';
import s from './animation.module.css';
const modes={クロスフェード:'fade',スライド:'slide',ワイプ:'wipe'} as const;
function Scene({run}:Playback){
  const [mode,setMode]=useState<keyof typeof modes>('クロスフェード');
  const [current,setCurrent]=useState({index:0,previous:salonPhotos.length-1});
  const index=(current.index+run)%salonPhotos.length;
  const previous=(current.previous+run)%salonPhotos.length;
  function move(delta:number){setCurrent(value=>({index:(value.index+delta+salonPhotos.length)%salonPhotos.length,previous:value.index}));}
  return <><Options label="切り替え方" options={Object.keys(modes) as (keyof typeof modes)[]} value={mode} change={setMode}/>
    <div className={s.mediaHero}><div className={s.mediaImage} aria-hidden="true"><PhotoView photo={salonPhotos[previous]}/></div>
      <div className={s.mediaImage} key={index+'-'+mode+'-'+run} data-transition={modes[mode]}><PhotoView photo={salonPhotos[index]} eager/></div></div>
    <div className={s.row}><button type="button" onClick={()=>move(-1)}>前の写真</button><span role="status">{index+1} / {salonPhotos.length}</span><button type="button" onClick={()=>move(1)}>次の写真</button></div>
  </>;
}

export default function ImageTransition(){
  return <AnimationFrame id="A14" title="画像切り替え" guide="同じ写真を、フェード・スライド・ワイプで切り替えます。" example="作品詳細の別カットへ滑らかに移る。" Scene={Scene} />;
}
