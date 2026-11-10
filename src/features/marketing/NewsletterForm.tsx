'use client';
import { useEffect, useRef, useState } from 'react';
import { Mail } from 'lucide-react';
import { MarketingDemo } from './ui';
import s from './marketing.module.css';

export default function NewsletterForm() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<'email' | 'consent' | ''>('');
  const email = useRef<HTMLInputElement>(null);
  const consent = useRef<HTMLInputElement>(null);
  const completion = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (done) completion.current?.focus(); }, [done]);

  return <MarketingDemo id="B11" title="mellowからのお便り" guide="入力チェックと登録完了画面を確認できます。例として demo@example.org をお使いください。">
    <section className={s.hero}><div className={s.stack}><Mail aria-hidden="true" /><h4>季節のデザインと空き状況をお届け</h4>
      <p>新しい作品、お手入れの話、キャンペーンなどの案内を想定しています。</p></div>
      {done ? <div className={s.card}><h5 tabIndex={-1} ref={completion}>登録完了の表示例</h5>
        <p>デモの入力チェックが完了しました。</p>
        <button type="button" onClick={() => setDone(false)}>フォームに戻る</button></div> :
        <form className={s.card} noValidate onSubmit={event => {
          event.preventDefault();
          if (!email.current?.validity.valid) {
            setError('email');
            email.current?.focus();
            return;
          }
          if (!consent.current?.checked) {
            setError('consent');
            consent.current?.focus();
            return;
          }
          event.currentTarget.reset();
          setError('');
          setDone(true);
        }}>
          <label>メールアドレス<input ref={email} type="email" required maxLength={254} autoComplete="off" placeholder="demo@example.org"
            aria-invalid={error === 'email'} aria-describedby={error === 'email' ? 'newsletter-error' : undefined} onChange={() => { if (error === 'email') setError(''); }} /></label>
          <label><input ref={consent} type="checkbox" required aria-invalid={error === 'consent'}
            aria-describedby={error === 'consent' ? 'newsletter-error' : undefined} onChange={() => { if (error === 'consent') setError(''); }} />配信案内への同意を試す</label>
          {error && <p role="alert" id="newsletter-error">{error === 'email' ? 'メールアドレスの形式を確認してください。' : '同意にチェックを入れてください。'}</p>}
          <button type="submit" className={s.primary}>登録する（デモ）</button>
        </form>}
    </section>
    <p>このデモではメールアドレスを保存・送信しません。実際の配信には、配信サービスと配信停止の手続きが必要です。</p>
  </MarketingDemo>;
}
