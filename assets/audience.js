"use strict";
(() => {
  const configuration=document.currentScript;
  const endpoint=configuration?.dataset.audienceEndpoint;
  const domaines=(configuration?.dataset.audienceDomaines || '').split(' ');
  if(!endpoint || !domaines.includes(location.hostname) || navigator.webdriver)return;
  const cle='eb-audience-refusee';
  const racine=document.documentElement;
  let refuse=false, charge=false, chargement=false, minuterie=0, dernierChemin='';
  try {refuse=localStorage.getItem(cle)==='1';}catch{}
  const navigateurRefuse=()=>navigator.globalPrivacyControl===true || navigator.doNotTrack==='1' || window.doNotTrack==='1';
  const bloque=()=>refuse || navigateurRefuse();
  const actualiser=()=>{
    document.querySelectorAll('[data-audience-refuser]').forEach(b=>{
      b.setAttribute('aria-pressed',String(bloque()));
      b.disabled=navigateurRefuse();
    });
    document.querySelectorAll('[data-audience-etat]').forEach(p=>{
      p.textContent=navigateurRefuse()?p.dataset.navigateur:refuse?p.dataset.refusee:p.dataset.autorisee;
    });
  };
  const provenance=()=>{
    try{return document.referrer?new URL(document.referrer).origin:'';}catch{return '';}
  };
  const route=()=>{
    const salle=/^[a-z-]{1,40}$/.test(racine.dataset.audienceSalle || '')?racine.dataset.audienceSalle:'';
    const rubrique=/^[a-z0-9-]{1,70}$/.test(racine.dataset.audienceRubrique || '')?racine.dataset.audienceRubrique:'';
    return location.pathname+(salle?'#'+salle+(rubrique?'/'+rubrique:''):'');
  };
  const compterPage=()=>{
    clearTimeout(minuterie);
    if(bloque() || !charge || document.visibilityState==='prerender')return;
    const path=route();
    if(path===dernierChemin)return;
    const api=window.goatcounter;
    if(!api?.count || api.filter?.())return;
    dernierChemin=path;
    const nom=document.querySelector('#salle-titre')?.textContent;
    api.count({path,title:racine.dataset.audienceSalle && nom?nom:document.title,referrer:provenance()});
  };
  const programmer=()=>{
    clearTimeout(minuterie);
    if(!bloque())minuterie=setTimeout(compterPage,160);
  };
  const installer=()=>{
    if(bloque() || charge || chargement)return;
    chargement=true;
    const script=document.createElement('script');
    script.src='https://gc.zgo.at/count.js';
    script.async=true;
    script.referrerPolicy='strict-origin';
    script.dataset.goatcounter=endpoint;
    script.dataset.goatcounterSettings=JSON.stringify({no_onload:true,no_events:true});
    script.onload=()=>{charge=true;chargement=false;programmer();};
    script.onerror=()=>{chargement=false;};
    document.head.append(script);
  };
  document.addEventListener('eb:page',programmer);
  addEventListener('hashchange',programmer);
  document.addEventListener('click',ev=>{
    const choix=ev.target.closest('[data-audience-refuser]');
    if(choix){
      refuse=!refuse;
      try{localStorage.setItem(cle,refuse?'1':'0');}catch{}
      clearTimeout(minuterie);actualiser();
      if(!bloque()){installer();programmer();}
      return;
    }
    if(!ev.isTrusted || bloque() || !charge)return;
    const lien=ev.target.closest('a[href]');
    if(!lien)return;
    const href=lien.getAttribute('href');
    const action=href.includes('cv-academique.pdf')?'cv-academique':href.includes('cv-professionnel.pdf')?'cv-professionnel':href.startsWith('mailto:')?'contact-courriel':href.startsWith('tel:')?'contact-telephone':href.includes('bookings.cloud.microsoft')?'rendez-vous':null;
    if(!action || window.goatcounter?.filter?.())return;
    window.goatcounter?.count?.({path:'action:'+racine.lang+':'+action,title:action,event:true,referrer:''});
  });
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)programmer();});
  actualiser();installer();
})();
