'use client';
import { useRef, useState } from 'react';
import { Modal } from '../gallery/ui';
import { PhotoView } from '../profile/ui';
import type { Article } from '../profile/content';
import { marketingArticles } from './data';
import { Choices, MarketingDemo } from './ui';
import s from './marketing.module.css';

const layouts = { カードグリッド: 'cards', リスト形式: 'blogList', 雑誌風: 'editorial' } as const;
type Layout = keyof typeof layouts;

function Metadata({ entry }: { entry: Article }) {
  return <p className={s.kicker}><time dateTime={entry.publishedAt}>{entry.publishedAt}</time> · {entry.category} · 約{entry.minutes}分</p>;
}

export function BlogLibrary({ items }: { items: readonly Article[] }) {
  const [mode, setMode] = useState<Layout>('カードグリッド');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('すべて');
  const [selected, setSelected] = useState<Article>();
  const body = useRef<HTMLDivElement>(null);
  const key = query.normalize('NFKC').trim().toLowerCase();
  const visible = items.filter(entry => (category === 'すべて' || entry.category === category) &&
    [entry.title, entry.summary, ...entry.content].join(' ').normalize('NFKC').toLowerCase().includes(key));

  return <>
    <Choices label="記事のレイアウト" options={Object.keys(layouts) as Layout[]} value={mode} change={setMode} />
    <label>記事を検索<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="例：保湿" /></label>
    <Choices label="記事カテゴリー" options={['すべて', ...new Set(items.map(entry => entry.category))]} value={category} change={setCategory} />
    <p role="status">{visible.length}件{visible.length === 0 && ' · 検索条件を変えてお試しください。'}</p>
    <ol className={s[layouts[mode]]}>{visible.map(entry => <li key={entry.id} className={s.card}>
      <PhotoView photo={entry.photo} /><article className={s.stack}><Metadata entry={entry} /><h4>{entry.title}</h4><p>{entry.summary}</p>
        <button type="button" onClick={() => setSelected(entry)}>記事を読む</button></article>
    </li>)}</ol>
    {selected && <Modal title={selected.title} onClose={() => setSelected(undefined)}>
      <div className={s.stack} ref={body} tabIndex={-1} aria-label={selected.title}><Metadata entry={selected} />
        <PhotoView photo={selected.photo} eager />{selected.content.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        <div className={s.stack}><strong>関連記事</strong>{items.filter(entry => selected.related.includes(entry.id)).map(entry =>
          <button type="button" data-related key={entry.id} onClick={() => {
            setSelected(entry);
            body.current?.focus();
            body.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
          }}>{entry.title}</button>)}</div>
      </div>
    </Modal>}
  </>;
}

export default function BlogFeature() {
  return <MarketingDemo id="B09" title="mellow journal" guide="読みたい記事を検索し、カード、リスト、雑誌風の表示を比べてください。">
    <BlogLibrary items={marketingArticles} />
  </MarketingDemo>;
}
