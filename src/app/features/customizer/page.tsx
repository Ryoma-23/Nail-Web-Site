import Link from 'next/link';
import { CustomizationWorkspace } from '@/features/customization/Workspace';
import s from '@/features/catalog/catalog.module.css';

export const metadata = { title: 'ミニサイトカスタマイザー' };

export default function Page() {
  return <>
    <section className={s.hero}>
      <Link className={s.back} href="/features/">← 機能一覧へ戻る</Link>
      <p className={s.eyebrow}>08 / DESIGN CUSTOMIZER</p>
      <h1>ミニサイトカスタマイザー</h1>
      <p>色、書体、写真の形、セクションの順番を組み合わせて、Kotomiのミニサイトで試せます。気に入った設定はJSONで持ち帰れます。</p>
    </section>
    <section className={s.panel} aria-label="カスタマイズ操作"><CustomizationWorkspace/></section>
  </>;
}

