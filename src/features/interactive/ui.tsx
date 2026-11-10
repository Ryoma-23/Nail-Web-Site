'use client';
import { useState, type ReactNode } from 'react';
import { Demo, Art } from '../gallery/ui';
import { DesignModal } from '../gallery/DesignDetail';
import { sampleDesigns, type NailDesign } from '../gallery/data';
import { yen } from '../menu/data';
import s from './interactive.module.css';

export function Lab({ id, title, guide, children }: { id: string; title: string; guide: string; children: ReactNode }) {
  return <Demo label={id} title={title} guide={guide}><div className={s.lab}>{children}</div></Demo>;
}
export function DesignPicker({ label, value, change, exclude }: { label: string; value: string; change: (id: string) => void; exclude?: string }) {
  return <label>{label}<select value={value} onChange={event => change(event.target.value)}>
    <option value="">選択してください</option>{sampleDesigns.filter(item => item.id !== exclude).map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
  </select></label>;
}
export function DesignCard({ design, children }: { design: NailDesign; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <article className={s.card}>
    <button className={s.imageButton} type="button" aria-label={design.title + 'の詳細を見る'} onClick={() => setOpen(true)}>
      <Art src={design.images[0]} alt={design.title + 'のネイルチップ見本'} /></button>
    <h4>{design.title}</h4><small>{design.category} · {design.colors.join(' / ')} · 参考 {yen(design.price)}</small>
    <p>{design.description}</p>{children}
    {open && <DesignModal design={design} onClose={() => setOpen(false)} />}
  </article>;
}
export function CopyText({ value, label }: { value: string; label: string }) {
  const [state, setState] = useState<'ok' | 'manual'>();
  return <div className={s.stack}><button type="button" onClick={async () => {
    try { await navigator.clipboard.writeText(value); setState('ok'); } catch { setState('manual'); }
  }}>{label}</button>
  {state && <p role="status">{state === 'ok' ? 'コピーしました。' : '下の欄からコピーできます。'}</p>}
  {state === 'manual' && <textarea aria-label="コピー用テキスト" readOnly value={value} onFocus={event => event.currentTarget.select()} />}
  </div>;
}
export function Swatch({ color, label }: { color: string; label: string }) {
  return <><span className={s.dot} style={{ backgroundColor: color }} aria-hidden="true" />{label}</>;
}
export function Range({ label, value, change, min, max, step = 1 }: {
  label: string; value: number; change: (value: number) => void; min: number; max: number; step?: number;
}) {
  return <label>{label} <output>{Math.round(value * 100) / 100}</output><input type="range" aria-label={label} min={min} max={max} step={step} value={value} onChange={event => change(Number(event.target.value))} /></label>;
}
