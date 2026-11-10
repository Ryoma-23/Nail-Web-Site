export type Overlay={x:number;y:number;size:number;rotation:number;opacity:number};
export const fingers=['親指','人差し指','中指','薬指','小指'];
export const initialOverlays: readonly Overlay[]=[
  {x:176,y:368,size:.57,rotation:-32,opacity:.9},
  {x:295,y:169,size:.56,rotation:-9,opacity:.9},
  {x:410,y:115,size:.60,rotation:0,opacity:.9},
  {x:525,y:155,size:.55,rotation:8,opacity:.9},
  {x:627,y:231,size:.48,rotation:14,opacity:.9},
];

export function paintHand(ctx:CanvasRenderingContext2D,skin:string){
  const contour=new Path2D('M342 600C320 527 279 498 222 461C176 431 143 396 141 356Q138 314 170 319Q201 320 235 369L258 386L256 163Q256 118 289 115Q324 113 332 157L352 298L374 118Q378 66 411 65Q447 66 452 119L454 291L488 144Q496 106 526 108Q558 109 562 149L550 319L589 213Q604 182 631 189Q663 196 663 232L638 396Q625 477 580 519L564 600Z');
  const tones=ctx.createLinearGradient(170,90,670,565);
  tones.addColorStop(0,skin);tones.addColorStop(1,skin==='#e9b19d'?'#bf7d71':'#9b5d4d');
  ctx.fillStyle=tones;ctx.fill(contour);
  ctx.strokeStyle='#71493c35';ctx.lineWidth=3;
  ctx.stroke(new Path2D('M272 272Q300 280 328 269M383 230Q411 239 439 228M495 250Q523 260 548 248M594 310Q621 321 643 309M365 457Q437 431 511 459'));
}
