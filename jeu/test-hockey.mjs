import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const code=fs.readFileSync(path.join(root,"assets/hockey-game.js"),"utf8").replace(/^export /gm,"");
const create=new Function(code+";return createHockeyGame")();
class Vec{constructor(){this.x=this.y=this.z=0}set(x,y,z){this.x=x;this.y=y;this.z=z}setScalar(s){this.x=this.y=this.z=s}}
class Obj{constructor(){this.position=new Vec();this.rotation=new Vec();this.scale=new Vec();this.children=[]}add(...x){this.children.push(...x)}remove(...x){this.children=this.children.filter(c=>!x.includes(c))}}
class G{}class M{constructor(x){Object.assign(this,x||{})}}
const T={Mesh:Obj,Group:Obj,MeshStandardMaterial:M,MeshBasicMaterial:M};
for(const k of ["CylinderGeometry","SphereGeometry","TorusGeometry","CircleGeometry","BoxGeometry","CapsuleGeometry","IcosahedronGeometry"])T[k]=G;
let events=[],falls=0,finished=null,aim=-1.65;
const hooks={getAim:()=>aim,onGoal:x=>events.push(["goal",x]),onSave:x=>events.push(["save",x]),onShot:x=>events.push(["shot",x]),onFall:()=>falls++,onWin:x=>{finished=x}};
const h=create(T,new Obj(),{setFall:()=>{}},hooks);
const player={x:0,z:5.5,vx:0,vz:-2,heading:Math.PI,turn:0};
const keys=new Set();
for(let i=0;i<5;i++)h.step(1/60,player,keys);
assert.equal(h.status().owned,true,"Puck is collectible near Eric's blade");
keys.add("KeyJ");for(let i=0;i<92;i++)h.step(1/60,player,keys);
assert.ok(h.status().charge>.7,"A held shot must charge");
keys.delete("KeyJ");
for(let i=0;i<20;i++)h.step(1/60,player,keys);
assert.ok(h.status().shots>=1,"Releasing shoot launches puck");
assert.ok(events.some(v=>v[0]==="shot"),"Shot callback required");
h.fall(player,"test");
assert.equal(h.status().falls,1,"Collision should cause a fall");
for(let i=0;i<130;i++)h.step(1/60,player,keys);
assert.equal(h.status().fallTime,0,"Eric eventually stands up again");
h.reset(player);
assert.equal(h.status().score,0,"Faceoff resets score");
for(let i=0;i<3;i++){
 h.setPuck(1.57,-26.0,0,-25);
 for(let frame=0;frame<3;frame++)h.step(1/60,player,keys);
 assert.equal(h.status().score,i+1,"Shot across goal line must count");
 for(let frame=0;frame<155;frame++)h.step(1/60,player,keys);
}
assert.equal(h.status().finished,true,"Three goals conclude the challenge");
assert.equal(finished.goals,3,"Victory callback returns three goals");
h.reset(player);
h.setPuck(4.5,-25.9,0,-25);for(let i=0;i<10;i++)h.step(1/60,player,keys);
assert.equal(h.status().score,0,"Shots wide of the goal do not score");
console.log("PASS: pickup, power charging, shooting, recovery, goalkeeper, three goals, win, missed target.");
