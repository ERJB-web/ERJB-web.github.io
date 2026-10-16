/**
 * CC0 hockey equipment from 3DAssets.dev.
 * Verified permanent asset URLs: stick 33716, goalie pads 33719, furnished rink 33739.
 * The public manifest can resolve the other models. Falls back to modeled gear offline.
 */
const ROOT="https://3dassets.dev/api/v1/packs/ice-hockey-arena-and-locker-room";
const VERIFIED={stick:"https://cdn.3dassets.dev/assets/33716/v1/model.glb",pads:"https://cdn.3dassets.dev/assets/33719/v1/model.glb"};
const DESCRIPTORS=[
 {id:"stick",labels:["hockey stick, heel curve","hockey stick heel curve","hockey stick"],mount:"stick"},
 {id:"pads",labels:["goalie leg pads","goalie pads"],mount:"goalie"},
 {id:"mask",labels:["goalie mask"],mount:"goalie"},
 {id:"helmet",labels:["player helmet with cage","player helmet"],mount:"helmet"},
 {id:"skates",labels:["player skate"],mount:"skates"},
 {id:"gloves",labels:["hockey gloves"],mount:"gloves"},
 {id:"goal",labels:["hockey goal with net","hockey goal"],mount:"rink"}
];
function discover(data){
 const result=[],visited=new WeakSet();
 function visit(o,depth=0){
  if(!o||typeof o!=="object"||visited.has(o)||depth>8)return;visited.add(o);
  const label=[o.title,o.name,o.label,o.slug].filter(v=>typeof v==="string").join(" ").toLowerCase();
  const direct=[o.cdnUrl,o.cdn_url,o.modelUrl,o.model_url,o.glb_url,o.glb,o.url,o.download_url,o.file?.url]
    .find(v=>typeof v==="string"&&/^https:\/\/[^?#\s]+\.glb(?:[?#]|$)/i.test(v));
  if(label&&direct)result.push({label,url:direct});
  for(const value of Object.values(o)){
   if(Array.isArray(value))for(const item of value)visit(item,depth+1);
   else if(value&&typeof value==="object")visit(value,depth+1);
  }
 }
 visit(data);return result;
}
export async function loadHockeyAssets(T,stage,eric,hockey,isActive=()=>true,progress=()=>{}){
 let GLTFLoader;
 try{({GLTFLoader}=await import("three/addons/loaders/GLTFLoader.js"));}
 catch(err){console.warn("glTF import unavailable, using play-ready fallback objects",err);return {loaded:0,dispose(){}};}
 const loader=new GLTFLoader(),attachments=[],loaded=[];
 let found=[];
 try{
  const ac=new AbortController();
  const timeout=setTimeout(()=>ac.abort(),4500);
  try{const response=await fetch(ROOT,{signal:ac.signal,mode:"cors"});if(response.ok)found=discover(await response.json());}
  finally{clearTimeout(timeout);}
 }catch(e){console.info("Optional catalog offline; loading individually verified hockey GLBs.");}
 function lookup(item){
  const match=found.map(f=>({f,match:item.labels.reduce((score,w)=>Math.max(score,w.split(/\s+/).filter(k=>f.label.includes(k)).length),0)}))
   .sort((a,b)=>b.match-a.match)[0];
  return match?.match>=item.labels[0].split(" ").length-1?match.f.url:VERIFIED[item.id];
 }
 function mount(gltf,item){
  const model=gltf.scene,stageRoot=eric.group;
  model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;if(o.material?.map)o.material.map.anisotropy=8;}});
  if(item.id==="stick"){
   eric.useStickModel(model);
  }else if(item.id==="helmet"){
   const pivot=eric.equipmentMounts?.helmet||stageRoot;pivot.add(model);
   model.position.set(0,-.19,.055);model.scale.setScalar(.91);
  }else if(item.id==="skates"){
   for(const [index,key] of ["leftSkate","rightSkate"].entries()){
    const clone=index?model.clone(true):model;
    const foot=eric.equipmentMounts?.[key]||stageRoot;
    foot.add(clone);clone.position.set(0,-.16,.02);clone.scale.setScalar(.80);
    if(index)clone.rotation.y=Math.PI;
    attachments.push([foot,clone]);
   }
  }else if(item.id==="gloves"){
   const pivot=eric.equipmentMounts?.rightGlove||stageRoot;
   pivot.add(model);model.position.set(0,-.55,0);model.scale.setScalar(.75);
  }else if(item.id==="pads"){
   const keeper=hockey.goalie;keeper.add(model);
   model.position.set(0,.16,.10);model.scale.setScalar(.98);
  }else if(item.id==="mask"){
   const keeper=hockey.goalie;keeper.add(model);
   model.position.set(0,1.96,.1);model.scale.setScalar(.92);
  }else if(item.id==="goal"){
   stage.add(model);model.position.set(0,.10,-26.4);
   // Existing regulation frame remains; hide the alternative until its geometry is aligned.
   model.visible=false;
  }
  if(item.id!=="skates")attachments.push([model.parent,model]);
  loaded.push(item.id);progress(item.id,true);
 }
 const tasks=DESCRIPTORS.map(async item=>{
  const url=lookup(item);if(!url){progress(item.id,false);return;}
  try{const gltf=await loader.loadAsync(url);if(!isActive())return;mount(gltf,item);}
  catch(e){console.info("Optional hockey GLB unavailable:",item.id,e);progress(item.id,false);}
 });
 await Promise.allSettled(tasks);
 return {loaded:loaded.length,ids:loaded,dispose(){for(const [parent,obj] of attachments){parent?.remove?.(obj);}eric.resetHockeyGear?.();}};
}
