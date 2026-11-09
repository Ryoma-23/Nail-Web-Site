import { sampleDesigns } from './data';
import { Demo, Grid } from './ui';
import s from './gallery.module.css';

const posts = [
  { design: sampleDesigns[1], postUrl: 'https://www.instagram.com/p/2SHsuLlKaD/' },
  { design: sampleDesigns[5], postUrl: 'https://www.instagram.com/p/BEJRe6WzCik/' },
];
const profileUrl = 'https://www.instagram.com/tombachik/';

export default function InstagramGallery() {
  return <Demo label="G12" title="Instagram風の作品紹介" guide="サロンの作品を投稿風カードに並べるデモです。ボタンから外部ページへの移動を試せます。">
    <p className={s.notice}>カードは架空の投稿です。リンク先には、動作確認用の第三者の公開投稿・プロフィール例を使用しています。</p>
    <Grid designs={posts.map(item => item.design)} extra={design => <a className={s.external}
      href={posts.find(item => item.design.id === design.id)?.postUrl}
      target="_blank" rel="noopener noreferrer">外部投稿の例を見る ↗</a>} />
    <p><a className={s.external} href={profileUrl} target="_blank" rel="noopener noreferrer">Instagramプロフィールの例 ↗</a></p>
  </Demo>;
}
