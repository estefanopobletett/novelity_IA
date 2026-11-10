const $=s=>document.querySelector(s);
const SAVE='cosas_que_no_te_dije_v3',META='cosas_que_no_te_dije_meta';
const CH={a:['ariel','Ariel'],v:['vicente','Vicente'],b:['benjamin','Benjamín'],i:['iavier','IAvier'],f:['fernando','Fernando']};
const WHO={Ariel:'a',Vicente:'v','Benjamín':'b',IAvier:'i',Fernando:'f'};
const PITCH={a:520,v:330,b:250,i:430,f:290};
const BARS={i:'IAvier ♥',v:'Vicente',b:'Benjamín',f:'Fernando'};
const CHAP={start:['Capítulo 1','Un casillero y un plan'],club:['Capítulo 2','El club y el mejor amigo'],biblio:['Capítulo 3','El cuaderno'],feria:['Capítulo 4','La feria'],fernando:['Capítulo 5','Un rival muy simpático'],lluvia:['Capítulo 6','Lluvia de viernes'],grupo:['Capítulo 7','Operación Hola'],noche:['Capítulo 8','Una noche difícil'],ultimo_dia:['Capítulo 9','El último día'],cuaderno:['Capítulo 10','El cuaderno perdido'],azotea:['Capítulo 11','La azotea']};
const BGM={hall:'day',classroom:'day',roof:'day',night:'night',black:'night',sunset:'warm',beso:'warm'};
const TINT={night:'#14286e55',sunset:'#ff7a5a26',beso:'#ff8ac433'};
const ENDS=Object.values(STORY).flat().filter(n=>n.end).map(n=>n.end);
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}};
let M=ld(META,{});M.set=Object.assign({mus:.6,sfx:.7,spd:50,d3:1,fx:1},M.set);M.ends=M.ends||{};M.ach=M.ach||{};M.pn=M.pn||'Ariel Fáundez';
const sv=()=>{try{localStorage.setItem(META,JSON.stringify(M))}catch(e){}};
const cnt=()=>ENDS.filter(e=>M.ends[e]).length;
const nm=t=>{const p=(M.pn||'Ariel Fáundez').split(' '),F=p[0],full=M.pn||'Ariel Fáundez';return t.replace(/Ariel Fáundez/g,full).replace(/Ariel/g,F)};
const ACH=[['inicio','🌸','Primer capítulo','Empieza una partida'],['nombre','✏️','Con mi nombre','Elige un nombre propio para el protagonista'],['valiente','🦁','Valiente','Atrévete a hablar cuando da miedo'],['equipo','🤝','Todo el elenco','Conoce a los cuatro personajes en una partida'],['corazon','💖','Corazón lleno','Llega al 80% de conexión con IAvier'],['amistad','🫶','Amigo de fierro','Llega al 60% de conexión con Vicente'],['glitch','📡','Se me trabó','Quédate sin palabras'],['lector','📖','Memoria de elefante','Abre el historial'],['poeta','✒️','Poeta','Completa el minijuego de poemas'],['perfecto','💎','Sin errores','Poema perfecto: 4 palabras sin un solo fallo'],['rayo','⚡','Dedos de rayo','Completa una palabra en menos de 2,2 segundos'],['combo','🔥','Combo x10','Encadena 10 letras seguidas sin fallar'],['final1','🌅','Primer final','Descubre 1 final'],['final3','🌇','Tres caminos','Descubre 3 finales'],['finales','🏆','Todos los finales','Descubre todos los finales'],['platino','👑','PLATINO','Consigue todos los demás logros']];
function ach(id){if(M.ach[id])return;const a=ACH.find(x=>x[0]===id);if(!a)return;M.ach[id]=1;sv();S.ach();const pl=id==='platino',t=document.createElement('div');t.className='toast'+(pl?' plat':'');t.innerHTML=`<b>${a[1]}</b><span><small>${pl?'¡TROFEO DE PLATINO!':'Logro desbloqueado'}</small>${a[2]}</span>`;$('#toasts').appendChild(t);setTimeout(()=>t.remove(),4300);if(pl){burst(true);flash('#ffe9a0')}
  if(!pl&&ACH.slice(0,-1).every(x=>M.ach[x[0]]))setTimeout(()=>ach('platino'),1400)}
