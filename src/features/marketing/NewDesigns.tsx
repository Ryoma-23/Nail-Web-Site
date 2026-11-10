'use client';
import { useState } from 'react';
import { publishedDesigns, sampleDate } from './data';
import { newest } from './logic';
import { Choices, DesignShowcase, MarketingDemo } from './ui';

export default function NewDesigns() {
  const [date, setDate] = useState(sampleDate);
  const [limit, setLimit] = useState('6件');
  const [mode, setMode] = useState('一覧');
  const items = newest(publishedDesigns, date, Number.parseInt(limit, 10));
  return <MarketingDemo id="B02" title="新しく加わったデザイン" guide="基準日を含む過去30日間の新作です。件数と表示方法を変え、作品をタップして詳細を開けます。">
    <label>新作の基準日<input type="date" value={date} onChange={event => setDate(event.target.value)} /></label>
    <Choices label="表示件数" options={['3件','6件','9件']} value={limit} change={setLimit} />
    <Choices label="作品の表示方法" options={['一覧','スライダー']} value={mode} change={setMode} />
    <p role="status">{items.length}件の新作</p><DesignShowcase items={items} mode={mode === '一覧' ? 'cards' : 'rail'} />
  </MarketingDemo>;
}
