export type FeatureStatus = 'planned' | 'demo' | 'ready';
export type Feature = {
  id: string; name: string; category: string; summary: string; description: string;
  benefits: string[]; difficulty: 1|2|3; requiresBackend: boolean;
  requiresExternalService: boolean; status: FeatureStatus; previewKey?: string;
};
export const statusLabels: Record<FeatureStatus,string> = {planned:'準備中',demo:'デモあり',ready:'再利用可能'};
export const difficultyLabels = {1:'簡単',2:'標準',3:'高度'} as const;
type Row = [string,string,1|2|3,boolean,boolean];
type Group = {id:string;name:string;icon:string;operator:boolean;rows:Row[]};
const groups: Group[] = [
  {id:"G",name:"ギャラリー・作品紹介",icon:"Images",operator:false,rows:[
    ["作品ギャラリー","作品写真を一覧で見せる。",1,false,false],
    ["カテゴリー検索","種類を選んで作品を絞り込む。",1,false,false],
    ["カラー別検索","好きな色で作品を絞り込む。",1,false,false],
    ["季節別ギャラリー","季節に合う作品をまとめる。",1,false,false],
    ["作品詳細","写真・施術内容・参考料金を紹介する。",1,false,false],
    ["画像拡大","写真を拡大して細部を見る。",1,false,false],
    ["お気に入り登録","気になる作品を端末に保存する。",1,false,false],
    ["お気に入り共有","選んだ作品をリンクなどで共有する。",1,false,false],
    ["人気ランキング","閲覧数などを集計して人気作品を並べる。",3,true,false],
    ["Before / After","施術前後の写真を並べる。",1,false,false],
    ["動画ギャラリー","質感や角度を動画で見る。",1,false,false],
    ["Instagram連携","Instagramの投稿をサイトで紹介する。",3,true,true],
    ["デザイン診断","好みの回答から作品を案内する。",3,false,false],
    ["類似デザインの提案","作品の色やタグが近いデザインを案内する。",3,false,false]
  ]},
  {id:"M",name:"メニュー・料金",icon:"Receipt",operator:false,rows:[
    ["メニュー一覧","施術内容・料金・時間を一覧にする。",2,false,false],
    ["料金シミュレーター","メニュー選択から概算料金を出す。",3,false,false],
    ["オプション料金計算","オフやパーツの追加料金を合算する。",2,false,false],
    ["施術時間シミュレーター","選んだ施術の時間の目安を出す。",3,false,false],
    ["キャンペーン表示","期間限定のメニューや特典を案内する。",2,false,false],
    ["初回限定メニュー","初めての方向けの条件と料金を示す。",2,false,false],
    ["定額コース紹介","一定料金で選べるデザインを紹介する。",2,false,false],
    ["おすすめメニュー診断","希望や予算に合うメニューを案内する。",3,false,false],
    ["メニュー比較","料金・時間・内容を横並びにする。",2,false,false],
    ["施術の流れ","受付から仕上げまでを順に紹介する。",2,false,false],
    ["ネイル用語ガイド","施術に関する言葉を平易に解説する。",2,false,false],
    ["料金改定のお知らせ","変更日と新旧料金を知らせる。",2,false,false]
  ]},
  {id:"P",name:"プロフィール・サロン紹介",icon:"UserRound",operator:false,rows:[
    ["詳細プロフィール","経歴・得意な施術・写真を紹介する。",1,false,false],
    ["ストーリーページ","活動の背景や大切にする考え方を伝える。",1,false,false],
    ["自己紹介動画","ネイリスト本人の話を動画で届ける。",1,false,false],
    ["資格・技術紹介","取得資格や得意な技術を紹介する。",1,false,false],
    ["施術風景","施術時の様子を写真や動画で見せる。",1,false,false],
    ["360度サロン紹介","店内を見回せる画像を掲載する。",3,false,false],
    ["サロン設備紹介","座席や設備・利用条件を紹介する。",1,false,false],
    ["お客様の声","掲載許諾を得た感想を紹介する。",1,false,false],
    ["FAQ","よくある質問と回答をまとめる。",1,false,false],
    ["初めての方へ","初回来店に必要な情報をまとめる。",1,false,false],
    ["施術へのこだわり","衛生管理や施術の考え方を説明する。",1,false,false],
    ["お知らせ","休業やサービス変更を知らせる。",1,false,false],
    ["ネイルケアコラム","自宅でできるケアを紹介する。",1,false,false],
    ["お客様インタビュー","利用者の体験を記事にする。",1,false,false]
  ]},
  {id:"R",name:"予約・来店サポート",icon:"CalendarDays",operator:false,rows:[
    ["固定予約ボタン","閲覧中も予約先へのボタンを表示する。",1,false,false],
    ["大型予約セクション","ページ下部に予約案内をまとめる。",1,false,false],
    ["作品から予約","見ている作品に合う予約メニューへ案内する。",2,false,true],
    ["予約方法ガイド","予約サービスの使い方を順に説明する。",1,false,false],
    ["予約メニュー選択ガイド","希望に合う予約メニューを選ぶ手助けをする。",1,false,false],
    ["LINE相談","LINEの相談窓口へ案内する。",2,false,true],
    ["Instagram DM","Instagramのメッセージ窓口へ案内する。",2,false,true],
    ["アクセスマップ","施術場所を地図で確認できるようにする。",2,false,true],
    ["写真付き道案内","目印や入口を写真で示す。",1,false,false],
    ["来店準備","持ち物や当日の注意点を案内する。",1,false,false],
    ["キャンセルポリシー","変更・キャンセルの条件を明示する。",1,false,false],
    ["予約前チェックリスト","予約前に確認すべき項目を並べる。",1,false,false],
    ["FAQ検索","質問をキーワードで探す。",3,false,false],
    ["営業日カレンダー","営業日・休業日をカレンダーで確認する。",3,false,false],
    ["空き状況表示","予約サービスの空き枠を表示する。",3,true,true]
  ]},
  {id:"X",name:"集客・リピート促進",icon:"Megaphone",operator:false,rows:[
    ["キャンペーンバナー","開催中の特典への入口を設ける。",2,false,false],
    ["新作ネイル特集","最近追加した作品をまとめる。",2,false,false],
    ["人気デザイン特集","人気の作品を選んで特集にする。",2,false,false],
    ["季節のおすすめ","季節に合う色や作品を紹介する。",2,false,false],
    ["LINE友だち追加","LINE公式アカウントの追加へ案内する。",2,false,true],
    ["Instagram共有","気に入ったページを共有しやすくする。",2,false,true],
    ["お客様の声","来店後の感想を検討中の方に伝える。",2,false,false],
    ["検索向けFAQ","検索されやすい質問を読みやすく整理する。",2,false,false],
    ["ブログ","新作やお手入れ情報を記事にする。",2,false,false],
    ["告知ポップアップ","必要な告知を小さな案内枠で出す。",2,false,false],
    ["ニュースレター","同意した登録者に最新情報を配信する。",3,true,true],
    ["紹介キャンペーン","紹介特典と適用条件を伝える。",2,false,false],
    ["SNSフォロー導線","公式SNSを見つけやすくする。",2,false,false],
    ["特設ページ","特定の企画に情報をまとめる。",2,false,false],
    ["QRコード付き紹介カード","スマホで読み取れる紹介カードを作る。",2,false,false]
  ]},
  {id:"I",name:"診断・AI・インタラクティブ",icon:"Sparkles",operator:false,rows:[
    ["ネイルデザイン診断","回答に応じて似合いそうな作品を紹介する。",1,false,false],
    ["カラー相性診断","好みの色や肌の印象から候補色を案内する。",1,false,false],
    ["デザインルーレット","作品候補をランダムに選ぶ。",1,false,false],
    ["デザイン比較","候補の画像を並べて違いを確認する。",1,false,false],
    ["お気に入りボード","選んだ作品をひとつのボードにまとめる。",1,false,false],
    ["画像類似検索","参考画像に見た目が近い作品を探す。",3,true,false],
    ["AIネイル相談","質問に対しAIで参考情報を案内する。",3,true,true],
    ["AIデザイン提案","希望の色や雰囲気をもとにAIで案を出す。",3,true,true],
    ["バーチャルネイル試着","手の画像にネイルのイメージを重ねる。",3,true,false],
    ["3Dネイルビュー","立体モデルを回して仕上がりを見る。",3,false,false],
    ["カラーパレット生成","選んだ色から組み合わせを作る。",1,false,false],
    ["ネイルデザインメーカー","色やパーツを組み合わせて案を作る。",3,false,false]
  ]},
  {id:"V",name:"アニメーション・演出",icon:"WandSparkles",operator:false,rows:[
    ["フェードイン","要素を透明な状態から徐々に表示する。",2,false,false],
    ["スライドイン","要素を横や下から移動させて表示する。",2,false,false],
    ["ゆっくりズーム","写真をゆっくり拡大する。",2,false,false],
    ["文字の逐次表示","文章を少しずつ表示する。",2,false,false],
    ["シネマティックイントロ","冒頭で短い映像風の演出を見せる。",3,false,false],
    ["背景スライドショー","背景画像を順番に切り替える。",2,false,false],
    ["動画ヒーロー","冒頭の写真の代わりに動画を使う。",3,false,false],
    ["パララックス","背景と手前の移動量を変える。",3,false,false],
    ["画像マスク","形に沿って画像を切り抜き表示する。",2,false,false],
    ["スクロール誘導","下に続く内容があると知らせる。",2,false,false],
    ["スクロールフェード","画面に入った要素を徐々に表示する。",2,false,false],
    ["スタッガー表示","複数のカードを時間差で表示する。",2,false,false],
    ["ホバー拡大","指し示した写真を軽く拡大する。",2,false,false],
    ["画像切り替え","操作や時間に応じて写真を入れ替える。",2,false,false],
    ["横スクロールギャラリー","作品を横に送って見られるようにする。",2,false,false],
    ["マーキー","短い文字や画像を横に流す。",2,false,false],
    ["Before/Afterスライダー","境界を動かして施術前後を比較する。",3,false,false],
    ["カード展開","操作でカードを開き追加情報を出す。",2,false,false],
    ["3Dカード傾斜","指し示す位置に応じてカードを傾ける。",3,false,false],
    ["ページ切り替え","ページ移動に短い切り替え効果を付ける。",2,false,false],
    ["スクロール連動写真演出","スクロールに合わせて写真の位置を動かす。",3,false,false],
    ["マグネティックボタン","ポインター付近でボタンを軽く動かす。",2,false,false],
    ["キラキラパーティクル","小さな光の粒を装飾に使う。",3,false,false],
    ["花びら演出","花びらが舞う装飾を出す。",3,false,false],
    ["グラデーションアニメーション","背景の色の変化をゆっくり動かす。",2,false,false],
    ["ガラス風UI","半透明のパネルで奥行きを出す。",2,false,false],
    ["光沢エフェクト","光が通るような装飾を付ける。",2,false,false],
    ["カスタムカーソル","対応端末でポインターの形を変える。",3,false,false],
    ["ロゴアニメーション","ロゴに短い動きを付ける。",2,false,false],
    ["季節演出","季節に応じて装飾を切り替える。",2,false,false],
    ["スクロール進捗バー","ページをどこまで読んだか示す。",2,false,false],
    ["固定背景・重なり演出","背景を固定し手前の内容と重ねる。",2,false,false]
  ]},
  {id:"D",name:"デザイン・カスタマイズ",icon:"Palette",operator:false,rows:[
    ["ダークモード","明るい配色と暗い配色を切り替える。",1,false,false],
    ["テーマカラー変更","サイトの差し色を切り替える。",1,false,false],
    ["言語切り替え","用意した翻訳で言語を切り替える。",3,false,false],
    ["フォント変更","見出しや本文の書体を切り替える。",1,false,false],
    ["セクション並び替え","見せたい順番にセクションを並べる。",1,false,false],
    ["表示・非表示設定","使わないセクションを隠す。",1,false,false],
    ["セクションレイアウト変更","セクションの配置を変更する。",1,false,false],
    ["画像形状変更","写真の枠を丸形などに変更する。",1,false,false],
    ["FAQアコーディオン","質問を開くと回答が表示される。",1,false,false],
    ["ページ内検索","ページ内の情報をキーワードで探す。",1,false,false],
    ["PWA対応","対応端末でホーム画面に追加しやすくする。",3,false,false],
    ["スマホ共有機能","スマホの共有メニューからURLを送る。",1,false,false]
  ]},
  {id:"O",name:"運用・管理機能",icon:"Settings",operator:true,rows:[
    ["アクセス解析","訪問数や閲覧傾向を確認する。",2,false,true],
    ["予約ボタンクリック計測","予約ボタンが押された回数を記録する。",2,false,true],
    ["作品別閲覧分析","作品ごとの閲覧傾向を確認する。",2,false,true],
    ["SNS流入分析","SNSから来た訪問者の傾向を確認する。",2,false,true],
    ["イベント計測","問い合わせや操作を集計する。",2,false,true],
    ["A/Bテスト","異なる案を比較し反応の差を測る。",3,true,false],
    ["画像管理画面","作品画像を管理画面から更新する。",3,true,false],
    ["メニュー管理画面","施術メニューを管理画面から更新する。",3,true,false],
    ["公開予約","指定した日時に内容を公開する。",3,true,false],
    ["下書き保存","編集中の内容を公開せずに保存する。",3,true,false],
    ["更新履歴・復元","過去の更新を確認し必要に応じて戻す。",3,true,false],
    ["複数ユーザー管理","複数の担当者に役割を割り当てる。",3,true,false],
    ["稼働監視","障害を検知し運営担当に知らせる。",3,false,true],
    ["更新依頼受付","修正希望を制作側へ送れるようにする。",3,true,false],
    ["SEO設定","検索結果に出るタイトルや説明を整える。",1,false,false]
  ]}
];
const situations = ['好みのデザインを探しているとき','施術内容や予算を検討するとき','初めてのサロンを検討するとき','予約や来店の準備をするとき','新しい情報や特典をお知らせするとき','候補を探したり試したりするとき','作品や情報の見せ方に変化を付けたいとき','サイトの見え方や使いやすさを調整するとき','制作後の更新や改善を続けるとき'];
export const categories = groups.map(({id,name,icon,operator,rows})=>({id,name,icon,operator,count:rows.length}));
const demoIds = new Set([
  'G01', 'G02', 'G03', 'G04', 'G05', 'G06', 'G07', 'G08', 'G09', 'G10', 'G11', 'G12', 'G13', 'G14',
  'M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M09', 'M10', 'M11', 'M12',
]);
export const features: Feature[] = groups.flatMap((g,i)=>g.rows.map(([name,summary,difficulty,requiresBackend,requiresExternalService],j)=>{const id=g.id+String(j+1).padStart(2,'0');const hasDemo=demoIds.has(id);return {id,name,summary,category:g.id,description:summary,benefits:[situations[i]],difficulty,requiresBackend,requiresExternalService,status:hasDemo?'demo':'planned',previewKey:hasDemo?id:undefined}}));
export const getFeature = (id:string) => features.find(f=>f.id===id);
export const getCategory = (id:string) => categories.find(c=>c.id===id)!;
export function formatSelection(ids:readonly string[]) {
 const selected = features.filter(f=>ids.includes(f.id));
 return ['Webサイト追加希望機能', ...categories.flatMap(c=>{const list=selected.filter(f=>f.category===c.id);return list.length?['',`【${c.name}】`,...list.map(f=>'・'+f.name)]:[]}), '',`合計：${selected.length}機能`].join('\n');
}

