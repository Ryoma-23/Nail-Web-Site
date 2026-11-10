'use client';
import { useState } from 'react';
import { categories, colors } from '../gallery/data';
import { recommend, type Preferences } from './recommendation';
import { DesignCard, Lab } from './ui';
import s from './interactive.module.css';

const filters=[{key:'color',label:'希望カラー',values:Object.keys(colors)},{key:'category',label:'カテゴリー',values:categories},{key:'occasion',label:'利用シーン',values:['オフィス','休日','お呼ばれ']}] as const;

export default function DesignRecommendation(){
  const [input,setInput]=useState<Preferences>({});
  const [budget,setBudget]=useState('');
  const [result,setResult]=useState<ReturnType<typeof recommend>>();
  const [error,setError]=useState('');
  return <Lab id="I08" title="条件ベースのデザイン提案デモ" guide="色・カテゴリー・予算・場面を絞り込み、希望の言葉に近い作品をギャラリーから探します。">
    <form className={s.stack} noValidate onSubmit={event=>{
      event.preventDefault();
      const value=budget===''?undefined:Number(budget);
      if(value!==undefined&&(!Number.isSafeInteger(value)||value<0)){setError('予算は0円以上の整数で入力してください。');setResult(undefined);return;}
      setError('');setResult(recommend({...input,budget:value}));
    }}>
      <div className={s.controls}>{filters.map(item=><label key={item.key}>{item.label}<select value={input[item.key]??''} onChange={event=>setInput({...input,[item.key]:event.target.value})}>
        <option value="">指定なし</option>{item.values.map(option=><option key={option}>{option}</option>)}
      </select></label>)}
      <label>参考予算の上限（円）<input type="number" min={0} step={1} value={budget} onChange={event=>setBudget(event.target.value)}/></label></div>
      <label>希望のキーワード<input type="text" maxLength={120} value={input.keywords??''} onChange={event=>setInput({...input,keywords:event.target.value})} placeholder="例：上品 透け感"/></label>
      {error&&<p role="alert">{error}</p>}
      <div className={s.row}><button type="submit" className={s.primary}>条件から作品を探す</button><button type="button" onClick={()=>{setInput({});setBudget('');setResult(undefined);setError('');}}>条件をリセット</button></div>
    </form>
    {result&&<p role="status">{result.length?'おすすめ '+result.length+'件':'条件に合う作品がありません。色や予算などの条件を緩めてお試しください。'}</p>}
    {!!result?.length&&<div className={s.grid}>{result.map(item=><DesignCard key={item.design.id} design={item.design}><p>おすすめ理由 · {item.reasons.join('、')}</p></DesignCard>)}</div>}
  </Lab>;
}
