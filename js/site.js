const C = window.SITE_CONFIG;
const LABELS = {"実習レポート":"", "職員の声":"l-voice", "人生の先輩のメッセージ":"l-senpai", "お知らせ":"l-news"};
const ICON = {"実習レポート":"📒","職員の声":"💬","人生の先輩のメッセージ":"🌿","お知らせ":"📣"};
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function snsLinks(){
  return `<a class="line ${C.lineUrl?"":"off"}" href="${esc(C.lineUrl||"#")}" target="_blank" rel="noopener">LINE${C.lineUrl?"":"（準備中）"}</a><a class="insta ${C.instagramUrl?"":"off"}" href="${esc(C.instagramUrl||"#")}" target="_blank" rel="noopener">Instagram${C.instagramUrl?"":"（準備中）"}</a>`;
}
function layout(current){
  const here = location.pathname.split("/").pop() || "index.html";
  document.body.insertAdjacentHTML("beforeend", `<div class="pgov" aria-hidden="true"><img src="img/senpai1.png" alt=""><img src="img/senpai2.png" alt=""><img src="img/senpai3.png" alt=""></div>`);
  const cats = ["実習レポート","職員の声","人生の先輩のメッセージ","お知らせ"];
  const areas = ["長野県","新潟県","埼玉県","群馬県","栃木県"];
  const li = (href,t)=>`<li><a href="${href}"><i></i>${t}</a></li>`;
  document.body.insertAdjacentHTML("afterbegin", `<header class="site"><div class="wrap">
    <a class="logo" href="index.html"><img src="img/logo.png" alt="エフビー介護サービス"><span class="lt"><small>エフビー介護サービス</small><b>実習サイト</b></span></a>
    <div class="hbtns"><img class="hrun" src="img/header-meal.png" alt=""><a class="cta" href="apply.html">実習に申し込む</a>
    <button class="menubtn" id="menubtn" aria-expanded="false" aria-controls="menupanel"><svg viewBox="0 0 42 28" aria-hidden="true"><path d="M1 26C7 26 10 11 16 11S22 20 26 15S30 2 34 2S39 26 41 26Z" fill="currentColor"/></svg><span>Menu</span></button></div></div></header>
    <div class="menuveil" id="menuveil" hidden></div>
    <aside class="menupanel" id="menupanel" aria-label="メニュー" hidden><div class="mxwrap"><button class="mx" id="mx" type="button" aria-label="メニューを閉じる"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 3L17 17M17 3L3 17" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg></button></div><img class="mface" src="img/senpai2.png" alt="">
      <p class="mttl">Contents</p>
      <h2>記事から探す</h2><ul>${cats.map(c=>li("articles.html?cat="+encodeURIComponent(c),c)).join("")}</ul>
      <h2>エリアから探す</h2><ul>${areas.map(a=>li("facilities.html",a+"の事業所")).join("")}</ul>
      <ul class="plain"><li><a href="about.html">実習について</a></li><li><a href="index.html#program">実習プログラム（1DAY・5DAYS）</a></li><li><a href="index.html#flow">実習の流れ</a></li><li><a href="index.html#interview">経営者インタビュー</a></li><li><a href="faq.html">よくある質問</a></li><li><a href="privacy.html">個人情報の取扱い</a></li></ul>
      <a class="mcta" href="apply.html">実習に申し込む<span>→</span></a></aside>`);
  const panel=document.getElementById("menupanel"), veil=document.getElementById("menuveil"), btn=document.getElementById("menubtn");
  const set=o=>{panel.hidden=!o;veil.hidden=!o;btn.setAttribute("aria-expanded",o);document.body.classList.toggle("menu-open",o);if(o)setTimeout(()=>panel.classList.add("on"),10);else panel.classList.remove("on");};
  btn.addEventListener("click",()=>set(panel.hidden));
  veil.addEventListener("click",()=>set(false));
  panel.addEventListener("click",e=>{const a=e.target.closest("a[href]");if(!a)return;const u=new URL(a.href,location.href);if(u.pathname===location.pathname&&u.hash)set(false);});
  document.getElementById("mx").addEventListener("click",()=>set(false));
  panel.addEventListener("click",e=>{if(e.target.closest("a"))set(false);});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")set(false);});
  document.body.insertAdjacentHTML("beforeend", `<a class="fab" href="apply.html"><img class="fabrun" src="img/apply-runner.png" alt=""><span class="fabtx">実習<br>申込</span></a>
  <footer class="site"><div class="wrap"><p><b>エフビー介護サービス 実習応募サイト</b></p><p>FUN LIFE! FUN LOCAL!　生きがい 持ち寄る 地域の未来</p>
  <p>信越・北関東に7種109拠点（長野57・新潟15・埼玉15・群馬12・栃木10）</p>
  <div class="sns">${snsLinks()}</div><nav class="flinks" aria-label="フッター"><a href="apply.html">実習の申込</a><a href="privacy.html">プライバシーポリシー（個人情報の取扱い）</a><a href="https://www.fb-kaigo.co.jp/" target="_blank" rel="noopener">コーポレートサイト（エフビー介護サービス）↗</a></nav>
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

// 事業所（360°ツアーが公開されている事業所。出典: https://www.fb-kaigo.co.jp/360tour ）
const FACILITIES = [
  {"id": "azumino", "name": "グループホーム安曇野", "type": "グループホーム", "area": "長野県安曇野市", "pref": "長野県", "note": "少人数で暮らす、家庭的な雰囲気の事業所です。", "img": "img/fac-azumino.jpg", "tour": "https://r72075300.theta360.biz/t/4c1a858c-db75-11ee-b05c-06e15c8163f7-1"},
  {"id": "kamada", "name": "看護小規模多機能あったかほーむかまだ（ケアライフかまだ）", "type": "看護小規模多機能型居宅介護", "area": "長野県松本市", "pref": "長野県", "note": "通い・訪問・泊まりに、看護も組み合わせて暮らしを支えます。", "img": "img/fac-kamada.jpg", "tour": "https://r72075300.theta360.biz/t/386ef7ae-ae83-11ed-8f32-0613720b7bf9-1"},
  {"id": "asama", "name": "小規模多機能あったかほーむあさま（ケアライフあさま）", "type": "小規模多機能型居宅介護", "area": "長野県佐久市", "pref": "長野県", "note": "通い・訪問・泊まりを組み合わせて暮らしを支えます。", "img": "img/fac-asama.jpg", "tour": "https://r72075300.theta360.biz/t/2ab506de-5211-11ea-8904-0a51b667580a-1"},
  {"id": "suwa", "name": "グループホーム諏訪沖田", "type": "グループホーム", "area": "長野県諏訪市", "pref": "長野県", "note": "少人数で暮らす、家庭的な雰囲気の事業所です。", "img": "img/fac-suwa.jpg", "tour": "https://r72075300.theta360.biz/t/24a3f626-adce-11ed-8da7-0613720b7bf9-1"},
  {"id": "furusato", "name": "グループホーム古里", "type": "グループホーム", "area": "長野県上田市", "pref": "長野県", "note": "少人数で暮らす、家庭的な雰囲気の事業所です。", "img": "img/fac-furusato.jpg", "tour": "https://r72075300.theta360.biz/t/ec743140-a3e3-11ea-aa12-06bdb15a584a-1"},
  {"id": "itoigawa", "name": "グループホームエフビー糸魚川", "type": "グループホーム", "area": "新潟県糸魚川市", "pref": "新潟県", "note": "少人数で暮らす、家庭的な雰囲気の事業所です。", "img": "img/fac-itoigawa.jpg", "tour": "https://r72075300.theta360.biz/t/f1e514d2-c3ce-11ee-80e7-0613720b7bf9-1"},
  {"id": "yuinomori", "name": "グループホームエフビーゆいの杜（ゆいのもり）", "type": "グループホーム", "area": "栃木県宇都宮市", "pref": "栃木県", "note": "少人数で暮らす、家庭的な雰囲気の事業所です。", "img": "img/fac-yuinomori.jpg", "tour": "https://r72075300.theta360.biz/t/61ae6d4e-23e2-11f0-80fc-06e15c8163f7-1"},
  {"id": "oyama", "name": "グループホームエフビー小山", "type": "グループホーム", "area": "栃木県小山市", "pref": "栃木県", "note": "少人数で暮らす、家庭的な雰囲気の事業所です。", "img": "img/fac-oyama.jpg", "tour": "https://r72075300.theta360.biz/t/3ced752c-e662-11ee-9637-0a8a3e894413-1"},
  {"id": "hanyu", "name": "グループホームエフビー羽生", "type": "グループホーム", "area": "埼玉県羽生市", "pref": "埼玉県", "note": "少人数で暮らす、家庭的な雰囲気の事業所です。", "img": "img/fac-hanyu.jpg", "tour": "https://r72075300.theta360.biz/t/0eb700ea-c469-11ed-9430-0a7fdda087bb-1"}
];
function fillFac(id,n){
  document.getElementById(id).innerHTML = FACILITIES.slice(0,n).map(f=>`<a class="card" href="facility.html?id=${f.id}"><div class="thumb ph"><img src="${f.img}" alt="${esc(f.name)}の外観"><span class="tour360">360°</span></div><div class="body"><span class="label">${esc(f.type)}</span><span class="date">${esc(f.area)}</span><h3>${esc(f.name).replace("多機能","多機能\u200b").replace("（","\u200b（")}</h3><p style="margin:0;color:var(--sub);font-size:.9rem">${esc(f.note)}</p></div></a>`).join("");
}

// ページ遷移：ゆっくりフェード（0.55秒で現れ、0.5秒で消える）
(function(){
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;
  document.addEventListener("click", e => {
    const a = e.target.closest && e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
    if (a.target === "_blank" || a.hasAttribute("download")) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin && u.protocol !== "file:") return;
    if (u.protocol !== location.protocol || u.pathname === location.pathname && u.search === location.search) return;
    e.preventDefault();
    document.documentElement.classList.add("leaving");
    setTimeout(() => { location.href = a.href; }, 500);
  });
  window.addEventListener("pageshow", () => document.documentElement.classList.remove("leaving"));
})();

// TOP：FUN LIFE! FUN LOCAL! を、ひと文字ずつ弾むように登場させる
(function(){
  const fun = document.querySelector(".fun");
  if (!fun || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
  let n = 0;
  fun.querySelectorAll(":scope > span").forEach(line => {
    const t = line.textContent;
    line.setAttribute("aria-label", t);
    line.innerHTML = [...t].map(ch => ch === " " ? '<i class="sp"> </i>' : `<i class="ch" aria-hidden="true" style="animation-delay:${(0.45 + (n++) * 0.07).toFixed(2)}s">${ch}</i>`).join("");
  });
  const eb = document.querySelector(".hero .eyebrow");
  if (eb) eb.classList.add("eb-in");
})();

// 拠点マップ：画面に入ったら、ふわっと現れる
(function(){
  const fig=document.querySelector(".area-fig"); if(!fig) return;
  if(!("IntersectionObserver" in window)){fig.classList.add("in");return;}
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){fig.classList.add("in");io.disconnect();}}),{threshold:.25});
  io.observe(fig);
})();

// .rv：画面に入ったらふわっと現れる
(function(){
  const els=document.querySelectorAll(".rv"); if(!els.length) return;
  if(!("IntersectionObserver" in window)){els.forEach(e=>e.classList.add("in"));return;}
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}}),{threshold:.08,rootMargin:"0px 0px -6% 0px"});
  els.forEach(e=>{if(e.getBoundingClientRect().bottom<0)e.classList.add("in");else io.observe(e);});
})();

// 日本語の改行：文節の途中で切れないようにまとめる（ブラウザの日本語分かち書きを使用）
(function(){
  if(!window.Intl||!Intl.Segmenter) return;
  const seg=new Intl.Segmenter("ja",{granularity:"word"});
  const SKIP="script,style,textarea,select,option,code,pre,svg,.jpw,.fun,.pk,.fab,[data-nojp]";
  const hira=c=>/[ぁ-ゟ]/.test(c);
  const closeP=/^[、。，．）」』】〕〉》！？!?：；,.)\]・ー〜~]/;
  const openP=/[（「『【〔〈《(\[]$/;
  function tokens(t){
    const out=[];let cur="";
    const flush=()=>{if(cur){out.push({t:cur});cur="";}};
    for(const {segment:s} of seg.segment(t)){
      if(!/\S/.test(s)){flush();out.push({t:s,sp:true});continue;}
      if(!cur){cur=s;continue;}
      const last=cur[cur.length-1];
      const startsContent=!hira(s[0])&&!closeP.test(s);
      if(startsContent&&!openP.test(cur)&&(hira(last)||closeP.test(last)))flush();
      cur+=s;
    }
    flush();return out;
  }
  function wrap(root){
    const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(n){
      if(n.nodeValue.length<2||!/[぀-ヿ一-鿿]/.test(n.nodeValue))return NodeFilter.FILTER_REJECT;
      const p=n.parentElement;return p&&!p.closest(SKIP)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});
    const list=[];while(w.nextNode())list.push(w.currentNode);
    list.forEach(n=>{
      const box=document.createElement("span");box.className="jpw";
      tokens(n.nodeValue).forEach(k=>{
        if(k.sp){box.appendChild(document.createTextNode(k.t));return;}
        const s=document.createElement("span");s.className="jpp";s.textContent=k.t;box.appendChild(s);});
      n.replaceWith(box);
    });
  }
  let busy=false,q=false;
  const run=()=>{if(busy)return;busy=true;try{wrap(document.body);}finally{busy=false;}};
  const sched=()=>{if(q)return;q=true;requestAnimationFrame(()=>{q=false;run();});};
  const start=()=>{run();new MutationObserver(ms=>{if(ms.some(m=>[...m.addedNodes].some(a=>!(a.classList&&(a.classList.contains("jpw")||a.classList.contains("jpp"))))))sched();}).observe(document.body,{childList:true,subtree:true});};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(start,0));else setTimeout(start,0);
})();


// ページ遷移で開いたときは、必ず一番上から表示する（「戻る」のときは元の位置）
(function(){
  const nav=performance.getEntriesByType&&performance.getEntriesByType("navigation")[0];
  if(location.hash||(nav&&nav.type!=="navigate"))return;
  const top=()=>window.scrollTo({top:0,left:0,behavior:"instant"});
  top();window.addEventListener("load",top);setTimeout(top,60);setTimeout(top,300);
})();

// フォームの「選択リスト」と「カレンダー」を、サイトの見た目に合わせた専用の部品にする
function enhanceForm(root){
  root=root||document;
  const closeAll=ex=>document.querySelectorAll(".cs-open").forEach(e=>{if(e!==ex)e.classList.remove("cs-open");});
  document.addEventListener("click",e=>{if(!e.target.closest(".cs"))closeAll();});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeAll();});
  // --- 選択リスト
  root.querySelectorAll("form select").forEach(sel=>{
    const wrap=document.createElement("div");wrap.className="cs";
    const btn=document.createElement("button");btn.type="button";btn.className="cs-btn";btn.setAttribute("aria-haspopup","listbox");
    const list=document.createElement("ul");list.className="cs-list";list.setAttribute("role","listbox");
    sel.parentNode.insertBefore(wrap,sel);wrap.append(btn,list,sel);sel.classList.add("cs-native");sel.tabIndex=-1;
    const render=()=>{
      btn.innerHTML=`<span>${esc(sel.options[sel.selectedIndex]?.text||"")}</span>`;
      list.innerHTML=[...sel.options].map((o,i)=>`<li role="option" tabindex="-1" data-i="${i}" aria-selected="${i===sel.selectedIndex}">${esc(o.text)}</li>`).join("");
    };
    render();
    new MutationObserver(render).observe(sel,{childList:true});
    const pick=i=>{sel.selectedIndex=i;sel.dispatchEvent(new Event("change",{bubbles:true}));render();wrap.classList.remove("cs-open");btn.focus();};
    btn.addEventListener("click",e=>{e.preventDefault();const o=!wrap.classList.contains("cs-open");closeAll(wrap);wrap.classList.toggle("cs-open",o);if(o){const s=list.querySelector("[aria-selected=true]");if(s)s.scrollIntoView({block:"nearest"});}});
    list.addEventListener("click",e=>{e.preventDefault();const li=e.target.closest("li");if(li)pick(+li.dataset.i);});
    wrap.addEventListener("keydown",e=>{
      const items=[...list.children];if(!items.length)return;
      if(["ArrowDown","ArrowUp"].includes(e.key)){e.preventDefault();if(!wrap.classList.contains("cs-open")){closeAll(wrap);wrap.classList.add("cs-open");}
        const cur=items.indexOf(document.activeElement);const n=e.key==="ArrowDown"?Math.min(cur+1,items.length-1):Math.max(cur<0?0:cur-1,0);items[n].focus();}
      else if((e.key==="Enter"||e.key===" ")&&document.activeElement.tagName==="LI"){e.preventDefault();pick(+document.activeElement.dataset.i);}
    });
  });
  // --- カレンダー
  root.querySelectorAll("form input[type=date]").forEach(inp=>{
    const wrap=document.createElement("div");wrap.className="cs";
    const btn=document.createElement("button");btn.type="button";btn.className="cs-btn cs-date";
    const pop=document.createElement("div");pop.className="cs-list cal";
    inp.parentNode.insertBefore(wrap,inp);wrap.append(btn,pop,inp);inp.classList.add("cs-native");inp.tabIndex=-1;
    const W=["日","月","火","水","木","金","土"];
    const today=new Date();today.setHours(0,0,0,0);
    const iso=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
    let view=new Date(today.getFullYear(),today.getMonth(),1);
    const label=()=>{if(!inp.value){btn.innerHTML='<span class="ph">日にちを選ぶ</span>';return;}const d=new Date(inp.value+"T00:00:00");btn.innerHTML=`<span>${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日（${W[d.getDay()]}）</span>`;};
    const draw=()=>{
      const y=view.getFullYear(),m=view.getMonth(),first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate();
      const canPrev=new Date(y,m,1)>new Date(today.getFullYear(),today.getMonth(),1);
      let cells="";for(let i=0;i<first;i++)cells+="<i></i>";
      for(let d=1;d<=days;d++){const dt=new Date(y,m,d),v=iso(dt),past=dt<today,wd=dt.getDay();
        cells+=`<button type="button" class="d${wd===0?" sun":wd===6?" sat":""}${v===iso(today)?" today":""}${v===inp.value?" sel":""}" data-v="${v}"${past?" disabled":""}>${d}</button>`;}
      pop.innerHTML=`<div class="cal-h"><button type="button" class="nav" data-n="-1" aria-label="前の月"${canPrev?"":" disabled"}>‹</button><b>${y}年${m+1}月</b><button type="button" class="nav" data-n="1" aria-label="次の月">›</button></div>
      <div class="cal-w">${W.map((w,i)=>`<span class="${i===0?"sun":i===6?"sat":""}">${w}</span>`).join("")}</div><div class="cal-g">${cells}</div>
      <div class="cal-f"><button type="button" data-a="clear">クリア</button><button type="button" data-a="today">今日</button></div>`;
    };
    label();draw();
    const set=v=>{inp.value=v;inp.dispatchEvent(new Event("change",{bubbles:true}));label();draw();};
    btn.addEventListener("click",e=>{e.preventDefault();const o=!wrap.classList.contains("cs-open");closeAll(wrap);wrap.classList.toggle("cs-open",o);if(o){if(inp.value){const d=new Date(inp.value+"T00:00:00");view=new Date(d.getFullYear(),d.getMonth(),1);}draw();}});
    pop.addEventListener("click",e=>{
      e.preventDefault();
      const n=e.target.closest("[data-n]"),d=e.target.closest(".d"),a=e.target.closest("[data-a]");
      if(n&&!n.disabled){view=new Date(view.getFullYear(),view.getMonth()+ +n.dataset.n,1);draw();}
      else if(d&&!d.disabled){set(d.dataset.v);wrap.classList.remove("cs-open");btn.focus();}
      else if(a){if(a.dataset.a==="clear")set("");else set(iso(today));wrap.classList.remove("cs-open");}
    });
  });
}
