'use client';
import { useState } from 'react';
import { sampleDesigns } from '../gallery/data';
import { Choices, DesignShowcase, MarketingDemo } from './ui';

const modes = { ランキングカード: 'cards', 横スクロール: 'rail', 雑誌風: 'editorial' } as const;
type Mode = keyof typeof modes;
const topFive = [...sampleDesigns].sort((a,b) => b.popularity-a.popularity).slice(0,5).map(design => ({ design }));
export default function PopularDesigns() {
  const [mode, setMode] = useState<Mode>('ランキングカード');
  return <MarketingDemo id="B03" title="人気デザイン TOP 5" guide="同じ5作品を3つのレイアウトで比較できます。作品を選ぶと詳細を表示します。">
    <p>架空のサンプルランキングです。実際の顧客評価や閲覧数は使っていません。</p>
    <Choices label="ランキングの表示方法" options={Object.keys(modes) as Mode[]} value={mode} change={setMode} />
    <DesignShowcase items={topFive} ranked mode={modes[mode]} />
  </MarketingDemo>;
}
