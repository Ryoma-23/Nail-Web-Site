'use client';

import { useState } from 'react';
import { sampleDesigns, type NailDesign } from './data';
import { Art, Demo, Grid } from './ui';
import s from './gallery.module.css';

function similarity(base: NailDesign, candidate: NailDesign) {
  const category = base.category === candidate.category;
  const colors = candidate.colors.filter(color => base.colors.includes(color));
  const tags = candidate.tags.filter(tag => base.tags.includes(tag));
  const score = Number(category) * 3 + colors.length * 2 + tags.length;
  const reasons = [
    ...(category ? [candidate.category + 'のデザイン'] : []),
    ...colors,
    ...tags,
  ];
  return { candidate, score, reason: reasons.join('・') + 'が共通' };
}

export default function SimilarDesigns() {
  const [id, setId] = useState(sampleDesigns[0].id);
  const base = sampleDesigns.find(item => item.id === id) ?? sampleDesigns[0];
  const results = sampleDesigns.filter(item => item.id !== base.id).map(item => similarity(base, item))
    .filter(item => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 4);

  return <Demo label="G14" title="このデザインが好きなら" guide="基準の作品を選ぶと、カテゴリー・色・雰囲気が近い作品を表示します。">
    <label>基準の作品<select value={id} onChange={event => setId(event.target.value)}>
      {sampleDesigns.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
    </select></label>
    <div className={s.rank}><span>基準</span><Art src={base.images[0]} alt={base.title + 'のネイルチップ見本'} /><strong>{base.title}</strong></div>
    <p role="status">関連作品 {results.length} 件</p>
    <Grid designs={results.map(item => item.candidate)} animatedKey={id}
      extra={design => <p className={s.notice}>{results.find(item => item.candidate.id === design.id)?.reason}</p>} />
  </Demo>;
}
