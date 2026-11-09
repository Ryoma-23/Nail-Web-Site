'use client';
import { useState } from 'react';
import { Modal } from '../gallery/ui';
import { firstOffers, menus, yen } from './data';
import { MenuDemo } from './ui';
import s from './menu.module.css';

export default function FirstTimeMenu() {
  const [booking, setBooking] = useState('');
  return <MenuDemo id="M06" title="はじめての方へ" guide="通常料金と初回料金を見比べられます。予約ボタンを押すと次の画面の例が開きます。">
    <div className={s.grid}>{firstOffers.map(offer => {
      const menu = menus.find(item => item.id === offer.id);
      if (!menu) return null;
      return <article className={s.card} key={offer.id}>
        <span className={s.badge}>初回限定</span><h4>{menu.name}</h4>
        <p className={s.facts}><del>通常 {yen(menu.price)}</del><strong>初回 {yen(offer.price)}</strong></p>
        <p>通常料金との差額 {yen(menu.price - offer.price)}</p>
        <p>当店へのご来店が初めての方が対象です。他の割引との併用はできません。</p>
        <small>{offer.note}</small>
        <button type="button" className={s.primary} onClick={() => setBooking(menu.name)}>初回メニューの予約を確認（デモ）</button>
      </article>;
    })}</div>
    {booking && <Modal title="予約に進む（デモ）" onClose={() => setBooking('')}><p>{booking}を選びました。</p><p>予約サイトではメニューと空き状況を確認する流れです。この画面で予約の例を確認できます。</p></Modal>}
  </MenuDemo>;
}
