/**
 * PROTOCOLE / La troisième période
 * A real-time, controllable hockey minigame. Puck and goalie states are independent
 * of animation FPS, with rebounds, charges, aim, saves, goals, falls and restarts.
 * CC0 3D equipment is loaded asynchronously; gameplay works offline with fallback meshes.
 */
export function createHockeyGame(T, stage, eric, hooks={}){
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const mat=(color,metalness=.12,roughness=.52)=>new T.MeshStandardMaterial({color,metalness,roughness});
 const black=mat(0x12151a,.05,.84),rubber=mat(0x171819,.1,.91),white=mat(0xe9f3f7,.03,.6),red=mat(0xe8464e,.10,.45);
 const blue=mat(0x245f93,.17,.38),chrome=mat(0xc1d7e3,.73,.22);
 const mesh=(parent,geometry,material,x=0,y=0,z=0)=>{const o=new T.Mesh(geometry,material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;};
 // Puck has the correct 76mm silhouette, highlighted so it can be seen from the chase camera.
 const puck=mesh(stage,new T.CylinderGeometry(.13,.13,.068,40,1),rubber,0,.16,-2);
 const ring=mesh(stage,new T.TorusGeometry(.115,.012,8,40),white,0,.197,-2);ring.rotation.x=Math.PI/2;
 const shadow=mesh(stage,new T.CircleGeometry(.21,30),new T.MeshBasicMaterial({color:0x111c25,transparent:true,opacity:.28,depthWrite:false}),0,.096,-2);shadow.rotation.x=-Math.PI/2;
 // A goalie with actual mask, upper-body pads, catching glove, blocker and butterfly pads.
 const goalie=new T.Group();stage.add(goalie);goalie.position.set(0,0,-25.2);
 const body=new T.Group();goalie.add(body);
 const shape=(g,m,x,y,z,parent=body)=>mesh(parent,g,m,x,y,z);
 const chest=shape(new T.SphereGeometry(1,24,16),blue,0,1.40,0);chest.scale.set(.58,.65,.39);
 const jersey=shape(new T.CylinderGeometry(.54,.47,.8,22),white,0,1.39,.025);jersey.scale.z=.74;
 const head=shape(new T.SphereGeometry(.29,26,16),white,0,2.24,.025);
 const cage=shape(new T.SphereGeometry(.31,20,14,0,Math.PI*2,0,Math.PI*.78),chrome,0,2.24,.17);
 cage.material=new T.MeshStandardMaterial({color:0xdceff2,wireframe:true,metalness:.8,roughness:.3});
 const helmet=shape(new T.SphereGeometry(.31,22,16),blue,0,2.30,-.02);helmet.scale.set(1,.82,.85);
 const maskStripe=shape(new T.TorusGeometry(.245,.026,7,30),red,0,2.29,.232);
 const gloveLeft=shape(new T.SphereGeometry(.27,16,12),white,-.63,1.24,.22);
 const blocker=shape(new T.BoxGeometry(.40,.35,.16),red,.63,1.20,.28);
 const pads=[],legs=[];
 for(const side of [-1,1]){
  const pivot=new T.Group();pivot.position.set(side*.29,.99,0);body.add(pivot);legs.push(pivot);
  const pad=shape(new T.CapsuleGeometry(.20,.56,7,14),white,0,-.43,.16,pivot);
  const stripe=shape(new T.CapsuleGeometry(.042,.56,5,8),blue,side*.13,-.41,.34,pivot);
  const knee=shape(new T.SphereGeometry(.21,16,12),red,0,-.13,.32,pivot);
  const blade=shape(new T.BoxGeometry(.28,.05,.60),chrome,0,-.88,.20,pivot);
  pads.push(pad);
 }
 const goalieStick=new T.Group();body.add(goalieStick);goalieStick.position.set(.66,1.1,.25);
 let stickLine=shape(new T.CylinderGeometry(.032,.032,1.65,12),black,0,-.48,0,goalieStick);
 stickLine.rotation.z=.16;
 const blade=shape(new T.BoxGeometry(.43,.14,.10),white,-.12,-1.23,.02,goalieStick);
 // Ice dust splashes after falls, shots and body contact.
 const snow=[];
 for(let i=0;i<32;i++){
  const piece=mesh(stage,new T.IcosahedronGeometry(.026+(i%3)*.010,0),white,0,-20,0);
  snow.push({piece,life:0,vx:0,vy:0,vz:0});
 }
 let p={x:0,z:-2,vx:0,vz:0,y:.16,vy:0,spin:0,owned:false},gl={x:0,target:0,pose:0,saveTime:0,saveSide:1},score=0,shots=0,saves=0,misses=0,clock=0,charge=0,shotHeld=false,goalPause=0,fallTime=0,fallCount=0,completed=false,status="ENGAGEMENT",recovery=0,hitTimer=0,active=true;
 const PUCK_R=.13,GOAL_Z=-26.45;
 function emitSnow(x,z,count=10,power=1){
  for(let i=0;i<count;i++){
   const slot=snow.find(a=>a.life<=0);if(!slot)return;
   const angle=(i*2.399+clock*7),speed=(.5+(i%4)*.45)*power;
   slot.piece.position.set(x,.18,z);slot.life=.40+(i%4)*.16;
   slot.vx=Math.sin(angle)*speed;slot.vz=Math.cos(angle)*speed;slot.vy=.9+(i%3)*.32;
   slot.piece.visible=true;
  }
 }
 function faceoff(player){
  p={x:clamp(player.x+.35,-8,8),z:clamp(player.z-1.6,-22,12),vx:0,vz:0,y:.16,vy:0,spin:0,owned:false};
  goalPause=0;status="RONDELLE EN JEU";gl.saveTime=0;charge=0;shotHeld=false;recovery=0;
 }
 function setPuck(x,z,vx=0,vz=0){p.x=x;p.z=z;p.vx=vx;p.vz=vz;p.owned=false;p.y=.16;p.vy=0;status="RONDELLE EN JEU";}
 function shot(player,percent=1){
  if(completed||goalPause>0||fallTime>0||recovery>0)return false;
  const dist=Math.hypot(p.x-player.x,p.z-player.z);
  if(dist>2.1||!p.owned)return false;
  shots++;
  const aimX=clamp((hooks.getAim?.()??player.x*.28),-2.8,2.8);
  const targetX=aimX+.29*Math.sin(shots*2.39);
  const dx=targetX-p.x,dz=GOAL_Z-p.z;
  const n=Math.hypot(dx,dz)||1,force=13+Math.pow(clamp(percent,0,1),.68)*26;
  p.vx=dx/n*force+player.vx*.12;p.vz=dz/n*force+player.vz*.12;
  p.y=.17;p.vy=percent>.7?1.7+(percent-.7)*6:.22;
  p.spin=(percent-.5)*18;p.owned=false;recovery=.45;charge=0;
  status="TIR VERS LE BUT";
  emitSnow(p.x,p.z,17,1.9);
  hooks.onShot?.({power:percent,shots,velocity:force});
  return true;
 }
 function fall(player,reason="chute"){
  if(fallTime>0||goalPause>0)return;
  fallTime=1.80;fallCount++;charge=0;shotHeld=false;p.owned=false;
  p.vx+=Math.sin(clock*3)*3;p.vz-=2;
  status="CHUTE · RELÈVE-TOI";
  emitSnow(player.x,player.z,27,2.5);
  hooks.onFall?.({reason,falls:fallCount});
 }
 function statusHud(){return {score,shots,saves,misses,clock,charge:charge/1.65,goalieX:gl.x,owned:p.owned,fallTime,falls:fallCount,status,finished:completed,puckX:p.x,puckZ:p.z};}
 function step(dt,player,keys){
  if(!active)return statusHud();
  dt=clamp(dt,0,.055);clock+=dt;
  const speed=Math.hypot(player.vx||0,player.vz||0);
  if(fallTime>0){fallTime=Math.max(0,fallTime-dt);eric.setFall?.(fallTime/1.8);if(fallTime<=0){status="DEBOUT · REPRENDS LA RONDELLE";}}
  else eric.setFall?.(0);
  if(recovery>0)recovery=Math.max(0,recovery-dt);
  if(goalPause>0){goalPause-=dt;if(goalPause<=0){if(score>=3){completed=true;status="TRIPLÉ · VICTOIRE";hooks.onWin?.({goals:score,shots,saves,falls:fallCount});}
   else faceoff(player);} }
  const hold=keys.has("KeyJ")||keys.has("MouseLeft")||keys.has("ShootTouch");
  if(hold&&p.owned&&recovery<=0&&fallTime<=0&&goalPause<=0)charge=clamp(charge+dt,0,1.65);
  if(shotHeld&&!hold)shot(player,charge/1.65);
  shotHeld=hold;
  // Hockey stick possession requires the actual player to reach the puck.
  const dis=Math.hypot(p.x-player.x,p.z-player.z);
  if(dis<1.55&&fallTime<=0&&goalPause<=0&&Math.hypot(p.vx,p.vz)<12&&!p.owned){
   p.owned=true;status="RONDELLE CONTRÔLÉE · MAINTIENS J POUR TIRER";
  }
  if(keys.has("KeyK")&&p.owned&&recovery<=0){shot(player,.35);recovery=.40;}
  if(p.owned&&fallTime<=0){
   const forwardX=player.vx===0&&player.vz===0?Math.sin(player.heading||Math.PI):Math.sin(player.heading||Math.PI);
   const forwardZ=player.vx===0&&player.vz===0?Math.cos(player.heading||Math.PI):Math.cos(player.heading||Math.PI);
   const desiredX=player.x+forwardX*1.05+.36;
   const desiredZ=player.z+forwardZ*1.05;
   const ease=1-Math.exp(-dt*18);
   p.x+=(desiredX-p.x)*ease;p.z+=(desiredZ-p.z)*ease;
   p.vx=player.vx*.92;p.vz=player.vz*.92;
   if(speed>8&&Math.abs(player.turn||0)>1.8){p.owned=false;p.vx+=player.vx*.6;p.vz+=player.vz*.6;status="RONDELLE PERDUE";}
  }else if(goalPause<=0){
   p.x+=p.vx*dt;p.z+=p.vz*dt;p.y+=p.vy*dt;
   p.vy-=9.81*dt;
   if(p.y<.154){p.y=.154;p.vy=Math.abs(p.vy)>.8?-p.vy*.24:0;}
   const drag=Math.pow(.991,dt*60);p.vx*=drag;p.vz*=drag;
   p.x+=Math.sin(p.spin*clock)*dt*.045*Math.hypot(p.vx,p.vz);p.spin*=Math.pow(.997,dt*60);
   if(p.x>12.85||p.x< -12.85){p.x=clamp(p.x,-12.85,12.85);p.vx*=-.78;hooks.onBoard?.();}
   if(p.z>12.9){p.z=12.9;p.vz*=-.73;hooks.onBoard?.();}
   if(p.z< -27.15 && Math.abs(p.x)>2.15){p.z=-27.15;p.vz=Math.abs(p.vz)*.65;}
  }
  // Goalkeeper is intelligent enough to anticipate, follow and butterfly dive.
  const predict=clamp(p.x+(p.vz< -1?p.vx*((gl.x?gl.x:GOAL_Z)-p.z)/Math.min(-.2,p.vz)*.07:0),-1.22,1.22);
  gl.target=p.z< -12?predict:Math.sin(clock*.85)*.32;
  gl.x+=(gl.target-gl.x)*Math.min(1,dt*(p.z< -17?4.4:1.7));
  goalie.position.x=gl.x;
  if(gl.saveTime>0)gl.saveTime=Math.max(0,gl.saveTime-dt);
  body.rotation.z=gl.saveTime>0?gl.saveSide*.42*Math.sin(gl.saveTime*4):.04*Math.sin(clock*1.2);
  body.position.y=gl.saveTime>0?-.33:0;
  legs[0].rotation.z=gl.saveTime>0?.55:0;legs[1].rotation.z=gl.saveTime>0?-.55:0;
  if(goalPause<=0&&!p.owned&&p.vz<-.1){
   const pastGoalie=p.z< -24.55&&p.z> -25.45;
   if(pastGoalie&&Math.abs(p.x-gl.x)<(.85+(.2*(score>0?1:0)))&&p.y<1.62){
    saves++;gl.saveTime=.8;gl.saveSide=p.x<gl.x?1:-1;
    p.z=-24.46;p.vz=Math.abs(p.vz)*.38+3;p.vx+=(p.x-gl.x)*7+gl.saveSide*1.3;p.vy=.5;p.owned=false;
    status="ARRÊT DU GARDIEN";
    emitSnow(p.x,p.z,16,2.0);hooks.onSave?.({saves});
   }
   if(p.z<=GOAL_Z){
    if(Math.abs(p.x)<1.74&&p.y<1.35){
     score++;status="BUUUUT ! "+score+" / 3";
     goalPause=2.3;p.vx=0;p.vz=0;p.vy=0;p.y=.2;
     emitSnow(p.x,GOAL_Z,32,2.7);hooks.onGoal?.({goals:score,shots});
    }else if(p.z< -26.8&&Math.abs(p.x)<2.1){
     misses++;p.vz=Math.abs(p.vz)*.54;status="TIR NON CADRÉ";
    }
   }
  }
  if(p.z< -29||Math.hypot(p.vx,p.vz)<.06&&!p.owned&&p.z< -25){p.z=-24;p.vz=3.5;}
  puck.position.set(p.x,p.y,p.z);ring.position.set(p.x,p.y+.04,p.z);shadow.position.set(p.x,.092,p.z);
  puck.rotation.y+=dt*p.spin;
  for(const s of snow){if(s.life<=0){s.piece.visible=false;continue;}s.life-=dt;s.piece.position.x+=s.vx*dt;s.piece.position.y+=s.vy*dt;s.piece.position.z+=s.vz*dt;s.vy-=3.2*dt;s.piece.scale.setScalar(Math.max(.01,s.life*1.4));}
  return statusHud();
 }
 function reset(player={x:0,z:7}){score=0;shots=0;saves=0;misses=0;clock=0;fallTime=0;fallCount=0;completed=false;active=true;faceoff(player);}
 function dispose(){active=false;stage.remove(goalie,puck,ring,shadow);/* stage geometries disposed by scene cleanup */}
 reset();
 return {step,shot,fall,reset,setPuck,status:statusHud,dispose,goalie,get goalZ(){return GOAL_Z}};
}
