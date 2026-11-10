'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { simulationStart, timestamp, type Announcement, type ContentRevision, type Draft } from './data';
import { useAdmin } from './state';
import { Confirm, EditDialog, newId, now, Panel, SaveButtons } from './ui';
import s from './operations.module.css';

export function ScheduledPublishing() {
  const { data, set } = useAdmin();
  const [editing, setEditing] = useState<Announcement>();
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const form = new FormData(event.currentTarget);
    const title = String(form.get('title')).trim();
    const publishAt = String(form.get('publishAt'));
    if (!title || !Number.isFinite(Date.parse(publishAt))) return;
    const next = { ...editing, title, publishAt };
    set('announcements', rows => rows.some(row => row.id === next.id) ? rows.map(row => row.id === next.id ? next : row) : [...rows, next]);
    setEditing(undefined);
  }
  const groups = [
    { label: '公開予定', rows: data.announcements.filter(row => row.publishAt && row.publishAt > data.clock) },
    { label: '公開済み', rows: data.announcements.filter(row => row.publishAt && row.publishAt <= data.clock) },
    { label: '未設定', rows: data.announcements.filter(row => !row.publishAt) },
  ];
  return <Panel title="公開日時のシミュレーション" help="基準日時を変えると表示上の公開状態が切り替わります。本番ではCMSやサーバー側のスケジューリングが必要です。">
    <label>基準日時（デモ）<input type="datetime-local" value={data.clock} onChange={event => {
      if (event.target.value) set('clock', event.target.value);
    }}/></label>
    <div className={s.buttons}><button type="button" onClick={() => set('clock', simulationStart)}>初期の基準日時</button>
      <button type="button" onClick={() => set('clock', '2026-05-25T10:00')}>5月25日へ進める</button>
      <button type="button" className={s.primary} onClick={() => setEditing({ id: newId(), title: '', publishAt: '' })}>公開予定を追加</button></div>
    {groups.map(({ label, rows }) => <div key={label}><h4>{label}（{rows.length}件）</h4>
      <ul className={s.list}>{rows.map(row => <li key={row.id}><div><strong>{row.title}</strong>
        <small>{row.publishAt ? timestamp(row.publishAt) : '公開日時なし'}</small></div>
        <div className={s.buttons}><button type="button" onClick={() => setEditing(row)}>日時を設定</button>
          {label === '公開予定' && <button type="button" onClick={() => set('announcements', items => items.map(item => item.id === row.id ? { ...item, publishAt: '' } : item))}>公開予約を解除</button>}
        </div>
      </li>)}</ul>
    </div>)}
    {editing && <EditDialog title="公開日時を設定" close={() => setEditing(undefined)}><form className={s.form} onSubmit={save}>
      <label>お知らせのタイトル<input name="title" required maxLength={80} defaultValue={editing.title}/></label>
      <label>公開日時<input name="publishAt" type="datetime-local" required defaultValue={editing.publishAt}/></label>
      <SaveButtons close={() => setEditing(undefined)}/>
    </form></EditDialog>}
  </Panel>;
}

function DraftForm({ item, close }: { item: Draft; close: () => void }) {
  const { set } = useAdmin();
  const [title, setTitle] = useState(item.title);
  const [body, setBody] = useState(item.body);
  const [discard, setDiscard] = useState(false);
  const dirty = item.title !== title || item.body !== body;
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = true; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  function cancel() {
    if (dirty) setDiscard(true);
    else close();
  }
  return <EditDialog title="下書きを編集" close={cancel}>
    {discard ? <div className={s.form}>
      <p role="alert">保存していない変更があります。</p>
      <div className={s.buttons}><button type="button" onClick={() => setDiscard(false)}>編集を続ける</button><button type="button" onClick={close}>変更を破棄</button></div>
    </div> : <form className={s.form} onSubmit={event => {
      event.preventDefault();
      if (!title.trim() || !body.trim()) return;
      const next = { ...item, title: title.trim(), body: body.trim(), at: now() };
      set('drafts', rows => [next, ...rows.filter(row => row.id !== next.id)].slice(0, 30));
      close();
    }}>
      <label>タイトル<input required maxLength={100} value={title} onChange={event => setTitle(event.target.value)}/></label>
      <label>本文<textarea required maxLength={2000} value={body} onChange={event => setBody(event.target.value)}/></label>
      <SaveButtons close={cancel} label="下書きとして保存"/>
    </form>}
  </EditDialog>;
}

