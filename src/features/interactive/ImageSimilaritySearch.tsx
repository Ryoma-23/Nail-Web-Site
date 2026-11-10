'use client';
import { useEffect, useRef, useState } from 'react';
import { compareColors, dominantColor } from './imageSimilarity';
import { imageAccept, useLocalImage } from './localImage';
import { DesignCard, Lab, Swatch } from './ui';
import s from './interactive.module.css';

export default function ImageSimilaritySearch() {
  const {image,error,loading,load,reset}=useLocalImage();
  const [color,setColor]=useState<[number,number,number]>();
  const view=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const element=view.current;
    if(!element||!image) return;
    const context=element.getContext('2d',{willReadFrequently:true});
    if(!context) return;
    const {bitmap}=image;
    element.width=Math.max(1,Math.round(bitmap.width/Math.max(bitmap.width,bitmap.height)*160));
    element.height=Math.max(1,Math.round(bitmap.height/Math.max(bitmap.width,bitmap.height)*160));
    context.drawImage(bitmap,0,0,element.width,element.height);
    const result=dominantColor(context.getImageData(0,0,element.width,element.height).data);
    const frame=requestAnimationFrame(()=>setColor(result));
    return ()=>cancelAnimationFrame(frame);
  },[image]);
  const results=image&&color ? compareColors(color) : [];
  return <Lab id="I06" title="写真の色から作品を探す" guide="色の類似度に基づく簡易検索です。写真はブラウザ内で処理します。">
    <label>検索する画像<input type="file" accept={imageAccept} onChange={event=>{
      const file=event.target.files?.[0];event.target.value='';if(file){setColor(undefined);void load(file);}
    }}/></label>
    <p>JPEG・PNG・WebP、10 MB以内。</p>
    {error&&<p role="alert">{error}</p>}{loading&&<p role="status">画像を読み込んでいます…</p>}
    {image&&<><canvas ref={view} className={s.previewImage} role="img" aria-label="アップロードした画像のプレビュー"/>
      {color?<p className={s.row}><Swatch color={'rgb('+color.join(',')+')'} label="画像の代表色" /></p>:<p>代表色を抽出できるピクセルを確認しています。透明のみの画像は検索できません。</p>}</>}
    {!!results.length&&<div className={s.grid}>{results.map(({design,score})=><DesignCard key={design.id} design={design}><p>色の近さ · {score} / 100</p></DesignCard>)}</div>}
    <button type="button" onClick={()=>{reset();setColor(undefined);}}>画像を破棄してリセット</button>
  </Lab>;
}