const achN=()=>Object.keys(M.ach).length+'/'+ACH.length;
const flash=c=>{const f=$('#flash');f.style.background=c;f.classList.remove('on');void f.offsetWidth;f.classList.add('on')};
const shk=()=>{const e=$('#game');e.classList.add('shake');setTimeout(()=>e.classList.remove('shake'),900)};
const dly=()=>Math.max(4,55-M.set.spd*.5);
let st,typing=null,full='',busy=false,waiting=false,auto=false,skip=false,tm,cur='bgA',mood='day',theme='p',ci=0;
/* ---------- AUDIO (procedural) ---------- */
let AC,MG,SG;
const MOODS={day:[[262,330,392,494],[220,262,330,392],[175,220,262,330],[196,247,294,392]],night:[[220,262,330],[175,220,262],[196,233,294],[165,196,247]],warm:[[262,330,392,523],[294,349,440,523],[220,277,330,440],[196,262,330,392]]};
function ainit(){if(AC){AC.state==='suspended'&&AC.resume();return}try{AC=new(window.AudioContext||window.webkitAudioContext)();MG=AC.createGain();SG=AC.createGain();MG.connect(AC.destination);SG.connect(AC.destination);vol();setInterval(pad,3600);pad()}catch(e){AC=null}}
function vol(){if(AC){MG.gain.value=M.set.mus*.5;SG.gain.value=M.set.sfx}}
function tone(f,d,ty,v,dl,dest){if(!AC)return;const t=AC.currentTime+(dl||0),o=AC.createOscillator(),g=AC.createGain();o.type=ty||'sine';o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+Math.min(.02,d/3));g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(dest||SG);o.start(t);o.stop(t+d+.05)}
function pad(){if(!AC||!M.set.mus||document.hidden)return;const c=MOODS[mood][ci++%4],t=AC.currentTime;
  c.forEach((f,i)=>{const o=AC.createOscillator(),g=AC.createGain();o.type=i?'sine':'triangle';o.frequency.value=i?f:f/2;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.09,t+1.4);g.gain.linearRampToValueAtTime(0,t+4.4);o.connect(g);g.connect(MG);o.start(t);o.stop(t+4.5)});
  for(let k=0;k<4;k++)tone(c[Math.floor(Math.random()*c.length)]*2,.9,'sine',.05,k*.9,MG)}
const S={blip:p=>tone(p*(.9+Math.random()*.2),.05,'square',.025),click:()=>tone(500,.06,'triangle',.1),ok:()=>{tone(660,.12,'triangle',.12);tone(880,.18,'triangle',.1,.08)},heart:()=>{tone(523,.2,'sine',.15);tone(784,.3,'sine',.15,.12)},sad:()=>{tone(330,.25,'sine',.12);tone(247,.4,'sine',.12,.15)},card:()=>[392,494,587,784].forEach((f,i)=>tone(f,.8,'sine',.1,i*.12)),glitch:()=>{for(let k=0;k<6;k++)tone(100+Math.random()*900,.06,'sawtooth',.05,k*.04)},end:()=>[523,659,784,1047].forEach((f,i)=>tone(f,1.2,'sine',.12,i*.2)),ach:()=>[784,988,1175,1568].forEach((f,i)=>tone(f,.5,'triangle',.12,i*.09)),bad:()=>{tone(180,.18,'sawtooth',.08);tone(130,.25,'sawtooth',.08,.08)},tick:n=>tone(420+Math.min(n,14)*45,.1,'triangle',.11)};
/* ---------- PARTÍCULAS ---------- */
const cv=$('#fx'),cx=cv.getContext('2d');let P=[],W=0,H=0;
function rs(){W=cv.width=cv.clientWidth;H=cv.height=cv.clientHeight}
function spawn(o){P.push(Object.assign({x:Math.random()*W,y:-10,vx:.3+Math.random(),vy:.5+Math.random()*.8,s:4+Math.random()*5,r:Math.random()*6,t:'p',a:0},o))}
function spark(x,y,n){for(let k=0;k<n;k++)spawn({t:'s',x,y,vx:(Math.random()-.5)*7,vy:(Math.random()-.5)*7-1.5,s:3+Math.random()*5})}
function burst(all){for(let k=0;k<(all?40:12);k++)spawn({t:'h',x:all?Math.random()*W:W*.04+Math.random()*W*.2,y:all?H*(.5+Math.random()*.5):H*.1,vx:(Math.random()-.5)*3,vy:-1-Math.random()*(all?4:2),s:12+Math.random()*14})}
function loop(){requestAnimationFrame(loop);if(!W)return;cx.clearRect(0,0,W,H);
  const n=P.filter(p=>p.t!=='h'&&p.t!=='s').length;
  if(M.set.fx&&Math.random()<.08&&n<30)theme==='n'?spawn({t:'f',x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,s:2+Math.random()*2}):spawn();
  P=P.filter(p=>{p.x+=p.vx+(p.t==='p'?Math.sin(p.y/40+p.r)*.6:0);p.y+=p.vy;p.r+=.03;p.a++;if(p.t==='h'||p.t==='s')p.vy+=.05;
    const al=p.t==='s'?Math.max(0,1-p.a/30):p.t==='h'?Math.max(0,1-p.a/80):p.t==='f'?Math.sin(p.a/30)**2*.8:.55;cx.globalAlpha=al;
    if(p.t==='h'){cx.font=p.s+'px sans-serif';cx.fillStyle='#ff5aa8';cx.fillText('♥',p.x,p.y)}
    else if(p.t==='s'){cx.fillStyle='#ffe066';cx.save();cx.translate(p.x,p.y);cx.rotate(p.r*3);cx.fillRect(-p.s/2,-p.s/2,p.s,p.s);cx.restore()}else{cx.fillStyle=p.t==='f'?'#ffe9a0':'#ffc2de';cx.beginPath();cx.ellipse(p.x,p.y,p.s,p.s*.55,p.r,0,7);cx.fill()}
    return p.y<H+20&&p.a<(p.t==='s'?30:p.t==='h'?80:p.t==='f'?400:2000)&&p.x>-30&&p.x<W+30})}
