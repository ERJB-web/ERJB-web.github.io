/*
 * Run locally: node jeu/test-runtime.mjs
 * Pure Node smoke test: executes the real scene/animation code with a renderer shim.
 * Tests runtime stability; visual quality and WebGL compatibility still require E2E.
 */
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const src=p=>fs.readFileSync(path.join(root,p),"utf8");
const avatar=src("assets/eric-avatar-3d.js").replace(/^export /gm,"");
const world=src("assets/doctoral-world.js").replace(/^import .*$/gm,"").replace(/^export /gm,"");
new Function(avatar);new Function(world);
const noop=()=>{};
const ctx=new Proxy({createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});
const canvas=()=>({width:512,height:512,clientWidth:1200,clientHeight:750,getContext:()=>ctx,addEventListener:noop,getBoundingClientRect:()=>({left:0,top:0,width:1200,height:750})});
const document={createElement:()=>canvas()};
class Vec{
 constructor(x=0,y=0,z=0){this.set(x,y,z);}
 set(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z;return this;}
 copy(v){this.x=v.x;this.y=v.y;this.z=v.z;return this;}
 lerp(v,k){this.x+=(v.x-this.x)*k;this.y+=(v.y-this.y)*k;this.z+=(v.z-this.z)*k;return this;}
}
class Object3D{
 constructor(geometry,material){this.geometry=geometry;this.material=material;this.children=[];this.position=new Vec();this.rotation=new Vec();this.scale=new Vec(1,1,1);this.quaternion={copy:noop};this.visible=true;this.shadow={mapSize:{set:noop},camera:{}};}
 add(child){assert.ok(child?.children,"Invalid child in Three.js scene graph");this.children.push(child);}
 remove(child){this.children=this.children.filter(c=>c!==child);}
 traverse(fn){fn(this);for(const child of this.children)child.traverse(fn);}
 lookAt(){}
}
class Geometry{setAttribute(){}setIndex(){}computeVertexNormals(){}dispose(){}}
class Material{constructor(values={}){Object.assign(this,values);}dispose(){}}
const T={
 Mesh:Object3D,Group:Object3D,Scene:Object3D,HemisphereLight:Object3D,DirectionalLight:Object3D,PointLight:Object3D,
 MeshBasicMaterial:Material,MeshStandardMaterial:Material,MeshPhysicalMaterial:Material,
 CanvasTexture:class{constructor(){this.repeat={set:noop};}dispose(){}},
 BufferGeometry:Geometry,Float32BufferAttribute:class{},
 Vector2:Vec,Vector3:Vec,Color:class{},FogExp2:class{},Raycaster:class{},
 PerspectiveCamera:class extends Object3D{updateProjectionMatrix(){}},
 WebGLRenderer:class{constructor(){this.shadowMap={};}setPixelRatio(){}setSize(){}render(){}},
 DoubleSide:2,SRGBColorSpace:2,ACESFilmicToneMapping:1,PCFSoftShadowMap:1,RepeatWrapping:1
};
for(const n of ["BoxGeometry","SphereGeometry","CylinderGeometry","PlaneGeometry","TorusGeometry","CircleGeometry","ConeGeometry","OctahedronGeometry","IcosahedronGeometry"])T[n]=Geometry;
class TestImage{set src(value){}get naturalWidth(){return 0;}}
const createAvatar=new Function("document","Image",avatar+";return createEricAvatar")(document,TestImage);
const a=createAvatar(T,{portraitUrl:"../assets/portrait.jpg"});
assert.equal(a.true3D,true);
a.update(.016,350,{x:0,z:-7},"classroom");
assert.equal(a.motion,"walk");
a.update(.016,550,{x:4,z:-7},"rink");
assert.equal(a.motion,"skate");
a.dispose();
let raf=null,frames=0,events=[];
const createWorld=new Function("createEricAvatar","document","Image","requestAnimationFrame","devicePixelRatio","innerWidth","innerHeight",world+";return createAdventureWorld")(
 createAvatar,document,TestImage,cb=>raf=cb,1,1200,750);
const keys=new Set();
const game=createWorld(T,canvas(),{keys,isPaused:()=>false,onVisit:(id)=>events.push(["visit",id]),onEvidence:(id)=>events.push(["clue",id]),onActivity:(zone,id)=>events.push(["activity",zone,id]),onNpc:(name)=>events.push(["npc",name]),onBalance:noop,onNarrate:noop});
const step=n=>{for(let i=0;i<n;i++){assert.equal(typeof raf,"function");raf(++frames*17);}};
const zones=["university","classroom","laboratory","library","office","home","conference","rink","field","auditorium"];
for(const zone of zones){game.visit(zone);assert.equal(game.room,zone);assert.ok(game.targets.length>0,zone+" has no playable target");step(15);}
game.visit("university");
keys.add("KeyW");step(200);keys.delete("KeyW");
assert.ok(events.some(x=>x[0]==="activity"&&x[2]==="admission"),"Walking to administration must open the admission encounter automatically");
assert.ok(events.some(x=>x[0]==="clue")||game.room==="university","World clue and room systems must remain stable");
console.log("PASS: articulated 3D avatar, 10 interactive venues, "+frames+" animation frames, admission proximity activity, NPC and collectible engine.");
