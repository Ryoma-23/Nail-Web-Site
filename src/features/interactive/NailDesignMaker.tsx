'use client';
import { useEffect, useRef, useState } from 'react';
import { Choices } from '../marketing/ui';
import { clamp, download, point, savePng } from './canvas';
import { fingerCount, maxDecorations, restoreDesign, serializeDesign } from './designFile';
import { defaultNail, paintNail, patterns, shapes, type Decoration, type NailConfig } from './nailArt';
import { fingers } from './tryOnData';
import { Lab, Range } from './ui';
import s from './interactive.module.css';

const width=900,height=440,centerY=215,scale=1.53;
const center=(index:number)=>110+index*170;
const blank=()=>Array.from({length:fingerCount},()=>({...defaultNail,decorations:[]}));
function drawBoard(canvas:HTMLCanvasElement,nails:readonly NailConfig[],selected?:number){
  const ctx=canvas.getContext('2d');
  if(!ctx)return;
  ctx.fillStyle='#f8edf1';ctx.fillRect(0,0,width,height);
  ctx.textAlign='center';ctx.font='20px sans-serif';
  nails.forEach((nail,index)=>{
    const x=center(index);
    if(index===selected){
      ctx.fillStyle='#efdae5';ctx.beginPath();ctx.roundRect(x-75,58,150,310,18);ctx.fill();
    }
    ctx.save();ctx.translate(x,centerY);ctx.scale(scale,scale);paintNail(ctx,nail);ctx.restore();
    ctx.fillStyle='#673e54';ctx.fillText(fingers[index],x,352);
  });
}

