'use client';

import { useState } from 'react';
import { ImageFile } from './AssetEditors';
import {
  defaultSeo, healthStates, incidents, permissions, priorities, requestCategories, requestStatuses, roles,
  seoImages, targetPages, timestamp, type Health, type ManagementUser, type Role, type UpdateRequest,
} from './data';
import { useAdmin, useFilePreview } from './state';
import { Confirm, EditDialog, LineChart, Metrics, newId, now, Panel, Photo, SaveButtons, Select } from './ui';
import s from './operations.module.css';

const permissionLabels = ['コンテンツ編集', '公開設定', 'ユーザー管理'];

export function UserRoles() {
  const { data, set } = useAdmin();
  const [role, setRole] = useState<Role>('Owner');
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<ManagementUser>();
  const [message, setMessage] = useState('');
  const [edit, publish, manage] = permissions[role];
  return <Panel title="架空ユーザーの役割と権限" help="役割で変わる画面を比較できます。本番の権限はサーバー側の認可で検証する必要があります。招待メールは送信されません。">
    <Select label="表示を体験する役割" choices={roles} value={role} set={value => { setRole(value); setMessage(''); }}/>
    <div className={s.buttons}>
      <button type="button" disabled={!edit} onClick={() => setMessage('コンテンツ編集ができる役割です。')}>コンテンツを編集</button>
      <button type="button" disabled={!publish} onClick={() => setMessage('公開設定を変更できる役割です。')}>公開設定を変更</button>
      {manage && <button type="button" className={s.primary} onClick={() => setAdding(true)}>デモユーザーを追加</button>}
    </div>
    {message && <p role="status">{message}</p>}
    <div className={s.scroll} tabIndex={0} role="region" aria-label="権限の比較表">
      <table><thead><tr><th scope="col">役割</th>{permissionLabels.map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead>
        <tbody>{roles.map(item => <tr key={item}><th scope="row">{item}</th>{permissions[item].map((allowed, i) => <td key={i}>{allowed ? '可' : '不可'}</td>)}</tr>)}</tbody>
      </table>
    </div>
    <ul className={s.list}>{data.users.map(user => <li key={user.id}>
      <div><strong>{user.displayName}</strong><small>{user.role}</small></div>
      {manage && user.id !== 'owner' && <div className={s.buttons}><Select label={user.displayName + 'の役割'} choices={roles.filter(item => item !== 'Owner')} value={user.role} set={next => {
        set('users', rows => rows.map(row => row.id === user.id ? { ...row, role: next } : row));
      }}/><button type="button" onClick={() => setDeleting(user)}>削除</button></div>}
    </li>)}</ul>
    {adding && <EditDialog title="デモユーザーを追加" close={() => setAdding(false)}>
      <form className={s.form} onSubmit={event => {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        const displayName = String(values.get('displayName')).trim();
        const nextRole = roles.find(item => item !== 'Owner' && item === values.get('role'));
        if (!displayName || !nextRole) return;
        const user = { id: newId(), displayName, role: nextRole };
        set('users', rows => [...rows, user]); setAdding(false);
      }}>
        <label>架空の表示名<input name="displayName" required maxLength={60}/></label>
        <label>役割<select name="role" defaultValue="Editor">{roles.filter(item => item !== 'Owner').map(item => <option key={item}>{item}</option>)}</select></label>
        <SaveButtons close={() => setAdding(false)} label="追加"/>
      </form>
    </EditDialog>}
    {deleting && <Confirm title="デモユーザーを削除しますか？" close={() => setDeleting(undefined)} action={() => {
      set('users', rows => rows.filter(row => row.id !== deleting.id));
    }}>{deleting.displayName}</Confirm>}
  </Panel>;
}

const healthValues: Record<Health, { uptime: string; readings: number[] }> = {
  Operational: { uptime: '99.98%', readings: [193, 175, 190, 218, 196, 184] },
  'Degraded Performance': { uptime: '99.92%', readings: [250, 260, 415, 540, 960, 850] },
  Outage: { uptime: '98.24%', readings: [208, 247, 390, 1080] },
  Maintenance: { uptime: '99.95%', readings: [204, 197, 220, 215, 220] },
};
export function UptimeMonitoring() {
  const [state, setState] = useState<Health>('Operational');
  const [selected, setSelected] = useState<typeof incidents[number]>();
  const { uptime, readings } = healthValues[state];
  return <Panel title="サイトの稼働状況" help="表示は架空のシミュレーションです。本番では監視サービスや定期的なヘルスチェックが必要です。">
    <Select label="再現するサイト状態" choices={healthStates} value={state} set={setState}/>
    <span className={s.badge} role="status">{state}</span>
    <Metrics values={[{ label: '過去30日の稼働率', value: uptime }, { label: '直近の応答時間', value: state === 'Outage' ? '応答なし' : state === 'Maintenance' ? '計測停止' : readings.at(-1) + ' ms' }]}/>
    <LineChart labels={readings.map((_, i) => '09:' + String(i * 10).padStart(2, '0'))} series={[{ label: '応答時間（有効な観測値）', values: readings }]} unit=" ms"/>
    <h4>最近の障害・保守履歴（サンプル）</h4>
    <ul className={s.list}>{incidents.map(item => <li key={item.title}><div><strong>{item.title}</strong><small>{timestamp(item.at)}</small></div>
      <button type="button" onClick={() => setSelected(item)}>障害詳細</button></li>)}</ul>
    {selected && <EditDialog title={selected.title} close={() => setSelected(undefined)}><p>{timestamp(selected.at)}</p><p>{selected.detail}</p></EditDialog>}
  </Panel>;
}

function RequestForm({ close }: { close: () => void }) {
  const { set, makeImage } = useAdmin();
  const [file, setFile] = useState<File>();
  const [pending, setPending] = useState(false);
  const preview = useFilePreview(file);
  return <EditDialog title="更新依頼を作成" close={close}>
    <form className={s.form} onSubmit={event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const category = requestCategories.find(item => item === form.get('category'));
      const targetPage = targetPages.find(item => item === form.get('page'));
      const priority = priorities.find(item => item === form.get('priority'));
      const description = String(form.get('description')).trim();
      if (pending || !category || !targetPage || !priority || !description) return;
      const row: UpdateRequest = {
        id: newId(), category, targetPage, priority, description, due: String(form.get('due')), status: '受付',
        createdAt: now(), attachment: file ? makeImage(file) : '',
      };
      set('requests', rows => [row, ...rows]); close();
    }}>
      <label>依頼カテゴリー<select name="category">{requestCategories.map(item => <option key={item}>{item}</option>)}</select></label>
      <label>対象ページ<select name="page">{targetPages.map(item => <option key={item}>{item}</option>)}</select></label>
      <label>依頼内容<textarea name="description" maxLength={1500} required/></label>
      <label>希望対応日<input type="date" name="due"/></label>
      <label>優先度<select name="priority" defaultValue="通常">{priorities.map(item => <option key={item}>{item}</option>)}</select></label>
      <ImageFile label="添付画像（任意）" change={setFile} pending={pending} setPending={setPending}/>
      {preview && <Photo src={preview} alt="添付のプレビュー"/>}
      <SaveButtons close={close} label="デモ一覧に登録" disabled={pending}/>
    </form>
  </EditDialog>;
}

