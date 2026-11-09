'use client';
import { menus, yen } from './data';
import { revisionStatus } from './logic';
import { DateControls, MenuDemo, useDemoDate } from './ui';
import s from './menu.module.css';

const revisions = [
  { id: 'french', title: '細フレンチの料金改定', date: '2026-11-01', oldPrice: 7500, newPrice: 8000, reason: '仕上がりの確認時間を確保するため、施術工程を見直します。' },
  { id: 'art', title: 'ニュアンスアートの料金改定', date: '2027-01-01', oldPrice: 9500, newPrice: 9800, reason: '使用するジェルとアート材料の仕入れ価格の変更に伴う改定です。' },
];

export default function PriceRevision() {
  const date = useDemoDate();
  return <MenuDemo id="M12" title="メニュー料金改定のお知らせ" guide="詳細を開くと改定理由や適用日を確認できます。確認日を変えて表示の切り替えも試せます。">
    <DateControls {...date} sample="2026-11-15" />
    <div className={s.grid}>{revisions.map(item => {
      const status = date.day ? revisionStatus(item.date, date.day) : '判定中';
      return <details key={item.id}>
        <summary><span className={s.badge} data-active={status === '改定予定'}>{status}</span><strong>{item.title}</strong>
          <span className={s.facts}><small>改定日 {item.date}</small></span></summary>
        <div className={s.stack}>
          <p>対象メニュー · {menus.find(menu => menu.id === item.id)?.name}</p>
          <p className={s.facts}><del>旧料金 {yen(item.oldPrice)}</del><strong>新料金 {yen(item.newPrice)}</strong></p>
          <p>適用開始日 · {item.date} のご来店分から</p><p>改定理由 · {item.reason}</p>
        </div>
      </details>;
    })}</div>
  </MenuDemo>;
}
