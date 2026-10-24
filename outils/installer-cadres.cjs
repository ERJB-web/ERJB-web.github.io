'use strict';
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const {render}=require('./cadres-pedagogiques');
// Modification ciblée des pages déjà produites : conserve leurs autres ajustements.
const f=path.join(root,'index.html');let html=fs.readFileSync(f,'utf8');
const pattern=/<h3 class="titre-bloc">Dans ma thèse[\s\S]*?<div class="cadres">[\s\S]*?<\/div>/;
if(!html.includes('class="cp"')){if(!pattern.test(html))throw Error('Bloc des cinq cadres introuvable');html=html.replace(pattern,render());}
else html=html.replace(/<section class="cp"[\s\S]*?<script type="application\/json" class="cp-data">[\s\S]*?<\/script><\/section>/,render());
if(!html.includes('assets/cadres-pedagogiques.css'))html=html.replace('</head>','<link rel="stylesheet" href="assets/cadres-pedagogiques.css?v=20261019-1">\n<script src="assets/cadres-pedagogiques.js?v=20261019-1" defer></script>\n</head>');
fs.writeFileSync(f,html);
const page=`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Les savoirs en mouvement — Éric Bernier</title><meta name="description" content="Cinq cadres de mobilisation des connaissances à explorer : schémas, défis, atelier et quiz expliqués."><link rel="stylesheet" href="../assets/cadres-pedagogiques.css?v=20261019-1"><style>body{margin:0;padding:24px;background:#fbfcfa;font-family:system-ui,sans-serif}nav{max-width:1160px;margin:auto}nav a{color:#17695e;font-size:.9rem}@media(max-width:600px){body{padding:12px}}</style><script src="../assets/cadres-pedagogiques.js?v=20261019-1" defer></script></head><body><nav><a href="../index.html#implantation">← Revenir au site d’Éric Bernier</a></nav><main>${render()}</main></body></html>`;
fs.writeFileSync(path.join(root,'implantation','mobilisation.html'),page);
console.log('Parcours intégré et page directe produite.');
