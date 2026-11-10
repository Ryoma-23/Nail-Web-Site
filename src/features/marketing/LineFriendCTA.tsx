'use client';
import { useState } from 'react';
import { MessageCircle, QrCode } from 'lucide-react';
import { Modal } from '../gallery/ui';
import { accounts, type SocialAccount } from './data';
import { websiteUrl } from './logic';
import { Choices, MarketingDemo } from './ui';
import s from './marketing.module.css';

const modes = ['シンプル','大型CTA','メリット付き'] as const;
type Mode = typeof modes[number];

export function LineCTA({ account, mode, qrImage }: { account: SocialAccount; mode: Mode; qrImage?: string }) {
  const [open, setOpen] = useState(false);
  const officialUrl = account.url && websiteUrl(account.url);
  return <>
    <article className={mode === 'シンプル' ? s.row : s.social} data-line-mode={mode}>
      {mode !== 'シンプル' && <div className={s.stack}><p className={s.kicker}>LINE / FOLLOW</p><h4>お知らせを受け取る</h4><p>{account.benefit}</p></div>}
      {officialUrl ? <a href={officialUrl} className={s.socialLink}><MessageCircle size={17} aria-hidden="true" />LINEで友だち追加</a> :
        <button type="button" className={s.socialLink} onClick={() => setOpen(true)}><MessageCircle size={17} aria-hidden="true" />LINEで友だち追加（デモ）</button>}
      {mode === 'メリット付き' && <ul><li>季節のデザインを確認</li><li>空き状況やキャンペーンをチェック</li></ul>}
    </article>
    {mode === 'シンプル' && <p>{account.benefit}</p>}
    <div className={s.card}><h4>QRから追加する場合</h4>
      {qrImage ?
        // eslint-disable-next-line @next/next/no-img-element
        <img className={s.lineQR} src={qrImage} alt="LINE公式アカウントの友だち追加QRコード" width={160} height={160} /> :
        <div className={s.qrPlaceholder}><QrCode size={30} aria-hidden="true" /><span>公式QR未設定</span></div>}
      <ol><li>LINEの友だち追加からQR読み取りを開く</li><li>公式QRを読み取り、アカウント名を確認</li><li>「追加」を選ぶ</li></ol>
    </div>
    {open && <Modal title="友だち追加のご案内（デモ）" onClose={() => setOpen(false)}><p>公式アカウントのURLは未設定です。公開用のアカウントを設定すると、ここから友だち追加へ進めます。</p></Modal>}
  </>;
}

export default function LineFriendCTA() {
  const [mode, setMode] = useState<Mode>(modes[0]);
  return <MarketingDemo id="B05" title="LINEでまた会える導線" guide="ボタンの大きさや、メリットを一緒に見せる形を比較してください。">
    <Choices label="LINEボタンの見せ方" options={modes} value={mode} change={setMode} />
    <LineCTA account={accounts[1]} mode={mode} />
  </MarketingDemo>;
}
