'use client';
import { useState } from 'react';
import { Choices } from '../marketing/ui';
import { hexPattern, palette, paletteModes, type PaletteMode } from './colors';
import { CopyText, Lab } from './ui';
import s from './interactive.module.css';

const initial='#b66383';
export default function ColorPaletteGenerator(){
  const [base,setBase]=useState(initial);
  const [draft,setDraft]=useState(initial);
  const [mode,setMode]=useState<PaletteMode>('補色');
  const valid=hexPattern.test(draft);
  const result=palette(base,mode);
  return <Lab id="I11" title="ベースカラーから配色を作る" guide="色を選ぶかHEXを入力すると、選んだパターンに合わせて色見本とネイルの配色が変わります。">
    <div className={s.controls}><label>ベースカラー<input type="color" value={base} onChange={event=>{setBase(event.target.value);setDraft(event.target.value);}}/></label>
      <label>HEXカラー<input type="text" value={draft} maxLength={7} aria-invalid={!valid} onChange={event=>{
        const value=event.target.value;setDraft(value);if(hexPattern.test(value))setBase(value.toLowerCase());
      }}/></label></div>
    {!valid&&<p role="alert"># に続けて6桁の16進数を入力してください。色見本は最後に入力した有効な色を使っています。</p>}
    <Choices label="配色パターン" options={paletteModes} value={mode} change={setMode}/>
    <div className={s.nailSwatches} aria-label="ネイルの配色見本">{[...result,base].map((color,index)=><span key={index} style={{backgroundColor:color}} />)}</div>
    <div className={s.palette}>{result.map((color,index)=><article className={s.card} key={index} data-palette-color={color}>
      <div className={s.chip} style={{backgroundColor:color}}/><strong>{index===0?'ベース':'差し色 '+index} · {color}</strong>
      <CopyText key={color} value={color} label="HEXをコピー"/></article>)}</div>
    <button type="button" onClick={()=>{setBase(initial);setDraft(initial);setMode('補色');}}>パレットをリセット</button>
  </Lab>;
}
