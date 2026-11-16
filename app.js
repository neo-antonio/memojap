// Duolingo-style answer sounds (Web Audio, no files). Called from fb(); toggle: S.sfx in Settings.
const SFX=(()=>{let c=null;const ac=()=>{try{if(!c){const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;c=new A()}if(c.state==='suspended')c.resume();return c}catch(e){return null}};
const note=(c,f,t,d,ty,v,lp)=>{const o=c.createOscillator(),o2=c.createOscillator(),g=c.createGain(),g2=c.createGain(),F=c.createBiquadFilter();o.type=ty;o2.type='sine';o.frequency.value=f;o2.frequency.value=f*2;F.type='lowpass';F.frequency.value=lp;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+d);g2.gain.value=.25;o.connect(g);o2.connect(g2);g2.connect(g);g.connect(F);F.connect(c.destination);o.start(t);o2.start(t);o.stop(t+d+.05);o2.stop(t+d+.05)};
return{ok(){const x=ac();if(!x)return;const t=x.currentTime+.01;note(x,784,t,.28,'triangle',.22,6e3);note(x,1046.5,t+.09,.3,'triangle',.22,6e3);note(x,1318.5,t+.18,.55,'triangle',.24,7e3)},
bad(){const x=ac();if(!x)return;const t=x.currentTime+.01;note(x,277,t,.22,'square',.12,900);note(x,208,t+.16,.42,'square',.12,800)}}})();
const ic=n=>`<img class=ic src="${EMO[n]}" alt="">`;
const vt=f=>document.startViewTransition&&!matchMedia('(prefers-reduced-motion:reduce)').matches?document.startViewTransition(f):f();
const $=s=>document.querySelector(s),M=$('#main');
const H=[..."あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ"];
const R="a i u e o ka ki ku ke ko sa shi su se so ta chi tsu te to na ni nu ne no ha hi fu he ho ma mi mu me mo ya yu yo ra ri ru re ro wa wo n ga gi gu ge go za ji zu ze zo da ji zu de do ba bi bu be bo pa pi pu pe po".split(' ');
const K=H.map(c=>String.fromCharCode(c.charCodeAt(0)+96));
const CUR=[['日本','にほん','Japan','日 reads に here'],['学生','がくせい','student',''],['先生','せんせい','teacher',''],['大人','おとな','adult','Irregular: 大 → おと'],['今日','きょう','today','Special reading, not いま+ひ'],['日曜日','にちようび','Sunday','日 → にち'],['火曜日','かようび','Tuesday',''],['水曜日','すいようび','Wednesday',''],['山','やま','mountain',''],['川','かわ','river',''],['水','みず','water',''],['木','き','tree',''],['人','ひと','person','In 日本人 it reads じん'],['日本人','にほんじん','Japanese person','人 → じん'],['口','くち','mouth',''],['目','め','eye',''],['本','ほん','book',''],['月','つき','moon','']].map(a=>({w:a[0],r:a[1],m:a[2],n:a[3]}));
const KM=Object.fromEntries(KJ.map(k=>[k[0],k]));const fixW=x=>{const K=c=>/[\u4e00-\u9fff]/.test(c);if(!K(x.w)&&[...x.r].some(K))[x.w,x.r]=[x.r,x.w];if(x.r.length>2&&x.r.endsWith('する')&&!x.w.endsWith('する')){x.r=x.r.slice(0,-2);x.n=x.n||'する-verb noun'}return x};
const SEED=WORDS.map(a=>fixW({w:a[0],r:a[1],m:a[2],n:''}));
let S={xp:0,streak:0,last:'',day:'',today:0,goal:20,lv:'N5',cards:{},custom:[],ck:[],ckm:0,words:[...CUR],tts:true,sfx:true,filter:'all',theme:'auto',hist:{},newMax:10,revMax:100,nn:0,nd:''},T='cards',A='h',KD=null,RV=0,flip=0,Q=[],AS=null,KL='N5',RT=0,SX=0,PV=0,fresh=0,FI=null,PT=0,AN=null,OPK='',OPS=[],QC=[],SH=0,EM='flip',ALL=0,SQ='';
const INT=[0,1,2,4,8,16,32,64];
const td=(o=0)=>new Date(Date.now()-new Date().getTimezoneOffset()*6e4+o*864e5).toISOString().slice(0,10);
const esc=s=>String(s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const idb=new Promise(r=>{const q=indexedDB.open('memojap',1);q.onupgradeneeded=()=>q.result.createObjectStore('s');q.onsuccess=()=>r(q.result)});
const load=async()=>{const d=await idb;return new Promise(r=>{const q=d.transaction('s').objectStore('s').get('d');q.onsuccess=()=>r(q.result)})};
const save=async()=>{const d=await idb;d.transaction('s','readwrite').objectStore('s').put(S,'d')};
const toast=t=>{const e=$('#toast');e.textContent=t;e.className='on';setTimeout(()=>e.className='',1800)};
let CU=null;
const say=(t,el,force)=>{if(!(force||S.tts)||!window.speechSynthesis)return;const u=new SpeechSynthesisUtterance(t);u.lang='ja-JP';u.rate=+(el&&el.dataset.r)||1;CU=u;document.querySelectorAll('.vb.pl').forEach(b=>b.classList.remove('pl'));speechSynthesis.cancel();
 if(el){el.classList.add('pl');const off=()=>{if(CU===u)el.classList.remove('pl')};u.onend=u.onerror=off;setTimeout(off,8000)}try{speechSynthesis.speak(u)}catch(e){el?.classList.remove('pl')}};
// Duolingo-style speaker button: vb(text) = small, vb(text,'lg') = big with a slow-speed button underneath
const SPK='<svg class="vi" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9.5v5h4l5 4.5V5L7 9.5z" fill="currentColor"/><path class="w1" d="M15.5 9a4 4 0 0 1 0 6"/><path class="w2" d="M18 6.5a8 8 0 0 1 0 11"/></svg>';
const TUR='<svg class="vi tu" viewBox="0 -1 56.5 32" fill="currentColor" aria-hidden="true"><path d="M4 21C4 13 8 7.9 14.5 7.9C20.5 7.9 24.5 12.5 25 18.5Z"/><path d="M1.6 24.6L4 22.6L25 20.2L25 21.9L4 24.4Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><rect class="la" x="7" y="23" width="4.2" height="4.6" rx="1.6"/><rect class="lb" x="17.4" y="21.5" width="4.4" height="6.1" rx="1.6"/><path d="M25.8 19.4L29.8 15.2" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path fill-rule="evenodd" d="M26.8 14.4a3.8 3.8 0 1 0 7.6 0a3.8 3.8 0 1 0 -7.6 0Z"/><path class="w1" style="stroke-width:3.7" d="M38.4 7.6A7.1 7.1 0 0 1 38.4 21.4"/><path class="w2" style="stroke-width:3.7" d="M42.9 1.8A13.5 13.5 0 0 1 42.9 27.8"/></svg>';
const sayEl=b=>say(b.dataset.t,b,1);
const vb=(t,k='')=>window.speechSynthesis?`<span class="vg ${k=='lg'?'col':''}"><button class="vb ${k}" data-t="${esc(t)}" onclick="event.stopPropagation();sayEl(this)" aria-label="Play audio">${SPK}</button>${k=='lg'?`<button class="vb lg" data-t="${esc(t)}" data-r=".6" onclick="event.stopPropagation();sayEl(this)" aria-label="Play slowly">${TUR}</button>`:''}</span>`:'';
const hud=()=>{$('#hud').innerHTML=`<span class=hs>${ic('fire')}<b>${st()}</b></span><span class=hs><b class=xp>XP</b><b>${S.xp}</b></span>`};
const shuf=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[b[i],b[j]]=[b[j],b[i]]}return b};
let SB=null,AD=0,SD=1;
const isK=c=>/[\u4e00-\u9fff]/.test(c);
// Furigana: longest match from the word bank (okurigana-aware); unknown kanji get a dashed underline
const ROW={う:'いわっえおう',く:'きかいけこく',ぐ:'ぎがいげごぐ',す:'しさせそす',つ:'ちたってとつ',ぬ:'になんねのぬ',ぶ:'びばんべぼぶ',む:'みまんめもむ',る:'りらっれろるまてたなよさせ',い:'いかくけさ'};
const idx=()=>{if(FI)return FI;FI={};S.words.forEach(x=>{if([...x.w].some(isK)){let a=0,e=0;const w=x.w,r=x.r;while(a<w.length&&!isK(w[a])&&r[a]==w[a])a++;while(e<w.length-a-1&&!isK(w[w.length-1-e])&&r[r.length-1-e]==w[w.length-1-e])e++;x.a=a;x.e=e;(FI[w[0]]=FI[w[0]]||[]).push(x)}});for(const k in FI)FI[k].sort((a,b)=>b.w.length-a.w.length);return FI};
const rb=(x,tail=1)=>esc(x.w.slice(0,x.a))+`<ruby>${esc(x.w.slice(x.a,x.w.length-x.e))}<rt>${esc(x.r.slice(x.a,x.r.length-x.e))}</rt></ruby>`+(tail?esc(x.w.slice(x.w.length-x.e)):'');
// Conjugation: match the kanji core of a verb/adjective when the next kana is a valid inflection of its ending (買う → 買いました, 高い → 高かった)
const SURU=/^(する|すれ|し|さ[れせ]|せ[ずぬ]|でき)/;
// 愛する / 関する: する conjugates irregularly (し・さ・せ・す・でき), so it gets its own rule
function conj(x,t,i){const n=x.w.length-x.e;if(!x.e||!t.startsWith(x.w.slice(0,n),i))return 0;
 if(x.e==2&&x.w.endsWith('する')){const c=t[i+n];return c&&'しさせす'.includes(c)||t.startsWith('でき',i+n)?n:0}const tl=x.w.slice(n),L=tl.slice(0,-1),l=tl.slice(-1),j=i+n+L.length;return t.startsWith(L,i+n)&&t[j]&&(ROW[l]||'').includes(t[j])?n:0}
