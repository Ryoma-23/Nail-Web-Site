'use client';
import { useState } from 'react';
import { colors } from '../gallery/data';
import { Choices } from '../marketing/ui';
import { palette, type PaletteMode } from './colors';
import { Lab, Swatch } from './ui';
import s from './interactive.module.css';

const choices = Object.keys(colors) as (keyof typeof colors)[];
const moods = { やわらかい: '類似色', モード: '補色', 華やか: 'トライアド' } as const;
const scenes = ['普段使い','オフィス','お呼ばれ'] as const;

export default function ColorQuiz() {
  const [base,setBase] = useState<keyof typeof colors>('Pink');
  const [scene,setScene] = useState<typeof scenes[number]>('普段使い');
  const [mood,setMood] = useState<keyof typeof moods>('やわらかい');
  const mode: PaletteMode = scene === 'オフィス' ? 'モノクロマティック' : moods[mood];
  const tones = palette(colors[base], mode);
  const result = [...new Set([tones[0], ...(scene === 'お呼ばれ' ? [tones[2],tones[1],tones[3],'#efe0c2'] : tones.slice(1))])];
  return <Lab id="I02" title="色を選んで、組み合わせを探す" guide="好きな色・使う場面・雰囲気に合わせたファッション上の配色提案です。">
    <fieldset><legend>好きな色</legend><div className={s.row}>{choices.map(name => <button key={name} type="button" aria-pressed={base===name} onClick={()=>setBase(name)}><Swatch label={name} color={colors[name]} /></button>)}</div></fieldset>
    <Choices label="使う場面" options={scenes} value={scene} change={setScene} />
    <Choices label="仕上がりの雰囲気" options={Object.keys(moods) as (keyof typeof moods)[]} value={mood} change={setMood} />
    <div className={s.panel}><h4>{scene}向け · {mode}パレット</h4><p>{base}を主役に、{scene === 'オフィス' ? '同じ色相で明暗を変えると落ち着いて見えます。' : mood + '印象になる色をアクセントとして添えます。'}</p>
      <div className={s.palette}>{result.map((color,index)=><div className={s.stack} key={color}><div className={s.chip} style={{ backgroundColor:color }} /><small>{index === 0 ? 'ベース' : '差し色 ' + index} · {color}</small></div>)}</div>
      <p>組み合わせ例 · ベースを4本に使い、残り1本を差し色に。</p></div>
  </Lab>;
}
