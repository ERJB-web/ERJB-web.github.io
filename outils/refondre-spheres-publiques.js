"use strict";
// Migration des seules copies publiques. Les applications et documents personnels ne sont jamais ouverts.
const fs=require('fs'),path=require('path'),zlib=require('zlib'),cp=require('child_process');
const racine=path.resolve(__dirname,'..');
const originaux=require('./spheres-originales');
const version='2026-10-15-autonome-2';
const pad=n=>String(n).padStart(2,'0');
const dossierTravail=path.join(racine,'.spheres-travail');
fs.mkdirSync(dossierTravail,{recursive:true});
const sorties={};
const blocsR=[];
originaux.sujets.forEach((s,i)=>{blocsR.push({id:'ex-'+i,code:originaux.donnees+'\n'+s.code});blocsR.push({id:'sol-'+i,code:originaux.donnees+'\n'+s.solution});});
originaux.nouveauxChapitres.forEach(c=>c.parties.forEach((p,i)=>p.blocs.forEach((b,j)=>{if(b.genre==='code')blocsR.push({id:'chap-'+c.chapitre+'-'+i+'-'+j,code:b.code});})));
const rProgramme=blocsR.map(b=>'cat("\n<<<'+b.id+'>>>\n")\nlocal({\n'+b.code+'\n})\ncat("\n<<<FIN>>>\n")').join('\n');
fs.writeFileSync(path.join(dossierTravail,'originaux.R'),rProgramme);
const rExecutable='C:/Program Files/R/R-4.6.1/bin/Rscript.exe';
const execution=cp.execFileSync(rExecutable,['--vanilla',path.join(dossierTravail,'originaux.R')],{encoding:'utf8',maxBuffer:12000000,cwd:dossierTravail});
for(const m of execution.matchAll(/<<<([^>]+)>>>\r?\n([\s\S]*?)\r?\n<<<FIN>>>/g))sorties[m[1]]=m[2].trim();
if(Object.keys(sorties).length!==blocsR.length)throw Error('Une sortie R manque');

function tutoriel(){return {titre:'Analyser des données fictives avec R dans Positron',edition:version,sources:[
 {titre:'R Core Team — documentation de R',url:'https://cran.r-project.org/manuals.html'},
 {titre:'Posit — utiliser R dans Positron',url:'https://positron.posit.co/guide-r.html'}
 ],sujets:originaux.sujets.map((s,i)=>({numero:i+1,titre:s.titre,positron:true,ajout:false,estExercices:false,blocs:[
 {genre:'texte',id:'public-r-'+i+'-intro',texte:s.texte},
 {genre:'encart',id:'public-r-'+i+'-repere',encart:'positron',texte:'Ouvre un fichier .R dans le dossier de ton projet Positron. Le bouton « Ouvrir dans Positron » télécharge un script autonome contenant aussi le jeu fictif nécessaire. Le navigateur affiche le code et ses sorties ; il n’exécute pas R.'},
 {genre:'donnees',id:'public-r-'+i+'-donnees',code:originaux.donnees,echo:i===2,eval:true},
 {genre:'exemple',id:'public-r-'+i+'-exemple',code:s.code,echo:true,eval:true,sorties:[{genre:'texte',texte:sorties['ex-'+i]}]},
 {genre:'texte',id:'public-r-'+i+'-consigne',texte:'**À pratiquer.** '+s.consigne},
 {genre:'exercice',id:'public-r-'+i+'-exercice',exercice:{nom:'atelier-'+pad(i+1),sujet:i+1,codeDepart:s.depart,preparation:[originaux.donnees],insererChemin:false,solution:originaux.donnees+'\n'+s.solution}},
 {genre:'correction',id:'public-r-'+i+'-correction',texte:'Atelier '+pad(i+1),contenu:[{genre:'exemple',id:'public-r-'+i+'-solution',code:s.solution,sorties:[{genre:'texte',texte:sorties['sol-'+i]}]},{genre:'texte',texte:s.interpretation}]},
 {genre:'texte',id:'public-r-'+i+'-sources',texte:'Repères : [documentation de R](https://cran.r-project.org/manuals.html) · [R dans Positron](https://positron.posit.co/guide-r.html). Rédaction et données fictives propres à cette édition.'}
 ]}))};}