function furi(t){let o='',i=0;const I=idx();
 while(i<t.length){const c=I[t[i]]||[],ex=c.find(x=>t.startsWith(x.w,i));let cj=0,cx;c.forEach(x=>{const n=conj(x,t,i);if(n>cj){cj=n;cx=x}});
  if(cx&&(!ex||cj>=ex.w.length)){o+=rb(cx,0);i+=cj}
  else if(ex){o+=rb(ex);i+=ex.w.length}
  else if(isK(t[i])){let j=i+1;while(j<t.length&&isK(t[j])&&!(I[t[j]]||[]).some(x=>t.startsWith(x.w,j)))j++;
   const run=j-i>1&&SURU.test(t.slice(j))?t.slice(i,j):t[i];o+=`<span class=unk onclick="fixK('${run}')">${esc(run)}</span>`;i+=run.length}
  else{o+=esc(t[i]);i++}}return o}
const lk=u=>{try{return u?`<a href="${esc(u)}" target=_blank rel=noopener onclick="event.stopPropagation()">${ic('link')} ${esc(new URL(u).hostname)}</a>`:''}catch(e){return ''}};
function fixK(c){const r=prompt(`Reading for ${c}? (saved to your word bank${c.length>1?` – also works as ${c}する, ${c}した…`:''})`);if(r){const n=c.length>1?'する-verb noun':'',id=String(Date.now());S.ck.push({id,w:c,r:r.trim(),m:'',n});S.words.push({w:c,r:r.trim(),m:'',n,ck:id});FI=null;mig();save();render();toast('Saved to Custom kanji')}}
const alt=r=>[r,...({shi:['si'],chi:['ti'],tsu:['tu'],fu:['hu'],ji:['zi'],wo:['o']}[r]||[])];
const CKM=id=>S.ck.find(x=>x.id==id);
function card(id){const i=id.indexOf(':'),t=id.slice(0,i),x=id.slice(i+1);
 if(t=='h')return{f:H[x],b:R[x],say:H[x],a:R[x],acc:alt(R[x])};if(t=='k')return{f:K[x],b:R[x],say:K[x],a:R[x],acc:alt(R[x])};
 if(t=='j'){const k=KM[x];return{f:x,b:`${k[1]}<br>音 ${k[2]}<br>訓 ${k[3]}`,say:x,a:k[1].split(', ')[0],acc:k[1].toLowerCase().split(', ')}}
 if(t=='x'){const k=CKM(x);return k?{f:esc(k.w),w:k.w,rd:k.r,b:esc(k.r)+(k.m?'<br>'+esc(k.m):'')+(k.n?`<br><small>${esc(k.n)}</small>`:''),say:k.r,sm:[...k.w].length>4,a:k.m||k.r,acc:[k.r,(k.m||'').toLowerCase()].filter(Boolean)}:null}
 const c=S.custom.find(a=>a.id==x);return c?{f:furi(c.t),b:esc(c.m)+(c.s?`<br><small>${esc(c.s)}</small>`:'')+(c.u?'<br>'+lk(c.u):''),say:c.t,sm:c.t.length>6,a:c.m}:null}
const inF=id=>S.filter=='all'||(S.filter=='chars')==(id[0]!='c');
function dueIds(){const t=td(),nn=S.nd==t?S.nn:0,ok=k=>card(k)&&inF(k),K=Object.keys(S.cards);
 const rv=K.filter(k=>S.cards[k].r&&S.cards[k].d<=t&&ok(k)).sort((a,b)=>S.cards[a].d<S.cards[b].d?-1:1).slice(0,S.revMax);
 return[...rv,...K.filter(k=>!S.cards[k].r&&ok(k)).slice(0,Math.max(0,S.newMax-nn))]}
function mig(){Object.values(S.cards).forEach(c=>{if(c.r===undefined)c.r=c.b>0?1:0;if(!c.i)c.i=INT[c.b||0];if(!c.e)c.e=2.5})}
function bump(){if(S.day!=td()){S.day=td();S.today=0}if(S.last!=td()){if(S.last&&S.last!=td(-1)&&S.streak>0)S.lost={n:S.streak,d:td()};S.streak=S.last==td(-1)?S.streak+1:1;S.last=td()}S.today++;S.hist[td()]=(S.hist[td()]||0)+1}
const st=()=>S.last==td()||S.last==td(-1)?S.streak:0;
// Avatar mood: amazed on milestones (30, 50, 100, 150, ... every 50, plus every 365), sad if a streak of 7+ days was lost, angry if a shorter one was, otherwise happy
function mood(){const c=st(),M=n=>n==30||(n>=50&&n%50==0)||(n>=365&&n%365==0);let l=0;if(!c&&S.streak>0&&S.last)l=S.streak;else if(S.lost&&S.lost.d==td())l=S.lost.n;
 if(c&&M(c))return['amazed',`${c} day streak! Amazing!`];if(l)return l>=7?['sad',`I miss your ${l} day streak...`]:['angry',`You lost your ${l} day streak!`];return['happy',c?'Keep it going!':'Ready to learn?']}
function addSet(){const ids=A=='h'?H.map((_,i)=>'h:'+i):A=='k'?K.map((_,i)=>'k:'+i):A=='x'?S.ck.map(x=>'x:'+x.id):KJ.filter(k=>k[5]==KL).map(k=>'j:'+k[0]);if(!ids.length)return toast('Add a custom kanji first');let n=0;
 ids.forEach(id=>{if(!S.cards[id]){S.cards[id]={b:0,d:td()};n++}});save();markIn();toast(n?n+' cards added to deck':'Already all in your deck')}
const ORD=['h','k','j','x'],LV=['N5','N4','N3','N2','N1'],AL={h:'Hiragana',k:'Katakana',j:'Kanji',x:'Custom'};
const segH=(id,L,cur,fn,lbl)=>`<div class=seg id=${id} style="--n:${L.length};--i:${L.indexOf(cur)}"><i class=pill></i>${L.map(k=>`<button class="${k==cur?'on':''}" onclick="${fn}('${k}')">${lbl?lbl[k]:k}</button>`).join('')}</div>`;
// kana are laid out in gojuon rows (a-i-u-e-o, ka-ki-ku-ke-ko ...); ya/yu/yo and wa/wo/n sit in columns 1, 3, 5
const GROW=[[0,5],[5,10],[10,15],[15,20],[20,25],[25,30],[30,35],[35,38],[38,43],[43,46],[46,51],[51,56],[56,61],[61,66],[66,71]];
const tileH=(id,c,r,n,col)=>`<div class="tile${S.cards[id]?' in':''}${SEL&&SEL.has(id)?' sel':''}${[...c].length>2?' w':''}" data-id="${id}" style="--k:${Math.min(n,24)}${col?`;grid-column:${col}`:''}" onclick="tapT(this,'${id}')"><b>${esc(c)}</b><small>${esc(r)}</small></div>`;
function gridH(){
 if(A=='x')return `<button class="btn alt" onclick="CKE='';render()">+ New custom kanji</button>`+(S.ck.length?`<div class=grid>${S.ck.map((x,n)=>tileH('x:'+x.id,x.w,x.r,n)).join('')}</div>`:`<p class=cred>Kanji and kanji combinations that aren't in the built-in list live here. Add one, or tap an underlined kanji inside a sentence to give it a reading.</p>`);
 if(A=='j'){const l=jList();return `<div class=grid>${l.slice(0,JN).map(jTile).join('')}</div><div id=jm>${moreH(l.length)}</div>`}
 const L=A=='h'?H:K;
 return `<div class=kgrid>${GROW.map(([a,b])=>`${a==46?'<div class=gl>Dakuten ゛</div>':a==66?'<div class=gl>Handakuten ゜</div>':''}<div class=krow>${L.slice(a,b).map((c,j)=>tileH(A+':'+(a+j),c,R[a+j],a+j,b-a==3?[1,3,5][j]:0)).join('')}</div>`).join('')}</div>`}
