'use client';
import Link from 'next/link';
import { ArrowLeft, Check, Plus, ListChecks } from 'lucide-react';
import { toggleSelection,useSelection } from './selection';
import s from './catalog.module.css';
export function FeatureHeader(){const ids=useSelection();return <header className={s.header}><Link href="/" className={s.back}><ArrowLeft size={16}/>サンプル一覧</Link><Link href="/features/" className={s.brand}>mellow <span>FEATURE CATALOG</span></Link><Link href="/features/selected/" className={s.selected}><ListChecks size={17}/>希望リスト <strong aria-live="polite">{ids.length}</strong></Link></header>}
export function SelectFeature({id,name}:{id:string;name:string}){const active=useSelection().includes(id);return <button type="button" className={s.selectButton} aria-pressed={active} aria-label={name+'を希望リストに追加'} onClick={()=>toggleSelection(id)}>{active?<Check size={16}/>:<Plus size={16}/>} {active?'選択済み':'希望に追加'}</button>}
