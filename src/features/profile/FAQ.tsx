'use client';
import { useState } from 'react';
import { faqs, type FAQItem } from './content';
import { Choices, ProfileDemo } from './ui';
import s from './profile.module.css';

export function Questions({ items }: { items: readonly FAQItem[] }) {
  const [category, setCategory] = useState('すべて');
  const visible = items.filter(item => category === 'すべて' || item.category === category);
  return <>
    <Choices label="質問カテゴリー" options={['すべて', ...new Set(items.map(item => item.category))]} value={category} change={setCategory} />
    <div className={s.stack}>{visible.map(item => <details key={item.id} className={s.card}>
      <summary>{item.question}</summary><p>{item.answer}</p>
    </details>)}</div>
  </>;
}

export default function FAQ() {
  return <ProfileDemo id="P09" title="来店前によくある質問" guide="質問を選んで回答を開きます。複数開いたまま読み比べられます。">
    <Questions items={faqs} />
  </ProfileDemo>;
}
