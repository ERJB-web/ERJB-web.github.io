/**
 * Browser visual smoke test. Run: python3 -m http.server 8080 &
 *                        node jeu/test-browser.mjs
 * Requires Playwright and Chromium. Headless WebGL uses SwiftShader.
 */
import assert from "node:assert/strict";
import {chromium} from "playwright";
const browser=await chromium.launch({
 headless:true,
 args:["--no-sandbox","--enable-webgl","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"]
});
const page=await browser.newPage({viewport:{width:1512,height:920},deviceScaleFactor:1});
const errors=[],assetErrors=[];
page.on("pageerror",e=>errors.push(e.message));
page.on("requestfailed",r=>assetErrors.push(r.url()+" — "+(r.failure()?.errorText||"failed")));
try{
 await page.goto("http://127.0.0.1:8080/jeu/carriere.html",{waitUntil:"domcontentloaded",timeout:30000});
 await page.waitForSelector("#scene3d",{state:"visible"});
 await page.click("#startBtn",{timeout:15000});
 const rendering=await page.evaluate(()=>{
  const c=document.querySelector("#scene3d");
  return {width:c.width,height:c.height,webgl:!!(c.getContext("webgl2")||c.getContext("webgl"))};
 });
 assert.ok(rendering.width>500&&rendering.height>250&&rendering.webgl,
  "A WebGL scene must start on desktop");
 await page.waitForSelector('#career[data-human-model="loaded"]',{timeout:45000});
 await page.click("#placesToggle");
 await page.click('[data-world="classroom"]');
 await page.waitForSelector('#career[data-environment="classroom"]',{timeout:30000});
 await page.keyboard.down("w");await page.waitForTimeout(700);await page.keyboard.up("w");
 const result=await page.evaluate(()=>({
  actor:document.querySelector("#career")?.getAttribute("data-human-model"),
  room:document.querySelector("#career")?.getAttribute("data-environment"),
  place:document.querySelector("#stationLabel")?.textContent,
  vrButton:!!document.getElementById("xrModeBtn"),
  missions:document.querySelectorAll(".mission-card").length,
  canvas:[document.querySelector("#scene3d").width,document.querySelector("#scene3d").height]
 }));
 console.log("BROWSER RENDER: "+JSON.stringify(result));
 assert.equal(result.actor,"loaded");
 assert.equal(result.room,"classroom");
 assert.ok(result.vrButton,"WebXR entry must exist");
 assert.ok(result.missions>0,"Playthrough must show available missions");
 await page.screenshot({path:"jeu/browser-game-smoke.png",fullPage:true});
 if(errors.length)throw Error("Browser page errors: "+errors.join(" | "));
 console.log("PASS: WebGL scene, rigged human, CC0 location, movement, WebXR entry and mission UI.");
} catch(error){
 console.error("BROWSER FAILURE",error.message);
 console.error("PAGE ERRORS",errors.slice(0,14));
 console.error("FAILED ASSETS",assetErrors.slice(0,14));
 await page.screenshot({path:"jeu/browser-game-smoke.png",fullPage:true}).catch(()=>{});
 process.exitCode=1;
}finally{await browser.close();}
