const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {modules}=require('../outils/cadres-pedagogiques');
(async()=>{const browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:1360,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:8780/implantation/mobilisation.html');await page.waitForSelector('.cp-plan p');
assert.equal(await page.locator('.cp-module').count(),5);
await page.locator('[data-cp-start]').click();
for(let i=0;i<5;i++){const m=page.locator(`[data-cp-module="${i}"]`);await m.evaluate(el=>el.open=true);for(let j=0;j<modules[i].steps.length;j++){await m.locator(`[data-cp-step="${j}"]`).click();assert.equal(await m.locator('.cp-step-content h5').textContent(),modules[i].steps[j][1]);}await m.locator(`[data-cp-answer="${(modules[i].challenge[2]+1)%3}"]`).click();assert.match(await m.locator('.cp-feedback').textContent(),/Réessayez/);await m.locator(`[data-cp-answer="${modules[i].challenge[2]}"]`).click();}
assert.equal(await page.locator('progress').evaluate(el=>el.value),5);
await page.locator('[data-cp-goal]').selectOption('decision');await page.locator('[data-cp-partners]').selectOption('ensemble');assert.match(await page.locator('.cp-plan').textContent(),/différences de pouvoir/);
const downloadPromise=page.waitForEvent('download');await page.locator('[data-cp-export]').click();const download=await downloadPromise;assert.equal(download.suggestedFilename(),'ma-piste-mobilisation.txt');const downloadPath=await download.path();assert.match(fs.readFileSync(downloadPath,'utf8'),/Éclairer une décision collective/);
// First answer is wrong; a second click must never inflate the score.
await page.locator('[data-cp-quiz-answer="0"]').click();await page.locator('[data-cp-quiz-answer="1"]').click();assert.equal(await page.locator('[data-cp-score]').textContent(),'0 bonne réponse');await page.locator('[data-cp-reset]').click();
const answers=[1,2,1,0,1,1,2,0];for(let i=0;i<8;i++){await page.locator(`[data-cp-quiz-answer="${answers[i]}"]`).click();await page.locator('[data-cp-qnext]').click();}assert.equal(await page.locator('.cp-result-score').textContent(),'8 / 8');assert.equal(await page.locator('.cp-review').count(),8);
await page.locator('[data-cp-reset]').click();assert.match(await page.locator('[data-cp-qcount]').textContent(),/1 \/ 8/);
await page.locator('.cp-module').evaluateAll(els=>els.forEach(el=>el.open=false));await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'../cadres-desktop.png',fullPage:true});
for(const width of [320,390,768]){await page.setViewportSize({width,height:844});await page.locator('[data-cp-start]').click();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`No overflow at ${width}px`);if(width===390)await page.screenshot({path:'../cadres-mobile.png',fullPage:true});}
assert.deepEqual(errors,[],'Standalone course has no JavaScript errors');
// Integration: same data and listeners must survive the site's cloned room model.
await page.setViewportSize({width:1360,height:1000});await page.goto('http://127.0.0.1:8780/index.html');await page.waitForSelector('.cp-data',{state:'attached'});assert.equal(await page.locator('.cp').count(),1);await page.evaluate(()=>{const cp=document.querySelector('.cp').cloneNode(true);const room=document.createElement('div');room.id='cp-test-clone';room.append(cp);document.body.append(room);});const clone=page.locator('#cp-test-clone');await clone.locator('[data-cp-start]').click();await clone.locator('[data-cp-module="0"] [data-cp-step="1"]').click();assert.match(await clone.locator('[data-cp-module="0"] .cp-step-content h5').textContent(),/personnes/);await clone.locator('[data-cp-quiz-answer="1"]').click();assert.match(await clone.locator('.cp-qfeedback').textContent(),/Bonne réponse/);
const integrationErrors=[...errors];errors.length=0;
const baseline=require('node:child_process').execFileSync('git',['show','HEAD:index.html'],{encoding:'utf8',maxBuffer:4e6});await page.route('**/index.html',route=>route.fulfill({contentType:'text/html',body:baseline}));await page.goto('http://127.0.0.1:8780/index.html');await page.waitForTimeout(900);assert.deepEqual(integrationErrors,errors,'No new JavaScript errors compared with the published site');console.log('PASS: 5 cadres, 23 repères, défis, 8 questions, score, reprise, plan exporté, 3 tailles mobiles et intégration clonée. Erreurs JavaScript : '+JSON.stringify(errors));await browser.close();})().catch(e=>{console.error(e);process.exit(1)});


