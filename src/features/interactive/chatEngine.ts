import { baseMenus, yen } from '../menu/data';
import { faqs } from '../profile/content';
import { sampleDesigns } from '../gallery/data';

export type ChatReply={ text:string; link?:{href:string;label:string} };
export type ReplyEngine=(message:string)=>ChatReply;
const menuLink={href:'/features/M01/',label:'メニュー一覧を見る'};
const faqLink={href:'/features/P09/',label:'FAQを見る'};
const first=baseMenus[0];

export const replyTo: ReplyEngine = message => {
  const input=message.normalize('NFKC').replace(/,/g,'').toLowerCase();
  const amount=input.match(/(\d{3,7})\s*円/);
  if(amount||/予算|料金|価格/.test(input)){
    if(!amount)return {text:'予算を「5,000円」のように入力すると、参考料金内のメニューを探せます。',link:menuLink};
    const budget=Number(amount[1]);
    const choices=baseMenus.filter(menu=>menu.price<=budget).sort((a,b)=>b.price-a.price);
    return {text:choices.length ? '参考予算内では、'+choices.map(menu=>menu.name+' '+yen(menu.price)).join('、')+'が候補です。' :
      'この参考予算内のメニューは見つかりませんでした。',link:menuLink};
  }
  if(/時間|何分|何時間/.test(input))return {text:faqs.find(item=>item.id==='time')?.answer??'施術時間はメニューによって変わります。',link:menuLink};
  if(/オフ|取り外/.test(input))return {text:'オフは、付いているジェルやパーツを取り外すことです。'+(faqs.find(item=>item.id==='off')?.answer??''),link:faqLink};
  if(/初めて|初心者/.test(input))return {text:'色をひとつ選ぶ「'+first.name+'」は、参考 '+yen(first.price)+'・約'+first.minutes+'分です。',link:menuLink};
  if(/シンプル|控えめ|オフィス/.test(input)){
    const design=sampleDesigns.find(item=>item.category==='SIMPLE')!;
    return {text:design.title+'は落ち着いた色味で、日常に合わせやすい作品です。',link:{href:'/features/G05/?design='+design.id,label:'作品を見る'}};
  }
  return {text:'このデモで案内できるのは、初めての施術・シンプルな作品・参考予算・時間・オフです。',link:faqLink};
};
