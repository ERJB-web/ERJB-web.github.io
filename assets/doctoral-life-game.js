import {milestones,initialCareerState,availableMilestones,assessDesign,checkDefense} from "./doctoral-life-data.js";
import {playMission,methods} from "./doctoral-life-challenges.js";
import {createAdventureWorld,PLACES} from "./doctoral-world.js";
import {createScore} from "./doctoral-sound.js";
const $=id=>document.getElementById(id),esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const KEY="doctoral-life-four-year-v1";
const score=createScore();
let worldController=null;
const kindToWorld=(t)=>{const k=typeof t==="string"?t:t?.kind;
 if(k==="admin")return "university";
 if(k==="course"||k==="exam")return t?.id==="preDefense"?"auditorium":"classroom";
 if(k==="literature")return "library";
 if(k==="design"||k==="analysis"||k==="ethics")return "laboratory";
 if(k==="funding"||k==="social"||k==="writing")return "office";
 if(k==="work")return "home";
 if(k==="publication")return "conference";
 if(k==="field")return "field";
 if(k==="defense")return "auditorium";return "university";};
const locations=[
["admin","Administration",-18,0,0x8bc7ee],["course","École doctorale",-10,-13,0xeac998],
["literature","Bibliothèque",0,-20,0xbca9fc],["design","Laboratoire des méthodes",12,-13,0x8ef3d3],
["funding","Bourses",20,0,0xffdd93],["work","Vie doctorale",20,12,0xeab4a8],
["social","Direction & partenariats",11,20,0xb9b5f3],["field","Terrain",0,25,0xbaf7b3],
["ethics","Comité éthique",-11,20,0xf5b5dd],["analysis","Centre des analyses",-21,12,0x9ee9f4],
["writing","Rédaction",-21,-13,0xa0e2d4],["publication","Publications",2,11,0xd3aff6],
["exam","Amphithéâtre",0,-29,0xf1c1ae]];
const area=kind=>locations.find(t=>t[0]===(kind==="defense"?"exam":kind));
let st=null,THREE=null,renderer=null,scene=null,camera=null,character=null,sprite=null,texture=null,portrait=null,frame=-1,px=0,pz=2,last=0,travel=null,modal=false,entered=null,webgl=false,chosen=null,flashTimeout=0;
const pressed=new Set(),complete=id=>st?.completed?.includes(id),openTasks=()=>st?availableMilestones(st):[];
const clamp=(n,low=0,high=100)=>Math.min(high,Math.max(low,n));
const read=()=>{try{let r=JSON.parse(localStorage.getItem(KEY));return r?.version===1&&Array.isArray(r.completed)?r:null;}catch{return null;}};
const persist=()=>{try{if(st)localStorage.setItem(KEY,JSON.stringify(st));}catch{}};
function alertGame(txt){$("flash").textContent=txt;$("flash").classList.add("visible");clearTimeout(flashTimeout);flashTimeout=setTimeout(()=>$("flash").classList.remove("visible"),3200);}
function open(content){modal=true;$("dialogContent").innerHTML=content;$("dialog").hidden=false;$("dialog").querySelector(".dialog-panel").scrollTop=0;return $("dialogContent");}
function close(){modal=false;$("dialog").hidden=true;}
const api={open,close,toast:alertGame,save:persist,finish:finish};
function start(newGame){
 st=newGame?initialCareerState():read()||initialCareerState();st.journal ||= [];st.attempts ||= {};
 if(st.ending)st=initialCareerState();st.difficulty="doctorale"; $("intro").hidden=true;persist();update();
 worldController?.visit("university");
 score.start().then(ok=>{if(!ok)alertGame("Le son nécessite une autorisation du navigateur : utilise Musique.");updateMusicButton();});
 alertGame("Éric est sur le campus. Dirige-toi vers un bâtiment ou choisis un lieu !");
}
function update(){
 if(!st)return;
 const year=Math.min(4,Math.floor(st.week/52)+1);
 $("yearLabel").textContent="CAMPAGNE · DIFFICULTÉ DOCTORALE";
 $("weekLabel").textContent="Chrono fictif : sem. "+(st.week+1)+" / 208";
 $("yearProgress").style.width=Math.min(100,st.week/208*100)+"%";
 for(const k of ["rigor","energy","trust","stress","budget","proof"])$(k).textContent=st[k];
 $("completeCount").textContent=st.completed.length+" / "+milestones.length+" étapes";
 const allMissions=openTasks(),currentRoom=worldController?.room||"university";
 const localMissions=allMissions.filter(t=>kindToWorld(t)===currentRoom);
 const available=(localMissions.length?localMissions:allMissions).slice(0,7);
 $("missionCount").textContent=allMissions.length;
 $("missionItems").innerHTML=available.length?available.map(t=>'<button class="mission-card '+(chosen===t.id?"active":"")+'" data-task="'+esc(t.id)+'"><span class="meta"><span>'+esc(t.station)+'</span><span>'+t.weeks+' sem.</span></span><strong>'+esc(t.title)+'</strong><small>'+esc(t.priority==="main"?"Étape structurante":"Mission facultative")+' · Année conseillée '+t.year+'</small></button>').join(""):'<p>Aucune nouvelle mission. Vérifie ton dossier et les prérequis.</p>';
 for(const b of document.querySelectorAll("[data-task]"))b.onclick=()=>select(b.dataset.task);
}
function select(id){
 const task=openTasks().find(t=>t.id===id);if(!task)return;chosen=id;update();
 if(worldController){
  const zone=kindToWorld(task);worldController.visit(zone);
  worldController.goToHotspot();alertGame("Mission : "+task.title+" · "+PLACES.find(p=>p.id===zone)?.name);return;
 }
 if(!webgl){playMission(task,st,api);return;}
 travel=area(task.kind);entered=null;alertGame("Guidage vers "+travel[1]);
}
function atPlace(place){
 if(!st||modal)return;
 const tasks=openTasks().filter(t=>area(t.kind)?.[0]===place[0]);
 const text='<span class="kicker">RENCONTRE SUR LE CAMPUS</span><h2>'+esc(place[1])+'</h2><p>'+tasks.length+' dossier(s) à accomplir ici.</p><div class="story-record">'+tasks.map(t=>'<article><strong>'+esc(t.title)+'</strong><small>Étape '+t.year+' · '+t.weeks+' semaine(s)</small><div class="action-row"><button class="secondary" data-go="'+esc(t.id)+'">Commencer la mission →</button></div></article>').join("")+'</div>';
 const root=open(text);
 for(const el of root.querySelectorAll("[data-go]"))el.onclick=()=>{const task=openTasks().find(t=>t.id===el.dataset.go);if(task)playMission(task,st,api);};
}
function finish(task,delta,detail,flags={}){
 if(task.id==="freeDesign"){st.week+=st.completed.includes("committeeReview")?2:1;st.stress=clamp(st.stress+1);persist();close();update();alertGame("Projet révisé : du temps doctoral a été consommé.");return;}
 const checkpoint=JSON.parse(JSON.stringify(st));
 st.attempts[task.id]=(st.attempts[task.id]||0)+1;
 for(const [k,v] of Object.entries(delta||{}))if(typeof st[k]==="number")st[k]+=v;
 st.week+=task.weeks;st.energy-=Math.max(1,Math.floor(task.weeks/2));st.stress+=flags.risky?5:1;
 if(st.difficulty==="doctorale"&&task.weeks>=3){st.energy-=1;st.stress+=1;}
 st.budget-=(task.kind==="field"||task.kind==="publication"?2:1);
 for(const k of ["rigor","energy","trust","stress"])st[k]=clamp(st[k]);
 st.budget=Math.max(0,st.budget);st.proof=Math.max(0,st.proof);
 if(task.id==="researchGap"&&!flags.risky)st.novelty=true;
 if(task.id==="siteAuthorization"&&!flags.risky)st.access=true;
 if(task.id==="dataContracts"&&!flags.risky)st.access=true;
 if(task.id==="ethicsApproved"&&!flags.risky)st.approved=true;
 st.acceptedArticles ||= [];
 if(flags.articleAccepted&&!st.acceptedArticles.includes(task.id))st.acceptedArticles.push(task.id);
 st.articles=st.acceptedArticles.length;
 if(!flags.forceNoMark)st.completed.push(task.id);
 if(flags.defenseFailed)st.ending="defenseFailed";
 if(task.id==="deposit")st.ending="complete";
 if(st.energy<=0||st.stress>=100||st.trust<=0)st.ending="burnout";
 if(st.week>228&&!st.ending)st.ending="deadline";
 st.journal.unshift({id:task.id,week:st.week,task:task.title,note:detail,risky:!!flags.risky});st.journal=st.journal.slice(0,125);
 persist();close();update();
 const view='<span class="kicker">JOURNAL · SEMAINE '+st.week+'</span><h2>'+esc(task.title)+'</h2><p>'+esc(detail)+'</p><div class="status-block"><span>Rigueur '+st.rigor+'</span><span>Direction '+st.trust+'</span><span>Budget '+st.budget+'</span><span>Temps restant '+Math.max(0,208-st.week)+' semaines</span></div>'+(flags.risky?'<p>⚠ Cette décision présente une faiblesse scientifique ou organisationnelle.</p>':'');
 if(st.ending){
  const root=open('<span class="kicker">ISSUE DE LA PARTIE</span><h2>'+esc(st.ending==="complete"?"FIN DU DOCTORAT":"PARCOURS BLOQUÉ")+'</h2>'+view+'<p>Tu peux revenir avant cette décision et construire une autre stratégie.</p><div class="action-row"><button class="primary" data-retry>Réviser ce choix</button><button class="secondary" data-new>Recommencer</button></div>');
  root.querySelector("[data-retry]").onclick=()=>{st=checkpoint;persist();close();update();};
  root.querySelector("[data-new]").onclick=()=>{close();start(true);};return;
 }
 const root=open(view+'<div class="action-row"><button class="primary" data-next>Continuer vers le prochain objectif →</button></div>');
 root.querySelector("[data-next]").onclick=()=>{close();update();};
}
function dossier(){
 const score=assessDesign(st);
 const root=open('<span class="kicker">MON DOSSIER SCIENTIFIQUE</span><h2>'+esc(st.theme)+'</h2><div class="assessment"><h3>Indice de cohérence : '+score.score+'/100</h3><p>'+esc(st.family)+' · '+esc(st.design)+' · '+esc(st.analysis)+'</p><p>'+st.objectives+' objectifs · '+esc(st.population)+' · '+esc(st.setting)+'</p><p>'+esc(st.format)+' · '+st.articles+' article(s) soumis</p><p>Lacune vérifiée : '+(st.novelty?"oui":"non")+' · Accès au terrain : '+(st.access?"oui":"non")+'</p><ul>'+[...score.blockers,...score.warnings].map(m=>'<li>'+esc(m)+'</li>').join("")+'</ul></div><div class="action-row"><button class="primary" data-edit>Modifier le protocole →</button></div>');
 root.querySelector("[data-edit]").onclick=()=>methods({id:"freeDesign",title:"Atelier des méthodes",kind:"design",station:"Laboratoire des méthodes",year:2,weeks:0},st,api);
}
function roadmap(){
 const done=new Set(st.completed),avail=new Set(openTasks().map(t=>t.id));
 open('<span class="kicker">DOSSIER DOCTORAL COMPLET</span><h2>120 étapes réparties sur 4 années</h2><p>Les activités se débloquent selon les prérequis. Tu peux choisir leur ordre parmi celles qui sont accessibles, avec des coûts de temps différents.</p>'+[1,2,3,4].map(y=>'<h3>ANNÉE '+y+'</h3><div class="story-record">'+milestones.filter(t=>t.year===y).map(t=>'<article><strong>'+(done.has(t.id)?"✓ ":avail.has(t.id)?"→ ":"◇ ")+esc(t.title)+'</strong><small>'+esc(t.station)+' · '+(done.has(t.id)?"Accomplie":avail.has(t.id)?"Disponible":"Nécessite : "+t.requires.map(esc).join(", "))+'</small></article>').join("")+'</div>').join(""));
}
function notebook(){
 const items=st.journal.map(v=>{
  const repair=v.risky&&v.id&&complete(v.id)?'<div class="action-row"><button class="secondary" data-repair="'+esc(v.id)+'">↶ Reprendre cette décision · 2 semaines</button></div>':"";
  return '<article><strong>Semaine '+v.week+' · '+esc(v.task)+'</strong><small>'+esc(v.note)+'</small>'+repair+'</article>';
 }).join("");
 const root=open('<span class="kicker">CARNET DE RECHERCHE</span><h2>Le chemin que tu as construit</h2><p>Une erreur peut être reprise, mais cela coûte deux semaines et deux crédits. La décision précédente reste consignée dans le journal.</p><div class="story-record">'+(items||'<p>Les décisions seront consignées au fil de la partie.</p>')+'</div>');
 for(const button of root.querySelectorAll("[data-repair]"))button.onclick=()=>{
  const id=button.dataset.repair;if(!complete(id))return;
  st.completed=st.completed.filter(v=>v!==id);
  if(id==="researchGap")st.novelty=false;
  if(id==="ethicsApproved")st.approved=false;
  if(id==="dataContracts")st.access=false;
  if(st.acceptedArticles){st.acceptedArticles=st.acceptedArticles.filter(x=>x!==id);st.articles=st.acceptedArticles.length;}
  st.week+=2;st.budget=Math.max(0,st.budget-2);st.stress=clamp(st.stress+2);
  st.repairs=(st.repairs||0)+1;
  st.journal.unshift({id:"repair",week:st.week,task:"Révision de "+id,note:"Deux semaines consacrées à reprendre un choix contesté.",risky:false});
  persist();close();update();alertGame("Étape réouverte : reprends la mission et corrige ton dossier.");
 };
}

