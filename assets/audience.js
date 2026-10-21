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
 * Compteur public discret : visiteurs estimés du jour (heure de Montréal).
 * Une seule incrémentation par navigateur et par jour, en complément d'Umami.
 * Aucun appel ni incrémentation en cas de refus de l'audience ou de DNT/GPC.
 */
;(() => {
  const pied=document.querySelector('footer.pied');
  if(!pied || location.hostname!=='erjb-web.github.io') return;
  const lang=document.documentElement.lang.split('-')[0];
  const traductions={
    fr:['Visiteurs aujourd’hui','Estimation : navigateurs distincts ayant consulté le site aujourd’hui (heure de Montréal). Comptage actif à partir de son installation.'],
    en:['Visitors today','Estimate: distinct browsers visiting the site today (Montreal time). Counting starts when the counter is installed.'],
    es:['Visitantes de hoy','Estimación: navegadores distintos que visitaron el sitio hoy (hora de Montreal). El registro comienza al instalar el contador.'],
    zh:['今日访客','估算值：今天访问本站的不同浏览器数（蒙特利尔时间）。从安装计数器时开始计数。'],
    ar:['زوار اليوم','تقدير لعدد المتصفحات المختلفة التي زارت الموقع اليوم (بتوقيت مونتريال). يبدأ العد منذ تثبيت العداد.'],
    ru:['Посетители сегодня','Оценка числа разных браузеров, посетивших сайт сегодня (время Монреаля). Подсчёт начинается с установки счётчика.']
  };
  const texte=traductions[lang]||traductions.en;
  const style=document.createElement('style');
  style.textContent='footer.pied .compteur-jour{display:flex;align-items:center;justify-content:center;gap:7px;width:max-content;max-width:100%;margin:8px auto 0;padding:0;color:#657a83;font:400 12px/1.4 Inter,system-ui,sans-serif;letter-spacing:.005em}footer.pied .compteur-jour::before{content:"";width:5px;height:5px;flex:none;border-radius:50%;background:#78a99a}footer.pied .compteur-jour-valeur{font-weight:600;font-size:12px;color:#274654;font-variant-numeric:tabular-nums}';
  document.head.append(style);
  const conteneur=document.createElement('span');
  conteneur.className='compteur-jour';
  conteneur.title=texte[1];
  const etiquette=document.createElement('span');
  etiquette.textContent=texte[0]+' :';
  const valeur=document.createElement('strong');
  valeur.className='compteur-jour-valeur';
  valeur.textContent='—';
  valeur.setAttribute('aria-live','polite');
  conteneur.append(etiquette,valeur);
  pied.append(conteneur);

  const zone=document.querySelector('footer.pied .pied-item.audience-info > .pied-panneau, footer.pied .pied-informations > .audience-info > div');
  if(zone){
    const mentions={
      fr:'Le compteur public du jour repose sur CountAPI. Il est distinct des statistiques Umami, ne transmet pas l’adresse de la page et respecte le refus de mesure d’audience. Un repère anonyme conservé dans ce navigateur évite de compter plusieurs fois une même journée.',
      en:'The public daily counter uses CountAPI, separately from Umami. It does not transmit the page address and respects analytics opt-out. An anonymous browser-side marker prevents repeat counts on the same day.',
      es:'El contador público diario utiliza CountAPI, de forma independiente de Umami. No envía la dirección de la página y respeta el rechazo del seguimiento. Una marca anónima en el navegador evita repetir el conteo el mismo día.',
      zh:'公开的每日计数器使用独立于 Umami 的 CountAPI，不传送页面地址，并尊重退出统计的选择。浏览器中的匿名标记避免一天内重复计数。',
      ar:'يستخدم عداد الزوار اليومي العام خدمة CountAPI بشكل منفصل عن Umami، دون إرسال عنوان الصفحة ومع احترام رفض الإحصاءات. تمنع علامة مجهولة في المتصفح تكرار العد في اليوم نفسه.',
      ru:'Публичный суточный счётчик использует CountAPI отдельно от Umami, не передаёт адрес страницы и учитывает отказ от аналитики. Анонимная отметка в браузере предотвращает повторный подсчёт в течение дня.'
    };
    const info=document.createElement('p');
    info.textContent=mentions[lang]||mentions.en;
    zone.append(info);
  }

  const fuseau='America/Toronto';
  const dateLocale=()=>{
    const parties=Intl.DateTimeFormat('en-US',{timeZone:fuseau,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
    const champ=(t)=>parties.find(p=>p.type===t)?.value||'';
    return champ('year')+champ('month')+champ('day');
  };
  const bloque=()=>{
    if(navigator.globalPrivacyControl===true || navigator.doNotTrack==='1' || window.doNotTrack==='1' || navigator.webdriver) return true;
    try{return localStorage.getItem('eb-audience-refusee')==='1';}catch{return true;}
  };
  let dernierAcces=0, enCours=false;
  const actualiser=async(force=false)=>{
    if(enCours || document.hidden)return;
    if(bloque()){valeur.textContent='—';return;}
    if(!force && Date.now()-dernierAcces<120000)return;
    enCours=true;
    const jour=dateLocale();
    const cleLocale='eb-visiteur-public-'+jour;
    const clePublique='erjbweb-unique-browser-day-'+jour;
    let dejaCompte=true;
    try{dejaCompte=localStorage.getItem(cleLocale)==='1';}catch{}
    const action=dejaCompte?'get':'hit';
    try{
      const reponse=await fetch('https://countapi.mileshilliard.com/api/v1/'+action+'/'+clePublique,{
        mode:'cors',credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer'
      });
      if(reponse.status===404 && action==='get'){
        valeur.textContent='0';
      }else{
        if(!reponse.ok)throw new Error('Statistiques indisponibles');
        const donnees=await reponse.json();
        const total=Number(donnees.value);
        if(!Number.isSafeInteger(total)||total<0)throw new Error('Compteur invalide');
        valeur.textContent=new Intl.NumberFormat(lang==='zh'?'zh-CN':lang==='ar'?'ar':lang==='ru'?'ru':lang==='es'?'es':lang==='en'?'en': 'fr-CA').format(total);
        if(action==='hit')try{localStorage.setItem(cleLocale,'1');}catch{}
      }
      dernierAcces=Date.now();
    }catch{valeur.textContent='—';}
    finally{enCours=false;}
  };
  actualiser();
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)actualiser();});
  document.addEventListener('click',ev=>{
    if(ev.target.closest('[data-audience-refuser]'))queueMicrotask(()=>actualiser(true));
  });
})();
