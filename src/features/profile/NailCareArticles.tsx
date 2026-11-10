'use client';
import { useRef, useState } from 'react';
import { Modal } from '../gallery/ui';
import { getArticles, type Article } from './content';
import { Choices, PhotoView, ProfileDemo } from './ui';
import s from './profile.module.css';

function ArticleMeta({ article }: { article: Article }) {
  return <p className={s.date}><time dateTime={article.publishedAt}>{article.publishedAt}</time> · {article.category} · 約{article.minutes}分</p>;
}

export function ArticleLibrary({ items }: { items: readonly Article[] }) {
  const [category, setCategory] = useState('すべて');
  const [selected, setSelected] = useState<Article>();
  const articleBody = useRef<HTMLDivElement>(null);
  const visible = items.filter(item => category === 'すべて' || item.category === category);
  return <>
    <Choices label="コラムカテゴリー" options={['すべて', ...new Set(items.map(item => item.category))]} value={category} change={setCategory} />
    <div className={s.grid}>{visible.map(item => <article key={item.id} className={s.card}>
      <PhotoView photo={item.photo} /><ArticleMeta article={item} /><h4>{item.title}</h4><p>{item.summary}</p>
      <button type="button" onClick={() => setSelected(item)}>記事を読む</button>
    </article>)}</div>
    {selected && <Modal title={selected.title} onClose={() => setSelected(undefined)}>
      <div className={s.stack} ref={articleBody} tabIndex={-1} aria-label={selected.title}><ArticleMeta article={selected} />
        <PhotoView photo={selected.photo} eager />{selected.content.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        <div className={s.stack}><strong>関連記事</strong>{items.filter(item => selected.related.includes(item.id)).map(item =>
          <button type="button" key={item.id} aria-label={'関連記事：' + item.title} onClick={() => {
            setSelected(item);
            articleBody.current?.focus();
            articleBody.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
          }}>{item.title}</button>)}</div>
      </div>
    </Modal>}
  </>;
}

export default function NailCareArticles() {
  return <ProfileDemo id="P13" title="指先のお手入れと、色選びの話" guide="カテゴリーから記事を選び、本文や関連記事を読めます。">
    <ArticleLibrary items={getArticles()} />
  </ProfileDemo>;
}