/* ---------- JUEGO ---------- */
const fresh=()=>({label:'start',idx:0,fx:null,bg:'black',conn:{i:10,v:30,b:0,f:0},met:{i:0,v:0,b:0,f:0},sp:{a:null,v:null,b:null,i:null,f:null},fl:{},log:[]});
const save=()=>{try{localStorage.setItem(SAVE,JSON.stringify(st))}catch(e){}};
const load=()=>ld(SAVE,null);
const go=fn=>{$('#fade').classList.add('on');setTimeout(()=>{fn();$('#fade').classList.remove('on')},450)};
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.add('hidden'));$(id).classList.remove('hidden');rs();if(id==='#menu'){$('#b-cont').disabled=!load();$('#ecount').textContent=cnt()+'/'+ENDS.length;$('#acount').textContent=achN();mood='day';theme='p'}}
function apply(){$('#game').classList.toggle('no3d',!M.set.d3)}
function sync(){$('#b-auto').classList.toggle('act',auto);$('#b-skip').classList.toggle('act',skip)}
function buildHud(){$('#hud').innerHTML=Object.keys(BARS).map(k=>`<div class="bar ${k==='i'?'main':''}" id="bar-${k}"><span>${BARS[k]} <b class="pc">0%</b></span><div class="tr"><div class="fl"></div></div></div>`).join('');renderHud()}
function renderHud(){for(const k in BARS){const b=$('#bar-'+k);b.classList.toggle('hide',!st.met[k]);b.querySelector('.fl').style.width=st.conn[k]+'%';b.querySelector('.pc').textContent=st.conn[k]+'%'}}
function bump(fx){let up=0,dn=0,h=0;for(const k in fx){const old=st.conn[k];st.conn[k]=Math.max(0,Math.min(100,old+fx[k]));const d=st.conn[k]-old;
  if(d&&st.met[k]){const b=$('#bar-'+k),s=document.createElement('span');s.className='d '+(d>0?'pos':'neg');s.textContent=(d>0?'+':'')+d;b.appendChild(s);setTimeout(()=>s.remove(),1400);b.classList.remove('beat');void b.offsetWidth;b.classList.add('beat');d>0?up++:dn++;if(k==='i'&&d>0)h=1}}
  renderHud();if(h){S.heart();burst();flash('#ff8ac4')}else if(up){S.ok();flash('#ffffff')}else if(dn){S.sad();shk()}if(st.conn.i>=80)ach('corazon');if(st.conn.v>=60)ach('amistad')}
