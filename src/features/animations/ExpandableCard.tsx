'use client';
import { useId, useState } from 'react';
import { Art } from '../gallery/ui';
import { yen } from '../menu/data';
import { works } from './data';
import { AnimationFrame, type Playback } from './ui';
import s from './animation.module.css';
function Scene({run}:Playback){
  const [selection,setSelection]=useState<{run:number;items:string[]}>({run:0,items:[]});
  const id=useId();
  const open=selection.run===run?selection.items:run?[works[0].id]:[];
  return <div className={s.stack}>{works.slice(0,3).map(item=>{
    const expanded=open.includes(item.id);
    return <article className={s.card} key={item.id}>
      <button type="button" aria-controls={id+item.id} aria-expanded={expanded} onClick={()=>setSelection({run,items:expanded?open.filter(key=>key!==item.id):[...open,item.id]})}>{item.title} {expanded?'−':'＋'}</button>
      <div className={s.expand} data-open={expanded} id={id+item.id} inert={!expanded}><div><Art src={item.images[0]} alt={item.title+'の作品見本'}/>
        <p>{item.description}</p><p>参考料金 {yen(item.price)} · 約{item.durationMinutes}分</p></div></div>
    </article>;
  })}</div>;
}

export default function ExpandableCard(){
  return <AnimationFrame id="A18" title="カード展開" guide="カードの見出しを押すと、料金や作品の説明が開きます。" example="一覧から必要なメニュー情報だけを開く。" Scene={Scene} />;
}
