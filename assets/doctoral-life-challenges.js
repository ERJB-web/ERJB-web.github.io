import {methodology,assessDesign,checkDefense} from "./doctoral-life-data.js";
const e=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const b=(label,id)=>'<button class="primary" data-action="'+id+'">'+label+'</button>';
const head=(t,txt)=>'<span class="kicker">'+e(t.station)+'</span><h2>'+e(t.title)+'</h2><p>'+txt+'</p>';
const field=(label,k,choices,current)=>'<label>'+label+'<select data-field="'+k+'">'+choices.map(v=>'<option value="'+e(v)+'"'+(String(current)===String(v)?" selected":"")+'>'+e(v)+'</option>').join("")+'</select></label>';
const buttons=txt=>'<div class="action-row">'+txt+'</div>';
export function playMission(t,s,api){
 if(t.kind==="design")return methods(t,s,api);
 if(t.kind==="literature")return library(t,s,api);
 if(t.kind==="field")return network(t,s,api);
 if(["funding","work","analysis"].includes(t.kind))return resources(t,s,api);
 if(t.kind==="defense")return defense(t,s,api);
 return negotiate(t,s,api);
}
export function methods(t,s,api){
 function draw(){
 const f=methodology.families.find(v=>v.id===s.family)||methodology.families[0];
 for(const [k,items] of [["paradigm",f.paradigms],["design",f.designs],["data",f.data],["analysis",f.analysis]])if(!items.includes(s[k]))s[k]=items[0];
 const q=assessDesign(s);
 const form='<div class="studio-form">'+field("Famille", "family", methodology.families.map(f=>f.id),s.family)+field("Paradigme", "paradigm",f.paradigms,s.paradigm)+field("Devis", "design",f.designs,s.design)+field("Données", "data",f.data,s.data)+field("Analyse", "analysis",f.analysis,s.analysis)+field("Thème", "theme",methodology.themes,s.theme)+field("Population", "population",methodology.populations,s.population)+field("Terrain", "setting",methodology.settings,s.setting)+field("Échantillonnage", "sampling",methodology.sampling,s.sampling)+field("Objectifs", "objectives",methodology.count,s.objectives)+field("Format", "format",methodology.formats,s.format)+(s.format==="Thèse par articles"?field("Articles prévus","articleTarget",[2,3,4],s.articleTarget):"")+
 '<label class="span2">Question de recherche personnalisée<textarea data-question rows="3" aria-label="Rédiger sa question de recherche">'+e(s.question||"")+'</textarea></label>'+
 '<label class="check-row span2"><input data-rule="articles" type="checkbox" '+(s.programArticlesRequired!==false?"checked":"")+'> Le programme fictif choisi exige une thèse par articles</label></div>';
 const warnings=[...q.blockers.map(x=>"⛔ "+x),...q.warnings.map(x=>"⚠ "+x)];
 const root=api.open(head(t,"Construis ton protocole : quarante devis, plusieurs approches, analyses, échelles et formats. Les incompatibilités resteront dans ton dossier.")+form+'<div class="assessment"><h3>Audit scientifique '+q.score+'/100</h3><p>'+e(s.theme)+' · '+e(s.design)+'</p><ul>'+warnings.map(w=>'<li>'+e(w)+'</li>').join("")+'</ul></div>'+buttons(b("Conserver ce protocole","submit")));
 const questionInput=root.querySelector("[data-question]");if(questionInput)questionInput.onchange=()=>{s.question=questionInput.value;api.save();draw();};
 const rules=root.querySelector("[data-rule]");if(rules)rules.onchange=()=>{s.programArticlesRequired=rules.checked;api.save();draw();};
 for(const inp of root.querySelectorAll("[data-field]"))inp.onchange=()=>{const k=inp.dataset.field;s[k]=["objectives","articleTarget"].includes(k)?+inp.value:inp.value;api.save();draw();};
 for(const opt of root.querySelectorAll('[data-field="family"] option')){const fam=methodology.families.find(f=>f.id===opt.value);if(fam)opt.textContent=fam.name;}
 root.querySelector('[data-action="submit"]').onclick=()=>{const audit=assessDesign(s);api.finish(t,{rigor:audit.valid?8:-12,trust:audit.valid?4:-8,stress:audit.valid?-1:10},"Le dossier conserve le devis choisi et toutes ses limites.",{risky:!audit.valid});};
 }draw();
}
function resources(t,s,api){
 const kind=t.kind,limit=kind==="work"?40:10;
 const vals=kind==="funding"?{originality:3,feasibility:3,partners:2,letter:2}:kind==="work"?{study:18,assistant:10,teaching:5,recovery:7}:{sample:3,bias:4,trace:3};
 const labels={originality:"Originalité",feasibility:"Faisabilité",partners:"Partenariats",letter:"Candidature",study:"Cours et recherche",assistant:"Auxiliariat",teaching:"Enseignement",recovery:"Récupération",sample:"Échantillon",bias:"Contrôle des biais",trace:"Traçabilité"};
 function draw(){
 const total=Object.values(vals).reduce((a,b)=>a+b,0);
 const inputs=Object.entries(vals).map(([k,v])=>'<label>'+labels[k]+'<input type="range" min="0" max="'+limit+'" value="'+v+'" data-slide="'+k+'"><strong>'+v+'</strong></label>').join("");
 const root=api.open(head(t,kind==="work"?"Répartis quarante heures entre recherche, contrats et repos.":kind==="funding"?"Répartis dix unités pour soumettre une demande de bourse crédible.":"Ajuste les critères de qualité de données et les précautions analytiques.")+'<div class="ledger">'+inputs+'</div><p class="ledger-note">'+total+" / "+limit+'</p>'+buttons(b("Valider les arbitrages","submit")));
 for(const slider of root.querySelectorAll("[data-slide]"))slider.oninput=()=>{vals[slider.dataset.slide]=+slider.value;draw();};
 root.querySelector('[data-action="submit"]').onclick=()=>{
 if(total!==limit){api.toast("Répartis exactement "+limit+" unités.");return;}
 let delta={},feedback="",extra={};
 if(kind==="work"){const bad=vals.recovery<5||vals.study<12;delta={budget:Math.floor(vals.assistant/3+vals.teaching/4),energy:bad?-12:4,stress:bad?12:-2,rigor:bad?-7:4};feedback=bad?"La fatigue compromet une partie du travail scientifique.":"Une semaine mieux équilibrée.";extra.risky=bad;}
 if(kind==="funding"){const won=vals.feasibility>=3&&vals.originality>=2&&s.rigor>=25;delta={budget:won?18:-3,trust:won?3:-1,stress:won?-2:5};feedback=won?"Bourse attribuée dans ce scénario.":"Bourse refusée : réajuste les candidatures.";extra.grant=won;}
 if(kind==="analysis"){const ok=vals.bias>=3&&vals.trace>=3;delta={rigor:ok?8:-10,proof:ok?2:0,stress:ok?0:7};feedback=ok?"Une analyse traçable, avec ses limites.":"Les biais et la reproductibilité restent insuffisamment traités.";extra.risky=!ok;}
 api.finish(t,delta,feedback,extra);
 };
 }draw();
}
function library(t,s,api){
 const files=[["Synthèse méthodique",true],["Étude empirique récente",true],["Étude antérieure très proche",true],["Blog non sourcé",false],["Référence inventée",false],["Annuaire non daté",false]],set=new Set();
 function draw(){
 const root=api.open(head(t,"Classe les pièces du dossier. Identifier une publication ayant déjà traité le sujet peut obliger à reformuler ta contribution.")+'<div class="evidence-grid">'+files.map((v,i)=>'<button data-doc="'+i+'" class="'+(set.has(i)?"marked":"")+'"><b>'+e(v[0])+'</b><small>'+e(v[1]?"Source analysable et traçable":"À vérifier avant toute utilisation")+'</small></button>').join("")+'</div><p>'+set.size+' / 3 retenues</p>'+buttons(b("Constituer le dossier","submit")));
 for(const b of root.querySelectorAll("[data-doc]"))b.onclick=()=>{let i=+b.dataset.doc;set.has(i)?set.delete(i):set.size<3?set.add(i):api.toast("Trois pièces maximum.");draw();};
 root.querySelector('[data-action="submit"]').onclick=()=>{if(set.size!==3){api.toast("Trois pièces nécessaires.");return;}const ok=[...set].every(i=>files[i][1]);if(ok&&t.id==="researchGap")s.novelty=true;api.finish(t,{rigor:ok?7:-8,proof:ok?3:0,stress:ok?0:7},ok?"Lacune et preuves maintenant documentées.":"Lacune insuffisamment étayée : risque au comité.",{risky:!ok});};
 }draw();
}
function network(t,s,api){
 const points=[[50,135],[163,43],[275,82],[379,190],[221,245]],labels=["Usagers","CLSC","OC","Organisme","Annuaire"],pairs=[[0,1],[1,2],[2,3],[1,4],[0,4]],selected=new Set();let active=-1;
 function draw(){
 const edges=[...selected].map(i=>{const p=pairs[i];return '<line x1="'+points[p[0]][0]+'" y1="'+points[p[0]][1]+'" x2="'+points[p[1]][0]+'" y2="'+points[p[1]][1]+'" stroke="#bbffe2" stroke-width="6"/>';}).join("");
 const nodes=points.map((p,i)=>'<g data-node="'+i+'" tabindex="0" role="button"><circle cx="'+p[0]+'" cy="'+p[1]+'" r="36" fill="'+(i===active?"#526eaf":"#224e62")+'" stroke="#afffe2" stroke-width="2"/><text x="'+p[0]+'" y="'+(p[1]+4)+'" text-anchor="middle" font-size="12" fill="white" style="pointer-events:none">'+labels[i]+'</text></g>').join("");
 const root=api.open(head(t,"Trace trois relations réellement documentées, pas seulement des établissements proches. Entretiens fictifs : Usagers–CLSC, CLSC–OC et OC–Organisme.")+'<div class="assessment"><svg style="display:block;width:100%;max-width:480px;margin:auto" viewBox="0 0 440 295">'+edges+nodes+'</svg></div><p>'+selected.size+' / 3 relations</p>'+buttons(b("Valider la carte","submit")));
 for(const n of root.querySelectorAll("[data-node]")){const hit=()=>{const i=+n.dataset.node;if(active<0){active=i;draw();return;}const j=pairs.findIndex(pair=>pair.includes(active)&&pair.includes(i));active=-1;if(j<0)api.toast("Relation inconnue.");else if(selected.has(j))selected.delete(j);else if(selected.size<3)selected.add(j);draw();};n.onclick=hit;n.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();hit();}};}
 root.querySelector('[data-action="submit"]').onclick=()=>{if(selected.size!==3){api.toast("Trace trois relations.");return;}const ok=[...selected].every(i=>i<3);if(ok&&["siteAuthorization","dataContracts"].includes(t.id))s.access=true;api.finish(t,{rigor:ok?7:-8,trust:ok?3:-5,proof:ok?2:0},ok?"Liens effectifs et services répertoriés sont différenciés.":"Cartographie trop spéculative.",{risky:!ok});};
 }draw();
}
function negotiate(t,s,api){
 const effort={depth:5,partners:3,speed:2};
 function draw(){
 const total=Object.values(effort).reduce((a,b)=>a+b,0);
 const root=api.open(head(t,"Partage dix unités de préparation entre la profondeur du travail, la concertation et la rapidité. Il ne suffit pas de choisir une bonne réponse : le calendrier, les preuves et la direction réagissent à tes arbitrages.")+'<div class="ledger">'+Object.entries(effort).map(([k,v])=>'<label>'+({depth:"Rigueur",partners:"Concertation",speed:"Rapidité"}[k])+'<input type="range" min="0" max="10" value="'+v+'" data-slide="'+k+'"><strong>'+v+'</strong></label>').join("")+'</div><p class="ledger-note">'+total+'/10 unités</p>'+buttons(b("Mettre en œuvre","submit")));
 for(const inp of root.querySelectorAll("[data-slide]"))inp.oninput=()=>{effort[inp.dataset.slide]=+inp.value;draw();};
 root.querySelector('[data-action="submit"]').onclick=()=>{if(total!==10){api.toast("Répartis dix unités.");return;}const risky=effort.depth<3||effort.speed>5;api.finish(t,{rigor:risky?-9:5,trust:effort.partners>=3?4:-5,stress:risky?8:-1},risky?"Le raccourci crée un défaut difficile à rattraper.":"Démarche documentée et négociée.",{risky});};
 }draw();
}
function defense(t,s,api){
 const r=checkDefense(s);
 const root=api.open(head(t,"Le jury confronte les engagements du dossier aux travaux, à la méthodologie, aux articles et aux autorisations.")+'<div class="assessment"><h3>'+r.missing.length+' réserves principales</h3><ul>'+r.missing.map(m=>'<li>⚠ '+e(m)+'</li>').join("")+'</ul></div>'+buttons(b("Soutenir maintenant","submit")));
 root.querySelector('[data-action="submit"]').onclick=()=>api.finish(t,r.ready?{rigor:9,trust:9,stress:-6}:{rigor:-5,trust:-14,stress:18},r.ready?"Le jury accepte la soutenance sous conditions de corrections.":"Soutenance ajournée : "+r.missing.join(" ; "),{defenseWon:r.ready,defenseFailed:!r.ready,forceNoMark:!r.ready});
}
