import { Gift } from 'lucide-react';
import { referral, referralUrl } from './data';
import { CopyControl, MarketingDemo } from './ui';
import s from './marketing.module.css';

export default function ReferralCampaign() {
  return <MarketingDemo id="B12" title="大切な人へ、mellowをご紹介" guide="特典と条件を確認して、この公開デモの紹介ページをコピーできます。">
    <section id="referral-benefits" className={s.hero}><div className={s.stack}><Gift aria-hidden="true" /><h4>ご紹介特典（サンプル）</h4>
      <p>{referral.start} 〜 {referral.end}</p></div><div className={s.card}><p>ご友人 · {referral.friend}</p><p>ご紹介者 · {referral.host}</p></div></section>
    <ol className={s.numbered}>{referral.steps.map(step => <li key={step}>{step}</li>)}</ol>
    <details><summary>利用条件を確認</summary><p>初めて来店するご友人が対象です。対象メニューと他の割引の併用条件は予約前に確認する設定です。</p></details>
    <CopyControl value={referralUrl} label="紹介ページのURLをコピー" />
    <p>コピーするのはこのデモへのリンクです。特典は例示です。</p>
  </MarketingDemo>;
}
