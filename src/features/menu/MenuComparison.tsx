'use client';
import { useState } from 'react';
import { menus } from './data';
import { MenuDemo, MenuFacts } from './ui';
import s from './menu.module.css';

export default function MenuComparison() {
  const [ids, setIds] = useState(['one', 'art']);
  const selected = menus.filter(menu => ids.includes(menu.id));
  return <MenuDemo id="M09" title="気になる施術を比較" guide="最大3件まで選べます。スマホではカードを縦に並べて比較できます。">
    <div className={s.buttons} role="group" aria-label="比較する施術">{menus.map(menu => {
      const active = ids.includes(menu.id);
      return <button type="button" key={menu.id} aria-pressed={active} disabled={!active && ids.length === 3}
        onClick={() => setIds(current => active ? current.filter(id => id !== menu.id) : [...current, menu.id])}>{menu.name}</button>;
    })}</div>
    <p role="status">{selected.length} / 3 件{selected.length === 3 ? ' · 別の施術を追加するには、選択中の施術を1件外してください。' : ''}</p>
    <div className={s.compare}>{selected.map(menu => <article className={s.card} key={menu.id}>
      <h4>{menu.name}</h4><MenuFacts menu={menu} />
      <dl><dt>特徴</dt><dd>{menu.description}</dd><dt>おすすめの場面</dt><dd>{menu.scene}</dd></dl>
      <button type="button" aria-label={menu.name + 'を比較から外す'} onClick={() => setIds(current => current.filter(id => id !== menu.id))}>比較から外す</button>
    </article>)}</div>
    {selected.length === 0 && <p>上から比較したい施術を選んでください。</p>}
  </MenuDemo>;
}
