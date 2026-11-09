# mellow — 個人ネイリストのWebサイト

構成A（ワンページ）× Theme 01（Natural Elegant）。Next.js App Router / React / TypeScript / Tailwind CSS / Lucide React。全内容が仮データのサンプルです。

## 起動

Node.js 22 LTS 以上と pnpm を推奨（Node 24.19.0 で検証）。

```sh
pnpm install --frozen-lockfile
pnpm dev
```

http://127.0.0.1:3000/samples/a/natural/ を開きます。npm を使う場合は `npm install`、`npm run dev` でも起動できます。

この制作環境では npm が PATH にないため、同梱 pnpm で依存を導入しました。直接起動する場合：

```sh
node node_modules/next/dist/bin/next dev --hostname 127.0.0.1
```

## 構成

```text
src/app/                       App Router・metadata・共通CSS
src/app/samples/a/natural/      今回のサンプルURL
src/components/common/         ネイティブdialogベースの共通モーダル
src/components/layout/         レスポンシブヘッダー
src/components/gallery/        フィルター・画像拡大・前後切替
src/components/reservation/    共通CTA・固定CTA・未設定案内
src/data/site.ts               サロン・プロフィール・メニュー・画像・URL
src/themes/natural/            Theme 01 のセクション構成
src/types/site.ts              作品・カテゴリー・テーマ型
public/images/                 ローカル画像
```

## 文章・写真・料金の変更

`src/data/site.ts` でサロン名、キャッチコピー、コンセプト、プロフィール、メニュー、所在地、SNSを変更します。セクション見出しや補助コピーは `src/themes/natural/NaturalSite.tsx`、予約案内は共通CTAにあります。料金は全件 `isSamplePrice: true`。正式公開前に実料金へ更新し、フラグとサンプル表記を変更してください。

画像は `public/images/hero`、`gallery`、`profile` に置き、データの `image` を `/images/...` へ変更します。今回のSVGは本プロジェクト用のオリジナルの差し替え用イラストで、実在の施術実績や人物写真ではありません。正式な作品・人物写真は利用許諾を確認して差し替えてください。拡張子は JPG/WebP/PNG も使用可能です。実画像へ変更した際は alt の「サンプルイラスト」表記も更新してください。

## 予約・SNS

`site.reservationUrl` と `site.instagramUrl` は `null`。架空URLへのリンクはありません。
実際の HTTPS URL を設定すると、CTAは `target="_blank" rel="noopener noreferrer"` の外部リンクに切り替わります。予約未設定時は準備中のダイアログを開きます。設定後は予約セクションの「未設定」補助コピーも更新してください。

## 検証・ビルド

```sh
pnpm typecheck
pnpm lint
pnpm build
```

`output: 'export'` により `out/` に静的サイトが生成されます。Vercelではこのディレクトリをプロジェクトルートにして Next.js プリセットでビルドできます。静的配信にも対応します。静的exportのため `next start` は使用せず、成果物は静的サーバーで配信してください。

制作環境での最終確認は `VERIFICATION.md` を参照してください。Lighthouseは未実施です。正式画像・ドメインの設定後、Chrome DevTools の Lighthouse でモバイルとPCを確認してください。

## SEO と正式公開

`site.indexable: false` で noindex / nofollow を設定しています。正式公開時に true へ切り替え、`src/app/layout.tsx` のタイトル、説明、OGP、`metadataBase` を実ドメインに更新します。現状のOG画像はローカルSVGの仮設定です。SNS用には1200×630のJPG/PNGへ差し替えてください。実住所・地図は未設定です。サイトは個人ネイリストのもので、場所を提供する店舗の運営サイトではありません。

## 次の7パターンの追加

共通データと共通操作部品を再利用し、`src/themes/luxury` 等へテーマ固有のレイアウトを追加します。現状CSSを基準に、次テーマ追加時にテーマのCSSをCSS Modulesまたは `.natural` 等のルートクラス配下へ分離してください。色に加えてフォント・構図・装飾・動きを個別に変更できます。

`src/app/samples/a/luxury/page.tsx` 等からテーマを呼び出します。構成Bは `samples/b/<theme>/` の配下にページを追加し、同じデータを読み込みます。未実装テーマへのリンクや空ページは作成していません。`/` は今回のNaturalSiteを一時的に表示しており、後続で比較画面へ置き換えます。採用テーマの正式公開時には `src/app/page.tsx` から選んだテーマを直接呼び出してください。

## アクセシビリティ

スキップリンク、明示ラベル、キーボードフォーカス、ネイティブdialogのフォーカス制御・Escape対応、閉じた際のフォーカス復帰、画像alt、フィルター状態と結果件数、reduced-motion、safe-area、固定CTA分のフッター余白に対応しています。

