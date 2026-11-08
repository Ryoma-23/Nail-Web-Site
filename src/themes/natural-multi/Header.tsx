'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { site } from '@/data/site';
import styles from './NaturalMulti.module.css';
import { base,pages } from '@/data/multiNavigation';
export function MultiHeader(){const [open,setOpen]=useState(false);const pathname=usePathname();return <header className={styles.header}><Link href={base} className="brand" aria-label={`${site.name} HOME`} onClick={()=>setOpen(false)}>{site.name}<small>{site.subtitle}</small></Link><nav className={styles.desktopNav} aria-label="ページナビゲーション">{pages.map(([path,label])=><Link key={path} href={base+path} aria-current={pathname.replace(/\/$/,'')===(base+path).replace(/\/$/,'')?'page':undefined}>{label}</Link>)}<a className={styles.reserveLink} href="#reservation">Reservation <ArrowUpRight size={13}/></a></nav><button className={`icon-button ${styles.toggle}`} aria-label={open?'メニューを閉じる':'メニューを開く'} aria-expanded={open} aria-controls="multi-mobile-nav" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>{open&&<nav id="multi-mobile-nav" className={styles.mobileNav} aria-label="モバイルページナビゲーション">{pages.map(([path,label])=><Link key={path} href={base+path} aria-current={pathname.replace(/\/$/,'')===(base+path).replace(/\/$/,'')?'page':undefined} onClick={()=>setOpen(false)}>{label}<ArrowUpRight size={15}/></Link>)}<a href="#reservation" onClick={()=>setOpen(false)}>Reservation<ArrowUpRight size={15}/></a></nav>}</header>;}
