'use client';
import { useRef, useState } from 'react';
import { yen } from './data';
import { duration, recommend, type QuizAnswers } from './logic';
import { MenuDemo } from './ui';
import s from './menu.module.css';

const questions = [
  { title: '当店のご利用は初めてですか？', choices: [['初めて', 'yes'], ['利用したことがある', 'no']] },
  { title: 'どんな仕上がりが好みですか？', choices: [['シンプル', 'simple'], ['アートを楽しみたい', 'design'], ['自爪を整えたい', 'care']] },
  { title: 'ご予算は？', choices: [['5,000円まで', '5000'], ['7,000円まで', '7000'], ['9,000円まで', '9000'], ['12,000円まで', '12000']] },
  { title: '確保できる時間は？', choices: [['60分まで', '60'], ['90分まで', '90'], ['120分まで', '120'], ['150分まで', '150']] },
  { title: '付替オフは必要ですか？', choices: [['オフなし', 'none'], ['自店オフ', 'own'], ['他店オフ', 'other']] },
] as const;

export default function MenuQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const progress = useRef<HTMLParagraphElement>(null);
  const question = questions[step];

  function move(next: number) {
    setStep(next);
    progress.current?.focus();
  }

  const recommendations = question ? [] : recommend({
    first: answers[0] === 'yes',
    style: answers[1] as QuizAnswers['style'],
    budget: Number(answers[2]),
    time: Number(answers[3]),
    off: answers[4] as QuizAnswers['off'],
  });

  return <MenuDemo id="M08" title="あなたに合う施術を探す" guide="5つの質問に答えると、オフ代と時間も含めて条件に合う施術を表示します。">
    <p ref={progress} tabIndex={-1} aria-live="polite">{question ? '質問 ' + (step + 1) + ' / ' + questions.length : '診断結果'}</p>
    <progress className={s.progress} value={step} max={questions.length} aria-label="診断の進捗" />
    {question ? <fieldset className={s.stack}>
      <legend>{question.title}</legend><div className={s.buttons}>{question.choices.map(([label, value]) =>
        <button key={value} type="button" aria-pressed={answers[step] === value} onClick={() => {
          setAnswers(previous => {
            const next = [...previous];
            next[step] = value;
            return next;
          });
          move(step + 1);
        }}>{label}</button>)}</div>
    </fieldset> : <>
      {recommendations.length ? <div className={s.grid}>{recommendations.map(item => <article className={s.card} key={item.menu.id}>
        <h4>{item.menu.name}</h4>
        <p className={s.facts}><strong>{yen(item.price)}</strong><span>{duration(item.minutes)}</span></p>
        <p>{item.menu.description} 選んだ仕上がりに合い、予算・所要時間の範囲内です。</p>
        <small>{item.first ? '初回料金を適用。' : '通常料金で計算。'}{item.lines.length > 1 ? item.lines[1].name + 'を含みます。' : '付替オフなし。'}</small>
      </article>)}</div> : <p role="status">条件に合うメニューがありません。予算や施術時間を変更して、もう一度お試しください。</p>}
    </>}
    <div className={s.buttons}>
      <button type="button" disabled={step === 0} onClick={() => move(step - 1)}>前の質問に戻る</button>
      {!question && <button type="button" className={s.primary} onClick={() => { setAnswers([]); move(0); }}>最初からやり直す</button>}
    </div>
  </MenuDemo>;
}
