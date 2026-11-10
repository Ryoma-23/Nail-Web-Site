import { hexPattern } from './colors';
import { patterns, shapes, type Decoration, type NailConfig } from './nailArt';

export const fingerCount=5;
export const maxDecorations=12;
const object=(value:unknown): value is Record<string,unknown>=>typeof value==='object'&&value!==null&&!Array.isArray(value);
const bounded=(value:unknown,min:number,max:number): value is number=>typeof value==='number'&&Number.isFinite(value)&&value>=min&&value<=max;

function decoration(value:unknown): value is Decoration {
  return object(value)&&(value.type==='stone'||value.type==='pearl')&&bounded(value.x,-32,32)&&bounded(value.y,-58,46);
}

function nail(value:unknown): value is NailConfig {
  return object(value)&&shapes.some(shape=>shape===value.shape)&&patterns.some(pattern=>pattern===value.pattern)&&
    typeof value.base==='string'&&hexPattern.test(value.base)&&typeof value.accent==='string'&&hexPattern.test(value.accent)&&
    Array.isArray(value.decorations)&&value.decorations.length<=maxDecorations&&value.decorations.every(decoration);
}

export function serializeDesign(nails:readonly NailConfig[]) {
  return JSON.stringify({version:1,nails},null,2);
}
export function restoreDesign(input:string): NailConfig[] {
  const data:unknown=JSON.parse(input);
  if(!object(data)||data.version!==1||!Array.isArray(data.nails)||data.nails.length!==fingerCount||!data.nails.every(nail)) {
    throw Error('Invalid design settings');
  }
  return data.nails.map(({shape,base,accent,pattern,decorations})=>({
    shape,base:base.toLowerCase(),accent:accent.toLowerCase(),pattern,decorations:decorations.map(({type,x,y})=>({type,x,y})),
  }));
}
