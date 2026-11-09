'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { sampleDesigns, type NailDesign } from './data';
import { Art, Demo, Grid, Modal } from './ui';
import s from './gallery.module.css';

export function DesignModal({ design, onClose, booking = false }: { design: NailDesign; onClose: () => void; booking?: boolean }) {
  const [photo, setPhoto] = useState(0);
  const [bookingShown, setBookingShown] = useState(false);
  return <Modal title={design.title} onClose={onClose}>
    <Art src={design.images[photo]} alt={design.title + (photo ? 'の拡大見本' : 'の全体見本')} eager />
    <div className={s.row + ' ' + s.thumbs} role="group" aria-label="表示する画像">
      {design.images.map((src, index) => <button type="button" key={src} aria-pressed={index === photo}
        onClick={() => setPhoto(index)}>{index === 0 ? '全体' : '拡大 ' + index}</button>)}
    </div>
    <dl className={s.facts}>
      <div><dt>カテゴリー</dt><dd>{design.category}</dd></div>
      <div><dt>使用カラー</dt><dd>{design.colors.join(' / ')}</dd></div>
      <div><dt>参考料金</dt><dd>¥{design.price.toLocaleString('ja-JP')}</dd></div>
      <div><dt>施術時間</dt><dd>約{design.durationMinutes}分</dd></div>
    </dl>
    <p>{design.description}</p>
    {booking && <><button type="button" className={s.primary} onClick={() => setBookingShown(true)}>HOT PEPPER Beautyで予約（デモ）</button>
      {bookingShown && <p role="status" className={s.notice}>公開サイトではここから予約ページへ進みます。このデモでは画面内でご案内します。</p>}</>}
  </Modal>;
}

export default function DesignDetail() {
  const linkedId = useSearchParams().get('design');
  const [selection, setSelection] = useState<NailDesign | null | undefined>(undefined);
  const design = selection === undefined ? sampleDesigns.find(item => item.id === linkedId) : selection;
  return <Demo label="G05" title="デザインカルテ" guide="作品を選び、別カットや参考料金、予約ボタンの動作を確認できます。">
    <Grid designs={sampleDesigns.slice(0, 4)} onOpen={setSelection} />
    {design && <DesignModal key={design.id} design={design} booking onClose={() => setSelection(null)} />}
  </Demo>;
}
