'use client';
import { useState } from 'react';
import { Camera, MessageCircle } from 'lucide-react';
import { Art, Modal } from '../gallery/ui';
import { accounts, type SocialAccount } from './data';
import { websiteUrl } from './logic';
import { Choices, MarketingDemo } from './ui';
import s from './marketing.module.css';

const modes = ['アイコン一覧','プロフィールカード','写真付き'] as const;
type Mode = typeof modes[number];

export function FollowLinks({ items, mode }: { items: readonly SocialAccount[]; mode: Mode }) {
  const [open, setOpen] = useState('');
  const links = items.map(account => {
    const Icon = account.name === 'LINE' ? MessageCircle : Camera;
    const href = account.url && websiteUrl(account.url);
    return <article className={mode === 'アイコン一覧' ? s.stack : s.card} key={account.name}>
      <Icon size={23} aria-hidden="true" /><h4>{account.name}</h4>
      <p>{account.label}</p><p>{account.benefit}</p>
      {href ? <a href={href} rel="noopener noreferrer">{account.name}をフォロー</a> :
        <button type="button" onClick={() => setOpen(account.name)}>{account.name}の案内（デモ）</button>}
    </article>;
  });
  return <>
    {mode === '写真付き' ? <section className={s.hero}><Art src="/gallery-demo/rose.svg" alt="ローズ色のネイル見本" /><div className={s.stack}>{links}</div></section> :
      <div className={mode === 'アイコン一覧' ? s.row : s.socialGrid}>{links}</div>}
    {open && <Modal title={open + 'のフォロー案内'} onClose={() => setOpen('')}><p>デモ用のアカウント表示です。正式なURLを登録するとSNSに案内できます。</p></Modal>}
  </>;
}

export default function SocialFollow() {
  const [mode, setMode] = useState<Mode>(modes[0]);
  return <MarketingDemo id="B13" title="作品とお知らせをフォロー" guide="フォロー案内の3つの見せ方を比較し、各サービスへの導線を試せます。">
    <Choices label="SNSの見せ方" options={modes} value={mode} change={setMode} /><FollowLinks items={accounts} mode={mode} />
  </MarketingDemo>;
}
