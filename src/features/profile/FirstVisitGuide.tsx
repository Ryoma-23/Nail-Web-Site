'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Modal } from '../gallery/ui';
import { visitSteps } from './content';
import { ProfileDemo } from './ui';
import s from './profile.module.css';

export default function FirstVisitGuide() {
  const [booking, setBooking] = useState(false);
  return <ProfileDemo id="P10" title="はじめてのご来店へ" guide="来店前から施術後まで、ステップを順に確認できます。">
    <p>色や長さが決まっていなくても大丈夫です。当日、手元に色見本を合わせながら一緒に考えます。</p>
    <ol className={s.steps}>{visitSteps.map(item => <li key={item.title}><details><summary>{item.title}</summary><p>{item.text}</p></details></li>)}</ol>
    <div className={s.toolbar}><Link href="/features/P09/">よくある質問を見る</Link>
      <Link href="/features/M10/">写真付きの施術の流れを見る</Link>
      <button type="button" onClick={() => setBooking(true)}>予約の流れを確認（デモ）</button>
    </div>
    {booking && <Modal title="予約の流れ（デモ）" onClose={() => setBooking(false)}>
      <ol><li>希望のメニューを選ぶ</li><li>空き状況を確認する</li><li>付替オフなどの希望を伝える</li></ol><p>デモでは予約手順をこの画面で確認できます。</p>
    </Modal>}
  </ProfileDemo>;
}
