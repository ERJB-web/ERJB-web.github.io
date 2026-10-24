"use strict";
const fr=require('./ateliers-fr.json');
const langues=require('./ateliers-langues');
const references=require('./ateliers-references.json');
const noms=Object.keys(fr.labels);
function textes(lang,cle){
 if(lang==='fr')return {labels:fr.labels,...fr[cle]};
 const L=langues[lang]||langues.en,t=L[cle];
 return {labels:Object.fromEntries(noms.map((k,i)=>[k,L.labels[i]])),titre:t[0],intro:t[1],chaine:t[2],essai:[],cas:t[3],options:t[4].map(x=>({nom:x[0],raisonnement:x[1],livrable:x[2],vigilance:x[3]})),questions:t[4].map(x=>x[3]),refs:fr[cle].refs,portee:t[5]};
}
module.exports={textes,references};
