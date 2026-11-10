'use client';
import { useSyncExternalStore } from 'react';
import { canonicalFeatureId, getFeature } from './data';
const key='mellow.feature-selection.v1', event='mellow:feature-selection';
let cached:readonly string[]=[];
let last:string|null|undefined;
const empty:readonly string[]=[];
function read(){
 try{
  const raw=localStorage.getItem(key);
  if(raw!==last){let ids:unknown;try{ids=JSON.parse(raw??'[]')}catch{ids=[]}
   cached=Array.isArray(ids)?[...new Set(ids.filter((id):id is string=>typeof id==='string'&&!!getFeature(id)).map(canonicalFeatureId))]:[];
   last=raw;
  }
 }catch{}
 return cached;
}
function subscribe(cb:()=>void){
 const onStorage=(e:StorageEvent)=>{if(e.key===key||e.key===null)cb()};
 window.addEventListener(event,cb);window.addEventListener('storage',onStorage);
 return ()=>{window.removeEventListener(event,cb);window.removeEventListener('storage',onStorage)};
}
function save(ids:readonly string[]){cached=ids;try{last=JSON.stringify(ids);localStorage.setItem(key,last)}catch{}window.dispatchEvent(new Event(event))}
export function useSelection(){return useSyncExternalStore(subscribe,read,()=>empty)}
export function toggleSelection(id:string){const feature=getFeature(id);if(!feature)return;const ids=read();save(ids.includes(feature.id)?ids.filter(v=>v!==feature.id):[...ids,feature.id])}
export function clearSelection(){save([])}
