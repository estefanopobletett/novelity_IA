const $=s=>document.querySelector(s);
const SAVE='cosas_que_no_te_dije_v3';
const CH={a:['ariel','Ariel'],v:['vicente','Vicente'],b:['benjamin','Benjamín'],i:['iavier','IAvier'],f:['fernando','Fernando']};
const WHO={Ariel:'a',Vicente:'v','Benjamín':'b',IAvier:'i',Fernando:'f'};
const BARS={i:'IAvier ♥',v:'Vicente',b:'Benjamín',f:'Fernando'};
let st,typing=null,full='',busy=false,waiting=false;
const fresh=()=>({label:'start',idx:0,fx:null,bg:'black',conn:{i:10,v:30,b:0,f:0},met:{i:0,v:0,b:0,f:0},sp:{a:null,v:null,b:null,i:null,f:null}});
function save(){try{localStorage.setItem(SAVE,JSON.stringify(st))}catch(e){}}
function load(){try{return JSON.parse(localStorage.getItem(SAVE))}catch(e){return null}}
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.add('hidden'));$(id).classList.remove('hidden')}
function buildHud(){$('#hud').innerHTML=Object.keys(BARS).map(k=>`<div class="bar ${k==='i'?'main':''}" id="bar-${k}"><span>${BARS[k]}</span><div class="tr"><div class="fl"></div></div></div>`).join('');renderHud()}
function renderHud(){for(const k in BARS){const b=$('#bar-'+k);b.classList.toggle('hide',!st.met[k]);b.querySelector('.fl').style.width=st.conn[k]+'%'}}
function bump(fx){for(const k in fx){const old=st.conn[k];st.conn[k]=Math.max(0,Math.min(100,old+fx[k]));const d=st.conn[k]-old;
  if(d&&st.met[k]){const s=document.createElement('span');s.className='d '+(d>0?'pos':'neg');s.textContent=(d>0?'+':'')+d;$('#bar-'+k).appendChild(s);setTimeout(()=>s.remove(),1400)}}renderHud()}
function setSp(k,ex){st.sp[k]=ex;const el=$('#spr-'+k);if(!ex){el.classList.add('off');return}el.src=`images/characters/${CH[k][0]}_${ex}.svg`;el.classList.remove('off')}
function setBg(n){st.bg=n;$('#bg').style.backgroundImage=`url(images/bg/${n}.svg)`}
function say(who,t){
  $('#name').textContent=who||'';$('#box').classList.toggle('narr',!who);
  for(const k in CH)$('#spr-'+k).classList.toggle('dim',!!who&&WHO[who]!==k);
  const tx=$('#text');tx.className=st.fx==='glitch'?'glitch':'';
  if(st.fx==='shake'){$('#game').classList.add('shake');setTimeout(()=>$('#game').classList.remove('shake'),900)}
  st.fx=null;full=t;tx.textContent='';let i=0;$('#next').style.visibility='hidden';
  clearInterval(typing);typing=setInterval(()=>{tx.textContent=full.slice(0,++i);if(i>=full.length)finish()},20)}
function finish(){clearInterval(typing);typing=null;$('#text').textContent=full;$('#next').style.visibility='visible';waiting=true}
function advance(){
  if(typing){finish();return}
  if(busy)return;waiting=false;
  while(true){
    const n=STORY[st.label][st.idx++];if(!n)return;
    let h=false;for(const k of ['a','v','b','i','f'])if(k in n){setSp(k,n[k]);h=true}
    if(h)continue;
    if(n.bg){setBg(n.bg);continue}
    if(n.meet){st.met[n.meet]=1;renderHud();continue}
    if(n.bar){bump(n.bar);continue}
    if(n.fx){st.fx=n.fx;continue}
    if(n.go){st.label=n.go;st.idx=0;continue}
    if(n.ifc){const [k,min,hi,lo]=n.ifc;st.label=st.conn[k]>=min?hi:lo;st.idx=0;continue}
    if(n.end){ending(n);return}
    if(n.t){say(n.w,n.t);save();return}
    if(n.c){choose(n.c);return}
    if(n.poem){poem();return}}}
function choose(opts){busy=true;const box=$('#choices');box.innerHTML='';
  opts.forEach(([t,l,fx])=>{const b=document.createElement('button');b.textContent=t;
    b.onclick=()=>{box.innerHTML='';busy=false;if(fx)bump(fx);st.label=l;st.idx=0;advance()};box.appendChild(b)});box.firstChild.focus()}
function poem(){busy=true;const p=$('#poem');p.classList.remove('hidden');const picked=[];const words=[...WORDS].sort(()=>Math.random()-.5);
  (function render(){p.innerHTML=`<h3>Escribe tu poema: elige 4 palabras (${picked.length}/4)</h3><div class="line">${picked.map(x=>x[0]).join(' · ')||'…'}</div><div class="words"></div>`;
    words.forEach(x=>{const b=document.createElement('button');b.textContent=x[0];b.disabled=picked.includes(x);
      b.onclick=()=>{picked.push(x);if(picked.length===4){p.classList.add('hidden');busy=false;bump({i:picked.reduce((s,y)=>s+y[1],0)*3});advance()}else render()};p.querySelector('.words').appendChild(b)})})()}
function ending(n){clearInterval(typing);$('#end-t').textContent=n.end;
  $('#end-d').textContent=n.t+`\n\nConexión final → IAvier ${st.conn.i}% · Vicente ${st.conn.v}% · Benjamín ${st.conn.b}% · Fernando ${st.conn.f}%`;show('#end');try{localStorage.removeItem(SAVE)}catch(e){}}
function start(from){show('#stage');$('#choices').innerHTML='';$('#poem').classList.add('hidden');busy=false;
  st=from?Object.assign(fresh(),from,{idx:Math.max(0,from.idx-1),fx:null}):fresh();
  buildHud();setBg(st.bg);for(const k in CH)setSp(k,st.sp[k]);advance()}
$('#b-new').onclick=()=>start();
$('#b-cont').onclick=()=>{const s=load();s?start(s):alert('Todavía no hay partida guardada.')};
$('#b-about').onclick=()=>alert('Cosas que no te dije\nAriel Fáundez, IAvier Colque, Vicente Fraudebenito y Benjamín Churrasco.\nClic / Espacio / Enter para avanzar. Tus decisiones suben o bajan las barras de conexión.');
$('#b-menu').onclick=()=>show('#menu');$('#b-back').onclick=()=>show('#menu');$('#box').onclick=advance;
document.addEventListener('keydown',e=>{if((e.key===' '||e.key==='Enter')&&!$('#stage').classList.contains('hidden')&&!busy&&document.activeElement.tagName!=='BUTTON'){e.preventDefault();advance()}});
