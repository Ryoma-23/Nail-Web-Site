import Image from 'next/image';
import { site } from '@/data/site';
import { PageTitle,PageLink,Social } from '@/themes/natural-multi/Shared';
import styles from '@/themes/natural-multi/NaturalMulti.module.css';
export const metadata={title:'Profile'};
export default function ProfilePage(){return <div className={styles.page}><PageTitle number="3" title="Meet your nailist" jp="あなたの「好き」を、一緒に見つける"/><div className={styles.profile}><div className={styles.profileImage}><Image src={site.profile.image} alt="ネイリスト写真差し替え用のアトリエイラスト" width={700} height={800} sizes="(max-width:767px) 90vw, 40vw"/><span>PROFILE IMAGE PLACEHOLDER</span></div><div><span className={styles.eyebrow}>{site.profile.role}</span><h2>{site.profile.name}<small>仮プロフィール</small></h2><p>{site.profile.career}</p><h3>得意なデザイン</h3><p>{site.profile.specialty}</p><h3>お客様へ</h3><p>{site.profile.message}</p><Social/></div></div><div className={styles.next}><PageLink href="salon/">施術スペースについて</PageLink></div></div>;}
