import { story } from './data';
import { PhotoView, ProfileDemo } from './ui';
import s from './profile.module.css';

export default function ArtistStory() {
  return <ProfileDemo id="P02" title="指先の色から始まったこと" guide="下へスクロールし、気になる年のエピソードを開いてください。">
    <p>色をひとつ選ぶことから、誰かの毎日に似合うデザインを考える仕事へ。Kotomiの歩みを紹介します。</p>
    <div className={s.story}>{story.map(item => <article className={s.storyItem + ' ' + s.reveal} key={item.date}>
      <span className={s.kicker}>{item.date}</span><h4>{item.title}</h4>
      <details><summary>エピソードを読む</summary><div className={s.split}><PhotoView photo={item.photo} /><p>{item.text}</p></div></details>
    </article>)}</div>
  </ProfileDemo>;
}
