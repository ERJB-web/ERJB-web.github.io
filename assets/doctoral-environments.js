/**
 * PROTOCOLE — scientific settings furnished in licensed realistic PBR glTF.
 * Assets are served from /assets/jeu on the SAME origin as the game (GitHub Pages):
 * see FURNISHINGS.md for seven individually verified CC0 source entries.
 * Actual geometry has real-world dimensions; repeated props share GPU geometries.
 * The original collision/gameplay environments remain underneath as a safety net.
 */
const WORLD_FURNITURE={
 classroom: [
  ...Array.from({length:5},(_,row)=>[-7.5,-2.5,2.5,7.5].map(x=>({
   file:"classroom-desk",x,z:-19+row*4.5+.15,scale:1.0,
   hide:{x,z:-19+row*4.5,rx:1.65,rz:1.85}
  }))).flat()
 ],
 laboratory: [-9,-3,3,9].flatMap(x=>[-12,-20].map(z=>({
  file:"lab-bench",x,z,scale:1.0,hide:{x,z,rx:1.65,rz:1.2}
 }))),
 library: [-12,-8,8,12].flatMap(x=>[-23,-17,-11,-5,1].map(z=>({
  file:"library-shelf",x,z,scale:1.08,ry:Math.PI/2,
  hide:{x,z,rx:1.6,rz:2.3}
 }))).concat([-4,0,4].map(x=>({file:"study-books",x,z:-10,y:1.20,scale:1.0}))),
 office: [-10,7].flatMap(x=>[-20,-13].map(z=>({
  file:"office-desk",x,z,scale:1,hide:{x,z,rx:2.1,rz:2.3}
 }))),
 home: [
  {file:"home-sofa",x:-7,z:-14.9,scale:1,hide:{x:-7,z:-15,rx:4,rz:2.8}},
  {file:"study-books",x:8,z:-13.8,y:1.28,scale:1},
  {file:"study-books",x:-5,z:-9,y:.75,scale:1}
 ],
 conference:[
  {file:"conference-table",x:0,z:-14,scale:1.0},
  {file:"study-books",x:-8,z:-19,y:1.17,scale:1}
 ],
 auditorium:[
  {file:"conference-table",x:0,z:-23,scale:1.0,hide:{x:0,z:-23,rx:5.6,rz:1.2}}
 ],
 university:[
  {file:"study-books",x:-8,z:-2,y:.56,scale:1},
  {file:"study-books",x:8,z:-2,y:.56,scale:1}
 ]
};
export async function createImmersiveLocations(T,api={}){
 const {GLTFLoader}=await import("three/addons/loaders/GLTFLoader.js");
 const loader=new GLTFLoader();
 const cache=new Map();
 let visitToken=0;
 const pathname=filename=>"../assets/jeu/"+filename+".glb";
 function fetchGLB(id){
  if(!cache.has(id))cache.set(id,loader.loadAsync(pathname(id)).catch(err=>{cache.delete(id);throw err;}));
  return cache.get(id);
 }
 async function visit(name,stage,decor=[]){
  const token=++visitToken;
  const specs=WORLD_FURNITURE[name]||[];
  if(!stage||!specs.length)return;
  const unique=[...new Set(specs.map(s=>s.file))];
  const statuses=await Promise.all(unique.map(async id=>{
   try{return [id,await fetchGLB(id)];}
   catch(err){api.onFailed?.(name,err);return [id,null];}
  }));
  if(token!==visitToken||!stage.parent)return;
  const models=new Map(statuses),group=new T.Group(),hidden=new Set();
  let ready=0;
  for(const prop of specs){
   const src=models.get(prop.file);if(!src?.scene)continue;
   const mesh=src.scene.clone(true),bounds=new T.Box3().setFromObject(mesh);
   const centerX=(bounds.min.x+bounds.max.x)*.5;
   const centerZ=(bounds.min.z+bounds.max.z)*.5;
   const floor=bounds.min.y;
   mesh.scale.setScalar(prop.scale||1);
   mesh.position.set((prop.x||0)-centerX*(prop.scale||1), (prop.y||0)-floor*(prop.scale||1),(prop.z||0)-centerZ*(prop.scale||1));
   mesh.rotation.y=prop.ry||0;
   mesh.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.userData.externalGLTF=true;}});
   group.add(mesh);ready++;
   if(prop.hide)for(const o of decor){
    if(hidden.has(o)||!o?.isMesh||o.position.y<.14||o.position.y>2.65)continue;
    if(Math.abs(o.position.x-prop.hide.x)<prop.hide.rx&&Math.abs(o.position.z-prop.hide.z)<prop.hide.rz){
     hidden.add(o);
    }
   }
  }
  if(ready){
   // Hide primitive desk replacements only after every replacement has actually loaded.
   for(const old of hidden)old.visible=false;
   stage.add(group);
   document.getElementById("career")?.setAttribute("data-environment-status","detailed-props");
  }else document.getElementById("career")?.setAttribute("data-environment-status","procedural-fallback");
  document.getElementById("career")?.setAttribute("data-environment",name);
  api.onLoaded?.(name,ready);
 }
 return {visit,cache};
}
