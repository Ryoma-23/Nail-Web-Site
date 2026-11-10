'use client';
import { useState } from 'react';
import { getNews, type News } from './content';
import { Choices, ProfileDemo } from './ui';
import s from './profile.module.css';

export function NewsFeed({ items }: { items: readonly News[] }) {
  const [category, setCategory] = useState('すべて');
  return <>
    <Choices label="お知らせカテゴリー" options={['すべて', ...new Set(items.map(item => item.category))]} value={category} change={setCategory} />
    <div className={s.stack}>{items.filter(item => category === 'すべて' || item.category === category).map(item => <article key={item.id} className={s.card}>
      <div className={s.toolbar}><time className={s.date} dateTime={item.publishedAt}>{item.publishedAt}</time>
        <span className={s.kicker}>{item.category}</span>{item.isNew && <span className={s.badge}>新着</span>}</div>
      <h4>{item.title}</h4><p>{item.summary}</p>
      <details><summary>お知らせの詳細</summary>{item.content.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</details>
    </article>)}</div>
  </>;
}

export default function NewsList() {
  return <ProfileDemo id="P12" title="mellow からのお知らせ" guide="新しいお知らせから順に表示します。カテゴリーを選び、詳しい内容を開けます。">
    <NewsFeed items={getNews()} />
  </ProfileDemo>;
}
