'use client';
import { useState } from 'react';
import { Modal } from '../gallery/ui';
import { PhotoView } from '../profile/ui';
import { interviews, reviews } from '../profile/voices';
import { Choices, MarketingDemo } from './ui';
import s from './marketing.module.css';

const modes = ['口コミカード型','写真中心型','インタビュー型'] as const;
export default function CustomerStories() {
  const [mode, setMode] = useState<typeof modes[number]>(modes[0]);
  const [index, setIndex] = useState(0);
  const [details, setDetails] = useState(false);
  const story = interviews[index];
  const review = reviews[index];
  const photoFirst = mode !== '口コミカード型';
  const category = index === 0 ? 'SIMPLE' : 'NUANCE';
  return <MarketingDemo id="B07" title="仕上がりと、お客様の声" guide="表示方法を切り替え、矢印ボタンで事例を読み比べられます。">
    <p>架空の口コミと施術事例です。顧客サイトでは掲載許可を得た内容を使用します。</p>
    <Choices label="施術事例の表示方法" options={modes} value={mode} change={setMode} />
    <article className={photoFirst ? s.hero : s.card} key={story.id + mode}>
      {photoFirst && <PhotoView photo={story.photo} />}
      <div className={s.stack}><span className={s.kicker}>{category} · {story.menu} · 担当 Kotomi</span>
        <h4>{story.title}</h4><blockquote>「{review.quote}」</blockquote><p>{story.guest}</p>
        {mode === 'インタビュー型' && <p>{story.questions[0].answer}</p>}
        <button type="button" onClick={() => setDetails(true)}>施術事例の詳細</button></div>
      {!photoFirst && <PhotoView photo={story.photo} />}
    </article>
    <div className={s.row}><button type="button" onClick={() => setIndex((index + interviews.length - 1) % interviews.length)}>前の事例</button>
      <span role="status">{index + 1} / {interviews.length}</span><button type="button" onClick={() => setIndex((index + 1) % interviews.length)}>次の事例</button></div>
    {details && <Modal title={story.title} onClose={() => setDetails(false)}><PhotoView photo={story.photo} eager />
      <p>{story.menu} · {category} · Kotomi</p><p>{review.detail}</p>
      <dl>{story.questions.map(item => <div key={item.question}><dt>{item.question}</dt><dd>{item.answer}</dd></div>)}</dl><p>{story.comment}</p>
    </Modal>}
  </MarketingDemo>;
}
