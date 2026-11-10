'use client';
import { useState, type CSSProperties } from 'react';
import { AnimationFrame, Slider, type Playback } from './ui';
import s from './animation.module.css';
function Scene({started,run,reduced}:Playback){
  const [strength,setStrength]=useState(13);
  const [offset,setOffset]=useState<{x:number;y:number}|null>(null);
  const [selected,setSelected]=useState(false);
  return <><Slider label="引き寄せの強さ" value={strength} min={0} max={22} change={setStrength}/>
    <div className={s.magnetic}><span className={s.eyebrow}>MELLOW / RESERVATION</span><h4>次のネイルを予約する</h4>
      <div className={s.magneticTarget} onPointerMove={event=>{
        if(event.pointerType!=='mouse'||reduced)return;
        const rect=event.currentTarget.getBoundingClientRect();setOffset({x:((event.clientX-rect.left)/rect.width-.5)*strength*2,y:((event.clientY-rect.top)/rect.height-.5)*strength*2});
      }} onPointerLeave={()=>setOffset(null)}>
        <button key={run} type="button" className={s.primary+' '+(started&&!offset?s.motion+' '+s.magneticReplay:'')}
          style={{'--magnet-x':(offset?.x??0)+'px','--magnet-y':(offset?.y??0)+'px','--magnet-limit':strength+'px'} as CSSProperties}
          onClick={()=>setSelected(true)}>空き状況を見る（デモ）</button>
      </div>{selected&&<p role="status">予約導線の見本です。ここから希望日時を選ぶ想定です。</p>}
    </div></>;
}

export default function MagneticButton(){
  return <AnimationFrame id="A22" title="マグネティックボタン" guide="ポインターを枠の中で近づけるとボタンがわずかに動きます。タッチではそのまま押せます。" example="予約ボタンに小さな反応を付ける。" Scene={Scene} />;
}
