'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { Demo } from '../gallery/ui';
import { baseMenus, yen, type NailMenu } from './data';
import { duration, estimate, jstDate, type Quantities } from './logic';
import s from './menu.module.css';

export function MenuDemo({ id, title, guide, children }: { id: string; title: string; guide: string; children: ReactNode }) {
  return <Demo label={id} title={title} guide={guide}><div className={s.menu}>{children}
    <p className={s.note}>料金と時間はデモ用の目安です。実際の料金・所要時間はサロンや爪の状態によって異なります。</p>
  </div></Demo>;
}

export function MenuFacts({ menu }: { menu: NailMenu }) {
  return <span className={s.facts}><strong>{yen(menu.price)}</strong><span>{duration(menu.minutes)}</span></span>;
}

export function BasePicker({ id, select }: { id: string; select: (id: string) => void }) {
  return <label>ベースメニュー
    <select value={id} onChange={event => select(event.target.value)}>
      <option value="">施術を選択</option>
      {baseMenus.map(menu => <option key={menu.id} value={menu.id}>{menu.name}</option>)}
    </select>
  </label>;
}

export function Estimate({ menu, quantities, mode = 'price' }: { menu?: NailMenu; quantities: Quantities; mode?: 'price' | 'time' }) {
  const result = estimate(menu, quantities);
  const format = mode === 'price' ? yen : duration;
  const value = mode === 'price' ? result.price : result.minutes;
  return <section className={s.receipt} aria-label="計算結果">
    <div className={s.total} aria-live="polite"><span>{mode === 'price' ? '参考合計' : '目安の合計時間'}</span><strong key={value}>{format(value)}</strong></div>
    {result.lines.length ? <ul>{result.lines.map(line => <li key={line.id}><span>{line.name}{line.count > 1 ? ' × ' + line.count : ''}</span><strong>{format(mode === 'price' ? line.price : line.minutes)}</strong></li>)}</ul> : <p>選択した項目の内訳がここに表示されます。</p>}
  </section>;
}

export function useDemoDate() {
  const [today, setToday] = useState('');
  const [override, setOverride] = useState('');
  useEffect(() => {
    const start = window.setTimeout(() => {
      const initial = jstDate(new Date());
      setToday(initial);
    }, 0);
    const timer = window.setInterval(() => setToday(jstDate(new Date())), 1000);
    return () => { window.clearTimeout(start); window.clearInterval(timer); };
  }, []);
  return { today, day: override || today, override, setOverride };
}

export function DateControls({ today, override, setOverride, sample }: { today: string; override: string; sample: string; setOverride: (value: string) => void }) {
  return <div className={s.dateControls}>
    <label>確認日（日本時間）<input type="date" min="0001-01-01" max="9999-12-31" value={override || today} onChange={event => {
      const value = event.target.value;
      if (value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value)) setOverride(value);
    }} /></label>
    <div className={s.buttons}>
      <button type="button" onClick={() => setOverride(sample)}>サンプル日で確認</button>
      <button type="button" onClick={() => setOverride('')} disabled={!override}>今日に戻す</button>
    </div>
  </div>;
}