function setSp(k,ex){const el=$('#spr-'+k),was=st.sp[k];st.sp[k]=ex;if(!ex){el.classList.add('off');return}
  el.src=`images/characters/${CH[k][0]}_${ex}.svg`;el.classList.remove('off','in','pop');void el.offsetWidth;el.classList.add(was?'pop':'in')}
function setBg(n){st.bg=n;const nx=cur==='bgA'?'bgB':'bgA',e=$('#'+nx);e.style.backgroundImage=`url(images/bg/${n}.svg)`;e.classList.add('on');$('#'+cur).classList.remove('on');cur=nx;
  mood=BGM[n]||'day';theme=mood==='night'?'n':'p';$('#tint').style.background=TINT[n]||'transparent'}
function say(who,t){const bx=$('#box');bx.classList.remove('pulse');void bx.offsetWidth;bx.classList.add('pulse');
  $('#name').textContent=nm(who||'');bx.classList.toggle('narr',!who);const sp=WHO[who];
  for(const k in CH){const e=$('#spr-'+k);e.classList.toggle('dim',!!who&&sp!==k);e.classList.toggle('talk',!!who&&sp===k)}
  const tx=$('#text');tx.className=st.fx==='glitch'?'glitch':'';if(st.fx==='glitch'){S.glitch();ach('glitch')}
  if(st.fx==='shake'){$('#game').classList.add('shake');setTimeout(()=>$('#game').classList.remove('shake'),900)}
  st.fx=null;full=nm(t);st.log.push([nm(who||''),full]);if(st.log.length>80)st.log.shift();
  tx.textContent='';let i=0;$('#next').style.visibility='hidden';clearInterval(typing);
  typing=setInterval(()=>{i+=skip?3:1;tx.textContent=full.slice(0,i);if(i%2===0&&sp)S.blip(PITCH[sp]);if(i>=full.length)finish()},skip?8:dly())}
function finish(){clearInterval(typing);typing=null;$('#text').textContent=full;$('#next').style.visibility='visible';waiting=true;clearTimeout(tm);
  if(skip)tm=setTimeout(()=>{waiting&&!busy&&advance()},70);else if(auto)tm=setTimeout(()=>{waiting&&!busy&&advance()},1000+full.length*45)}
function jump(l){st.label=l;st.idx=0;const c=CHAP[l];if(!c)return false;busy=true;skip=false;sync();
  const k=$('#card');k.innerHTML=`<small>${c[0]}</small><h2>${c[1]}</h2>`;k.classList.add('on');S.card();flash('#ffffff');
  setTimeout(()=>{k.classList.remove('on');busy=false;advance()},2800);return true}
function advance(){
  clearTimeout(tm);if(typing){finish();return}
  if(busy)return;waiting=false;
  while(true){
    const n=STORY[st.label][st.idx++];if(!n)return;
    let h=false;for(const k of ['a','v','b','i','f'])if(k in n){setSp(k,n[k]);h=true}
    if(h)continue;
    if(n.bg){setBg(n.bg);continue}
    if(n.meet){st.met[n.meet]=1;renderHud();if(['i','v','b','f'].every(k=>st.met[k]))ach('equipo');continue}
    if(n.bar){bump(n.bar);continue}
    if(n.fx){st.fx=n.fx;continue}
    if(n.fl){st.fl[n.fl]=1;continue}
    if(n.go){if(jump(n.go))return;continue}
    if(n.ifc){const [k,min,hi,lo]=n.ifc;if(jump(st.conn[k]>=min?hi:lo))return;continue}
    if(n.ifl){const [k,y,no]=n.ifl;if(jump(st.fl[k]?y:no))return;continue}
    if(n.end){ending(n);return}
    if(n.t){say(n.w,n.t);save();return}
    if(n.c){choose(n.c);return}
    if(n.poem){poem();return}}}
