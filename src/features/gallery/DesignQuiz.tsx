'use client';

import { useRef, useState } from 'react';
import { sampleDesigns, type NailDesign } from './data';
import { Demo, Grid } from './ui';
import s from './gallery.module.css';

const questions = [
  { title: '好きな雰囲気は？', choices: ['上品', 'かわいい', '個性的'] },
  { title: '希望するカラーは？', choices: ['Pink', 'Beige', 'White', 'Black', 'Brown', 'Blue', 'Red', 'おまかせ'] },
  { title: 'どんな場面で使いたい？', choices: ['オフィス', '休日', 'お呼ばれ'] },
  { title: '仕上がりの好みは？', choices: ['控えめ', '華やか'] },
] as const;

function score(design: NailDesign, answers: string[]) {
  return design.colors.some(color => color === answers[1]) ? 5 + tagScore(design, answers) : tagScore(design, answers);
}
function tagScore(design: NailDesign, answers: string[]) {
  return [answers[0], answers[2], answers[3]].filter(tag => design.tags.includes(tag)).length;
}

export default function DesignQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const heading = useRef<HTMLParagraphElement>(null);
  const question = questions[step];
  function move(to: number) {
    setStep(to);
    heading.current?.focus();
  }
  const result = question ? [] : [...sampleDesigns].sort((a, b) => score(b, answers) - score(a, answers)).slice(0, 3);
  return <Demo label="G13" title="あなたに似合うデザイン診断" guide="4つの質問に答えると、好みに近い作品を3件ご提案します。">
    <p ref={heading} tabIndex={-1} aria-live="polite">{question ? `質問 ${step + 1} / ${questions.length} · ${question.title}` : '診断結果'}</p>
    <progress className={s.progress} value={step} max={questions.length} aria-label="診断の進捗" />
    {question ? <>
      <fieldset className={s.quiz}><legend>{question.title}</legend><div className={s.row}>
        {question.choices.map(choice => <button type="button" key={choice} aria-pressed={answers[step] === choice}
          onClick={() => {
            setAnswers(current => {
              const next = [...current];
              next[step] = choice;
              return next;
            });
            move(step + 1);
          }}>{choice}</button>)}
      </div></fieldset>
      <button type="button" disabled={step === 0} onClick={() => move(step - 1)}>前の質問に戻る</button>
    </> : <>
      <p>{answers.join(' / ')} の回答から選んだおすすめ作品です。</p>
      <Grid designs={result} />
      <div className={s.bar}><button type="button" onClick={() => move(questions.length - 1)}>前の質問に戻る</button>
        <button type="button" className={s.primary} onClick={() => { setAnswers([]); move(0); }}>最初からやり直す</button></div>
    </>}
  </Demo>;
}
