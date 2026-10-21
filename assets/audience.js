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


/*
 * Rang de visite quotidien estimé, distinct des statistiques Umami.
 * La localisation est approximative, obtenue par l'IP, jamais par GPS.
 */
;(() => {
  const pied=document.querySelector('footer.pied');
  if(!pied||location.hostname!=='erjb-web.github.io')return;
  const lang=(document.documentElement.lang||'fr').split('-')[0];
  const langues={
    fr:['Vous êtes le','visiteur aujourd’hui','Votre visite compte aujourd’hui','Vous faites partie des','visiteurs aujourd’hui','Depuis','Compteur désactivé'],
    en:['You are visitor','today','Your visit counts today','You are among today’s','visitors','From','Counter disabled'],
    es:['Eres el visitante n.º','de hoy','Tu visita cuenta hoy','Estás entre los','visitantes de hoy','Desde','Contador desactivado'],
    zh:['您是今日第','位访客','感谢您今天的访问','您是今天的','位访客之一','大致位置','统计已关闭'],
    ar:['أنت الزائر رقم','اليوم','زيارتك مهمة اليوم','أنت من بين','زوار اليوم','من','العداد معطل'],
    ru:['Сегодня вы посетитель №','','Ваш визит сегодня важен','Вы среди','посетителей сегодня','Из','Счётчик отключён']
  };
  const t=langues[lang]||langues.en;
  const style=document.createElement('style');
  style.textContent='footer.pied .compteur-jour{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:5px 9px;width:max-content;max-width:calc(100% - 20px);margin:12px auto 1px;padding:9px 16px;border:1px solid rgba(95,145,150,.25);border-radius:999px;background:linear-gradient(110deg,rgba(255,255,255,.94),rgba(224,242,240,.60));box-shadow:0 2px 14px rgba(20,64,77,.04);color:#476370;font:400 12px/1.4 Inter,system-ui,sans-serif;text-align:center}footer.pied .compteur-jour::before{content:"";width:7px;height:7px;flex:none;border-radius:50%;background:#52a99a;box-shadow:0 0 0 3px rgba(82,169,154,.12)}footer.pied .compteur-jour-valeur{font-weight:680;font-size:17px;line-height:1;color:#164e66;font-variant-numeric:tabular-nums;letter-spacing:-.035em}footer.pied .compteur-jour-valeur sup{font-size:9px;letter-spacing:0;vertical-align:super}footer.pied .compteur-jour-lieu{display:inline-flex;align-items:center;gap:5px;border-inline-start:1px solid rgba(77,123,137,.22);padding-inline-start:10px;font-size:11px;color:#597883}footer.pied .compteur-jour-lieu::before{content:"⌖";font-size:14px;color:#388d83}@media(max-width:560px){footer.pied .compteur-jour{border-radius:18px;padding:9px 13px;font-size:11.5px}footer.pied .compteur-jour-lieu{flex-basis:100%;justify-content:center;border:0;padding:1px 0 0;font-size:10.5px}}';
  document.head.append(style);
  const cadre=document.createElement('div');
  cadre.className='compteur-jour';
  const debut=document.createElement('span');
  debut.setAttribute('aria-live','polite');
  const chiffre=document.createElement('strong');
  chiffre.className='compteur-jour-valeur';
  const fin=document.createElement('span');
  const lieu=document.createElement('span');
  lieu.className='compteur-jour-lieu';
  lieu.hidden=true;
  cadre.append(debut,chiffre,fin,lieu);
  pied.append(cadre);

  const formats={fr:'fr-CA',en:'en',es:'es',zh:'zh-CN',ar:'ar',ru:'ru'};
  const fmt=n=>new Intl.NumberFormat(formats[lang]||'en').format(n);
  const suffixe=n=>lang==='fr'?(n===1?'er':'e'):lang==='en'?((n%100>=11&&n%100<=13)?'th':n%10===1?'st':n%10===2?'nd':n%10===3?'rd':'th'):'';
  const montrerTexte=message=>{debut.textContent=message;chiffre.replaceChildren();fin.textContent='';};
  const montrerRang=n=>{
    debut.textContent=t[0];
    chiffre.replaceChildren(document.createTextNode(fmt(n)));
    const suf=suffixe(n);
    if(suf){const sup=document.createElement('sup');sup.textContent=suf;chiffre.append(sup);}
    fin.textContent=t[1];
  };
  const montrerTotal=n=>{debut.textContent=t[3];chiffre.textContent=fmt(n);fin.textContent=t[4];};
  montrerTexte(t[2]);

  const mentions={
    fr:'Le rang est une estimation du nombre de navigateurs différents sur une journée, distincte des statistiques Umami. CountAPI attribue le numéro mémorisé dans votre navigateur pour la journée. Le lieu affiché uniquement sur votre écran est estimé par ipwho.is à partir de votre adresse IP, transmise à ce service (aucun GPS). Ces requêtes respectent votre refus des statistiques et les réglages de non-suivi.',
    en:'The rank is an estimate of distinct browsers for the day, separate from Umami. CountAPI assigns the number stored locally for that day. The location, shown only on your screen, is estimated by ipwho.is from your IP address sent to that service (no GPS). Both requests honour analytics opt-out and do-not-track.',
    es:'La posición estima los navegadores distintos del día, aparte de Umami. CountAPI asigna el número guardado en tu navegador para ese día. El lugar se muestra solo en tu pantalla y se estima a partir de la IP enviada a ipwho.is, sin GPS. Se respeta el rechazo de estadísticas.',
    zh:'排名按当天不同浏览器估算，与 Umami 独立。CountAPI 分配当天保存于浏览器的号码。仅您自己可见的位置由 ipwho.is 根据发送给它的 IP 地址估算，不使用 GPS。尊重拒绝统计设置。',
    ar:'ترتيب الزائر تقديري بحسب متصفحات اليوم ومستقل عن Umami. تمنح CountAPI رقمًا يحفظ في المتصفح لليوم. يظهر الموقع على شاشتك فقط، ويقدره ipwho.is اعتمادًا على عنوان IP المرسل إليه دون GPS. تُحترم تفضيلات رفض الإحصاءات.',
    ru:'Номер приблизительно отражает число разных браузеров за день и не связан с Umami. CountAPI назначает номер, сохраняемый в браузере на день. Место видно только вам и приблизительно определяется ipwho.is по IP, который передаётся сервису, без GPS. Отказ от аналитики соблюдается.'
  };
  const zone=document.querySelector('footer.pied .pied-item.audience-info > .pied-panneau,footer.pied .pied-informations > .audience-info > div');
  if(zone){const note=document.createElement('p');note.textContent=mentions[lang]||mentions.en;zone.append(note);}
  const jour=()=>{
    const a=new Intl.DateTimeFormat('en-US',{timeZone:'America/Toronto',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
    const p=k=>a.find(x=>x.type===k)?.value||'';
    return p('year')+p('month')+p('day');
  };
  const bloque=()=>{
    if(navigator.globalPrivacyControl===true||navigator.doNotTrack==='1'||window.doNotTrack==='1'||navigator.webdriver)return true;
    try{return localStorage.getItem('eb-audience-refusee')==='1';}catch{return true;}
  };
  let busy=false,last=0,prevJour='',geoCharge=false;
  const lire=cle=>{try{return localStorage.getItem(cle);}catch{return null;}};
  const stocker=(cle,val)=>{try{localStorage.setItem(cle,val);}catch{}};
  const compteur=async(force=false)=>{
    if(busy||document.hidden)return;
    if(bloque()){montrerTexte(t[6]);lieu.hidden=true;return;}
    const date=jour();
    if(date!==prevJour){prevJour=date;last=0;montrerTexte(t[2]);}
    if(!force&&Date.now()-last<120000)return;
    const rang=Number(lire('eb-visiteur-rang-'+date));
    if(Number.isSafeInteger(rang)&&rang>0){montrerRang(rang);last=Date.now();return;}
    busy=true;
    const ancien=lire('eb-visiteur-public-'+date)==='1';
    try{
      const rep=await fetch('https://countapi.mileshilliard.com/api/v1/'+(ancien?'get':'hit')+'/erjbweb-unique-browser-day-'+date,{mode:'cors',credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer'});
      if(rep.status===404&&ancien){montrerTexte(t[2]);return;}
      if(!rep.ok)throw new Error('counter');
      const data=await rep.json(),n=Number(data.value);
      if(!Number.isSafeInteger(n)||n<=0)throw new Error('counter');
      if(bloque()||date!==jour())return;
      if(ancien)montrerTotal(n);
      else{
        montrerRang(n);
        stocker('eb-visiteur-public-'+date,'1');
        stocker('eb-visiteur-rang-'+date,String(n));
      }
      last=Date.now();
    }catch{if(!bloque())montrerTexte(t[2]);}
    finally{busy=false;}
  };
  const geolocaliser=async()=>{
    if(geoCharge||bloque()||document.hidden)return;
    geoCharge=true;
    const loc={fr:'fr',en:'en',es:'es',zh:'zh-CN',ru:'ru'}[lang]||'en';
    try{
      const rep=await fetch('https://ipwho.is/?fields=success,city,country&lang='+loc,{mode:'cors',credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer'});
      if(!rep.ok)throw new Error('geo');
      const d=await rep.json();
      if(d.success!==true)throw new Error('geo');
      const city=typeof d.city==='string'&&d.city.length<90?d.city.trim():'';
      const country=typeof d.country==='string'&&d.country.length<90?d.country.trim():'';
      const endroit=[city,country].filter(Boolean).join(', ');
      if(endroit&&!bloque()){lieu.textContent=t[5]+' '+endroit;lieu.hidden=false;}
    }catch{lieu.hidden=true;}
  };
  compteur();geolocaliser();
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){compteur();geolocaliser();}});
  document.addEventListener('click',ev=>{
    if(ev.target.closest('[data-audience-refuser]'))queueMicrotask(()=>{
      if(bloque()){montrerTexte(t[6]);lieu.hidden=true;geoCharge=false;}
      else{last=0;geoCharge=false;compteur(true);geolocaliser();}
    });
  });
})();
