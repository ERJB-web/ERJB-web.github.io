const assert = require('node:assert/strict'), fs = require('node:fs');
const { chromium } = require('playwright');
const path = require('node:path'), http = require('node:http');
const root = path.resolve(__dirname, '..');
const server = http.createServer((req, res) => {
  let file = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  fs.readFile(file, (err, data) => { if (err) { res.writeHead(404); res.end(); return; }
    res.setHeader('Content-Type', ({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'})[path.extname(file)] || 'application/octet-stream'); res.end(data); });
});
let base;


(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => {
      const request = route.request();
      return !request.url().startsWith(base) || ['image', 'media', 'font'].includes(request.resourceType())
        ? route.abort() : route.continue();
    });
    const active = '.salle-contenu .gab-chapitre.gab-page-active';
    async function current(slug) {
      await page.locator(active + '[data-gab-slug="' + slug + '"]').waitFor();
    }
    for (const [lang, width] of [['', 1440], ['', 390], ['en/', 1440], ['es/', 390], ['zh/', 1440], ['ar/', 390], ['ru/', 1440], ['iu/', 390], ['innu/', 390]]) {
      await page.setViewportSize({ width, height: 950 });
      await page.goto(base + '/' + lang + '#distinctions', { waitUntil: 'domcontentloaded' });
      await page.locator(active).waitFor();
      const doors = await page.evaluate(() => [...document.querySelectorAll('.porte[data-sections]')].map(door => {
        if (!['engagements','ressources','parcours'].includes(door.dataset.salle)) return [];
        const rooms = door.dataset.sections.split(/\s+/).filter(Boolean);
        return rooms.flatMap(room => {
          const zone = document.querySelector('section.section[data-salle="' + room + '"] > .section-contenu.gab');
          return zone ? [...zone.querySelectorAll('.gab-chapitre')].filter(ch => ch.closest('.gab') === zone).slice(0,1)
            .map(ch => ({ room, slug: ch.dataset.gabSlug })) : [];
        });
      }).filter(chapters => chapters.length));
      for (const chapters of doors) {
        for (const direction of [1, -1]) {
          const start = direction > 0 ? 0 : chapters.length - 1;
          await page.goto(base + '/' + lang + '#' + chapters[start].room + '/' + chapters[start].slug);
          await page.locator('.salle-contenu .gab[data-gab-salle="' + chapters[start].room + '"] .gab-chapitre.gab-page-active').waitFor();
          for (let i = start; i >= 0 && i < chapters.length; i += direction) {
            const target = chapters[i + direction];
            const header = page.locator('.gab-lecture [data-gab-pas="' + direction + '"]');
            const footer = page.locator('.salle-contenu .gab-bas-chapitre:not([hidden]) [data-gab-pas="' + direction + '"]');
            assert.equal(await header.isEnabled(), !!target, lang + ':' + chapters[i].room + ' header');
            assert.equal(await footer.isEnabled(), !!target, lang + ':' + chapters[i].room + ' footer');
            assert.match(await page.locator('.gab-actuel small').innerText(), new RegExp('' + (i + 1) + '.*' + chapters.length));
            if (!target) break;
            // Alterner les commandes du haut et du bas, y compris aux frontières.
            await (i % 2 ? footer : header).click();
            await page.locator(".salle-contenu .gab[data-gab-salle=\"" + target.room + "\"] .gab-chapitre.gab-page-active[data-gab-slug=\"" + target.slug + "\"]").waitFor();
            assert.equal(await page.locator('.salle-contenu .gab').getAttribute('data-gab-salle'), target.room);
          }
        }
      }
      // Régression de la capture : deux sorties, et retour arrière exact.
      await page.goto(base + '/' + lang + '#distinctions');
      await page.locator('.salle-contenu .gab[data-gab-salle="distinctions"] ' + '.gab-chapitre.gab-page-active').waitFor();
      await page.locator('.gab-lecture [data-gab-pas="1"]').click();
      await page.locator('.salle-contenu .gab[data-gab-salle="citoyen"]').waitFor();
      await page.goBack();
      await page.locator('.salle-contenu .gab[data-gab-salle="distinctions"]').waitFor();
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.locator('.salle-contenu .gab[data-gab-salle="distinctions"] .gab-chapitre.gab-page-active').waitFor();
      assert.equal(await page.locator('.gab-lecture [data-gab-pas="-1"]').isEnabled(), true);
      assert.equal(await page.locator('.gab-lecture [data-gab-pas="1"]').isEnabled(), true);
      await page.locator('.gab-lecture [data-gab-pas="tous"]').click();
      assert.equal(await page.locator('.gab-programme-porte .gab-tuile').count(), 5);
      await page.locator('.gab-programme-porte .gab-tuile').nth(1).click();
      await page.locator('.salle-contenu .gab[data-gab-salle="communaute"] .gab-chapitre.gab-page-active').waitFor();
      await page.goto(base + '/' + lang + '#recherche/methodes');
      await page.locator('.salle-contenu .gab-chapitre[data-rubrique="methodes"]:visible').waitFor();
      await page.locator('.gab-lecture [data-gab-pas="1"]').click();
      await page.locator('.salle-contenu .gab-chapitre[data-rubrique="faisabilite"]:visible').waitFor();
      assert.match(await page.locator('.gab-actuel small').innerText(), /4.*6/);
      await page.goto(base + '/' + lang + '#distinctions');
      await page.locator('.salle-contenu .gab[data-gab-salle="distinctions"] .gab-chapitre.gab-page-active').waitFor();
      if (!lang) await page.screenshot({ path: require('node:path').join(require('node:os').tmpdir(), 'portes-corrigees-' + width + '.png') });
      console.log('PASS', lang || 'fr', width, doors.length, 'portes, aller/retour, commandes haut/bas, historique, rechargement');
    }
    assert.deepEqual(errors, []);
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
