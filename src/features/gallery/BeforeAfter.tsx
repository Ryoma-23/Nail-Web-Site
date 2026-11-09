'use client';

import { useState } from 'react';
import { comparison } from './data';
import { Art, Demo, Lightbox } from './ui';
import s from './gallery.module.css';

export default function BeforeAfter() {
  const [index, setIndex] = useState<number | null>(null);
  return <Demo label="G10" title="カラーを塗る前と後" guide="同じネイルチップのイラストで仕上がりを比較できます。画像をタップすると拡大します。">
    <div className={s.pair}>{comparison.map((item, index) => <figure key={item.label}>
      <button type="button" className={s.artButton} aria-label={item.label + 'を拡大'} onClick={() => setIndex(index)}>
        <Art src={item.src} alt={item.alt} />
      </button><figcaption><strong>{item.label}</strong> · {index === 0 ? 'カラー前' : '仕上がり'}</figcaption>
    </figure>)}</div>
    <p className={s.notice}>施術記録の写真の代わりに、説明用イラストを使っています。</p>
    {index !== null && <Lightbox slides={comparison} start={index} onClose={() => setIndex(null)} />}
  </Demo>;
}
