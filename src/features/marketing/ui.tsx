'use client';
import { useRef, useState, type ReactNode } from 'react';
import { Art, Demo } from '../gallery/ui';
import type { NailDesign } from '../gallery/data';
import { DesignModal } from '../gallery/DesignDetail';
import s from './marketing.module.css';

export function MarketingDemo({ id, title, guide, children }: { id: string; title: string; guide: string; children: ReactNode }) {
  return <Demo label={id} title={title} guide={guide}><div className={s.layout}>{children}</div></Demo>;
}

export function Choices<T extends string>({ label, options, value, change }: { label: string; options: readonly T[]; value: T; change: (value: T) => void }) {
  return <div className={s.row} role="group" aria-label={label}>{options.map(option =>
    <button key={option} type="button" aria-pressed={value === option} onClick={() => change(option)}>{option}</button>)}</div>;
}

export function DesignShowcase({ items, mode = 'cards', ranked = false }: {
  items: readonly { design: NailDesign; date?: string }[]; mode?: 'cards' | 'rail' | 'editorial'; ranked?: boolean;
}) {
  const [selected, setSelected] = useState<NailDesign>();
  const rail = useRef<HTMLOListElement>(null);
  function move(direction: number) {
    const list = rail.current;
    const card = list?.firstElementChild;
    if (!list || !card) return;
    list.scrollBy({ left: direction * (card.getBoundingClientRect().width + 12),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  if (!items.length) return <p className={s.notice}>この期間に公開された作品はありません。基準日を変えてお試しください。</p>;
  return <>
    <ol ref={rail} className={s[mode]} aria-label="作品一覧" tabIndex={mode === 'rail' ? 0 : undefined}>{items.map(({ design, date }, index) =>
      <li key={design.id} className={s.card}>
        <button type="button" className={s.imageButton} aria-label={design.title + 'の詳細'} onClick={() => setSelected(design)}>
          <Art src={design.images[0]} alt={design.title + 'のネイルチップ見本'} />
        </button>
        <div className={s.stack}>
          <div className={s.row}>{ranked && <span className={s.badge}>第{index + 1}位</span>}{date && <span className={s.badge}>NEW</span>}<small>{design.category}</small></div>
          <h4>{design.title}</h4>{date && <time dateTime={date}>{date}</time>}
        </div>
      </li>)}</ol>
    {mode === 'rail' && <div className={s.row}><button type="button" onClick={() => move(-1)}>前の作品</button><button type="button" onClick={() => move(1)}>次の作品</button></div>}
    {selected && <DesignModal key={selected.id} design={selected} onClose={() => setSelected(undefined)} />}
  </>;
}

export function CopyControl({ value, label = 'URLをコピー' }: { value: string; label?: string }) {
  const [status, setStatus] = useState<{ value: string; copied: boolean }>();
  const current = status?.value === value ? status : undefined;
  async function copy() {
    try { await navigator.clipboard.writeText(value); setStatus({ value, copied: true }); }
    catch { setStatus({ value, copied: false }); }
  }
  return <div className={s.stack}>
    <button type="button" onClick={copy}>{label}</button>
    {current && <p role="status">{current.copied ? 'URLをコピーしました。' : '下の欄からURLをコピーできます。'}</p>}
    {current && !current.copied && <input aria-label="コピー用URL" readOnly value={value} onFocus={event => event.currentTarget.select()} />}
  </div>;
}
