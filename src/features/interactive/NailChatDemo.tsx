'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { replyTo, type ChatReply, type ReplyEngine } from './chatEngine';
import { Lab } from './ui';
import s from './interactive.module.css';

const prompts=['初めてのおすすめ','シンプルなネイル','予算5,000円','施術時間は？','オフとは？'];

export function Chat({engine}: {engine:ReplyEngine}) {
  const [value,setValue]=useState('');
  const [history,setHistory]=useState<{question:string;answer?:ChatReply}[]>([]);
  const [waiting,setWaiting]=useState(false);
  const timer=useRef<number>(0);
  const log=useRef<HTMLDivElement>(null);
  useEffect(()=>()=>clearTimeout(timer.current),[]);
  useEffect(()=>{if(log.current) log.current.scrollTop=log.current.scrollHeight;},[history,waiting]);

  function send(message:string){
    const question=message.trim();
    if(!question||waiting) return;
    setHistory(items=>[...items.slice(-19),{question}]);setValue('');setWaiting(true);
    timer.current=window.setTimeout(()=>{
      const answer=engine(question);
      setHistory(items=>items.map((item,i)=>i===items.length-1 ? {...item,answer}:item));
      setWaiting(false);
    },350);
  }
  return <>
    <div ref={log} className={s.chat} role="log" aria-label="会話履歴" tabIndex={0}>
      <p className={s.bubble}>メニュー選びや施術について、下の候補から質問できます。</p>
      {history.map(({question,answer},i)=><div className={s.stack} key={i}>
        <p className={s.bubble} data-role="user">{question}</p>
        {answer&&<p className={s.bubble}>{answer.text}{answer.link&&<> <Link href={answer.link.href}>{answer.link.label}</Link></>}</p>}
      </div>)}
      {waiting&&<p className={s.bubble}>回答を準備中…</p>}
    </div>
    <div className={s.row}>{prompts.map(prompt=><button type="button" disabled={waiting} key={prompt} onClick={()=>send(prompt)}>{prompt}</button>)}</div>
    <form className={s.stack} onSubmit={event=>{event.preventDefault();send(value);}}>
      <label>質問を入力<input type="text" value={value} maxLength={240} autoComplete="off" onChange={event=>setValue(event.target.value)}/></label>
      <button type="submit" className={s.primary} disabled={waiting||!value.trim()}>送信</button>
    </form>
    <button type="button" onClick={()=>{clearTimeout(timer.current);setHistory([]);setWaiting(false);setValue('');}}>会話をリセット</button>
  </>;
}

export default function NailChatDemo(){
  return <Lab id="I07" title="チャットでメニューを探す" guide="チャット形式の自動応答デモ（ルールベース）。入力はこの画面でのみ使用します。"><Chat engine={replyTo}/></Lab>;
}
