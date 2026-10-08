const C = window.SITE_CONFIG;
const LABELS = {"実習レポート":"", "職員の声":"l-voice", "人生の先輩のメッセージ":"l-senpai", "お知らせ":"l-news"};
const ICON = {"実習レポート":"📒","職員の声":"💬","人生の先輩のメッセージ":"🌿","お知らせ":"📣"};
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function snsLinks(){
  return `<a class="line ${C.lineUrl?"":"off"}" href="${esc(C.lineUrl||"#")}" target="_blank" rel="noopener">LINE${C.lineUrl?"":"（準備中）"}</a><a class="insta ${C.instagramUrl?"":"off"}" href="${esc(C.instagramUrl||"#")}" target="_blank" rel="noopener">Instagram${C.instagramUrl?"":"（準備中）"}</a>`;
}
function layout(current){
  const here = location.pathname.split("/").pop() || "index.html";
  const cats = ["実習レポート","職員の声","人生の先輩のメッセージ","お知らせ"];
  const areas = ["長野県","新潟県","埼玉県","群馬県","栃木県"];
  const li = (href,t)=>`<li><a href="${href}"><i></i>${t}</a></li>`;
  document.body.insertAdjacentHTML("afterbegin", `<header class="site"><div class="wrap">
    <a class="logo" href="index.html"><img src="img/logo.png" alt="エフビー介護サービス">エフビー介護サービス<br>実習応募サイト</a>
    <div class="hbtns"><a class="cta" href="apply.html">実習に申し込む</a>
    <button class="menubtn" id="menubtn" aria-expanded="false" aria-controls="menupanel"><svg viewBox="0 0 40 28" aria-hidden="true"><path d="M2 5q4.500-4 9 0t9 0 9 0 9 0M2 14q4.500-4 9 0t9 0 9 0 9 0M2 23q4.500-4 9 0t9 0 9 0 9 0" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg><span>Menu</span></button></div></div></header>
    <div class="menuveil" id="menuveil" hidden></div>
    <aside class="menupanel" id="menupanel" aria-label="メニュー" hidden><img class="mface" src="img/senpai2.png" alt="">
      <p class="mttl">Contents</p>
      <h2>記事から探す</h2><ul>${cats.map(c=>li("articles.html?cat="+encodeURIComponent(c),c)).join("")}</ul>
      <h2>エリアから探す</h2><ul>${areas.map(a=>li("facilities.html",a+"の事業所")).join("")}</ul>
      <ul class="plain"><li><a href="about.html">実習について</a></li><li><a href="index.html#flow">実習の流れ</a></li><li><a href="index.html#interview">経営者インタビュー</a></li><li><a href="faq.html">よくある質問</a></li><li><a href="privacy.html">個人情報の取扱い</a></li></ul>
      <a class="mcta" href="apply.html">実習に申し込む<span>→</span></a>
      <div class="mtheme" role="group" aria-label="色の切り替え（検証用）"><span>色の検証</span><button type="button" data-t="teal">コーポレート</button><button type="button" data-t="orange">オレンジ</button></div>
      <button class="mclose" id="mclose" type="button">✕ CLOSE</button></aside>`);
  const panel=document.getElementById("menupanel"), veil=document.getElementById("menuveil"), btn=document.getElementById("menubtn");
  const set=o=>{panel.hidden=!o;veil.hidden=!o;btn.setAttribute("aria-expanded",o);document.body.classList.toggle("menu-open",o);if(o)setTimeout(()=>panel.classList.add("on"),10);else panel.classList.remove("on");};
  btn.addEventListener("click",()=>set(panel.hidden));
  veil.addEventListener("click",()=>set(false));
  document.getElementById("mclose").addEventListener("click",()=>set(false));
  panel.addEventListener("click",e=>{if(e.target.closest("a"))set(false);});
  const setT=t=>{document.documentElement.dataset.menuTheme=t;panel.querySelectorAll(".mtheme button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.t===t));try{localStorage.setItem("menuTheme",t)}catch(e){}};
  let t0="orange";try{t0=localStorage.getItem("menuTheme")||"orange"}catch(e){}
  setT(t0);panel.querySelectorAll(".mtheme button").forEach(b=>b.addEventListener("click",()=>setT(b.dataset.t)));
  document.addEventListener("keydown",e=>{if(e.key==="Escape")set(false);});
  document.body.insertAdjacentHTML("beforeend", `<a class="fab" href="apply.html">実習<br>申込</a>
  <footer class="site"><div class="wrap"><p><b>エフビー介護サービス 実習応募サイト</b></p><p>FUN LIFE! FUN LOCAL!　生きがい 持ち寄る 地域の未来</p>
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
  if (window.ARTICLES_DATA) return window.ARTICLES_DATA.articles;
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
