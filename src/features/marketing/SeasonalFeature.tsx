'use client';
import { useState } from 'react';
import { sampleDesigns, seasons } from '../gallery/data';
import { seasonCopy } from './data';
import { Choices, DesignShowcase, MarketingDemo } from './ui';
import s from './marketing.module.css';

const labels = seasons.map(season => seasonCopy[season].label);
export default function SeasonalFeature() {
  const [label, setLabel] = useState('春');
  const season = seasons[labels.indexOf(label)];
  const theme = seasonCopy[season];
  const items = sampleDesigns.filter(design => design.seasons.includes(season)).slice(0,4).map(design => ({ design }));
  return <MarketingDemo id="B04" title="四季のおすすめ" guide="春・夏・秋・冬を選ぶと、色と作品、季節限定メニューが切り替わります。">
    <Choices label="季節" options={labels} value={label} change={setLabel} />
    <section key={season} className={s.season} style={{ background: theme.color }}>
      <span className={s.kicker}>{season}</span><h4>{theme.headline}</h4><p>季節限定メニュー（例） · {theme.menu}</p>
      <DesignShowcase items={items} />
    </section>
  </MarketingDemo>;
}
