import Link from 'next/link';
import { site } from '@/data/site';
import { SampleNavigation } from '@/components/common/SampleNavigation';
import { ReservationButton } from '@/components/reservation/ReservationButton';
import { MultiHeader } from '@/themes/natural-multi/Header';
import { pages } from '@/data/multiNavigation';
import { MultiReservation, Social } from '@/themes/natural-multi/Shared';
import styles from '@/themes/natural-multi/NaturalMulti.module.css';
const base='/samples/b/minimal/';
export const metadata={title:{default:'mellow | 構成B・Minimal Stylish',template:'%s | mellow — 構成B サンプル04'},description:'個人ネイリストのための白・グレー・黒で彩る複数ページ型サンプル。作品・料金・プロフィール・施術場所をページごとにご覧いただけます。'};
export default function MinimalMultiLayout({children}:{children:React.ReactNode}){return <><SampleNavigation current="minimal" layout="b"/><div id="top" className={styles.multi+" "+styles.minimal}><a className="skip-link" href="#main">本文へスキップ</a><MultiHeader base={base}/><main id="main">{children}<MultiReservation/></main><footer className={styles.footer}><div><Link className="brand" href={base}>{site.name}<small>{site.subtitle}</small></Link><Social/><a href="#top">BACK TO TOP ↑</a></div><nav aria-label="フッターページナビゲーション">{pages.map(([path,label])=><Link key={path} href={base+path}>{label}</Link>)}</nav><div><span>© 2026 {site.name} nail atelier.</span><Link href="/">サンプル一覧へ戻る ↗</Link><span>LAYOUT B / MINIMAL STYLISH</span></div></footer><ReservationButton floating/></div></>;}
