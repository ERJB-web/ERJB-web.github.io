// Run from repository root: node jeu/verifier-carriere.mjs
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
import vm from "node:vm";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const txt=read("assets/doctoral-life-data.js").replace(/^export /gm,"");
const data=vm.runInNewContext(txt+"\n({milestones,methodology,initialCareerState,availableMilestones,assessDesign,checkDefense})");
const {milestones,methodology,initialCareerState,assessDesign,checkDefense}=data;
assert.equal(milestones.length,120,"120 distinct missions");
const ids=new Set(milestones.map(t=>t.id));assert.equal(ids.size,120,"unique milestone IDs");
for(const t of milestones){
 assert.ok(t.id&&t.title&&t.station&&t.kind,"each step has an ID, title, place and activity");
 assert.ok(t.year>=1&&t.year<=4,"each step has a year");
 for(const req of t.requires)assert.ok(ids.has(req),"missing prerequisite "+t.id+" -> "+req);
}
const by=new Map(milestones.map(t=>[t.id,t])),visited=new Set(),stack=new Set();
function cycle(id){
 assert.ok(!stack.has(id),"dependency cycle at "+id);
 if(visited.has(id))return;stack.add(id);for(const dep of by.get(id).requires)cycle(dep);
 stack.delete(id);visited.add(id);
}
for(const id of ids)cycle(id);
assert.equal(methodology.families.reduce((sum,f)=>sum+f.designs.length,0),40,"40 research designs");
function closure(id,set){if(set.has(id))return;set.add(id);for(const dep of by.get(id).requires)closure(dep,set);}
const required=new Set();for(const id of ["deposit","article1Submit","article2Submit","article3Submit","supervision","comprehensiveExam"])closure(id,required);
const weeks=[...required].reduce((sum,id)=>sum+by.get(id).weeks,0);
assert.ok(weeks<=208,"the minimum full journal-based path fits within 4 simulated years");
const valid=initialCareerState();valid.completed=[...required];valid.week=weeks;
Object.assign(valid,{rigor:81,trust:63,proof:19,articles:3,novelty:true,access:true,approved:true,stress:30,energy:55});
assert.equal(checkDefense(valid).ready,true,"an adequately defended article-based route must pass");
const noArticles={...valid,articles:0};
assert.equal(checkDefense(noArticles).ready,false,"missing manuscripts must block article-based thesis");
const monograph={...valid,format:"Monographie",programArticlesRequired:false,articles:0};
assert.equal(checkDefense(monograph).ready,true,"monograph must remain possible in programs permitting it");
const invalid={...valid,objectives:6};
assert.equal(checkDefense(invalid).ready,false,"unmanageable number of objectives must affect the jury");
const badDirection={...valid,trust:12};
assert.equal(checkDefense(badDirection).ready,false,"lack of supervisory agreement must matter");
const weakNovelty={...valid,novelty:false};
assert.equal(checkDefense(weakNovelty).ready,false,"previously treated / unoriginal study must fail");
const unethical={...valid,approved:false};
assert.equal(checkDefense(unethical).ready,false,"unapproved ethics must fail");
const badTime={...valid,week:211};
assert.equal(checkDefense(badTime).ready,false,"a four-year deadline overrun needs approval");
const family=methodology.families.find(f=>f.id==="quant");
assert.ok(family.designs.includes("cohorte prospective")&&family.designs.includes("cas-témoins")&&family.designs.includes("essai randomisé contrôlé"),"biostatistical / epidemiological designs");
assert.ok(methodology.families.some(f=>f.id==="qual")&&methodology.families.some(f=>f.id==="mixed"),"qualitative and mixed paths");
for(const file of ["assets/doctoral-life-game.js","assets/doctoral-life-challenges.js","assets/doctoral-life.css","jeu/carriere.html","assets/personnage-hall.png"])assert.ok(fs.existsSync(path.join(root,file)),"missing live asset "+file);
for(const file of ["assets/doctoral-life-data.js","assets/doctoral-life-challenges.js","assets/doctoral-life-game.js"]){let source=read(file).replace(/^import .*$/gm,"").replace(/^export /gm,"");new (await import("node:vm")).Script("(async()=>{\n"+source+"\n})();");}
console.log("OK: 120 connected stages, 40 designs, 4-year routes, scientific and ethical gatekeeping, script syntax and assets.");
