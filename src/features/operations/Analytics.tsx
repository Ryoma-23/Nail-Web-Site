'use client';

import { useState } from 'react';
import { categories, type NailDesign } from '../gallery/data';
import {
  designViews, eventTypes, experiments, format, placements, rate, sourceDetails, sourceStats, sum, timestamp, traffic,
  type DemoEvent,
} from './data';
import { useAdmin } from './state';
import { Bars, EditDialog, LineChart, Metrics, newId, now, Panel, PeriodSelect, Photo, Select } from './ui';
import s from './operations.module.css';

const compare = (current: number, previous: number) =>
  '前期間 ' + format(previous) + ' / ' + (current >= previous ? '+' : '−') + rate(Math.abs(current - previous), previous);

export function AccessAnalytics() {
  const { data } = useAdmin();
  const { current, previous } = traffic(data.period);
  return <Panel title="アクセス解析" help="架空の日別データです。訪問者数は日別ユニーク訪問者の合計、ページビューは表示されたページの合計です。">
    <PeriodSelect/>
    <Metrics values={[
      { label: '訪問者数', value: sum(current, day => day.visitors), note: compare(sum(current, day => day.visitors), sum(previous, day => day.visitors)) },
      { label: 'ページビュー数', value: sum(current, day => day.pageViews), note: compare(sum(current, day => day.pageViews), sum(previous, day => day.pageViews)) },
    ]}/>
    <LineChart labels={current.map(day => day.date)} series={[
      { label: '訪問者数', values: current.map(day => day.visitors) },
      { label: 'ページビュー数', values: current.map(day => day.pageViews) },
    ]}/>
  </Panel>;
}

export function ReservationAnalytics() {
  const { data } = useAdmin();
  const { current } = traffic(data.period);
  const clicks = sum(current, day => day.clicks);
  const sessions = sum(current, day => day.sessions);
  return <Panel title="予約導線のクリック" help="クリック率は予約ボタンを押したセッション数 ÷ 対象ページを閲覧したセッション数。予約成立とは別の指標です。">
    <PeriodSelect/>
    <Metrics values={[{ label: 'クリックしたセッション', value: clicks }, { label: '対象ページ閲覧セッション', value: sessions }, { label: 'クリック率', value: rate(clicks, sessions) }]}/>
    <h4>配置別のクリックセッション（最初のクリックで分類）</h4>
    <Bars rows={placements.map((label, i) => ({ label, value: sum(current, (day) => Math.floor(day.clicks / 4) + (i < day.clicks % 4 ? 1 : 0)) }))} unit="件"/>
    <LineChart labels={current.map(day => day.date)} series={[{ label: 'クリックしたセッション', values: current.map(day => day.clicks) }]}/>
  </Panel>;
}

export function DesignAnalytics() {
  const { data } = useAdmin();
  const [category, setCategory] = useState<NailDesign['category'] | 'すべて'>('すべて');
  const [selected, setSelected] = useState<string>();
  const entries = designViews(data.period);
  const item = entries.find(entry => entry.design.id === selected);
  const visible = entries.filter(({ design }) => category === 'すべて' || design.category === category);
  return <Panel title="人気作品ランキング" help="期間や作品カテゴリーを変え、順位を選ぶと作品の詳細を確認できます。">
    <PeriodSelect/>
    <Bars rows={categories.map(label => ({ label, value: sum(entries.filter(entry => entry.design.category === label), entry => entry.views) }))} unit="閲覧"/>
    <Select label="作品カテゴリー" choices={['すべて', ...categories]} value={category} set={setCategory}/>
    {!visible.length && <p>該当カテゴリーのサンプル作品はありません。</p>}
    <ol className={s.list}>{visible.map(({ design, views }, index) => <li key={design.id}>
      <div><strong>{index + 1}. {design.title}</strong><small>{design.category} · {format(views)}閲覧</small></div>
      <button type="button" onClick={() => setSelected(design.id)}>作品詳細<span className="sr-only"> {design.title}</span></button>
    </li>)}</ol>
    {item && <EditDialog title={item.design.title} close={() => setSelected(undefined)}>
      <Photo src={item.design.images[0]}/><p>{item.design.description}</p><p>{item.design.category} · {format(item.views)}閲覧 / {data.period}日</p>
    </EditDialog>}
  </Panel>;
}