let SEL=null,DF='all',DQ='',DL=60;
// Kanji grid renders in batches so N2/N1 (hundreds of tiles) stay smooth
const JB=180;let JN=JB;
const jList=()=>KJ.filter(k=>k[5]==KL),jTile=(k,n)=>tileH('j:'+k[0],k[0],k[1].split(', ')[0],n);
const moreH=t=>t>JN?`<button class=kmore onclick="moreJ()">Show ${Math.min(JB,t-JN)} more<small>${JN} of ${t} shown</small></button>`:'';
function moreJ(){const l=jList(),a=JN,g=$('#gw .grid');if(!g)return;JN=Math.min(l.length,JN+JB);$('#gw').style.setProperty('--dir',0);g.insertAdjacentHTML('beforeend',l.slice(a,JN).map((k,n)=>jTile(k,n)).join(''));$('#jm').innerHTML=moreH(l.length)}
const tids=()=>A=='j'?jList().map(k=>'j:'+k[0]):[...document.querySelectorAll('#gw .tile')].map(t=>t.dataset.id);
function markIn(){document.querySelectorAll('#gw .tile').forEach((t,i)=>{const was=t.classList.contains('in'),now=!!S.cards[t.dataset.id];t.classList.toggle('in',now);t.classList.toggle('sel',!!(SEL&&SEL.has(t.dataset.id)));if(now&&!was){pop(t);t.style.animationDelay=Math.min(i,40)*12+'ms'}})}
// Select mode works on everything: tap any tiles, then add the ones that are new or remove the ones already in the deck
function tapT(el,id){if(SEL){SEL.has(id)?SEL.delete(id):SEL.add(id);el.classList.toggle('sel',SEL.has(id));return selBar()}
 pop(el);if(A=='h'||A=='k')return say(card(id).say);KD=A=='j'?id.slice(2):id;render()}
const allSel=()=>{const t=tids();return t.length>0&&t.every(id=>SEL.has(id))};
function selBar(){const e=$('#selbar');if(!e)return;document.body.classList.toggle('sm',!!SEL);const sb=$('#selbtn');if(sb)sb.textContent=SEL?'Cancel':'Select';
 if(!SEL){e.innerHTML='';return}
 const ids=[...SEL],na=ids.filter(i=>!S.cards[i]).length,nr=ids.length-na;
 e.innerHTML=`<span class=sc>${ids.length?ids.length+' selected':'Tap to select'}</span><button class="btn alt sm" onclick="selAll()">${allSel()?'Clear':'Select all'}</button>${na?`<button class="btn sm" onclick="addSel()">Add ${na}</button>`:''}${nr?`<button class="btn no sm" onclick="remSel()">Remove ${nr}</button>`:''}`}
function toggleSel(){SEL=SEL?null:new Set();markIn();selBar()}
function selAll(){if(allSel())SEL.clear();else tids().forEach(id=>SEL.add(id));markIn();selBar()}
function addSel(){let n=0;SEL.forEach(id=>{if(!S.cards[id]){S.cards[id]={b:0,d:td()};n++}});SEL=null;save();markIn();selBar();toast(n+' card'+(n==1?'':'s')+' added to deck')}
function remSel(){const ids=[...SEL].filter(id=>S.cards[id]);SEL=null;rmMany(ids,ids.length+' card'+(ids.length==1?'':'s')+' removed from deck');markIn();selBar()}
function addJ(c,b){const id='j:'+c;if(S.cards[id]){delete S.cards[id];b.textContent='+ Add kanji to deck';b.className='btn alt';toast('Removed from deck')}else{S.cards[id]={b:0,d:td()};b.textContent='Remove from deck';b.className='btn no';toast('Added to deck')}save()}
// Chips update in place so the highlight can slide and the grid can swipe in the direction you moved
function swChips(){const g=$('#gw');if(!g)return;
 [['sg1',ORD,A],['sg2',LV,KL]].forEach(([id,L,cur])=>{const e=$('#'+id),n=L.indexOf(cur);e.style.setProperty('--i',n);[...e.querySelectorAll('button')].forEach((b,k)=>b.classList.toggle('on',k==n))});
 $('#lvw').classList.toggle('open',A=='j');g.style.setProperty('--dir',SD>0?1:-1);g.innerHTML=gridH();selBar()}
function setA(k){if(k==A)return;SD=ORD.indexOf(k)-ORD.indexOf(A);A=k;swChips()}
function setKL(l){if(l==KL)return;SD=LV.indexOf(l)-LV.indexOf(KL);KL=l;JN=JB;swChips()}
const views={
alpha(){if(KD)return(KD.startsWith('x:')?xdetail(KD.slice(2)):kdetail(KD))+(CKE!==null?ckSheet():'');
 return segH('sg1',ORD,A,'setA',AL)+`<div class="lvw ${A=='j'?'open':''}" id=lvw><div><div style="margin-top:8px">${segH('sg2',LV,KL,'setKL')}</div></div></div>
 <div class=row2><button class=btn onclick="addSet()">+ Add all</button><button class="btn alt" id=selbtn onclick="toggleSel()">${SEL?'Cancel':'Select'}</button></div><div id=gw>${gridH()}</div><div id=selbar></div>${CKE!==null?ckSheet():''}`},
cards(){if(RV)return review();const due=dueIds(),i=Math.floor(Date.now()/864e5)%WORDS.length,dw={w:WORDS[i][0],r:WORDS[i][1],m:WORDS[i][2]},inD=S.custom.some(x=>x.t==dw.w);
 return `${S.name?`<h2 class=hi>Hello, ${esc(S.name)}!</h2>`:''}${lvl()}<div class=hero>${due.length}<small> to study</small><div style="font-size:14px;color:var(--s)">${due.filter(k=>!S.cards[k].r).length} new · ${due.filter(k=>S.cards[k].r).length} review</div><div class=row2><button class=btn onclick="startRev()" ${due.length?'':'disabled'}>Start review</button><button class="btn alt" onclick="startBuild()">Build sentences</button></div></div>
 
 <div class=card2><b>My deck</b> <small>${DK().length} cards · ${DK().filter(k=>!S.cards[k].r).length} new</small><div class=row2><button class="btn alt" onclick="go('deck')">View &amp; manage</button><button class=btn onclick="AD=1;render()">+ Add card</button></div></div>
 <div class=card2><small>Word of the day</small><div class=wd><div class=jp>${furi(dw.w)}</div>${vb(dw.w)}</div>${esc(dw.m)}<button class="btn alt" onclick="addC(${i})">${inD?'In deck':'+ Add to deck'}</button></div>
 ${forecast()}
 ${AD?addSheet():''}`},
prof(){const n=Object.keys(S.cards).length,m=Object.values(S.cards).filter(c=>(c.i||0)>=21).length;
 const[mo,mt]=mood();
 return `<div class=av><img src="img/${mo}.png" alt="" class="${mo=='amazed'?'bounce':''}"><div class=avt>${mt}</div></div><div class=hero>${ic('fire')} ${st()}<small> day streak</small></div><p><b>Today:</b> ${S.day==td()?S.today:0}/${S.goal} reviews</p><div class=bar><div style="width:${Math.min(100,(S.day==td()?S.today:0)/S.goal*100)}%"></div></div>
 <p>${S.xp} <b class=xp>XP</b> · ${ic('cards')} ${n} cards · ${ic('medal')} ${m} mastered</p><h3>Last 5 weeks</h3>${cal()}
 <h3 class=sh>Your name</h3><input maxlength=24 placeholder="What should we call you?" value="${esc(S.name||'')}" onchange="S.name=this.value.trim();save()">
 <h3 class=sh>My level</h3><div class=lvs id=lvs>${['Pre-N5','N5','N4','N3','N2','N1'].map(l=>`<button class="${S.lv==l?'on':''}" onclick="setLv('${l}')">${l}</button>`).join('')}</div>

 <button class=btn onclick="startTest()">Fluency check (N5–N1)</button>
 <button class="btn alt" onclick="chat()">Practice with ChatGPT</button>`},
set(){const on=k=>k=='sfx'?S.sfx!==false:!!S.tts,TH=['auto','light','dark'],
 sp=(k,l)=>`<div class=st><span>${l}</span><div class=sp><button onclick="stp('${k}',-1)" aria-label="Decrease">−</button><input type=number id=s_${k} value=${S[k]} min=${SM[k][0]} onchange="stSet('${k}',this.value)"><button onclick="stp('${k}',1)" aria-label="Increase">+</button></div></div>`,
 tg=(k,l,i)=>`<div class=tgc><button class="tg${on(k)?'':' off'}" aria-pressed=${on(k)} aria-label="${l}" onclick="tgl('${k}',this)">${i}<svg class=sl viewBox="0 0 24 24"><path class=o d="M4.5 4.5L19.5 19.5"/><path class=w d="M4.5 4.5L19.5 19.5"/></svg></button><span>${l}</span></div>`;
 return `<h3 class=sh>Study</h3>${sp('goal','Daily goal (reviews)')}${sp('newMax','New cards per day')}${sp('revMax','Max reviews per day')}
 <h3 class=sh>Sound</h3><div class=tgs>${tg('tts','Read cards aloud',SPK)}${tg('sfx','Sound effects','<svg class=vi viewBox="0 0 24 24"><path d="M9 18V6l10-2v12" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6.5" cy="18" r="3" fill="currentColor" stroke="none"/><circle cx="16.5" cy="16" r="3" fill="currentColor" stroke="none"/></svg>')}</div>
 <h3 class=sh>Appearance</h3>${segH('thm',TH,S.theme,'setTheme',{auto:'Auto',light:'Light',dark:'Dark'})}
 <h3 class=sh>Backup</h3><div class=row2><button class="btn alt" onclick="exp()">Export backup</button><button class="btn alt" onclick="$('#im').click()">Import backup</button></div><input id=im type=file accept=.json hidden onchange="imp(this.files[0])">
 <button class="btn dng" onclick="wipe()">Delete all data</button>
 <p class=cred>Stroke data: KanjiVG (CC BY-SA 3.0). Kanji: KANJIDIC (EDRDG, CC BY-SA 4.0). Word lists: JLPT lists by Jonathan Waller, via JMdict data.</p>`},
test(){if(AS.i>=QC.length){let l='Pre-N5';for(const x of['N5','N4','N3','N2','N1']){if(AS.sc[x]>=3)l=x;else break}
 return `<div class=hero>${l}<small> estimated</small></div><p>${['N5','N4','N3','N2','N1'].map(x=>`${x} ${AS.sc[x]}/5`).join(' · ')}</p><p>This is a rough estimate from a short quiz. It does not test listening or speaking.</p><button class=btn onclick="S.lv='${l}';save();go('prof')">Set as my level</button>`}
 const q=QC[AS.i];return `<small>${q[0]} · ${AS.i+1}/${QC.length}</small><div class=q>${q[1]}</div>${q[2].map((o,j)=>`<button class="btn opt" onclick="ans(${j},this)">${o}</button>`).join('')}`}};
