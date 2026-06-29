
const app = document.getElementById("app");
let answers = [];
let current = 0;
let mode = "animals";

const all = [...ANIMALS, ...CREATURES];
const typeMap = Object.fromEntries(ANIMALS.map(a=>[a.code,a]));

function page(content){
  app.innerHTML = `<section class="page"><div class="inner">${content}</div></section>`;
}

function home(){
  page(`
    <div class="header">
      <div class="kicker">いい人すぎるよ展｜KIND研究室</div>
      <h1>KIND<br>CODE16</h1>
      <div class="catch">優しさから生まれた、<br>32の仲間たち。</div>
    </div>
    <div class="hero-grid">
      <div class="hero-card"><div class="big">🦌</div><b>動物たち16</b><span>外に現れる優しさ</span></div>
      <div class="hero-card"><div class="big">☁️</div><b>不思議生命体16</b><span>心の中で育つ優しさ</span></div>
    </div>
    <div class="note">
      16問の観察記録に答えると、あなたの優しさのタイプが見つかります。<br>
      図鑑では32キャラ全員を見ることができます。
    </div>
    <button class="main" onclick="start()">診断をはじめる</button>
    <button onclick="showZukan('animals')">32キャラ図鑑を見る</button>
  `);
}

function showZukan(kind){
  mode = kind;
  const data = kind === "animals" ? ANIMALS : CREATURES;
  page(`
    <button class="back" onclick="home()">← トップへ戻る</button>
    <div class="header">
      <div class="kicker">KIND研究室 観察図鑑</div>
      <h1>32キャラ<br>図鑑</h1>
    </div>
    <div class="tabs">
      <button class="tab ${kind==="animals"?"active":""}" onclick="showZukan('animals')">動物16</button>
      <button class="tab ${kind==="creatures"?"active":""}" onclick="showZukan('creatures')">生命体16</button>
    </div>
    <div class="grid">
      ${data.map((x,i)=>card(x,kind,i)).join("")}
    </div>
  `);
}

function card(x,kind,i){
  return `
    <article class="card" style="--c:${x.color};--s:${x.sub}" onclick="detail('${kind}',${i})">
      <div class="no">${String(x.no).padStart(2,"0")}｜${x.code}</div>
      <div class="char">${x.emoji}</div>
      <h3>${x.name}</h3>
      <p>${x.title}<br>関連：${x.partner}</p>
    </article>
  `;
}

function detail(kind,i){
  const x = kind === "animals" ? ANIMALS[i] : CREATURES[i];
  page(`
    <button class="back" onclick="showZukan('${kind}')">← 図鑑へ戻る</button>
    <section class="detail-head" style="--c:${x.color};--s:${x.sub}">
      <div class="no">研究記録 No.${String(x.no).padStart(2,"0")}｜${x.code}</div>
      <div class="detail-title">${x.emoji} ${x.name}</div>
      <div class="subline">${x.title}<br>${x.line}</div>
    </section>
    ${sheet(x,kind)}
    <button onclick="showZukan('${kind === "animals" ? "creatures" : "animals"}')">対応する${kind === "animals" ? "生命体" : "動物"}を見る</button>
  `);
}

function sheet(x,kind){
  return `
    <section class="sheet" style="--c:${x.color};--s:${x.sub}">
      <div class="sheet-title">観察スケッチ・図鑑記録</div>
      <div class="pose">
        <div>${x.emoji}<small>正面</small></div>
        <div>${x.emoji}<small>横向き</small></div>
        <div>${x.emoji}<small>休む姿</small></div>
      </div>
      <div class="info"><h4>テーマカラー</h4><div class="colors"><span class="swatch" style="background:${x.color}"></span><span class="swatch" style="background:${x.sub}"></span><span class="swatch" style="background:${x.accent}"></span></div></div>
      <div class="info"><h4>研究レベル</h4><p>${x.rare}</p></div>
      <div class="info"><h4>身につけているもの</h4><p>${x.item}</p></div>
      <div class="info"><h4>好きなもの</h4><ul>${x.likes.map(v=>`<li>${v}</li>`).join("")}</ul></div>
      <div class="info"><h4>Field Note</h4><p>${x.field}</p></div>
      <div class="info"><h4>研究員メモ</h4><p>${x.memo}</p></div>
      <div class="info"><h4>生態メモ 未解明なこと</h4><p>${x.mystery}</p></div>
      <div class="info"><h4>つながりがある仲間</h4><p>${x.partner}</p></div>
    </section>
  `;
}

const choices = [
  ["★", -2, "全くそう思わない"],
  ["★★", -1, "あまりそう思わない"],
  ["★★★", 0, "どちらともいえない"],
  ["★★★★", 1, "少しそう思う"],
  ["★★★★★", 2, "とてもそう思う"]
];

function start(){
  answers = [];
  current = 0;
  question();
}

function question(){
  const q = QUESTIONS[current];
  const p = Math.round(current / QUESTIONS.length * 100);
  page(`
    <button class="back" onclick="${current===0 ? "home()" : "prevQ()"}">← 戻る</button>
    <div class="kicker">観察記録 ${current+1}/16</div>
    <div class="progress"><div class="bar" style="width:${p}%"></div></div>
    <div class="qcard">
      <div class="qtext">${q.text}</div>
      ${choices.map((c,idx)=>`<button class="choice" onclick="answer(${idx})"><span class="stars">${c[0]}</span>${c[2]}</button>`).join("")}
    </div>
  `);
}

function answer(idx){
  answers[current] = {axis:QUESTIONS[current].axis, point:choices[idx][1]};
  if(current < QUESTIONS.length-1){ current++; question(); }
  else result();
}

function prevQ(){
  if(current>0){current--;question();}
}

function result(){
  const score = {E:0,S:0,H:0,V:0,D:0,P:0,U:0,B:0};
  const opp = {E:"S",S:"E",H:"V",V:"H",D:"P",P:"D",U:"B",B:"U"};
  answers.forEach(a=>{
    if(a.point>=0) score[a.axis]+=a.point;
    else score[opp[a.axis]]+=Math.abs(a.point);
  });
  let code = "";
  code += score.E >= score.S ? "E" : "S";
  code += score.H >= score.V ? "H" : "V";
  code += score.D >= score.P ? "D" : "P";
  code += score.U >= score.B ? "U" : "B";
  let x = typeMap[code] || ANIMALS[0];
  const c = CREATURES.find(v=>v.name===x.partner);
  page(`
    <div class="header">
      <div class="kicker">診断結果</div>
      <h1>${x.code}</h1>
    </div>
    <section class="detail-head" style="--c:${x.color};--s:${x.sub}">
      <div class="detail-title">${x.emoji} ${x.name}</div>
      <div class="subline">${x.title}<br>${x.line}</div>
    </section>
    ${sheet(x,"animals")}
    <section class="detail-head" style="--c:${c.color};--s:${c.sub};margin-top:16px">
      <div class="no">心の中の不思議生命体</div>
      <div class="detail-title">${c.emoji} ${c.name}</div>
      <div class="subline">${c.title}<br>${c.line}</div>
    </section>
    <button class="main" onclick="home()">トップへ戻る</button>
    <button onclick="showZukan('animals')">図鑑を見る</button>
  `);
}

home();
