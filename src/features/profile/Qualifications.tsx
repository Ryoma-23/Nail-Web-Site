'use client';
import { useId, useState } from 'react';
import { qualifications, skills } from './data';
import { ProfileDemo } from './ui';
import s from './profile.module.css';

const tabs = ['資格・研修', '得意な技術'];
export default function Qualifications() {
  const [active, setActive] = useState(0);
  const id = useId();
  return <ProfileDemo id="P04" title="学んだこと、得意なこと" guide="タブを切り替えて研修と技術を比較できます。カードを開くと詳細が読めます。">
    <div role="tablist" aria-label="資格と技術" className={s.toolbar}>{tabs.map((label, index) =>
      <button key={label} id={id + index} type="button" role="tab" aria-controls={id + 'panel'} tabIndex={active === index ? 0 : -1}
        aria-selected={active === index} onClick={() => setActive(index)} onKeyDown={event => {
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index;
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          setActive(next);
          document.getElementById(id + next)?.focus();
        }}>{label}</button>)}</div>
    <div id={id + 'panel'} role="tabpanel" aria-labelledby={id + active} tabIndex={0} className={s.grid}>
      {active === 0 ? qualifications.map(item => <article key={item.name} className={s.card}><span className={s.kicker}>{item.year}年</span>
        <h4>{item.name}</h4><p>{item.description}</p><details><summary>研修内容</summary><p>{item.detail}</p></details></article>) :
        skills.map(item => <article key={item.name} className={s.card}><span className={s.kicker}>{item.category}</span>
          <h4>{item.name}</h4><details><summary>技術の詳細</summary><p>{item.detail}</p></details></article>)}
    </div>
  </ProfileDemo>;
}
