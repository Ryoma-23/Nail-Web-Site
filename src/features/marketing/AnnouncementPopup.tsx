'use client';
import { useEffect, useRef, useState, useId, type KeyboardEvent } from 'react';
import { Art } from '../gallery/ui';
import { campaigns } from './data';
import { Choices, MarketingDemo } from './ui';
import s from './marketing.module.css';

const styles = ['モーダル型','画面下部','画像付き'] as const;
const timings = ['ボタン操作時','枠の表示直後','枠内のスクロール後'] as const;
type Timing = typeof timings[number];

export default function AnnouncementPopup() {
  const [style, setStyle] = useState<typeof styles[number]>(styles[0]);
  const [timing, setTiming] = useState<Timing>(timings[0]);
  const [open, setOpen] = useState(false);
  const shown = useRef(false);
  const close = useRef<HTMLButtonElement>(null);
  const previous = useRef<HTMLElement | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const id = useId();
  const campaign = campaigns[2];

  function show() {
    if (open) return;
    previous.current = document.activeElement instanceof HTMLElement && document.activeElement !== document.body
      ? document.activeElement : null;
    shown.current = true;
    setOpen(true);
  }

  function dismiss() {
    setOpen(false);
    requestAnimationFrame(() => {
      const trigger = previous.current;
      if (trigger?.isConnected) trigger.focus();
      else scroller.current?.focus();
    });
  }

  function changeTiming(next: Timing) {
    if (timing === next) return;
    setTiming(next);
    shown.current = false;
    if (scroller.current) scroller.current.scrollTop = 0;
    if (next === '枠の表示直後') {
      shown.current = true;
      show();
    } else if (open) dismiss();
  }

  useEffect(() => { if (open) close.current?.focus(); }, [open]);

  function onOverlayKey(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      dismiss();
    }
    if (event.key === 'Tab') {
      const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled),a[href]'));
      const edge = event.shiftKey ? controls[0] : controls.at(-1);
      if (document.activeElement === edge) {
        event.preventDefault();
        (event.shiftKey ? controls.at(-1) : controls[0])?.focus();
      }
    }
  }

  return <MarketingDemo id="B10" title="必要なときだけ、告知を表示" guide="ポップアップの形とタイミングを選んでください。スクロールを試すときは、サロンの見本枠の中を動かします。">
    <Choices label="ポップアップの種類" options={styles} value={style} change={setStyle} />
    <Choices label="表示タイミング" options={timings} value={timing} change={changeTiming} />
    <div className={s.row}><button type="button" onClick={show} disabled={open}>再表示</button></div>
    <div className={s.preview} data-popup-stage>
      <div ref={scroller} tabIndex={0} aria-label="スクロールプレビュー" data-popup-scroll className={s.previewScroll} inert={open}
        onScroll={event => {
          if (timing === '枠内のスクロール後' && !shown.current && event.currentTarget.scrollTop >= 100) show();
        }}>
        <div className={s.mock}><h4>mellow / DEMO SITE</h4><p>サロンの最新情報をチェック。</p><button type="button" onClick={show}>この枠で告知を表示</button></div>
        <div className={s.mock}><h4>季節のデザイン</h4><p>スクロール後のタイミングを試せます。</p></div>
      </div>
      {open && <div className={s.popupLayer} data-popup={style}>
        <section className={s.popup} role="dialog" aria-labelledby={id} onKeyDown={onOverlayKey}>
          {style === '画像付き' && <Art src={campaign.image} alt="ホリデーのローズ色ネイル見本" />}
          <span className={s.kicker}>MELLOW / ANNOUNCEMENT</span><h4 id={id}>{campaign.title}</h4><p>{campaign.text}</p>
          <button ref={close} type="button" onClick={dismiss}>告知を閉じる</button>
        </section>
      </div>}
    </div>
  </MarketingDemo>;
}
