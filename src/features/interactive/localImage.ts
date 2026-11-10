'use client';
import { useEffect, useRef, useState } from 'react';

const maxBytes = 10 * 1024 * 1024;
export const imageAccept = 'image/jpeg,image/png,image/webp';
export type LocalImage = { bitmap: ImageBitmap; name: string };

async function validate(file: File) {
  if (!imageAccept.split(',').includes(file.type)) throw Error('JPEG・PNG・WebPの画像を選んでください。');
  if (!file.size || file.size > maxBytes) throw Error('画像は10 MB以内で選んでください。');
  const head = new Uint8Array(await file.slice(0,12).arrayBuffer());
  const ascii = String.fromCharCode(...head);
  const valid = file.type === 'image/jpeg' ? head[0] === 255 && head[1] === 216 && head[2] === 255 :
    file.type === 'image/png' ? [137,80,78,71,13,10,26,10].every((byte,i)=>head[i]===byte) :
      ascii.startsWith('RIFF') && ascii.slice(8)==='WEBP';
  if (!valid) throw Error('ファイルの内容と画像形式が一致しません。');
}

export function useLocalImage() {
  const [image,setImage]=useState<LocalImage>();
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);
  const active=useRef<ImageBitmap | undefined>(undefined);
  const revision=useRef(0);

  function reset() {
    revision.current++;
    active.current?.close();
    active.current=undefined;
    setImage(undefined);
    setError('');
    setLoading(false);
  }

  async function load(file: File) {
    reset();
    const current=revision.current;
    setLoading(true);
    try {
      await validate(file);
      if(current!==revision.current) return;
      const bitmap=await createImageBitmap(file);
      if(current!==revision.current) { bitmap.close(); return; }
      if (!bitmap.width || !bitmap.height || bitmap.width*bitmap.height>24_000_000) {
        bitmap.close();
        throw Error('画像の解像度は2,400万画素以内にしてください。');
      }
      active.current=bitmap;
      setImage({bitmap,name:file.name});
    } catch(error) {
      if(current===revision.current) setError(error instanceof Error && error.name==='Error' ? error.message : '画像を読み込めませんでした。別の画像をお試しください。');
    } finally {
      if(current===revision.current) setLoading(false);
    }
  }

  useEffect(()=>()=>{ revision.current++; active.current?.close(); active.current=undefined; },[]);
  return { image, error, loading, load, reset };
}
