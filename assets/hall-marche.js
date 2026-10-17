"use strict";
// Panorama borné : regarder et faire glisser ne déclenchent jamais une entrée.
window.creerMarcheHall=({hall,scene,monde,stations,surSelection})=>{
 const calme=matchMedia('(prefers-reduced-motion:reduce)');
 const ecart=14;
 let pas=470,largeur=446;
 const borner=(v,a,b)=>Math.max(a,Math.min(b,v));
 let actif=false,selection=0,position=0,cible=0,maximum=0,largeurVue=0,hauteurVue=0;
 let murG=0,murD=0,margeG=ecart,margeD=ecart;
 let image=0,temps=0,vitesseBord=0,geste=null,ignorer=0,restauration=null,manuel=false;
 const touches=new Set();
 const bloque=()=>document.body.classList.contains('salle-ouverte')||hall.classList.contains('en-marche');
 function dimensions(){
  const w=scene.clientWidth,h=scene.clientHeight;
  if(!w)return;
  if(w!==largeurVue||h!==hauteurVue){
   largeurVue=w;hauteurVue=h;
   // La baie occupe toute la largeur de l'image (2000 px de large).
   const px=Math.max(w/1850,h/575),ix=(w-2000*px)/2;
   const style=getComputedStyle(hall),porte=(526-(parseFloat(style.getPropertyValue('--hall-porte-haut'))||202))*px*(parseFloat(style.getPropertyValue('--hall-porte-ratio'))||.454);
   const espace=parseFloat(style.getPropertyValue('--hall-ecart'))||30;
   largeur=Math.round(porte+espace+Math.min(320,Math.max(280,w*.24)));pas=largeur+espace;
   hall.style.setProperty('--hall-station-l',largeur+'px');
   murG=Math.max(0,ix);murD=Math.min(w,ix+2000*px);
   margeG=murG+ecart;margeD=w-murD+ecart;
   maximum=Math.max(0,margeG+pas*(stations.length-1)+largeur+margeD-w);
   if(restauration!==null){position=cible=maximum*restauration;restauration=null;}
   position=borner(position,0,maximum);cible=borner(cible,0,maximum);
  }
 }
 function dessiner(){
  if(!actif)return;dimensions();
  stations.forEach((s,i)=>{
   const x=margeG+i*pas-position,d=(x+largeur/2-largeurVue/2)/largeurVue;
   // Faible perspective frontale : aucune rotation ne permet de passer derrière un mur.
   s.style.setProperty('--panorama-x',x.toFixed(2)+'px');
   s.style.setProperty('--panorama-angle',borner(-d*5,-7,7).toFixed(2)+'deg');
   s.style.setProperty('--panorama-z',(-Math.min(45,Math.abs(d)*24)).toFixed(2)+'px');
   s.inert=x+largeur<murG||x>murD;
  });
  scene.style.setProperty('--hall-lumiere',(50-(maximum?position/maximum-.5:0)*5).toFixed(2)+'%');
  scene.style.setProperty('--hall-defile',(maximum?position/maximum:.5).toFixed(4));
  scene.ebDefile=position;
 }
 function selectionManuelle(){
  if(!manuel)return;
  const i=borner(Math.round((position+(murG+murD)/2-margeG-largeur/2)/pas),0,stations.length-1);
  if(i!==selection){selection=i;surSelection(i);}
  manuel=false;document.dispatchEvent(new Event('eb:hallposition'));
 }
 function animer(t){
  image=0;if(!actif||bloque()){arreter();return;}
  const dt=temps?Math.min(.04,(t-temps)/1000):1/60;temps=t;dimensions();
  const vitesse=vitesseBord+(Number(touches.has('ArrowRight'))-Number(touches.has('ArrowLeft')))*410;
  if(vitesse){cible=borner(cible+vitesse*dt,0,maximum);manuel=true;}
  const ecart=cible-position;
  position=calme.matches||geste?.bouge?cible:position+ecart*(1-Math.exp(-13*dt));
  if(Math.abs(cible-position)<.12)position=cible;
  dessiner();
  if(position!==cible||(vitesse&&((vitesse>0&&cible<maximum)||(vitesse<0&&cible>0))))demander();
  else{temps=0;selectionManuelle();}
 }
 function demander(){if(actif&&!image&&!bloque())image=requestAnimationFrame(animer);}
 function arreter(){
  touches.clear();vitesseBord=0;geste=null;
  if(image)cancelAnimationFrame(image);image=0;temps=0;cible=position;
  scene.classList.remove('en-glissement');selectionManuelle();
 }
 function choisir(i){
  selection=borner(i,0,stations.length-1);manuel=false;vitesseBord=0;
  dimensions();cible=borner(margeG+selection*pas+largeur/2-(murG+murD)/2,0,maximum);
  surSelection(selection);if(calme.matches)position=cible;demander();
 }
 scene.setAttribute('aria-describedby','hall-aide-deplacement');
 scene.addEventListener('pointerdown',e=>{
  if(!actif||bloque()||e.button!==0||e.target.closest('.hall-commandes'))return;
  vitesseBord=0;cible=position;
  geste={id:e.pointerId,x:e.clientX,depart:position,dernierX:e.clientX,dernierT:performance.now(),vitesse:0,bouge:false};
  if(!e.target.closest('button,a'))scene.focus({preventScroll:true});
 });
 scene.addEventListener('pointermove',e=>{
  if(!actif||bloque())return;
  if(geste&&e.pointerId===geste.id){
   const dx=e.clientX-geste.x;
   if(Math.abs(dx)>6||geste.bouge){
    const t=performance.now(),dt=Math.max(10,t-geste.dernierT);
    geste.vitesse=borner((geste.dernierX-e.clientX)/dt*1000,-900,900);
    geste.dernierX=e.clientX;geste.dernierT=t;geste.bouge=true;
    scene.classList.add('en-glissement');
    if(!scene.hasPointerCapture(e.pointerId))scene.setPointerCapture(e.pointerId);
    cible=borner(geste.depart-dx,0,maximum);manuel=true;e.preventDefault();demander();
   }
   return;
  }
  // La souris fait défiler le mur dès le quart extérieur ; sur un panneau, seulement tout au bord.
  if(e.pointerType!=='mouse'||calme.matches){vitesseBord=0;return;}
  const r=scene.getBoundingClientRect(),x=((e.clientX-r.left)/r.width-.5)*2;
  const seuil=e.target.closest('button,a,.panneau-hall')?.8:.5;
  vitesseBord=Math.abs(x)>seuil?Math.sign(x)*Math.pow((Math.abs(x)-seuil)/(1-seuil),1.5)*640:0;
  demander();
 });
 function finir(e){
  if(!geste||e.pointerId!==geste.id)return;
  const g=geste;geste=null;vitesseBord=0;scene.classList.remove('en-glissement');
  if(scene.hasPointerCapture(e.pointerId))scene.releasePointerCapture(e.pointerId);
  if(g.bouge){
   ignorer=performance.now()+180;
   if(!calme.matches&&performance.now()-g.dernierT<100)cible=borner(cible+g.vitesse*.12,0,maximum);
   demander();
  }
 }
 scene.addEventListener('pointerup',finir);
 scene.addEventListener('pointercancel',()=>{arreter();});
 scene.addEventListener('lostpointercapture',e=>{if(geste&&e.pointerId===geste.id)finir(e);});
 scene.addEventListener('pointerleave',()=>{vitesseBord=0;if(!geste)demander();});
 scene.addEventListener('click',e=>{if(performance.now()<ignorer){e.preventDefault();e.stopImmediatePropagation();}},true);
 scene.addEventListener('wheel',e=>{
  if(!actif||e.ctrlKey||(!e.shiftKey&&Math.abs(e.deltaX)<=Math.abs(e.deltaY)))return;
  // Retenir aussi le geste aux deux extrémités, pour éviter le retour du navigateur.
  e.preventDefault();vitesseBord=0;
  if(bloque())return;
  const delta=e.shiftKey&&Math.abs(e.deltaY)>Math.abs(e.deltaX)?e.deltaY:e.deltaX;
  const dx=delta*(e.deltaMode===1?18:e.deltaMode===2?largeurVue:1);
  const suivant=borner(cible+dx,0,maximum);
  if(suivant!==cible){cible=suivant;manuel=true;demander();}
 },{passive:false});
 scene.addEventListener('keydown',e=>{
  if(!actif||bloque()||e.target!==scene)return;
  if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();touches.add(e.key);demander();}
  if(['Home','End'].includes(e.key)){e.preventDefault();vitesseBord=0;cible=e.key==='Home'?0:maximum;manuel=true;demander();}
 });
 addEventListener('keyup',e=>{touches.delete(e.key);});
 stations.forEach((s,i)=>s.addEventListener('focusin',e=>{
  if(!actif||bloque()||!e.target.matches(':focus-visible'))return;
  const x=margeG+i*pas-position;if(x<murG||x+largeur>murD)choisir(i);
 }));
 addEventListener('blur',arreter);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)arreter();});
 return {
  activer(v){if(actif===v){if(v)dessiner();return;}actif=v;scene.tabIndex=v?0:-1;if(v){largeurVue=0;dessiner();}else{arreter();stations.forEach(s=>s.inert=false);}},
  dessiner,choisir,arreter,
  recentrer(){arreter();selection=0;cible=0;surSelection(0);demander();},
  etat(){return {selection,panorama:maximum?position/maximum:0};},
  retablir(v){
   arreter();selection=borner(Number(v?.selection)||0,0,stations.length-1);
   restauration=Number.isFinite(v?.panorama)?borner(v.panorama,0,1):0;
   largeurVue=0;dessiner();
  },
  async approcher(i){
   arreter();selection=i;surSelection(i);
   if(calme.matches||!monde.animate)return()=>{};
   const porte=stations[i].querySelector('.porte'),r=scene.getBoundingClientRect(),p=porte.getBoundingClientRect();
   const x=p.left+p.width/2-r.left,y=p.top+p.height/2-r.top;
   monde.style.transformOrigin=x+'px '+y+'px';hall.classList.add('en-marche');
   const animation=monde.animate([
    {transform:'translate(0,0) scale(1)'},
    {transform:'translate('+(r.width/2-x)+'px,'+(r.height/2-y)+'px) scale(2.8)'}
   ],{duration:480,easing:'cubic-bezier(.3,.65,.2,1)',fill:'forwards'});
   const ouverture=setTimeout(()=>porte.classList.add('ouverte'),170);
   await animation.finished.catch(()=>{});
   return()=>{clearTimeout(ouverture);animation.cancel();monde.style.removeProperty('transform-origin');hall.classList.remove('en-marche');dessiner();};
  }
 };
};
