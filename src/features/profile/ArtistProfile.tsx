'use client';
import { useState } from 'react';
import { Modal } from '../gallery/ui';
import { artist, type NailArtistProfile } from './data';
import { PhotoView, ProfileDemo } from './ui';
import s from './profile.module.css';

export function ArtistBio({ profile }: { profile: NailArtistProfile }) {
  const [social, setSocial] = useState('');
  return <article className={s.split + ' ' + s.hero}>
    <PhotoView photo={profile.photo} eager />
    <div className={s.stack}>
      <span className={s.kicker}>NAIL ARTIST</span><h4 className={s.editorial}>{profile.name}</h4>
      <p><strong>{profile.tagline}</strong></p><p>{profile.bio}</p>
      <p>{profile.specialties.map(name => <span className={s.badge} key={name}>{name}</span>)}</p>
      <details><summary>経歴と資格を見る</summary><ul>{profile.career.map(item => <li key={item}>{item}</li>)}</ul>
        <ul>{profile.qualifications.map(item => <li key={item.name}>{item.name} · {item.year}年</li>)}</ul>
      </details>
      <div className={s.toolbar} aria-label="SNS">{profile.socials.map(link => link.href ?
        <a key={link.name} href={link.href}>{link.name}</a> :
        <button type="button" key={link.name} onClick={() => setSocial(link.name)}>{link.name}（デモ）</button>)}</div>
    </div>
    {social && <Modal title={social + 'への案内'} onClose={() => setSocial('')}><p>このデモでは公開用のSNSアカウントを未登録にしています。</p></Modal>}
  </article>;
}

export default function ArtistProfile() {
  return <ProfileDemo id="P01" title="ネイリスト Kotomi" guide="得意なデザインをひと目で確認し、経歴と資格を開いてみてください。"><ArtistBio profile={artist} /></ProfileDemo>;
}
