// 公開前に設定する値。空のあいだは「準備中」「確認中」と表示されます。
window.SITE_CONFIG = {
  // 本物の申込フォームのURL（Googleフォームなど）。空のあいだはダミーの申込フォームを表示します。
  applyFormUrl: "",
  // 採用担当のメールアドレス（未確認のため空）
  contactEmail: "",
  // 電話番号（コーポレートサイトの問い合わせ先。採用専用かは未確認）
  contactTel: "0267-88-8188",
  // コーポレートサイトの採用問い合わせフォーム
  recruitFormUrl: "https://www.fb-kaigo.co.jp/contact/form?content-type=recruit",
  // SNSのURL（未設定）
  lineUrl: "",
  instagramUrl: "",
  // 記事の取得元。"local" は data/articles.json、"microcms" にすると microCMS から取得します。
  source: "local",
  microcms: { serviceDomain: "", apiKey: "", endpoint: "articles" }
};
