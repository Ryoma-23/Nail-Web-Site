import { Gallery } from '@/components/gallery/Gallery';
import { PageTitle,PageLink } from '@/themes/natural-multi/Shared';
import styles from '@/themes/natural-multi/NaturalMulti.module.css';
export const metadata={title:'Nail gallery'};
export default function GalleryPage(){return <div className={styles.page}><PageTitle number="1" title="Nail gallery" jp="指先からはじまる、小さなときめき"/><p className={styles.lead}>気分に合わせて、色や質感を楽しむ。<br/>カテゴリーを選んで、お気に入りのデザインを探してください。</p><Gallery/><p className={styles.note}>画像をタップすると拡大できます。すべて差し替え用のサンプルイラストです。</p><div className={styles.next}><PageLink href="menu/">メニューと料金を見る</PageLink></div></div>;}
