'use client';
import { useState } from 'react';
import { sampleDesigns } from '../gallery/data';
import { DesignCard, DesignPicker, Lab } from './ui';
import s from './interactive.module.css';

export default function DesignComparison() {
  const [first,setFirst]=useState('milk-tea');
  const [second,setSecond]=useState('petal');
  return <Lab id="I04" title="ふたつのデザインを見比べる" guide="色・カテゴリー・参考料金を、2枚の作品カードで比較します。">
    <div className={s.pair}><DesignPicker label="作品A" value={first} change={setFirst} exclude={second}/><DesignPicker label="作品B" value={second} change={setSecond} exclude={first}/></div>
    <div className={s.pair}>{[first,second].map((id,index)=>{
      const item=sampleDesigns.find(design=>design.id===id);
      return item ? <DesignCard key={index} design={item} /> : <p key={index} className={s.notice}>比較する作品を選択してください。</p>;
    })}</div>
    <button type="button" onClick={()=>{setFirst('');setSecond('');}}>比較を解除</button>
  </Lab>;
}