function choose(opts){busy=true;skip=false;sync();const box=$('#choices');box.innerHTML='';
  opts.forEach(([t,l,fx],n)=>{const b=document.createElement('button');const eff=fx?Object.keys(fx).filter(k=>BARS[k]&&fx[k]&&st.met[k]).map(k=>`<em class="${fx[k]>0?'pos':'neg'}">${BARS[k].replace(' ♥','')} ${fx[k]>0?'+':''}${fx[k]}%</em>`).join(''):'';b.innerHTML=(n+1)+'. '+nm(t).replace(/</g,'&lt;')+(eff?`<span class="fxs">${eff}</span>`:'');
    b.onclick=()=>{S.ok();if(l==='lap_habla'||l==='confesar')ach('valiente');box.innerHTML='';busy=false;if(fx)bump(fx);if(!jump(l))advance()};box.appendChild(b)});box.firstChild.focus()}
const nrm=c=>c.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
function poem(){busy=true;skip=false;sync();const p=$('#poem');p.classList.remove('hidden');
  const ws=WORDS.filter(w=>w[1]>0).sort(()=>Math.random()-.5).slice(0,4);
  let wi=0,score=0,miss=0,combo=0,line=[],T,left,tot,pos,L,wm,word;
  const cb=()=>{const e=p.querySelector('.cb');e&&(e.textContent=combo>1?'🔥 x'+combo:'')};
  const kd=e=>{if(!/^\p{L}$/u.test(e.key)||e.ctrlKey||e.metaKey||e.altKey)return;e.preventDefault();e.stopPropagation();press(e.key,null)};
  function press(ch,btn){if(wi>=4||!L||pos>=L.length||left<=0)return;const ok=nrm(ch)===nrm(L[pos]);
    btn=btn||[...p.querySelectorAll('.words button:not(:disabled)')].find(x=>nrm(x.textContent)===nrm(ch));
    if(ok&&btn){btn.disabled=true;btn.classList.add('ok');p.querySelectorAll('.slots i')[pos].textContent=L[pos];pos++;combo++;S.tick(combo);
      const r=btn.getBoundingClientRect(),c=cv.getBoundingClientRect();spark(r.left-c.left+r.width/2,r.top-c.top,10);cb();if(combo>=10)ach('combo');if(pos===L.length)fin()}
    else{wm++;miss++;combo=0;S.bad();p.classList.remove('bad');void p.offsetWidth;p.classList.add('bad');cb()}}
  function fin(){clearInterval(T);if(tot-left<2.2)ach('rayo');score+=Math.max(1,4+left/tot*4-wm*1.5);line.push(word);wi++;S.ok();flash('#ffffff');setTimeout(next,550)}
  function next(){if(wi>=4)return end();word=ws[wi][0];L=[...word];pos=0;wm=0;tot=left=7+L.length*1.6;const o=L.map((c,i)=>i).sort(()=>Math.random()-.5);
    p.innerHTML=`<h3>Verso ${wi+1}/4 · ¡toca las letras en orden!</h3><div class="line">${line.join(' · ')||'…'}</div><div class="slots">${L.map(()=>'<i></i>').join('')}</div><div class="pt"><div></div></div><div class="words">${o.map(i=>`<button>${L[i]}</button>`).join('')}</div><div class="cb"></div>`;
    p.querySelectorAll('.words button').forEach(b=>b.onclick=()=>press(b.textContent,b));cb();
    clearInterval(T);T=setInterval(()=>{left-=.05;p.querySelector('.pt div').style.width=Math.max(0,left/tot*100)+'%';if(left<=0){clearInterval(T);combo=0;miss++;line.push('…');wi++;S.sad();shk();setTimeout(next,550)}},50)}
  function end(){document.removeEventListener('keydown',kd,true);const pts=Math.round(score*.75);
    p.innerHTML=`<h3>Tu poema</h3><div class="line">${line.join(' · ')}</div><div class="cb">${pts>0?'+'+pts+' ♥':'…'}</div>`;pts>0&&(S.heart(),burst());
    setTimeout(()=>{p.classList.add('hidden');busy=false;bump({i:pts});ach('poeta');if(!miss)ach('perfecto');advance()},1800)}
  document.addEventListener('keydown',kd,true);next()}
