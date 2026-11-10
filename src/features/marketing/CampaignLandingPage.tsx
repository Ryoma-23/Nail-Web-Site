'use client';
import { useState } from 'react';
import { Art } from '../gallery/ui';
import { yen } from '../menu/data';
import { campaignStatus } from '../menu/logic';
import { campaigns, sampleDate } from './data';
import { Choices, MarketingDemo } from './ui';
import s from './marketing.module.css';

type CampaignTitle = typeof campaigns[number]['title'];
export default function CampaignLandingPage() {
  const [title, setTitle] = useState<CampaignTitle>(campaigns[2].title);
  const [date, setDate] = useState(sampleDate);
  const [booking, setBooking] = useState('');
  const campaign = campaigns.find(item => item.title === title) ?? campaigns[2];
  const status = date ? campaignStatus(campaign.start, campaign.end, date) : '日付を選択';
  return <MarketingDemo id="B14" title="期間限定のミニサイト" guide="企画を選び、専用ページの見出し、メニュー、よくある質問、予約案内を比較できます。">
    <Choices label="特設ページの企画" options={campaigns.map(item => item.title)} value={title} change={setTitle} />
    <div className={s.row}>
      <label>特設ページの確認日<input type="date" value={date} onChange={event => setDate(event.target.value)} /></label>
      <button type="button" onClick={() => setDate(campaign.start)}>開催初日を試す</button>
    </div>
    <article className={s.landing} id="holiday" key={campaign.title}>
      <section className={s.hero} style={{ background: campaign.color }}>
        <div className={s.stack}><p className={s.kicker}>MELLOW / {campaign.title}</p><h4>{campaign.headline}</h4><p>{campaign.text}</p>
          <p>{campaign.start} 〜 {campaign.end} · {status}</p></div>
        <Art src={campaign.image} alt={campaign.menu + 'のネイル見本'} />
      </section>
      <section className={s.stack}><h5>対象メニュー</h5><p>{campaign.menu} · 参考料金 {yen(campaign.price)}</p>
        <details><summary>色やデザインは選べますか？</summary><p>サンプルの色見本からお選びいただく設定です。</p></details>
        <details><summary>付替オフは料金に含まれますか？</summary><p>付替オフは別料金です。</p></details>
        <button type="button" className={s.primary} disabled={status !== '開催中'} onClick={() => setBooking(campaign.title)}>予約の流れを見る（デモ）</button>
        {booking === campaign.title && status === '開催中' && <p role="status">この企画を選んで空き状況を確認する流れです。デモでは予約を登録しません。</p>}
      </section>
    </article>
  </MarketingDemo>;
}
