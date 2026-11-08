'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Plus, ArrowLeft, ArrowRight } from 'lucide-react';
import { gallery } from '@/data/site';
import type { Work } from '@/types/site';
import { Modal } from '@/components/common/Modal';
export function Gallery() {
  const [filter,setFilter] = useState('ALL'); const [selected,setSelected] = useState<Work|null>(null);
  const works = gallery.filter(w=>filter==='ALL'||w.category===filter);
  function move(delta:number) { if(!selected)return; const i=works.findIndex(w=>w.id===selected.id); setSelected(works[(i+delta+works.length)%works.length]); }
  return <><div className="filters" role="group" aria-label="デザインカテゴリー">{['ALL','SIMPLE','NUANCE','FRENCH','ART'].map(c=><button key={c} aria-pressed={filter===c} onClick={()=>setFilter(c)}>{c}</button>)}</div><p className="sr-only" aria-live="polite">{works.length}件の作品</p><div className="gallery-grid">{works.map((work)=><button className="work" key={work.id} onClick={()=>setSelected(work)} aria-label={`${work.name} を拡大`}><div className="work-image"><Image src={work.image} alt={`${work.name}：${work.description}（サンプルイラスト）`} width={600} height={720} sizes="(max-width:767px) 45vw, 30vw"/><span className="work-number">0{gallery.indexOf(work)+1}</span><span className="work-plus"><Plus size={19}/></span></div><div className="work-caption"><h3>{work.name}</h3><span>{work.category}</span></div></button>)}</div>{selected&&<Modal label={`${selected.name} 拡大画像`} close={()=>setSelected(null)}><Image className="enlarged-image" src={selected.image} alt={`${selected.name}（サンプルイラスト）`} width={600} height={720}/><div className="image-description"><span className="eyebrow">{selected.category}</span><h3>{selected.name}</h3><p>{selected.description}</p><div className="gallery-controls"><button className="icon-button" aria-label="前の作品" onClick={()=>move(-1)}><ArrowLeft/></button><span>{works.findIndex(w=>w.id===selected.id)+1} / {works.length}</span><button className="icon-button" aria-label="次の作品" onClick={()=>move(1)}><ArrowRight/></button></div></div></Modal>}</>;
}

