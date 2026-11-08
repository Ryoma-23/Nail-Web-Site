import type { Metadata } from 'next';
import { SampleCatalog } from '@/components/catalog/SampleCatalog';
export const metadata: Metadata = {title:'Nail Website Collection | サイトサンプル一覧',description:'個人ネイリストのためのWebサイトデザイン集。構成・テイスト別にサンプルを比較できます。'};
export default function Home() { return <SampleCatalog/>; }
