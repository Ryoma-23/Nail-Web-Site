'use client';
import { useState } from 'react';
import { Lightbox } from '../gallery/ui';
import type { GalleryItem } from './data';
import { Choices, PhotoView } from './ui';
import s from './profile.module.css';

export function PhotoCollection({ items, categoryLabel }: { items: readonly GalleryItem[]; categoryLabel: string }) {
  const [category, setCategory] = useState('すべて');
  const [opened, setOpened] = useState<number | null>(null);
  const categories = ['すべて', ...new Set(items.map(item => item.category))];
  const visible = category === 'すべて' ? items : items.filter(item => item.category === category);
  return <>
    <Choices label={categoryLabel} options={categories} value={category} change={setCategory} />
    <div className={s.grid + ' ' + s.wideGrid} key={category}>{visible.map((item, index) => <article key={item.id} className={s.card}>
      <button type="button" className={s.imageButton} aria-label={item.title + 'の写真を拡大'} onClick={() => setOpened(index)}>
        <PhotoView photo={item.photo} />
      </button>
      <span className={s.kicker}>{item.category}</span><h4>{item.title}</h4>
      <details><summary>説明を見る</summary><p>{item.text}</p></details>
    </article>)}</div>
    {opened !== null && <Lightbox slides={visible.map(item => ({ ...item.photo, label: item.title }))} start={opened} onClose={() => setOpened(null)} />}
  </>;
}