export function DraftManager() {
  const { data, set } = useAdmin();
  const [editing, setEditing] = useState<Draft>();
  const [deleting, setDeleting] = useState<Draft>();
  return <Panel title="記事の下書き" help="本文は2,000文字まで。統合ダッシュボードでは画面内を移動しても保存内容を確認できます。再読み込みすると初期状態に戻ります。">
    <div><button type="button" className={s.primary} disabled={data.drafts.length >= 30} onClick={() => setEditing({ id: newId(), title: '', body: '', at: '' })}>下書きを作成</button></div>
    {data.drafts.length >= 30 && <p>下書きは30件まで保存できます。</p>}
    {!data.drafts.length && <p>保存済みの下書きがありません。</p>}
    <ul className={s.list}>{data.drafts.map(item => <li key={item.id}><div><strong>{item.title}</strong><small>{timestamp(item.at)} UTC</small></div>
      <div className={s.buttons}><button type="button" onClick={() => setEditing(item)}>再編集</button>
        <button type="button" onClick={() => setDeleting(item)}>削除</button></div></li>)}</ul>
    {editing && <DraftForm item={editing} close={() => setEditing(undefined)}/>}
    {deleting && <Confirm title="下書きを削除しますか？" close={() => setDeleting(undefined)} action={() => {
      set('drafts', rows => rows.filter(row => row.id !== deleting.id));
    }}>{deleting.title}</Confirm>}
  </Panel>;
}

export function RevisionHistory() {
  const { data, set } = useAdmin();
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState<ContentRevision>();
  const [confirming, setConfirming] = useState(false);
  function update(body: string) {
    if (body === data.article.body) return;
    const revision = { id: newId(), contentId: data.article.id, updatedAt: now(), field: '本文', previousValue: data.article.body, newValue: body };
    set('article', current => ({ ...current, body }));
    set('revisions', rows => [revision, ...rows].slice(0, 30));
  }
  return <Panel title="お知らせの更新履歴" help="本文を編集すると履歴が追加されます。復元の操作も新しい履歴として記録します。">
    <div className={s.card}><strong>{data.article.title}</strong><p data-current-article>{data.article.body}</p>
      <div><button type="button" className={s.primary} onClick={() => setEditing(true)}>記事の本文を編集</button></div></div>
    <ul className={s.list}>{data.revisions.map(row => <li key={row.id}><div><strong>{data.article.title} · {row.field}</strong><small>{timestamp(row.updatedAt)} UTC</small></div>
      <button type="button" onClick={() => setSelected(row)}>変更の詳細</button></li>)}</ul>
    {editing && <EditDialog title="記事の本文を編集" close={() => setEditing(false)}><form className={s.form} onSubmit={event => {
      event.preventDefault();
      const body = String(new FormData(event.currentTarget).get('body')).trim();
      if (!body) return;
      update(body); setEditing(false);
    }}><label>本文<textarea name="body" required maxLength={2000} defaultValue={data.article.body}/></label><SaveButtons close={() => setEditing(false)}/></form></EditDialog>}
    {selected && <EditDialog title={confirming ? '本文を復元しますか？' : '変更の詳細'} close={() => { setConfirming(false); setSelected(undefined); }}>
      <div className={s.compare}><div><strong>変更前</strong><p>{selected.previousValue}</p></div><div><strong>変更後</strong><p>{selected.newValue}</p></div></div>
      {confirming ? <div className={s.buttons}><button type="button" onClick={() => setConfirming(false)}>キャンセル</button>
        <button type="button" className={s.primary} onClick={() => { update(selected.previousValue); setConfirming(false); setSelected(undefined); }}>復元する</button></div> :
        <div><button type="button" onClick={() => setConfirming(true)}>変更前の本文へ復元</button></div>}
    </EditDialog>}
  </Panel>;
}

