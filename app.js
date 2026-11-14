const ic=n=>`<img class=ic src="${EMO[n]}" alt="">`;
const vt=f=>document.startViewTransition&&!matchMedia('(prefers-reduced-motion:reduce)').matches?document.startViewTransition(f):f();
const $=s=>document.querySelector(s),M=$('#main');
const H=[..."あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ"];
const R="a i u e o ka ki ku ke ko sa shi su se so ta chi tsu te to na ni nu ne no ha hi fu he ho ma mi mu me mo ya yu yo ra ri ru re ro wa wo n ga gi gu ge go za ji zu ze zo da ji zu de do ba bi bu be bo pa pi pu pe po".split(' ');
const K=H.map(c=>String.fromCharCode(c.charCodeAt(0)+96));
const CUR=[['日本','にほん','Japan','日 reads に here'],['学生','がくせい','student',''],['先生','せんせい','teacher',''],['大人','おとな','adult','Irregular: 大 → おと'],['今日','きょう','today','Special reading, not いま+ひ'],['日曜日','にちようび','Sunday','日 → にち'],['火曜日','かようび','Tuesday',''],['水曜日','すいようび','Wednesday',''],['山','やま','mountain',''],['川','かわ','river',''],['水','みず','water',''],['木','き','tree',''],['人','ひと','person','In 日本人 it reads じん'],['日本人','にほんじん','Japanese person','人 → じん'],['口','くち','mouth',''],['目','め','eye',''],['本','ほん','book',''],['月','つき','moon','']].map(a=>({w:a[0],r:a[1],m:a[2],n:a[3]}));
const KM=Object.fromEntries(KJ.map(k=>[k[0],k]));const SEED=WORDS.map(a=>({w:a[0],r:a[1],m:a[2],n:''}));
let S={xp:0,streak:0,last:'',day:'',today:0,goal:20,lv:'N5',cards:{},custom:[],words:[...CUR],tts:true,filter:'all',theme:'auto',hist:{},newMax:10,revMax:100,nn:0,nd:''},T='cards',A='h',KD=null,RV=0,flip=0,Q=[],AS=null,KL='N5',RT=0,SX=0,PV=0,fresh=0,FI=null,PT=0,AN=null,OPK='',OPS=[],QC=[],SH=0,EM='flip',ALL=0,SQ='';
const INT=[0,1,2,4,8,16,32,64];
const td=(o=0)=>new Date(Date.now()-new Date().getTimezoneOffset()*6e4+o*864e5).toISOString().slice(0,10);
const esc=s=>String(s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const idb=new Promise(r=>{const q=indexedDB.open('memojap',1);q.onupgradeneeded=()=>q.result.createObjectStore('s');q.onsuccess=()=>r(q.result)});
const load=async()=>{const d=await idb;return new Promise(r=>{const q=d.transaction('s').objectStore('s').get('d');q.onsuccess=()=>r(q.result)})};
const save=async()=>{const d=await idb;d.transaction('s','readwrite').objectStore('s').put(S,'d')};
const toast=t=>{const e=$('#toast');e.textContent=t;e.className='on';setTimeout(()=>e.className='',1800)};
const say=t=>{if(S.tts&&window.speechSynthesis){const u=new SpeechSynthesisUtterance(t);u.lang='ja-JP';speechSynthesis.cancel();speechSynthesis.speak(u)}};
const isK=c=>/[\u4e00-\u9fff]/.test(c);
// Furigana: longest match from the word bank (okurigana-aware); unknown kanji get a dashed underline
const ROW={う:'いわっえおう',く:'きかいけこく',ぐ:'ぎがいげごぐ',す:'しさせそす',つ:'ちたってとつ',ぬ:'になんねのぬ',ぶ:'びばんべぼぶ',む:'みまんめもむ',る:'りらっれろるまてたなよさせ',い:'いかくけさ'};
const idx=()=>{if(FI)return FI;FI={};S.words.forEach(x=>{if([...x.w].some(isK)){let a=0,e=0;const w=x.w,r=x.r;while(a<w.length&&!isK(w[a])&&r[a]==w[a])a++;while(e<w.length-a-1&&!isK(w[w.length-1-e])&&r[r.length-1-e]==w[w.length-1-e])e++;x.a=a;x.e=e;(FI[w[0]]=FI[w[0]]||[]).push(x)}});for(const k in FI)FI[k].sort((a,b)=>b.w.length-a.w.length);return FI};
const rb=(x,tail=1)=>esc(x.w.slice(0,x.a))+`<ruby>${esc(x.w.slice(x.a,x.w.length-x.e))}<rt>${esc(x.r.slice(x.a,x.r.length-x.e))}</rt></ruby>`+(tail?esc(x.w.slice(x.w.length-x.e)):'');
// Conjugation: match the kanji core of a verb/adjective when the next kana is a valid inflection of its ending (買う → 買いました, 高い → 高かった)
function conj(x,t,i){const n=x.w.length-x.e;if(!x.e||!t.startsWith(x.w.slice(0,n),i))return 0;const tl=x.w.slice(n),L=tl.slice(0,-1),l=tl.slice(-1),j=i+n+L.length;return t.startsWith(L,i+n)&&t[j]&&(ROW[l]||'').includes(t[j])?n:0}
function furi(t){let o='',i=0;const I=idx();
 while(i<t.length){const c=I[t[i]]||[],ex=c.find(x=>t.startsWith(x.w,i));let cj=0,cx;c.forEach(x=>{const n=conj(x,t,i);if(n>cj){cj=n;cx=x}});
  if(cx&&(!ex||cj>=ex.w.length)){o+=rb(cx,0);i+=cj}
  else if(ex){o+=rb(ex);i+=ex.w.length}
  else if(isK(t[i])){o+=`<span class=unk onclick="fixK('${t[i]}')">${esc(t[i])}</span>`;i++}
  else{o+=esc(t[i]);i++}}return o}
const lk=u=>{try{return u?`<a href="${esc(u)}" target=_blank rel=noopener onclick="event.stopPropagation()">${ic('link')} ${esc(new URL(u).hostname)}</a>`:''}catch(e){return ''}};
function fixK(c){const r=prompt(`Reading for ${c}? (saved to your kanji bank)`);if(r){S.words.push({w:c,r:r.trim(),m:'',n:''});FI=null;mig();save();render();toast('Added to kanji bank')}}
const alt=r=>[r,...({shi:['si'],chi:['ti'],tsu:['tu'],fu:['hu'],ji:['zi'],wo:['o']}[r]||[])];
function card(id){const i=id.indexOf(':'),t=id.slice(0,i),x=id.slice(i+1);
 if(t=='h')return{f:H[x],b:R[x],say:H[x],a:R[x],acc:alt(R[x])};if(t=='k')return{f:K[x],b:R[x],say:K[x],a:R[x],acc:alt(R[x])};
 if(t=='j'){const k=KM[x];return{f:x,b:`${k[1]}<br>音 ${k[2]}<br>訓 ${k[3]}`,say:x,a:k[1].split(', ')[0],acc:k[1].toLowerCase().split(', ')}}
 const c=S.custom.find(a=>a.id==x);return c?{f:furi(c.t),b:esc(c.m)+(c.s?`<br><small>${esc(c.s)}</small>`:'')+(c.u?'<br>'+lk(c.u):''),say:c.t,sm:c.t.length>6,a:c.m}:null}
const inF=id=>S.filter=='all'||(S.filter=='chars')==(id[0]!='c');
function dueIds(){const t=td(),nn=S.nd==t?S.nn:0,ok=k=>card(k)&&inF(k),K=Object.keys(S.cards);
 const rv=K.filter(k=>S.cards[k].r&&S.cards[k].d<=t&&ok(k)).sort((a,b)=>S.cards[a].d<S.cards[b].d?-1:1).slice(0,S.revMax);
 return[...rv,...K.filter(k=>!S.cards[k].r&&ok(k)).slice(0,Math.max(0,S.newMax-nn))]}
function mig(){Object.values(S.cards).forEach(c=>{if(c.r===undefined)c.r=c.b>0?1:0;if(!c.i)c.i=INT[c.b||0];if(!c.e)c.e=2.5})}
function bump(){if(S.day!=td()){S.day=td();S.today=0}if(S.last!=td()){S.streak=S.last==td(-1)?S.streak+1:1;S.last=td()}S.today++;S.hist[td()]=(S.hist[td()]||0)+1}
const st=()=>S.last==td()||S.last==td(-1)?S.streak:0;
function addSet(){const ids=A=='h'?H.map((_,i)=>'h:'+i):A=='k'?K.map((_,i)=>'k:'+i):KJ.filter(k=>k[5]==KL).map(k=>'j:'+k[0]);let n=0;
 ids.forEach(id=>{if(!S.cards[id]){S.cards[id]={b:0,d:td()};n++}});save();toast(n+' cards added to deck')}
const views={
alpha(){if(KD)return kdetail(KD);const L=A=='j'?KJ.filter(k=>k[5]==KL).map(k=>[k[0],k[1].split(', ')[0]]):(A=='h'?H:K).map((c,i)=>[c,R[i]]);
 return `<div class=seg>${[['h','ひらがな'],['k','カタカナ'],['j','漢字']].map(([k,n])=>`<button class="${A==k?'on':''}" onclick="A='${k}';render()">${n}</button>`).join('')}</div>
 ${A=='j'?`<div class=seg style="margin-top:8px">${['N5','N4','N3'].map(l=>`<button class="${KL==l?'on':''}" onclick="KL='${l}';render()">${l}</button>`).join('')}</div>`:''}
 <button class="btn alt" onclick="addSet()">+ Add all to my deck</button>
 <div class=grid>${L.map(([c,r])=>`<div class=tile onclick="pop(this);${A=='j'?`KD='${c}';render()`:`say('${c}')`}"><b>${c}</b><small>${r}</small></div>`).join('')}</div>`},
cards(){if(RV)return review();const due=dueIds(),i=Math.floor(Date.now()/864e5)%WORDS.length,dw={w:WORDS[i][0],r:WORDS[i][1],m:WORDS[i][2]};
 return `<div class=hero>${due.length}<small> to study</small><div style="font-size:14px;color:var(--s)">${due.filter(k=>!S.cards[k].r).length} new · ${due.filter(k=>S.cards[k].r).length} review</div><button class=btn onclick="startRev()" ${due.length?'':'disabled'}>Start review</button></div>
 ${forecast()}
 <div class=card2><small>Word of the day</small><div class=jp>${furi(dw.w)}</div>${esc(dw.m)}<button class="btn alt" onclick="addC(${i})">+ Add to deck</button></div>
 <h3>Add your own</h3><select id=ft><option value=word>Word / kanji combination</option><option value=sent>Sentence from a show</option></select>
 <input id=tx placeholder="日本語 (kanji is fine)"><input id=rd placeholder="Reading for words, e.g. にほん (sentences are automatic)"><input id=mn placeholder="Translation"><input id=sh placeholder="Show / episode (optional)"><input id=ur type=url placeholder="Link to where you saw it (episode, clip, article)"><textarea id=nt rows=2 placeholder="Notes: readings that change, e.g. 日 → び in 日曜日"></textarea>
 <button class=btn onclick="addC()">Save card</button>
 <h3>My cards (${S.custom.length})</h3><input id=sq type=search placeholder="Search your cards" value="${esc(SQ)}" oninput="SQ=this.value;$('#cl').innerHTML=cardList()"><div id=cl>${cardList()}</div>`},
prof(){const n=Object.keys(S.cards).length,m=Object.values(S.cards).filter(c=>(c.i||0)>=21).length;
 return `<div class=hero>${ic('fire')} ${st()}<small> day streak</small></div><p><b>Today:</b> ${S.day==td()?S.today:0}/${S.goal} reviews</p><div class=bar><div style="width:${Math.min(100,(S.day==td()?S.today:0)/S.goal*100)}%"></div></div>
 <p>${ic('star')} ${S.xp} XP · ${ic('cards')} ${n} cards · ${ic('medal')} ${m} mastered</p><h3>Last 5 weeks</h3>${cal()}
 <label>My level<select onchange="S.lv=this.value;save()">${['Pre-N5','N5','N4','N3'].map(l=>`<option ${S.lv==l?'selected':''}>${l}</option>`).join('')}</select></label>
 <label>Daily goal (reviews)<input type=number value=${S.goal} onchange="S.goal=+this.value||20;save();render()"></label>
 <label>Theme<select onchange="S.theme=this.value;save();theme()">${['auto','light','dark'].map(t=>`<option ${S.theme==t?'selected':''}>${t}</option>`).join('')}</select></label>
 <label>New cards per day<input type=number min=0 value=${S.newMax} onchange="S.newMax=Math.max(0,+this.value);save()"></label><label>Max reviews per day<input type=number min=1 value=${S.revMax} onchange="S.revMax=Math.max(1,+this.value||100);save()"></label>
 <label><input type=checkbox style="width:auto" ${S.tts?'checked':''} onchange="S.tts=this.checked;save()"> Read cards aloud</label>
 <button class=btn onclick="startTest()">Fluency check (N5–N3)</button>
 <button class="btn alt" onclick="chat()">Practice with ChatGPT</button>
 <button class="btn alt" onclick="exp()">Export backup</button>
 <button class="btn alt" onclick="$('#im').click()">Import backup</button><input id=im type=file accept=.json hidden onchange="imp(this.files[0])"><p class=cred>Stroke data: KanjiVG (CC BY-SA 3.0). Kanji: KANJIDIC (EDRDG, CC BY-SA 4.0). Word lists: JLPT lists by Jonathan Waller, via JMdict data.</p>`},
test(){if(AS.i>=QC.length){let l='Pre-N5';for(const x of['N5','N4','N3']){if(AS.sc[x]>=3)l=x;else break}
 return `<div class=hero>${l}<small> estimated</small></div><p>N5 ${AS.sc.N5}/5 · N4 ${AS.sc.N4}/5 · N3 ${AS.sc.N3}/5</p><p>This is a rough estimate from a short quiz. It does not test listening or speaking.</p><button class=btn onclick="S.lv='${l}';save();go('prof')">Set as my level</button>`}
 const q=QC[AS.i];return `<small>${q[0]} · ${AS.i+1}/${QS.length}</small><div class=q>${q[1]}</div>${q[2].map((o,j)=>`<button class="btn opt" onclick="ans(${j},this)">${o}</button>`).join('')}`}};
function kdetail(c){const k=KM[c],ws=S.words.filter(w=>w.w.length>1&&w.w.includes(c)).slice(0,15),sp=(STK[c]||[]).map(d=>`<path d="${d}"/>`).join('');
 return `<button class=link onclick="KD=null;render()">${SYS.back} Back</button><div class=kd><div class=big>${c}</div><h2>${k[1]}</h2><p>音 ${k[2]}<br>訓 ${k[3]}<br><small>${k[4]} strokes · ${k[5]}</small></p></div><button class=btn onclick="say('${c}')">${ic('speaker')} Listen</button>
 <h3>Stroke order</h3><svg id=sv class=sv viewBox="0 0 109 109" onclick="play()">${sp}</svg><button class="btn alt" onclick="play()">${SYS.play} Play again</button>
 <h3>Trace it</h3><div class=pad><svg class=guide viewBox="0 0 109 109">${sp}</svg><canvas id=cv width=300 height=300></canvas></div><button class="btn alt" onclick="clr()">Clear</button>
 <h3>Compounds</h3>${ws.map(w=>`<div class=row><b class=jp>${furi(w.w)}</b> ${esc(w.m)}${w.n?`<br><small>${esc(w.n)}</small>`:''}</div>`).join('')||'<p>None yet. Add one in Flash Cards.</p>'}`}
async function play(){const my=++PT,ps=[...document.querySelectorAll('#sv path')];ps.forEach(p=>{p.getAnimations().forEach(a=>a.cancel());const L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=L;p.style.opacity=0});
 for(const p of ps){if(my!=PT||!p.isConnected)return;const L=p.getTotalLength();p.style.opacity=1;await p.animate([{strokeDashoffset:L},{strokeDashoffset:0}],{duration:250+L*10,easing:'ease-in-out',fill:'forwards'}).finished}}
function pop(e){e.classList.remove('p');void e.offsetWidth;e.classList.add('p')}
function fb(g,t){const e=document.createElement('div');e.className='fb '+(g?'good':'bad');e.textContent=t||(g?['Great!','Nice!','Correct!','Awesome!'][Math.random()*4|0]+' +10 XP':'Keep practicing! +2 XP');document.body.append(e);navigator.vibrate?.(g?20:[30,40,30]);setTimeout(()=>e.remove(),1000)}
function confetti(){for(let i=0;i<40;i++){const e=document.createElement('i');e.className='cf';e.style.cssText=`left:${Math.random()*100}vw;background:${['#58CC02','#1CB0F6','#FF4B4B','#FF9600','#FFC800'][i%5]};animation-delay:${Math.random()*.4}s`;document.body.append(e);setTimeout(()=>e.remove(),2200)}}
function initCv(){const c=$('#cv');if(!c)return;const x=c.getContext('2d');x.lineWidth=10;x.lineCap=x.lineJoin='round';x.strokeStyle='#1CB0F6';let d=0;
 const p=e=>{const r=c.getBoundingClientRect();return[(e.clientX-r.left)*300/r.width,(e.clientY-r.top)*300/r.height]};
 c.onpointerdown=e=>{d=1;c.setPointerCapture(e.pointerId);x.beginPath();x.moveTo(...p(e))};c.onpointermove=e=>{if(d){x.lineTo(...p(e));x.stroke()}};c.onpointerup=()=>d=0}
function clr(){const c=$('#cv');c.width=c.width;initCv()}
// The app picks the exercise: new cards are flipped, young cards use choice, older cards add typing and listening
function emode(id){const s=S.cards[id],i=s.i||0,r=Math.random(),k='hkj'.includes(id[0]),sp=S.tts&&window.speechSynthesis;
 if(!s.r)return'flip';if(i<3)return'choice';
 if(i<10)return k&&r<.4?'type':sp&&r<.7?'listen':'choice';
 return k&&r<.5?'type':sp&&r<.8?'listen':'choice'}
function opts(id,c,L){const t=id[0],ans=L?c.say:c.a,pool=L?(t=='h'?H:t=='k'?K:t=='j'?KJ.map(k=>k[0]):[...S.custom.map(x=>x.t),...WORDS.map(w=>w[0])]):(t=='h'||t=='k'?R:t=='j'?KJ.map(k=>k[1].split(', ')[0]):[...S.custom.map(x=>x.m),...WORDS.map(w=>w[2])]),o=new Set([ans]);let n=0;
 while(o.size<4&&n++<300){const x=pool[Math.random()*pool.length|0];if(x&&x!=ans)o.add(x)}return[...o].sort(()=>Math.random()-.5)}
function pick(j){const c=card(Q[0]);AN={ok:OPS[j]==(EM=='listen'?c.say:c.a)};fb(AN.ok);say(c.say);render()}
function chk(){const v=$('#ty').value.trim().toLowerCase(),c=card(Q[0]);AN={ok:!!v&&c.acc.includes(v)};fb(AN.ok);say(c.say);render()}
function exitR(){RV=0;SH=0;vt(render)}
function setF(k){S.filter=k;SH=0;Q=dueIds();RT=Q.length;PV=0;OPK='';flip=0;fresh=1;save();vt(render)}
function review(){if(!Q.length)return `<div class=hero><div class=bounce>${ic('party')}</div><small>All done! +${SX} XP</small></div><button class=btn onclick="exitR()">Continue</button>`;
 const id=Q[0],c=card(id),cur=Math.max(0,(RT-Q.length)/RT*100),pv=PV,f=fresh;PV=cur;fresh=0;
 if(OPK!=id){OPK=id;AN=null;EM=emode(id);OPS=EM=='choice'?opts(id,c):EM=='listen'?opts(id,c,1):[];if(EM=='listen')setTimeout(()=>say(c.say),400)}
 const m=EM,shown=m=='flip'?flip:AN,sy=c.say.replace(/'/g,"");
 const ctl=m=='flip'?(flip?`<div class=row2><button class="btn no" onclick="rate(0)">Again</button><button class=btn onclick="rate(1)">Good</button><button class="btn alt" onclick="rate(2)">Easy</button></div>`:'')
  :AN?`<button class=btn onclick="rate(${AN.ok?1:0},1)">Continue</button>`
  :m=='type'?`<input id=ty autocomplete=off autocapitalize=off placeholder="Type the romaji or meaning" onkeydown="if(event.key=='Enter')chk()"><button class=btn onclick="chk()">Check</button>`
  :OPS.map((o,j)=>`<button class="btn opt" onclick="pick(${j})">${esc(o)}</button>`).join('');
 const hint=m=='flip'?'Tap to reveal':m=='listen'?'Listen and choose':'';
 return `<div class=rh><button class=ib onclick="exitR()" aria-label="Exit review">${SYS.dismiss}</button><div class=bar><div style="--f:${pv}%;--w:${cur}%"></div></div><button class=ib onclick="SH=1;render()" aria-label="Review settings">${SYS.settings}</button></div>
 <div class="fc ${f&&!document.startViewTransition?'in':''}" ${m=='flip'?`onclick="flip=1;say('${sy}');render()"`:''} style="${c.sm?'font-size:28px':''}"><div>${m=='listen'&&!AN?`<button class=spk onclick="say('${sy}')" aria-label="Play audio">${ic('speaker')}</button>`:c.f}</div>${shown?`<div class=back>${c.b}</div>`:hint?`<div class=back style="animation:none">${hint}</div>`:''}</div>${ctl}
 ${SH?`<div class=sheet onclick="SH=0;render()"><div onclick="event.stopPropagation()"><h3>What to review</h3>${[['all','Everything'],['chars','Kanji & alphabet'],['phr','Sentences & phrases']].map(([k,n])=>`<button class="btn opt${S.filter==k?' sel':''}" onclick="setF('${k}')">${n}</button>`).join('')}</div></div>`:''}`}
function cardList(){const q=SQ.trim().toLowerCase(),L=[...S.custom].reverse().filter(c=>!q||[c.t,c.m,c.s,c.u,furi(c.t).replace(/<[^>]+>/g,'')].some(x=>(x||'').toLowerCase().includes(q))),sh=ALL||q?L:L.slice(0,10);
 return(sh.map(c=>`<div class=row><div class=jp>${furi(c.t)}</div>${esc(c.m)}<br><small>${esc(c.s||'')}</small> ${lk(c.u)}</div>`).join('')||`<p>${q?'No matches.':'Nothing yet.'}</p>`)+(q||L.length<=10?'':ALL?`<button class="btn alt" onclick="ALL=0;$('#cl').innerHTML=cardList()">Show less</button>`:`<button class="btn alt" onclick="ALL=1;$('#cl').innerHTML=cardList()">View all (${L.length})</button>`)}
function forecast(){const t=td(),c=Array(14).fill(0);Object.values(S.cards).forEach(s=>{if(!s.r)return;for(let k=0;k<14;k++)if(k?s.d==td(k):s.d<=t){c[k]++;break}});const mx=Math.max(...c,1);
 return `<div class=card2><b>Coming up</b> <small>${c.slice(1,8).reduce((a,b)=>a+b,0)} reviews in the next 7 days</small><div class=fcst>${c.map((v,k)=>`<div><span>${v||''}</span><i style="height:${v/mx*100}%;animation-delay:${k*30}ms"></i><small>${k?'SMTWTFS'[new Date(td(k)+'T00:00').getDay()]:'Now'}</small></div>`).join('')}</div></div>`}
function cal(){const o=[];for(let k=-34;k<=0;k++){const d=td(k),n=S.hist[d]||0;o.push(`<i class="d${n?n<S.goal/2?1:n<S.goal?2:3:0}" title="${d}: ${n}"></i>`)}return `<div class=cal>${o.join('')}</div>`}
function theme(){document.documentElement.dataset.theme=S.theme=='dark'||(S.theme=='auto'&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light'}
function startRev(){Q=dueIds();RT=Q.length;SX=0;PV=0;fresh=1;RV=1;flip=0;OPK='';vt(render)}
function rate(g,q){if(!q)fb(g);const id=Q.shift(),s=S.cards[id],e=s.e||2.5,i=Math.max(s.i||0,1);SX+=g?10:2;fresh=1;
 if(!s.r){if(S.nd!=td()){S.nd=td();S.nn=0}S.nn++}
 s.r=(s.r||0)+1;
 if(!g){s.e=Math.max(1.3,e-.2);s.i=1;s.d=td();s.l=(s.l||0)+1;Q.splice(Math.min(3,Q.length),0,id);S.xp+=2}
 else{s.i=g==2?Math.max(3,Math.round(i*e*1.3)):Math.max(i+1,Math.round(i*e));if(g==2)s.e=e+.15;s.d=td(s.i);S.xp+=g==2?15:10}
 bump();flip=0;AN=null;OPK='';save();vt(render);if(!Q.length)confetti()}
function addC(i){let c;
 if(i!==undefined){const w=WORDS[i];c={t:w[0],m:w[2],s:'Word of the day'}}
 else{const t=$('#tx').value.trim(),m=$('#mn').value.trim();if(!t||!m)return toast('Enter Japanese and a translation');
  const u=$('#ur').value.trim();if(u&&!/^https?:\/\//i.test(u))return toast('Link must start with http:// or https://');c={t,m,s:$('#sh').value.trim(),u};
  if($('#ft').value=='word'&&$('#rd').value.trim()&&!S.words.some(w=>w.w==t))S.words.push({w:t,r:$('#rd').value.trim(),m,n:$('#nt').value.trim()});FI=null}
 c.id=String(Date.now());S.custom.push(c);S.cards['c:'+c.id]={b:0,d:td()};save();render();toast('Card added')}
function chat(){const weak=Object.keys(S.cards).filter(k=>(S.cards[k].i||0)<4&&card(k)).slice(0,10).map(k=>card(k).say).join('、');
 const p=`You are my friendly Japanese tutor. My level is ${S.lv}. Chat with me in simple Japanese at my level, adding furigana for kanji and a short English hint. Correct my mistakes gently and ask one question at a time.${weak?` Try to use these words I am still learning: ${weak}.`:''} Start now.`;
 (navigator.clipboard?navigator.clipboard.writeText(p):Promise.reject()).then(()=>toast('Prompt copied. Paste it in ChatGPT'),()=>prompt('Copy this prompt:',p));window.open('https://chatgpt.com/','_blank')}
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
function startTest(){QC=[];for(const L of['N5','N4','N3'])QS.filter(q=>q[0]==L).sort(()=>Math.random()-.5).slice(0,5).forEach(q=>{const o=q[2].map((t,i)=>[t,i==q[3]]).sort(()=>Math.random()-.5);QC.push([L,q[1],o.map(x=>x[0]),o.findIndex(x=>x[1])])});AS={i:0,sc:{N5:0,N4:0,N3:0}};go('test')}
function go(t){vt(()=>{T=t;KD=null;RV=0;ALL=0;SQ='';render()})}
function render(){document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.t==(T=='test'?'prof':T)));
 $('#hud').innerHTML=`${ic('fire')} ${st()} &nbsp; ${ic('star')} ${S.xp}`;M.innerHTML=views[T]();$('#ty')?.focus();if(KD){initCv();setTimeout(play,250)}scrollTo(0,0)}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>go(b.dataset.t));
load().then(d=>{if(d)S=Object.assign(S,d);const h=new Set(S.words.map(x=>x.w+x.r));SEED.forEach(x=>h.has(x.w+x.r)||S.words.push(x));FI=null;mig();theme();render()});
navigator.storage?.persist?.();
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');

theme();matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',theme);
document.querySelectorAll('nav i').forEach(e=>e.innerHTML=ic(e.dataset.i));
