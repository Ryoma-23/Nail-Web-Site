'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Copy, X } from 'lucide-react';
import { categories,features,formatSelection } from './data';
import { useSelection,toggleSelection,clearSelection } from './selection';
import s from './catalog.module.css';
export function Selected(){
 const ids=useSelection();
 const [feedback,setFeedback]=useState(''),[manual,setManual]=useState(false),[confirm,setConfirm]=useState(false);
 const selectionText=formatSelection(ids);
 async function copy(){try{await navigator.clipboard.writeText(selectionText);setFeedback('希望リストをコピーしました。');setManual(false)}catch{setManual(true);setFeedback('自動コピーできませんでした。下のテキストを選択してコピーしてください。')}}
 return <><section className={s.hero}><p className={s.eyebrow}>YOUR FEATURE LIST</p><h1>希望リスト</h1><p>選んだ機能を確認して、制作相談にお使いください。<br/>このリストは制作の希望をまとめるもので、機能が自動で追加されることはありません。</p></section>
 <section className={s.panel}><div className={s.panelTop}><h2>選択した機能 <small>{ids.length}件</small></h2><div className={s.controls}><button type="button" disabled={!ids.length} onClick={copy}><Copy size={16}/>テキストをコピー</button><button type="button" disabled={!ids.length} onClick={()=>setConfirm(true)}>全選択解除</button></div></div>
 {confirm&&ids.length>0&&<div className={s.confirm}><p>選択した機能をすべて解除しますか？</p><div className={s.controls}><button onClick={()=>{clearSelection();setConfirm(false);setFeedback('選択を解除しました。');setManual(false)}}>すべて解除する</button><button onClick={()=>setConfirm(false)}>キャンセル</button></div></div>}
 <p role="status" className={s.muted}>{feedback}</p>{manual&&ids.length>0&&<textarea aria-label="コピー用の希望リスト" readOnly value={selectionText} onFocus={e=>e.currentTarget.select()} rows={10}/>}
 {ids.length?categories.map(c=>{const chosen=features.filter(f=>f.category===c.id&&ids.includes(f.id));return chosen.length>0&&<div className={s.chosenGroup} key={c.id}><h3>{c.name}</h3><ul>{chosen.map(f=><li key={f.id}><Link href={'/features/'+f.id+'/'}>{f.name}</Link><button type="button" aria-label={f.name+'を解除'} onClick={()=>{toggleSelection(f.id);setFeedback('')}}><X size={16}/>解除</button></li>)}</ul></div>}):<div className={s.empty}><h3>まだ選択されていません</h3><p>機能一覧から気になる機能を追加してください。</p></div>}<Link className={s.back} href="/features/">← 機能一覧へ戻る</Link></section></>
}