function nettoyerTexte(s,champ){
 for(const r of require("./spheres-reformulations.json"))if(new RegExp(r.motif,r.flags).test(s))return r.texte;
 if(/^(reference|source)$/i.test(champ)&&/diapo|cours\s*ch\.|support de cours|plan de cours/i.test(s))return 'Voir la leçon correspondante et la documentation scientifique de la méthode.';
 return s
 .replace(/\bMSO\s*[- ]?\d{4}\b/gi,'parcours autonome')
 .replace(/\bStudiUM\b/gi,'espace personnel')
 .replace(/\b(?:RStudio|R Studio)\b/g,'Positron')
 .replace(/dans ce cours/gi,'dans ce parcours')
 .replace(/du cours/g,'du parcours').replace(/le cours/g,'le parcours').replace(/Le cours/g,'Le parcours')
 .replace(/plan de cours/gi,'parcours d’apprentissage')
 .replace(/\bexamen (?:intra|final)\b/gi,'bilan personnel')
 .replace(/\bexamens? blancs?\b/gi,'simulation d’entraînement')
 .replace(/\bTout l.intra\b/g,'Toutes les notions').replace(/\bintra-session\b/gi,'mi-parcours')
 .replace(/Cours ch\.\s*\d+[^;\n]*/gi,'Repère méthodologique')
 .replace(/cours gratuits/g,'séances d’activité offertes')
 .replace(/Une promotion d'étudiants qui entrent ensemble à l'université, puis qu'on suit année après année, est une cohorte : l'année d'entrée sert à définir le groupe\./g,'Des personnes recrutées dans une même période puis suivies dans le temps forment une cohorte : la date d’inclusion aide à définir le groupe.')
 .replace(/C'est la note finale d'un cours : l'examen qui vaut 50 % pèse plus que le quiz qui vaut 10 %\./g,'Dans une moyenne pondérée de délais, un groupe de 80 personnes pèse davantage qu’un groupe de 20 personnes.')
 .replace(/Supposer que les élèves absents à l'examen auraient eu la même note que les présents/g,'Supposer que les personnes perdues de vue auraient eu la même issue que les personnes suivies');
}
function nettoyer(v,champ=''){
 if(typeof v==='string')return nettoyerTexte(v,champ);
 if(Array.isArray(v))return v.map(x=>nettoyer(x,champ));
 if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).filter(([k])=>!['diapos','enseignant','professeur','universite','institution','coursSource','horsProgramme'].includes(k)).map(([k,x])=>[k,nettoyer(x,k)]));
 return v;
}
function remapper(v,map,champ=''){
 if(typeof v==='number'&&['chapitre','chap','chapitreNumero'].includes(champ))return map[v]??v;
 if(Array.isArray(v))return v.map(x=>typeof x==='number'&&champ==='chapitres'?(map[x]??x):remapper(x,map,champ));
 if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,remapper(x,map,k)]));
 if(typeof v==='string')return v.replace(/\bchapitre\s+(\d+)\b/gi,(m,n)=>m.replace(n,String(map[n]??n))).replace(/\bch\.\s*(\d+)\b/gi,(m,n)=>m.replace(n,String(map[n]??n))).replace(/\b([cs])(\d{2})(-p\d+)/g,(m,p,n,fin)=>p+pad(map[Number(n)]??Number(n))+fin);
 return v;
}
function ficheDepuisLecon(l){return {chapitre:l.chapitre,titre:l.titre,recto:{titre:l.titre,blocs:l.parties.slice(0,3).map((p,i)=>({type:'cadre',numero:i+1,couleur:['bleu','sarcelle','orange'][i],titre:p.titre,largeur:'demi',regles:p.blocs.filter(b=>b.genre==='texte').map(b=>b.texte),consigne:'Explique ce repère avec un exemple distinct.',reference:{chapitre:l.chapitre,section:p.section}}))},verso:{titre:'Vérifier et interpréter',blocs:l.resume.map((t,i)=>({type:'cadre',numero:i+4,couleur:'sarcelle',titre:'Repère '+(i+1),largeur:'demi',regles:[t],consigne:'Donne une limite ou un contre-exemple.'}))}};}
function leconR(n){return {chapitre:n,titre:'R et Positron : une analyse traçable',objectifs:['Organiser un projet R dans Positron avec un script enregistré.','Contrôler, transformer et décrire une table fictive.','Relier calcul, interprétation, confidentialité et reproductibilité.'],parties:[0,2,5,6,13,18].map((i,k)=>({id:'c'+pad(n)+'-p'+pad(k+1),titre:originaux.sujets[i].titre,section:originaux.sujets[i].titre,blocs:[{genre:'texte',texte:originaux.sujets[i].texte},{genre:'code',code:originaux.donnees+'\n'+originaux.sujets[i].code,sortie:sorties['ex-'+i]},{genre:'question',texte:originaux.sujets[i].consigne,reponse:originaux.sujets[i].interpretation},{genre:'aretenir',texte:'Retrouve l’atelier complet et son script téléchargeable dans « Coder avec R ». Les données sont fictives et la rédaction est propre à cette édition.'}]})),resume:['Le script documente les choix ; la console montre leur exécution.','Les données de démonstration ne décrivent aucune population réelle.','Une commande qui s’exécute n’est pas une validation scientifique.']};}

