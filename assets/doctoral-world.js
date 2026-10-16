import {createEricAvatar} from "./eric-avatar-3d.js?v=7";
/*
 * Immersive, procedural Three.js environments for the doctoral game.
 * Entirely original geometry with Eric's articulated 3D avatar.
 * Continuous game world: approach activities, click points of interest or move with ZQSD.
 */
export const PLACES=[
 {id:"university",name:"Université et campus",sub:"Arrivée · vie académique",color:0xf36633},
 {id:"classroom",name:"Salles de cours",sub:"Séminaires, examen de synthèse",color:0xe4aa54},
 {id:"laboratory",name:"Laboratoire de recherche",sub:"Protocoles, méthodes et données",color:0x59c4b6},
 {id:"library",name:"Bibliothèque universitaire",sub:"Lectures, concepts et preuves",color:0xae94e1},
 {id:"office",name:"Mon bureau",sub:"Direction, écriture et révisions",color:0xf2b081},
 {id:"home",name:"La maison",sub:"Équilibre et vie quotidienne",color:0xe9c995},
 {id:"conference",name:"Congrès scientifique",sub:"Affiches, présentations et échanges",color:0xdb8eac},
 {id:"rink",name:"Patinoire de hockey",sub:"Glisse, équilibre et énergie",color:0x85cff6},
 {id:"field",name:"Terrain et partenaires",sub:"Rencontres et implantation",color:0x85c7a1},
 {id:"auditorium",name:"Grand amphithéâtre",sub:"Soutenances et examen du jury",color:0xeaa567}
];
const color={orange:0xf36633,cream:0xf0efed,ink:0x151515,teal:0x286d5c,stone:0x73868a};
export function createAdventureWorld(T,canvas,opts={}){
 const choose=key=>PLACES.find(p=>p.id===key)||PLACES[0];
 let room="university",scene,camera,renderer,group,player,eric;
 let last=0,lastNavigation=0,clock=0,modelX=0,modelZ=7,busy=false,auto=null,actors=[],targets=[],clickables=[],particles=[],chasers=[],collectibles=[],hitCooldown=0,activeTarget=null,controls=opts.keys||new Set();
 let skate={balance:0,clock:0,falls:0,completed:false,started:false,lastReport:0,gateIndex:0,gates:[],velocityX:0,velocityZ:0};
 const mat=(hex,metal=.05,rough=.65,glow=0)=>new T.MeshStandardMaterial({color:hex,metalness:metal,roughness:rough,emissive:glow?hex:0,emissiveIntensity:glow});
 // Art-directed PBR surface maps, generated deterministically in-browser.
 const materialMap=(kind)=>{
  const seed=(x,y)=>{let n=(Math.imul(x+11,374761393)+Math.imul(y+17,668265263))|0;
   n=Math.imul(n^(n>>>13),1274126177);return (n^(n>>>16))>>>0;};
  const t=tex(512,512,(g,w,h)=>{
   if(kind==="wood"){
    g.fillStyle="#ab8060";g.fillRect(0,0,w,h);
    for(let y=0;y<h;y++){
     const wave=Math.sin(y*.044)*8+Math.sin(y*.009)*15,noise=seed(y,8)%35;
     g.strokeStyle="rgba(62,35,21,"+(.04+noise/950)+")";g.lineWidth=1+(y%17===0?1:0);
     g.beginPath();g.moveTo(-8,y);g.bezierCurveTo(130,y+wave,320,y-wave/2,520,y+wave);g.stroke();
    }
    for(let x=0;x<w;x+=128){g.strokeStyle="#4f342e4a";g.lineWidth=3;g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke();}
   }else if(kind==="brick"){
    g.fillStyle="#655b58";g.fillRect(0,0,w,h);
    for(let y=0;y<h;y+=57){let offset=(y/57)%2===0?0:-68;
     for(let x=-140+offset;x<w+140;x+=136){
      const tone=seed(x,y)%20;g.fillStyle="rgb("+(143+tone)+","+(101+tone/2)+","+(85+tone/3)+")";
      g.fillRect(x+3,y+3,131,51);
      g.strokeStyle="#f5d5bb12";g.lineWidth=1;g.strokeRect(x+6,y+6,125,46);
     }
    }
   }else if(kind==="wall"){
    g.fillStyle="#536a73";g.fillRect(0,0,w,h);
    for(let i=0;i<12000;i++){
     const x=seed(i,1)%w,y=seed(i,2)%h;
     g.fillStyle=i%3===0?"#d0d4cb0e":"#081a2517";g.fillRect(x,y,1+(i%3),1+(i%2));
    }
    for(let x=0;x<w;x+=256){g.strokeStyle="#d3e4d32f";g.lineWidth=3;g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke();}
   }else if(kind==="ice"){
    g.fillStyle="#d0ebf3";g.fillRect(0,0,w,h);
    for(let i=0;i<1100;i++){
     const x=seed(i,3)%w,y=seed(i,4)%h,len=7+seed(i,5)%55;
     g.strokeStyle=i%4===0?"#6ba6b822":"#ffffff56";g.lineWidth=.7;
     g.beginPath();g.moveTo(x,y);g.lineTo(x+len,y+(i%2?2:-3));g.stroke();
    }
   }
  });
  t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(2,2);
  t.anisotropy=8;return t;
 };
 const woodMap=materialMap("wood"),brickMap=materialMap("brick"),wallMap=materialMap("wall"),iceMap=materialMap("ice");
 const PBR={
  brick:new T.MeshStandardMaterial({color:0xffffff,map:brickMap,bumpMap:brickMap,bumpScale:.012,roughness:.86,metalness:.03}),
  wood:new T.MeshStandardMaterial({color:0xffffff,map:woodMap,bumpMap:woodMap,bumpScale:.006,roughness:.64,metalness:.03}),
  wall:new T.MeshStandardMaterial({color:0xffffff,map:wallMap,bumpMap:wallMap,bumpScale:.007,roughness:.82,metalness:.07}),
  ice:new T.MeshPhysicalMaterial({color:0xffffff,map:iceMap,roughness:.16,metalness:.18,clearcoat:.65,clearcoatRoughness:.08})
 };
 const M={
  white:mat(color.cream),dark:mat(0x18313f),wall:PBR.wall,blue:mat(0x17455c),wood:PBR.wood,metal:mat(0x657987,.65,.27),
  glass:new T.MeshPhysicalMaterial({color:0x76aec1,transparent:true,opacity:.34,metalness:.1,roughness:.11,side:T.DoubleSide}),
  neon:mat(color.orange,.3,.26,.6),green:mat(color.teal,.18,.46,.3),black:mat(0x19252c),ice:PBR.ice
 };
 function shape(geo,material,x=0,y=0,z=0,parent=group){
  const mesh=new T.Mesh(geo,material);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
 }
 const cube=(a,b,c,material,x,y,z,parent)=>shape(new T.BoxGeometry(a,b,c),material,x,y,z,parent);
 const ball=(r,material,x,y,z,parent)=>shape(new T.SphereGeometry(r,16,12),material,x,y,z,parent);
 const cyl=(r,h,material,x,y,z,parent)=>shape(new T.CylinderGeometry(r*.95,r,h,16),material,x,y,z,parent);
 const plane=(a,b,m,x,y,z,parent)=>shape(new T.PlaneGeometry(a,b),m,x,y,z,parent);
 function tex(w,h,painter){
  const c=document.createElement("canvas");c.width=w;c.height=h;const g=c.getContext("2d");painter(g,w,h);
  const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=4;return t;
 }
 function sign(text,x,y,z,w=5,h=.9,parent=group,orange=false){
  if(typeof parent==="boolean"){orange=parent;parent=group;}
  const map=tex(900,160,(c,W,H)=>{
   c.fillStyle=orange?"#f36633":"#0d2a3c";c.fillRect(0,0,W,H);
   c.strokeStyle=orange?"#fff3e8":"#a4e7ce";c.lineWidth=7;c.strokeRect(5,5,W-10,H-10);
   c.fillStyle="#ffffff";c.textAlign="center";c.textBaseline="middle";c.font="700 59px Arial";
   c.fillText(text,450,84,838);
  });
  const o=plane(w,h,new T.MeshBasicMaterial({map,side:T.DoubleSide}),x,y,z,parent);o.castShadow=false;return o;
 }
 function floorboard(w=31,d=41,base=0x7e98a0){
  const tilemap=tex(512,512,(g,W,H)=>{
   g.fillStyle="#223a4b";g.fillRect(0,0,W,H);
   for(let i=0;i<W;i+=64)for(let j=0;j<H;j+=64){
    g.fillStyle=(i+j)%128===0?"#39515d":"#304958";g.fillRect(i+3,j+3,58,58);
    g.strokeStyle="#65818b";g.lineWidth=2;g.strokeRect(i+3,j+3,58,58);
   }
  });
  tilemap.wrapS=tilemap.wrapT=T.RepeatWrapping;tilemap.repeat.set(3,4);
  const tile=new T.MeshStandardMaterial({map:tilemap,color:base,roughness:.61,metalness:.08});
  cube(w,.12,d,tile,0,-.08,-5);return tile;
 }
 function roomShell(theme=0x2f4152,light=0x6cbfb0){
  scene.background=new T.Color(0x111d29);scene.fog=new T.FogExp2(0x111d29,.012);
  floorboard();
  for(const x of [-15.8,15.8])cube(.55,10,42,mat(theme),x,5,-5);
  cube(32,10,.5,mat(theme),0,5,-26);
  cube(32,.42,42,mat(0x516a78),0,10,-5);
  for(let x=-12;x<=12;x+=6){const strip=cube(3.7,.12,26,M.neon,x,9.78,-5);strip.material=M.white;}
  for(const x of [-15.47,15.47])for(let z=-19;z<12;z+=8){
   const glass=cube(.09,4,5,M.glass,x,5,z);
   cube(.1,4.8,.18,M.metal,x,5,z-2.55);cube(.1,4.8,.18,M.metal,x,5,z+2.55);
   // Windows reflect the exterior light without adding one expensive dynamic lamp per pane.
  }
  for(let z=-18;z<12;z+=14)for(const x of [-8,0,8]){
   const light=new T.PointLight(0xffe3bb,2.0,13);light.position.set(x,8.5,z);group.add(light);
  }
  sign("↶  RETOUR AU CAMPUS",0,3.8,13,5.4,.75);
  hotspot("exit","Retour au campus",0,12.2,"exit");
 }
 function hotspot(id,label,x,z,type="activity"){
  const ring=new T.Group();ring.position.set(x,.1,z);group.add(ring);
  const m=mat(type==="exit"?0x8eeccf:color.orange,.25,.25,.6);
  const halo=shape(new T.TorusGeometry(.7,.058,8,40),m,0,0,0,ring);halo.rotation.x=-Math.PI/2;halo.castShadow=false;
  const gem=shape(new T.OctahedronGeometry(.32),m,0,1.65,0,ring);gem.castShadow=false;
  const text=sign(label,0,2.48,0,2.85,.44,ring);
  targets.push({id,label,x,z,type,ring,gem,text,armed:true});
  clickables.push({mesh:ring,id});
 }
 function clue(label,x,z,index){
  const g=new T.Group();g.position.set(x,1.1,z);group.add(g);
  shape(new T.IcosahedronGeometry(.35,1),mat([color.orange,0xa3e4c1,0x9fd7e8][index%3],.4,.22,.65),0,0,0,g);
  const tor=shape(new T.TorusGeometry(.57,.046,8,32),M.white,0,-.35,0,g);tor.rotation.x=Math.PI/2;
  const t=sign(label,0,1.03,0,2.6,.43,g);
  collectibles.push({id:room+"-"+index,label,group:g,x,z,t,taken:false});
}
function pursuer(name,x,z,speed=2.7){
  const g=new T.Group();g.position.set(x,0,z);group.add(g);
  const purple=mat(0x9d597d,.25,.28,.65),page=mat(0xf2dfcc),accent=mat(0xf36633,.3,.28,.5);
  for(let j=0;j<7;j++){const p=cube(.9,.065,.6,j%3===0?accent:page,Math.cos(j*2.2)*.38,1.6+(j-3)*.12,Math.sin(j*2.2)*.25,g);p.rotation.y=j*.32;p.rotation.z=j*.25;}
  ball(.28,purple,0,2.5,0,g);sign(name,0,3.25,0,3,.47,g,true);
  chasers.push({group:g,x,z,startX:x,startZ:z,speed,phase:Math.random()*5});
}
function decoratePlay(){
  if(room==="rink")return;
  const labels=room==="university"?["Relevé universitaire","Lettre de motivation","Avant-projet doctoral"]:
    room==="laboratory"?["Codebook","Variables","Données vérifiées"]:
    room==="office"?["Avis du jury","Commentaires","Plan de thèse"]:
    room==="classroom"?["Notes de cours","Épreuve","Formule"]:
    room==="conference"?["Résumé","Affiche","Collaboration"]:
    room==="library"?["Preuve 1","Synthèse","Article original"]:
    room==="home"?["Reposer les yeux","Prendre des notes","Dernier café"]:
    room==="auditorium"?["Argument","Données","Limites"]:
    ["Acteurs","Réseau","Terrain"];
  for(let i=0;i<3;i++)clue(labels[i],-8+i*8, i%2===0?-8:-17,i);
  if(["university","office","classroom","conference","auditorium"].includes(room)){
   pursuer(room==="university"?"LA DATE LIMITE":"REVIEWER 2",-9,-17,room==="auditorium"?3.3:2.65);
   if(room==="office"||room==="university")pursuer("COURRIEL URGENT",8,-19,2.4);
  }
}
function desk(x,z,width=2.3,screen=false){
  cube(width,.14,1.28,M.wood,x,1.16,z);
  for(const a of [-1,1])for(const b of [-1,1])cube(.10,1.09,.1,M.metal,x+a*(width*.43),.54,z+b*.48);
  if(screen){cube(1.26,.74,.09,M.black,x,1.86,z-.27);cube(1.15,.58,.01,mat(0x429e9b,.35,.29,.5),x,1.86,z-.328);cube(.50,.06,.23,M.metal,x,1.38,z-.27);}
  cube(.62,.08,.3,M.black,x,1.28,z+.32);
 }
 function chair(x,z){cube(.66,.15,.7,M.dark,x,.62,z);cube(.65,.88,.13,M.dark,x,1.06,z+.35);cyl(.06,.56,M.metal,x,.28,z);}
 function lamp(x,z){cyl(.10,3,M.metal,x,1.5,z);const shade=cyl(.46,.38,M.white,x,3.14,z);shade.material=M.neon;ball(.3,M.white,x,3.28,z);}
const cast=[
  ["La doyenne","Ton inscription est une étape. Le plus dur sera de garder une question cohérente.", "Sam, chercheur","Un objectif de moins vaut parfois un article de plus.", "Responsable de programme","Le calendrier est une métaphore, pas une course contre une date réelle."],
  ["Prof de biostat","Définis d'abord ton estimand, ensuite seulement ton modèle.", "Doctorante","Évaluer la confusion n'est pas facultatif.", "Prof de méthodes","Ce qui n'est pas mesuré ne devient pas vrai par magie."],
  ["Bibliothécaire","Retrouve les sources primaires. Un DOI inventé ne passera pas.", "Collègue","Cet article ressemble à ton sujet. Voilà une vraie lacune à construire.", "Archiviste","Ta revue de littérature a besoin d'une stratégie explicite."],
  ["Méthodologue","Observation transversale ne veut pas dire causalité.", "Data manager","As-tu les droits d'utiliser ces données ?", "Biostatisticienne","Regarde les données manquantes avant d'ajuster le modèle."],
  ["Direction de thèse","Quatre objectifs ? Et le cinquième, tu le gardes pour la retraite ?", "Collègue","Un doctorat n'est pas un championnat de diapositives.", "Éric du futur","Le manuscrit attend. Le café aussi."],
  ["Amie","Une soirée sans corriger un manuscrit reste autorisée.", "Éric du futur","Fais du sommeil un élément de ton protocole.", "Voisin","Même la revue systématique peut attendre demain."],
  ["Organisatrice","Tu as 10 minutes. Pas trois thèses entières à raconter.", "Partenaire","Que vais-je pouvoir faire de tes résultats ?", "Reviewer 2","Très intéressant… et qu'en est-il de la validité externe ?"],
  ["Entraîneur","Trouve ton équilibre : les deux patins doivent coopérer.", "Gardien","Ne tire pas sur la barre… même si Reviewer 2 insiste.", "Coéquipier","Une chute vaut une bonne histoire au laboratoire."],
  ["Maya, intervenante","Le nom d'un service dans l'annuaire n'est pas une collaboration.", "Partenaire communautaire","Demande aux personnes ce qui leur est réellement accessible.", "Coordonnatrice","Sur le terrain, l'organigramme ne raconte pas tout."],
  ["Présidente du jury","Dites-nous ce que vos données peuvent établir, et ce qu'elles ne peuvent pas.", "Évaluateur externe","Vous avez choisi ce devis. Pourquoi pas un autre ?", "Reviewer 2","J'ai seulement dix-sept petites questions."]
 ];
 const dialogueByRoom={university:0,classroom:1,laboratory:3,library:2,office:4,home:5,conference:6,rink:7,field:8,auditorium:9};
 function npc(x,z,shirt=0x36576d,move=0){
  const body=new T.Group();group.add(body);body.position.set(x,0,z);
  const jacket=mat(shirt);cyl(.33,1.05,jacket,0,1.25,0,body);
  ball(.27,mat(0xd1a389),0,2.05,0,body);
  ball(.27,mat(0x302824),0,2.25,.05,body).scale.y=.35;
  for(const side of [-1,1]){cube(.16,.90,.22,jacket,side*.43,1.30,0,body);cube(.23,.83,.24,M.black,side*.15,.47,0,body);}
  const dialogueSet=cast[dialogueByRoom[room]||0],position=actors.length%3;
  const name=dialogueSet[position*2],line=dialogueSet[position*2+1];
  const nameTag=sign(name,0,3.02,0,2.65,.42,body);
  actors.push({body,x,z,move,sway:Math.random()*5,name,line,nameTag,met:false});
 }
 function plant(x,z){cyl(.5,.72,M.wood,x,.33,z);for(let j=0;j<5;j++){const a=j*Math.PI*2/5;const foliage=ball(.55,M.green,x+Math.sin(a)*.37,1.27+Math.cos(a)*.14,z+Math.cos(a)*.37);foliage.scale.y=1.7;}}
 function windowFrame(x,y,z,w=2.6,h=3.4){cube(w,h,.07,M.glass,x,y,z);for(const u of [-1,1])cube(.07,h,.15,M.metal,x+u*w/2,y,z);cube(w,.08,.13,M.metal,x,y,z);}
 function books(x,y,z,n=11){for(let i=0;i<n;i++){const colors=[0x9f754c,0x4b7773,0xd3b083,0x86648a];cube(.19,.66+.13*(i%3),.54,mat(colors[i%4]),x+i*.22,y,z);}}
 function posters(x,z){for(let i=0;i<3;i++){
  const c=tex(256,390,(g,w,h)=>{
   g.fillStyle="#f9f4ec";g.fillRect(0,0,w,h);g.fillStyle=["#f36633","#286d5c","#293b5c"][i];g.fillRect(0,0,w,58);
   g.fillStyle="#1c3344";g.fillRect(20,83,190,9);g.fillRect(20,100,165,7);
   for(let j=0;j<5;j++){g.fillStyle=j%2?"#b9ced2":"#e3e9e8";g.fillRect(20,130+j*34,212,20);}
   g.fillStyle="#f36633";g.fillRect(20,322,205,24);
  });
  const p=plane(2.5,3.8,new T.MeshBasicMaterial({map:c,side:T.DoubleSide}),x+(i-1)*3,3.2,z);p.castShadow=false;
 }}
 function university(){
  scene.background=new T.Color(0x152e43);scene.fog=new T.FogExp2(0x152e43,.012);
  const grass=mat(0x3e6252),stone=mat(0x8b999e),brick=PBR.brick;
  cube(95,.12,95,grass,0,-.1,-5);cube(12,.14,65,stone,0,0,-8);
  for(let x of [-25,25]){
   cube(15,11,19,brick,x,5.5,-17);
   for(let y of [2,5,8])for(let dx of [-4.8,0,4.8])windowFrame(x+dx,y,-7.42,3,2.1);
   cube(15.6,.4,20,M.dark,x,11,-17);
  }
  cube(24,11,13,mat(0x6e858b),0,5.5,-22);
  for(const x of [-10,-6,-2,2,6,10])cyl(.58,9,M.white,x,4.6,-15);
  cube(24,1.0,14,stone,0,10.9,-22);
  sign("UNIVERSITÉ · ESPUM",0,12.25,-15.05,9,1.1,true);
  cube(6.5,2.9,.35,M.glass,0,1.4,-15.1);
  const f=mat(0xf36633,.15,.43,.25);
  for(const xx of [-6,6]){cube(.3,3,.3,f,xx,1.5,5);cube(1.5,.4,1.5,stone,xx,.22,5);}
  for(const xx of [-12,12])for(const zz of [1,-7,-15])plant(xx,zz);
  for(const x of [-8,8]){cube(3,.19,.65,M.wood,x,.45,-2);cube(.14,.7,.64,M.metal,x,.25,-2);}
  npc(5,-2,0x725f65,1);npc(-6,-9,0x275a67,2);npc(9,-13,0x365473,1);
  sign("ACCÈS AUX ESPACES DE VIE",0,5.2,-6,8,.8);
  hotspot("admission","Déposer ma candidature",0,-9,"activity");
  const portals=[
   ["classroom","Cours",-9,-5],["laboratory","Labo",9,-5],["library","Bibliothèque",-9,-15],["office","Bureau",9,-15],
   ["home","Maison",-20,6],["conference","Congrès",20,6],["rink","Hockey",-20,-14],["field","Terrain",20,-14],["auditorium","Jury",0,-24]
  ];
  for(const [id,label,x,z] of portals){
   const arch=mat(choose(id).color,.5,.25,.4);
   const gate=new T.Group();gate.position.set(x,0,z);group.add(gate);
   for(const dx of [-1.3,1.3])cube(.27,3,.55,M.white,dx,1.5,0,gate);
   cube(2.9,.36,.55,arch,0,3.15,0,gate);
   const pane=cube(2.47,2.6,.08,M.glass,0,1.7,0,gate);
   pane.material=new T.MeshBasicMaterial({color:choose(id).color,transparent:true,opacity:.17,side:T.DoubleSide});
   hotspot(id,label,x,z,"portal");
  }
 }
 function classroom(){
  roomShell(0x32445b,0xf3c78b);
  const board=cube(16,4.5,.18,mat(0x163f41),0,5,-25.5);board.castShadow=false;
  sign("EPIDÉMIOLOGIE  ·  EXAMEN DE SYNTHÈSE",0,7.7,-25,12,1.1,true);
  for(let row=0;row<5;row++)for(let col=0;col<4;col++){
   const x=(col-1.5)*5,z=-19+row*4.5;
   desk(x,z,2.5);chair(x,z+1.45);
  }
  cube(4.7,1.2,1.9,M.wood,0,1.3,-22.6);
  npc(2,-23,0x627c83);npc(-6,-15,0x7b625a);npc(7,-7,0x275a67);
  for(let x of [-10,10])windowFrame(x,5,-25,4.2,3.7);
  hotspot("lesson","Assister au séminaire",1,-13);
  hotspot("exam","Passer l'examen",0,-22);
 }
 function laboratory(){
  roomShell(0x1d4053,0x7deecf);sign("CENTRE DE RECHERCHE · DONNÉES",0,8.1,-25,13,1.1,true);
  for(let x of [-9,-3,3,9]){desk(x,-12,3,true);desk(x,-20,2.4,true);}
  for(let z of [-19,-10,-1])for(let x of [-13,13]){
   const rack=cube(1.35,5,1.3,M.black,x,2.5,z);
   for(let j=0;j<7;j++){const led=cube(.75,.065,.03,j%3===0?M.neon:M.green,x,1+j*.55,z+.67);led.castShadow=false;}
  }
  for(const xx of [-9,-3,3,9]){const v=cyl(.17,.75,M.glass,xx,1.72,-12.9);ball(.2,M.green,xx,2.18,-12.9);}
  npc(5,-6,0x629c97,1);npc(-5,-16,0x4b7880,1);
  hotspot("protocol","Construire le protocole",-4,-13);
  hotspot("data","Vérifier les analyses",4,-19);
 }
 function library(){
  roomShell(0x3f3b4c,0xf0cb9a);
  sign("BIBLIOTHÈQUE · ARCHIVES SCIENTIFIQUES",0,8,-25,14,1.1,true);
  for(let x of [-12,-8,8,12])for(let z=-23;z<7;z+=6){
   cube(1.05,5.7,3.8,M.wood,x,2.85,z);
   for(let k=0;k<5;k++){cube(1.05,.12,3.8,M.metal,x,.55+k*1.05,z);books(x-.3,1+k*.98,z+1.9,4);}
  }
  for(const x of [-4,0,4]){desk(x,-10,2.6);chair(x,-8.8);}
  npc(-3,-5,0x5f5064);npc(6,-18,0x4a696b);
  hotspot("bibliography","Explorer les ouvrages",-6,-19);
  hotspot("concept","Relier les concepts",5,-12);
 }
 function office(){
  roomShell(0x435062,0xf9bc8a);sign("BUREAU · DIRECTION ET RÉDACTION",0,8,-25,14,1.05,true);
  for(const z of [-20,-13])for(const x of [-10,7]){desk(x,z,3.2,true);chair(x,z+1.5);}
  for(let x of [-13,13])for(let z of [-22,-12,-2]){cube(.5,5,3.2,M.wood,x,2.6,z);books(x-.3,1.7,z+1,3);}
  posters(-4,-25.4);lamp(4,-6);npc(1,-10,0x465e77,1);npc(-7,-6,0x774c47);
  hotspot("supervisor","Rencontre de direction",-7,-9);
  hotspot("writing","Rédiger au bureau",7,-17);
 }
 function home(){
  roomShell(0x58483b,0xf5bd80);
  const rug=mat(0x8d5a5e);cube(12,.06,11,rug,0,.01,-9);
  cube(6,1.1,2,M.wood,-7,.55,-15);cube(6,1.4,.42,mat(0x72868b),-7,1.4,-16);
  for(let x of [-8,-6,-4])cube(1.8,.3,1.4,mat(0xc7b29d),x,1.2,-14);
  cube(2,.7,1.4,M.wood,-5,.35,-9);cube(3.5,1.2,1.4,M.wood,8,.7,-14);
  cube(2,2,1.2,mat(0xe1ddd2),9,1,-17);cube(2,2.5,1.2,M.black,9,1.25,-20);
  for(const xx of [-10,10])windowFrame(xx,6,-25,5,3);lamp(-12,-9);lamp(11,5);plant(12,-4);
  npc(-2,-19,0x8d7665);
  sign("À LA MAISON · LES 4 ANS NE DURENT PAS 4 ANS EN VRAI",0,8,-25,14.8,1,true);
  hotspot("rest","Se reposer",0,-13);
  hotspot("planning","Organiser la semaine",8,-9);
 }
 function conference(){
  roomShell(0x3d3345,0xf8bd9c);
  sign("CONGRÈS · RECHERCHE EN SANTÉ PUBLIQUE",0,8,-25,15,1.1,true);
  cube(19,.63,5.5,M.dark,0,.3,-21.3);for(let i=-3;i<=3;i++)cyl(.16,2.5,M.metal,i*2.4,1.6,-20);
  posters(-8,-25.35);posters(8,-25.35);
  cube(2.3,1.8,1.5,M.wood,0,1.55,-21);sign("POSTERS · ATELIERS",0,4.4,-24,8,.7);
  for(let row=0;row<3;row++)for(let col=0;col<7;col++)chair((col-3)*2.2,-12+row*3.1);
  npc(6,-6,0x3d5d78);npc(-8,-4,0x77506d,2);npc(-4,-14,0x78686a);
  hotspot("poster","Présenter une affiche",-8,-19);
  hotspot("talk","Prendre la parole",0,-21);
 }
 function field(){
  scene.background=new T.Color(0x263f4b);scene.fog=new T.FogExp2(0x263f4b,.015);
  cube(70,.15,70,mat(0x455f54),0,-.1,-6);cube(6,.2,65,mat(0x9c9c91),0,.02,-4);
  for(let i=0;i<5;i++){
   const x=i%2?-11:11,z=-21+i*8;
   cube(9,3.8,7,mat(i%2?0x8c846e:0x596f7a),x,1.9,z);
   cube(9.5,.3,7.5,M.dark,x,4,z);
   for(const dx of [-2,2])cube(1.9,1.6,.1,M.glass,x+dx,2.5,z+3.58);
   plant(x+(i%2?-6:6),z+3);
  }
  for(let i=0;i<5;i++)npc((i%2?-4:4),-18+i*7,[0x7a5650,0x456f75,0x4f7c61][i%3],i%2);
  sign("TERRAIN, PARTENAIRES ET SERVICES",0,5.8,-22,12,1,true);
  hotspot("community","Rencontrer les partenaires",-5,-9);
  hotspot("access","Vérifier les accès",6,-18);
  hotspot("exit","Retour au campus",0,12.5,"exit");
 }
 function auditorium(){
  roomShell(0x3d364a,0xf4d4a5);
  cube(20,.7,8,M.wood,0,.35,-21.5);sign("LE JURY A QUELQUES QUESTIONS...",0,8,-25,14.4,1,true);
  cube(11,1.5,1.55,M.wood,0,1.5,-23.2);
  for(let x of [-5,-2.5,0,2.5,5])npc(x,-24,0x42576b);
  for(let i=0;i<7;i++)for(let j=0;j<4;j++)chair((i-3)*2.25,-11+j*2.9);
  hotspot("defense","Soutenir devant le jury",0,-20);
 }
 function rink(){
  // Canadian indoor rink: mapped ice, real board proportions, transparent safety glass,
  // spectator stands, trusses and lit scoreboard. The player can complete a skating course.
  scene.background=new T.Color(0x101d2c);
  scene.fog=new T.FogExp2(0x101d2c,.008);
  const W=27.0,D=46.0,frontZ=18,backZ=-28;
  const boards=mat(0xf4f6f5,.07,.5),red=mat(0xbb3345,.06,.45),blue=mat(0x265fa7,.06,.46);
  const barrier=mat(0xd4e2e8,.7,.28),seat=mat(0x253f55,.18,.65),seatAlt=mat(0x344e62,.16,.6);
  const jumbotron=mat(0x0b1c2c,.6,.36),orange=mat(0xf36633,.15,.35,.3);
  cube(60,.5,75,mat(0x1a2632),0,-.33,-5);
  cube(W+.7,.1,D+.7,mat(0xfafafa,.15,.32),0,.01,-5);
  // High resolution markings are physically on the ice; torus pieces never float above it.
  const iceArtwork=tex(1024,1750,(g,cw,ch)=>{
   const x=u=>u*cw,y=v=>v*ch;
   const paint=(clr,px1,py1,px2,py2,line=8)=>{g.strokeStyle=clr;g.lineWidth=line;g.beginPath();g.moveTo(x(px1),y(py1));g.lineTo(x(px2),y(py2));g.stroke();};
   g.fillStyle="#d8eff5";g.fillRect(0,0,cw,ch);
   // Blue tinted ice with long, quiet scratches from skating.
   for(let i=0;i<3400;i++){
    const a=Math.sin(i*84.3)*337.3,b=Math.sin(i*17.91)*157.7;
    const xx=Math.abs(a-Math.trunc(a))*cw,yy=Math.abs(b-Math.trunc(b))*ch;
    const len=7+(i*17)%90;
    g.strokeStyle=i%4===0?"#fcffff9c":"#7da7b222";g.lineWidth=.5+(i%3)*.32;
    g.beginPath();g.moveTo(xx,yy);g.lineTo(xx+len,yy+(i%4)-2);g.stroke();
   }
   g.strokeStyle="#bd4351";g.lineWidth=9;
   g.strokeRect(x(.045),y(.038),x(.91),y(.925));
   paint("#b32f44",.05,.49,.95,.49,18);
   for(let zz of [.23,.75])paint("#316fae",.05,zz,.95,zz,19);
   // Faceoff circles and dots.
   for(const z of [.18,.82])for(const u of [.25,.75]){
    g.beginPath();g.arc(x(u),y(z),x(.106),0,Math.PI*2);g.strokeStyle="#b9374a";g.lineWidth=9;g.stroke();
    g.fillStyle="#bd3448";g.beginPath();g.arc(x(u),y(z),8,0,Math.PI*2);g.fill();
    paint("#b9374a",u-.015,z-.065,u+.015,z-.065,4);
    paint("#b9374a",u-.015,z+.065,u+.015,z+.065,4);
   }
   g.strokeStyle="#2d699f";g.lineWidth=11;g.beginPath();g.arc(x(.5),y(.49),x(.103),0,Math.PI*2);g.stroke();
   g.fillStyle="#b93647";g.beginPath();g.arc(x(.5),y(.49),9,0,Math.PI*2);g.fill();
   // Goal creases
   for(let z of [.063,.935]){
    g.fillStyle="#9ac7e650";g.strokeStyle="#b9354a";g.lineWidth=7;
    g.beginPath();g.ellipse(x(.5),y(z),x(.073),y(.027),0,0,Math.PI*2);g.fill();g.stroke();
   }
   g.textAlign="center";g.font="900 72px Arial";g.fillStyle="#1f556a1b";
   g.save();g.translate(x(.5),y(.49));g.rotate(-Math.PI/2);g.fillText("PROTOCOLE • ÉRIC",0,0);g.restore();
  });
  iceArtwork.colorSpace=T.SRGBColorSpace;iceArtwork.anisotropy=8;
  const iceMaterial=new T.MeshPhysicalMaterial({map:iceArtwork,metalness:.12,roughness:.18,clearcoat:.90,clearcoatRoughness:.13,reflectivity:.6});
  const iceSurface=shape(new T.PlaneGeometry(W,D),iceMaterial,0,.082,-5);iceSurface.rotation.x=-Math.PI/2;iceSurface.castShadow=false;
  const thinBlue=mat(0x1d4f77),kick=mat(0xf6c833);
  // Proper boards with a yellow kick plate and horizontal red handrail.
  for(const x of [-W/2,W/2]){
   cube(.27,1.24,D,boards,x,.65,-5);
   cube(.30,.10,D,kick,x,.10,-5);cube(.36,.13,D,red,x,1.30,-5);
   for(let z=backZ+2;z<frontZ;z+=4){
    cube(.03,1.07,.04,barrier,x+Math.sign(x)*.165,.75,z);
    cube(.09,2.25,.08,barrier,x+Math.sign(x)*.16,2.55,z);
    cube(.07,2.2,3.93,M.glass,x+Math.sign(x)*.18,2.55,z+1.9).castShadow=false;
   }
  }
  for(const z of [backZ,frontZ]){
   cube(W,1.24,.27,boards,0,.65,z);cube(W,.10,.30,kick,0,.10,z);
   cube(W,.13,.36,red,0,1.30,z);
   for(let x=-W/2+1;x<W/2;x+=4){cube(.08,2.25,.1,barrier,x,2.55,z);cube(3.95,2.2,.07,M.glass,x+1.9,2.55,z).castShadow=false;}
  }
  // Team benches and an ice-level opening onto the tunnel.
  for(let x of [-18.2,18.2]){
   cube(6,.18,6,seat,x,.30,-6);
   for(let row=0;row<4;row++){
    cube(6,.20,1.05,row%2?seat:seatAlt,x,.7+row*.38,-8+row*1.6);
   }
  }
  // Arena seating, with texture-based audience silhouettes for fast rendering.
  const crowdMap=tex(1024,512,(g,w,h)=>{
   g.fillStyle="#1d303e";g.fillRect(0,0,w,h);
   for(let row=0;row<10;row++){
    let yy=40+row*43;
    g.fillStyle=row%2?"#243c4d":"#314959";g.fillRect(0,yy,w,30);
    for(let j=0;j<32;j++){
     const px=14+j*33+(row%2)*11,shift=((j*23+row*17)%11);
     g.fillStyle=["#55788c","#edb17b","#a3adba","#ac664c","#2d6265"][shift%5];
     g.fillRect(px,yy+17,20,18);
     g.beginPath();g.arc(px+10,yy+10,7,0,Math.PI*2);g.fill();
    }
   }
  });
  const crowd=new T.MeshBasicMaterial({map:crowdMap,side:T.DoubleSide});
  for(const x of [-23,23]){
   const grandstand=shape(new T.PlaneGeometry(53,8),crowd,x,5.8,-5);
   grandstand.rotation.y=x>0?-Math.PI/2:Math.PI/2;grandstand.castShadow=false;
   for(let row=0;row<5;row++)cube(3,.65,D,seatAlt,x+Math.sign(x)*(row*.42),1.3+row*.68,-5);
  }
  for(const z of [backZ-8,frontZ+7]){
   const grand=shape(new T.PlaneGeometry(W+16,8),crowd,0,5.9,z);grand.castShadow=false;
   if(z>frontZ)grand.rotation.y=Math.PI;
   for(let row=0;row<5;row++)cube(W+12,.55,2,seat,0,1.2+row*.72,z+Math.sign(z)*row*.54);
  }
  // Red goal frames, mesh netting and posts, at both ends.
  function goal(z,flip){
   const g=new T.Group();g.position.set(0,.14,z);g.rotation.y=flip?Math.PI:0;group.add(g);
   const post=(x)=>cube(.095,1.15,.095,red,x,.60,0,g);
   post(-1.75);post(1.75);cube(3.65,.095,.095,red,0,1.16,0,g);
   for(let i=0;i<=12;i++)for(let j=0;j<=5;j++){
    if(i===0||j===0||i===12||j===5){
     const gnet=mat(0xd8eef3,.1,.92);
     const net=cube(.015,.018,1.0,gnet,-1.7+i*.285,.17+j*.19,-.63,g);
     net.castShadow=false;
    }
   }
   cube(3.55,.045,1.3,mat(0xddeced,.1,.95),0,.20,-.69,g);
  }
  goal(-26.4,false);goal(16.25,true);
  // Steel trusses, electronic scoreboard and cold arena floodlights.
  for(let z=-25;z<=16;z+=8){
   cube(W+10,.28,.27,M.metal,0,12.8,z);
   for(const x of [-15,0,15]){
    const flood=cube(2.8,.16,1.4,mat(0xe8f1f7),x,12.32,z);
    const l=new T.PointLight(0xe5f4ff,2.1,26);l.position.set(x,10.9,z);group.add(l);
   }
  }
  cube(10,3.1,3.8,jumbotron,0,12.0,-5);
  sign("ÉRIC   0 : 0   REVIEWER 2",0,12.6,-2.96,9.1,1.25,group,true);
  sign("PÉRIODE 3   •   LA THÈSE",0,11.25,-2.96,8.2,.72,group);
  sign("DÉFI HOCKEY · PASSE LES PORTES",0,6.6,backZ+.7,13.0,.90,group,true);
  // Opposing skaters under the floodlights.
  for(let i=0;i<8;i++){
   const x=(i%2?-9:9)+(i%3)*.6,z=-20+i*5.0;
   npc(x,z,i%3===0?0xdedfe7:0x2d5879,.75);
  }
  // Discrete cones and puck near the neutral zone.
  for(let i=0;i<7;i++){
   const x=i%2?-6:6,z=-18+i*4;
   shape(new T.ConeGeometry(.21,.52,12),orange,x,.34,z);
  }
  cyl(.23,.12,mat(0x161922,.24,.85),.9,.17,-3.2);
  hotspot("exit","Sortie de la patinoire",0,12.4,"exit");
  skate={balance:0,clock:0,falls:0,completed:false,started:false,lastReport:0,gateIndex:0,velocityX:0,velocityZ:0,
   gates:[[-5,2],[5,-4],[-5,-10],[5,-16],[0,-23],[-5,-11],[0,6]]};
  skate.gates.forEach(([gx,gz],i)=>{
   const g=new T.Group();g.position.set(gx,.13,gz);group.add(g);
   const checkpoint=shape(new T.TorusGeometry(1.14,.065,12,48),i===0?M.neon:M.green,0,0,0,g);
   checkpoint.rotation.x=-Math.PI/2;checkpoint.castShadow=false;
   const beacon=shape(new T.IcosahedronGeometry(.16),M.neon,0,1.28,0,g);beacon.castShadow=false;
   sign("PORTE "+(i+1),0,1.85,0,2.1,.36,g);
   g.visible=i===0;skate.gates[i].indicator=g;
  });
 }
 function visit(id,initial=false){
  const next=choose(id).id;
  room=next;busy=false;auto=null;modelX=0;modelZ=9;actors=[];targets=[];clickables=[];particles=[];chasers=[];collectibles=[];hitCooldown=0;activeTarget=null;
  if(group){scene.remove(group);group.traverse(o=>{if(o.isMesh&&o.geometry&&o!==player)o.geometry.dispose();});}
  group=new T.Group();scene.add(group);
  // Studio lighting colors adapt to each location.
  const groundLight=new T.HemisphereLight(0xe7f3ef,0x153b50,2.55);group.add(groundLight);
  const sun=new T.DirectionalLight(0xffdec0,2.65);sun.position.set(-11,15,14);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-32;sun.shadow.camera.right=32;sun.shadow.camera.top=30;sun.shadow.camera.bottom=-30;group.add(sun);
  ({university,classroom,laboratory,library,office,home,conference,field,auditorium,rink}[room]||university)();
  decoratePlay();
  // Keep Eric separate from rebuildable environment.
  eric.setPosition(0,0,9);eric.setEquipment(next==="rink"?"hockey":"casual");skate.lastReport=0;
  opts.onVisit?.(next,choose(next));
  if(!initial)opts.onNarrate?.("Nouveau lieu · "+choose(next).name);
 }
 function boot(){
  renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:"high-performance"});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.85));renderer.setSize(canvas.clientWidth||innerWidth,canvas.clientHeight||innerHeight,false);
  renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.72;renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
  scene=new T.Scene();camera=new T.PerspectiveCamera(62,1,.1,145);
  eric=createEricAvatar(T,{portraitUrl:"../assets/portrait.jpg",onReady:()=>opts.onAvatarReady?.()});
  player=eric.group;scene.add(player);
  visit("university",true);resize();requestAnimationFrame(tick);
  canvas.addEventListener("pointerdown",ev=>{
   if(opts.isPaused?.())return;
   const bounds=canvas.getBoundingClientRect(),v=new T.Vector2((ev.clientX-bounds.left)/bounds.width*2-1,-(ev.clientY-bounds.top)/bounds.height*2+1),ray=new T.Raycaster();ray.setFromCamera(v,camera);
   const hits=ray.intersectObjects(targets.map(t=>t.ring),true);
   if(!hits.length)return;
   let g=hits[0].object;
   while(g&&!targets.find(t=>t.ring===g))g=g.parent;
   const target=targets.find(t=>t.ring===g);if(target)auto={x:target.x,z:target.z};
  });
  canvas.addEventListener("webglcontextlost",ev=>{ev.preventDefault();opts.onNarrate?.("Le moteur graphique a été interrompu. Recharge la page pour réessayer.");});
 }
 function resize(){if(!renderer)return;const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=w<600?69:62;camera.updateProjectionMatrix();}
 function goToHotspot(){
  const available=targets.filter(t=>t.type==="activity"||t.type==="portal");
  const t=available.sort((a,b)=>Math.hypot(a.x-modelX,a.z-modelZ)-Math.hypot(b.x-modelX,b.z-modelZ))[0];
  if(t)auto={x:t.x,z:t.z};return Boolean(t);
 }
 function checkTarget(){
  if(opts.isPaused?.()||busy)return;
  const near=targets.filter(t=>Math.hypot(modelX-t.x,modelZ-t.z)<1.32).sort((a,b)=>Math.hypot(modelX-a.x,modelZ-a.z)-Math.hypot(modelX-b.x,modelZ-b.z))[0];
  if(near&&activeTarget!==near.id){activeTarget=near.id;auto=null;
   if(near.type==="portal"){visit(near.id);return;}
   if(near.type==="exit"){visit("university");return;}
   if(near.type==="activity"){
    busy=true;opts.onActivity?.(room,near.id,near.label);
    setTimeout(()=>{busy=false;},1050);
   }
  }
  if(!near)activeTarget=null;
 }
 function tick(ts){
  requestAnimationFrame(tick);if(!renderer)return;
  const dt=Math.min(.055,(ts-last||16)/1000);last=ts;clock+=dt;
  if(!opts.isPaused?.()){
   let dx=Number(controls.has("ArrowRight")||controls.has("KeyD"))-Number(controls.has("ArrowLeft")||controls.has("KeyA")||controls.has("KeyQ"));
   let dz=Number(controls.has("ArrowDown")||controls.has("KeyS"))-Number(controls.has("ArrowUp")||controls.has("KeyW")||controls.has("KeyZ"));
   if(auto&&!dx&&!dz){dx=auto.x-modelX;dz=auto.z-modelZ;if(Math.hypot(dx,dz)<.78){dx=dz=0;auto=null;}}
   else if(dx||dz)auto=null;
   const d=Math.hypot(dx,dz),run=controls.has("ShiftLeft")||controls.has("ShiftRight");
   let moveVX=0,moveVZ=0;
   if(room==="rink"){
    const accel=run?15:11,limit=run?11:8;
    if(d>.07){skate.velocityX+=dx/d*accel*dt;skate.velocityZ+=dz/d*accel*dt;}
    const drag=controls.has("Space")?.89:.991;
    const friction=Math.pow(drag,dt*60);
    skate.velocityX*=friction;skate.velocityZ*=friction;
    const speed=Math.hypot(skate.velocityX,skate.velocityZ);
    if(speed>limit){skate.velocityX*=limit/speed;skate.velocityZ*=limit/speed;}
    moveVX=skate.velocityX;moveVZ=skate.velocityZ;
    const nextX=Math.max(-12.8,Math.min(12.8,modelX+moveVX*dt));
    const nextZ=Math.max(-25,Math.min(13,modelZ+moveVZ*dt));
    if(nextX===-12.8||nextX===12.8){skate.velocityX*=-.32;skate.balance+=Math.sign(moveVX)*.09;}
    if(nextZ===-25||nextZ===13)skate.velocityZ*=-.22;
    modelX=nextX;modelZ=nextZ;
   }else if(d>.07){
    const speed=run?10:6.7;moveVX=dx/d*speed;moveVZ=dz/d*speed;
    modelX=Math.max(room==="university"?-27:-13,Math.min(room==="university"?27:13,modelX+moveVX*dt));
    modelZ=Math.max(-25,Math.min(13,modelZ+moveVZ*dt));
   }
   const walking=Math.hypot(moveVX,moveVZ)>.14;
   eric.setPosition(modelX,0,modelZ);
   eric.update(dt,ts,{x:moveVX,z:moveVZ},room);
   camera.position.lerp(new T.Vector3(modelX,room==="rink"?5.7:5.7,modelZ+10.5),Math.min(1,dt*3.7));
   camera.lookAt(modelX,1.5,modelZ-3.4);
   
   for(const npc of actors){
    npc.body.position.x=npc.x+Math.sin(clock*.72+npc.sway)*npc.move*.46;
    npc.body.position.z=npc.z+Math.cos(clock*.6+npc.sway)*npc.move*.30;
    npc.body.rotation.y=Math.sin(clock*.75+npc.sway)*.22;
    npc.nameTag.quaternion.copy(camera.quaternion);npc.nameTag.rotation.x=0;npc.nameTag.rotation.z=0;
    if(!npc.met&&Math.hypot(modelX-npc.body.position.x,modelZ-npc.body.position.z)<2.0){
      npc.met=true;opts.onNpc?.(npc.name,npc.line,room);
    }
   }
   for(const target of targets){
    target.gem.position.y=1.75+Math.sin(ts*.002+target.x)*.24;
    target.ring.rotation.y+=dt*.4;
   }
   checkTarget();
   hitCooldown=Math.max(0,hitCooldown-dt);
   for(const item of collectibles){
    if(item.taken)continue;
    item.group.rotation.y+=dt*.9;
    item.group.position.y=1.12+Math.sin(ts*.0025+item.x)*.2;
    item.t.quaternion.copy(camera.quaternion);item.t.rotation.x=0;item.t.rotation.z=0;
    if(Math.hypot(modelX-item.x,modelZ-item.z)<1.15){
      item.taken=true;item.group.visible=false;
      opts.onEvidence?.(item.id,item.label,room);
    }
   }
   for(const h of chasers){
    const distance=Math.hypot(modelX-h.x,modelZ-h.z);
    if(distance<14){
     const vx=(modelX-h.x)/(distance||1),vz=(modelZ-h.z)/(distance||1);
     h.x+=vx*h.speed*dt;h.z+=vz*h.speed*dt;
    }else{
     h.x=h.startX+Math.sin(clock*.7+h.phase)*1.3;
     h.z=h.startZ+Math.cos(clock*.6+h.phase)*.8;
    }
    h.group.position.set(h.x,Math.sin(clock*4+h.phase)*.18,h.z);
    h.group.rotation.y+=dt*1.9;
    if(distance<1.3&&hitCooldown<=0){
      hitCooldown=4.0;
      opts.onDamage?.(h===chasers[0]?"Reviewer 2":"Courriel urgent",room);
      // Push Éric away rather than imprisoning him in the collider.
      modelX=Math.max(-11,Math.min(11,modelX+(modelX-h.x)/(distance||1)*1.8));
      modelZ=Math.max(-25,Math.min(12,modelZ+(modelZ-h.z)/(distance||1)*1.8));
    }
   }
   if(room==="rink"){
    if(walking&&!skate.completed){skate.started=true;skate.clock+=dt;
     const gate=skate.gates[skate.gateIndex];
     if(gate&&Math.hypot(modelX-gate[0],modelZ-gate[1])<2){
       gate.indicator.visible=false;skate.gateIndex++;
       if(skate.gates[skate.gateIndex])skate.gates[skate.gateIndex].indicator.visible=true;
       opts.onNarrate?.("PORTE "+skate.gateIndex+"/"+skate.gates.length+" · Continue la trajectoire !");
     }
     skate.balance+=dx*dt*.38+Math.sin(clock*2.9)*dt*.18+Math.sin(clock*1.7+.7)*dt*.14;
     if(Math.abs(modelX)>7)skate.balance+=Math.sign(modelX)*dt*.25;
     for(let k=0;k<8;k++){const coneX=k%2?-5:5,coneZ=-18+k*3.2;
      if(Math.hypot(modelX-coneX,modelZ-coneZ)<.78){skate.balance+=Math.sign(modelX||1)*dt*.9;}}
     
     if(controls.has("Space"))skate.balance*=Math.max(0,1-2.8*dt);
     skate.balance*=Math.max(0,1-.13*dt);
     if(Math.abs(skate.balance)>1.0){
      skate.falls++;skate.balance=0;skate.clock=Math.max(0,skate.clock-6);
      opts.onNarrate?.("Chute sur la glace ! " +skate.falls+" · Reprends ton équilibre avec Espace.");
     }
     if(skate.gateIndex===skate.gates.length){skate.completed=true;opts.onSkate?.({falls:skate.falls,seconds:Math.round(skate.clock),gates:skate.gateIndex});}
    }
    opts.onBalance?.(skate.balance,skate.gateIndex/skate.gates.length,skate.falls,skate.gateIndex,skate.gates.length);
   }
  }
  if(ts-lastNavigation>115){
   lastNavigation=ts;
   const nextGate=room==="rink"?skate.gates?.[skate.gateIndex]:null;
   opts.onNavigation?.({
    room,x:modelX,z:modelZ,
    clues:collectibles.filter(v=>!v.taken).map(v=>({x:v.x,z:v.z,label:v.label})),
    objectives:targets.map(v=>({x:v.x,z:v.z,label:v.label,type:v.type})).concat(nextGate?[{x:nextGate[0],z:nextGate[1],label:"Prochaine porte",type:"gate"}]:[]),
    dangers:chasers.map(v=>({x:v.x,z:v.z})),
    people:actors.map(v=>({x:v.body.position.x,z:v.body.position.z,name:v.name}))
   });
  }
  renderer.render(scene,camera);
 }
 boot();
 return {visit,resize,goToHotspot,setPaused:()=>{},get room(){return room;},get skate(){return {...skate};},get targets(){return targets.map(t=>({id:t.id,label:t.label}));},get ready(){return true;}};
}
