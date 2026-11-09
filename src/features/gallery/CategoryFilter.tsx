'use client';

import { useState } from 'react';
import { categories, sampleDesigns } from './data';
import { Demo, Grid } from './ui';
import s from './gallery.module.css';

export default function CategoryFilter() {
  const [category, setCategory] = useState<'ALL' | typeof categories[number]>('ALL');
  const designs = category === 'ALL' ? sampleDesigns : sampleDesigns.filter(item => item.category === category);
  return <Demo label="G02" title="デザインの種類から探す" guide="カテゴリーを選ぶと、該当する作品と件数が切り替わります。">
    <div className={s.row} role="group" aria-label="デザインカテゴリー">{(['ALL', ...categories] as const).map(item =>
      <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
    <p role="status">{designs.length} 件の作品</p>
    <Grid designs={designs} animatedKey={category} />
  </Demo>;
}