const bilan={};
for(const nom of ['statosphere','episphere']){
 const fichier=path.join(racine,'applications',nom,'contenu.json.gz');
 const original=JSON.parse(zlib.gunzipSync(fs.readFileSync(fichier)));
 if(original['edition-publique.json']?.version===version)throw Error('La migration a déjà été appliquée à '+nom);
 const ordre=nom==='statosphere'?[0,1,3,2,19,4,21,5,31,6,7,8,9,10,11,12,13,16,17,32,33,34,35,36]:[1,2,4,5,6,3,8,9,7,10,11,12,14,15,16,17,18,19,20,21];
 const map=Object.fromEntries(ordre.map((n,i)=>[n,i+1]));
 const cours={};
 for(const [k,v]of Object.entries(original)){
  if(/^qcm\//.test(k)||k==='seances.json'||k.startsWith('tutoriel-r/')||k==='precalcul/jeux.json')continue;
  const nouveau=k.replace(/^(lecons|fiches)\/chapitre-(\d+)\.json$/,(m,d,n)=>d+'/chapitre-'+pad(map[Number(n)]??Number(n))+'.json');
  cours[nouveau]=nettoyer(remapper(v,map));
 }
 const qs=[];
 for(const [k,b]of Object.entries(original))if(k.startsWith('qcm/seance-'))for(const q of b.questions||[])qs.push(nettoyer(remapper(q,map)));
 if(nom==='statosphere'){
  const r=leconR(map[21]);cours['lecons/chapitre-'+pad(r.chapitre)+'.json']=r;cours['fiches/chapitre-'+pad(r.chapitre)+'.json']=ficheDepuisLecon(r);
  for(const c0 of originaux.nouveauxChapitres){const c=structuredClone(c0);c.parties.forEach((p,i)=>p.blocs.forEach((b,j)=>{if(b.genre==='code')b.sortie=sorties['chap-'+c.chapitre+'-'+i+'-'+j];}));cours['lecons/chapitre-'+pad(c.chapitre)+'.json']=c;cours['fiches/chapitre-'+pad(c.chapitre)+'.json']=ficheDepuisLecon(c);}
  originaux.questionsOriginales.forEach((a,i)=>{
   const [ch,enonce,choix,bonne,explication]=a,rotation=i%choix.length;
   const c=choix.slice(rotation).concat(choix.slice(0,rotation)),b=(bonne-rotation+choix.length)%choix.length;
   qs.push({id:'original-public-'+pad(i+1),chapitre:ch,type:'concept',enonce,choix:c,bonne:b,explication,pourquoiFaux:c.map((_,j)=>j===b?null:explication),reference:{chapitre:ch,section:'Atelier autonome'}});
  });
 }
 const lecons=Object.entries(cours).filter(([k])=>k.startsWith('lecons/')).map(([,v])=>v).sort((a,b)=>a.chapitre-b.chapitre);
 const seances=lecons.map(l=>({id:'module-'+pad(l.chapitre),numero:l.chapitre,titre:l.titre,court:'Module '+l.chapitre,type:'module',contenu:true,chapitres:[l.chapitre],devoirs:[],couvre:[]}));
 cours['seances.json']={titre:'Parcours autonome, sans calendrier imposé',seances};
 const qIds=new Map();
 qs.forEach((q,i)=>{const ancien=q.id;q.id=nom+'-m'+pad(q.chapitre)+'-q'+pad(i+1);qIds.set(ancien,q.id);});
 for(const s of seances)cours['qcm/seance-'+s.id+'.json']={seance:s.id,titre:s.titre,questions:qs.filter(q=>q.chapitre===s.chapitres[0])};
 cours['tutoriel-r/tutoriel.json']=tutoriel();
 cours['tuteur/conseils.json']={"ecrans":[{"ecran":"accueil","conseils":["Choisis un module selon ta question, sans calendrier imposé.","Un exemple chiffré sert à discuter une méthode ; il ne décrit pas une étude réelle."]},{"ecran":"reviser","conseils":["Reformule une notion avant de consulter la correction.","Vérifie le dénominateur, l’unité et les hypothèses du calcul.","Utilise un autre exemple pour vérifier que tu as compris."]},{"ecran":"catalogue","conseils":["Lis la définition, le rôle des symboles et les limites avant de copier une formule.","Une source scientifique est un repère de méthode, pas une preuve que toute application de la formule est correcte."]},{"ecran":"coder-r","conseils":["Ouvre un dossier de projet dans Positron et garde tes commandes dans un script.","Le script téléchargé contient les données fictives nécessaires.","Vérifie un petit calcul à la main avant d’interpréter une sortie."]},{"ecran":"jeux","conseils":["Une erreur est une occasion de discuter le raisonnement, pas une note.","Choisis toutes les notions pour varier les situations."]}]};
 cours['precalcul/lectures.json']={};
 const anciensJeux=nettoyer(remapper(original['precalcul/jeux.json'],map));
 const elements={paires:anciensJeux.elements.paires||{},situations:{},calculs:{},affirmations:{}};
 const originauxR=originaux.questionsOriginales.filter(q=>q[0]===7);
 originauxR.forEach((a,i)=>{elements.situations['r-original-'+i]={id:'r-original-'+i,texte:a[1],cases:a[2],bonne:a[3],explication:a[4],ordreFixe:false};});
 const valides=new Set(qs.map(q=>q.id));
 for(const [id,x]of Object.entries(anciensJeux.elements.calculs||{}))if(qIds.has(id)){const n=qIds.get(id);elements.calculs[n]={...x,id:n};}
 for(const q of qs)q.choix.forEach((c,i)=>{const id=q.id+'-choix-'+i;elements.affirmations[id]={id,texte:c,vraie:i===q.bonne,explication:q.explication,groupe:q.id,contexte:q.enonce};});
 const portee=(s)=>{
  const chap=s?new Set(s.chapitres):null;
  const idsQ=new Set(qs.filter(q=>!chap||chap.has(q.chapitre)).map(q=>q.id));
  const idsP=(cours['catalogue.json']?.entries||[]).filter(e=>!chap||chap.has(e.chapitre)).map(e=>e.id).filter(id=>elements.paires[id]);
  return {id:s?s.id:'tout',libelle:s?'Module '+s.numero+' · '+s.titre:'Toutes les notions',detail:'À son rythme',seances:s?[s.id]:seances.map(x=>x.id),chapitres:s?s.chapitres:lecons.map(l=>l.chapitre),plusLoin:false,paires:idsP,situations:Object.keys(elements.situations),calculs:Object.keys(elements.calculs).filter(id=>idsQ.has(id)),affirmations:Object.values(elements.affirmations).filter(x=>idsQ.has(x.groupe)).map(x=>x.id)};
 };
 cours['precalcul/jeux.json']={portees:[portee(null),...seances.map(portee)],elements,calculsParSeance:seances.map(s=>({cle:s.id,pastille:'Module '+s.numero,nom:'module '+s.numero,calculs:portee(s).calculs}))};
 cours['edition-publique.json']={version,date:'2026-10-15',titre:nom==='statosphere'?'Statosphère':'Épisphère',auteur:'Éric Bernier',nature:'Parcours autonome ; nouvelles rédactions et données fictives propres à cette édition.',sources:[{titre:'R Core Team. R: A language and environment for statistical computing. Documentation officielle.',url:'https://cran.r-project.org/manuals.html'},{titre:'Posit. R in Positron. Documentation officielle.',url:'https://positron.posit.co/guide-r.html'}],tutoriel:'Rédaction entièrement nouvelle, exemples et scripts autonomes ; aucun texte du tutoriel antérieur conservé.'};
 // Supprimer les renvois devenus sans cible après le déplacement des chapitres.
 for(const q of qs)if(q.lecon&&!lecons.some(l=>l.parties?.some(p=>p.id===q.lecon)))delete q.lecon;
 for(const q of qs){if(nom==="statosphere"&&q.chapitre===7){delete q.lecon;q.reference={chapitre:7};}if(!Number.isInteger(q.bonne)||q.bonne<0||q.bonne>=q.choix.length)throw Error('QCM invalide : '+q.id);if(!lecons.some(l=>l.chapitre===q.chapitre))throw Error('Chapitre manquant : '+q.id);}
 for(const s of seances)if(!cours['qcm/seance-'+s.id+'.json'])throw Error('Module sans banque');
 const serialise=JSON.stringify(cours);
 if(/MSO\s*[- ]?\d{4}|StudiUM|examen (intra|final)|tutoriel R du cours/i.test(serialise))throw Error('Une référence institutionnelle subsiste dans '+nom);
 fs.writeFileSync(fichier,zlib.gzipSync(Buffer.from(serialise),{level:9}));
 bilan[nom]={lecons:lecons.length,qcm:qs.length,calculs:qs.filter(q=>q.type==='calcul').length,tutoriel:originaux.sujets.length,chapitresReordonnes:true};
}
const provenance=JSON.parse(fs.readFileSync(path.join(__dirname,'spheres-publication.json'),'utf8'));
provenance.date='2026-10-15';provenance.version=version;provenance.bilan=bilan;
provenance.revision={tutoriel:'Rédaction originale pour Positron ; données fictives et sorties calculées avec R.',organisation:'Modules autonomes sans calendrier, examens, nom de cours ni enseignant.',ajouts:'Échantillonnage et précision ; comparaisons de moyennes et de proportions ; lecture critique des résultats.',sourcesScientifiquesConservees:true,originauxPersonnelsModifies:false};
fs.writeFileSync(path.join(__dirname,'spheres-publication.json'),JSON.stringify(provenance,null,2)+'\n');
console.log(JSON.stringify({bilan,scriptsR:blocsR.length,sortiesCalculees:Object.keys(sorties).length}));
