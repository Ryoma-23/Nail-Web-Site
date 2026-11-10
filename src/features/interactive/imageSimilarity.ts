import { colors, sampleDesigns, type NailDesign } from '../gallery/data';
import { rgb } from './colors';

export function dominantColor(pixels: Uint8ClampedArray): [number,number,number] | undefined {
  const bins=new Map<number,{weight:number;sum:[number,number,number];count:number}>();
  for(let i=0;i<pixels.length;i+=4){
    if(pixels[i+3]<128) continue;
    const r=pixels[i],g=pixels[i+1],b=pixels[i+2];
    const key=(r>>5)*64+(g>>5)*8+(b>>5);
    const bucket=bins.get(key)??{weight:0,sum:[0,0,0],count:0};
    bucket.weight += .3+(Math.max(r,g,b)-Math.min(r,g,b))/255;
    bucket.count++;
    bucket.sum[0]+=r;bucket.sum[1]+=g;bucket.sum[2]+=b;
    bins.set(key,bucket);
  }
  const chosen=[...bins.values()].sort((a,b)=>b.weight-a.weight)[0];
  return chosen?.sum.map(channel=>Math.round(channel/chosen.count)) as [number,number,number] | undefined;
}

export function compareColors(target: readonly number[], designs: readonly NailDesign[]=sampleDesigns) {
  return designs.map(design=>{
    const distance=Math.min(...design.colors.map(name=>{
      const sample=rgb(colors[name]);
      return Math.hypot(...sample.map((channel,i)=>channel-target[i]));
    }));
    return {design,distance,score:Math.max(0,Math.round(100-distance/Math.sqrt(3)/255*100))};
  }).sort((a,b)=>a.distance-b.distance||a.design.id.localeCompare(b.design.id)).slice(0,3);
}