function ending(n){clearInterval(typing);clearTimeout(tm);skip=auto=false;sync();const first=!M.ends[n.end];M.ends[n.end]=1;sv();if(cnt()>=1)ach('final1');if(cnt()>=3)ach('final3');if(cnt()>=ENDS.length)ach('finales');
  $('#fade').classList.add('on');
  setTimeout(()=>{$('#end-t').textContent=n.end;$('#end-d').textContent=nm(n.t);
    $('#end-s').innerHTML=Object.keys(BARS).filter(k=>st.met[k]).map(k=>`<div>${BARS[k]} ${st.conn[k]}%<div class="tr"><div class="fl" data-w="${st.conn[k]}"></div></div></div>`).join('');
    $('#end-n').textContent=(first?'✦ ¡Final nuevo! ':'')+'Finales descubiertos: '+cnt()+'/'+ENDS.length;
    show('#end');S.end();$('#fade').classList.remove('on');
    setTimeout(()=>document.querySelectorAll('#end-s .fl').forEach(f=>f.style.width=f.dataset.w+'%'),150);
    if(/beso|sí te dije|Equipo|Tiempo/.test(n.end))burst(true);
    try{localStorage.removeItem(SAVE)}catch(e){}},500)}
function start(from){ainit();go(()=>{ach('inicio');if(M.pn!=='Ariel Fáundez')ach('nombre');show('#stage');$('#choices').innerHTML='';$('#poem').classList.add('hidden');busy=false;auto=skip=false;sync();
  st=from?Object.assign(fresh(),from,{idx:Math.max(0,from.idx-1),fx:null}):fresh();if(from)st.log.pop();
  buildHud();setBg(st.bg);for(const k in CH)setSp(k,st.sp[k]);from?advance():(jump('start')||advance())})}
/* ---------- MODALES ---------- */
const closeM=()=>$('#modal').classList.add('hidden');
function modal(h){const m=$('#mc');m.innerHTML=h+'<p style="text-align:center;margin-top:1em"><button id="mx">Cerrar</button></p>';$('#modal').classList.remove('hidden');$('#mx').onclick=()=>{S.click();closeM()};$('#mx').focus();return m}
function settings(){const m=modal('<h3>Ajustes</h3>'+[['mus','Música',0,1,.05],['sfx','Efectos y voces',0,1,.05],['spd','Velocidad del texto',0,100,5]].map(([k,l,a,b,s])=>`<div class="set"><label>${l}</label><input type="range" id="s-${k}" min="${a}" max="${b}" step="${s}" value="${M.set[k]}"></div>`).join('')+
  `<div class="set"><label><span>Efecto 3D / parallax</span><input type="checkbox" id="s-d3" ${M.set.d3?'checked':''}></label></div><div class="set"><label><span>Partículas</span><input type="checkbox" id="s-fx" ${M.set.fx?'checked':''}></label></div><div class="set"><button id="s-fs">Pantalla completa</button> <button id="s-del">Borrar progreso</button></div>`);
  ['mus','sfx','spd'].forEach(k=>m.querySelector('#s-'+k).oninput=e=>{M.set[k]=+e.target.value;sv();vol();S.click()});
  ['d3','fx'].forEach(k=>m.querySelector('#s-'+k).onchange=e=>{M.set[k]=+e.target.checked;sv();apply()});
  m.querySelector('#s-fs').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{});
  m.querySelector('#s-del').onclick=()=>{if(confirm('¿Borrar partida guardada y finales descubiertos?')){try{localStorage.removeItem(SAVE);localStorage.removeItem(META)}catch(e){}location.reload()}}}
