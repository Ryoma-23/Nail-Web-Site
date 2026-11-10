import type { CSSProperties } from 'react';
import type { Playback } from './ui';
import s from './animation.module.css';

export type ParticleKind='sparkle'|'petal'|'leaf'|'snow'|'water';
export function Particles({kind,count,color,duration,playback}:{
  kind:ParticleKind;count:number;color:string;duration:number;playback:Playback;
}){
  return <div className={s.particles} aria-hidden="true" key={playback.run}>
    {Array.from({length:count},(_,i)=>{
      const size=kind==='water'?22+(i*13)%45:kind==='sparkle'?5+(i*3)%9:7+(i*5)%13;
      return <span key={i} data-particle={kind} className={playback.started&&!playback.reduced?s.motion:undefined}
        style={{'--particle-color':color,'--size':size+'px','--left':(i*37+7)%100+'%','--top':(i*23+8)%100+'%',
          '--sway':(i%2===0?1:-1)*(18+(i*7)%55)+'px','--duration':(duration+(i%5)*.37)+'s','--particle-delay':-(i%13)*.7+'s'} as CSSProperties}/>;
    })}
  </div>;
}