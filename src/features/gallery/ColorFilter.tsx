'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { colors, sampleDesigns } from './data';
import { Demo, Grid } from './ui';
import s from './gallery.module.css';

type Color = keyof typeof colors;
const palette = Object.entries(colors) as [Color, string][];

export default function ColorFilter() {
  const [selected, setSelected] = useState<Color[]>([]);
  const designs = selected.length ? sampleDesigns.filter(item => item.colors.some(color => selected.includes(color))) : sampleDesigns;
  return <Demo label="G03" title="今日の気分は何色？" guide="好きな色をいくつでも選べます。選んだ色のいずれかを含む作品が表示されます。">
    <div className={s.row} role="group" aria-label="使用カラー">{palette.map(([name, color]) =>
      <button type="button" key={name} aria-pressed={selected.includes(name)}
        onClick={() => setSelected(current => current.includes(name) ? current.filter(item => item !== name) : [...current, name])}>
        <span className={s.swatch} style={{ backgroundColor: color }} />{name}{selected.includes(name) && <Check size={14} aria-hidden="true" />}
      </button>)}</div>
    <div className={s.bar}><span role="status">{selected.length} 色を選択 · {designs.length} 件</span>
      <button type="button" onClick={() => setSelected([])} disabled={!selected.length}>すべて解除</button></div>
    <Grid designs={designs} animatedKey={selected.join(',')} />
  </Demo>;
}
