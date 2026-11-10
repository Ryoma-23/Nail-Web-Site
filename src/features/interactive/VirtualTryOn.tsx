'use client';
import { useEffect, useRef, useState } from 'react';
import { colors, sampleDesigns } from '../gallery/data';
import { Choices } from '../marketing/ui';
import { clamp, download, point, savePng } from './canvas';
import { imageAccept, useLocalImage } from './localImage';
import { defaultNail, paintNail, type Pattern } from './nailArt';
import { fingers, initialOverlays, paintHand, type Overlay } from './tryOnData';
import { DesignPicker, Lab, Range } from './ui';
import s from './interactive.module.css';

const samples=['サンプルの手 A','サンプルの手 B'] as const;
type Sample=typeof samples[number];
const width=900,height=600;
const patterns:Record<string,Pattern>={FRENCH:'French',NUANCE:'Marble',ART:'Glitter',MAGNET:'Gradation',GRADATION:'Gradation'};

export default function VirtualTryOn(){
  const {image,error,loading,load,reset}=useLocalImage();
  const [sample,setSample]=useState<Sample>(samples[0]);
  const [design,setDesign]=useState('rose');
  const [overlays,setOverlays]=useState(initialOverlays);
  const [active,setActive]=useState(0);
  const [status,setStatus]=useState('');
  const canvas=useRef<HTMLCanvasElement>(null);
  const drag=useRef<{id:number;index:number;dx:number;dy:number} | undefined>(undefined);
  const current=overlays[active];

  function change(index:number,next:Partial<Overlay>){setOverlays(items=>items.map((item,i)=>i===index?{...item,...next}:item));}

  useEffect(()=>{
    const ctx=canvas.current?.getContext('2d');
    if(!ctx)return;
    ctx.fillStyle='#f4e5e7';ctx.fillRect(0,0,width,height);
    if(image){
      const imageScale=Math.min(width/image.bitmap.width,height/image.bitmap.height);
      const w=image.bitmap.width*imageScale,h=image.bitmap.height*imageScale;
      ctx.drawImage(image.bitmap,(width-w)/2,(height-h)/2,w,h);
    }else paintHand(ctx,sample===samples[0]?'#e9b19d':'#c98870');
    const work=sampleDesigns.find(item=>item.id===design);
    if(!work)return;
    const nail={...defaultNail,base:colors[work.colors[0]],accent:work.colors[1]?colors[work.colors[1]]:'#f7dedf',pattern:patterns[work.category]??'One Color'};
    overlays.forEach(item=>{
      ctx.save();ctx.translate(item.x,item.y);ctx.rotate(item.rotation*Math.PI/180);ctx.scale(item.size,item.size);
      ctx.globalAlpha=item.opacity;paintNail(ctx,nail);ctx.restore();
    });
  },[design,image,overlays,sample]);

  return <Lab id="I09" title="指先に色を重ねて試す" guide="簡易合成デモであり、実際の仕上がりを保証するものではありません。爪の位置は手動で合わせます。">
    <Choices label="手の見本" options={samples} value={image?'':sample} change={item=>{if(item==='')return;reset();setSample(item);setOverlays(initialOverlays);}} />
    <label>手の写真を選ぶ<input type="file" accept={imageAccept} onChange={event=>{
      const file=event.target.files?.[0];event.target.value='';if(file){setStatus('');setOverlays(initialOverlays);void load(file);}
    }}/></label>
    <p>JPEG・PNG・WebP、10 MB以内。写真はブラウザ内で処理します。</p>
    {loading&&<p role="status">写真を読み込んでいます…</p>}{error&&<p role="alert">{error}</p>}
    <DesignPicker label="重ねるデザイン" value={design} change={setDesign} />
    <canvas ref={canvas} className={s.surface} width={width} height={height} role="img" aria-label="手の画像とネイルの合成プレビュー"
      onPointerDown={event=>{
        if(!event.isPrimary||event.button!==0)return;
        const p=point(event);
        const nearest=overlays.reduce((best,item,i)=>Math.hypot(item.x-p.x,item.y-p.y)<Math.hypot(overlays[best].x-p.x,overlays[best].y-p.y)?i:best,0);
        if(Math.hypot(overlays[nearest].x-p.x,overlays[nearest].y-p.y)>55)return;
        setActive(nearest);event.currentTarget.setPointerCapture(event.pointerId);
        drag.current={id:event.pointerId,index:nearest,dx:overlays[nearest].x-p.x,dy:overlays[nearest].y-p.y};
      }} onPointerMove={event=>{
        const last=drag.current;if(last?.id!==event.pointerId)return;
        const p=point(event);change(last.index,{x:clamp(p.x+last.dx,0,width),y:clamp(p.y+last.dy,0,height)});
      }} onLostPointerCapture={()=>{drag.current=undefined;}}/>
    <Choices label="調整する指" options={fingers} value={fingers[active]} change={item=>setActive(fingers.indexOf(item))}/>
    <div className={s.controls}>
      <Range label="横位置" value={current.x} min={0} max={width} change={x=>change(active,{x})}/>
      <Range label="縦位置" value={current.y} min={0} max={height} change={y=>change(active,{y})}/>
      <Range label="サイズ" value={current.size} min={.2} max={1.8} step={.05} change={size=>change(active,{size})}/>
      <Range label="回転" value={current.rotation} min={-180} max={180} change={rotation=>change(active,{rotation})}/>
      <Range label="透明度" value={current.opacity} min={.15} max={1} step={.05} change={opacity=>change(active,{opacity})}/>
    </div>
    <div className={s.row}><button type="button" className={s.primary} disabled={loading||!design} onClick={async()=>{
      try{download(await savePng(canvas.current),'mellow-try-on.png');setStatus('PNGの保存を開始しました。');}catch{setStatus('画像を保存できませんでした。');}
    }}>合成画像を保存</button><button type="button" onClick={()=>{reset();setSample(samples[0]);setDesign('rose');setActive(0);setOverlays(initialOverlays);setStatus('');}}>試着をリセット</button></div>
    <p role="status">{status}</p>
  </Lab>;
}
