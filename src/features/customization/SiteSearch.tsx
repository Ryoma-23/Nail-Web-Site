'use client';

import { useEffect, useState } from 'react';
import { Choice, Panel } from './Controls';
import { MiniSitePreview } from './MiniSitePreview';
import { content } from './content';
import { defaults } from './settings';
import s from './customization.module.css';

const filters = ['すべて', 'メニュー', 'ギャラリー', 'FAQ', 'お知らせ'] as const;
const jp = content.ja;
const entries = [
  ...jp.menu.map(([title, body, price], index) => ({ category: 'メニュー', title, body: body + ' ' + price, id: 'menu-' + index })),
  ...jp.gallery.map((title, index) => ({ category: 'ギャラリー', title, body: 'ネイル作品', id: 'art-' + index })),
  ...jp.faq.map(([title, body], index) => ({ category: 'FAQ', title, body, id: 'faq-' + index })),
  { category: 'お知らせ', title: jp.news[1], body: jp.news[2], id: 'news' },
];
const normalize = (text: string) => text.normalize('NFKC').toLocaleLowerCase('ja').trim();

export default function SiteSearch() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<typeof filters[number]>('すべて');
  const needle = normalize(query);
  const results = needle ? entries.filter(item => (filter === 'すべて' || filter === item.category) &&
    normalize(item.title + ' ' + item.body).includes(needle)) : [];
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash.startsWith('search-')) document.getElementById(hash)?.scrollIntoView();
  }, []);
  return <div className={s.workspace}>
    <Panel title="ミニサイト内を検索">
      <label>キーワード<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="例：ワンカラー、春、予約"/></label>
      <Choice label="検索対象" options={filters} value={filter} change={setFilter}/>
      <p role="status">{needle ? results.length + '件の検索結果' : '検索したい言葉を入力してください。'}</p>
      {needle && !results.length && <p>一致する情報がありません。別の言葉やカテゴリーでお試しください。</p>}
      {!!results.length && <ul className={s.results}>{results.map(({ category, title, id }) => <li key={id}>
        <a href={'#search-' + id} onClick={() => {
          const target = document.getElementById('search-' + id);
          if (target instanceof HTMLDetailsElement) target.open = true;
        }}>{title}</a> <small>{category}</small>
      </li>)}</ul>}
    </Panel>
    <MiniSitePreview settings={defaults} prefix="search" device="desktop" showNews/>
  </div>;
}