// ---- Custom kanji: kanji / combinations that are not in the built-in kanji list
let CKE=null;
const ckSheet=()=>{const x=CKE?CKM(CKE):null;return `<div class=sheet onclick="ckClose()"><div onclick="event.stopPropagation()"><div class=rh style="justify-content:space-between"><h3 style="margin:0">${x?'Edit':'New'} custom kanji</h3><button class=ib onclick="ckClose()" aria-label="Close">${SYS.dismiss}</button></div>
 <div class=cred>For kanji or combinations that are missing from the built-in list. The reading also adds furigana to sentences.</div>
 <input id=cw autocomplete=off placeholder="Kanji or combination, e.g. 鬱" value="${esc(x?x.w:'')}"><input id=cr autocomplete=off placeholder="Reading in kana, e.g. うつ" value="${esc(x?x.r:'')}"><input id=cm autocomplete=off placeholder="Meaning (optional)" value="${esc(x?x.m:'')}"><textarea id=cn rows=2 placeholder="Notes (optional)">${esc(x?x.n:'')}</textarea>
 <button class=btn onclick="ckSave()">Save</button>${x?`<button class="btn no" onclick="ckDel('${x.id}')">Delete</button>`:''}</div></div>`};
function ckClose(){CKE=null;render()}
function ckSave(){const w=$('#cw').value.trim(),r=$('#cr').value.trim(),m=$('#cm').value.trim(),n=$('#cn').value.trim();if(!w||!r)return toast('Enter the kanji and its reading');
 let x=CKE?CKM(CKE):null;if(!x&&S.ck.some(y=>y.w==w))return toast('Already in Custom kanji');
 if(x){S.words=S.words.filter(v=>v.ck!=x.id);Object.assign(x,{w,r,m,n})}else{x={id:String(Date.now()),w,r,m,n};S.ck.push(x)}
 if(!S.words.some(v=>v.w==w&&v.r==r))S.words.push({w,r,m,n,ck:x.id});
 FI=null;CKE=null;save();render();toast('Saved')}
function ckDel(id){const x=CKM(id);if(!x)return;const cd=S.cards['x:'+id],ws=S.words.filter(v=>v.ck==id);S.ck=S.ck.filter(y=>y!=x);S.words=S.words.filter(v=>v.ck!=id);delete S.cards['x:'+id];FI=null;CKE=null;KD=null;save();render();
 undoBar('Custom kanji deleted',()=>{S.ck.push(x);S.words.push(...ws);if(cd)S.cards['x:'+id]=cd;FI=null;save();render()})}
function ckDeck(id,b){const k='x:'+id;if(S.cards[k]){delete S.cards[k];b.textContent='+ Add to deck';b.className='btn alt';toast('Removed from deck')}else{S.cards[k]={b:0,d:td()};b.textContent='Remove from deck';b.className='btn no';toast('Added to deck')}save()}
function xdetail(id){const x=CKM(id);if(!x){KD=null;return views.alpha()}
 const n=[...x.w].length,inD=!!S.cards['x:'+id],sp=n==1?(STK[x.w]||[]).map(d=>`<path d="${d}"/>`).join(''):'';
 return `<button class=link onclick="KD=null;render()">${SYS.back} Back</button><div class=kd><div class=big style="${n>2?`font-size:${Math.max(32,Math.floor(300/n))}px;line-height:1.2`:''}">${esc(x.w)}</div><h2>${esc(x.r)}</h2>${x.m?`<p>${esc(x.m)}</p>`:''}${x.n?`<p><small>${esc(x.n)}</small></p>`:''}</div>
 <div style="text-align:center;margin:8px 0">${vb(x.r,'lg')}</div>
 <div class=row2><button class="btn ${inD?'no':'alt'}" onclick="ckDeck('${id}',this)">${inD?'Remove from deck':'+ Add to deck'}</button><button class="btn alt" onclick="CKE='${id}';render()">Edit</button></div>
 ${sp?`<h3>Stroke order</h3><svg id=sv class=sv viewBox="0 0 109 109" onclick="play()">${sp}</svg><button class="btn alt" onclick="play()">${SYS.play} Play again</button><h3>Trace it</h3><div class=pad><svg class=guide viewBox="0 0 109 109">${sp}</svg><canvas id=cv width=300 height=300></canvas></div><button class="btn alt" onclick="clr()">Clear</button>`:''}`}
function migCk(){if(S.ckm)return;S.ckm=1;const sk=new Set([...SEED,...CUR].map(x=>x.w+x.r)),seen=new Set(S.ck.map(x=>x.w));
 S.words.forEach((x,i)=>{if(x.ck||sk.has(x.w+x.r)||seen.has(x.w)||!/[\u3400-\u4dbf\u4e00-\u9fff]/.test(x.w)||([...x.w].length==1&&KM[x.w]))return;seen.add(x.w);const id=String(Date.now()+i);x.ck=id;S.ck.push({id,w:x.w,r:x.r,m:x.m||'',n:x.n||''})});if(S.ck.length)save()}
