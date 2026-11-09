'use client';
import { menus, yen } from './data';
import { campaignStatus } from './logic';
import { DateControls, MenuDemo, useDemoDate } from './ui';
import s from './menu.module.css';

const campaigns = [
  { title: '秋のくすみカラー', id: 'one', price: 6000, start: '2026-10-01', end: '2026-10-31', note: '秋色の限定パレットから1色をお選びいただけます。' },
  { title: '冬支度の指先ケア', id: 'care', price: 3200, start: '2026-11-01', end: '2026-11-30', note: '自爪を整え、最後にキューティクルオイルをなじませます。' },
  { title: '冬のニュアンスアート', id: 'art', price: 8700, start: '2026-12-01', end: '2026-12-31', note: '冬の色合いに合わせた3種類のデザインが対象です。' },
];

export default function CampaignCards() {
  const date = useDemoDate();
  return <MenuDemo id="M05" title="季節のキャンペーン" guide="カードで内容を確認できます。確認日を変えると、期間前・開催中・終了の表示を試せます。">
    <DateControls {...date} sample="2026-11-15" />
    <div className={s.grid}>{campaigns.map(item => {
      const status = date.day ? campaignStatus(item.start, item.end, date.day) : '判定中';
      return <details key={item.id}>
        <summary><span className={s.badge} data-active={status === '開催中'}>{status}</span><strong>{item.title}</strong>
          <span className={s.facts}><strong>{yen(item.price)}</strong><small>{item.start} 〜 {item.end}</small></span>
        </summary>
        <p>対象メニュー · {menus.find(menu => menu.id === item.id)?.name}</p>
        <p>{item.note}</p>
        <p>{status === '終了' ? 'このサンプルキャンペーンは終了しました。' : status === '開始前' ? '掲載の開始日から適用されるサンプルです。' : 'キャンペーン期間中の参考料金です。'}</p>
      </details>;
    })}</div>
  </MenuDemo>;
}