export function TrafficSources() {
  const { data } = useAdmin();
  const [selected, setSelected] = useState<number>();
  const entries = sourceStats(data.period);
  const total = sum(entries, entry => entry.visits);
  return <Panel title="流入元別の訪問" help="訪問はセッション単位。QRコードごとの識別方法を詳細で確認できます。">
    <PeriodSelect/>
    <Bars rows={entries.map(({ name, visits }) => ({ label: name, value: visits, caption: format(visits) + '訪問 · ' + rate(visits, total) }))} max={total}/>
    <ul className={s.list}>{entries.map(({ name, clicks }, index) => <li key={name}>
      <div><strong>{name}</strong><small>予約ボタンクリック {clicks}セッション</small></div>
      <button type="button" onClick={() => setSelected(index)}>{name}の詳細</button>
    </li>)}</ul>
    {selected !== undefined && <EditDialog title={entries[selected].name} close={() => setSelected(undefined)}>
      <p>{sourceDetails[selected]}</p><p>{format(entries[selected].visits)}訪問 · 構成比 {rate(entries[selected].visits, total)}</p>
    </EditDialog>}
  </Panel>;
}

export function EventTracking() {
  const { data, set } = useAdmin();
  const [filter, setFilter] = useState('すべて');
  const [selected, setSelected] = useState<DemoEvent>();
  const [message, setMessage] = useState('');
  const categories = [...new Set(eventTypes.map(item => item.category))];
  const visible = data.events.filter(event => filter === 'すべて' || eventTypes[event.type].category === filter);
  return <Panel title="イベントログ" help="操作ボタンでデモのログを追加できます。ログはこの画面の中だけで扱います。">
    <div className={s.buttons}>{eventTypes.map((item, type) => <button type="button" key={item.name} onClick={() => {
      const entry = { id: newId(), type, at: now(), simulated: true };
      set('events', items => [entry, ...items].slice(0, 100));
      setMessage(item.name + 'を記録しました。');
    }}>{item.name}を試す</button>)}</div>
    {message && <p role="status">{message}</p>}
    <Select label="イベントカテゴリー" choices={['すべて', ...categories]} value={filter} set={setFilter}/>
    <Bars rows={eventTypes.map((item, i) => ({ label: item.name, value: visible.filter(entry => entry.type === i).length }))} unit="件"/>
    <ul className={s.list}>{visible.map(event => <li key={event.id}>
      <div><strong>{eventTypes[event.type].name}</strong><small>{timestamp(event.at)} UTC · {eventTypes[event.type].category}</small></div>
      <button type="button" onClick={() => setSelected(event)}>ログ詳細</button>
    </li>)}</ul>
    {selected && <EditDialog title={eventTypes[selected.type].name} close={() => setSelected(undefined)}>
      <p>{timestamp(selected.at)} UTC · {eventTypes[selected.type].category}</p><p>対象ページ {eventTypes[selected.type].page}</p>
      <p>{selected.simulated ? 'この画面で追加した操作' : '初期サンプルデータ'}</p>
    </EditDialog>}
  </Panel>;
}

export function ABTesting() {
  const [variant, setVariant] = useState<'A' | 'B'>('A');
  const [clicked, setClicked] = useState(false);
  const rates = experiments.map(item => item.clicks * 100 / item.views);
  return <Panel title="予約ボタンのA/B比較" help="クリック率はクリック数 ÷ 表示回数。数値の差だけで統計的な優位性は判断できません。">
    <div className={s.compare}>{experiments.map(item => <div key={item.name}>
      <strong>パターン {item.name}</strong><p>{item.design}</p>
      <p>{format(item.views)}表示 / {item.clicks}クリック / {rate(item.clicks, item.views)}</p>
    </div>)}</div>
    <Bars rows={experiments.map((item, i) => ({ label: 'パターン ' + item.name, value: rates[i], caption: rate(item.clicks, item.views) }))} max={Math.max(...rates) * 1.2}/>
    <Select label="プレビューするデザイン" choices={['A', 'B']} value={variant} set={value => { setVariant(value); setClicked(false); }}/>
    <div><button type="button" className={variant === 'A' ? s.sampleA : s.sampleB} onClick={() => setClicked(true)}>予約する</button></div>
    {clicked && <p role="status">パターン{variant}のクリックを体験しました。比較のサンプル値は固定です。</p>}
  </Panel>;
}

