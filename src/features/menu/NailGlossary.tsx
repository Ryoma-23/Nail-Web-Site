'use client';
import { useEffect, useId, useState } from 'react';
import { glossary } from './glossary';
import { MenuDemo } from './ui';
import s from './menu.module.css';

const rows = ['あ行', 'か行', 'さ行', 'な行', 'は行', 'ま行', 'わ行'];
const categories = ['デザイン', '施術', '素材', 'ブランド'];
const normalize = (value: string) => value.normalize('NFKC').replace(/[ァ-ヶ]/g, char => String.fromCharCode(char.charCodeAt(0) - 96)).trim();

export default function NailGlossary() {
  const [query, setQuery] = useState('');
  const [row, setRow] = useState('');
  const [category, setCategory] = useState('');
  const [target, setTarget] = useState<{ id: string }>();
  const prefix = useId();
  const termId = (id: string) => prefix + '-' + id;
  const results = glossary.filter(term =>
    (!row || row === term.row) && (!category || category === term.category) &&
    normalize(term.name + ' ' + term.reading + ' ' + term.intro).includes(normalize(query)),
  ).sort((a, b) => a.reading.localeCompare(b.reading, 'ja'));

  useEffect(() => {
    if (!target) return;
    const item = document.getElementById(prefix + '-' + target.id);
    if (item instanceof HTMLDetailsElement) {
      item.open = true;
      item.querySelector('summary')?.focus();
    }
  }, [target, prefix]);

  return <MenuDemo id="M11" title="はじめてのネイル用語集" guide="気になる言葉を検索し、カードを開いて詳しい意味を確認できます。">
    <label>用語を検索<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="例　マグネット" /></label>
    <div className={s.grid}>
      <label>五十音<select value={row} onChange={event => setRow(event.target.value)}><option value="">すべて</option>{rows.map(item => <option key={item}>{item}</option>)}</select></label>
      <label>カテゴリー<select value={category} onChange={event => setCategory(event.target.value)}><option value="">すべて</option>{categories.map(item => <option key={item}>{item}</option>)}</select></label>
    </div>
    <p role="status">{results.length} 件{results.length === 0 && ' · 条件を変えてお試しください。'}</p>
    <div className={s.glossary}>{results.map(term => <details key={term.id} id={termId(term.id)}>
      <summary><strong>{term.name}</strong> <span className={s.badge}>{term.category}</span><span className={s.facts}>{term.intro}</span></summary>
      <p>{term.detail}</p>
      <div className={s.buttons}>関連用語{term.related.map(id => <a key={id} href={'#' + termId(id)} onClick={event => {
        event.preventDefault();
        setQuery('');
        setRow('');
        setCategory('');
        setTarget({ id });
      }}>{glossary.find(item => item.id === id)?.name}</a>)}</div>
    </details>)}</div>
  </MenuDemo>;
}
