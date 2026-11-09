'use client';
import { lazy, Suspense, useState, type ComponentType } from 'react';
import { Smartphone, Monitor, RotateCcw } from 'lucide-react';
import type { Feature } from './data';
import s from './catalog.module.css';
type DemoLoader = () => Promise<{default:ComponentType}>;
// Register standalone demos here by previewKey; the module is loaded on demand.
const demos:Record<string,ReturnType<typeof lazy<ComponentType>>>= {
  G01: registerPreview(() => import('../gallery/NailGallery')),
  G02: registerPreview(() => import('../gallery/CategoryFilter')),
  G03: registerPreview(() => import('../gallery/ColorFilter')),
  G04: registerPreview(() => import('../gallery/SeasonalGallery')),
  G05: registerPreview(() => import('../gallery/DesignDetail')),
  G06: registerPreview(() => import('../gallery/PhotoLightbox')),
  G07: registerPreview(() => import('../gallery/Favorites')),
  G08: registerPreview(() => import('../gallery/FavoritesShare')),
  G09: registerPreview(() => import('../gallery/Ranking')),
  G10: registerPreview(() => import('../gallery/BeforeAfter')),
  G11: registerPreview(() => import('../gallery/VideoGallery')),
  G12: registerPreview(() => import('../gallery/InstagramGallery')),
  G13: registerPreview(() => import('../gallery/DesignQuiz')),
  G14: registerPreview(() => import('../gallery/SimilarDesigns')),
  M01: registerPreview(() => import('../menu/MenuList')),
  M02: registerPreview(() => import('../menu/PriceCalculator')),
  M03: registerPreview(() => import('../menu/OptionCalculator')),
  M04: registerPreview(() => import('../menu/DurationCalculator')),
  M05: registerPreview(() => import('../menu/CampaignCards')),
  M06: registerPreview(() => import('../menu/FirstTimeMenu')),
  M07: registerPreview(() => import('../menu/FixedPriceCourses')),
  M09: registerPreview(() => import('../menu/MenuComparison')),
  M08: registerPreview(() => import('../menu/MenuQuiz')),
  M10: registerPreview(() => import('../menu/TreatmentFlow')),
  M11: registerPreview(() => import('../menu/NailGlossary')),
  M12: registerPreview(() => import('../menu/PriceRevision')),
};
export function registerPreview(loader:DemoLoader){return lazy(loader)}
export function Preview({feature}:{feature:Feature}){
 const [mobile,setMobile]=useState(false),[revision,setRevision]=useState(0);
 const Demo=feature.status!=='planned'&&feature.previewKey?demos[feature.previewKey]:undefined;
 return <section className={s.panel} aria-labelledby="preview-heading"><div className={s.panelTop}><div><p className={s.eyebrow}>PREVIEW</p><h2 id="preview-heading">プレビュー</h2></div><div className={s.controls} role="group" aria-label="プレビューの表示幅"><button type="button" aria-pressed={!mobile} onClick={()=>setMobile(false)}><Monitor size={16}/>PC</button><button type="button" aria-pressed={mobile} onClick={()=>setMobile(true)}><Smartphone size={16}/>スマホ</button>{Demo&&<button type="button" onClick={()=>setRevision(v=>v+1)}><RotateCcw size={16}/>リセット</button>}</div></div>
 <div className={s.previewStage}><div className={s.previewWindow} data-mobile={mobile}>{Demo?<Suspense fallback={<p>読み込み中…</p>}><Demo key={revision}/></Suspense>:<div className={s.conceptPreview}><span className={s.badge}>静的イメージ · デモ準備中</span><div className={s.mock} aria-hidden="true"><i/><div><i/><i/><i/></div></div><strong>{feature.name}</strong><p>{feature.summary}</p></div>}</div></div><p className={s.muted}>{Demo?'表示幅を切り替えて見え方を比較できます。端末固有の操作は実機でもご確認ください。':'完成時の使い方を紹介しています。機能自体はまだ操作できません。表示幅のみ切り替えられます。'}</p></section>
}
