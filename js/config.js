// 公開前に設定する値。空のあいだは、申込ページに「準備中」と表示されます。
window.SITE_CONFIG = {
  // 申込フォームのURL（Googleフォームなど）
  applyFormUrl: "",
  // 問い合わせ用メールアドレス
  contactEmail: "",
  // 記事の取得元。"local" は data/articles.json、"microcms" にすると microCMS から取得します。
  source: "local",
  microcms: { serviceDomain: "", apiKey: "", endpoint: "articles" }
};
