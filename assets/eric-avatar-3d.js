/**
 * Volumetric, fully articulated avatar based on the site's authorized portrait.
 * Not a photogrammetric face scan: facial details are photographically projected on
 * a custom curved 3-D surface. Torso, limbs, neck, head, hair and shoes are modeled.
 */
export function createEricAvatar(T,options={}){
 const root=new T.Group(),rig=new T.Group();root.add(rig);
 const skin=new T.MeshStandardMaterial({color:0xd7a68c,roughness:.83,metalness:0});
 const dark=new T.MeshStandardMaterial({color:0x222026,roughness:.93});
 const eyes=new T.MeshStandardMaterial({color:0x392d2c,roughness:.6});
 const denim=new T.MeshStandardMaterial({color:0x253247,roughness:.86});
 const boot=new T.MeshStandardMaterial({color:0x4e3028,roughness:.66,metalness:.12});
 const sole=new T.MeshStandardMaterial({color:0x171b20,roughness:.95});
 const metal=new T.MeshStandardMaterial({color:0xc7d1d7,metalness:.82,roughness:.27});
 const shirtTexture=makeShirtTexture(T);
 const shirt=new T.MeshStandardMaterial({color:0xe9eff3,map:shirtTexture,roughness:.78,metalness:0,side:T.DoubleSide});
 const seam=new T.MeshStandardMaterial({color:0xc0cad2,roughness:.9});
 const shadow=new T.Mesh(new T.CircleGeometry(.59,48),new T.MeshBasicMaterial({color:0x030b16,transparent:true,opacity:.29,depthWrite:false,side:T.DoubleSide}));
 shadow.rotation.x=-Math.PI/2;shadow.position.y=.016;root.add(shadow);
 const meshes=[];
 function mesh(geometry,material,parent,x=0,y=0,z=0){
  const o=new T.Mesh(geometry,material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);meshes.push(o);return o;
 }
 const sphere=(p,m,x,y,z,sx,sy,sz,sub=22)=>{
  const obj=mesh(new T.SphereGeometry(1,sub,16),m,p,x,y,z);obj.scale.set(sx,sy,sz);return obj;
 };
 const box=(p,m,x,y,z,sx,sy,sz)=>{
  const obj=mesh(new T.BoxGeometry(sx,sy,sz),m,p,x,y,z);return obj;
 };
 const cylinder=(p,m,x,y,z,top,bottom,height)=>{
  return mesh(new T.CylinderGeometry(top,bottom,height,20),m,p,x,y,z);
 };
 // Pelvis and fitted trousers.
 const hip=new T.Group();hip.position.y=1.05;rig.add(hip);
 sphere(hip,denim,0,-.02,0,.39,.21,.265);
 cylinder(hip,boot,0,.145,0,.36,.36,.075);
 box(hip,metal,.045,.148,.302,.064,.062,.018);
 // Shirt is gently tapered and contoured rather than a box.
 const torso=mesh(new T.CylinderGeometry(.46,.35,1.02,28,7,true),shirt,rig,0,1.64,0);
 torso.scale.set(1.11,1,.82);
 sphere(rig,shirt,0,1.98,0,.47,.19,.32);
 const sternum=box(rig,seam,0,1.62,.323,.006,.73,.007);
 for(let j=0;j<6;j++)sphere(rig,sole,0,1.39+j*.11,.339,.008,.009,.004,10);
 // Collar and shirt opening.
 const leftCollar=box(rig,shirt,-.105,2.115,.29,.245,.105,.028);
 leftCollar.rotation.z=-.49;leftCollar.rotation.y=.20;
 const rightCollar=box(rig,shirt,.105,2.115,.29,.245,.105,.028);
 rightCollar.rotation.z=.49;rightCollar.rotation.y=-.20;
 cylinder(rig,skin,0,2.17,.005,.16,.18,.26);
 // Volumetric head, jaw and ears.
 const head=sphere(rig,skin,0,2.55,.01,.327,.414,.332,40);
 head.scale.z=.332; // anatomically rounded skull
 sphere(rig,skin,0,2.335,.035,.275,.19,.273,32);
 for(let side of [-1,1]){
  const ear=sphere(rig,skin,side*.329,2.54,.03,.078,.133,.067,20);
  const inner=sphere(rig,new T.MeshStandardMaterial({color:0xc58d80,roughness:.9}),side*.35,2.54,.087,.028,.073,.014,16);
 }
 // Short, naturally swept hairstyle: textured scalp and shaped locks, not clusters of spherical curls.
 const hairBase=new T.MeshStandardMaterial({color:0x292524,roughness:.98,metalness:0});
 sphere(rig,hairBase,0,2.846,-.060,.343,.202,.310,40);
 sphere(rig,hairBase,0,2.915,-.075,.337,.115,.290,36);
 // Curved strands converge into the crown; narrow overlapping tapered pieces eliminate the afro-like silhouette.
 const strandMaterial=[0x282322,0x312a29,0x211f20,0x3b302c].map(hex=>new T.MeshStandardMaterial({color:hex,roughness:.95}));
 for(let i=0;i<18;i++){
  const row=Math.floor(i/9),index=i%9,u=(index-4)/4;
  const strand=mesh(new T.CapsuleGeometry(.031,.13+(.04*(i%3)),5,8),strandMaterial[i%4],rig,
    u*.285,2.938-row*.068, .12+row*.129);
  strand.rotation.z=-.40+u*.57;strand.rotation.x=.72+row*.22;
  strand.scale.set(1,1.0+(i%3)*.17,1.0);
 }
 // Slightly asymmetrical hairline consistent with Éric's portrait.
 for(let i=0;i<7;i++){
  const lock=mesh(new T.CapsuleGeometry(.037,.085,4,8),strandMaterial[(i+1)%4],rig,
   (i-3)*.092,2.815+(i%3)*.020,.284-(i%2)*.04);
  lock.rotation.z=-.42+(i-3)*.065;lock.rotation.x=.60;
 }
 const faceTexture=makeFaceTexture(T,options.portraitUrl||"../assets/portrait.jpg",()=>{options.onReady?.();});
 const faceMat=new T.MeshBasicMaterial({map:faceTexture,transparent:true,side:T.DoubleSide,depthWrite:false,alphaTest:.025,polygonOffset:true,polygonOffsetFactor:-1});
 // Curved front surface. Vertex positions wrap back around the cheeks and temples;
 // edges gradually disappear into skin instead of a rectangular pasted photograph.
 const nx=40,ny=52,vertices=[],uvs=[],indices=[];
 for(let yi=0;yi<=ny;yi++){
  const v=yi/ny,y=(v-.5)*.78;
  const ellipse=Math.sqrt(Math.max(0,1-(y/.415)**2));
  for(let xi=0;xi<=nx;xi++){
   const u=xi/nx,xx=(u-.5)*.646*ellipse;
   const normalized=ellipse?xx/(.327*ellipse):0;
   const normalizedY=y/.414,normalizedX=xx/.327;
   const z=.01+.334*Math.sqrt(Math.max(.025,1-normalizedX*normalizedX-normalizedY*normalizedY))+.013;
   vertices.push(xx,2.555+y,z);
   uvs.push(u,v);
  }
 }
 for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){
  const a=y*(nx+1)+x,b=a+nx+1;
  indices.push(a,b,a+1,b,b+1,a+1);
 }
 const geometry=new T.BufferGeometry();
 geometry.setAttribute("position",new T.Float32BufferAttribute(vertices,3));
 geometry.setAttribute("uv",new T.Float32BufferAttribute(uvs,2));
 geometry.setIndex(indices);geometry.computeVertexNormals();
 const face=mesh(geometry,faceMat,rig);face.renderOrder=6;face.castShadow=false;
 // Facial hair continues under jaw in genuine volume (without a moustache blob).
 // Facial hair is retained in the photographic texture, without an artificial moustache object.
 // Spine movement and articulated arms, two pivot points per limb.
 const arms=[],legs=[];
 for(const side of [-1,1]){
  const shoulder=new T.Group();shoulder.position.set(side*.52,1.99,0);rig.add(shoulder);
  sphere(shoulder,shirt,0,-.09,0,.167,.202,.172);
  const sleeve=cylinder(shoulder,shirt,0,-.31,0,.186,.143,.48);
  const elbow=new T.Group();elbow.position.set(0,-.56,0);shoulder.add(elbow);
  sphere(elbow,shirt,0,0,0,.12,.125,.13);
  cylinder(elbow,shirt,0,-.24,0,.145,.11,.45);
  cylinder(elbow,seam,0,-.46,0,.116,.117,.035);
  sphere(elbow,skin,0,-.595,0,.106,.13,.105,20);
  for(let j=0;j<4;j++)sphere(elbow,skin,(j-1.5)*.044,-.686,.025,.027,.072,.035,10);
  arms.push({shoulder,elbow,side});
  const pelvis=new T.Group();pelvis.position.set(side*.215,0,0);hip.add(pelvis);
  cylinder(pelvis,denim,0,-.285,0,.186,.160,.58);
  sphere(pelvis,denim,0,-.58,0,.166,.14,.165);
  const knee=new T.Group();knee.position.set(0,-.58,0);pelvis.add(knee);
  cylinder(knee,denim,0,-.275,0,.159,.125,.55);
  cylinder(knee,seam,0,-.535,0,.126,.126,.033);
  const foot=new T.Group();foot.position.set(0,-.37,.058);knee.add(foot);
  const upper=sphere(foot,boot,0,-.025,.10,.174,.14,.31,20);
  sphere(foot,boot,0,-.05,.30,.174,.09,.196,20);
  const shoeSole=box(foot,sole,0,-.126,.145,.355,.067,.55);
  for(let k=0;k<4;k++)box(foot,seam,0,.07-k*.037,.195+k*.035,.20,.008,.010);
  const blade=box(foot,metal,0,-.165,.15,.28,.028,.55);blade.visible=false;
  legs.push({pelvis,knee,foot,blade,side});
 }
 // A real small prop rig can become visible in the hockey scene.
 const stick=new T.Group();arms[1].elbow.add(stick);stick.position.set(.13,-.61,.09);stick.rotation.z=.33;
 const shaft=cylinder(stick,boot,.03,-.59,.01,.025,.025,1.25);
 const paddle=box(stick,sole,.12,-1.21,.08,.32,.105,.068);paddle.rotation.y=.16;
 stick.visible=false;
 const helmetMount=new T.Group();helmetMount.position.set(0,2.50,0);rig.add(helmetMount);
 // Hockey kit is built on anatomical pivots so the equipment follows falls and strides.
 const navy=new T.MeshStandardMaterial({color:0x184c75,roughness:.73});
 const jerseyWhite=new T.MeshStandardMaterial({color:0xe8f0f6,roughness:.78});
 const visor=new T.MeshStandardMaterial({color:0xc9d6de,metalness:.75,roughness:.27});
 const jerseyGear=new T.Group();rig.add(jerseyGear);
 const sweater=mesh(new T.CylinderGeometry(.495,.407,1.01,28,5),navy,jerseyGear,0,1.65,0);
 sweater.scale.z=.82;
 const chestStripe=mesh(new T.CylinderGeometry(.46,.414,.12,28),jerseyWhite,jerseyGear,0,1.39,0);chestStripe.scale.z=.83;
 const chestLogo=sphere(jerseyGear,jerseyWhite,0,1.73,.34,.14,.14,.025,28);
 const redStripe=new T.MeshStandardMaterial({color:0xee6546,roughness:.75});
 for(let side of [-1,1]){
  sphere(jerseyGear,navy,side*.43,1.97,.005,.22,.25,.25,22);
  const glove=sphere(arms[side===-1?0:1].elbow,navy,0,-.60,.03,.145,.19,.14,22);
  const cuff=sphere(arms[side===-1?0:1].elbow,jerseyWhite,0,-.48,.02,.165,.11,.147,18);
  // Elements attached to elbows must not remain visible outside the hockey scene.
  glove.userData.hockeyOnly=true;cuff.userData.hockeyOnly=true;
  const knee=legs[side===-1?0:1].knee;
  const shin=sphere(knee,navy,0,-.32,.16,.205,.39,.19,22);shin.userData.hockeyOnly=true;
  const trim=sphere(knee,jerseyWhite,0,-.45,.325,.16,.03,.04,18);trim.userData.hockeyOnly=true;
  const bootOverlay=sphere(legs[side===-1?0:1].foot,navy,0,.01,.12,.182,.15,.28,22);
  bootOverlay.userData.hockeyOnly=true;
 }
 const helmetShell=sphere(helmetMount,navy,0,.29,-.040,.382,.225,.339,40);
 const backCap=sphere(helmetMount,navy,0,.10,-.19,.342,.24,.14,28);
 const frontShell=sphere(helmetMount,navy,0,.20,.26,.355,.095,.11,28);
 // Cage bars: subtle silver tubing curves around the actual photo-textured face.
 for(const hh of [-.12,-.025,.065,.16]){
  const bar=mesh(new T.TorusGeometry(.345,.012,7,50,Math.PI),visor,helmetMount,0,hh,.27);
  bar.rotation.z=Math.PI;bar.scale.y=.48;
 }
 for(const xx of [-.21,-.11,0,.11,.21]){
  const bar=cylinder(helmetMount,visor,xx,-.04,.32,.009,.009,.37);
  bar.rotation.z=xx*.49;
 }
 const earGuard=sphere(helmetMount,jerseyWhite,-.345,.08,-.08,.06,.16,.09,15);
 const earGuard2=sphere(helmetMount,jerseyWhite,.345,.08,-.08,.06,.16,.09,15);
 let hasRealHelmet=false;
 function useHelmetModel(model){helmetShell.visible=false;frontShell.visible=false;backCap.visible=false;hasRealHelmet=true;}
 let hasRealStick=false;
 const equipmentMounts={helmet:helmetMount,stick,leftSkate:legs[0].foot,rightSkate:legs[1].foot,
   leftGlove:arms[0].elbow,rightGlove:arms[1].elbow};
 function resetHockeyGear(){shaft.visible=true;paddle.visible=true;hasRealStick=false;helmetShell.visible=true;frontShell.visible=true;backCap.visible=true;hasRealHelmet=false;}
  function useStickModel(model){
   if(!model)return;
   shaft.visible=false;paddle.visible=false;hasRealStick=true;
   stick.add(model);model.position.set(0,-1.18,0);model.rotation.set(0,Math.PI/2,0);
 }
 let fallBlend=0,elapsed=0,motion="idle";
 function update(dt=0,time=0,velocity={x:0,z:0},place="university"){
  const speed=Math.hypot(velocity.x||0,velocity.z||0);
  const walking=speed>.08;
  const fast=speed>8.5;
  const skating=place==="rink";
  elapsed+=dt;
  motion=skating?"skate":fast?"run":walking?"walk":"idle";
  const period=skating?7.5:fast?13.0:9.1;
  const swing=Math.sin(time*.001*period),bounce=walking?Math.abs(Math.sin(time*.001*period))*(skating?.012:.036):Math.sin(time*.0011)*.009;
  rig.position.y=bounce;
  rig.rotation.z=walking?Math.sin(time*.001*period)*.017:Math.sin(time*.0018)*.009;
  rig.rotation.x=(skating?(walking?-.135:-.06):0)+fallBlend*1.18;
  rig.rotation.z+=fallBlend*.23;
  rig.position.y-=fallBlend*.91;
  hip.rotation.y=walking?Math.sin(time*.001*period)*.045:0;
  for(let i=0;i<2;i++){
   const leg=legs[i],arm=arms[i],phase=i===0?1:-1;
   leg.pelvis.rotation.x=walking?swing*phase*(skating?.43:fast?.78:.54):.025;
   leg.knee.rotation.x=walking?Math.max(0,-swing*phase)*(skating?.65:fast?.75:.4):.06;
   leg.foot.rotation.x=skating?-.16:walking?Math.max(0,swing*phase)*-.18:0;
   arm.shoulder.rotation.x=walking?swing*phase*(skating?.35:fast?.55:.4):.045;
   arm.shoulder.rotation.z=-phase*(skating?.13:.07);
   arm.elbow.rotation.x=walking?.15+Math.max(0,-swing*phase)*.28:.10;
   leg.blade.visible=skating;
  }
  stick.visible=skating;
  // Smooth anatomical direction, including reverse walking.
  if(walking){
   const desired=Math.atan2(velocity.x,velocity.z);
   let delta=((desired-root.rotation.y+Math.PI*3)%(Math.PI*2))-Math.PI;
   root.rotation.y+=delta*Math.min(1,dt*9);
  }
  shadow.material.opacity=walking?.28:.33;
 }
 function setFall(progress=0){fallBlend=Math.max(0,Math.min(1,Math.sin(progress*Math.PI)*1.18));}
  function setPosition(x,y,z){root.position.set(x,y,z);}
 function setEquipment(equipment){
 const hockey=equipment==="hockey";
 stick.visible=hockey;helmetMount.visible=hockey;jerseyGear.visible=hockey;
 for(const leg of legs)leg.blade.visible=hockey;
 for(const mesh of meshes)if(mesh.userData.hockeyOnly)mesh.visible=hockey;
}
 function dispose(){for(const m of meshes){m.geometry?.dispose?.();}for(const mat of [skin,dark,eyes,denim,boot,sole,metal,shirt,seam])mat.dispose?.();shirtTexture.dispose?.();faceTexture.dispose?.();}
 return {group:root,update,setPosition,setFall,setEquipment,equipmentMounts,useStickModel,useHelmetModel,resetHockeyGear,dispose,get motion(){return motion;},get true3D(){return true;},get reference(){return "assets/portrait.jpg"}};
}
function makeShirtTexture(T){
 const c=document.createElement("canvas");c.width=512;c.height=512;
 const g=c.getContext("2d");g.fillStyle="#f2f5f7";g.fillRect(0,0,512,512);
 for(let x=0;x<512;x+=9){
  g.fillStyle=x%18===0?"#becbd6":"#d4dfe8";
  g.fillRect(x,0,x%18===0?1.1:.65,512);
  g.fillStyle="#ffffff";g.fillRect(x+2,0,1,512);
 }
 const tx=new T.CanvasTexture(c);tx.colorSpace=T.SRGBColorSpace;
 tx.wrapS=T.RepeatWrapping;tx.wrapT=T.RepeatWrapping;tx.repeat.set(2.5,1.4);
 tx.anisotropy=4;return tx;
}
function makeFaceTexture(T,url,onReady){
 const cv=document.createElement("canvas");cv.width=512;cv.height=640;
 const g=cv.getContext("2d"),texture=new T.CanvasTexture(cv);texture.colorSpace=T.SRGBColorSpace;
 const img=new Image();img.decoding="async";
 img.onload=()=>{
  g.clearRect(0,0,512,640);
  // Portrait crop includes natural hairstyle, facial expression, jaw and upper neck.
  g.save();
  g.beginPath();g.ellipse(256,326,245,304,0,0,Math.PI*2);g.clip();
  g.drawImage(img,286,105,354,459,0,0,512,640);
  g.restore();
  // A feathered alpha mask prevents visible photograph-to-skin rectangular edges.
  g.globalCompositeOperation="destination-in";
  const v=g.createRadialGradient(256,322,148,256,327,315);
  v.addColorStop(0,"rgba(0,0,0,1)");
  v.addColorStop(.68,"rgba(0,0,0,1)");
  v.addColorStop(.87,"rgba(0,0,0,.74)");
  v.addColorStop(1,"rgba(0,0,0,0)");
  g.fillStyle=v;g.fillRect(0,0,512,640);
  g.globalCompositeOperation="source-over";
  texture.needsUpdate=true;onReady?.();
 };
 img.onerror=()=>{
  g.fillStyle="#cca68f";g.fillRect(0,0,512,640);
  g.fillStyle="#273039";g.font="700 40px sans-serif";g.textAlign="center";g.fillText("Éric",256,350);
  texture.needsUpdate=true;
 };
 img.src=url;return texture;
}