export function UpdateRequests() {
  const { data, set } = useAdmin();
  const [adding, setAdding] = useState(false);
  const [selected, setSelected] = useState<string>();
  const item = data.requests.find(row => row.id === selected);
  return <Panel title="サイトの更新依頼" help="架空の依頼を作成し、対応の進み具合を更新できます。送信先はこのブラウザのデモ一覧です。">
    <div><button type="button" className={s.primary} onClick={() => setAdding(true)}>新しい更新依頼</button></div>
    <ul className={s.list}>{data.requests.map(row => <li key={row.id}>
      <div><strong>{row.category}</strong><small>{row.targetPage} · 優先度 {row.priority} · {row.status}</small></div>
      <button type="button" onClick={() => setSelected(row.id)}>依頼詳細</button>
    </li>)}</ul>
    {adding && <RequestForm close={() => setAdding(false)}/>}
    {item && <EditDialog title={item.category} close={() => setSelected(undefined)}>
      <p>{item.description}</p><p>対象ページ {item.targetPage} / 優先度 {item.priority}</p>
      <p>希望対応日 {item.due || '指定なし'} / 受付日時 {timestamp(item.createdAt)} UTC</p>
      {item.attachment && <Photo src={item.attachment} alt="依頼に添付した画像"/>}
      <form className={s.form} onSubmit={event => {
        event.preventDefault();
        const choice = new FormData(event.currentTarget).get('status');
        const status = requestStatuses.find(value => value === choice);
        if (!status) return;
        set('requests', rows => rows.map(row => row.id === item.id ? { ...row, status } : row)); setSelected(undefined);
      }}>
        <label>ステータス<select name="status" defaultValue={item.status}>{requestStatuses.map(value => <option key={value}>{value}</option>)}</select></label>
        <SaveButtons close={() => setSelected(undefined)}/>
      </form>
    </EditDialog>}
  </Panel>;
}

const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export function SEOSettings() {
  const { data: { seo }, set } = useAdmin();
  const valid = validSlug.test(seo.slug);
  const url = 'https://mellow.example/' + (valid ? seo.slug + '/' : '');
  const previewTitle = seo.title.trim() || 'ページタイトル未設定';
  const previewDescription = seo.description.trim() || '説明文未設定';
  return <Panel title="検索・共有プレビュー" help="検索順位や検索エンジンでの表示は保証されません。入力はこのデモの表示にのみ使います。">
    <div className={s.form}>
      <label>ページタイトル<input maxLength={120} value={seo.title} onChange={event => set('seo', { ...seo, title: event.target.value })}/><small>{Array.from(seo.title).length}文字</small></label>
      <label>メタディスクリプション<textarea maxLength={300} value={seo.description} onChange={event => set('seo', { ...seo, description: event.target.value })}/><small>{Array.from(seo.description).length}文字</small></label>
      <label>URLスラッグ<input maxLength={80} value={seo.slug} aria-invalid={!valid} aria-describedby="slug-help" onChange={event => set('seo', { ...seo, slug: event.target.value })}/></label>
      <small id="slug-help" className={valid ? s.muted : s.error}>{valid ? '半角英小文字・数字・ハイフン' : '半角英小文字・数字・単独のハイフンで指定してください。不正な入力はURLに反映されません。'}</small>
      <label>OGP画像<select value={seo.image} onChange={event => {
        const image = seoImages.find(item => item.src === event.target.value);
        if (image) set('seo', { ...seo, image: image.src });
      }}>{seoImages.map(item => <option key={item.src} value={item.src}>{item.name}</option>)}</select></label>
      <div><button type="button" onClick={() => set('seo', defaultSeo)}>SEO設定をリセット</button></div>
    </div>
    <div className={s.compare}>
      <div><h4>検索結果風プレビュー</h4><small>{url}</small><p className={s.searchTitle}>{previewTitle}</p><p>{previewDescription}</p></div>
      <div><h4>SNS共有プレビュー</h4><div className={s.preview}><Photo src={seo.image} alt="OGP画像のプレビュー"/>
        <div><small>{url}</small><p><strong>{previewTitle}</strong></p><p>{previewDescription}</p></div></div></div>
    </div>
  </Panel>;
}

