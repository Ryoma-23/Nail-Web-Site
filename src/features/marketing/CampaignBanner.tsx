'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Art } from '../gallery/ui';
import { campaignStatus } from '../menu/logic';
import { campaigns, sampleDate } from './data';
import { Choices, MarketingDemo } from './ui';
import s from './marketing.module.css';

const placements = { 'Hero Banner': 'hero', 'Compact Banner': 'compact', 'Floating Banner': 'float', 'Announcement Bar': 'bar' } as const;
type Placement = keyof typeof placements;

export default function CampaignBanner() {
  const [placement, setPlacement] = useState<Placement>('Hero Banner');
  const [day, setDay] = useState(sampleDate);
  const campaign = campaigns[2];
  const status = day ? campaignStatus(campaign.start, campaign.end, day) : '日付を選択';
  const kind = placements[placement];
  const banner = <section className={s.banner} data-kind={kind} aria-label="キャンペーンバナー">
    <Art src={campaign.image} alt="ローズ色のネイルチップ見本" />
    <div className={s.stack}><strong>{campaign.title} · {status}</strong><p>{campaign.text}</p>
      <small>{campaign.start} 〜 {campaign.end}</small>
      {status === '開催中' && <Link href="/features/B14/#holiday">キャンペーンを見る</Link>}
    </div>
  </section>;
  return <MarketingDemo id="B01" title="キャンペーンを知らせる4つの位置" guide="配置を選び、枠内をスクロールしてください。確認日を変えると開催中と期間外の表示を比較できます。">
    <Choices label="バナーの配置" options={Object.keys(placements) as Placement[]} value={placement} change={setPlacement} />
    <label>キャンペーンの確認日<input type="date" value={day} onChange={event => setDay(event.target.value)} /></label>
    <div className={s.preview}>
      <div className={s.previewScroll} tabIndex={0} aria-label="サロンページのスクロールプレビュー">
        {kind === 'bar' && banner}<p className={s.kicker}>mellow / DEMO SITE</p>
        {kind === 'hero' && banner}
        <div className={s.mock}><h4>気分に合うネイルを探す</h4><p>季節のデザイン、メニュー、お手入れのご案内。</p></div>
        {kind === 'compact' && banner}
        <div className={s.mock}><h4>プライベートサロン mellow</h4><p>じっくりと色を選べる、小さなサロン。</p></div>
      </div>
      {kind === 'float' && <div className={s.floating}>{banner}</div>}
    </div>
  </MarketingDemo>;
}