function kdetail(c){const k=KM[c],ws=S.words.map((w,i)=>[w,i]).filter(([w])=>w.w.length>1&&w.w.includes(c)).slice(0,40),sp=(STK[c]||[]).map(d=>`<path d="${d}"/>`).join('');
 return `<button class=link onclick="KD=null;render()">${SYS.back} Back</button><div class=kd><div class=big>${c}</div><h2>${k[1]}</h2><p>音 ${k[2]}<br>訓 ${k[3]}<br><small>${k[4]} strokes · ${k[5]}</small></p></div><div style="text-align:center;margin:8px 0">${vb(c,'lg')}</div><button class="btn ${S.cards['j:'+c]?'no':'alt'}" onclick="addJ('${c}',this)">${S.cards['j:'+c]?'Remove from deck':'+ Add kanji to deck'}</button>
 <h3>Stroke order</h3><svg id=sv class=sv viewBox="0 0 109 109" onclick="play()">${sp}</svg><button class="btn alt" onclick="play()">${SYS.play} Play again</button>
 <h3>Trace it</h3><div class=pad><svg class=guide viewBox="0 0 109 109">${sp}</svg><canvas id=cv width=300 height=300></canvas></div><button class="btn alt" onclick="clr()">Clear</button>
 <h3>Compounds</h3>${ws.map(([w,i])=>{const d=S.custom.some(x=>x.t==w.w);return `<div class="row crow"><div><b class=jp>${furi(w.w)}</b> ${esc(w.m)}${w.n?`<br><small>${esc(w.n)}</small>`:''}</div><div class=ca>${vb(w.w)}<button class="btn alt cadd" ${d?'disabled':''} onclick="addW(${i},this)">${d?'In deck':'+ Add to deck'}</button></div></div>`}).join('')||'<p>None yet. Add one in Flash Cards.</p>'}`}
async function play(){const my=++PT,ps=[...document.querySelectorAll('#sv path')];ps.forEach(p=>{p.getAnimations().forEach(a=>a.cancel());const L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=L;p.style.opacity=0});
 for(const p of ps){if(my!=PT||!p.isConnected)return;const L=p.getTotalLength();p.style.opacity=1;await p.animate([{strokeDashoffset:L},{strokeDashoffset:0}],{duration:250+L*10,easing:'ease-in-out',fill:'forwards'}).finished}}
function pop(e){e.style.animationDelay='';e.classList.remove('p');void e.offsetWidth;e.classList.add('p')}
function fb(g,t){if(S.sfx!==false)SFX[g?'ok':'bad']();const e=document.createElement('div');e.className='fb '+(g?'good':'bad');e.textContent=t||(g?['Great!','Nice!','Correct!','Awesome!'][Math.random()*4|0]+' +10 XP':'Keep practicing! +2 XP');document.body.append(e);navigator.vibrate?.(g?20:[30,40,30]);setTimeout(()=>e.remove(),1000)}
function confetti(){for(let i=0;i<40;i++){const e=document.createElement('i');e.className='cf';e.style.cssText=`left:${Math.random()*100}vw;background:${['#58CC02','#1CB0F6','#FF4B4B','#FF9600','#FFC800'][i%5]};animation-delay:${Math.random()*.4}s`;document.body.append(e);setTimeout(()=>e.remove(),2200)}}
function initCv(){const c=$('#cv');if(!c)return;const x=c.getContext('2d');x.lineWidth=10;x.lineCap=x.lineJoin='round';x.strokeStyle='#1CB0F6';let d=0;
 const p=e=>{const r=c.getBoundingClientRect();return[(e.clientX-r.left)*300/r.width,(e.clientY-r.top)*300/r.height]};
 c.onpointerdown=e=>{d=1;c.setPointerCapture(e.pointerId);x.beginPath();x.moveTo(...p(e))};c.onpointermove=e=>{if(d){x.lineTo(...p(e));x.stroke()}};c.onpointerup=()=>d=0}
let WIMG='';
function wReveal(){const c=$('#cv');WIMG=c?c.toDataURL():'';flip=1;say(card(Q[0]).say);render()}
function wRestore(){const c=$('#cv');if(!WIMG||!c)return;const im=new Image();im.onload=()=>c.getContext('2d').drawImage(im,0,0);im.src=WIMG;WIMG=''}
function clr(){const c=$('#cv');c.width=c.width;initCv()}
// The app picks the exercise: new cards are flipped, young cards use choice, older cards add typing and listening
function emode(id){const s=S.cards[id],i=s.i||0,r=Math.random(),k='hkjx'.includes(id[0]),sp=S.tts&&window.speechSynthesis;
 if(!s.r)return'flip';const kj=id[0]=='j'?id.slice(2):id[0]=='x'?(CKM(id.slice(2))||{}).w:'';if(kj&&[...kj].length==1&&STK[kj]&&r<(i<3?.25:.4))return'write';if(i<3)return'choice';
 if(i<10)return k&&r<.4?'type':sp&&r<.7?'listen':'choice';
 return k&&r<.5?'type':sp&&r<.8?'listen':'choice'}
const KP=id=>{const k=KM[id.slice(2)];return k?KJ.filter(x=>x[5]==k[5]):KJ};
function opts(id,c,L){const t=id[0],ans=L?c.say:c.a,pool=L?(t=='h'?H:t=='k'?K:t=='j'?KP(id).map(k=>k[0]):t=='x'?[...S.ck.map(x=>x.r),...WORDS.map(w=>w[1])]:[...S.custom.map(x=>x.t),...WORDS.map(w=>w[0])]):(t=='h'||t=='k'?R:t=='j'?KP(id).map(k=>k[1].split(', ')[0]):t=='x'?[...S.ck.map(x=>x.m||x.r),...WORDS.map(w=>w[2])]:[...S.custom.map(x=>x.m),...WORDS.map(w=>w[2])]),o=new Set([ans]);let n=0;
 while(o.size<4&&n++<300){const x=pool[Math.random()*pool.length|0];if(x&&x!=ans)o.add(x)}return[...o].sort(()=>Math.random()-.5)}
function pick(j){const c=card(Q[0]);AN={ok:OPS[j]==(EM=='listen'?c.say:c.a)};fb(AN.ok);say(c.say);render()}
function chk(){const v=$('#ty').value.trim().toLowerCase(),c=card(Q[0]);AN={ok:!!v&&c.acc.includes(v)};fb(AN.ok);say(c.say);render()}
let SNAP=null;
function askQuit(m){if($('#qm'))return;const d=document.createElement('div');d.id='qm';d.className='sheet';d.onclick=e=>{if(e.target==d)closeQ()};d.innerHTML=`<div class=qq><img src="img/sad.png" alt=""><h3>Are you sure you want to quit?</h3><p>You will lose all XP earned and this session will not count towards your streak.</p><button class=btn onclick="closeQ()">Continue</button><button class="btn dng" onclick="doQuit('${m}')">Quit</button></div>`;document.body.appendChild(d)}
const closeQ=()=>{const d=$('#qm');if(d)d.remove()};
function doQuit(m){closeQ();if(SNAP){S=SNAP;SNAP=null;save();hud()}m=='r'?exitR():go('cards')}
function exitR(){RV=0;SH=0;vt(render)}
function setF(k){S.filter=k;SH=0;Q=dueIds();RT=Q.length;PV=0;OPK='';flip=0;fresh=1;save();vt(render)}
function review(){if(!Q.length)return `<div class=hero><div class=bounce>${ic('party')}</div><small>All done! +${SX} XP</small></div><button class=btn onclick="exitR()">Continue</button>`;
 const id=Q[0],c=card(id),cur=Math.max(0,(RT-Q.length)/RT*100),pv=PV,f=fresh;PV=cur;fresh=0;
 if(OPK!=id){OPK=id;AN=null;EM=emode(id);OPS=EM=='choice'?opts(id,c):EM=='listen'?opts(id,c,1):[];if(EM=='listen')setTimeout(()=>{const b=$('.vb.lg');b?say(c.say,b):say(c.say)},400)}
 const m=EM,W=m=='write',shown=m=='flip'||W?flip:AN,sv=!(W&&!flip)&&(m!='listen'||AN)&&(shown||!'hk'.includes(id[0]))?`<div style="margin-top:12px">${vb(c.say)}</div>`:'';
 const RB='<div class="row2"><button class="btn no" onclick="rate(0)">Again</button><button class="btn" onclick="rate(1)">Good</button><button class="btn alt" onclick="rate(2)">Easy</button></div>',ctl=W?(flip?RB:'<div class=row2><button class="btn alt" onclick="clr()">Clear</button><button class=btn onclick="wReveal()">Reveal</button></div>'):m=='flip'?(flip?`<div class=row2><button class="btn no" onclick="rate(0)">Again</button><button class=btn onclick="rate(1)">Good</button><button class="btn alt" onclick="rate(2)">Easy</button></div>`:'')
  :AN?`<button class=btn onclick="rate(${AN.ok?1:0},1)">Continue</button>`
  :m=='type'?`<input id=ty autocomplete=off autocapitalize=off placeholder="Type the romaji or meaning" onkeydown="if(event.key=='Enter')chk()"><button class=btn onclick="chk()">Check</button>`
  :OPS.map((o,j)=>`<button class="btn opt" onclick="pick(${j})">${esc(o)}</button>`).join('');
 const kc=id[0]=='x'?(CKM(id.slice(2))||{}).w:id.slice(2),pad=W?`<div class=pad style="margin:14px auto"><svg class="guide${flip?'':' hide'}" viewBox="0 0 109 109">${(STK[kc]||[]).map(d=>`<path d="${d}"/>`).join('')}</svg><canvas id=cv width=300 height=300></canvas></div>`:'';
 const hint=m=='flip'?'Tap to reveal':m=='listen'?'Listen and choose':'';
 return `<div class=rh><button class=ib onclick="askQuit('r')" aria-label="Exit review">${SYS.dismiss}</button><div class=bar><div style="--f:${pv}%;--w:${cur}%"></div></div><button class=ib onclick="SH=1;render()" aria-label="Review settings">${SYS.settings}</button></div>
 <div class="fc ${f&&!document.startViewTransition?'in':''}" ${m=='flip'?`onclick="flip=1;say(card(Q[0]).say);render()"`:''} style="${c.sm?'font-size:28px':''}"><div>${W&&!flip?`<div style="font-size:20px;font-weight:800;line-height:1.5">Write this kanji<br><span style="font-size:18px;font-weight:700">${c.b}</span></div>`:m=='listen'&&!AN?vb(c.say,'lg'):c.f}</div>${sv}${shown?`<div class=back>${c.b}</div>`:hint?`<div class=back style="animation:none">${hint}</div>`:''}</div>${W?pad:''}${ctl}
 ${SH?`<div class=sheet onclick="SH=0;render()"><div onclick="event.stopPropagation()"><h3>What to review</h3>${[['all','Everything'],['chars','Kanji & alphabet'],['phr','Sentences & phrases']].map(([k,n])=>`<button class="btn opt${S.filter==k?' sel':''}" onclick="setF('${k}')">${n}</button>`).join('')}</div></div>`:''}`}
