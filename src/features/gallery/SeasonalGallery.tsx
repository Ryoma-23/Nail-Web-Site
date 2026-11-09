'use client';

import { useId, useRef, useState } from 'react';
import { sampleDesigns, seasons } from './data';
import { Demo, Grid } from './ui';
import s from './gallery.module.css';

const themes = {
  Spring: ['#f6dfe6', '春の花や柔らかな日差しに合う、軽やかな色を集めました。'],
  Summer: ['#dceff1', '夏の光に映える、涼しげなブルーやシェルのデザイン。'],
  Autumn: ['#f0dfd1', '装いに深みを添えるブラウンや落ち着いた赤。'],
  Winter: ['#e8e3f1', '冬の澄んだ空気に似合うホワイトや深いブルー。'],
} as const;

export default function SeasonalGallery() {
  const [season, setSeason] = useState<typeof seasons[number]>('Spring');
  const id = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const [color, note] = themes[season];
  return <Demo label="G04" title="四季のネイルコレクション" guide="季節のタブを選ぶと、紹介文と作品が切り替わります。">
    <div className={s.row} role="tablist" aria-label="季節">{seasons.map((item, index) =>
      <button type="button" key={item} id={id + item} ref={element => { buttons.current[index] = element; }}
        role="tab" aria-controls={id + 'panel'} tabIndex={season === item ? 0 : -1}
        aria-selected={season === item} onClick={() => setSeason(item)} onKeyDown={event => {
          const next = { ArrowLeft: (index + 3) % 4, ArrowRight: (index + 1) % 4, Home: 0, End: 3 }[event.key];
          if (next === undefined) return;
          event.preventDefault();
          setSeason(seasons[next]);
          buttons.current[next]?.focus();
        }}>{item}</button>)}</div>
    <div role="tabpanel" tabIndex={0} id={id + 'panel'} aria-labelledby={id + season}>
      <p className={s.season} key={season} style={{ backgroundColor: color }}>{note}</p>
      <Grid designs={sampleDesigns.filter(item => item.seasons.includes(season))} animatedKey={season} />
    </div>
  </Demo>;
}
