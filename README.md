# エフビー介護サービス 実習サイト

学生の職場体験・実習向けサイト。ビルド不要の静的サイトです。

## 見る方法
`index.html` をダブルクリックして、ブラウザで開きます（サーバーは不要です）。

## 公開前に設定するもの（`js/config.js`）
- `applyFormUrl`：申込フォームのURL
- `contactEmail`：問い合わせ先
- `source`：`"microcms"` にすると記事を microCMS から読み込みます（`microcms` に serviceDomain / apiKey を入れる）

## 記事データ
- 今は `data/articles.json` のダミー記事を表示しています。
- microCMS の項目名：`id, title, category, tags, date, summary, body, emoji`（`category` はセレクト：実習レポート／職員の声／人生の先輩のメッセージ／お知らせ）。
- apiKey はブラウザに出るため、公開用の読み取り専用キーを使います。

## 未確定の内容
実習の期間・費用・対象・FAQ・個人情報の取扱いは「確認中」の表示です。

## 写真・ロゴ（ダミー）
- `img/logo.png`：エフビー介護サービス公式サイトのロゴ。コーポレートカラーはロゴの色 `#00ACA8`。
- `img/hero.jpg`、`img/facility.jpg`：visions の記事（エフビー介護サービス）から借りたダミー写真。**公開前に、使用許可（visions・エフビー・写っている方）を確認し、自社撮影の写真に差し替えること。**
- 電話番号は公式サイトの問い合わせ先。採用担当のメールは公式サイトに見当たらず未設定。