function forecast(){const t=td(),c=Array(14).fill(0);Object.values(S.cards).forEach(s=>{if(!s.r)return;for(let k=0;k<14;k++)if(k?s.d==td(k):s.d<=t){c[k]++;break}});const mx=Math.max(...c,1);
 return `<div class=card2><b>Coming up</b> <small>${c.slice(1,8).reduce((a,b)=>a+b,0)} reviews in the next 7 days</small><div class=fcst>${c.map((v,k)=>`<div><span>${v||''}</span><i style="height:${v/mx*100}%;animation-delay:${k*30}ms"></i><small>${k?'SMTWTFS'[new Date(td(k)+'T00:00').getDay()]:'Now'}</small></div>`).join('')}</div></div>`}
const lvl=()=>{const L=Math.floor(Math.sqrt(S.xp/25))+1,lo=25*(L-1)**2,hi=25*L*L,an=LVA;LVA=0;return `<div class=lvb><div class=lvt><b>Level ${L}</b><span>${S.xp-lo} / ${hi-lo} <b class=xp>XP</b></span></div><div class=lvbar><div class="${an?'':'na'}" style="--w:${(S.xp-lo)/(hi-lo)*100}%"></div></div></div>`};
function cal(){const o=[];for(let k=-34;k<=0;k++){const d=td(k),n=S.hist[d]||0;o.push(`<i class="d${n?n<S.goal/2?1:n<S.goal?2:3:0}" title="${d}: ${n}"></i>`)}return `<div class=cal>${o.join('')}</div>`}
function theme(){document.documentElement.dataset.theme=S.theme=='dark'||(S.theme=='auto'&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light'}
function startRev(){SNAP=structuredClone(S);Q=dueIds();RT=Q.length;SX=0;PV=0;fresh=1;RV=1;flip=0;OPK='';vt(render)}
function rate(g,q){if(!q)fb(g);const id=Q.shift(),s=S.cards[id],e=s.e||2.5,i=Math.max(s.i||0,1);SX+=g?10:2;fresh=1;
 if(!s.r){if(S.nd!=td()){S.nd=td();S.nn=0}S.nn++}
 s.r=(s.r||0)+1;
 if(!g){s.e=Math.max(1.3,e-.2);s.i=1;s.d=td();s.l=(s.l||0)+1;Q.splice(Math.min(3,Q.length),0,id);S.xp+=2}
 else{s.i=g==2?Math.max(3,Math.round(i*e*1.3)):Math.max(i+1,Math.round(i*e));if(g==2)s.e=e+.15;s.d=td(s.i);S.xp+=g==2?15:10}
 bump();flip=0;AN=null;OPK='';save();vt(render);if(!Q.length)confetti()}
const addSheet=()=>`<div class=sheet onclick="closeAdd()"><div onclick="event.stopPropagation()"><div class=rh style="justify-content:space-between"><h3 style="margin:0">Add a card</h3><button class=ib onclick="closeAdd()" aria-label="Close">${SYS.dismiss}</button></div>
 <select id=ft onchange="ftChg()"><option value=word>Word / kanji combination</option><option value=sent>Sentence from a show</option></select>
 <input id=tx autocomplete=off placeholder="日本語 (kanji is fine)"><div id=rdw><input id=rd placeholder="Reading for words, e.g. にほん"></div><div id=sth class=cred hidden>Tip: put spaces between words (わたしは 学校に 行きます) to use it in Sentence builder. Furigana is automatic.</div>
 <input id=mn placeholder="Translation"><input id=sh placeholder="Show / episode (optional)"><input id=ur type=url placeholder="Link to where you saw it (episode, clip, article)"><textarea id=nt rows=2 placeholder="Notes: readings that change, e.g. 日 → び in 日曜日"></textarea>
 <button class=btn onclick="addC()">Save card</button></div></div>`;
function ftChg(){const w=$('#ft').value=='word';$('#rdw').hidden=!w;$('#nt').hidden=!w;$('#sth').hidden=w;$('#tx').placeholder=w?'日本語 (kanji is fine)':'日本語 sentence, e.g. わたしは 学校に 行きます'}
function closeAdd(){if(['tx','rd','mn','sh','ur','nt'].some(i=>$('#'+i)?.value.trim())&&!confirm('Discard this card?'))return;AD=0;render()}
function addC(i){let c;
 if(i!==undefined){const w=WORDS[i];const ex=S.custom.find(x=>x.t==w[0]);if(ex){delete S.cards['c:'+ex.id];S.custom=S.custom.filter(y=>y!=ex);save();toast('Removed from deck');return render()}c={t:w[0],m:w[2],s:'Word of the day'}}
 else{const kind=$('#ft').value,raw=$('#tx').value.trim(),m=$('#mn').value.trim();if(!raw||!m)return toast('Enter Japanese and a translation');
  const u=$('#ur').value.trim();if(u&&!/^https?:\/\//i.test(u))return toast('Link must start with http:// or https://');
  const parts=raw.split(/[\s\/／]+/).filter(Boolean),t=kind=='sent'?parts.join(''):raw;c={t,m,s:$('#sh').value.trim(),u};if(kind=='sent'&&parts.length>1)c.p=parts;
  if(kind=='word'&&$('#rd').value.trim()&&!S.words.some(w=>w.w==t)){const r=$('#rd').value.trim(),n=$('#nt').value.trim(),w={w:t,r,m,n};if([...t].some(isK)){w.ck=String(Date.now()+1);S.ck.push({id:w.ck,w:t,r,m,n})}S.words.push(w)}FI=null;AD=0}
 c.id=String(Date.now());S.custom.push(c);S.cards['c:'+c.id]={b:0,d:td()};save();render();toast('Card added')}
// "Add to deck" on a compound inside a kanji page: no re-render, so the page keeps its scroll position
function addW(i,b){const w=S.words[i];if(!w)return;if(S.custom.some(c=>c.t==w.w))return toast('Already in your deck');
 const c={t:w.w,m:w.m||w.r,s:'Compound of '+KD,id:String(Date.now()+i)};S.custom.push(c);S.cards['c:'+c.id]={b:0,d:td()};save();b.disabled=true;b.textContent='In deck ✓';toast('Added to deck')}
function chat(){const weak=Object.keys(S.cards).filter(k=>(S.cards[k].i||0)<4&&card(k)).slice(0,10).map(k=>card(k).say).join('、');
 const lv=S.lv=='Pre-N5'?'Pre-N5 (complete beginner, before JLPT N5)':'JLPT '+S.lv,
  p=`You are my friendly Japanese tutor. My level is ${lv}. Send me 10 practice questions at exactly this level, one at a time, and wait for my answer before the next one. Mix the question types: vocabulary meaning, kanji reading, fill in the blank grammar, particle choice, sentence ordering, and English to Japanese translation. Give multiple choice options where it makes sense. Add furigana to every kanji and a short English hint. After each answer, tell me if I was right, correct me gently and explain briefly. After question 10, give my score and the topics I should review.${weak?` Try to include these words I am still learning: ${weak}.`:''} Start with question 1.`;
 (navigator.clipboard?navigator.clipboard.writeText(p):Promise.resolve()).catch(()=>{});window.open('https://chatgpt.com/?q='+encodeURIComponent(p),'_blank')}
function exp(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:'application/json'}));a.download='memojap-backup-'+td()+'.json';a.click()}
function imp(f){if(!f)return;f.text().then(t=>{S=Object.assign(S,JSON.parse(t));FI=null;save();render();toast('Backup restored')}).catch(()=>toast('Invalid file'))}
function ans(j,b){const ok=j==QC[AS.i][3];if(ok)AS.sc[QC[AS.i][0]]++;document.querySelectorAll('.opt').forEach(x=>x.disabled=1);b.classList.add(ok?'ok':'bad');fb(ok,ok?'Correct!':'Not quite');setTimeout(()=>{AS.i++;render()},800)}
// Original practice questions written in the JLPT multiple-choice style (official test items are copyrighted)
const QS=[['N5','まいあさ ( ) を のみます。',['ごはん','みず','パン','たまご'],1],['N5','「学校」の よみかたは?',['がっこう','がくこう','がっこ','がくこ'],0],['N5','きのう えいがを ( )。',['みます','みました','みる','みて'],1],
['N4','あした 雨が ( ) そうです。',['ふる','ふり','ふって','ふれば'],0],['N4','「準備」の よみかたは?',['じゅんび','しゅんび','じゅうび','じゅんひ'],0],['N4','先生に 本を ( )。',['いただきました','くださいました','あげました','やりました'],0],
['N3','彼は忙しい( )、毎日ジムに通っている。',['にもかかわらず','ために','ばかりに','おかげで'],0],['N3','「経験」の よみかたは?',['けいけん','けえけん','きょうけん','けいげん'],0],['N3','薬を飲んだ( )、熱が下がった。',['おかげで','せいで','くせに','ものの'],0]];
QS.push(['N5','「みせ」の かんじは?',['店','庭','広','座'],0],['N5','わたしは ともだち ( ) えいがを みました。',['と','が','を','に'],0],['N5','この かばんは ( ) ですか。',['いくら','いつ','だれ','どこ'],0],['N5','「大きい」の はんたいは?',['小さい','長い','高い','安い'],0],['N5','きのう 7じに ( )。',['おきました','おきます','おきて','おきない'],0],
['N4','電車が おくれた ( )、会社に ちこくしました。',['ので','のに','ながら','ように'],0],['N4','子どもの とき、よく 川で ( ) ものです。',['およいだ','およぐ','およいで','およげ'],0],['N4','「約束」の よみかたは?',['やくそく','やくぞく','やっそく','よくそく'],0],['N4','この 薬は 食事の ( ) 飲んでください。',['あとで','あとに','うしろで','つぎで'],0],['N4','お客さまが ( )。',['いらっしゃいました','まいりました','もうしました','いただきました'],0],
['N3','雨が 降りそうだ ( )、傘を 持って いこう。',['から','のに','けれど','ても'],0],['N3','「環境」の よみかたは?',['かんきょう','かんぎょう','かんけい','かんきょ'],0],['N3','彼女は 毎日 練習した ( ) 、上手に なった。',['かいがあって','せいで','くせに','わりに'],0],['N3','試験に 合格できる( )、毎日 勉強しています。',['ように','ために','ばかり','ほど'],0],['N3','「増える」の はんたいは?',['減る','上がる','落ちる','消える'],0]);
QS.push(['N2','「頻繁」の よみかたは?',['ひんぱん','ひんぱ','ひんはん','びんぱん'],0],['N2','「妥協」の よみかたは?',['だきょう','たきょう','だこう','だけい'],0],['N2','彼は新人( )、仕事が早い。',['にしては','にとって','に関して','として'],0],['N2','天気予報( )、明日は雪が降るそうだ。',['によると','にとって','について','に対して'],0],['N2','彼は医者である( )、作家でもある。',['と同時に','に対して','にしては','わりに'],0],['N2','「増加」の はんたいは?',['減少','上昇','拡大','成長'],0],
['N1','「懸念」の よみかたは?',['けねん','けんねん','かんねん','けいねん'],0],['N1','「遂行」の よみかたは?',['すいこう','ついこう','すいぎょう','つうこう'],0],['N1','お客様のご要望( )、サービスを改善いたします。',['を踏まえて','をよそに','ならでは','ともなると'],0],['N1','周囲の反対( )、彼は留学を決意した。',['をよそに','をもとに','にかかわらず','に先立って'],0],['N1','社長( )人が、そんな不正をするはずがない。',['ともあろう','ばかりの','からする','といえども'],0],['N1','「脆い」の よみかたは?',['もろい','ひどい','にぶい','するどい'],0]);
function startTest(){QC=[];for(const L of['N5','N4','N3','N2','N1'])QS.filter(q=>q[0]==L).sort(()=>Math.random()-.5).slice(0,5).forEach(q=>{const o=q[2].map((t,i)=>[t,i==q[3]]).sort(()=>Math.random()-.5);QC.push([L,q[1],o.map(x=>x[0]),o.findIndex(x=>x[1])])});AS={i:0,sc:{N5:0,N4:0,N3:0,N2:0,N1:0}};go('test')}
// ---- Deck manager: see every card, filter/search, remove (with undo)
const DK=()=>Object.keys(S.cards).filter(k=>card(k));
const DFL=[['all','All'],['h','Hiragana'],['k','Katakana'],['j','Kanji'],['c','Words'],['x','Custom kanji']];
const dstat=x=>!x.r?'New':x.d<=td()?'Due':(x.i||0)>=21?'Mastered':'Learning';
function deckIds(){const q=DQ.trim().toLowerCase();return DK().filter(id=>{if(DF!='all'&&id[0]!=DF)return false;if(!q)return true;const c=card(id);
 return[c.say,c.w||'',c.a,String(c.b).replace(/<[^>]+>/g,' '),id[0]=='c'?furi(c.say).replace(/<[^>]+>/g,''):''].some(x=>String(x).toLowerCase().includes(q))})}
