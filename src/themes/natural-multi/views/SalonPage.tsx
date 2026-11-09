import { MapPin } from 'lucide-react';
import { site } from '@/data/site';
import { PageTitle,PageLink } from '@/themes/natural-multi/Shared';
import styles from '@/themes/natural-multi/NaturalMulti.module.css';

export function SalonPage({root}:{root?:string}){return <div className={styles.page}><PageTitle root={root} number="4" title="Salon information" jp="穏やかな施術スペースへ"/><p className={styles.lead}>店舗の一角を借りた、個人ネイリストの施術スペースです。<br/>店舗全体の公式サイト・運営窓口とは異なります。</p><div className={styles.salon}><div className={styles.location}><MapPin size={34} strokeWidth={1}/><span>YOUR LITTLE RETREAT</span><h2>くつろげる場所で、<br/>指先を整える時間を。</h2><p>{site.salon.area}</p><small>住所・地図は未設定です</small></div><div><dl>{[['施術場所',site.salon.place],['所在地',site.salon.area],['最寄り駅',site.salon.station],['営業日',site.salon.days],['営業時間',site.salon.hours],['アクセス',site.salon.access]].map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl><p className={styles.note}>{site.salon.note}</p></div></div><div className={styles.next}><PageLink root={root} href="menu/">メニューと料金を見る</PageLink></div></div>;}
