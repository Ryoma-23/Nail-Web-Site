import type { PointerEvent } from 'react';

export const clamp=(value:number,min:number,max:number)=>Math.max(min,Math.min(max,value));

export function point(event: PointerEvent<HTMLCanvasElement>) {
  const box=event.currentTarget.getBoundingClientRect();
  return {x:(event.clientX-box.left)*event.currentTarget.width/box.width,y:(event.clientY-box.top)*event.currentTarget.height/box.height};
}
export function download(blob:Blob,name:string) {
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');
  link.href=url;link.download=name;link.click();
  window.setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function savePng(canvas:HTMLCanvasElement | null) {
  return new Promise<Blob>((resolve,reject)=>{
    if(!canvas){reject(Error('Canvas unavailable'));return;}
    canvas.toBlob(blob=>blob?resolve(blob):reject(Error('Image unavailable')),'image/png');
  });
}
