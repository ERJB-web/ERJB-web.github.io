// npm install --no-save jsdom@26 && node tests/navigation-unique.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');
const {JSDOM}=require('jsdom');
const languages=['','en','es','zh','ar','ru','iu','innu'];
require('../outils/verifier-navigation').verifierNavigation();
async function verify(lang){
  const html=fs.readFileSync((lang?lang+'/':'')+'index.html','utf8');
  // CSS layout is checked in the browser; omit large inline sheets in this DOM test.
  const dom=new JSDOM(html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,''),{runScripts:'outside-only',pretendToBeVisual:true,url:'https://erjb-web.github.io/'+(lang?lang+'/':'')+'#recherche'});
  const w=dom.window,d=w.document;
  w.matchMedia=()=>({matches:true,addEventListener(){},removeEventListener(){}});
  w.IntersectionObserver=class{observe(){} disconnect(){}};
  w.ResizeObserver=class{observe(){} disconnect(){}};
  w.fetch=()=>new Promise(()=>{});
  w.HTMLElement.prototype.scrollIntoView=function(){};
  w.HTMLElement.prototype.scrollTo=function(){};
  try{
    w.eval(fs.readFileSync('assets/gabarit-salles.js','utf8'));
    const source=d.querySelector('#recherche > .section-contenu');
    assert(source.classList.contains('gab'),'Gabarit initializes without exceptions');
    assert.equal(source.querySelectorAll('.gab-chapitre').length,6);
    const room=d.querySelector('.salle-contenu');
    room.replaceChildren(source.cloneNode(true));
    await new Promise(r=>setTimeout(r,20));
    const active=()=>room.querySelector('.gab-page-active')?.dataset.gabSlug;
    const next=d.querySelector('.gab-lecture [data-gab-pas="1"]');
    const prev=d.querySelector('.gab-lecture [data-gab-pas="-1"]');
    assert(next&&prev,'Chosen top navigation installed');
    assert.equal(active(),'contexte');
    next.click();assert.equal(active(),'problematique');
    next.click();assert.equal(active(),'methodes');
    prev.click();assert.equal(active(),'problematique');
    assert.equal(d.querySelectorAll('.gab-lecture').length,1);
    for(const el of source.querySelectorAll('.chapitre-source'))assert(el.dataset.chapitreTitre,'Chapter title retained independently of old menu');
    console.log((lang||'fr')+': initialization, previous/next, chapter count OK');
  } finally {w.close();}
}
(async()=>{for(const lang of languages)await verify(lang);})().catch(e=>{console.error(e);process.exitCode=1;});
