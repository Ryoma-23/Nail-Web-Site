import type { Metadata } from 'next';
import { site } from '@/data/site';
import './globals.css';
export const metadata: Metadata = { title: `${site.name} | Nail atelier — サンプル`, description: '指先に、あなたらしい余白を。個人ネイリストのナチュラルで上品なネイルアトリエ。仮コンテンツのサンプルサイトです。', robots: { index: site.indexable, follow: site.indexable }, openGraph: { title: `${site.name} | Nail atelier`, description: site.subcopy, locale: 'ja_JP', type: 'website', images: [{url:'/images/hero/nails.svg',width:1000,height:1000,alt:'ネイルデザインのサンプルイラスト'}] } };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="ja"><body>{children}</body></html>; }
