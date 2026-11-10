export const shapes = ['Round','Oval','Square','Almond','Coffin'] as const;
export const patterns = ['One Color','French','Gradation','Glitter','Marble'] as const;
export type Shape=typeof shapes[number];
export type Pattern=typeof patterns[number];
export type Decoration={ type:'stone'|'pearl';x:number;y:number };
export type NailConfig={ shape:Shape;base:string;accent:string;pattern:Pattern;decorations:Decoration[] };

export const defaultNail: NailConfig={shape:'Oval',base:'#b66383',accent:'#f4d2dc',pattern:'One Color',decorations:[]};

const contours:Record<Shape,string>={
  Round:'M-32 48Q-39 35-40-28Q-40-69 0-70Q40-69 40-28Q39 35 32 48Q0 61-32 48Z',
  Oval:'M-32 48C-47 21-51-66 0-72C51-66 47 21 32 48Q0 64-32 48Z',
  Square:'M-34 48L-43-56Q-43-68-31-68H31Q43-68 43-56L34 48Q0 62-34 48Z',
  Almond:'M-32 48C-52 8-37-56 0-76C37-56 52 8 32 48Q0 64-32 48Z',
  Coffin:'M-31 48L-45-15L-32-67H32L45-15L31 48Q0 63-31 48Z',
};

export function paintNail(ctx:CanvasRenderingContext2D,config:NailConfig) {
  const outline=new Path2D(contours[config.shape]);
  ctx.save();
  ctx.clip(outline);
  const polish=ctx.createLinearGradient(-45,0,45,0);
  polish.addColorStop(0,config.base);polish.addColorStop(.4,config.base);polish.addColorStop(1,config.base+'cc');
  ctx.fillStyle=polish;ctx.fillRect(-52,-80,104,147);
  if(config.pattern==='French'){
    ctx.fillStyle=config.accent;ctx.fill(new Path2D('M-50-81H50V-35Q0-12-50-35Z'));
  } else if(config.pattern==='Gradation'){
    const fade=ctx.createLinearGradient(0,-70,0,45);fade.addColorStop(0,config.accent);fade.addColorStop(1,config.base);
    ctx.fillStyle=fade;ctx.fillRect(-52,-80,104,147);
  } else if(config.pattern==='Glitter'){
    ctx.fillStyle=config.accent;
    const opacity=ctx.globalAlpha;
    for(let i=0;i<52;i++){
      const x=(i*37)%86-43,y=(i*59)%125-67;
      ctx.globalAlpha=opacity*(.3+(i%7)*.1);ctx.fillRect(x,y,i%3+1,i%3+1);
    }
    ctx.globalAlpha=opacity;
  } else if(config.pattern==='Marble'){
    ctx.strokeStyle=config.accent;ctx.lineWidth=5;
    ctx.stroke(new Path2D('M-55-55C52-54-56 12 58 25M-54-21C44-32-47 48 48 54M-55-64C36-70-22-29 59-36'));
  }
  ctx.strokeStyle='#ffffff70';ctx.lineWidth=5;ctx.lineCap='round';
  ctx.stroke(new Path2D('M-24-46Q-34-20-27 6'));
  for(const item of config.decorations){
    ctx.save();ctx.translate(item.x,item.y);
    ctx.fillStyle=item.type==='stone'?'#f7f4ff':'#fff0d7';ctx.strokeStyle='#ad829d';ctx.lineWidth=1.5;
    const stone=new Path2D(item.type==='stone'?'M0-9L8-2L4 8H-4L-8-2Z':'M0-8A8 8 0 1 1 0 8A8 8 0 1 1 0-8Z');
    ctx.fill(stone);ctx.stroke(stone);ctx.restore();
  }
  ctx.restore();
}
