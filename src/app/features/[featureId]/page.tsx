import Link from 'next/link';
import { notFound } from 'next/navigation';
import { features,legacyFeatureIds,getFeature,getCategory,statusLabels,difficultyLabels } from '@/features/catalog/data';
import { SelectFeature } from '@/features/catalog/Controls';
import { Preview } from '@/features/catalog/Preview';
import s from '@/features/catalog/catalog.module.css';
type Props={params:Promise<{featureId:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return [...features.map(feature => feature.id), ...legacyFeatureIds].map(featureId => ({featureId}))}
export async function generateMetadata({params}:Props){const {featureId}=await params;const f=getFeature(featureId);return f?{title:f.name,description:f.summary,...(featureId!==f.id?{alternates:{canonical:'https://public-sample.vercel.app/features/'+f.id+'/'}}:{})}:{}}
export default async function Page({params}:Props){
 const f=getFeature((await params).featureId);if(!f)notFound();
 const c=getCategory(f.category);
 return <><section className={s.hero}><Link className={s.back} href="/features/">← 機能一覧へ戻る</Link><p className={s.eyebrow}>{f.id} / {c.name}{c.operator?' / 運営者向け':''}</p><h1>{f.name}</h1><p>{f.summary}</p><div className={s.detailActions}><span className={s.badge}>{statusLabels[f.status]}</span><SelectFeature id={f.id} name={f.name}/></div></section><section className={s.panel}><h2>どんなことができる？</h2><p>{f.description}</p><h2>どんな場面で役立つ？</h2><ul>{f.benefits.map(b=><li key={b}>{b}に役立ちます。</li>)}</ul><dl className={s.details}><div><dt>難易度の目安</dt><dd>{difficultyLabels[f.difficulty]}</dd></div><div><dt>サーバー側の処理</dt><dd>{f.requiresBackend?'必要':'不要'}</dd></div><div><dt>外部サービス</dt><dd>{f.requiresExternalService?'必要':'不要'}</dd></div></dl><p className={s.muted}>必要な仕組みは標準的な実装を想定した目安です。詳細は制作相談で決めます。</p></section><Preview feature={f}/></>
}
