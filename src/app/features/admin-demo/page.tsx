import Link from 'next/link';
import { AdminDashboard } from '@/features/operations/Dashboard';
import s from '@/features/catalog/catalog.module.css';

export const metadata = { title: '統合管理ダッシュボード' };

export default function Page() {
  return <>
    <section className={s.hero}>
      <Link className={s.back} href="/features/">← 機能一覧へ戻る</Link>
      <p className={s.eyebrow}>09 / MELLOW NAIL ADMIN</p>
      <h1>統合管理ダッシュボード</h1>
      <p>ネイルサロンを公開したあとの仕事を、架空のデータで体験できます。分析・編集・公開設定の15機能をメニューから選べます。</p>
    </section>
    <AdminDashboard/>
  </>;
}

