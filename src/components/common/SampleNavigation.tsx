import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { samplesForLayout, type SampleLayout } from '@/data/sampleLayouts';
import styles from './SampleNavigation.module.css';
export function SampleNavigation({current,layout='a'}:{current:'natural'|'luxury'|'feminine'|'minimal';layout?:SampleLayout}) { return <aside className={styles.bar} aria-label="サンプル切り替え"><Link className={styles.back} href="/"><ArrowLeft size={13}/> サンプル一覧</Link><nav aria-label="デザイン切り替え">{samplesForLayout(layout).filter(s=>s.available).map(s=><Link key={s.theme} href={s.href} aria-current={s.theme===current?'page':undefined}>{s.number}<span>{s.japanese}</span><ArrowUpRight size={12}/></Link>)}</nav><Link className={styles.layoutLink} href={`/samples/${layout==='a'?'b':'a'}/${layout==='b'||samplesForLayout('b').some(s=>s.theme===current&&s.available)?current:'natural'}/`}>{layout==='a'?'構成Bを見る':'構成Aと比べる'}<ArrowUpRight size={12}/></Link></aside>; }
