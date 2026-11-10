'use client';
import { useState } from 'react';
import { sampleDesigns } from '../gallery/data';
import { clearFavorites, toggleFavorite, useFavorites } from '../gallery/favoriteStore';
import { designUrl } from '../marketing/data';
import { CopyText, DesignCard, DesignPicker, Lab } from './ui';
import s from './interactive.module.css';

export default function FavoritesBoard() {
  const ids=useFavorites();
  const [chosen,setChosen]=useState('');
  const [sort,setSort]=useState('ギャラリー順');
  const [confirm,setConfirm]=useState(false);
  const list=sampleDesigns.filter(item=>ids.includes(item.id));
  if(sort==='参考料金が安い順') list.sort((a,b)=>a.price-b.price);
  if(sort==='作品名順') list.sort((a,b)=>a.title.localeCompare(b.title,'ja'));
  return <Lab id="I05" title="お気に入りのデザイン帳" guide="保存は作品IDだけです。ギャラリーのお気に入りと同じ内容を、このブラウザで確認できます。">
    <DesignPicker label="保存する作品" value={chosen} change={setChosen}/>
    <button type="button" disabled={!chosen||ids.includes(chosen)} onClick={()=>{toggleFavorite(chosen);setChosen('');}}>お気に入りに追加</button>
    <p role="status">お気に入り {list.length} 件</p>
    <label>並び替え<select value={sort} onChange={event=>setSort(event.target.value)}>{['ギャラリー順','参考料金が安い順','作品名順'].map(item=><option key={item}>{item}</option>)}</select></label>
    {list.length ? <><div className={s.grid}>{list.map(item=><DesignCard key={item.id} design={item}><button type="button" aria-label={item.title+'を解除'} onClick={()=>toggleFavorite(item.id)}>登録解除</button></DesignCard>)}</div>
      <CopyText value={list.map(item=>item.title+'\n'+designUrl(item)).join('\n\n')} label="共有用テキストをコピー"/>
      {confirm ? <div className={s.notice}><p>ギャラリーと共有するお気に入りをすべて解除しますか？</p><div className={s.row}><button type="button" onClick={()=>{clearFavorites();setConfirm(false);}}>すべて解除する</button><button type="button" onClick={()=>setConfirm(false)}>キャンセル</button></div></div> :
        <button type="button" onClick={()=>setConfirm(true)}>全削除</button>}</> : <p className={s.notice}>お気に入りはまだありません。</p>}
  </Lab>;
}
