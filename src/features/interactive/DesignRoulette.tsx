'use client';
import { useEffect, useRef, useState } from 'react';
import { categories, sampleDesigns, type NailDesign } from '../gallery/data';
import { DesignCard, Lab } from './ui';
import s from './interactive.module.css';

const swatches = ['#f0ccd9','#d1bfdc','#ddd2ef','#e9d7bf','#b9ced6','#edb8c4'];
export default function DesignRoulette() {
  const [category,setCategory] = useState('');
  const [angle,setAngle] = useState(0);
  const [spinning,setSpinning] = useState(false);
  const [result,setResult] = useState<NailDesign>();
  const timer = useRef<number>(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const pool = sampleDesigns.filter(item=>!category || item.category===category);
  function spin() {
    if (!pool.length || spinning) return;
    const index = Math.floor(Math.random()*pool.length);
    const position = (360 - (index+.5)*360/pool.length) % 360;
    const offset = (position - (angle % 360) + 360) % 360;
    setAngle(angle + 1080 + offset);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setResult(pool[index]); return; }
    setSpinning(true);
    setResult(undefined);
    timer.current = window.setTimeout(()=>{ setResult(pool[index]); setSpinning(false); },800);
  }
  const sectors = pool.map((_,index)=>swatches[index%swatches.length] + ' ' + index*100/pool.length + '% ' + (index+1)*100/pool.length + '%');
  return <Lab id="I03" title="デザインルーレット" guide="カテゴリーを選んで回すと、その中から作品を1件提案します。">
    <label>候補のカテゴリー<select disabled={spinning} value={category} onChange={event=>{setCategory(event.target.value);setResult(undefined);}}>
      <option value="">すべて</option>{categories.map(name=><option key={name}>{name}</option>)}</select></label>
    <div className={s.wheelBox} aria-hidden="true"><span className={s.pointer}>▼</span><div className={s.wheel} style={{ transform:'rotate('+angle+'deg)',background:sectors.length ? 'conic-gradient('+sectors.join(',')+')' : '#eadbe2' }}><span>MELLOW</span></div></div>
    <button type="button" className={s.primary} onClick={spin} disabled={spinning||!pool.length}>{spinning ? '回転中…' : result ? 'もう一度回す' : 'スタート'}</button>
    <p role="status">{!pool.length ? 'このカテゴリーの候補はありません。' : result ? '選ばれた作品 · '+result.title : '候補 '+pool.length+'件'}</p>
    {result && <DesignCard design={result} />}
  </Lab>;
}