function deckList(a,from=0){const ids=deckIds(),sh=ids.slice(0,DL);
 return `<div class=dsum><span>${ids.length} card${ids.length==1?'':'s'}</span>${ids.length?`<button class=link onclick="rmAll()">Remove all${DF!='all'||DQ.trim()?' shown':''}</button>`:''}</div>`
 +(sh.map((id,n)=>{const c=card(id),x=S.cards[id],t=dstat(x),sub=id[0]=='x'?c.rd+(c.a!=c.rd?' · '+c.a:''):c.a;return `<div class="row drow${a&&n>=from?' ent':''}" data-id="${id}" style="--k:${Math.min(Math.max(n-from,0),14)}"><div class=dm><b class=jp>${id[0]=='c'||id[0]=='x'?c.f:esc(c.say)}</b><div class=ds>${esc(String(sub))}</div></div><span class="stt ${t}">${t}</span><button class=ib onclick="rmCard('${id}')" aria-label="Remove from deck">${SYS.dismiss}</button></div>`}).join('')||'<p>Nothing here. Add cards from the Alphabet tab or with + Add card.</p>')
 +(ids.length>DL?`<button class="btn alt" onclick="DL+=60;dRef(1,DL-60)">Show more (${ids.length-DL})</button>`:'')}
// a = animate rows in (filter change / first open / show more); from = first row index that should animate
function dRef(a,from){if(!$('#dl'))return;$('#dl').innerHTML=deckList(a,from);const t=$('#dtot');if(t)t.textContent=DK().length}
function setDF(k){DF=k;DL=60;document.querySelectorAll('.fl button').forEach((b,i)=>b.classList.toggle('on',DFL[i][0]==k));dRef(1)}
function rmMany(ids,msg){const bk=ids.map(id=>[id,S.cards[id],id[0]=='c'?S.custom.find(x=>x.id==id.slice(2)):null]).filter(b=>b[1]);
 bk.forEach(([id,x,cu])=>{delete S.cards[id];if(cu)S.custom=S.custom.filter(y=>y!=cu)});save();dRef();markIn();
 undoBar(msg,()=>{bk.forEach(([id,x,cu])=>{S.cards[id]=x;if(cu)S.custom.push(cu)});save();dRef(1);markIn()})}
// the row slides away and collapses first, then the card is actually removed
function rmCard(id){const msg=id[0]=='c'?'Card deleted':'Removed from deck',el=document.querySelector(`.drow[data-id="${id}"]`);
 if(!el||matchMedia('(prefers-reduced-motion:reduce)').matches)return rmMany([id],msg);
 el.style.height=el.offsetHeight+'px';void el.offsetHeight;el.classList.add('gone');setTimeout(()=>rmMany([id],msg),300)}
