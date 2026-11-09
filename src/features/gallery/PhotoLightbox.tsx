'use client';

import { useState } from 'react';
import { sampleDesigns } from './data';
import { Demo, Grid, Lightbox } from './ui';

const designs = sampleDesigns.slice(0, 6);
const slides = designs.map(item => ({ src: item.images[0], alt: item.title + 'のネイルチップ見本', label: item.title }));

export default function PhotoLightbox() {
  const [index, setIndex] = useState<number | null>(null);
  return <Demo label="G06" title="手元のディテールを拡大" guide="画像を開いたら、矢印ボタン・左右キー・横スワイプで別の画像に切り替えられます。">
    <Grid designs={designs} onOpen={item => setIndex(designs.indexOf(item))} />
    {index !== null && <Lightbox slides={slides} start={index} onClose={() => setIndex(null)} />}
  </Demo>;
}
