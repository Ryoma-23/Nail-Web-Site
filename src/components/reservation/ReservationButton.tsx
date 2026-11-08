'use client';
import { useState } from 'react';
import { CalendarDays, ArrowUpRight } from 'lucide-react';
import { site } from '@/data/site';
import { Modal } from '@/components/common/Modal';
export function ReservationButton({ floating = false }: { floating?: boolean }) {
  const [open, setOpen] = useState(false);
  const content = <><CalendarDays size={18}/><span>{floating ? '予約する' : 'HOT PEPPER Beauty で予約'}<small>{site.reservationUrl ? '外部予約サイトへ' : 'サンプル・予約先未設定'}</small></span><ArrowUpRight size={18}/></>;
  return <><div className={floating ? 'floating-reservation' : 'reservation-wrap'}>{site.reservationUrl ? <a className="cta" href={site.reservationUrl} target="_blank" rel="noopener noreferrer">{content}</a> : <button className="cta" onClick={() => setOpen(true)}>{content}</button>}</div>{open && <Modal label="予約について" close={() => setOpen(false)}><div className="notice"><span className="eyebrow">RESERVATION</span><h2>ご予約ページは準備中です</h2><p>こちらはサンプルサイトです。HOT PEPPER Beauty の予約URLは未設定のため、現在ご予約を受け付けていません。</p><button className="text-link" onClick={() => setOpen(false)}>サイトに戻る →</button></div></Modal>}</>;
}
