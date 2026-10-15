"use strict";
// Déplacement guidé et borné. Seul un clic sur une porte ouvre une rubrique.
window.creerMarcheHall=({hall,scene,monde,stations,surSelection})=>{
 const avatar=hall.querySelector('[data-hall-personnage]'),touches=new Set(),calme=matchMedia('(prefers-reduced-motion:reduce)');
 let actif=false,selection=0,profondeur=0,geste=null,ignorer=0,frame=0,temps=0,decalage=0,rendu=0,dernierLateral=0;
 const borner=(v,a,b)=>Math.max(a,Math.min(b,v));
 const bloque=()=>document.body.classList.contains('salle-ouverte')||hall.classList.contains('en-marche');
 function dessiner(){
  if(!actif)return;
  const taille=Math.min(1,(scene.clientWidth-60)/690,(scene.clientHeight-80)/330);
  stations.forEach((s,i)=>{const d=i-selection+decalage;s.style.setProperty('--promenade-x',d*680+'px');s.style.setProperty('--promenade-z',(Math.abs(d)<.01?profondeur*90:-Math.abs(d)*100)+'px');s.style.setProperty('--promenade-angle',(-Math.max(-1,Math.min(1,d))*8)+'deg');s.style.setProperty('--promenade-echelle',taille);s.inert=Math.abs(d)>1.1;});
  monde.style.removeProperty('transform');if(avatar)avatar.classList.toggle('marche-recul',touches.has('arriere'));
 }
 function demander(){if(!rendu)rendu=requestAnimationFrame(()=>{rendu=0;dessiner();});}

 function arreter(){touches.clear();if(decalage){decalage=0;demander();}hall.classList.remove('en-deplacement','en-glissement');if(frame)cancelAnimationFrame(frame);frame=0;temps=0;}
 function choisir(i){selection=borner(i,0,stations.length-1);decalage=0;profondeur=0;surSelection(selection);dessiner();document.dispatchEvent(new Event('eb:hallposition'));}
 function pas(t){frame=0;if(!actif||bloque()){arreter();return;}const dt=temps?Math.min(.04,(t-temps)/1000):.02;temps=t;profondeur=borner(profondeur+(Number(touches.has('avant'))-Number(touches.has('arriere')))*dt*.8,0,1);hall.classList.toggle('en-deplacement',touches.size>0);dessiner();if(touches.size)frame=requestAnimationFrame(pas);}
 function avancer(sens){if(!actif||bloque())return;if(sens==='gauche'||sens==='droite'){choisir(selection+(sens==='droite'?1:-1));return;}touches.add(sens);if(!frame)frame=requestAnimationFrame(pas);}
 scene.tabIndex=0;scene.setAttribute('aria-describedby','hall-aide-deplacement');
 scene.addEventListener('pointerdown',e=>{if(!actif||bloque()||e.button!==0||e.target.closest('.hall-commandes,.hall-marche-commandes'))return;geste={id:e.pointerId,x:e.clientX,y:e.clientY,bouge:false,interactif:!!e.target.closest('button,a')};scene.focus({preventScroll:true});});
 scene.addEventListener('pointermove',e=>{
  if(!geste||e.pointerId!==geste.id||!actif||bloque())return;
  const dx=e.clientX-geste.x;
  if(Math.abs(dx)>8){geste.bouge=true;hall.classList.add('en-glissement');if(!scene.hasPointerCapture(e.pointerId))scene.setPointerCapture(e.pointerId);decalage=borner(dx/680,-1,1);if((selection===0&&decalage>0)||(selection===stations.length-1&&decalage<0))decalage*=.2;e.preventDefault();demander();}
 });
 scene.addEventListener('pointerup',e=>{if(!geste||e.pointerId!==geste.id)return;const g=geste;geste=null;hall.classList.remove('en-glissement');if(scene.hasPointerCapture(e.pointerId))scene.releasePointerCapture(e.pointerId);if(g.bouge){ignorer=performance.now()+120;const dx=e.clientX-g.x;choisir(selection+(Math.abs(dx)>45?(dx<0?1:-1):0));return;}const r=scene.getBoundingClientRect();if(!g.interactif&&e.clientY>r.top+r.height*.78){profondeur=borner(profondeur+.35,0,1);dessiner();}});
 scene.addEventListener('click',e=>{if(performance.now()<ignorer){e.preventDefault();e.stopImmediatePropagation();}},true);scene.addEventListener('pointercancel',()=>{geste=null;arreter();});
 const codes={ArrowLeft:'gauche',KeyA:'gauche',KeyQ:'gauche',ArrowRight:'droite',KeyD:'droite',ArrowUp:'avant',KeyW:'avant',KeyZ:'avant',ArrowDown:'arriere',KeyS:'arriere'};
 hall.addEventListener('keydown',e=>{if(!actif||bloque()||!codes[e.code]||e.target.closest('input,select,textarea,[contenteditable=true],[data-hall-choix]'))return;e.preventDefault();if(!['gauche','droite'].includes(codes[e.code])||!e.repeat||performance.now()-dernierLateral>200){dernierLateral=performance.now();avancer(codes[e.code]);}});
 addEventListener('keyup',e=>{if(codes[e.code]){touches.delete(codes[e.code]);if(!touches.size)arreter();document.dispatchEvent(new Event('eb:hallposition'));}});
 hall.querySelectorAll('[data-hall-marcher]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);avancer(b.dataset.hallMarcher);});['pointerup','pointercancel','lostpointercapture'].forEach(n=>b.addEventListener(n,arreter));b.addEventListener('click',e=>{if(e.detail===0){avancer(b.dataset.hallMarcher);setTimeout(arreter,200);}});});
 addEventListener('blur',arreter);document.addEventListener('visibilitychange',()=>{if(document.hidden)arreter();});
 return {activer(v){actif=v;hall.classList.toggle('en-promenade',v);scene.tabIndex=v?0:-1;if(v)dessiner();else arreter();},dessiner,choisir,arreter,placerDevant(i){selection=borner(i,0,stations.length-1);profondeur=0;dessiner();},recentrer(){profondeur=0;dessiner();},etat(){return {selection,profondeur};},retablir(v){arreter();selection=borner(Number(v?.selection)||0,0,stations.length-1);profondeur=borner(Number(v?.profondeur)||0,0,1);dessiner();},async approcher(i){arreter();selection=i;profondeur=0;dessiner();const porte=stations[i].querySelector('.porte');if(calme.matches)return()=>{};const r=scene.getBoundingClientRect(),p=porte.getBoundingClientRect();monde.style.transformOrigin=(p.left+p.width/2-r.left)+'px '+(p.top+p.height/2-r.top)+'px';hall.classList.add('en-marche');const animation=monde.animate([{transform:'scale(1)'},{transform:'scale(2.6)'}],{duration:420,easing:'cubic-bezier(.25,.65,.2,1)',fill:'forwards'});setTimeout(()=>porte.classList.add('ouverte'),160);await animation.finished.catch(()=>{});return()=>{animation.cancel();monde.style.removeProperty('transform-origin');hall.classList.remove('en-marche');dessiner();};}};
};
