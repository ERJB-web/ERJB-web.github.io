/**
 * Loads licensed (CC0) actual glTF meshes for hockey equipment.
 * Content owner: https://3dassets.dev/packs/ice-hockey-arena-and-locker-room
 * If the external CDN/manifest is unreachable the game remains playable.
 */
const MANIFEST="https://3dassets.dev/api/v1/packs/ice-hockey-arena-and-locker-room";
const FALLBACK={
 "hockey stick heel":"https://cdn.3dassets.dev/assets/33716/v1/model.glb",
 "goalie leg pads":"https://cdn.3dassets.dev/assets/33719/v1/model.glb"
};
const descriptors=[
 ["goal","hockey goal with net", [0,0,-26.4],[1,1,1],0],
 ["puck","ice hockey puck",[0,.17,-2],[1.2,1.2,1.2],0],
 ["mask","goalie mask",[0,2.20,.17],[.92,.92,.92],0],
 ["pads","goalie leg pads",[0,.22,.18],[1.0,1.0,1.0],0],
 ["helmet","player helmet with cage",[0,2.54,.05],[.94,.94,.94],Math.PI],
 ["stick","hockey stick heel",[.48,1.05,.32],[1,1,1],0],
 ["skate","player skate",[.22,.04,.20],[1,1,1],0],
 ["gloves","hockey gloves",[0,1.22,.23],[.72,.72,.72],0]
];
const known=(name)=>FALLBACK[name];
function scanManifest(data){
 const models=[];
 const visited=new WeakSet();
 function walk(item,depth=0){
  if(depth>9||item==null||typeof item!=="object"||visited.has(item))return;
  visited.add(item);
  const fields=Object.values(item);
  const name=[item.title,item.name,item.label,item.slug,item.description].filter(v=>typeof v==="string").join(" ").toLowerCase();
  const url=[item.cdn_url,item.cdnUrl,item.model_url,item.modelUrl,item.download_url,item.url,item.glb,item.file?.url].find(v=>typeof v==="string"&&/^https:\/\/.+\.glb(?:\?|$)/i.test(v));
  if(name&&url)models.push({name,url});
  for(const val of fields)if(val&&typeof val==="object")Array.isArray(val)?val.forEach(v=>walk(v,depth+1)):walk(val,depth+1);
 }
 walk(data);
 return models;
}
export async function loadHockeyAssets(T,stage,eric,hockey,active=()=>true,onProgress=()=>{}){
 // Dynamic import uses the same Three.js version as the main engine through its importmap.
 let GLTFLoader;
 try{({GLTFLoader}=await import("three/addons/loaders/GLTFLoader.js"));}catch(e){console.warn("GLTF loader unavailable",e);return {loaded:0,total:0,offline:true};}
 const loader=new GLTFLoader();
 const result={loaded:0,total:descriptors.length,offline:false};
 let manifest=[];
 try{const response=await fetch(MANIFEST,{mode:"cors",cache:"force-cache",signal:AbortSignal.timeout(5000)});if(response.ok)manifest=scanManifest(await response.json());}
 catch(e){console.info("Hockey asset manifest unavailable: loading known CC0 files",e);}
 function resolve(text){
  const words=text.toLowerCase().split(/\s+/);
  const matches=manifest.map(item=>({item,score:words.reduce((n,w)=>n+(item.name.includes(w)?1:0),0)})).sort((a,b)=>b.score-a.score);
  if(matches.length&&matches[0].score>=words.length)return matches[0].item.url;
  return known(text);
 }
 const tasks=descriptors.map(async([id,name,pos,scale,rotation])=>{
  const url=resolve(name);if(!url){onProgress(id,false);return;}
  try{
   const gltf=await loader.loadAsync(url);
   if(!active())return;
   const model=gltf.scene;
   model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;if(o.material?.map)o.material.map.anisotropy=8;}});
   let parent=stage;
   if(["stick","skate","helmet","gloves"].includes(id))parent=eric.group;
   if(["mask","pads"].includes(id))parent=hockey.goalie;
   parent.add(model);
   model.position.set(...pos);model.scale.set(...scale);model.rotation.y=rotation;
   if(id==="goal")model.visible=false; // existing regulation goal stays; keep GLB for optional replacement.
   if(id==="puck")model.visible=false; // physics uses one unique collidable puck.
   if(id==="stick"){
    // Preserve hand-controlled procedural stick, use this visual overlay aligned with the body.
    model.rotation.x=Math.PI/2;
   }
   if(id==="skate"){
    const mirror=model.clone(true);parent.add(mirror);
    mirror.position.set(-pos[0],pos[1],pos[2]);mirror.rotation.y=Math.PI;
   }
   result.loaded++;onProgress(id,true);
  }catch(e){onProgress(id,false);console.info("Asset unavailable",name,e);}
 });
 await Promise.allSettled(tasks);
 return result;
}