function drawScene(){}
function init3D(){
 renderer=new THREE.WebGLRenderer({canvas:$("scene3d"),antialias:true,powerPreference:"high-performance"});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.65;
 scene=new THREE.Scene();scene.background=new THREE.Color(0x091828);scene.fog=new THREE.FogExp2(0x091828,.016);
 scene.add(new THREE.HemisphereLight(0xecf6ff,0x223c58,2.6));
 const sun=new THREE.DirectionalLight(0xffe6c9,3.2);sun.position.set(15,24,8);scene.add(sun);
 camera=new THREE.PerspectiveCamera(61,1,.1,160);
 const wall=new THREE.MeshStandardMaterial({color:0x263b4d,metalness:.2,roughness:.6}),road=new THREE.MeshStandardMaterial({color:0x162939,roughness:.85});
 const mesh=(g,m,xx,yy,zz,root=scene)=>{const o=new THREE.Mesh(g,m);o.position.set(xx,yy,zz);root.add(o);return o;};
 mesh(new THREE.BoxGeometry(95,.2,95),road,0,-.13,0);
 for(let v=-39;v<=39;v+=3){mesh(new THREE.BoxGeometry(.026,.013,82),new THREE.MeshBasicMaterial({color:0x27495a}),v,0,0);mesh(new THREE.BoxGeometry(82,.013,.026),new THREE.MeshBasicMaterial({color:0x27495a}),0,0,v);}
 const worldStations=[];
 for(const p of locations){
  const root=new THREE.Group();root.position.set(p[2],0,p[3]);root.userData.place=p[0];scene.add(root);
  mesh(new THREE.BoxGeometry(6,5.0,5.6),wall,0,2.5,0,root);
  const glass=new THREE.MeshStandardMaterial({color:p[4],emissive:p[4],emissiveIntensity:.13,metalness:.55,roughness:.25});
  for(let h of [1.45,3.4])for(let x0 of [-2,0,2])mesh(new THREE.BoxGeometry(1.18,1.5,.12),glass,x0,h,2.86,root);
  mesh(new THREE.BoxGeometry(6.5,.2,5.9),new THREE.MeshStandardMaterial({color:0x68859c}),0,5.18,0,root);
  const cv=document.createElement("canvas");cv.width=700;cv.height=135;
  const g=cv.getContext("2d");g.fillStyle="#0b2b3f";g.fillRect(0,0,700,135);g.strokeStyle="#aeffdf";g.lineWidth=4;g.strokeRect(3,3,694,129);g.textAlign="center";g.fillStyle="#f3fff9";g.font="bold 35px sans-serif";g.fillText(p[1],350,85,650);
  const label=mesh(new THREE.PlaneGeometry(6,1.1),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv),transparent:true,side:THREE.DoubleSide}),0,6.4,0,root);
  const torus=mesh(new THREE.TorusGeometry(4.35,.05,8,50),new THREE.MeshBasicMaterial({color:p[4]}),0,.07,0,root);torus.rotation.x=Math.PI/2;
  worldStations.push({root,label,p});
 }
 for(let i=0;i<65;i++){const x0=(Math.random()-.5)*85,z0=(Math.random()-.5)*85;if(Math.hypot(x0,z0)<10)continue;mesh(new THREE.CylinderGeometry(.12,.14,1.35,6),new THREE.MeshStandardMaterial({color:0x554d42}),x0,.68,z0);mesh(new THREE.ConeGeometry(.7,2.25,7),new THREE.MeshStandardMaterial({color:i%3?0x315e58:0x456c5d}),x0,2.3,z0);}
 character=new THREE.Group();scene.add(character);
 const canvas=document.createElement("canvas");canvas.width=384;canvas.height=580;
 sprite=canvas;texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
 const body=new THREE.Mesh(new THREE.PlaneGeometry(2.2,3.2),new THREE.MeshBasicMaterial({map:texture,transparent:true,alphaTest:.07,side:THREE.DoubleSide,depthWrite:false}));
 body.position.y=1.6;character.add(body);character.userData.body=body;
 portrait=new Image();portrait.onload=()=>animate(0,true);portrait.src="../assets/personnage-hall.png";
 webgl=true;resize();window.addEventListener("resize",resize);requestAnimationFrame(tick);
 $("scene3d").addEventListener("pointerdown",ev=>{
  if(modal||!st)return;
  const canvas=$("scene3d"),coords=new THREE.Vector2(ev.offsetX/canvas.clientWidth*2-1,-ev.offsetY/canvas.clientHeight*2+1);
  const ray=new THREE.Raycaster();ray.setFromCamera(coords,camera);
  const hits=ray.intersectObjects(worldStations.map(w=>w.root),true);
  if(!hits.length)return;
  let obj=hits[0].object;while(obj&&!obj.userData.place)obj=obj.parent;
  if(obj?.userData.place){travel=locations.find(p=>p[0]===obj.userData.place);entered=null;alertGame("Rejoindre "+travel[1]);}
 });
 function animate(ts,force=false){
  if(!portrait?.naturalWidth)return;
  const n=Math.floor(ts/190)%3;if(n===frame&&!force)return;frame=n;
  const context=sprite.getContext("2d"),sw=portrait.naturalWidth/3,sh=portrait.naturalHeight/2;
  context.clearRect(0,0,384,580);context.drawImage(portrait,n*sw,0,sw,sh,0,0,384,580);texture.needsUpdate=true;
 }
 function resize(){
  const c=$("scene3d"),w=c.clientWidth,h=c.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
 }
 function tick(ts){
  requestAnimationFrame(tick);const dt=Math.min(.05,(ts-last||16)/1000);last=ts;
  if(st&&!modal&&!st.ending&&!document.hidden){
   let dx=Number(pressed.has("KeyD")||pressed.has("ArrowRight"))-Number(pressed.has("KeyA")||pressed.has("KeyQ")||pressed.has("ArrowLeft"));
   let dz=Number(pressed.has("KeyS")||pressed.has("ArrowDown"))-Number(pressed.has("KeyW")||pressed.has("KeyZ")||pressed.has("ArrowUp"));
   if(travel&&!dx&&!dz){dx=travel[2]-px;dz=travel[3]-pz;if(Math.hypot(dx,dz)<3.4){const here=travel;travel=null;dx=dz=0;if(entered!==here[0]){entered=here[0];atPlace(here);}}}else if(dx||dz)travel=null;
   const d=Math.hypot(dx,dz),speed=pressed.has("ShiftLeft")?15:10;
   if(d>.001){px=clamp(px+dx/d*dt*speed,-34,34);pz=clamp(pz+dz/d*dt*speed,-36,34);animate(ts);}else animate(190);
   character.position.set(px,d>.001?Math.sin(ts*.01)*.025:0,pz);
   body.quaternion.copy(camera.quaternion);body.rotation.x=0;body.rotation.z=0;
   camera.position.lerp(new THREE.Vector3(px,7,pz+12),Math.min(1,dt*4));camera.lookAt(px,1.7,pz-4);
   const nearby=locations.reduce((acc,p)=>{const dis=Math.hypot(px-p[2],pz-p[3]);return dis<acc.dist?{p,dist:dis}:acc;},{p:null,dist:100});
   $("stationLabel").textContent=nearby.p[1];$("stationHint").textContent=nearby.dist<4?"Consulte les missions de ce bâtiment.":"Clique sur un bâtiment pour rejoindre ce lieu.";
   if(nearby.dist<3.5&&entered!==nearby.p[0]){entered=nearby.p[0];atPlace(nearby.p);}if(nearby.dist>6)entered=null;
   for(const a of worldStations)a.label.quaternion.copy(camera.quaternion);
  }
  if(!document.hidden)renderer.render(scene,camera);
 }
}
document.querySelectorAll("[data-move]").forEach(el=>{
 const code={up:"ArrowUp",down:"ArrowDown",left:"ArrowLeft",right:"ArrowRight"}[el.dataset.move];
 el.addEventListener("pointerdown",ev=>{ev.preventDefault();pressed.add(code);});
 for(const type of ["pointerup","pointerleave","pointercancel"])el.addEventListener(type,ev=>{ev.preventDefault();pressed.delete(code);});
});
window.addEventListener("keydown",ev=>{if(!modal&&["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","KeyW","KeyA","KeyS","KeyD","KeyQ","KeyZ","Space"].includes(ev.code))ev.preventDefault();if(!modal)pressed.add(ev.code);if(ev.key==="Escape"&&modal)close();});
window.addEventListener("keyup",ev=>pressed.delete(ev.code));window.addEventListener("blur",()=>pressed.clear());
const balanceControl=$("balanceBtn");
if(balanceControl){
 const hold=ev=>{ev.preventDefault();pressed.add("Space");balanceControl.classList.add("pressed");};
 const release=ev=>{ev.preventDefault();pressed.delete("Space");balanceControl.classList.remove("pressed");};
 balanceControl.addEventListener("pointerdown",hold);
 for(const kind of ["pointerup","pointercancel","pointerleave"])balanceControl.addEventListener(kind,release);
}
$("startBtn").onclick=()=>start(false);
$("resumeBtn").hidden=true; // One visible entry point: Éric, mode doctoral, play.
function updateMusicButton(){
 const b=$("musicBtn");b.textContent=score.enabled?"♫ Musique":"♪ Coupée";
 b.setAttribute("aria-pressed",String(score.enabled));
 b.setAttribute("aria-label",score.enabled?"Désactiver la musique":"Réactiver la musique");
}
updateMusicButton();
$("musicBtn").onclick=async()=>{await score.toggle();updateMusicButton();alertGame(score.enabled?"Musique activée":"Musique désactivée");};
function showPlaceButtons(current){
 const panel=$("worldPlaces");if(!panel)return;
 panel.innerHTML=PLACES.map(p=>'<button type="button" data-world="'+p.id+'" class="'+(p.id===current?"current":"")+'" title="'+esc(p.sub)+'">'+esc(p.name)+'</button>').join("");
 for(const btn of panel.querySelectorAll("[data-world]"))btn.onclick=()=>{if(!st)return;worldController?.visit(btn.dataset.world);};
}
function doActivity(zone,action,label){
 if(!st||modal)return;
 // The early progression is a physical collect-and-deliver quest, not a dialog quiz.
 if(zone==="university"&&action==="admission"){
  const needed=["university-0","university-1","university-2"];
  const collected=needed.filter(id=>st.worldClues?.[id]).length;
  if(collected<needed.length){
   alertGame("MISSION ADMISSION · Documents recueillis : "+collected+"/3. Parcours le campus pour trouver les trois pièces.");
   return;
  }
  const mission=openTasks().find(t=>t.id==="admission");
  if(mission){
   chosen=mission.id;
   finish(mission,{rigor:5,trust:3,proof:1},"Éric a rassemblé les trois pièces sur le campus et déposé son dossier à l'administration. La candidature ouvre réellement le parcours doctoral.");
   return;
  }
  alertGame("Dossier d'admission déjà déposé. Explore maintenant les autres bâtiments.");return;
 }
 if(zone==="library"&&(action==="bibliography"||action==="concept")){
  const ids=["library-0","library-1","library-2"];
  const n=ids.filter(id=>st.worldClues?.[id]).length;
  if(n<3){alertGame("ENQUÊTE DOCUMENTAIRE : récupère les trois références de la bibliothèque ("+n+"/3).");return;}
 }
 if(zone==="conference"&&action==="talk"){
  const n=["conference-0","conference-1","conference-2"].filter(id=>st.worldClues?.[id]).length;
  if(n<2){alertGame("AVANT DE MONTER SUR SCÈNE : trouve deux éléments d'affiche scientifique ("+n+"/2).");return;}
 }
 if(zone==="laboratory"&&action==="data"){
  const n=["laboratory-0","laboratory-1","laboratory-2"].filter(id=>st.worldClues?.[id]).length;
  if(n<2){alertGame("LABORATOIRE : examine au moins deux dossiers de données avant l'analyse ("+n+"/2).");return;}
 }
 // Physical interactions first; task forms are invoked from a reached work station, not from the start menu.
 if(zone==="home"&&action==="rest"){
  st.energy=clamp(st.energy+18);st.stress=clamp(st.stress-12);st.week+=1;
  st.journal.unshift({week:st.week,task:"Une vraie soirée à la maison",note:"Repos assumé : énergie et recul récupérés, une semaine fictive consommée.",risky:false});
  persist();update();alertGame("Éric a récupéré. Il faudra cependant rendre le prochain livrable.");return;
 }
 if(zone==="rink")return;
 const missions=openTasks().filter(t=>kindToWorld(t)===zone);
 const task=missions.find(t=>t.id===chosen)||missions[0];
 if(task){chosen=task.id;playMission(task,st,api);return;}
 const root=open('<span class="kicker">INTERACTION · '+esc(PLACES.find(p=>p.id===zone)?.name||"Campus")+'</span><h2>'+esc(label)+'</h2><p>Éric explore cet endroit. Les activités associées seront débloquées à mesure que son dossier progressera.</p><div class="action-row"><button class="primary" data-return>Reprendre l’exploration</button></div>');
 root.querySelector("[data-return]").onclick=close;
}
function earnClue(id,label,zone){
 if(!st)return;st.worldClues ||= {};
 if(st.worldClues[id]){alertGame("Indice déjà consigné : "+label);return;}
 st.worldClues[id]=true;st.proof=(st.proof||0)+1;st.rigor=clamp(st.rigor+1);
 st.journal.unshift({week:st.week,task:"Indice · "+label,note:"Découvert en explorant "+zone+". Les observations doivent ensuite être discutées dans le protocole.",risky:false});
 persist();update();alertGame("✦ INDICE TROUVÉ : "+label+" · Preuve +1");
}
function reviewerAttack(who,zone){
 if(!st)return;
 st.energy=clamp(st.energy-6);st.stress=clamp(st.stress+10);st.trust=clamp(st.trust-1);
 persist();update();alertGame("⚠ "+who+" te poursuit ! Énergie −6, stress +10. Cours avec Maj.");
 if(st.energy===0||st.stress===100){
  st.ending="burnout";persist();
  const view=open('<span class="kicker">ÉCHEC · LE PROTOCOLE DÉBORDE</span><h2>Éric doit reprendre la main.</h2><p>Fatigue et stress ont fini par déséquilibrer la recherche. Une pause et un périmètre réaliste valent mieux qu’une course sans fin.</p><div class="action-row"><button class="primary" data-recover>Récupérer à la maison et reprendre</button></div>');
  view.querySelector("[data-recover]").onclick=()=>{st.ending=null;st.week+=2;st.stress=45;st.energy=55;st.budget=Math.max(0,st.budget-4);persist();close();update();worldController?.visit("home");};
 }
}
function meetCharacter(name,line,room){
 if(!st)return;
 st.charactersMet ||= {};
 const key=room+"::"+name,first=!st.charactersMet[key];
 if(first){st.charactersMet[key]=true;st.trust=clamp(st.trust+1);
  st.journal.unshift({week:st.week,task:"Rencontre · "+name,note:line,risky:false});persist();update();}
 alertGame(name+" : « "+line+" »");
}
function skatingSuccess(result){
 if(!st)return;
 st.skateSessions=(st.skateSessions||0)+1;
 if(st.skateSessions===1){st.energy=clamp(st.energy+10);st.stress=clamp(st.stress-10);st.rigor=clamp(st.rigor+2);}
 st.journal.unshift({week:st.week,task:"Épreuve de hockey : équilibre sur glace",note:"Parcours réussi en "+result.seconds+" secondes. Chutes : "+result.falls+".",risky:false});
 persist();update();alertGame("ÉQUILIBRE MAÎTRISÉ ! "+result.falls+" chute(s) · Énergie +10."); 
}
function bootNewWorld(){
 worldController=createAdventureWorld(THREE,$("scene3d"),{
 keys:pressed,
 isPaused:()=>modal||!st||!$("intro").hidden||Boolean(st?.ending),
 onVisit:(zone,p)=>{score.setZone(zone);$("stationLabel").textContent=p.name;$("stationHint").textContent=p.sub+" · Approche les marqueurs lumineux pour agir.";showPlaceButtons(zone);$("rinkHud").hidden=zone!=="rink";if(st)update();},
 onActivity:doActivity,
 onNarrate:alertGame,
 onSkate:skatingSuccess,
 onEvidence:earnClue,
 onDamage:reviewerAttack,
 onNpc:meetCharacter,
 onBalance:(balance,progress,falls,gates,total)=>{
  $("rinkNeedle").style.left=(50+Math.max(-1,Math.min(1,balance))*46)+"%";
  $("rinkTime").textContent=gates+" / "+total+" portes";
  $("rinkTips").textContent="ZQSD : prendre de l'élan · Espace : freiner et stabiliser · Chutes : "+falls;
 }
 });
 webgl=true;window.addEventListener("resize",()=>worldController?.resize());
 showPlaceButtons("university");
}
$("planBtn").onclick=()=>{if(st)roadmap();};$("designBtn").onclick=()=>{if(st)dossier();};
$("notebookBtn").onclick=()=>{if(st)notebook();};
$("closeDialog").onclick=close;$("dialog").querySelector(".dialog-back").onclick=close;
$("resetBtn").onclick=()=>{if(confirm("Recommencer les quatre années ?")){localStorage.removeItem(KEY);close();start(true);}};
$("fastTravel").onclick=()=>{const task=openTasks().find(t=>t.id===chosen)||openTasks()[0];if(task)select(task.id);else alertGame("Explore les bâtiments pour découvrir une activité.");};
$("interactBtn").onclick=()=>{if(!st||modal)return;if(worldController){worldController.goToHotspot();return;}
 const near=locations.reduce((a,b)=>Math.hypot(px-a[2],pz-a[3])<Math.hypot(px-b[2],pz-b[3])?a:b);
 if(Math.hypot(px-near[2],pz-near[3])<6)atPlace(near);else alertGame("Rejoins un bâtiment pour interagir.");};
try{
 THREE=await import("https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js");
 bootNewWorld();
}catch(err){
 console.warn("3D unavailable, 2D career board enabled",err);
 alertGame("La 3D n'est pas disponible ici. Les missions restent accessibles depuis le journal.");
}
