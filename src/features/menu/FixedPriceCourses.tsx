'use client';
import { useState } from 'react';
import { sampleDesigns } from '../gallery/data';
import { Grid } from '../gallery/ui';
import { courses, menus } from './data';
import { MenuDemo, MenuFacts } from './ui';
import s from './menu.module.css';

export default function FixedPriceCourses() {
  const [index, setIndex] = useState(0);
  const course = courses[index];
  const menu = menus.find(item => item.id === course.menuId);
  return <MenuDemo id="M07" title="料金で選べるデザインコース" guide="コースを切り替えると、料金と選べるデザインが変わります。">
    <div className={s.buttons} role="group" aria-label="定額コース">{courses.map((item, itemIndex) =>
      <button type="button" aria-pressed={index === itemIndex} key={item.name} onClick={() => setIndex(itemIndex)}>{item.name}</button>)}</div>
    <article className={s.card} key={course.menuId}>
      <h4>{course.name}</h4><p>{course.label}</p>
      {menu && <MenuFacts menu={menu} />}
      <Grid designs={sampleDesigns.filter(item => course.designs.includes(item.id))} animatedKey={course.name} />
      <details><summary>コースの詳細</summary><p>{menu?.description}</p><p>表示のデザインからお選びください。付替オフや追加パーツは別料金です。</p></details>
    </article>
  </MenuDemo>;
}
