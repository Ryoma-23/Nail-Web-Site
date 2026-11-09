'use client';
import { useState } from 'react';
import { baseMenus, options, yen } from './data';
import { duration, updateQuantity, type Quantities } from './logic';
import { BasePicker, Estimate, MenuDemo } from './ui';
import s from './menu.module.css';

export function Calculator({ kind }: { kind: 'price' | 'options' | 'time' }) {
  const [id, setId] = useState('');
  const [quantities, setQuantities] = useState<Quantities>({});
  const base = baseMenus.find(menu => menu.id === id);
  const optionOnly = kind === 'options';
  const time = kind === 'time';
  const visible = optionOnly ? options : options.filter(option => base?.optionIds.includes(option.id));
  const additions = visible.filter(option => !option.exclusiveGroup);
  const removal = visible.filter(option => option.exclusiveGroup === 'off');

  function selectBase(nextId: string) {
    const next = baseMenus.find(menu => menu.id === nextId);
    setId(nextId);
    setQuantities(previous => Object.fromEntries(Object.entries(previous).filter(([key]) => next?.optionIds.includes(key))));
  }

  return <MenuDemo id={optionOnly ? 'M03' : time ? 'M04' : 'M02'}
    title={optionOnly ? '追加オプションの見積もり' : time ? 'サロンで過ごす時間を計算' : '施術料金の見積もり'}
    guide={optionOnly ? '必要な個数と付替オフを選ぶと、項目別の小計と合計が表示されます。' : 'ベースメニューを選び、追加したい内容を選んでください。'}>
    <div className={s.calculator}>
      <div className={s.stack}>
        {!optionOnly && <BasePicker id={id} select={selectBase} />}
        {removal.length > 0 && <label>付替オフ
          <select value={removal.find(item => quantities[item.id])?.id ?? ''} onChange={event => {
            const selected = removal.find(item => item.id === event.target.value);
            setQuantities(previous => selected ? updateQuantity(previous, selected, 1) :
              Object.fromEntries(Object.entries(previous).filter(([key]) => !removal.some(item => item.id === key))));
          }}>
            <option value="">オフなし</option>
            {removal.map(item => <option key={item.id} value={item.id}>{item.name} · {time ? duration(item.minutes) : yen(item.price)} / 一律</option>)}
          </select>
          <small>{removal.find(item => quantities[item.id])?.note ?? '付替オフはどちらか1種類を選べます。'}</small>
        </label>}
        {additions.length > 0 && <fieldset className={s.stack}><legend>追加オプション</legend>
          {additions.map(option => <label className={s.option} key={option.id}>
            <span><strong>{option.name}</strong> <span>{time ? duration(option.minutes) : yen(option.price)} / 1{['length', 'repair'].includes(option.id) ? '本' : '個'}</span><small>{option.note}</small></span>
            <select aria-label={option.name + 'の数量'} value={quantities[option.id] ?? 0} onChange={event => {
              const value = Number(event.target.value);
              setQuantities(previous => updateQuantity(previous, option, value));
            }}>{Array.from({ length: (option.maxQuantity ?? 1) + 1 }, (_, index) =>
              <option key={index} value={index}>{index === 0 ? '追加なし' : index}</option>)}</select>
          </label>)}
        </fieldset>}
        <button type="button" onClick={() => { setId(''); setQuantities({}); }}>選択をリセット</button>
      </div>
      <Estimate menu={base} quantities={quantities} mode={time ? 'time' : 'price'} />
    </div>
  </MenuDemo>;
}
