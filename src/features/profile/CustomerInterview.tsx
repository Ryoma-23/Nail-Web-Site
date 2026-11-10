'use client';
import { useState } from 'react';
import { Modal } from '../gallery/ui';
import { interviews, type Interview } from './voices';
import { PhotoView, ProfileDemo } from './ui';
import s from './profile.module.css';

export function InterviewList({ items }: { items: readonly Interview[] }) {
  const [selected, setSelected] = useState<Interview>();
  return <>
    <div className={s.grid}>{items.map(item => <article className={s.card} key={item.id}>
      <PhotoView photo={item.photo} /><span className={s.kicker}>{item.menu}</span><h4>{item.title}</h4>
      <p>{item.guest}</p><button type="button" onClick={() => setSelected(item)}>インタビューを読む</button>
    </article>)}</div>
    {selected && <Modal title={selected.title} onClose={() => setSelected(undefined)}>
      <p>{selected.guest} · {selected.menu}</p><PhotoView photo={selected.photo} eager />
      <dl>{selected.questions.map(item => <div key={item.question}><dt><strong>Q. {item.question}</strong></dt><dd>{item.answer}</dd></div>)}</dl>
      <p><strong>Kotomiのコメント</strong></p><p>{selected.comment}</p>
    </Modal>}
  </>;
}

export default function CustomerInterview() {
  return <ProfileDemo id="P14" title="お客様の体験を、記事で紹介" guide="写真から施術を見比べ、気になる体験をQ&Aで読めます。">
    <p>以下は架空のインタビューです。</p><InterviewList items={interviews} />
  </ProfileDemo>;
}
