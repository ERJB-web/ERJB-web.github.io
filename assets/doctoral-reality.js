/*
 * PROTOCOLE | Living characters and headset support.
 * Licensed external rigged human meshes, skinning and true animation clips.
 * A failure to fetch assets leaves the original offline scene playable.
 * 3DAssets.dev Gorgehold Scout: CC0, https://3dassets.dev/assets/gorgehold-survivor-gallery-and-operations-gorgehold-sc-5418288a
 * Three.js example Soldier: see https://github.com/mrdoob/three.js/tree/dev/examples/models/gltf
 */
const MODEL_URLS = [
 "https://cdn.3dassets.dev/assets/32901/v1/model.glb",
 "https://threejs.org/examples/models/gltf/Soldier.glb"
];
const XR_SUPPORTED = () => typeof navigator !== "undefined" && !!navigator.xr;
function actionByName(clips, words) {
 const term = new RegExp(words,"i");
 return clips.find(c=>term.test(c.name)) || null;
}
function humanController(T, base, clips, targetHeight, parent) {
 const {clone} = base.utils;
 const model = clone(base.scene);
 const rig = new T.Group();
 const b = new T.Box3().setFromObject(model);
 const h = Math.max(.1, b.max.y-b.min.y);
 const scale = targetHeight/h;
 model.scale.multiplyScalar(scale);
 model.position.y = -b.min.y*scale;
 model.traverse(o=>{if(o.isMesh||o.isSkinnedMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;o.userData.externalGLTF=true;}});
 rig.add(model);parent.add(rig);
 const mixer=new T.AnimationMixer(model);
 const pick=(name)=>name==="idle"?actionByName(clips,"(^|[^a-z])idle|standing|breath|rest"):
   name==="walk"?actionByName(clips,"walk|locomotion"):
   name==="run"?actionByName(clips,"run|jog|sprint"):
   name==="grasp"?actionByName(clips,"grasp|interact|wave|greet"):null;
 const available={idle:pick("idle"),walk:pick("walk"),run:pick("run"),grasp:pick("grasp")};
 let current=null,fall=0;
 function transition(next){
  const clip=available[next]||available.walk||available.idle||clips[0];
  if(!clip)return;
  if(current?.getClip()===clip)return;
  const nextAction=mixer.clipAction(clip);nextAction.reset();nextAction.enabled=true;nextAction.setEffectiveWeight(1);nextAction.play();
  if(current){nextAction.crossFadeFrom(current,.23,true);}current=nextAction;
 }
 transition("idle");
 return {
  rig,model,
  update(dt,mode="idle",velocity=0){
   transition(mode);
   if(current)current.timeScale = mode==="walk"?Math.max(.62,velocity/3.0):mode==="run"?Math.max(.85,velocity/6):1;
   mixer.update(dt);
   fall=Math.max(0,fall-dt);
   rig.rotation.z = fall>0 ? Math.sin((1-fall)*Math.PI)*1.05 : T.MathUtils.damp(rig.rotation.z,0,8,dt);
  },
  tumble(){fall=1.3;},
  destroy(){mixer.stopAllAction();parent.remove(rig);}
 };
}
export async function installLivingWorld(T,api){
 const {GLTFLoader}=await import("three/addons/loaders/GLTFLoader.js");
 const utils=await import("three/addons/utils/SkeletonUtils.js");
 const loader=new GLTFLoader();
 let asset=null, source="", downloaded=null;
 for(const url of MODEL_URLS) {
  try {const gltf=await loader.loadAsync(url);
   if(!gltf.scene||!gltf.animations?.length)continue;
   asset={scene:gltf.scene,utils};source=url;downloaded=gltf;break;
  } catch (error) {console.warn("Another human asset source will be tried",url,error);}
 }
 if(!asset) throw Error("Neither rigged human model could be loaded");
 const hero=humanController(T,asset,downloaded.animations,2.48,api.player);
 // Preserve the ground shadow but remove all primitive body components.
 for(const child of api.player.children) if(child!==hero.rig && child.type!=="Mesh")child.visible=false;
 let cast=[];
 function syncCast(actors) {
  for(const c of cast)c.human.destroy();
  cast=[];
  for(const [i,a] of actors.entries()){
   if(i>10)break;
   const human=humanController(T,asset,downloaded.animations,2.29,a.body);
   // Hide geometric mannequin meshes but retain the conversation nameplate.
   for(const obj of a.body.children)if(obj!==human.rig && obj!==a.nameTag)obj.visible=false;
   human.rig.rotation.y=i%2?-.32:.30;
   cast.push({human,actor:a,phase:i*1.4});
  }
 }
 let time=0;
 function update(dt,vx,vz,room){
  const speed=Math.hypot(vx,vz);
  const mode=room==="rink"?(speed>.15?"run":"idle"):speed>5?"run":speed>.15?"walk":"idle";
  hero.update(dt,mode,speed);
  time+=dt;
  for(const c of cast) {
   c.human.update(dt,c.actor.move?"walk":"idle",c.actor.move?1.0:0);
   c.human.rig.rotation.y=Math.sin(time*.4+c.phase)*.32;
  }
 }
 // When WebXR is unavailable the button reports the limitation without pretending to launch VR.
 let xrButton=null,xrSession=null;
 const renderer=api.renderer;
 if(typeof document!=="undefined"&&renderer?.xr){
  xrButton=document.createElement("button");
  xrButton.type="button";xrButton.id="xrModeBtn";xrButton.textContent="◉ Mode VR";
  xrButton.title="Casque de réalité virtuelle WebXR compatible";
  xrButton.setAttribute("aria-label","Entrer en réalité virtuelle avec un casque WebXR");
  (document.querySelector(".bar-actions")||document.body).appendChild(xrButton);
  xrButton.addEventListener("click",async()=>{
   if(xrSession){await xrSession.end();return;}
   if(!XR_SUPPORTED()){api.notify?.("Le navigateur ou ce matériel ne propose pas de casque WebXR.");return;}
   try{
    if(!await navigator.xr.isSessionSupported("immersive-vr")){
     api.notify?.("Aucun casque VR WebXR compatible détecté.");return;
    }
    const session=await navigator.xr.requestSession("immersive-vr",{optionalFeatures:["local-floor","bounded-floor","hand-tracking"]});
    renderer.xr.enabled=true;await renderer.xr.setSession(session);
    xrSession=session;xrButton.textContent="◉ Quitter la VR";
    api.notify?.("Casque connecté : utilisez les sticks pour vous déplacer et les gâchettes pour interagir.");
    session.addEventListener("end",()=>{xrSession=null;xrButton.textContent="◉ Mode VR";});
   }catch(err){api.notify?.("Impossible de démarrer la VR : "+(err?.message||"session refusée"));}
  });
 }
 function xrAxes(){
  if(!xrSession)return null;
  let dx=0,dz=0,interact=false;
  for(const input of xrSession.inputSources){
   const pad=input.gamepad;if(!pad)continue;
   const a=pad.axes||[],right=a.length>2?a[2]:a[0],forward=a.length>3?a[3]:a[1];
   if(Math.abs(right||0)>.17)dx+=right;
   if(Math.abs(forward||0)>.17)dz+=forward;
   interact ||=!!pad.buttons?.[0]?.pressed;
  }
  return {x:Math.max(-1,Math.min(1,dx)),z:Math.max(-1,Math.min(1,dz)),interact};
 }
 document.getElementById("career")?.setAttribute("data-human-model","loaded");
 api.notify?.("Personnages humains 3D chargés. Marche, course et animations squelettiques activées.");
 return {syncCast,update,fall:()=>hero.tumble(),xrAxes,get inVR(){return !!xrSession;},source};
}
