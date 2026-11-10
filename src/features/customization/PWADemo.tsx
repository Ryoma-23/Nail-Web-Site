import Image from 'next/image';
import { Panel } from './Controls';
import s from './customization.module.css';

export default function PWADemo() {
  return <div className={s.workspace}>
    <Panel title="ホーム画面から開くミニサイト">
      <div className={s.phoneGrid}>
        <div className={s.phone}><strong>追加前</strong><p>Safari / Chrome</p><small>ブラウザからサイトへアクセス</small></div>
        <div className={s.phone}><strong>追加後のイメージ</strong><Image src="/pwa-demo/icon-192.png" width={52} height={52} alt="Mellow Nail アプリアイコン"/><small>アイコンから直接開く</small></div>
      </div>
      <a href="/pwa-demo/" className={s.linkButton}>専用のPWAサンプルを開く →</a>
      <ul>
        <li>iPhoneのSafariでは、共有メニューの「ホーム画面に追加」を選びます。</li>
        <li>AndroidのChromeでは、専用ページのインストールボタンかブラウザのメニューを使います。</li>
        <li>アプリ内ブラウザで追加できない場合はSafariやChromeで開いてください。</li>
      </ul>
      <p>専用ページにアプリ名やアイコンを定義するmanifestと、専用の範囲で動くService Workerを用意しました。</p>
      <small>端末やブラウザにより操作が異なります。表示にはインターネット接続が必要です。</small>
    </Panel>
  </div>;
}

