import type { Metadata } from 'next';
import { FeatureHeader } from '@/features/catalog/Controls';
import s from '@/features/catalog/catalog.module.css';
export const metadata:Metadata={title:{default:'追加機能カタログ | mellow',template:'%s | mellow'},description:'ネイリスト向けWebサイトの追加機能を比較し、制作相談用の希望リストをまとめるカタログ。'};
export default function Layout({children}:{children:React.ReactNode}){return <div className={s.shell}><a className={s.skip} href="#feature-main">本文へスキップ</a><FeatureHeader/><main id="feature-main" className={s.main}>{children}</main><footer className={s.footer}>mellow / FEATURE CATALOG <span>機能の選択は制作相談のためのものです。</span></footer></div>}
