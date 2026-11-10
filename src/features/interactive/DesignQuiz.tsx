'use client';
import { useState } from 'react';
import { colors } from '../gallery/data';
import { Choices } from '../marketing/ui';
import { recommend } from './recommendation';
import { DesignCard, Lab } from './ui';
import s from './interactive.module.css';

const questions = [
  { title: '好きな雰囲気', options: ['上品','かわいい','個性的'] },
  { title: '好きなカラー', options: Object.keys(colors) },
  { title: '参考予算の上限', options: ['7,000円','9,000円','12,000円'] },
  { title: '利用するシーン', options: ['オフィス','休日','お呼ばれ'] },
  { title: '仕上がりの華やかさ', options: ['控えめ','華やか'] },
];

export default function DesignQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const question = questions[step];
  const results = question ? [] : recommend({ mood: answers[0], color: answers[1], budget: Number(answers[2].replace(/[^0-9]/g,'')), occasion: answers[3], intensity: answers[4] }, undefined, false);
  return <Lab id="I01" title="いまの気分に似合う指先" guide="5つの質問から、予算内で好みに近い作品を最大3件選びます。">
    <p role="status">{question ? '質問 ' + (step+1) + ' / ' + questions.length : '診断結果'}</p>
    <progress className={s.progress} aria-label="診断の進捗" max={questions.length} value={step} />
    {question ? <fieldset><legend>{question.title}</legend><Choices label={question.title} options={question.options} value={answers[step] ?? ''} change={value => setAnswers(current => {
      const next = [...current]; next[step] = value; return next;
    })} /></fieldset> : results.length ? <div className={s.grid}>{results.map(item =>
      <DesignCard key={item.design.id} design={item.design}><p>おすすめ理由 · {item.reasons.join('、')}</p></DesignCard>)}</div> :
      <p className={s.notice}>条件に合う作品がありません。予算を変えてお試しください。</p>}
    <div className={s.row}>
      <button type="button" disabled={step === 0} onClick={() => setStep(step-1)}>戻る</button>
      {question ? <button type="button" className={s.primary} disabled={!answers[step]} onClick={() => setStep(step+1)}>{step === questions.length-1 ? '診断結果を見る' : '次へ'}</button> :
        <button type="button" className={s.primary} onClick={() => { setStep(0); setAnswers([]); }}>最初からやり直す</button>}
    </div>
  </Lab>;
}
