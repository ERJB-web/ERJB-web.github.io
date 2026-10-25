/**
 * Automated smoke tests for the actual page markup, including the cloned hall room.
 * Run: npm install --no-save jsdom@26 && node tests/vulgarisation-smoke.mjs
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';

const html=fs.readFileSync('index.html','utf8');
const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://erjb-web.github.io/'});
const {document,Event}=dom.window;
const run=file=>dom.window.eval(fs.readFileSync(file,'utf8'));
run('assets/vulgarisation-studio.js');
run('assets/vulgarisation-editorial.js');

const original=document.querySelector('#vulgarisation .section-contenu');
assert(original,'Source vulgarisation section found');
const room=document.querySelector('.salle-contenu');
assert(room,'Hall dialog content container found');
room.replaceChildren(original.cloneNode(true));
// MutationObserver callbacks are invoked in a microtask, as they are in browsers.
await new Promise(resolve=>setTimeout(resolve,20));

const root=room.querySelector('.section-corps.vulgarisation');
assert(root,'Cloned vulgarisation section found');
const find=s=>root.querySelector(s);
assert(find('.vs-hero'), 'Photographic hero created');
assert(find('.ve-gallery-grid img'), 'Photo gallery created');
assert(find('.vs-quiz-action'), 'Quiz control created inside cloned room');

const range=find('#vs-risk-range');
assert(range,'Risk slider available in clone');
range.value='36';
range.dispatchEvent(new Event('input',{bubbles:true}));
assert.match(find('#vs-risk-count').textContent,/36/,'Risk slider updates its numeric value');
assert.match(find('#vs-table-percent').textContent,/36/,'Risk slider updates the table');
assert.equal(find('.vs-chart-point-b').getAttribute('cx'),String(160+36*6.2),'Risk slider updates SVG chart');

const firstSlide=find('#vs-slide-title').textContent;
find('.vs-stage-next').click();
assert.notEqual(find('#vs-slide-title').textContent,firstSlide,'Carousel advances inside the clone');
find('.vs-stage-prev').click();
assert.equal(find('#vs-slide-title').textContent,firstSlide,'Carousel moves backwards');

let radio=find('.vs-quiz-options input[value="1"]');
assert(radio,'First question has its answer inputs');
radio.click();
find('.vs-quiz-action').click();
assert.equal(find('.vs-quiz-feedback').hidden,false,'Answer triggers corrected feedback');
assert.match(find('.vs-quiz-feedback').textContent,/Bonne réponse/,'Correct answer is scored');
find('.vs-quiz-action').click();
assert.match(find('.vs-quiz-step').textContent,/2\s*\/\s*8/,'Quiz continues to second of eight questions');

const chosen=find('[data-ve-episode="2"]');
assert(chosen,'Third verified Québec video exists');
chosen.click();
assert.match(find('.ve-active-title').textContent,/Tiques/,'Selecting a video updates the video title');
find('.ve-play').click();
assert.match(find('.ve-player iframe').getAttribute('src'),/u9zss0S65Iw/,'Verified YouTube video loads after explicit click');
assert.equal(find('.ve-player iframe').getAttribute('src').includes('youtube-nocookie.com'),true,'Privacy-friendly YouTube domain');

find('.ve-load-podcast').click();
assert.match(find('.ve-audio-embed iframe').getAttribute('src'),/30rqlyFNEeDNJCVd9OcxNh/,'Real Québec podcast embed loads after consent');

find('[data-jargon="1"]').click();
assert.match(find('.ve-jargon-after').textContent,/20.*10/,'Plain-language comparison updates');

room.replaceChildren();
room.replaceChildren(original.cloneNode(true));
await new Promise(resolve=>setTimeout(resolve,20));
assert(room.querySelector('.vs-quiz-action'),'Quiz is remounted when room opens a second time');
const replay=room.querySelector('.vs-quiz-options input[value="1"]');
replay.click();
room.querySelector('.vs-quiz-action').click();
assert.equal(room.querySelector('.vs-quiz-feedback').hidden,false,'Quiz works after reopening');

dom.window.close();
console.log('OK: full-page clone, quiz, slide show, SVG data, authentic videos, podcast and jargon interactions.');
