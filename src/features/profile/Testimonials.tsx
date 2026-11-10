'use client';
import { useRef, useState } from 'react';
import { reviews, type Review } from './voices';
import { Choices, ProfileDemo } from './ui';
import s from './profile.module.css';

function ReviewCard({ review }: { review: Review }) {
  return <article className={s.quote}>
    <div><span className={s.badge}>{review.menu}</span></div>
    <blockquote>「{review.quote}」</blockquote>
    <p><strong>{review.name}</strong> · <time dateTime={review.date}>{review.date}</time></p>
    <details><summary>感想の続きを読む</summary><p>{review.detail}</p></details>
  </article>;
}

export function ReviewGallery({ items }: { items: readonly Review[] }) {
  const [mode, setMode] = useState('スライド');
  const [index, setIndex] = useState(0);
  const rail = useRef<HTMLDivElement>(null);
  function move(next: number) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const container = rail.current;
    const card = container?.children[next];
    if (container && card instanceof HTMLElement) {
      container.scrollTo({ left: card.offsetLeft, behavior: reducedMotion ? 'instant' : 'smooth' });
      setIndex(next);
    }
  }
  if (!items.length) return <p className={s.empty}>掲載中の口コミはありません。</p>;
  return <>
    <Choices label="口コミの表示方法" options={['スライド', '一覧']} value={mode} change={value => { setMode(value); setIndex(0); }} />
    {mode === '一覧' ? <div className={s.grid}>{items.map(item => <ReviewCard review={item} key={item.id} />)}</div> : <>
      <div className={s.rail} ref={rail} tabIndex={0} aria-label="横にスクロールできる口コミ" onScroll={event => {
        const element = event.currentTarget;
        const page = Math.round(element.scrollLeft / element.clientWidth);
        setIndex(Math.max(0, Math.min(items.length - 1, page)));
      }}>{items.map(item => <ReviewCard review={item} key={item.id} />)}</div>
      <div className={s.toolbar}>
        <button type="button" disabled={index === 0} onClick={() => move(index - 1)}>前の口コミ</button>
        <span role="status">{index + 1} / {items.length}</span>
        <button type="button" disabled={index === items.length - 1} onClick={() => move(index + 1)}>次の口コミ</button>
      </div>
    </>}
  </>;
}

export default function Testimonials() {
  return <ProfileDemo id="P08" title="お客様の声の掲載例" guide="横スクロールで読む表示と、すべてを一覧で読む表示を切り替えられます。">
    <p>以下はすべて架空の口コミです。</p><ReviewGallery items={reviews} />
  </ProfileDemo>;
}
