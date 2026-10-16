/**
 * PROTOCOLE — modular, real-world-scale glTF environments.
 * Locations use published CC0 3DAssets.dev scene packs with PBR materials.
 * They are streamed only when entering the corresponding level.
 * If CDN download fails, the playable procedural environment remains intact.
 */
const SCENES={
 classroom:{id:34781,scale:1.18,x:0,z:-14},
 laboratory:{id:37185,scale:1.08,x:0,z:-15},
 library:{id:30951,scale:1.12,x:0,z:-14},
 office:{id:26326,scale:1.48,x:0,z:-13},
 home:{id:38818,scale:1.58,x:0,z:-12},
 conference:{id:35232,scale:1.17,x:0,z:-14},
 auditorium:{id:34781,scale:1.25,x:0,z:-14}
};
export async function createImmersiveLocations(T,api={}){
 const {GLTFLoader}=await import("three/addons/loaders/GLTFLoader.js");
 const loader=new GLTFLoader();
 const cache=new Map();
 const active={name:null,number:0};
 function fetchGLB(id){
  if(!cache.has(id))cache.set(id,loader.loadAsync("https://cdn.3dassets.dev/assets/"+id+"/v1/model.glb")
    .catch(error=>{cache.delete(id);throw error;}));
  return cache.get(id);
 }
 async function visit(name,stage,decor=[]){
  const spec=SCENES[name];const request=++active.number;active.name=name;
  if(!spec||!stage)return;
  try{
   const gltf=await fetchGLB(spec.id);
   if(active.number!==request||!stage.parent)return;
   const scene=gltf.scene.clone(true),bbox=new T.Box3().setFromObject(scene);
   const sx=(bbox.min.x+bbox.max.x)*.5,sz=(bbox.min.z+bbox.max.z)*.5,sy=bbox.min.y;
   scene.scale.setScalar(spec.scale);
   scene.position.set(spec.x-sx*spec.scale,-sy*spec.scale,spec.z-sz*spec.scale);
   scene.traverse(o=>{
    if(o.isMesh){
     o.userData.externalGLTF=true;
     o.castShadow=o.geometry?.attributes?.position?.count<10000;
     o.receiveShadow=true;
     o.frustumCulled=true;
    }
   });
   // Preserve gameplay markers, actors and floor; replace primitive room furnishings.
   for(const o of decor){
    if(o?.isMesh && o.position.y>.14 && !o.userData.externalGLTF)o.visible=false;
   }
   stage.add(scene);
   document.getElementById("career")?.setAttribute("data-environment",name);
   document.getElementById("career")?.setAttribute("data-environment-status","detailed-glb");
   api.onLoaded?.(name);
  }catch(err){
   // The built-in navigable 3D room remains visible if a GLB host is offline.
   if(active.number===request && stage.parent){
    document.getElementById("career")?.setAttribute("data-environment",name);
    document.getElementById("career")?.setAttribute("data-environment-status","procedural-fallback");
   }
   api.onFailed?.(name,err);
  }
 }
 return {visit,cache};
}
