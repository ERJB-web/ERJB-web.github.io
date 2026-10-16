"use strict";
import {scenes,subjectTracks,territorySets,evidenceStrategies} from "./doctorat-adventure.js";
(async function(){
const el=id=>document.getElementById(id),loc=new URLSearchParams(location.search).get("lang")==="en"?"en":"fr",tr=o=>typeof o==="string"?o:o?.[loc]??o?.fr??"",safe=t=>String(t??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
document.documentElement.lang=loc;
const msg=(fr,en)=>loc==="en"?en:fr;
const dict={
 brandSmall:["L'odyssée doctorale","The doctoral odyssey"],heroRank:["Doctorant • Niveau 01","PhD student • Level 01"],rigor:["Rigueur","Rigor"],energy:["Énergie","Energy"],stress:["Stress","Stress"],direction:["Direction","Supervision"],weeks:["semaines","weeks"],proofs:["preuves","evidence"],credits:["crédits","credits"],currentObjective:["OBJECTIF ACTUEL","CURRENT OBJECTIVE"],toObjective:["jusqu'à l'objectif","to objective"],moveHint:["ZQSD / WASD / flèches · Maj courir · Espace esquiver","WASD / arrows · Shift sprint · Space dodge"],autoWalk:["⇢ Rejoindre l'objectif","⇢ Walk to objective"],interact:["Interagir","Interact"],loadTxt:["Le comité prépare déjà des questions.","The committee is already drafting questions."]
};
for(const e of document.querySelectorAll("[data-i18n]")){const val=dict[e.dataset.i18n];if(val)e.textContent=msg(...val);}
let story,st=null,checkpoint=null,THREE=null,scene=null,renderer=null,camera=null,world=null,avatar=null,portal=null,arms=[],legs=[],collectibles=[],quality=1,flat=false,modalOpen=true,paused=false,auto=false,clock=0,last=0,audio=false,ctx=null,notice=0,round=0,correct=0;
let x=0,z=10,actors=[],hazards=[],invulnerable=0,dodgeCooldown=0,encounterLock=0,guidedActor=null,cameraYaw=0,photoMode=false;
const keyset=new Set(),SAVE="doctoral-game-save-v1",CHECK="doctoral-game-checkpoint-v1",distance=()=>Math.hypot(x,z+15),chap=()=>story.chapters[st.chapter];
const clone=o=>JSON.parse(JSON.stringify(o)),read=k=>{try{let o=JSON.parse(localStorage.getItem(k));return o?.version===1&&Number.isInteger(o.chapter)?o:null;}catch{return null;}},store=()=>{try{if(st)localStorage.setItem(SAVE,JSON.stringify(st));}catch{}},savepoint=()=>{checkpoint=clone(st);try{localStorage.setItem(CHECK,JSON.stringify(checkpoint));}catch{}};
const bound=(v,a=0,b=100)=>Math.max(a,Math.min(b,v));
function state(mode){return{version:1,mode,chapter:0,rigor:32,energy:85,stress:20,trust:50,time:20,proof:0,budget:45,topic:null,collected:{},encounters:{},dossier:[],subjectDesign:null,data:false,methods:false,network:false,ethics:false,course:false,poster:false,prepared:false,paper:false,reviewScore:0,choices:[],ending:null,boss:null};}
function redraw(){
 if(!st)return;
 for(const prop of ["rigor","energy","stress","trust"]){el(prop+"Num").textContent=st[prop];el(prop+"Fill").style.width=bound(st[prop])+"%";}
 for(const [prop,id] of [["time","timeNum"],["proof","proofNum"],["budget","budgetNum"]])el(id).textContent=st[prop];
 el("chapterPips").innerHTML=story.chapters.map((_,i)=>'<span class="'+(i<st.chapter?"past":i===st.chapter?"active":"")+'"></span>').join("");
 el("heroStatus").textContent=st.stress>75?msg("Éric cherche la touche « pause ».","Éric needs a pause."):st.energy<30?msg("Propulsé par du café.","Powered by coffee."):st.rigor>75?msg("Dossier défendable.","Defensible protocol."):msg("Toujours optimiste.","Still optimistic.");
}
function change(e){
 for(const [k,v] of Object.entries(e||{})){if(typeof st[k]==="number")st[k]+=v;}
 for(const k of ["rigor","energy","stress","trust"])st[k]=bound(st[k]);
 st.time=Math.max(0,st.time);st.proof=Math.max(0,st.proof);store();redraw();
}
function sound(ok=true){if(!audio)return;try{ctx ||=new(window.AudioContext||window.webkitAudioContext)();const o=ctx.createOscillator(),v=ctx.createGain();o.type="sine";o.frequency.setValueAtTime(ok?600:240,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(ok?870:140,ctx.currentTime+.2);v.gain.setValueAtTime(.028,ctx.currentTime);v.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.22);o.connect(v).connect(ctx.destination);o.start();o.stop(ctx.currentTime+.23);}catch{}}
function notify(t){let a=el("toast");a.textContent=t;a.classList.add("show");clearTimeout(notice);notice=setTimeout(()=>a.classList.remove("show"),2300);}
function subtitle(t){el("subtitle").textContent=t;el("subtitle").classList.add("visible");setTimeout(()=>el("subtitle").classList.remove("visible"),4800);}
function show(title,html,canClose=false){
 modalOpen=true;el("modalEyebrow").textContent=title;el("modalContent").innerHTML=html;el("modal").hidden=false;el("modalClose").hidden=!canClose;el("modalCard").scrollTop=0;
 setTimeout(()=>el("modalContent").querySelector("button")?.focus({preventScroll:true}),0);
}
function hide(){el("modal").hidden=true;modalOpen=false;}
function buttons(entries){const row=document.createElement("div");row.className="buttons";for(const [title,cb,secondary] of entries){const b=document.createElement("button");b.type="button";b.className=secondary?"secondary":"primary";b.textContent=title;b.onclick=cb;row.appendChild(b);}el("modalContent").appendChild(row);}
function introduction(){
 const save=read(SAVE);
 show(msg("VOICI VOTRE LETTRE D'ADMISSION","YOUR ADMISSION LETTER"),'<h1>'+msg('PROTOCOLE : <span class="accent">LA THÈSE IMPOSSIBLE</span>','PROTOCOL: <span class="accent">THE IMPOSSIBLE THESIS</span>')+'</h1><p class="lead">'+msg("Douze chapitres, trois orientations de recherche, des épreuves scientifiques, des décisions qui comptent et un véritable boss de soutenance.","Twelve chapters, three research directions, scientific challenges, consequential decisions and a real defense boss fight.")+'</p><div class="hero-illustration"><img src="../assets/portrait.jpg" alt="Éric Bernier"><div><b>'+msg("INCARNEZ ÉRIC","PLAY AS ÉRIC")+'</b><small>'+msg("Le sujet est immense. Le temps, lui, est fini.","The topic is huge. Time is finite.")+'</small></div></div><p class="micro">'+msg("Fiction pédagogique inspirée d'un véritable projet en évolution. Déplacements avec ZQSD/WASD/flèches ou tactile. Sauvegarde dans le navigateur. Son désactivé par défaut.","Educational fiction inspired by evolving research. Use WASD, arrows, touch controls or assisted walking. Local autosave. Sound off by default.")+'</p>');
 const a=[];if(save)a.push([msg("↳ Reprendre la partie","↳ Continue game"),resume]);
 a.push([msg("Commencer · Parcours doctoral","Start · PhD journey"),()=>start("normal")],[msg("Découverte · Plus accessible","Discovery · Easier"),()=>start("easy"),true],[msg("Comité de 17 personnes · Difficile","17-member committee · Hard"),()=>start("hard"),true]);buttons(a);
}
function start(mode){st=state(mode);checkpoint=null;store();hide();enter(0);}
function resume(){st=read(SAVE)||state("normal");checkpoint=read(CHECK);st.encounters ||= {};st.dossier ||= [];hide();if(st.ending){if(st.ending==="win")ending();else gameover(st.reason||"defense");return;}enter(st.chapter);}
function reset(){try{localStorage.removeItem(SAVE);localStorage.removeItem(CHECK);}catch{}st=null;checkpoint=null;introduction();}

const actorPoints=[[-3.1,4],[3.1,-4],[-3.1,-11]];
function visited(){return st?.encounters?.[st.chapter]||{};}
function seenCount(){return Object.keys(visited()).length;}
function targetPoint(){
 if(!st||flat||seenCount()>=2)return [0,-15];
 return actorPoints.map((p,i)=>({p,i})).filter(o=>!visited()[o.i]).sort((a,b)=>Math.hypot(x-a.p[0],z-a.p[1])-Math.hypot(x-b.p[0],z-b.p[1]))[0]?.p||[0,-15];
}
function missionUpdate(){
 if(!st||st.ending)return;
 const n=seenCount(),point=targetPoint();
 el("missionGoal").textContent=flat?tr(chap().goal):n<2?msg("Rencontre des témoins : ","Meet witnesses: ")+n+"/2 · "+tr(scenes[st.chapter][actorPoints.findIndex(p=>p===point)]?.name):msg("Enquête prête. Rejoins le laboratoire lumineux.","Investigation ready. Go to the glowing lab.");
 el("distance").textContent=Math.round(Math.hypot(x-point[0],z-point[1]))+" m";
}
function meetActor(i){
 if(!st||st.ending||modalOpen||visited()[i])return;
 encounterLock=performance.now()+1200;
 const b=scenes[st.chapter][i];
 show(msg("RENCONTRE SUR LE TERRAIN","FIELD ENCOUNTER"),
 '<div class="npc-dialogue"><span class="npc-icon">◆</span><h2>'+safe(tr(b.name))+'</h2></div><p class="npc-quote">'+safe(tr(b.line))+'</p><p class="micro">'+msg("À toi d'agir. Cette rencontre nourrit ton carnet de recherche.","Choose an action. This encounter adds to your field notebook.")+'</p><div class="choices">'+b.options.map((o,j)=>'<button type="button" class="choice" data-beat="'+j+'"><strong>'+safe(tr(o.title))+'</strong></button>').join("")+'</div>');
 for(const btn of el("modalContent").querySelectorAll("[data-beat]"))btn.onclick=()=>{
  const act=b.options[+btn.dataset.beat];st.encounters ||= {};st.encounters[st.chapter] ||= {};st.encounters[st.chapter][i]=true;
  st.dossier ||= [];st.dossier.push({chapter:st.chapter,role:tr(b.name),note:tr(b.clue),valid:act.good});
  change(act.delta);sound(act.good);store();
  show(act.good?msg("INDICE RECUEILLI","EVIDENCE RECORDED"):msg("UN ANGLE MORT APPARAÎT","BLIND SPOT"),
   '<h2>'+safe(tr(b.clue))+'</h2><p>'+safe(tr(act.title))+'</p>'+effectView(act.delta)+'<p class="micro">'+msg("Le carnet contient ","Notebook contains ")+st.dossier.length+msg(" observations."," observations.")+'</p>');
  buttons([[msg("Reprendre l'exploration","Resume exploration"),()=>{hide();missionUpdate();if(seenCount()>=2)subtitle(msg("La porte du laboratoire est ouverte !","The research laboratory is now open!"));}]]);
 };
}
function subjectWorkshop(){
 const pick={track:0,territory:0,evidence:0};
 const render=()=>{
  const t=subjectTracks[pick.track],ar=territorySets[pick.territory],ev=evidenceStrategies[pick.evidence];
  const section=(key,title,arr)=>'<fieldset><legend>'+title+'</legend>'+arr.map((o,i)=>'<button type="button" class="research-tile '+(pick[key]===i?'selected':'')+'" aria-pressed="'+(pick[key]===i)+'" data-'+key+'="'+i+'"><b>'+safe(tr(o.label))+'</b>'+(o.challenge?'<small>'+safe(tr(o.challenge))+'</small>':'')+'</button>').join("")+'</fieldset>';
  show(msg("LABORATOIRE DES HYPOTHÈSES","HYPOTHESIS LAB"),
   '<span class="workshop-tag">'+msg("PROBLÈME / QUESTION / TERRAIN / PREUVES","PROBLEM / QUESTION / SETTING / EVIDENCE")+'</span><h2>'+msg("Construis ton propre sujet de recherche","Build your own research topic")+'</h2><p class="lead">'+msg("Trois témoins t'ont montré que les besoins, les relations et les ressources ne sont pas interchangeables. Assemble un projet scientifique défendable.","The witnesses showed you that needs, active relationships and service supply differ. Assemble a defensible scientific project.")+'</p>'+
   '<div class="research-workbench">'+section("track","01 · "+msg("Quelle question centrale ?","Which main question?"),subjectTracks)+section("territory","02 · "+msg("Sur quel terrain ?","What setting?"),territorySets)+section("evidence","03 · "+msg("Avec quelles données ?","Using which data?"),evidenceStrategies)+'</div>'+
   '<section class="dossier-preview"><span class="workshop-tag">'+msg("AVANT-PROJET D'ÉRIC","ÉRIC'S RESEARCH PROPOSAL")+'</span><h3>'+safe(tr(t.label))+'</h3><p class="research-question">'+safe(tr(t.question))+'</p><b>'+msg("Méthode envisageable","Potential methodology")+'</b><p>'+safe(tr(t.method))+'</p><p class="micro">'+safe(tr(ar.note))+' '+safe(tr(ev.note))+'</p></section>');
  for(const key of ["track","territory","evidence"])for(const btn of el("modalContent").querySelectorAll("[data-"+key+"]"))btn.onclick=()=>{pick[key]=+btn.dataset[key];render();};
  buttons([[msg("Défendre ce protocole","Defend this proposal"),()=>{
   let effects={rigor:8,trust:4,proof:1};
   for(const d of [ar.delta,ev.delta])for(const [k,v] of Object.entries(d))effects[k]=(effects[k]||0)+v;
   const ok=pick.territory<2&&pick.evidence===0;
   st.topic=t.id;st.subjectDesign={track:t.id,setting:ar.id,source:ev.id,question:tr(t.question)};
   st.dossier.push({chapter:0,role:msg("Projet","Proposal"),note:tr(t.question),valid:ok});
   resolution(ok,tr(t.challenge)+" "+tr(ar.note)+" "+tr(ev.note),effects,{topic:t.id});
  }]]);
 };
 render();
}

function enter(i){
 if(i>=story.chapters.length){ending();return;}
 st.chapter=i;st.boss=null;x=0;z=10;auto=false;paused=false;store();redraw();
 const c=chap();el("actLabel").textContent=msg("ACTE ","ACT ")+["I","II","III"][c.act-1]+" · "+msg("CHAPITRE ","CHAPTER ")+(i+1)+"/12";el("chapterTitle").textContent=tr(c.title);el("missionGoal").textContent=tr(c.goal);
 subtitle(tr(c.quip));if(THREE)buildWorld();guidedActor=null;encounterLock=performance.now()+900;missionUpdate();savepoint();
}
function effectView(d){const names={rigor:msg("Rigueur","Rigor"),energy:msg("Énergie","Energy"),stress:"Stress",trust:msg("Direction","Supervision"),time:msg("Semaines","Weeks"),proof:msg("Preuves","Evidence"),budget:msg("Crédits","Credits")};return '<div class="result-stats">'+Object.entries(d).filter(([,v])=>v).map(([k,v])=>'<span class="'+((k==="stress"?v<0:v>0)?"good":"bad")+'">'+safe(names[k]||k)+' '+(v>0?"+":"")+v+'</span>').join("")+'</div>';}
function resolution(ok,why,effects,flags={}){
 if(st.topic==="network"&&st.chapter===5&&ok)effects={...effects,proof:(effects.proof||0)+1};
 if(st.topic==="territory"&&st.chapter===4&&ok)effects={...effects,rigor:(effects.rigor||0)+2};
 if(st.topic==="design"&&st.chapter===6&&ok)effects={...effects,trust:(effects.trust||0)+3};
 Object.assign(st,flags);st.choices.push({chapter:st.chapter,ok,detail:why});
 const basal=st.mode==="hard"?{energy:-7,stress:5,time:-1}:st.mode==="easy"?{energy:-1,time:-1}:{energy:-3,time:-1};
 const all={...basal};for(const [k,v] of Object.entries(effects||{}))all[k]=(all[k]||0)+v;change(all);sound(ok);
 if(st.energy<=0||st.stress>=100||st.trust<=0||st.time<=0||st.budget< -10){gameover(st.energy<=0?"exhaustion":st.stress>=100?"stress":st.trust<=0?"supervision":st.time<=0?"deadline":"funding");return;}
 show(ok?msg("ÉPREUVE RÉUSSIE","CHALLENGE PASSED"):msg("LE COMITÉ PREND DES NOTES","THE COMMITTEE TAKES NOTES"),'<h2>'+safe(ok?tr(chap().win||{fr:"Le protocole progresse.",en:"The proposal moves forward."}):tr(chap().lose||{fr:"Cette décision aura des conséquences.",en:"This decision has consequences."}))+'</h2><p class="lead">'+safe(why)+'</p>'+effectView(all)+'<p class="micro">'+msg("Les prochaines épreuves et la soutenance tiendront compte de ton dossier.","Your research dossier will affect subsequent challenges and the defense.")+'</p>');
 buttons([[msg("Continuer vers le prochain chapitre","Continue to the next chapter"),()=>{hide();enter(st.chapter+1);} ]]);
}
function choiceStage(c){
 show(msg("DÉCISION SCIENTIFIQUE","RESEARCH DECISION"),'<h2>'+safe(tr(c.title))+'</h2><p class="lead">'+safe(tr(c.prompt))+'</p><div class="choices">'+c.opts.map((o,i)=>'<button class="choice" type="button" data-pick="'+i+'"><strong>'+safe(tr(o.title))+'</strong><span>'+safe(tr(o.detail))+'</span></button>').join("")+'</div>');
 for(const b of el("modalContent").querySelectorAll("[data-pick]"))b.onclick=()=>{
 const o=c.opts[+b.dataset.pick],ok=(o.delta.rigor||0)>=0;
 resolution(ok,tr(o.why),o.delta,o.flags);
 };
}
function networkGraph(chosen){
 const points=[[38,138],[150,45],[260,93],[366,187],[250,252]];
 const titles=["AÎNÉS","CLSC","OC","ORG.","RÉPERT."];
 const pairs=[[0,1],[1,2],[2,3],[1,4],[0,4]];
 const edges=[...chosen].map(i=>{const [a,b]=pairs[i];return '<line x1="'+points[a][0]+'" y1="'+points[a][1]+'" x2="'+points[b][0]+'" y2="'+points[b][1]+'" stroke="'+(i<3?"#96ffde":"#ff9c91")+'" stroke-width="5" stroke-linecap="round" opacity=".85"/>';}).join("");
 return '<div class="network-box"><svg viewBox="0 0 410 290" role="img" aria-label="'+msg("Réseau interactif : les lignes apparaissent quand les relations sont sélectionnées.","Interactive network: lines appear as relationships are selected.")+'"><defs><radialGradient id="netHalo"><stop stop-color="#336c79"/><stop offset="1" stop-color="#112333"/></radialGradient></defs><g id="diagramLines">'+edges+'</g>'+points.map(([xx,yy],i)=>'<g><circle cx="'+xx+'" cy="'+yy+'" r="30" fill="url(#netHalo)" stroke="#b1ffe4" stroke-width="2"/><circle cx="'+xx+'" cy="'+yy+'" r="23" fill="#173448" stroke="#ffffff40" stroke-width="1"/><text x="'+xx+'" y="'+(yy+4)+'" fill="#e4fff9" font-size="10" font-family="sans-serif" font-weight="bold" text-anchor="middle">'+titles[i]+'</text></g>').join("")+'</svg></div>';
}
function multiStage(c){
 const chosen=new Set();
 const details=(title,text)=>'<strong>'+safe(title)+'</strong><span>'+safe(text)+'</span>';
 show(msg("ENQUÊTE & SÉLECTION","INVESTIGATION & SELECTION"),'<h2>'+safe(tr(c.title))+'</h2><p class="lead">'+safe(tr(c.prompt))+'</p>'+(c.zone==="network"?networkGraph(chosen):"") + '<div class="cards-grid">'+c.items.map((v,i)=>'<button type="button" class="source-card" data-item="'+i+'" aria-pressed="false"><em>'+String(i+1).padStart(2,"0")+'</em>'+details(tr(v[0]),tr(v[1]))+'</button>').join("")+'</div><p class="micro" id="chosenCount">0 / '+c.correct+'</p>');
 for(const b of el("modalContent").querySelectorAll("[data-item]"))b.onclick=()=>{
 const n=+b.dataset.item;if(chosen.has(n))chosen.delete(n);else if(chosen.size<c.correct)chosen.add(n);else{notify(msg("Trois dossiers maximum.","Select three files maximum."));return;}b.classList.toggle("selected",chosen.has(n));b.setAttribute("aria-pressed",String(chosen.has(n)));el("chosenCount").textContent=chosen.size+" / "+c.correct;if(c.zone==="network"){const wrap=el("modalContent").querySelector(".network-box");if(wrap)wrap.outerHTML=networkGraph(chosen);}
 };
 buttons([[msg("Valider les dossiers","Check selected files"),()=>{
 if(chosen.size!==c.correct){notify(msg("Il faut exactement trois choix.","Select exactly three options."));return;}
 const correct=[...chosen].filter(n=>c.items[n][2]===1).length,ok=correct===c.correct;
 resolution(ok,ok?tr(c.win):tr(c.lose),ok?c.reward:{...c.penalty,proof:correct},c.zone==="network"?{network:ok}:{literature:ok});
 }]]);
}
function matchStage(c){
 show(msg("LABORATOIRE MÉTHODOLOGIQUE","METHODS LAB"),'<h2>'+safe(tr(c.title))+'</h2><p class="lead">'+safe(tr(c.prompt))+'</p><div class="method-grid">'+c.rows.map((row,i)=>'<label class="method-row"><span>'+safe(tr(row))+'</span><select data-method="'+i+'"><option value="">'+msg("Sélectionner une méthode","Select a method")+'</option>'+c.methods.map((m,j)=>'<option value="'+j+'">'+safe(tr(m))+'</option>').join("")+'</select></label>').join("")+'</div>');
 buttons([[msg("Valider les associations","Check alignment"),()=>{
 const values=[...el("modalContent").querySelectorAll("[data-method]")];if(values.some(v=>!v.value)){notify(msg("Remplis les quatre associations.","Complete all four matches."));return;}
 const n=values.filter(v=>+v.value===+v.dataset.method).length,ok=n===4;
 resolution(ok,ok?tr(c.win):tr(c.lose),ok?c.reward:c.penalty,{methods:ok});
 }]]);
}
function scheduleStage(c){
 const data=c.tasks.map(t=>({label:tr(t[0]),min:t[1],h:t[2]}));
 show(msg("GESTION DU TEMPS","TIME MANAGEMENT"),'<h2>'+safe(tr(c.title))+'</h2><p class="lead">'+safe(tr(c.prompt))+'</p><div>'+data.map((r,i)=>'<label class="schedule-row"><span>'+safe(r.label)+' <small>(≥'+r.min+'h)</small></span><b id="sch'+i+'">'+r.h+' h</b><input type="range" min="0" max="24" step="1" value="'+r.h+'" data-schedule="'+i+'"></label>').join("")+'</div><div class="schedule-total"><span>'+msg("TOTAL PLANIFIÉ","TOTAL PLANNED")+'</span><b id="hoursTotal">43 / 40 h</b></div>');
 function upd(){const sum=data.reduce((v,t)=>v+t.h,0);el("hoursTotal").textContent=sum+" / 40 h";el("hoursTotal").style.color=sum>40?"#ffc0b6":"#a3ffe0";}
 for(const r of el("modalContent").querySelectorAll("[data-schedule]")){r.oninput=()=>{data[+r.dataset.schedule].h=+r.value;el("sch"+r.dataset.schedule).textContent=r.value+" h";upd();};}upd();
 buttons([[msg("Soumettre l'emploi du temps","Submit schedule"),()=>{
 const n=data.reduce((v,t)=>v+t.h,0),ok=n<=40&&data.every(t=>t.h>=t.min);
 resolution(ok,ok?tr(c.win):tr(c.lose),ok?c.reward:c.penalty,{course:ok});
 }]]);
}
function reviewStage(c){round=0;correct=0;quizRound(false);}
function quizRound(boss){
 const c=chap(),q=c.rounds[round],max=c.rounds.length;
 if(!q){if(boss)return finalBoss();const ok=correct>=2;st.reviewScore=correct;resolution(ok,ok?tr(c.win):tr(c.lose),ok?c.reward:c.penalty,{paper:ok});return;}
 show((boss?msg("JURY · QUESTION ","COMMITTEE · QUESTION "):msg("REVIEWER 2 · OBJECTION ","REVIEWER 2 · OBJECTION "))+(round+1)+"/"+max,'<h2>'+safe(tr(q.claim))+'</h2>'+(boss?'<div class="mini-brief">'+msg("Réserve de crédibilité","Credibility")+" : ✦ × "+st.boss.hp+'</div>':'<p class="lead">'+safe(tr(c.prompt))+'</p>')+'<div class="choices">'+q.options.map((o,i)=>'<button type="button" class="choice" data-answer="'+i+'"><strong>'+safe(tr(o))+'</strong></button>').join("")+'</div>');
 for(const b of el("modalContent").querySelectorAll("[data-answer]"))b.onclick=()=>{
 const ok=+b.dataset.answer===q.correct;if(ok){correct++;sound(true);}else{sound(false);change(boss?{stress:8,energy:-4,trust:-3}:{energy:-4,stress:7});if(boss)st.boss.hp-=st.mode==="hard"?2:1;}
 round++;store();
 if(boss&&st.boss.hp<=0){gameover("defense");return;}
 show(ok?msg("ARGUMENT RECEVABLE","ARGUMENT ACCEPTED"):msg("OBJECTION MAINTENUE","OBJECTION SUSTAINED"),'<h2>'+safe(tr(q.why))+'</h2><p>'+msg("Une bonne réponse implique de reconnaître les limites du devis.","A good defense recognizes what its design can and cannot establish.")+'</p>'+(boss?'<div class="mini-brief">✦ × '+st.boss.hp+'</div>':''));
 buttons([[round===max?msg("Voir la décision","See the verdict"):msg("Question suivante","Next question"),()=>quizRound(boss)]]);
 };
}
function beginBoss(c){
 const assets=[st.data,st.ethics,st.methods,st.paper,st.prepared].filter(Boolean).length;const liabilities=[st.bluff,st.overScope,st.ethicsIncident].filter(Boolean).length;
 st.boss={hp:Math.max(1,(st.mode==="easy"?5:st.mode==="hard"?2:3)+(assets>=4?1:0)-liabilities),correct:0};round=0;correct=0;store();
 show(msg("SOUTENANCE FINALE","FINAL DEFENSE"),'<h1>'+safe(tr(c.title))+'</h1><p class="lead">'+safe(tr(c.prompt))+'</p><div class="mini-brief">'+msg("Crédibilité initiale","Starting credibility")+" : ✦ × "+st.boss.hp+' · '+msg("Rigueur","Rigor")+" : "+st.rigor+"/100</div><p class='quote'>"+msg("« Merci pour cette présentation. Nous avons quelques questions. » — Phrase la plus inquiétante du campus.","“Thank you for your presentation. We have a few questions.” — The campus's most terrifying sentence.")+'</p>');
 buttons([[msg("Entrer dans la salle","Enter the auditorium"),()=>quizRound(true)]]);
}
function finalBoss(){
 const ok=correct>=3&&st.boss.hp>0;
 st.boss.correct=correct;store();
 if(!ok){gameover("defense");return;}ending();
}
function stage(){
 if(!st||st.ending)return;auto=false;
 let c=chap(),focus=st.topic;
 if(st.chapter===2)c={...c,prompt:{fr:c.prompt.fr+(focus==="network"?" Précisez ce que vous appelez un lien intersectoriel.":focus==="territory"?" Une ressource disponible n'est pas un service utilisé.":" Les recommandations devront suivre la production de résultats empiriques."),en:c.prompt.en+(focus==="network"?" Define the network ties.":focus==="territory"?" Available services are not necessarily used.":" Recommendations should build on empirical findings.")}};
 if(st.chapter===5&&focus==="territory")c={...c,prompt:{fr:"Scénario territorial : distinguez services inscrits sur la carte et liens réellement documentés par les entretiens fictifs. Sélectionnez trois liens.",en:"Territorial storyline: distinguish mapped services from ties documented in fictional interviews. Select three."}};
 if(st.chapter===5&&focus==="design")c={...c,prompt:{fr:"Avant l'atelier délibératif, quelles relations sont réellement documentées ? Sélectionnez trois liens.",en:"Before stakeholder deliberation, which ties are actually documented? Select three."}};
 if(st.chapter===11){c=clone(c);
 c.rounds[0].claim={fr:focus==="network"?"Quelles relations intersectorielles pourrez-vous réellement observer ?":focus==="territory"?"En quoi deux territoires contrastés éclairent-ils les écarts de ressources sans généralisation abusive ?":"Comment l'atelier délibératif sera-t-il fondé sur les données empiriques ?",en:focus==="network"?"Which intersectoral ties will you actually observe?":focus==="territory"?"How will two contrasting areas inform service gaps without overgeneralizing?":"How will deliberation build upon empirical observations?"};
 if(!st.data)c.rounds[1].claim={fr:"Les données promises sont inaccessibles. Quel plan de repli réaliste avez-vous ?",en:"Your promised data are unavailable. What is your feasible fallback?"};
 if(!st.ethics)c.rounds[3].claim={fr:"L'éthique n'est pas réglée. Comment protégerez-vous les réseaux de petite taille ?",en:"Ethics remain unresolved. How will you protect small networks?"};
 }
 if(st.chapter===0){subjectWorkshop();return;}
 switch(c.type){
 case"choice":choiceStage(c);break;
 case"multi":multiStage(c);break;
 case"match":matchStage(c);break;
 case"schedule":scheduleStage(c);break;
 case"review":reviewStage(c);break;
 case"boss":beginBoss(c);break;
 }
}
function gameover(reason){
 if(!st)return;st.ending="gameover";st.reason=reason;store();sound(false);
 const why={
 exhaustion:msg("Le chercheur n'a plus d'énergie. Une thèse exige des marges et une organisation soutenable.","The researcher has no energy left. A thesis needs sustainable work planning."),
 stress:msg("La pression a dépassé toutes les marges. Il faut revoir les priorités.","Stress overwhelmed all available buffer. Revisit priorities."),
 supervision:msg("Le comité de direction ne peut pas valider un protocole sans périmètre défendable.","Supervision cannot back an undefended design."),
 deadline:msg("Le calendrier s'est épuisé. Un projet faisable renonce à certaines ambitions.","The timeline has expired. Feasible projects require trade-offs."),
 funding:msg("Les ressources financières ne couvrent plus le programme proposé.","The project has run out of funding."),
 defense:msg("Le jury demande de revoir des éléments fondamentaux du raisonnement.","The committee asks for fundamental revision of the reasoning.")
 }[reason]||msg("Le protocole a besoin d'une révision fondamentale.","The protocol needs fundamental revision.");
 show("GAME OVER",'<h1>'+msg('LE PROTOCOLE <span class="accent">A CRAQUÉ.</span>','THE PROTOCOL <span class="accent">COLLAPSED.</span>')+'</h1><p class="lead">'+safe(why)+'</p><p>'+msg("L'échec est fictif, pédagogique et réversible. Ce n'est ni une appréciation d'Éric ni une évaluation de sa véritable thèse.","This outcome is fictional, educational and reversible. It is not an assessment of Éric or his real thesis.")+'</p><div class="mini-brief">'+msg("Chapitre atteint","Reached chapter")+" : "+(st.chapter+1)+"/12 · "+msg("Rigueur","Rigor")+" : "+st.rigor+"/100</div>");
 const a=[];if(checkpoint)a.push([msg("↶ Rejouer ce chapitre","↶ Retry this chapter"),()=>{st=clone(checkpoint);st.ending=null;store();hide();enter(st.chapter);}]);a.push([msg("Recommencer l'aventure","Restart adventure"),reset,true]);buttons(a);
}
function ending(){
 if(!st)return;st.ending="win";store();const n=st.boss?.correct??0,excellent=n===5&&st.rigor>=85&&st.data&&st.ethics&&st.methods&&st.course,good=n>=4&&st.rigor>=60;
 const title=excellent?msg("PROTOCOLE ACCEPTÉ AVEC ÉLOGES","PROTOCOL APPROVED WITH DISTINCTION"):good?msg("PROTOCOLE ACCEPTÉ","PROTOCOL APPROVED"):msg("ACCEPTÉ SOUS CONDITIONS","CONDITIONALLY APPROVED");
 const lead=excellent?msg("Le comité est convaincu. Reviewer 2 garde le silence pendant quatre secondes. Un record universitaire.","The committee is convinced. Reviewer 2 stays quiet for four seconds. A university record."):good?msg("La soutenance est réussie. L'histoire continue : la vraie recherche commence maintenant.","The defense succeeded. The story continues: the actual research begins now."):msg("Le comité reconnaît la pertinence du travail et demande des améliorations ciblées.","The committee recognizes the value of the project and asks for targeted revisions.");
 const topic=st.topic==="network"?msg("Réseaux intersectoriels","Intersectoral networks"):st.topic==="territory"?msg("Ressources territoriales","Territorial resources"):msg("Recommandations avec les partenaires","Partner-led recommendations");
 const epilogue=st.topic==="network"?msg("Épilogue : Éric enquête sur les collaborations réelles, pas seulement sur des organigrammes.","Epilogue: Éric studies real collaborations, not just organization charts."):st.topic==="territory"?msg("Épilogue : deux territoires, des ressources et des réalités différentes.","Epilogue: two territories, unequal services and different realities."):msg("Épilogue : les partenaires sont consultés sur des constats explicites.","Epilogue: stakeholders deliberate over explicit findings.");
 show(msg("FIN DE CAMPAGNE · SOUTENANCE","CAMPAIGN COMPLETE · DEFENSE"),'<h1>'+title+'</h1><p class="lead">'+lead+'</p><div class="mini-brief"><b>'+msg("Orientation","Research focus")+'</b> : '+topic+'</div><div class="result-stats"><span>'+msg("Rigueur","Rigor")+' '+st.rigor+'/100</span><span>'+msg("Questions réussies","Correct answers")+' '+n+'/5</span><span>'+msg("Preuves","Evidence")+' '+st.proof+'</span><span>'+msg("Semaines restantes","Weeks remaining")+' '+st.time+'</span></div><p>'+safe(epilogue)+'</p><p class="quote">'+msg("SCÈNE POST-GÉNÉRIQUE : « Bonjour. Reviewer 2 ici. Quelques suggestions mineures… » — pièce jointe de 42 pages.","POST-CREDITS: “Reviewer 2 here. Just a few minor suggestions...” — attachment: 42 pages.")+'</p>');
 buttons([[msg("Rejouer un autre scénario","Play another storyline"),reset],[msg("Visiter le site d'Éric","Visit Éric's website"),()=>{location.href="../#contact";},true]]);
}
function interact(){if(!st||st.ending||modalOpen)return;if(!flat&&(seenCount()<2||distance()>2.5))return;stage();}
const held=move=>{const mapping={up:"ArrowUp",down:"ArrowDown",left:"ArrowLeft",right:"ArrowRight"};return mapping[move];};
for(const b of document.querySelectorAll("[data-move]")){const k=held(b.dataset.move);const on=e=>{e.preventDefault();keyset.add(k);auto=false;b.classList.add("pressed");},off=e=>{e.preventDefault();keyset.delete(k);b.classList.remove("pressed");};b.addEventListener("pointerdown",on);b.addEventListener("pointerup",off);b.addEventListener("pointercancel",off);b.addEventListener("pointerleave",off);}
addEventListener("keydown",e=>{
 if(!modalOpen&&["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space","KeyW","KeyA","KeyS","KeyD","KeyQ","KeyZ"].includes(e.code))e.preventDefault();
 keyset.add(e.code);
 if(!modalOpen&&e.code==="Space"){e.preventDefault();dodge();}
 if(e.code==="Escape"&&!modalOpen&&st)pauseMenu();
});addEventListener("keyup",e=>keyset.delete(e.code));addEventListener("blur",()=>keyset.clear());
el("actionBtn").onclick=interact;
function dodge(){
 if(!st||modalOpen||flat||dodgeCooldown>0)return;
 let dx=Number(keyset.has("ArrowRight")||keyset.has("KeyD"))-Number(keyset.has("ArrowLeft")||keyset.has("KeyA")||keyset.has("KeyQ"));
 let dz=Number(keyset.has("ArrowDown")||keyset.has("KeyS"))-Number(keyset.has("ArrowUp")||keyset.has("KeyW")||keyset.has("KeyZ"));
 if(!dx&&!dz)dz=-1;const d=Math.hypot(dx,dz);x=bound(x+dx/d*2.85,-5.15,5.15);z=bound(z+dz/d*2.85,-16,18);
 dodgeCooldown=2.4;invulnerable=.75;sound(true);
}
el("dodgeBtn")?.addEventListener("click",dodge);
el("photoBtn")?.addEventListener("click",()=>{photoMode=!photoMode;cameraYaw=photoMode?Math.PI:0;el("photoBtn").setAttribute("aria-pressed",String(photoMode));notify(photoMode?msg("Caméra portrait : admire le personnage de face.","Portrait camera: view the character from the front."):msg("Caméra de suivi rétablie.","Follow camera restored."));});
el("autoWalk").onclick=()=>{if(st&&!modalOpen){auto=true;notify(msg("Guidage vers le prochain objectif.","Guidance to the next objective."));}};
el("world").addEventListener("pointerdown",e=>{
 if(!THREE||!st||modalOpen||st.ending)return;
 const pointer=new THREE.Vector2(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);
 const ray=new THREE.Raycaster();ray.setFromCamera(pointer,camera);
 const hit=ray.intersectObjects(actors.map(a=>a.group),true)[0];if(!hit)return;
 let item=hit.object;while(item&&!Number.isInteger(item.userData?.actor))item=item.parent;
 const i=item?.userData.actor;if(i===undefined||visited()[i])return;
 if(Math.hypot(x-actorPoints[i][0],z-actorPoints[i][1])<2.0)meetActor(i);
 else{guidedActor=i;auto=true;}
});

el("modalClose").onclick=()=>{if(st&&!st.ending){paused=false;hide();}};
function pauseMenu(){if(!st||modalOpen)return;paused=true;show(msg("PAUSE DOCTORALE","DOCTORAL BREAK"),'<h2>'+msg("Une pause n'est pas un échec.","A break is not a failure.")+'</h2><p class="lead">'+msg("La progression est automatiquement enregistrée sur cet appareil.","Progress is saved locally on your device.")+'</p>');buttons([[msg("Reprendre","Resume"),()=>{paused=false;hide();}],[msg("Nouvelle partie","New game"),reset,true],[msg("Revenir au site","Back to website"),()=>location.href="../",true]]);}
el("pauseBtn").onclick=pauseMenu;
el("audioBtn").onclick=()=>{audio=!audio;el("audioBtn").textContent=audio?"♫":"♪";notify(audio?msg("Son activé","Sound on"):msg("Son désactivé","Sound off"));if(audio)sound();};
el("fullBtn").onclick=()=>document.fullscreenElement?document.exitFullscreen?.().catch(()=>{}):document.documentElement.requestFullscreen?.().catch(()=>{});
el("qualityBtn").onclick=()=>{quality=quality===1?.67:quality===.67?1.3:1;resize();notify(msg("Qualité graphique","Graphics quality")+" "+Math.round(quality*100)+"%");};
el("langBtn").textContent=loc==="en"?"FR":"EN";el("langBtn").onclick=()=>{const url=new URL(location.href);url.searchParams.set("lang",loc==="en"?"fr":"en");location.assign(url.href);};
function mesh(geom,mat,x0=0,y0=0,z0=0,root=world){const o=new THREE.Mesh(geom,mat);o.position.set(x0,y0,z0);o.castShadow=true;o.receiveShadow=true;root.add(o);return o;}
function mat(c,metal=.1,rough=.6,emit=0){return new THREE.MeshStandardMaterial({color:c,metalness:metal,roughness:rough,emissive:emit?c:0x000000,emissiveIntensity:emit});}
function box(a,b,c,m,x0,y0,z0,root=world){return mesh(new THREE.BoxGeometry(a,b,c),m,x0,y0,z0,root);}
function orb(r,m,x0,y0,z0,root=world){return mesh(new THREE.SphereGeometry(r,18,12),m,x0,y0,z0,root);}
function column(r,h,m,x0,y0,z0,root=world){return mesh(new THREE.CylinderGeometry(r*.9,r,h,12),m,x0,y0,z0,root);}

function npc(i){
 const p=actorPoints[i],group=new THREE.Group();group.position.set(p[0],0,p[1]);group.userData.actor=i;world.add(group);
 const tones=[0x597d8d,0x655d85,0x648b77],skins=[0xc79779,0xb88765,0xe0ad8c],hairs=[0x26252b,0x493329,0x382529];
 const cloth=mat(tones[i]),skin=mat(skins[i]),hair=mat(hairs[i]),eye=mat(0x142433);
 const torso=column(.35,1.15,cloth,0,1.28,0,group);torso.scale.z=.82;
 orb(.31,skin,0,2.12,0,group);const hairCap=orb(.31,hair,0,2.34,.03,group);hairCap.scale.y=.55;
 for(const side of [-1,1]){const limb=box(.18,.82,.2,cloth,side*.43,1.47,0,group);limb.rotation.z=side*.13;
 box(.26,.9,.28,mat(0x1c2b3c),side*.18,.49,0,group);orb(.032,eye,side*.12,2.13,.284,group);}
 const c=document.createElement("canvas");c.width=512;c.height=108;const g=c.getContext("2d");
 g.fillStyle="#0b2633";g.fillRect(0,0,512,108);g.strokeStyle="#88edda";g.lineWidth=4;g.strokeRect(3,3,506,102);
 g.font="bold 31px sans-serif";g.fillStyle="#f1fff9";g.textAlign="center";
 const words=tr(scenes[st.chapter][i].name);g.fillText(words.length>25?words.slice(0,24)+"…":words,256,68);
 const label=mesh(new THREE.PlaneGeometry(2.85,.60),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false,side:THREE.DoubleSide}),0,3.1,0,group);
 label.castShadow=false;
 const ring=mesh(new THREE.TorusGeometry(.77,.047,8,36),mat(0x9bffe1,.2,.2,.6),0,.08,0,group);ring.rotation.x=Math.PI/2;
 return {index:i,group,label,ring,px:p[0],pz:p[1]};
}
function player(){
 avatar=new THREE.Group();world.add(avatar);
 const skin=mat(0xe2b49b),hair=mat(0x292127),shirt=mat(0xe2e8ed),stripe=mat(0x94b2c8),pant=mat(0x1c3041),shoes=mat(0x382e2b);
 const chest=mesh(new THREE.CylinderGeometry(.37,.42,1.1,18),shirt,0,1.5,0,avatar);chest.scale.z=.8;
 for(let j=-4;j<=4;j++)box(.012,.97,.013,stripe,j*.075,1.49,-.295,avatar);
 const collar=box(.19,.23,.05,mat(0xf7fafb),-.14,2.015,-.25,avatar);collar.rotation.z=-.4;
 const collar2=box(.19,.23,.05,mat(0xf7fafb),.14,2.015,-.25,avatar);collar2.rotation.z=.4;
 column(.14,.24,skin,0,2.15,0,avatar);
 const head=orb(.39,skin,0,2.49,-.015,avatar);head.scale.set(.87,1.1,.9);
 const crown=orb(.37,hair,0,2.78,.02,avatar);crown.scale.set(.94,.47,.93);
 for(let j=0;j<9;j++){const angle=j/9*Math.PI*2;orb(.105,hair,Math.sin(angle)*.24,2.79,Math.cos(angle)*.21,avatar);}
 const beard=orb(.21,hair,0,2.27,-.30,avatar);beard.scale.set(1.1,.38,.65);
 for(let side of [-1,1]){orb(.032,mat(0x19242b),side*.12,2.49,-.34,avatar);}
 // The actual authorized on-site portrait supplies facial likeness, not a generic AI face.
 const cv=document.createElement("canvas");cv.width=256;cv.height=340;const g=cv.getContext("2d");const portrait=new Image();portrait.decoding="async";
 portrait.onload=()=>{
  g.clearRect(0,0,256,340);g.save();g.beginPath();g.ellipse(128,170,116,165,0,0,Math.PI*2);g.clip();
  g.drawImage(portrait,275,20,365,550,0,0,256,340);g.restore();
  const tex=new THREE.CanvasTexture(cv);tex.colorSpace=THREE.SRGBColorSpace;
  const face=mesh(new THREE.PlaneGeometry(.65,.86),new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,side:THREE.DoubleSide}),0,2.50,-.357,avatar);
  face.renderOrder=3;face.castShadow=false;face.receiveShadow=false;
 };
 portrait.src="../assets/portrait.jpg";
 arms=[];legs=[];for(const side of [-1,1]){
  const arm=new THREE.Group();arm.position.set(side*.45,1.92,0);avatar.add(arm);
  mesh(new THREE.CapsuleGeometry(.12,.51,4,9),shirt,0,-.44,0,arm);orb(.12,skin,0,-.84,0,arm);arms.push(arm);
  const leg=new THREE.Group();leg.position.set(side*.19,1.02,0);avatar.add(leg);
  mesh(new THREE.CapsuleGeometry(.15,.62,4,9),pant,0,-.54,0,leg);box(.32,.16,.49,shoes,0,-.99,-.13,leg);legs.push(leg);
 }
 avatar.position.set(0,0,10);
}
function buildWorld(){
 if(!THREE)return;if(world){scene.remove(world);world.traverse(o=>{if(o.isMesh){o.geometry?.dispose();o.material?.dispose();}});}
 world=new THREE.Group();scene.add(world);actors=[];hazards=[];
 const c=chap(),palette={
 campus:[0x071522,0x20354d,0x8beddf],library:[0x091521,0x3c3441,0xf4c58c],committee:[0x0a1626,0x313b58,0xd3b8ff],data:[0x071726,0x17394d,0x81f0f5],
 methods:[0x0b1922,0x254842,0x8bffbf],network:[0x0a1728,0x29445a,0x96f5eb],ethics:[0x101424,0x403044,0xeab0db],calendar:[0x10182b,0x384457,0xf4cf98],
 congress:[0x10172b,0x3c3c4e,0xd8b5ff],review:[0x171627,0x483044,0xf8a7bb],seminar:[0x0b1b27,0x29444d,0x96f1d0],defense:[0x0a1426,0x353959,0xf6d698]
 }[c.zone];const [sky,tower,accent]=palette;scene.background=new THREE.Color(sky);scene.fog=new THREE.FogExp2(sky,.018);
 const slate=mat(tower),line=mat(0x57738b,.48,.42),road=mat(0x22344c,.12,.78),glass=mat(0x255675,.58,.19,.16),glow=mat(accent,.58,.25,.57),gold=mat(0xd4b994,.6,.22);
 box(90,.5,110,mat(0x111e2c),0,-.37,-5);box(10,.19,52,road,0,-.05,-6);
 for(let z0=-32;z0<=20;z0+=2.1){box(9.3,.025,.035,line,0,.06,z0);for(const xx of [-4.55,4.55])box(.055,.04,1.8,line,xx,.07,z0);}
 for(let side of [-1,1])for(let k=0;k<5;k++){
 const xx=side*(9.6+(k%2)*1.1),zz=-24+k*10,h=6+(k+c.act)%3*2;
 box(7,h,7,slate,xx,h/2,zz);box(7.45,.25,7.55,line,xx,h+.1,zz);
 for(let y=1.3;y<h;y+=2.1)for(const shift of [-2,0,2]){
 box(1.1,1.42,.10,glass,xx+shift,y,zz+(side===1?3.55:-3.55));
 box(.72,.055,.12,glow,xx+shift,y-.25,zz+(side===1?3.62:-3.62));
 }
 column(.20,h,line,xx-3.2,h/2,zz+3.5);column(.20,h,line,xx+3.2,h/2,zz+3.5);
 if(k%2===0){column(.09,5,line,side*5.7,2.45,zz+1);orb(.28,glow,side*5.7,5.05,zz+1);}
 }
 const end=new THREE.Group();end.position.set(0,0,-24);world.add(end);
 for(const xx of [-4.2,4.2]){box(2.0,9.2,3.3,slate,xx,4.6,0,end);column(.56,9,line,xx,4.5,1.48,end);orb(.55,glow,xx,9.5,1.48,end);}
 box(10.8,1.35,4,line,0,9.2,0,end);box(7.4,2.1,.28,glass,0,7.35,1.52,end);
 const deco=["library","data","methods","network","review","calendar"].includes(c.zone);
 if(deco)for(const xx of [-6.25,6.25])for(let zz=-6;zz>-23;zz-=5){
  box(2,1.25,1.35,slate,xx,.62,zz);
  if(c.zone==="library"){for(let i=0;i<5;i++)box(.21,.6,.55,mat([0x9f6882,0x5d91bd,0xc4b68a][i%3]),xx-.65+i*.32,1.55,zz);}
  else{box(1.55,.88,.1,glass,xx,1.6,zz);if(c.zone==="network")for(let j=0;j<3;j++)orb(.12,glow,xx+(j-1)*.52,2.23+j%2*.26,zz);}
 }
 if(["congress","defense","seminar","committee"].includes(c.zone))for(let zz=-6;zz>-23;zz-=3.4)for(const xx of [-6,6]){box(2.9,.70,1.35,road,xx,.35,zz);box(2.6,.5,.7,slate,xx,1,zz+.1);}
 portal=new THREE.Group();portal.position.set(0,2.65,-15);world.add(portal);
 mesh(new THREE.TorusGeometry(2.1,.13,12,72),glow,0,0,0,portal);
 mesh(new THREE.TorusGeometry(1.69,.034,8,72),gold,0,0,.04,portal);
 const disk=mesh(new THREE.CircleGeometry(1.6,54),new THREE.MeshBasicMaterial({color:accent,opacity:.085,transparent:true,side:THREE.DoubleSide,depthWrite:false}),0,0,.06,portal);disk.castShadow=false;
 for(let k=0;k<12;k++){const a=k/12*Math.PI*2,p=box(.08,.36,.1,glow,Math.cos(a)*2.47,Math.sin(a)*2.47,.08,portal);p.rotation.z=-a;}
 const ambientPortal=new THREE.PointLight(accent,21,17);ambientPortal.position.set(0,3.5,-14);world.add(ambientPortal);
 const cvs=document.createElement("canvas");cvs.width=1024;cvs.height=256;const cc=cvs.getContext("2d");cc.fillStyle="#0b2631";cc.fillRect(0,0,1024,256);cc.fillStyle="#b3ffe8";cc.font="bold 43px sans-serif";cc.textAlign="center";cc.fillText("DOCTORAL CAMPUS",512,90);cc.fillStyle="#ffffff";cc.font="bold 38px sans-serif";let title=tr(c.title);if(title.length>37)title=title.slice(0,35)+"…";cc.fillText(title,512,160);
 const t=new THREE.CanvasTexture(cvs);mesh(new THREE.PlaneGeometry(8,2),new THREE.MeshBasicMaterial({map:t,transparent:true}),0,8.7,-22);
 const stars=[],geo=new THREE.BufferGeometry();for(let k=0;k<160;k++)stars.push((Math.random()-.5)*115,5+Math.random()*35,(Math.random()-.5)*105);geo.setAttribute("position",new THREE.Float32BufferAttribute(stars,3));world.add(new THREE.Points(geo,new THREE.PointsMaterial({color:0xd5fdfa,size:.065,transparent:true,opacity:.75})));
 player();
 for(let i=0;i<3;i++)actors.push(npc(i));
 if(st.chapter>0)for(let i=0;i<2;i++){
  const group=new THREE.Group();group.position.set(i?1.7:-1.9,2,i?-10:-2);world.add(group);
  for(let j=0;j<6;j++){const paper=box(.75,.085,.54,mat(j%2?0xef8b9f:0x514366,.2,.55,.3),
  Math.cos(j*2.2)*.43,(j-3)*.16,Math.sin(j*2.2)*.31,group);paper.rotation.z=j*.24;}
  orb(.20,mat(0xfa93b3,.2,.35,.55),0,.43,0,group);
  hazards.push({group,px:group.position.x,pz:group.position.z});
 }
 collectibles=[];
 const prizes=[
 {type:"coffee",x:-3.25,z:4.5,delta:{energy:8,budget:-1},label:msg("Café salvateur : énergie +8, budget -1","Coffee pickup: energy +8, funding -1"),color:0xe6c286},
 {type:"paper",x:3.2,z:-4.5,delta:{proof:1,rigor:2},label:msg("Article vérifié : preuve +1","Verified paper: evidence +1"),color:0x88f5cf},
 {type:"mail",x:-3.15,z:-10,delta:{trust:3,stress:4},label:msg("Mail de la direction à minuit : soutien +3, stress +4","Midnight supervisor email: support +3, stress +4"),color:0xcaabff}
 ];
 for(const p of prizes){const key=st.chapter+"-"+p.type;if(st.collected?.[key])continue;
 const group=new THREE.Group();group.position.set(p.x,1.1,p.z);world.add(group);
 mesh(new THREE.OctahedronGeometry(.42),mat(p.color,.6,.2,.8),0,0,0,group);
 const ring=mesh(new THREE.TorusGeometry(.72,.04,8,34),mat(p.color,.4,.3,.55),0,-.48,0,group);ring.rotation.x=Math.PI/2;
 group.add(new THREE.PointLight(p.color,3,4));collectibles.push({...p,key,group});}
 camera.position.set(0,6,19);camera.lookAt(0,1.5,0);
}
function resize(){if(!renderer)return;renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.8)*quality);renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.fov=innerWidth<670?69:58;camera.updateProjectionMatrix();}
function tick(ts){
 requestAnimationFrame(tick);const dt=Math.min(.046,((ts-last)||16)/1000);last=ts;
 if(!THREE||!renderer)return;
 if(st&&!st.ending&&!modalOpen&&!paused&&!document.hidden){
  invulnerable=Math.max(0,invulnerable-dt);dodgeCooldown=Math.max(0,dodgeCooldown-dt);
  const dx=Number(keyset.has("ArrowRight")||keyset.has("KeyD"))-Number(keyset.has("ArrowLeft")||keyset.has("KeyA")||keyset.has("KeyQ"));
  const dz=Number(keyset.has("ArrowDown")||keyset.has("KeyS"))-Number(keyset.has("ArrowUp")||keyset.has("KeyW")||keyset.has("KeyZ"));
  let vx=dx,vz=dz;
  if(auto&&dx===0&&dz===0){
   const t=guidedActor===null?targetPoint():actorPoints[guidedActor];
   vx=t[0]-x;vz=t[1]-z;
   if(Math.hypot(vx,vz)<1.4){auto=false;guidedActor=null;vx=vz=0;}
  }else if(dx||dz){auto=false;guidedActor=null;}
  const d=Math.hypot(vx,vz),walk=d>.01;
  const sprint=(keyset.has("ShiftLeft")||keyset.has("ShiftRight"))&&st.energy>12;
  const speed=sprint?9.7:6.4;
  if(walk){x=bound(x+vx/d*speed*dt,-5.15,5.15);z=bound(z+vz/d*speed*dt,-16,18);avatar.rotation.y+=(Math.atan2(-vx,-vz)-avatar.rotation.y)*Math.min(1,8*dt);}
  avatar.position.set(x,walk?Math.sin(ts*.011)*.055:0,z);
  arms.forEach((a,i)=>a.rotation.x=walk?Math.sin(ts*.013*(sprint?1.4:1)+i*Math.PI)*-.50:0);
  legs.forEach((a,i)=>a.rotation.x=walk?Math.sin(ts*.013*(sprint?1.4:1)+i*Math.PI)*.59:0);
  for(const p of collectibles){
   p.group.rotation.y+=dt*1.4;p.group.position.y=1.1+Math.sin(ts*.002+p.x)*.15;
   if(p.group.visible&&Math.hypot(x-p.x,z-p.z)<1.26){p.group.visible=false;st.collected ||= {};st.collected[p.key]=true;change(p.delta);notify(p.label);sound(true);}
  }
  for(const a of actors){
   a.group.position.x=a.px+Math.sin(ts*.00059+a.index*2)*.32;
   a.group.position.z=a.pz+Math.cos(ts*.00052+a.index)*.26;
   a.group.rotation.y=Math.sin(ts*.0007+a.index)*.19;
   a.label.quaternion.copy(camera.quaternion);
   a.label.visible=!visited()[a.index];a.ring.visible=!visited()[a.index];
   if(!visited()[a.index]&&performance.now()>encounterLock&&Math.hypot(x-a.group.position.x,z-a.group.position.z)<1.57){meetActor(a.index);break;}
  }
  for(let i=0;i<hazards.length;i++){
   const h=hazards[i];
   h.group.position.x=h.px+Math.sin(ts*.0008+i)*1.4;
   h.group.position.z=h.pz+Math.cos(ts*.0005+i)*.8;
   h.group.rotation.y+=dt;
   if(invulnerable<=0&&Math.hypot(x-h.group.position.x,z-h.group.position.z)<1.08){
    invulnerable=2.4;change({stress:7,energy:-3});sound(false);
    notify(msg("⚠ Dossier hostile : stress +7. Espace pour esquiver !","⚠ Hostile paperwork: stress +7. Dodge with Space!"));
   }
  }
  if(!modalOpen&&seenCount()>=2&&distance()<2.28&&performance.now()>encounterLock)stage();
  const offset=new THREE.Vector3(Math.sin(cameraYaw)*9.4,5.15,Math.cos(cameraYaw)*9.4);
  camera.position.lerp(new THREE.Vector3(x,0,z).add(offset),Math.min(1,dt*4));
  camera.lookAt(x,photoMode?1.65:1.5,photoMode?z:z-3.6);
  portal.rotation.z=Math.sin(ts*.0006)*.06;portal.children[1].rotation.z+=dt*.25;
  const point=targetPoint(),dd=Math.hypot(x-point[0],z-point[1]);
  el("distance").textContent=Math.round(dd)+" m";el("markerDistance").textContent=Math.round(dd)+" m";
  el("actionBtn").disabled=seenCount()<2||distance()>2.5;
  const projected=new THREE.Vector3(point[0],seenCount()>=2?3.65:3.4,point[1]).project(camera),mark=el("questMarker");
  mark.style.opacity=projected.z<1&&Math.abs(projected.x)<1&&Math.abs(projected.y)<1?"1":"0";
  mark.style.left=((projected.x+1)*.5*innerWidth)+"px";mark.style.top=((-projected.y+1)*.5*innerHeight-35)+"px";
 }
 if(!document.hidden)renderer.render(scene,camera);
}
try{
 const res=await fetch("./scenario.json",{cache:"no-store"});if(!res.ok)throw Error("Scenario file not found");story=await res.json();
 if(!Array.isArray(story.chapters)||story.chapters.length!==12)throw Error("Scenario incomplete");
}catch(error){
 el("loading").hidden=true;show(msg("ERREUR DE CHARGEMENT","LOAD ERROR"),'<h2>'+msg("Le scénario est introuvable.","The story could not be loaded.")+'</h2><p>'+safe(error.message)+'</p>');return;
}
try{
 THREE=await import("https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js");
 renderer=new THREE.WebGLRenderer({canvas:el("world"),antialias:true,powerPreference:"high-performance"});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.8));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.8;
 scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(58,innerWidth/innerHeight,.1,160);
 scene.add(new THREE.HemisphereLight(0xcce7ff,0x162339,2.35));
 const sun=new THREE.DirectionalLight(0xffe1bd,3.5);sun.position.set(-12,25,14);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-25;sun.shadow.camera.right=25;sun.shadow.camera.top=35;sun.shadow.camera.bottom=-35;scene.add(sun);
 resize();addEventListener("resize",resize,{passive:true});requestAnimationFrame(tick);
}catch(error){
 console.warn("WebGL unavailable — narrative-only mode",error);flat=true;el("game").classList.add("flat-mode");el("autoWalk").hidden=true;el("actionBtn").disabled=false;
 el("missionPanel").insertAdjacentHTML("afterend",'<div class="flat-scene"><h2>'+msg("Campus narratif","Story-mode campus")+'</h2><p>'+msg("La 3D n'est pas disponible ici, mais toutes les épreuves restent jouables.","3D rendering is unavailable, but every challenge remains playable.")+'</p></div>');
}
el("loading").hidden=true;introduction();
})();