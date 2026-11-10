'use client';
import { useEffect, useState } from 'react';
import { faqs, type FAQItem } from '../profile/content';
import { Choices, MarketingDemo } from './ui';
import s from './marketing.module.css';

const entries: FAQItem[] = [...faqs, { id: 'short', category: '施術', question: '爪が短くても施術できますか？', answer: '長さを整えた自爪でも選べるデザインがあります。当日に爪の状態と好みを確認しながら、仕上がりを相談します。' }];
const anchor = (id: string) => 'faq-' + id;

export function SearchableQuestions({ items }: { items: readonly FAQItem[] }) {
  const [category, setCategory] = useState('すべて');
  const [query, setQuery] = useState('');
  const [target, setTarget] = useState<{ id: string; focus: boolean }>();
  const key = query.normalize('NFKC').trim().toLowerCase();
  const visible = items.filter(item => (category === 'すべて' || item.category === category) &&
    (item.question + ' ' + item.answer).normalize('NFKC').toLowerCase().includes(key));

  useEffect(() => {
    function handleFragment() {
      const id = window.location.hash.slice(1);
      if (!id.startsWith('faq-')) return;
      setCategory('すべて');
      setQuery('');
      setTarget({ id, focus: true });
    }
    const initial = window.setTimeout(handleFragment, 0);
    window.addEventListener('hashchange', handleFragment);
    return () => { window.clearTimeout(initial); window.removeEventListener('hashchange', handleFragment); };
  }, []);

  useEffect(() => {
    if (!target) return;
    const element = document.getElementById(target.id);
    if (!(element instanceof HTMLDetailsElement)) return;
    element.open = true;
    if (target.focus) element.querySelector('summary')?.focus({ preventScroll: true });
    element.scrollIntoView({ block: 'start' });
  }, [target]);

  return <>
    <label>FAQを検索<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="例：施術時間" /></label>
    <Choices label="FAQカテゴリー" options={['すべて', ...new Set(items.map(item => item.category))]} value={category} change={setCategory} />
    <p role="status">{visible.length}件{visible.length === 0 && ' · 別の言葉やカテゴリーでお試しください。'}</p>
    <div className={s.stack}>{visible.map(item => {
      const related = items.filter(other => other.id !== item.id && other.category === item.category).slice(0, 2);
      return <details className={s.card} id={anchor(item.id)} key={item.id}>
        <summary><span className={s.badge}>{item.category}</span> {item.question}</summary><p>{item.answer}</p>
        <p><a href={'#' + anchor(item.id)} onClick={event => {
          event.preventDefault();
          window.history.replaceState(null, '', '#' + anchor(item.id));
          setTarget({ id: anchor(item.id), focus: false });
        }}>この質問へのリンク</a></p>
        {related.length > 0 && <div className={s.stack}><strong>関連する質問</strong>{related.map(other =>
          <a data-related href={'#' + anchor(other.id)} key={other.id} onClick={event => {
            event.preventDefault();
            setCategory('すべて');
            setQuery('');
            window.history.replaceState(null, '', '#' + anchor(other.id));
            setTarget({ id: anchor(other.id), focus: true });
          }}>{other.question}</a>)}</div>}
      </details>;
    })}</div>
  </>;
}

export default function SearchFAQ() {
  return <MarketingDemo id="B08" title="予約前の疑問を探す" guide="質問・回答を検索できます。関連質問や、質問に直接移動できるリンクも試せます。">
    <SearchableQuestions items={entries} />
  </MarketingDemo>;
}