export default function NailDesignMaker(){
  const [nails,setNails]=useState<NailConfig[]>(blank);
  const [active,setActive]=useState(0);
  const [decoration,setDecoration]=useState(-1);
  const [status,setStatus]=useState('');
  const canvas=useRef<HTMLCanvasElement>(null);
  const revision=useRef(0);
  const drag=useRef<{pointer:number;finger:number;decoration:number} | undefined>(undefined);
  const nail=nails[active];
  const item=nail.decorations[decoration];

  useEffect(()=>{if(canvas.current)drawBoard(canvas.current,nails,active);},[nails,active]);
  useEffect(()=>()=>{revision.current++;},[]);

  function update(next:Partial<NailConfig>){
    setNails(items=>items.map((work,index)=>index===active?{...work,...next}:work));
  }

  function move(finger:number,index:number,next:Partial<Decoration>){
    setNails(items=>items.map((work,i)=>i===finger?{
      ...work,decorations:work.decorations.map((value,j)=>j===index?{...value,...next}:value),
    }:work));
  }

  function add(type:Decoration['type']){
    if(nail.decorations.length>=maxDecorations)return;
    setDecoration(nail.decorations.length);
    update({decorations:[...nail.decorations,{type,x:0,y:Math.min(36,-30+nail.decorations.length*14)}]});
  }

  async function importSettings(file:File){
    const version=++revision.current;
    try{
      if(file.size>24_000)throw Error('File too large');
      const parsed=restoreDesign(await file.text());
      if(version!==revision.current)return;
      setNails(parsed);setActive(0);setDecoration(-1);setStatus('JSONの設定を復元しました。');
    }catch{
      if(version===revision.current)setStatus('設定を読み込めませんでした。このデモで保存したJSONを選んでください。');
    }
  }

  return <Lab id="I12" title="5本のデザインを作る" guide="指を選び、形・色・柄・飾りを組み合わせます。飾りは画面上でドラッグするか、位置のスライダーで調整できます。">
    <canvas className={s.surface+' '+s.board} ref={canvas} width={width} height={height} role="img" aria-label="5本のネイルデザインのプレビュー"
      onPointerDown={event=>{
        if(!event.isPrimary||event.button!==0)return;
        const p=point(event),index=clamp(Math.round((p.x-center(0))/170),0,fingerCount-1);
        const x=(p.x-center(index))/scale,y=(p.y-centerY)/scale;
        const position=nails[index].decorations.findLastIndex(mark=>Math.hypot(mark.x-x,mark.y-y)<=14);
        setActive(index);setDecoration(position);
        if(position<0)return;
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current={pointer:event.pointerId,finger:index,decoration:position};
      }} onPointerMove={event=>{
        const target=drag.current;if(target?.pointer!==event.pointerId)return;
        const p=point(event);move(target.finger,target.decoration,{x:clamp((p.x-center(target.finger))/scale,-32,32),y:clamp((p.y-centerY)/scale,-58,46)});
      }} onLostPointerCapture={()=>{drag.current=undefined;}}/>
    <Choices label="編集する指" options={fingers} value={fingers[active]} change={value=>{setActive(fingers.indexOf(value));setDecoration(-1);}}/>
    <div className={s.controls}>
      <label>ネイル形状<select value={nail.shape} onChange={event=>update({shape:shapes.find(shape=>shape===event.target.value)??defaultNail.shape})}>{shapes.map(shape=><option key={shape}>{shape}</option>)}</select></label>
      <label>デザインパターン<select value={nail.pattern} onChange={event=>update({pattern:patterns.find(pattern=>pattern===event.target.value)??defaultNail.pattern})}>{patterns.map(pattern=><option key={pattern}>{pattern}</option>)}</select></label>
      <label>ベースカラー<input type="color" value={nail.base} onChange={event=>update({base:event.target.value})}/></label>
      <label>アクセントカラー<input type="color" value={nail.accent} onChange={event=>update({accent:event.target.value})}/></label>
    </div>
    <div className={s.row}>
      <button type="button" aria-pressed={nail.pattern==='French'} onClick={()=>update({pattern:nail.pattern==='French'?'One Color':'French'})}>フレンチに切り替え</button>
      <button type="button" onClick={()=>setNails(nails.map(()=>nail))}>このデザインを5本に適用</button>
    </div>
    <section className={s.panel}><h4>飾り</h4><div className={s.row}>
      <button type="button" disabled={nail.decorations.length>=maxDecorations} onClick={()=>add('stone')}>ストーンを追加</button>
      <button type="button" disabled={nail.decorations.length>=maxDecorations} onClick={()=>add('pearl')}>パールを追加</button></div>
      {!!nail.decorations.length&&<div className={s.row} role="group" aria-label="調整する飾り">{nail.decorations.map((value,index)=>
        <button key={index} type="button" aria-pressed={index===decoration} onClick={()=>setDecoration(index)}>{value.type==='stone'?'ストーン ':'パール '}{index+1}</button>)}</div>}
      {item&&<div className={s.controls}>
        <Range label="飾りの横位置" value={item.x} min={-32} max={32} change={x=>move(active,decoration,{x})}/>
        <Range label="飾りの縦位置" value={item.y} min={-58} max={46} change={y=>move(active,decoration,{y})}/>
        <button type="button" onClick={()=>{update({decorations:nail.decorations.filter((_,index)=>index!==decoration)});setDecoration(-1);}}>選択した飾りを外す</button>
      </div>}
    </section>
    <div className={s.row}><button type="button" className={s.primary} onClick={async()=>{
      const output=document.createElement('canvas');output.width=width;output.height=height;drawBoard(output,nails);
      try{download(await savePng(output),'mellow-nail-design.png');setStatus('PNGを保存します。');}catch{setStatus('画像を保存できませんでした。');}
    }}>画像をPNGで保存</button>
      <button type="button" onClick={()=>{download(new Blob([serializeDesign(nails)],{type:'application/json'}),'mellow-nail-design.json');setStatus('JSONを保存します。');}}>設定をJSONで保存</button>
      <button type="button" onClick={()=>{revision.current++;setNails(blank());setActive(0);setDecoration(-1);setStatus('');}}>デザインをリセット</button>
    </div>
    <label>保存した設定を復元<input type="file" accept=".json,application/json" onChange={event=>{
      const file=event.target.files?.[0];event.target.value='';if(file)void importSettings(file);
    }}/></label>
    <p role="status">{status}</p>
  </Lab>;
}
