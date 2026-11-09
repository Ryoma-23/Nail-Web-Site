'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sampleDesigns } from './data';
import { useFavorites } from './favoriteStore';
import { Demo, Grid } from './ui';
import s from './gallery.module.css';

const detailPath = (id: string) => '/features/G05/?design=' + encodeURIComponent(id);

export default function FavoritesShare() {
  const ids = useFavorites();
  const designs = sampleDesigns.filter(item => ids.includes(item.id));
  const [message, setMessage] = useState('');
  const [manual, setManual] = useState('');
  const [nativeShare, setNativeShare] = useState(true);

  function shareText() {
    return ['mellow｜お気に入りのネイル', ...designs.map(item => item.title + '\n' + new URL(detailPath(item.id), window.location.origin))].join('\n\n');
  }

  async function copy() {
    const text = shareText();
    try {
      await navigator.clipboard.writeText(text);
      setManual('');
      setMessage('作品名とURLをコピーしました。');
    } catch {
      setManual(text);
      setMessage('下の欄からテキストを選択してコピーしてください。');
    }
  }

  async function share() {
    if (!navigator.share) {
      await copy();
      return;
    }
    try {
      await navigator.share({ title: 'mellow｜お気に入りのネイル', text: shareText() });
      setMessage('共有メニューに作品を渡しました。');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setNativeShare(false);
      setMessage('共有メニューを開けませんでした。「コピー」をお試しください。');
    }
  }

  return <Demo label="G08" title="お気に入りをまとめて共有" guide="お気に入りの作品名と、作品詳細を開けるURLをまとめて共有します。">
    <p><Link href="/features/G07/">お気に入り登録のデモへ</Link></p>
    {designs.length ? <>
      <Grid designs={designs} extra={item => <Link href={detailPath(item.id)}>作品詳細を開く</Link>} />
      <div className={s.bar}>
        {nativeShare && <button type="button" className={s.primary} onClick={share}>共有する</button>}
        <button type="button" onClick={copy}>コピー</button>
      </div>
      <p role="status">{message}</p>
      {manual && <textarea aria-label="コピーする作品一覧" value={manual} readOnly onFocus={event => event.currentTarget.select()} />}
    </> : <p className={s.empty}>共有する作品がありません。G07でお気に入りに登録してから戻ってください。</p>}
  </Demo>;
}