## サンプル一覧と2つ目のデザイン（更新）

`/` はサンプル一覧です。構成A/Bを切り替え、公開中と制作予定を確認できます。

- `/samples/a/natural/` : サンプル01・ナチュラル／上品（従来のURLを保持）
- `/samples/a/luxury/` : サンプル02・高級感／モダン

一覧の定義は `src/data/samples.ts`、共通の切り替えバーは `SampleNavigation.tsx`。
新しいサンプルはデータの定義と対応ルート・テーマを追加してください。制作予定の項目はリンクになりません。
高級感テーマは `src/themes/luxury` のCSS Modulesでスタイルを分離し、ナチュラルの見た目を保持しています。両テーマは `src/data/site.ts` のメニュー・作品・プロフィール・店舗情報と共通のギャラリー・予約操作を使います。

正式なトップページに採用する場合は `src/app/page.tsx` から選んだテーマを直接呼び出し、サンプル切り替えバーを外します。

今回の検証：型チェック、警告なしLint、本番ビルド成功。一覧・両サンプルについて375/390/430/768/1024/1440pxで横はみ出しなし。構成A/B切り替え、サンプル移動、一覧への戻り、モバイルメニュー、Luxuryのギャラリーと予約ダイアログをブラウザ確認。

## パターン03 Soft Feminine

構成Aの3つ目 `/samples/a/feminine/` を追加しました。ピンク・ラベンダー、写真カード、丸い作品・料金カード、楕円形のプロフィールを使っています。テーマは `src/themes/feminine` のCSS Modulesで分離しています。既存2テーマとコンテンツ・ギャラリー操作・予約操作を共通化しています。

サンプル一覧の公開件数は `src/data/samples.ts` の `available` から計算するようにしました。構成Bは引き続き制作予定です。

確認: 型チェック、警告なしLint、本番ビルド成功。一覧とパターン03の375/390/430/768/1024/1440pxで横はみ出しなし。モバイルメニュー、SIMPLEフィルター2件、画像拡大、Escape閉鎖、未設定予約案内、一覧の3リンクをブラウザ検証。

## パターン04 Minimal Stylish

`/samples/a/minimal/` を追加し、構成Aの4テーマをすべて一覧から開けるようにしました。白・グレー・黒、サンセリフ文字、横長ヒーロー、2列作品グリッド、罫線の料金表を使っています。テーマCSSは `src/themes/minimal/MinimalSite.module.css` に分離し、共通コンテンツ・ギャラリー・予約操作を再利用しています。

スマホのサンプル切り替えは4件を2列で表示します。構成Bは引き続き制作予定で、未実装ページへのリンクはありません。
検証: 型チェック、警告なしLint、本番ビルド成功。一覧とMinimalの6画面幅で横はみ出しなし。メニュー、FRENCH絞り込み1件、画像拡大、Escape閉鎖、予約案内、一覧の4件リンク、構成Bの未公開状態をブラウザ確認。

## 構成B パターン01 Natural Elegant

複数ページ版を `/samples/b/natural/` に追加しました。HOME、gallery/、menu/、profile/、salon/ の5ルートがあります。共有レイアウトにナビゲーション、フッター、固定CTA、各ページ下部の予約セクションを配置しています。ページナビゲーションの現在位置表示と、モバイルメニューのページ選択後の閉鎖に対応。

`src/themes/natural-multi` が複数ページ版のテーマ、`src/data/multiNavigation.ts` がページ定義です。店舗・作品・料金・プロフィールは既存 `src/data/site.ts` を再利用。公開状態は `src/data/sampleLayouts.ts` で構成別に管理し、一覧は全5サンプル（構成A=4、B=1）を表示します。サンプル上部から構成A/Bのナチュラルを相互比較できます。

検証: 型チェック、警告なしLint、本番ビルド成功。一覧とBの5ページすべてを6画面幅で横はみ出し確認。モバイルページ移動、ギャラリーフィルター・拡大・前後切り替え・Escape、メニューページの予約案内を確認。Lighthouseとスマホ実機は未検証。

## 構成B パターン02 Modern Luxury

`/samples/b/luxury/` と `gallery/`, `menu/`, `profile/`, `salon/` を追加しました。チャコールとゴールドのスタイルをB02に限定し、B01と下層ページの内容・ナビゲーションを共用しています。各テーマ内でリンクが完結し、A02とB02は同テーマで相互比較できます。

確認: 型チェック、警告なしLint、本番静的ビルド成功。B02の全5ページを375/390/430/768/1024/1440pxで横はみ出し確認。スマホナビ、ギャラリーのNUANCE絞り込みと拡大をブラウザで確認。
