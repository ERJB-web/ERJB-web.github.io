const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {JSDOM} = require('jsdom');
const chargement = fs.readFileSync(path.join(__dirname, '../assets/chargement.js'), 'utf8');

(async () => {
  for (const stockageRefuse of [false, true]) {
    const dom = new JSDOM('<html lang="fr"><body><main>Contenu</main></body></html>', {
      runScripts:'outside-only', pretendToBeVisual:true, url:'https://erjb-web.github.io/'
    });
    const w = dom.window;
    try {
      await new Promise(resolve => w.addEventListener('load', resolve, {once:true}));
      if (stockageRefuse) Object.defineProperty(w, 'localStorage', {get(){throw new Error('Stockage refusé');}});
      let attente;
      w.setTimeout = fn => {attente = fn; return 1;};
      w.eval(chargement);
      w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
      assert(w.document.documentElement.classList.contains('chargement'));
      attente();
      assert(w.document.documentElement.classList.contains('chargement'), 'Un chargement lent ne révèle jamais la présentation intermédiaire');
      assert(w.document.querySelector('#site-chargement button'), 'Une erreur de chargement laisse un moyen de réessayer');
      w.document.dispatchEvent(new w.Event('eb:navigation-prete'));
      await new Promise(resolve => setTimeout(resolve, 100));
      assert(!w.document.documentElement.classList.contains('chargement'));
      assert(!w.document.getElementById('site-chargement'));
    } finally {w.close();}
  }
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'versions-site-'));
  try {
    const file = path.join(root, 'index.html'), asset = path.join(root, 'site.js');
    const versionner = require('../outils/versions-ressources');
    const html = '<script src="site.js?v=ancienne"></script>';
    fs.writeFileSync(asset, 'version 1');
    const first = versionner(html, file, root);
    assert.equal(versionner(first, file, root), first, 'Les versions sont stables sans changement');
    fs.writeFileSync(asset, 'version 2');
    assert.notEqual(versionner(html, file, root), first, 'Un script modifié reçoit une URL différente');
  } finally {fs.rmSync(root, {recursive:true,force:true});}
  console.log('Chargement lent, stockage refusé, reprise et versions des ressources : OK.');
})().catch(e => {console.error(e);process.exitCode=1;});
