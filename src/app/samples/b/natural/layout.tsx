import Link from 'next/link';
import { site } from '@/data/site';
import { SampleNavigation } from '@/components/common/SampleNavigation';
import { ReservationButton } from '@/components/reservation/ReservationButton';
import { MultiHeader } from '@/themes/natural-multi/Header';
import { pages,base } from '@/data/multiNavigation';
import { MultiReservation, Social } from '@/themes/natural-multi/Shared';
import styles from '@/themes/natural-multi/NaturalMulti.module.css';
export const metadata={title:{default:'mellow | 構成B・Natural Elegant',template:'%s | mellow — 構成B サンプル01'},description:'個人ネイリストのためのナチュラルで上品な複数ページ型サンプル。作品・料金・プロフィール・施術場所をページごとにご覧いただけます。'};
export default function NaturalMultiLayout({children}:{children:React.ReactNode}){return <><SampleNavigation current="natural" layout="b"/><div id="top" className={styles.multi}><a className="skip-link" href="#main">本文へスキップ</a><MultiHeader/><main id="main">{children}<MultiReservation/></main><footer className={styles.footer}><div><Link className="brand" href={base}>{site.name}<small>{site.subtitle}</small></Link><Social/><a href="#top">BACK TO TOP ↑</a></div><nav aria-label="フッターページナビゲーション">{pages.map(([path,label])=><Link key={path} href={base+path}>{label}</Link>)}</nav><div><span>© 2026 {site.name} nail atelier.</span><Link href="/">サンプル一覧へ戻る ↗</Link><span>LAYOUT B / NATURAL ELEGANT</span></div></footer><ReservationButton floating/></div></>;}
