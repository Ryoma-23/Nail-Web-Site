'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { sampleDesigns, type NailDesign } from './data';
import { toggleFavorite, useFavorites } from './favoriteStore';
import { Demo, Grid } from './ui';
import s from './gallery.module.css';

export function FavoriteButton({ design, active }: { design: NailDesign; active: boolean }) {
  return <button type="button" className={s.heart} aria-label={design.title + 'のお気に入り'}
    aria-pressed={active} onClick={() => toggleFavorite(design.id)}>
    <Heart size={16} aria-hidden="true" />{active ? '登録済み' : '登録'}
  </button>;
}

export default function Favorites() {
  const ids = useFavorites();
  const [only, setOnly] = useState(false);
  const designs = only ? sampleDesigns.filter(item => ids.includes(item.id)) : sampleDesigns;
  return <Demo label="G07" title="好きなデザインを保存" guide="ハートで登録・解除できます。お気に入りは同じブラウザで再読み込みしても残ります。">
    <div className={s.bar}><span role="status">お気に入り {ids.length} 件</span>
      <button type="button" aria-pressed={only} onClick={() => setOnly(value => !value)}>お気に入りのみ</button></div>
    {only && !designs.length ? <p className={s.empty}>お気に入りはまだありません。全作品に戻ってハートを押してください。</p> :
      <Grid designs={designs} extra={item => <FavoriteButton design={item} active={ids.includes(item.id)} />} />}
  </Demo>;
}
