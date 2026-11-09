import { categoryLabels, menus, options, type NailMenu } from './data';
import { MenuDemo, MenuFacts } from './ui';
import s from './menu.module.css';

export default function MenuList() {
  return <MenuDemo id="M01" title="mellow の施術メニュー" guide="カードを開くと、施術の内容と追加できるオプションを確認できます。">
    {(Object.keys(categoryLabels) as NailMenu['category'][]).map(category => <section className={s.group} key={category}>
      <h4>{categoryLabels[category]}</h4>
      <div className={s.grid}>{menus.filter(menu => menu.category === category).map(menu => <details key={menu.id}>
        <summary><strong>{menu.name}</strong><MenuFacts menu={menu} /><small>追加オプション {menu.optionIds.length ? 'あり' : 'なし'}</small></summary>
        <p>{menu.description}</p>
        {menu.optionIds.length > 0 && <p>追加できる項目 · {options.filter(option => menu.optionIds.includes(option.id)).map(option => option.name).join('、')}</p>}
      </details>)}</div>
    </section>)}
  </MenuDemo>;
}
