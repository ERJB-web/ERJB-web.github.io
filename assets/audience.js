"use strict";
(() => {
  const configuration=document.currentScript;
  const websiteId=configuration?.dataset.audienceWebsiteId;
  const domaines=(configuration?.dataset.audienceDomaines || '').split(' ');
  if(!websiteId || !domaines.includes(location.hostname) || navigator.webdriver)return;
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
    const api=window.umami;
    if(!api?.track)return;
    dernierChemin=path;
    const nom=document.querySelector('#salle-titre')?.textContent;
    api.track({website:websiteId,hostname:location.hostname,language:racine.lang,url:path,title:racine.dataset.audienceSalle && nom?nom:document.title,referrer:provenance()});
  };
  const programmer=()=>{
    clearTimeout(minuterie);
    if(!bloque())minuterie=setTimeout(compterPage,160);
  };
  const installer=()=>{
    if(bloque() || charge || chargement)return;
    chargement=true;
    const script=document.createElement('script');
    script.src='https://cloud.umami.is/script.js';
    script.async=true;
    script.referrerPolicy='strict-origin';
    script.dataset.websiteId=websiteId;
    script.dataset.autoPageview='false';
    script.dataset.performance='false';
    script.dataset.excludeSearch='true';
    script.dataset.doNotTrack='true';
    script.dataset.domains=domaines.join(',');
    script.dataset.beforeSend='ebFiltrerAudience';
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
    if(!action)return;
    window.umami?.track?.({website:websiteId,hostname:location.hostname,language:racine.lang,url:route(),title:document.title,name:'action:'+racine.lang+':'+action,referrer:''});
  });
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)programmer();});
  window.ebFiltrerAudience=(type,payload)=>bloque()?false:payload;
  actualiser();installer();
})();


/* Estimations agrégées quotidiennes ; aucune valeur fictive en cas d’échec. */
;(() => {
 const cadre=document.querySelector('.audience-compteur');
 if(!cadre)return;
 const champs=Object.fromEntries([...cadre.querySelectorAll('[data-audience-total]')].map(e=>[e.dataset.audienceTotal,e]));
 const lire=k=>{try{return localStorage.getItem(k);}catch{return null;}};
 const stocker=(k,v)=>{try{localStorage.setItem(k,v);}catch{}};
 const bloque=()=>location.hostname!=='erjb-web.github.io'||navigator.webdriver||navigator.globalPrivacyControl===true||navigator.doNotTrack==='1'||window.doNotTrack==='1'||lire('eb-audience-refusee')==='1';
 const jour=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()).replaceAll('-','');
 const fmt=new Intl.NumberFormat('fr-CA');
 const afficher=(champ,n)=>{champs[champ].textContent=Number.isSafeInteger(n)&&n>0?fmt.format(n):'—';};
 async function valeur(action,cle){
  const r=await fetch('https://countapi.mileshilliard.com/api/v1/'+action+'/'+cle,{mode:'cors',credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(10000)});
  if(!r.ok)throw Error('Compteur indisponible');
  const n=Number((await r.json()).value);if(!Number.isSafeInteger(n)||n<1)throw Error('Valeur indisponible');return n;
 }
 async function empreinte(s){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].slice(0,12).map(n=>n.toString(16).padStart(2,'0')).join('');}
 async function lieu(type,code,date){
  const total='erjbweb-geo-v2-'+type+'-day-'+date;
  const hash=await empreinte(code.normalize('NFKC').toLocaleLowerCase().trim());
  const marque='eb-audience-lieu-'+date+'-'+type+'-'+hash;
  if(lire(marque)!=='1'){
   const n=await valeur('hit','erjbweb-lieu-v2-'+date+'-'+type+'-'+hash);
   if(bloque())return;
   const compte=n===1?await valeur('hit',total):await valeur('get',total);
   stocker(marque,'1');return compte;
  }
  return valeur('get',total);
 }
 let busy=false,last=0,dernierJour='';
 async function actualiser(){
  if(bloque()){Object.keys(champs).forEach(k=>afficher(k,null));return;}
  if(busy||document.hidden||Date.now()-last<120000)return;
  busy=true;const date=jour();
  if(date!==dernierJour){dernierJour=date;Object.keys(champs).forEach(k=>afficher(k,null));}
  const maj=(k,n)=>{if(!bloque()&&jour()===date)afficher(k,n);};
  try{
   const connu=lire('eb-visiteur-public-'+date)==='1'||Number(lire('eb-visiteur-rang-'+date))>0;
   const n=await valeur(connu?'get':'hit','erjbweb-unique-browser-day-'+date);
   if(bloque())throw Error('Mesure refusée');
   stocker('eb-visiteur-public-'+date,'1');maj('visiteurs',n);
  }catch{maj('visiteurs',null);}
  try{
   if(bloque())return;
   const r=await fetch('https://ipwho.is/?fields=success,city,country_code,region_code',{mode:'cors',credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(10000)});
   if(!r.ok)throw Error('Localisation indisponible');
   const geo=await r.json();if(!geo.success||bloque())return;
   const pays=typeof geo.country_code==='string'&&/^[A-Z]{2}$/.test(geo.country_code)?geo.country_code:null;
   const ville=typeof geo.city==='string'&&geo.city.length<100?geo.city.trim():'';
   await Promise.allSettled([
    pays?lieu('pays',pays,date).then(n=>maj('pays',n)):Promise.resolve(),
    pays&&ville?lieu('villes',[pays,geo.region_code||'',ville].join('|'),date).then(n=>maj('villes',n)):Promise.resolve()
   ]);
  }catch{}
  finally{busy=false;last=Date.now();}
 }
 actualiser();
 setInterval(actualiser,120000);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)actualiser();});
 document.addEventListener('click',e=>{if(e.target.closest('[data-audience-refuser]'))queueMicrotask(()=>{last=0;actualiser();});});
})();