const gallery=()=>modal(`<h3>Finales (${cnt()}/${ENDS.length})</h3>`+ENDS.map(e=>`<div class="en ${M.ends[e]?'':'lock'}">${M.ends[e]?'♥ '+e:'🔒 ???'}</div>`).join('')+'<p style="margin-top:.8em;font-size:.85em">Tus decisiones, tus amistades y ser sincero cambian el final.</p>');
const log=()=>{ach('lector');modal('<h3>Historial</h3>'+st.log.map(([w,t])=>`<div class="lg">${w?'<b>'+w+':</b> '+t:'<i>'+t+'</i>'}</div>`).join(''));$('#mc').scrollTop=1e5};
const about=()=>modal('<h3>Cosas que no te dije</h3><p>Ariel Fáundez, IAvier Colque, Vicente Fraudebenito, Benjamín Churrasco y Fernando Fernández.</p><p style="margin-top:.6em"><b>Controles:</b> clic / Espacio / Enter avanzan · 1-2-3 eligen · A auto · S saltar · L historial · Esc ajustes.</p><p style="margin-top:.6em">Tus decisiones suben o bajan las barras de conexión. Hay '+ENDS.length+' finales.</p>');
const lvl=v=>v>=80?'Corazón enorme':v>=60?'Muy cercanos':v>=40?'Amistad':v>=20?'Conocidos':'Distantes';
const aff=()=>modal('<h3>Afecto de los personajes</h3>'+Object.keys(BARS).map(k=>st.met[k]?`<div class="af"><b>${BARS[k]}</b> ${st.conn[k]}% · <small>${lvl(st.conn[k])}</small><div class="tr"><div class="fl" style="width:${st.conn[k]}%"></div></div></div>`:`<div class="af lock">🔒 ??? <small>Aún no lo conoces</small></div>`).join('')+'<p style="font-size:.85em">Cada decisión muestra cuánto sube o baja el cariño.</p>');
const achModal=()=>modal(`<h3>Logros (${achN()})</h3>`+ACH.map(([id,i,t,d])=>`<div class="en ach ${M.ach[id]?'':'lock'} ${id==='platino'?'plat':''}">${M.ach[id]?i:'🔒'} <b>${t}</b><br><small>${d}</small></div>`).join(''));
function nameModal(){const m=modal(`<h3>¿Cómo se llama el protagonista?</h3><p style="margin:.6em 0">Nombre y apellido:</p><input id="pn" maxlength="24" value="${M.pn}" style="width:100%;font:inherit;padding:.4em;border:3px solid #ff9ccc;border-radius:6px"><p style="text-align:center;margin-top:.8em"><button id="pgo">Comenzar ♥</button></p>`);
  const inp=m.querySelector('#pn');inp.focus();inp.select();
  const okk=()=>{M.pn=inp.value.replace(/[<>&"'`]/g,'').trim().replace(/\s+/g,' ')||'Ariel Fáundez';sv();closeM();start()};
  m.querySelector('#pgo').onclick=okk;inp.onkeydown=e=>{if(e.key==='Enter')okk()}}
/* ---------- EVENTOS ---------- */
$('#b-new').onclick=nameModal;$('#b-ach').onclick=achModal;
$('#b-cont').onclick=()=>{const s=load();s&&start(s)};
$('#b-end').onclick=gallery;$('#b-set').onclick=settings;$('#b-about').onclick=about;
$('#b-menu').onclick=()=>go(()=>show('#menu'));$('#b-back').onclick=()=>go(()=>show('#menu'));$('#b-retry').onclick=()=>start();
$('#b-auto').onclick=()=>{auto=!auto;sync();if(auto&&waiting&&!typing)finish()};
$('#b-skip').onclick=()=>{skip=!skip;sync();if(skip&&(typing||waiting)){typing?finish():finish()}};
$('#b-log').onclick=log;$('#b-aff').onclick=aff;$('#b-opt').onclick=settings;$('#box').onclick=advance;
document.addEventListener('pointerdown',e=>{ainit();if(W){const r=cv.getBoundingClientRect();spark(e.clientX-r.left,e.clientY-r.top,7)}});
document.addEventListener('mousemove',e=>{const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5,g=$('#game').style;g.setProperty('--rx',(-y*3).toFixed(2)+'deg');g.setProperty('--ry',(x*4).toFixed(2)+'deg');g.setProperty('--mx',x.toFixed(3));g.setProperty('--my',y.toFixed(3))});
document.addEventListener('keydown',e=>{const k=e.key;
  if(!$('#modal').classList.contains('hidden')){if(k==='Escape')closeM();return}
  if($('#stage').classList.contains('hidden'))return;
  if(/^[1-9]$/.test(k)){const b=$('#choices').children[k-1];b&&b.click();return}
  if(k==='a'||k==='A'){$('#b-auto').click();return}
  if(k==='s'||k==='S'){$('#b-skip').click();return}
  if(k==='l'||k==='L'){log();return}if(k==='c'||k==='C'){aff();return}
  if(k==='Escape'){settings();return}
  if((k===' '||k==='Enter')&&!busy&&document.activeElement.tagName!=='BUTTON'){e.preventDefault();advance()}});
addEventListener('resize',rs);addEventListener('load',rs);apply();show('#menu');loop();
