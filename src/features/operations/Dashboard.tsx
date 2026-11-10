'use client';

import Link from 'next/link';
import { useRef, useState, type ComponentType } from 'react';
import { AccessAnalytics, ReservationAnalytics, DesignAnalytics, TrafficSources, EventTracking, ABTesting } from './Analytics';
import { ImageManager, MenuManager } from './AssetEditors';
import { ScheduledPublishing, DraftManager, RevisionHistory } from './Publishing';
import { UserRoles, UptimeMonitoring, UpdateRequests, SEOSettings } from './Management';
import { demoNames, designViews, featureId, format, sourceStats, sum, timestamp, traffic } from './data';
import { AdminProvider, useAdmin } from './state';
import { Bars, Confirm, Metrics, notice, Panel, PeriodSelect, Photo } from './ui';
import s from './operations.module.css';

const features: ComponentType[] = [
  AccessAnalytics, ReservationAnalytics, DesignAnalytics, TrafficSources, EventTracking, ABTesting,
  ImageManager, MenuManager, ScheduledPublishing, DraftManager, RevisionHistory, UserRoles, UptimeMonitoring, UpdateRequests, SEOSettings,
];
const groups = [
  { name: 'アクセス解析', items: [1, 2, 3, 4, 5, 6] },
  { name: '作品管理', items: [7] },
  { name: 'メニュー管理', items: [8] },
  { name: 'お知らせ管理', items: [9, 10] },
  { name: '更新履歴', items: [11] },
  { name: '運用設定', items: [12, 13] },
  { name: '更新依頼', items: [14] },
  { name: 'SEO設定', items: [15] },
];

function Overview({ open }: { open: (feature: number) => void }) {
  const { data } = useAdmin();
  const { current } = traffic(data.period);
  const popular = designViews(data.period).slice(0, 3);
  const sources = sourceStats(data.period);
  const pending = data.requests.filter(item => item.status !== '完了');
  return <>
    <Panel title="サイトの利用状況" help="集計は架空のサンプルです。期間を切り替えて比較できます。">
      <PeriodSelect/>
      <Metrics values={[
        { label: '訪問者数', value: sum(current, day => day.visitors) },
        { label: 'ページビュー数', value: sum(current, day => day.pageViews) },
        { label: '予約クリックセッション', value: sum(current, day => day.clicks) },
        { label: '未完了の更新依頼', value: pending.length },
      ]}/>
    </Panel>
    <div className={s.grid}>
      <Panel title="人気作品"><ul className={s.list}>{popular.map(({ design, views }) => <li key={design.id}>
        <Photo src={design.images[0]}/><div><strong>{design.title}</strong><small>{format(views)}閲覧</small></div>
      </li>)}</ul><div><button type="button" onClick={() => open(3)}>作品別閲覧分析を開く</button></div></Panel>
      <Panel title="SNS・その他の流入"><Bars rows={sources.map(item => ({ label: item.name, value: item.visits }))} unit="訪問"/>
        <div><button type="button" onClick={() => open(4)}>流入元の詳細を開く</button></div>
      </Panel>
      <Panel title="最近の更新履歴"><ul className={s.list}>{data.revisions.slice(0, 3).map(item => <li key={item.id}>
        <div><strong>{data.article.title} · {item.field}</strong><small>{timestamp(item.updatedAt)} UTC</small></div>
      </li>)}</ul><div><button type="button" onClick={() => open(11)}>更新履歴を開く</button></div></Panel>
      <Panel title="未完了の更新依頼">{pending.length ? <ul className={s.list}>{pending.slice(0, 3).map(item => <li key={item.id}>
        <strong>{item.category}</strong><span className={s.badge}>{item.status}</span>
      </li>)}</ul> : <p>未完了の依頼はありません。</p>}
        <div><button type="button" onClick={() => open(14)}>更新依頼を開く</button></div>
      </Panel>
    </div>
  </>;
}

function Navigation({ active, open }: { active: number; open: (feature: number) => void }) {
  return <nav className={s.navigation} aria-label="管理機能">
    <button type="button" aria-pressed={active === 0} onClick={() => open(0)}>ダッシュボード</button>
    {groups.map(({ name, items }) => items.length === 1 ?
      <button type="button" key={name} aria-pressed={items.includes(active)} onClick={() => open(items[0])}>{name}</button> :
      <details key={name} open={items.includes(active) || undefined}><summary>{name}</summary><div>{items.map(index =>
        <button type="button" key={index} aria-pressed={active === index} onClick={() => open(index)}>{demoNames[index - 1]}</button>)}</div></details>)}
  </nav>;
}

function DashboardContent() {
  const { reset, data } = useAdmin();
  const [active, setActive] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const Current = features[active - 1];
  const pending = data.requests.filter(item => item.status !== '完了').length;
  function open(index: number) {
    setActive(index);
    setMessage('');
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ block: 'nearest' });
    });
  }
  return <div className={s.workspace} data-admin-dashboard>
    <p className={s.notice}>{notice}</p>
    <div className={s.toolbar}><span className={s.badge}>通知 · 未完了の依頼 {pending}件</span>
      <button type="button" onClick={() => setConfirm(true)}>デモデータを初期化</button></div>
    {message && <p role="status">{message}</p>}
    <div className={s.dashboard}><Navigation active={active} open={open}/>
      <section className={s.workspace} aria-labelledby="admin-section-title">
        <div className={s.toolbar}><h2 id="admin-section-title" ref={heading} tabIndex={-1}>{active ? demoNames[active - 1] : 'ダッシュボード'}</h2>
          {active > 0 && <Link className={s.buttonLink} href={'/features/' + featureId(active) + '/'}>カタログの詳細を見る</Link>}</div>
        {Current ? <Current key={active}/> : <Overview open={open}/>}
      </section>
    </div>
    {confirm && <Confirm title="デモデータを初期化しますか？" close={() => setConfirm(false)} action={() => {
      reset(); setActive(0); setMessage('デモデータを初期化しました。');
    }} label="初期化する">このダッシュボードで作成・編集したサンプルデータが初期状態に戻ります。</Confirm>}
  </div>;
}

export function AdminDashboard() {
  return <AdminProvider><DashboardContent/></AdminProvider>;
}

export function getOperationsPreview(index: number) {
  const View = features[index - 1];
  return function OperationsPreview() {
    return <AdminProvider><div className={s.workspace}>
      <p className={s.notice}>{notice}</p>
      <Link href="/features/admin-demo/">統合管理ダッシュボードを開く →</Link>
      <View/>
    </div></AdminProvider>;
  };
}

