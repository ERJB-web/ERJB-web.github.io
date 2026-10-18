const fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto');
const sharp=require('C:/Users/Heima/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.resolve(__dirname,'..');
const source='C:/Users/Heima/Documents/Protocole de thèse (officiel)/08 - Cartographie O2 (R et QGIS)/CARTES À CONSULTER';
(async()=>{
 const manifest=JSON.parse(await fs.readFile(path.join(root,'assets/these/o2-galerie/index.json'),'utf8'));
 for(let i=0;i<manifest.planches.length;i+=4){
   await Promise.all(manifest.planches.slice(i,i+4).map(async p=>{
     const input=await fs.readFile(path.join(source,p.fichier_source));
     if(crypto.createHash('sha256').update(input).digest('hex')!==p.sha256)throw Error('Source modifiée : '+p.id);
     const meta=await sharp(input).metadata();
     p.largeur=meta.width;p.hauteur=meta.height;
     await sharp(input).webp({lossless:true,effort:4}).toFile(path.join(root,p.original));
     await sharp(input).resize({width:2200,withoutEnlargement:true}).webp({quality:94,effort:4}).toFile(path.join(root,p.image));
   }));
   console.log(Math.min(i+4,manifest.planches.length)+' / '+manifest.planches.length);
 }
 await fs.writeFile(path.join(root,'assets/these/o2-galerie/index.json'),JSON.stringify(manifest,null,2)+'\n');
})();
