'use client';
import { PhotoView } from '../profile/ui';
import { salonPhotos, sections } from './data';
import { AnimationFrame, useScrollPlayback, useScrollProgress, type Playback } from './ui';
import s from './animation.module.css';
function Scene(playback:Playback){
  const {ref}=useScrollProgress();
  useScrollPlayback(ref,playback);
  return <div ref={ref} className={s.scroller} tabIndex={0} aria-label="背景の重なりを試すスクロール領域">
    <div className={s.layerPhoto}><PhotoView photo={salonPhotos[2]} eager/><div className={s.mediaCopy}><h4>窓辺のプライベートサロン</h4></div></div>
    <div className={s.layerCards}>{sections.map(item=><article className={s.card} key={item.title}>
      <PhotoView photo={item.photo}/><h4>{item.title}</h4><p>{item.text}</p></article>)}</div>
  </div>;
}

export default function LayeredScroll(){
  return <AnimationFrame id="A32" title="固定背景・重なり演出" guide="枠をスクロールすると、背景の写真に作品紹介が重なります。" example="店内写真の上からメニューや作品へ自然につなぐ。" Scene={Scene} />;
}