function rmAll(){const ids=deckIds();if(ids.length>1&&!confirm(`Remove ${ids.length} cards from your deck? Your review progress on them is lost (you can undo right after).`))return;rmMany(ids,ids.length+' cards removed')}
function undoBar(msg,fn){document.querySelector('.sn')?.remove();const e=document.createElement('div');e.className='sn';e.innerHTML=`<span>${esc(msg)}</span><button>Undo</button>`;e.querySelector('button').onclick=()=>{fn();e.remove()};document.body.append(e);setTimeout(()=>e.remove(),6000)}
views.deck=()=>`<div class=rh><button class=ib onclick="go('cards')" aria-label="Back">${SYS.back}</button><h3 style="margin:0">My deck <small>(<span id=dtot>${DK().length}</span>)</small></h3></div>
 <div class=fl>${DFL.map(([k,n])=>`<button class="${DF==k?'on':''}" onclick="setDF('${k}')">${n}</button>`).join('')}</div>
 <input id=dq type=search placeholder="Search your deck" value="${esc(DQ)}" oninput="DQ=this.value;DL=60;dRef()"><div id=dl>${deckList(1)}</div>`;
// ---- Sentence builder: tap word chips into order. Words come from sentences.js plus your own sentence cards typed with spaces.
const fp=t=>furi(t).replace(/<span class=unk onclick="[^"]*">/g,'<span>');
const chipH=(t,fn,cls='')=>`<button class="chip ${cls}" ${fn?`onclick="${fn}"`:'disabled'}>${fp(t)}</button>`;
function sentPool(){const L={N5:1,N4:2,N3:3,N2:4,N1:5},lv=({'Pre-N5':1,N5:1,N4:2,N3:3,N2:4,N1:5})[S.lv]||1;
 return[...S.custom.filter(c=>c.p&&c.p.length>1).map(c=>({p:c.p,m:c.m,c:1,f:0})),...SENT.filter(x=>L[x[0]]<=lv).map(x=>({p:x[1].split(' '),m:x[2],f:x[3]}))]}
function startBuild(){SNAP=structuredClone(S);const P=shuf(sentPool()),cu=P.filter(x=>x.c).slice(0,2),r=P.filter(x=>!x.c).slice(0,6-cu.length);SB={q:shuf([...cu,...r]),i:0,sc:0,xp:0};nextB();go('build')}
function nextB(){const q=SB.q[SB.i];let b;for(let n=0;n<9;n++){b=shuf(q.p.map((t,k)=>({t,k})));if(q.p.length<2||b.some((x,j)=>x.k!=j))break}SB.bank=b;SB.ans=[];SB.res=null;SB.mv=null}
const rB=()=>{$('#bd').innerHTML=bView()};
function bView(){const q=SB.q[SB.i],d=SB.res,fix=q.p.join('');
 return `<small>Build the sentence</small><div class=q>${esc(q.m)}</div>
 <div class=bz>${SB.ans.map((k,n)=>chipH(q.p[k],d?'':`bTake(${n})`,(d?(d.ok?'ok':'bad'):'')+(SB.mv===k&&SB.mvIn=='a'?' new':''))).join('')}</div>
 <div class=bb>${SB.bank.map(({t,k})=>SB.ans.includes(k)?`<span class="chip ghost">${esc(t)}</span>`:chipH(t,d?'':`bPut(${k})`,SB.mv===k&&SB.mvIn=='b'?'new':'')).join('')}</div>
 ${d?`<div class="bres ${d.ok?'good':'bad'}"><div class=vrow><b>${d.ok?(d.alt?'Correct! Another natural order':'Correct!'):'Not quite'}</b>${vb(fix)}</div>${!d.ok||d.alt?`<div class=ans>${d.ok?'Most natural':'Answer'}: <span class=jp>${fp(q.p.join(' '))}</span></div>`:''}</div><button class=btn onclick="bNext()">Continue</button>`
 :`<button class=btn ${SB.ans.length?'':'disabled'} onclick="bCheck()">Check</button>`}`}
const bSay=k=>{const b=SB.bank.find(x=>x.k==k);if(b)say(b.t)};
function bPut(k){if(SB.res)return;bSay(k);SB.ans.push(k);SB.mv=k;SB.mvIn='a';rB()}
function bTake(n){if(SB.res)return;bSay(SB.ans[n]);SB.mv=SB.ans[n];SB.mvIn='b';SB.ans.splice(n,1);rB()}
function bCheck(){const q=SB.q[SB.i],g=SB.ans.map(k=>q.p[k]),c=q.p,ex=g.join('|')==c.join('|'),
 alt=!ex&&q.f&&g.length==c.length&&g[g.length-1]==c[c.length-1]&&[...g].sort().join('|')==[...c].sort().join('|'),ok=ex||alt;
 SB.res={ok,alt};SB.mv=null;if(ok)SB.sc++;SB.xp+=ok?10:2;S.xp+=ok?10:2;bump();save();hud();fb(ok);rB();say(c.join(''))}
function bNext(){SB.i++;if(SB.i<SB.q.length)nextB();vt(render);if(SB.i>=SB.q.length)confetti()}
views.build=()=>{if(!SB){T='cards';return views.cards()}const n=SB.q.length;
 if(SB.i>=n)return `<div class=hero><div class=bounce>${ic('party')}</div>${SB.sc}/${n}<small> correct · +${SB.xp} XP</small></div><button class=btn onclick="startBuild()">Practice again</button><button class="btn alt" onclick="go('cards')">Done</button>`;
 return `<div class=rh><button class=ib onclick="askQuit('b')" aria-label="Exit">${SYS.dismiss}</button><div class=bar><div style="--f:${Math.max(0,(SB.i-1)/n*100)}%;--w:${SB.i/n*100}%"></div></div></div><div id=bd>${bView()}</div>`};
const SM={goal:[5,5,20],newMax:[0,5,10],revMax:[10,10,100]};
function stSet(k,v){const[m,,d]=SM[k],n=Math.round(+v);S[k]=v!==''&&isFinite(n)?Math.max(m,n):d;const e=$('#s_'+k);if(e)e.value=S[k];save()}
const stp=(k,d)=>stSet(k,S[k]+d*SM[k][1]);
function tgl(k,b){const v=k=='sfx'?S.sfx===false:!S.tts;S[k]=v;save();b.classList.toggle('off',!v);b.setAttribute('aria-pressed',v);if(v&&k=='sfx')SFX.ok()}
function setTheme(v){const L=['auto','light','dark'],g=$('#thm'),n=L.indexOf(v);S.theme=v;save();theme();g.style.setProperty('--i',n);g.querySelectorAll('button').forEach((b,i)=>b.classList.toggle('on',i==n))}
function setLv(v){S.lv=v;save();document.querySelectorAll('#lvs button').forEach(b=>b.classList.toggle('on',b.textContent==v))}
let LVA=1;
async function wipe(){if(!confirm('Delete ALL your data? Cards, progress, XP and settings will be erased. This cannot be undone.'))return;const d=await idb,tx=d.transaction('s','readwrite');tx.objectStore('s').clear();tx.oncomplete=()=>location.reload()}
function go(t){LVA=1;vt(()=>{T=t;KD=null;RV=0;ALL=0;SQ='';AD=0;CKE=null;SEL=null;DQ='';DL=60;document.body.classList.remove('sm');if(t!='build')SB=null;render()})}
function render(){document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.t==({test:'prof',build:'cards',deck:'cards'}[T]||T)));
 hud();M.innerHTML=views[T]();if(T=='alpha'&&!KD)selBar();$('#ty')?.focus();if(AD)$('#tx')?.focus();if(CKE!==null)$('#cw')?.focus();if(KD){initCv();setTimeout(play,250)}else if(RV&&EM=='write'){initCv();wRestore()}scrollTo(0,0)}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>go(b.dataset.t));
load().then(d=>{if(d)S=Object.assign(S,d);S.words.forEach(fixW);const h=new Set(S.words.map(x=>x.w+x.r));SEED.forEach(x=>h.has(x.w+x.r)||S.words.push(x));FI=null;mig();migCk();theme();render()});
navigator.storage?.persist?.();
if('serviceWorker'in navigator){const had=navigator.serviceWorker.controller;navigator.serviceWorker.register('sw.js',{updateViaCache:'none'}).then(r=>r.update()).catch(()=>{});navigator.serviceWorker.addEventListener('controllerchange',()=>{if(had)location.reload()})}

theme();matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',theme);
document.querySelectorAll('nav i').forEach(e=>e.innerHTML=NAV[e.dataset.n]);$('.brand i').innerHTML=ic('flag');

// Number keys 1-4 switch tabs
addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey||RV||/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)||document.querySelector('.sheet'))return;const b=document.querySelectorAll('nav button')[+e.key-1];if(b)b.click()});
