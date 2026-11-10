'use client';

import { useSyncExternalStore, useState } from 'react';
import { CopyControl } from '../marketing/ui';
import { Choice, Panel } from './Controls';
import s from './customization.module.css';

const items = {
  'Webサイト': { title: 'Mellow Nail｜ナチュラル', text: 'Kotomiのネイルサロンサイトのサンプル', path: '/samples/a/natural/' },
  'ネイル作品': { title: 'ミルクティーベージュ', text: 'ミニサイトのギャラリーにあるネイル作品', path: '/features/C10/#search-art-0' },
  '特集ページ': { title: 'Mellow Nail｜春の限定カラー', text: '透け感のある春色3色のお知らせ', path: '/features/C10/#search-news' },
} as const;
const targets = Object.keys(items) as (keyof typeof items)[];
const subscribe = () => () => {};
const publicOrigin = 'https://public-sample.vercel.app';

export default function WebShareDemo() {
  const [target, setTarget] = useState<keyof typeof items>('Webサイト');
  const [status, setStatus] = useState('');
  const shareAvailable = useSyncExternalStore(subscribe, () => typeof navigator.share === 'function', () => false);
  const { title, text, path } = items[target];
  const url = new URL(path, publicOrigin).href;
  async function share() {
    try {
      await navigator.share({ title, text, url });
      setStatus('共有メニューに渡しました。');
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) setStatus('共有メニューを開けませんでした。URLをコピーできます。');
    }
  }
  return <div className={s.workspace}><Panel title="共有する内容">
    <Choice label="共有対象" options={targets} value={target} change={next => { setTarget(next); setStatus(''); }}/>
    <div className={s.shareCard}><strong>{title}</strong><p>{text}</p><a href={url}>{url}</a></div>
    <div className={s.actions}>
      {shareAvailable && <button type="button" onClick={share}>端末の共有メニューを開く</button>}
      <CopyControl value={url}/>
    </div>
    {!shareAvailable && <small>この環境では共有メニューの代わりにURLをコピーできます。</small>}
    {status && <p role="status">{status}</p>}
  </Panel></div>;
}

