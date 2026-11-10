'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { Modal } from '../gallery/ui';
import { format, periods } from './data';
import { useAdmin } from './state';
import s from './operations.module.css';

export const notice = 'デモ管理画面：実際のサイトには反映されません';
export const newId = () => crypto.randomUUID();
export const now = () => new Date().toISOString().slice(0, 16);

export function Panel({ title, help, children }: { title: string; help?: string; children: ReactNode }) {
  return <section className={s.panel}><h3>{title}</h3>{help && <p className={s.muted}>{help}</p>}{children}</section>;
}
export function Select<T extends string>({ label, choices, value, set }: { label: string; choices: readonly T[]; value: T; set: (value: T) => void }) {
  return <label>{label}<select value={value} onChange={event => {
    const next = choices.find(option => option === event.currentTarget.value);
    if (next !== undefined) set(next);
  }}>{choices.map(choice => <option key={choice}>{choice}</option>)}</select></label>;
}
export function PeriodSelect() {
  const { data, set } = useAdmin();
  return <div className={s.buttons} role="group" aria-label="表示期間">{periods.map(period =>
    <button type="button" aria-pressed={period === data.period} key={period} onClick={() => set('period', period)}>過去{period}日</button>)}</div>;
}
export function Metrics({ values }: { values: { label: string; value: string | number; note?: string }[] }) {
  return <dl className={s.metrics}>{values.map(({ label, value, note }) => <div key={label}><dt>{label}</dt><dd>{typeof value === 'number' ? format(value) : value}</dd>{note && <small>{note}</small>}</div>)}</dl>;
}
export function LineChart({ labels, series, unit = '' }: { labels: string[]; series: { label: string; values: number[] }[]; unit?: string }) {
  const peak = Math.max(1, ...series.flatMap(item => item.values));
  return <figure className={s.chart}>
    <div className={s.chartLegend}>{series.map(item => <span key={item.label}>{item.label}</span>)}</div>
    <svg viewBox="0 0 600 155" preserveAspectRatio="none" aria-hidden="true">
      {[12, 55, 98, 141].map(y => <line key={y} x1="12" x2="588" y1={y} y2={y} stroke="#e0d8d5" strokeWidth="1"/>)}
      {series.map((item, index) => <polyline key={item.label} points={item.values.map((value, i) =>
        (12 + 576 * i / Math.max(1, labels.length - 1)) + ',' + (141 - 129 * value / peak)).join(' ')}
        fill="none" stroke={index ? '#745b99' : '#287568'} strokeWidth="2.5" vectorEffect="non-scaling-stroke"/>)}
    </svg>
    <figcaption><span>{labels[0]}</span><span>0–{format(peak)}{unit}</span><span>{labels.at(-1)}</span></figcaption>
    <details><summary>グラフの数値を表示</summary><ul className={s.list}>{labels.map((label, index) => <li key={label}>
      <strong>{label}</strong><span>{series.map(item => item.label + ' ' + format(item.values[index]) + unit).join(' / ')}</span>
    </li>)}</ul></details>
  </figure>;
}
export function Bars({ rows, max, unit = '' }: { rows: { label: string; value: number; caption?: string }[]; max?: number; unit?: string }) {
  const limit = max ?? Math.max(1, ...rows.map(row => row.value));
  return <ul className={s.bars}>{rows.map(({ label, value, caption }) => <li key={label}>
    <div><strong>{label}</strong><span>{caption ?? format(value) + unit}</span></div>
    <span className={s.track} aria-hidden="true"><i style={{ width: Math.min(100, value * 100 / limit) + '%' }}/></span>
  </li>)}</ul>;
}
export function Photo({ src, alt = '' }: { src: string; alt?: string }) {
  return <Image className={s.photo} src={src} alt={alt} width={240} height={180} unoptimized/>;
}
export function EditDialog({ title, close, children }: { title: string; close: () => void; children: ReactNode }) {
  return <Modal title={title} onClose={close}><div className={s.workspace}>{children}</div></Modal>;
}
export function Confirm({ title, close, action, children, label = '削除する' }: { title: string; close: () => void; action: () => void; children: ReactNode; label?: string }) {
  return <EditDialog title={title} close={close}><p>{children}</p><div className={s.buttons}>
    <button type="button" onClick={close}>キャンセル</button><button className={s.primary} type="button" onClick={() => { action(); close(); }}>{label}</button>
  </div></EditDialog>;
}
export function SaveButtons({ close, label = '保存', disabled = false }: { close: () => void; label?: string; disabled?: boolean }) {
  return <div className={s.buttons}><button className={s.primary} type="submit" disabled={disabled}>{label}</button><button type="button" onClick={close}>キャンセル</button></div>;
}

