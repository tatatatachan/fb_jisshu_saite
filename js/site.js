const C = window.SITE_CONFIG;
const LABELS = {"実習レポート":"", "職員の声":"l-voice", "人生の先輩のメッセージ":"l-senpai", "お知らせ":"l-news"};
const ICON = {"実習レポート":"📒","職員の声":"💬","人生の先輩のメッセージ":"🌿","お知らせ":"📣"};
const NAV = [["about.html","実習について"],["facilities.html","事業所"],["articles.html","実習レポート・記事"],["faq.html","よくある質問"]];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function snsLinks(){
  return `<a class="line ${C.lineUrl?"":"off"}" href="${esc(C.lineUrl||"#")}" target="_blank" rel="noopener">LINE${C.lineUrl?"":"（準備中）"}</a><a class="insta ${C.instagramUrl?"":"off"}" href="${esc(C.instagramUrl||"#")}" target="_blank" rel="noopener">Instagram${C.instagramUrl?"":"（準備中）"}</a>`;
}
function layout(current){
  const here = location.pathname.split("/").pop() || "index.html";
  document.body.insertAdjacentHTML("afterbegin", `<header class="site"><div class="wrap">
    <a class="logo" href="index.html"><img src="img/logo.png" alt="エフビー介護サービス">実習</a>
    <nav class="gnav" aria-label="メイン">${NAV.map(([h,t])=>`<a href="${h}" ${here===h?'aria-current="page"':''}>${t}</a>`).join("")}<a class="cta" href="apply.html">実習に申し込む</a></nav></div></header>`);
  document.body.insertAdjacentHTML("beforeend", `<a class="fab" href="apply.html">実習<br>申込</a>
  <footer class="site"><div class="wrap"><p><b>エフビー介護サービス</b>　生きがい 持ち寄る 地域の未来</p>
  <p>信越・北関東に7種93拠点（長野55・埼玉12・新潟11・群馬8・栃木7）</p>
  <div class="sns">${snsLinks()}</div><p><a href="privacy.html">個人情報の取扱い</a>　<a href="apply.html">実習の申込</a></p>
  <p style="opacity:.7">※ このサイトは制作中のサンプルです。記事の内容はダミーです。</p></div></footer>`);
}

async function loadArticles(){
  if (C.source === "microcms" && C.microcms.serviceDomain) {
    const r = await fetch(`https://${C.microcms.serviceDomain}.microcms.io/api/v1/${C.microcms.endpoint}?limit=100&orders=-date`,{headers:{"X-MICROCMS-API-KEY":C.microcms.apiKey}});
    const j = await r.json();
    // microCMS の項目名（id,title,category,tags,date,summary,body,emoji）を、そのまま使います
    return j.contents.map(a => ({...a, category: Array.isArray(a.category)?a.category[0]:a.category}));
  }
  const r = await fetch("data/articles.json"); return (await r.json()).articles;
}

function card(a){
  const cls = LABELS[a.category] ?? "";
  return `<a class="card" href="article.html?id=${encodeURIComponent(a.id)}"><div class="thumb ${a.image?"ph":""}">${a.image?`<img src="${esc(a.image)}" alt="">`:esc(a.emoji || ICON[a.category] || "📝")}</div>
    <div class="body"><span class="label ${cls}">${esc(a.category)}</span><span class="date">${esc(a.date)}</span>
    <h3>${esc(a.title)}</h3><p style="margin:0;color:var(--sub);font-size:.9rem">${esc(a.summary)}</p></div></a>`;
}

// ダミーの事業所（本物の事業所名に差し替えてください）
const FACILITIES = [
  {name:"事業所A（ダミー）", type:"グループホーム", area:"長野県", note:"少人数で暮らす、家庭的な雰囲気の事業所です。"},
  {name:"事業所B（ダミー）", type:"デイサービス（通所介護）", area:"長野県", note:"日中に通う利用者さんと、活動を楽しむ事業所です。"},
  {name:"事業所C（ダミー）", type:"小規模多機能型居宅介護", area:"新潟県", note:"通い・訪問・宿泊を組み合わせて支えます。"},
  {name:"事業所D（ダミー）", type:"福祉用具レンタル・販売", area:"栃木県", note:"福祉用具をご自宅に届ける仕事を体験できます。"},
  {name:"事業所E（ダミー）", type:"介護付き有料老人ホーム", area:"群馬県", note:"生活全体を支える、大きめの施設です。"},
  {name:"事業所F（ダミー）", type:"訪問介護（ホームヘルプ）", area:"埼玉県", note:"ご自宅を訪問して生活を支える仕事です。"}
];
function fillFac(id,n){
  document.getElementById(id).innerHTML = FACILITIES.slice(0,n).map(f=>`<div class="card"><div class="thumb ph"><img src="img/facility.jpg" alt=""></div><div class="body"><span class="label">${esc(f.type)}</span><span class="date">${esc(f.area)}</span><h3>${esc(f.name)}</h3><p style="margin:0;color:var(--sub);font-size:.9rem">${esc(f.note)}</p></div></div>`).join("");
}
