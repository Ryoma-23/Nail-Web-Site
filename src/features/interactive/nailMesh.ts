import { rgb } from './colors';
import { clamp } from './canvas';

type Vector=[number,number,number];
type Face=[number,number,number,number];
export type View3D={yaw:number;pitch:number;zoom:number;color:string;background:string;gloss:boolean};
export const defaultView:View3D={yaw:-24,pitch:19,zoom:1,color:'#b66383',background:'#f3e4ed',gloss:true};

const rows=24,columns=16,stride=columns+1;
const points:Vector[]=[];
const faces:Face[]=[];
for(let side=0;side<2;side++){
  for(let row=0;row<=rows;row++){
    const v=row/rows;
    const taper=.75+.25*Math.sin(Math.PI*v);
    const cap=Math.sqrt(Math.max(.015,1-Math.pow(Math.abs(2*v-1),8)));
    for(let col=0;col<=columns;col++){
      const u=col/columns*2-1;
      const x=u*.64*taper*cap;
      const z=(.12+.29*(1-u*u)*Math.sin(Math.PI*(.14+.72*v)))*cap;
      points.push([x,1.1-2.2*v,side===0?z:z-.11]);
    }
  }
}
const sideStride=(rows+1)*stride;
for(let row=0;row<rows;row++){
  for(let col=0;col<columns;col++){
    const a=row*stride+col,b=a+1,c=a+stride+1,d=a+stride;
    faces.push([a,d,c,b],[a+sideStride,b+sideStride,c+sideStride,d+sideStride]);
    if(col===0)faces.push([a,a+sideStride,d+sideStride,d]);
    if(col===columns-1)faces.push([b,c,c+sideStride,b+sideStride]);
    if(row===0)faces.push([a,b,b+sideStride,a+sideStride]);
    if(row===rows-1)faces.push([d,d+sideStride,c+sideStride,c]);
  }
}

export function drawNailModel(ctx:CanvasRenderingContext2D, view:View3D) {
  const {width,height}=ctx.canvas;
  ctx.fillStyle=view.background;ctx.fillRect(0,0,width,height);
  const yaw=view.yaw*Math.PI/180,pitch=view.pitch*Math.PI/180;
  const cosY=Math.cos(yaw),sinY=Math.sin(yaw),cosX=Math.cos(pitch),sinX=Math.sin(pitch);
  const camera=5;
  const transformed=points.map(([x,y,z])=>{
    const rotatedX=x*cosY+z*sinY,rotatedZ=z*cosY-x*sinY;
    return [rotatedX,y*cosX-rotatedZ*sinX,y*sinX+rotatedZ*cosX] as Vector;
  });
  const screen=transformed.map(([x,y,z])=>{
    const scale=height*.34*view.zoom*camera/(camera-z);
    return [width/2+x*scale,height/2-y*scale];
  });
  const base=rgb(view.color);
  const order=faces.map(face=>({face,depth:face.reduce((sum,index)=>sum+transformed[index][2],0)/4})).sort((a,b)=>a.depth-b.depth);
  for(const {face} of order){
    const [a,b,c]=face.map(index=>transformed[index]);
    const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2];
    const vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2];
    const nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;
    const length=Math.hypot(nx,ny,nz)||1;
    const light=clamp((-.4*nx+.44*ny+.8*nz)/length,0,1);
    const shine=view.gloss?Math.pow(light,18)*92:Math.pow(light,5)*12;
    ctx.fillStyle='rgb('+base.map(value=>Math.round(clamp(value*(.46+.54*light)+shine,0,255))).join(',')+')';
    ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=.65;
    ctx.beginPath();
    face.forEach((index,i)=>{const [x,y]=screen[index];if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
    ctx.closePath();ctx.fill();ctx.stroke();
  }
}
