'use client';
import { useState } from 'react';
import { Art } from '../gallery/ui';
import { sampleDesigns } from '../gallery/data';
import { designUrl } from './data';
import { CopyControl, MarketingDemo } from './ui';
import s from './marketing.module.css';

export default function SocialShare() {
  const [id, setId] = useState(sampleDesigns[0].id);
  const [message, setMessage] = useState('');
  const design = sampleDesigns.find(item => item.id === id) ?? sampleDesigns[0];
  const url = designUrl(design);
  async function share() {
    if (!navigator.share) {
      setMessage('この端末の共有メニューは利用できません。URLをコピーして共有できます。');
      return;
    }
    try {
      await navigator.share({ title: design.title + ' | mellow', text: design.description, url });
      setMessage('端末の共有メニューにリンクを渡しました。');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setMessage('端末の共有メニューを開けませんでした。URLをコピーして共有できます。');
    }
  }
  return <MarketingDemo id="B06" title="お気に入りのデザインを共有" guide="作品を選び、端末の共有メニューに渡す内容を確認できます。">
    <label>共有する作品<select value={id} onChange={event => { setId(event.target.value); setMessage(''); }}>
      {sampleDesigns.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
    </select></label>
    <article className={s.hero}><Art src={design.images[0]} alt={design.title + 'のネイル見本'} />
      <div className={s.stack}><h4>{design.title}</h4><p>{design.description}</p><output aria-label="共有URL">{url}</output></div></article>
    <div className={s.row}><button type="button" className={s.primary} onClick={share}>共有メニューを開く</button><CopyControl value={url} /></div>
    <p role="status">{message}</p>
    <p>Instagramが共有先に出るかは端末やアプリによります。このデモで共有するのは作品ページへのリンクです。</p>
  </MarketingDemo>;
}
