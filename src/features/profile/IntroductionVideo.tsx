'use client';
import { useState } from 'react';
import { photos } from './data';
import { PhotoView, ProfileDemo } from './ui';
import s from './profile.module.css';

export function ProfilePlayer({ source, poster, description }: { source?: string; poster: typeof photos.artist; description: string }) {
  return <figure className={s.stack}>
    {source ? <video className={s.video} controls playsInline preload="metadata" poster={poster.src} aria-label="プロフィール紹介動画">
      <source src={source} type="video/webm" />このブラウザでは動画を再生できません。
    </video> : <><PhotoView photo={poster} /><p className={s.empty} role="status">自己紹介動画はまだ登録されていません。</p></>}
    <figcaption>{description}</figcaption>
  </figure>;
}

export default function IntroductionVideo() {
  const [available, setAvailable] = useState(true);
  return <ProfileDemo id="P03" title="映像で見る mellow" guide="再生ボタンとプレーヤーの音量・全画面の操作を試せます。">
    <ProfilePlayer source={available ? '/profile-demo/intro.webm' : undefined} poster={photos.artist}
      description="架空のプロフィールと店内イメージを使った短い紹介映像です。会話の代わりに画面上の文章で紹介します。" />
    <button type="button" aria-pressed={!available} onClick={() => setAvailable(value => !value)}>動画未登録時の表示</button>
  </ProfileDemo>;
}
