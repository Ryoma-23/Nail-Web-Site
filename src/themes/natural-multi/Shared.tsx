import Link from 'next/link';
import { ArrowUpRight, Camera } from 'lucide-react';
import { site } from '@/data/site';
import { ReservationButton } from '@/components/reservation/ReservationButton';
import styles from './NaturalMulti.module.css';
import { base } from '@/data/multiNavigation';
export { base };
export function PageTitle({title,jp,number,root=base}:{title:string;jp:string;number:string;root?:string}){return <><div className={styles.breadcrumb}><Link href={root}>Home</Link><span>/</span><span>{title}</span></div><div className={styles.pageTitle}><span>0{number} / {site.name.toUpperCase()} NAIL ATELIER</span><h1>{title}</h1><p>{jp}</p></div></>;}
export function PageLink({href,children,root=base}:{href:string;children:React.ReactNode;root?:string}){return <Link className={styles.pageLink} href={root+href}>{children}<ArrowUpRight size={16}/></Link>;}
export function Social(){return site.instagramUrl?<a className={styles.social} href={site.instagramUrl} target="_blank" rel="noopener noreferrer"><Camera size={16}/>Instagram<ArrowUpRight size={13}/></a>:<span className={styles.social}><Camera size={16}/> Instagram · 準備中</span>;}
export function MultiReservation(){return <section id="reservation" className={styles.reservation}><span>A MOMENT, JUST FOR YOU.</span><h2>指先を整える、<br/>心がほどける。</h2><p>あなたにお会いできる日を、楽しみにしています。</p><ReservationButton/><small>予約は HOT PEPPER Beauty の外部サイトで承ります。<br/>現在はサンプルのため、予約先を設定していません。</small></section>;}

