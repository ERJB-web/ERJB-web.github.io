"use strict";
// Déplacements limités au hall : aucune collision ou arrivée n'ouvre une rubrique.
window.creerMarcheHall = ({hall,scene,monde,stations,surSelection}) => {
  const avatar=hall.querySelector('[data-hall-personnage]');
  const cible=hall.querySelector('[data-hall-cible]');
  const bornes={x:[120,1460],z:[-390,550]};
  const p={x:790,z:360,yaw:0};
  const touches=new Set();
  const calme=matchMedia('(prefers-reduced-motion:reduce)');
  let actif=false,destination=null,image=0,dernierTemps=0,glissement=null,annulerClic=0,selection=0;
  const limiter=(v,[min,max])=>Math.max(min,Math.min(max,v));
  const angle=c=>{while(c>180)c-=360;while(c<-180)c+=360;return c;};
  const station=(i)=>{
    const s=stations[i],a=parseFloat(getComputedStyle(s).getPropertyValue('--station-angle'))||0;
    const r=a*Math.PI/180;
    return {x:limiter(parseFloat(s.style.getPropertyValue('--station-x'))+Math.cos(r)*122+Math.sin(r)*265,bornes.x),z:limiter(parseFloat(s.style.getPropertyValue('--station-z'))-Math.sin(r)*122+Math.cos(r)*265,bornes.z),yaw:-a};
  };
  const occupe=()=>document.body.classList.contains('salle-ouverte') || hall.classList.contains('en-marche');
  const programmer=()=>{if(!image && actif)image=requestAnimationFrame(dessiner);};
  const arreter=()=>{touches.clear();destination=null;glissement=null;hall.classList.remove('en-glissement','en-deplacement');if(cible)cible.hidden=true;};
  const viser=(x,z,yaw)=>{
    destination={x:limiter(x,bornes.x),z:limiter(z,bornes.z),yaw};
    touches.clear();
    if(calme.matches){p.x=destination.x;p.z=destination.z;if(Number.isFinite(yaw))p.yaw=yaw;destination=null;if(cible)cible.hidden=true;programmer();return;}
    if(cible){cible.hidden=false;cible.style.left=destination.x+'px';cible.style.transform='translate(-50%,-50%) translateZ('+destination.z+'px) rotateX(90deg)';}
    programmer();
  };
  const camera=()=>{
    const a=p.yaw*Math.PI/180,rx=-10*Math.PI/180,distance=1200;
    const cx=p.x-Math.sin(a)*distance,cz=p.z+Math.cos(a)*distance;
    const dx=790-cx,dy=75,dz=-cz;
    const x=dx*Math.cos(a)+dz*Math.sin(a),z=-dx*Math.sin(a)+dz*Math.cos(a);
    const y=dy*Math.cos(rx)-z*Math.sin(rx),profondeur=1600+dy*Math.sin(rx)+z*Math.cos(rx);
    return 'translate(-50%,-50%) translate3d('+x.toFixed(2)+'px,'+y.toFixed(2)+'px,'+profondeur.toFixed(2)+'px) rotateX(-10deg) rotateY('+p.yaw.toFixed(2)+'deg)';
  };
  const presse=(...codes)=>codes.some(c=>touches.has(c));
  function dessiner(temps=performance.now()) {
    image=0;
    if(!actif || occupe()){dernierTemps=temps;return;}
    const dt=dernierTemps?Math.min(.035,(temps-dernierTemps)/1000):.016;
    dernierTemps=temps;
    const avant=Number(presse('ArrowUp','KeyW','KeyZ','avant'))-Number(presse('ArrowDown','KeyS','arriere'));
    const droite=Number(presse('ArrowRight','KeyD','droite'))-Number(presse('ArrowLeft','KeyA','KeyQ','gauche'));
    const a=p.yaw*Math.PI/180;
    let dx=0,dz=0,bouge=false,termine=false;
    if(avant || droite){
      destination=null;
      const norme=Math.hypot(avant,droite);
      dx=(droite*Math.cos(a)+avant*Math.sin(a))/norme;
      dz=(droite*Math.sin(a)-avant*Math.cos(a))/norme;
      bouge=true;
    }else if(destination){
      const distance=Math.hypot(destination.x-p.x,destination.z-p.z);
      if(distance>5){
        const pas=Math.min(440*dt,distance);
        dx=(destination.x-p.x)/distance;dz=(destination.z-p.z)/distance;
        p.x+=dx*pas;p.z+=dz*pas;bouge=true;
      }else if(Number.isFinite(destination.yaw) && Math.abs(angle(destination.yaw-p.yaw))>.6){
        p.yaw+=angle(destination.yaw-p.yaw)*Math.min(1,dt*6);
        bouge=true;
      }else{destination=null;termine=true;if(cible)cible.hidden=true;document.dispatchEvent(new Event('eb:hallposition'));}
    }
    if(avant || droite){p.x=limiter(p.x+dx*440*dt,bornes.x);p.z=limiter(p.z+dz*440*dt,bornes.z);}
    hall.classList.toggle('en-deplacement',bouge);
    if(avatar){
      avatar.style.left=p.x.toFixed(2)+'px';
      avatar.style.transform='translateX(-50%) translateZ('+p.z.toFixed(2)+'px) rotateY('+(-p.yaw).toFixed(2)+'deg)';
      avatar.classList.toggle('marche-recul',dx*Math.sin(a)-dz*Math.cos(a)<-.15);
      avatar.classList.toggle('vers-gauche',dx*Math.cos(a)+dz*Math.sin(a)<-.15);
    }
    monde.style.transform=camera();
    if(!destination && (bouge || termine)){
      let index=selection,distance=Infinity;
      stations.forEach((s,i)=>{const t=station(i),d=Math.hypot(t.x-p.x,t.z-p.z);if(d<distance){index=i;distance=d;}});
      if(index!==selection){selection=index;surSelection(index);}
    }
    if(bouge || touches.size || destination)programmer();
  }
  const pointSol=(clientX,clientY)=>{
    const r=scene.getBoundingClientRect();
    if(clientY-r.top<r.height*.45)return null;
    const x=(clientX-r.left-r.width*.5)/1600,y=(clientY-r.top-r.height*.52)/1600;
    const a=p.yaw*Math.PI/180,rx=-10*Math.PI/180;
    const vy=y*Math.cos(rx)-Math.sin(rx),vz=-y*Math.sin(rx)-Math.cos(rx);
    if(vy<=.02)return null;
    const vx=x*Math.cos(a)-vz*Math.sin(a),wz=x*Math.sin(a)+vz*Math.cos(a),t=400/vy;
    return {x:p.x-Math.sin(a)*1200+vx*t,z:p.z+Math.cos(a)*1200+wz*t};
  };
  scene.tabIndex=0;
  scene.setAttribute('aria-describedby','hall-aide-deplacement');
  scene.addEventListener('pointerdown',ev=>{
    if(!actif || occupe() || ev.button!==0 || ev.pointerType==='touch' || ev.target.closest('[data-hall-commandes],.hall-marche-commandes'))return;
    glissement={id:ev.pointerId,x:ev.clientX,y:ev.clientY,dernierX:ev.clientX,bouge:false,interactif:!!ev.target.closest('button,a,input,select')};
  });
  scene.addEventListener('pointermove',ev=>{
    if(!actif || !glissement || ev.pointerId!==glissement.id || occupe())return;
    if(Math.hypot(ev.clientX-glissement.x,ev.clientY-glissement.y)>8)glissement.bouge=true;
    if(glissement.bouge){
      destination=null;
      p.yaw=angle(p.yaw+(ev.clientX-glissement.dernierX)*.22);
      if(!scene.hasPointerCapture(ev.pointerId))scene.setPointerCapture(ev.pointerId);
      hall.classList.add('en-glissement');
      ev.preventDefault();programmer();
    }
    glissement.dernierX=ev.clientX;
  });
  scene.addEventListener('pointerup',ev=>{
    if(!glissement || ev.pointerId!==glissement.id)return;
    const geste=glissement;glissement=null;
    hall.classList.remove('en-glissement');
    if(scene.hasPointerCapture(ev.pointerId))scene.releasePointerCapture(ev.pointerId);
    if(geste.bouge){annulerClic=performance.now()+300;document.dispatchEvent(new Event('eb:hallposition'));return;}
    if(!geste.interactif && actif && !occupe()){
      const sol=pointSol(ev.clientX,ev.clientY);
      if(sol){scene.focus({preventScroll:true});viser(sol.x,sol.z);}
    }
  });
  scene.addEventListener('click',ev=>{if(performance.now()<annulerClic){ev.preventDefault();ev.stopImmediatePropagation();}},true);
  scene.addEventListener('pointercancel',()=>{glissement=null;hall.classList.remove('en-glissement');});
  const codes=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD','KeyZ','KeyQ'];
  hall.addEventListener('keydown',ev=>{
    if(!actif || occupe() || !codes.includes(ev.code) || ev.target.closest('input,select,textarea,[contenteditable=true],[data-hall-choix]'))return;
    ev.preventDefault();touches.add(ev.code);destination=null;programmer();
  });
  addEventListener('keyup',ev=>{if(touches.delete(ev.code)){programmer();document.dispatchEvent(new Event('eb:hallposition'));}});
  hall.querySelectorAll('[data-hall-marcher]').forEach(b=>{
    const sens=b.dataset.hallMarcher;
    b.addEventListener('pointerdown',ev=>{if(!actif || occupe())return;ev.preventDefault();b.setPointerCapture(ev.pointerId);touches.add(sens);destination=null;programmer();});
    const finir=()=>{touches.delete(sens);programmer();document.dispatchEvent(new Event('eb:hallposition'));};
    ['pointerup','pointercancel','lostpointercapture'].forEach(n=>b.addEventListener(n,finir));
    b.addEventListener('click',ev=>{
      if(ev.detail!==0 || !actif || occupe())return;
      const a=p.yaw*Math.PI/180,av=sens==='avant'?1:sens==='arriere'?-1:0,dr=sens==='droite'?1:sens==='gauche'?-1:0;
      viser(p.x+(dr*Math.cos(a)+av*Math.sin(a))*170,p.z+(dr*Math.sin(a)-av*Math.cos(a))*170);
    });
  });
  addEventListener('blur',arreter);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)arreter();});
  return {
    activer(v){actif=v;scene.tabIndex=v?0:-1;hall.classList.toggle('en-promenade',v);if(!v){arreter();if(image)cancelAnimationFrame(image);image=0;}else programmer();},
    dessiner(){programmer();},
    choisir(i){if(!actif)return;selection=i;const t=station(i);viser(t.x,t.z,t.yaw);},
    arreter,
    placerDevant(i){const t=station(i);arreter();Object.assign(p,t);selection=i;programmer();},
    recentrer(){arreter();Object.assign(p,{x:790,z:360,yaw:0});programmer();},
    etat(){return {x:p.x,z:p.z,yaw:p.yaw,selection};},
    retablir(etat){arreter();if(Number.isInteger(etat?.selection))selection=Math.max(0,Math.min(stations.length-1,etat.selection));if(Number.isFinite(etat?.x))p.x=limiter(etat.x,bornes.x);if(Number.isFinite(etat?.z))p.z=limiter(etat.z,bornes.z);if(Number.isFinite(etat?.yaw))p.yaw=angle(etat.yaw);programmer();}
  };
};
