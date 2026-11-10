'use client';

import { useState, type FormEvent } from 'react';
import { categories } from '../gallery/data';
import { categoryLabels, yen } from '../menu/data';
import type { ManagedMenu, WorkImage } from './data';
import { imageTypes, useAdmin, useFilePreview, validateImage } from './state';
import { Confirm, EditDialog, newId, Panel, Photo, SaveButtons, Select } from './ui';
import s from './operations.module.css';

export function ImageFile({ label, change, pending, setPending }: {
  label: string; change: (file: File | undefined) => void; pending: boolean; setPending: (value: boolean) => void;
}) {
  const [error, setError] = useState('');
  return <div className={s.form}><label>{label}<input type="file" accept={imageTypes} disabled={pending} onChange={async event => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    change(undefined);
    if (!file) { setError(''); return; }
    setPending(true);
    const issue = await validateImage(file);
    if (input.isConnected) {
      if (issue) input.value = '';
      else change(file);
      setError(issue);
      setPending(false);
    }
  }}/></label><small>JPEG・PNG・WebP / 5MB以下</small>
  {pending && <p role="status">画像を確認しています…</p>}
  {error && <p className={s.error} role="alert">{error}</p>}</div>;
}

function ImageForm({ item, close }: { item: WorkImage; close: () => void }) {
  const { set, makeImage, releaseImage } = useAdmin();
  const [title, setTitle] = useState(item.title);
  const [category, setCategory] = useState(item.category);
  const [file, setFile] = useState<File>();
  const [pending, setPending] = useState(false);
  const preview = useFilePreview(file);
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || !title.trim() || (!file && !item.src)) return;
    const next = { ...item, title: title.trim(), category, src: file ? makeImage(file) : item.src };
    set('images', rows => rows.some(row => row.id === item.id) ? rows.map(row => row.id === item.id ? next : row) : [...rows, next]);
    if (file) releaseImage(item.src);
    close();
  }
  return <EditDialog title={item.src ? '作品画像を編集' : '作品画像を追加'} close={close}>
    <form className={s.form} onSubmit={save}>
      <label>作品名<input required maxLength={80} value={title} onChange={event => setTitle(event.target.value)}/></label>
      <Select label="カテゴリー" choices={categories} value={category} set={setCategory}/>
      <ImageFile label="画像ファイル" change={setFile} pending={pending} setPending={setPending}/>
      {(preview || item.src) && <Photo src={preview || item.src} alt="作品画像のプレビュー"/>}
      <SaveButtons close={close} disabled={pending || (!file && !item.src)}/>
    </form>
  </EditDialog>;
}

export function ImageManager() {
  const { data, set, releaseImage } = useAdmin();
  const [editing, setEditing] = useState<WorkImage>();
  const [deleting, setDeleting] = useState<WorkImage>();
  function move(index: number, direction: number) {
    set('images', rows => {
      const next = [...rows];
      const target = index + direction;
      if (target < 0 || target >= next.length) return rows;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }
  return <Panel title="作品画像を管理" help="選んだ画像はこのブラウザのデモ画面で表示します。再読み込みすると初期状態に戻ります。">
    <div><button type="button" className={s.primary} onClick={() => setEditing({ id: newId(), title: '', category: 'SIMPLE', src: '' })}>画像を追加</button></div>
    {!data.images.length && <p>作品画像がありません。</p>}
    <div className={s.grid}>{data.images.map((item, i) => <article className={s.card} key={item.id}>
      <Photo src={item.src} alt={item.title}/><strong>{item.title}</strong><small>{item.category}</small>
      <div className={s.buttons}>
        <button type="button" onClick={() => setEditing(item)}>編集</button><button type="button" onClick={() => setDeleting(item)}>削除</button>
        <button type="button" disabled={i === 0} onClick={() => move(i, -1)} aria-label={item.title + 'を前へ'}>↑</button>
        <button type="button" disabled={i === data.images.length - 1} onClick={() => move(i, 1)} aria-label={item.title + 'を後ろへ'}>↓</button>
      </div>
    </article>)}</div>
    {editing && <ImageForm item={editing} close={() => setEditing(undefined)}/>}
    {deleting && <Confirm title="作品画像を削除しますか？" close={() => setDeleting(undefined)} action={() => {
      set('images', rows => rows.filter(item => item.id !== deleting.id)); releaseImage(deleting.src);
    }}>{deleting.title}</Confirm>}
  </Panel>;
}

function MenuForm({ item, close }: { item: ManagedMenu; close: () => void }) {
  const { set } = useAdmin();
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name')).trim();
    const price = Number(form.get('price'));
    const minutes = Number(form.get('minutes'));
    const category = String(form.get('category'));
    if (!name || !Number.isSafeInteger(price) || price < 0 || !Number.isSafeInteger(minutes) || minutes < 1 || !Object.hasOwn(categoryLabels, category)) return;
    const next: ManagedMenu = { id: item.id, name, price, minutes, category: category as ManagedMenu['category'], visible: form.has('visible') };
    set('menu', rows => rows.some(row => row.id === item.id) ? rows.map(row => row.id === item.id ? next : row) : [...rows, next]);
    close();
  }
  return <EditDialog title={item.name ? 'メニューを編集' : 'メニューを追加'} close={close}>
    <form className={s.form} onSubmit={save}>
      <label>メニュー名<input name="name" required maxLength={80} defaultValue={item.name}/></label>
      <label>料金（円）<input type="number" name="price" required min="0" max="10000000" step="1" defaultValue={item.price}/></label>
      <label>施術時間（分）<input type="number" name="minutes" required min="1" max="1440" step="1" defaultValue={item.minutes}/></label>
      <label>カテゴリー<select name="category" defaultValue={item.category}>{Object.entries(categoryLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
      <label className={s.check}><input type="checkbox" name="visible" defaultChecked={item.visible}/>サイトに表示する（デモ）</label>
      <SaveButtons close={close}/>
    </form>
  </EditDialog>;
}

export function MenuManager() {
  const { data, set } = useAdmin();
  const [editing, setEditing] = useState<ManagedMenu>();
  const [deleting, setDeleting] = useState<ManagedMenu>();
  return <Panel title="施術メニュー・料金" help="編集を保存すると、このデモのメニュー一覧に反映されます。">
    <div><button type="button" className={s.primary} onClick={() => setEditing({ id: newId(), name: '', price: 0, minutes: 60, category: 'hand', visible: true })}>新規メニューを追加</button></div>
    {!data.menu.length && <p>メニューがありません。</p>}
    <ul className={s.list}>{data.menu.map(item => <li key={item.id}><div><strong>{item.name}</strong>
      <small>{categoryLabels[item.category]} · {yen(item.price)} · {item.minutes}分 · {item.visible ? '表示' : '非表示'}</small></div>
      <div className={s.buttons}><button type="button" onClick={() => setEditing(item)}>編集</button>
        <button type="button" onClick={() => setDeleting(item)}>削除</button></div>
    </li>)}</ul>
    {editing && <MenuForm item={editing} close={() => setEditing(undefined)}/>}
    {deleting && <Confirm title="メニューを削除しますか？" close={() => setDeleting(undefined)}
      action={() => set('menu', rows => rows.filter(row => row.id !== deleting.id))}>{deleting.name}</Confirm>}
  </Panel>;
}

