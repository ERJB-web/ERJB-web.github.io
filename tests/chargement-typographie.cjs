const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {JSDOM} = require('jsdom');
const chargement = fs.readFileSync(path.join(__dirname, '../assets/chargement.js'), 'utf8');
const site = fs.readFileSync(path.join(__dirname, '../assets/site.js'), 'utf8');
assert.match(site, /const groupes = \$\$\("\.porte"\)\.map\(/, 'Le démarrage doit utiliser querySelectorAll');
assert.doesNotMatch(site, /(?<!\$)\$\([^\n]*\)\.(?:map|filter|forEach|reduce|find|some|every|flatMap)\(/, 'Méthode de tableau sur querySelector interdite');


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
      if (stockageRefuse) {
        // Une préparation qui reste en attente ne peut plus cacher le site indéfiniment.
        w.ebAttendre(new Promise(() => {}));
        attente();
        assert(!w.document.documentElement.classList.contains('chargement'), 'Le garde-fou doit révéler le contenu même si une préparation bloque');
      } else {
        w.document.dispatchEvent(new w.Event('eb:navigation-prete'));
        await new Promise(resolve => setTimeout(resolve, 100));
        assert(!w.document.documentElement.classList.contains('chargement'), 'Le chargement ordinaire doit révéler le site');
      }
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
    const dossierDiapos = path.join(root, 'assets', 'these');
    fs.mkdirSync(dossierDiapos, {recursive:true});
    const diapo = path.join(dossierDiapos, 'diapo-methodo-10.svg');
    const figure = '<div data-image="assets/these/diapo-methodo-10.svg?v=ancienne"></div><a href="assets/these/diapo-methodo-10.svg?v=ancienne"><img src="assets/these/diapo-methodo-10.svg?v=ancienne"></a>';
    fs.writeFileSync(diapo, '<svg>anciens objectifs</svg>');
    const avant = versionner(figure, file, root);
    fs.writeFileSync(diapo, '<svg>objectifs actualisés</svg>');
    const apres = versionner(avant, file, root);
    assert.notEqual(apres, avant, 'Une diapositive actualisée ne réutilise pas son ancienne URL');
    const liens = [...apres.matchAll(/(?:data-image|href|src)="([^"]+)"/g)].map(m=>m[1]);
    assert.equal(new Set(liens).size, 1, 'La vignette, le lien agrandi et la source du chapitre partagent la même version');
    assert.equal(versionner(apres, file, root), apres, 'Le versionnement des diapositives est stable');
  } finally {fs.rmSync(root, {recursive:true,force:true});}
  console.log('Chargement normal, garde-fou, stockage refusé et versions des ressources : OK.');
})().catch(e => {console.error(e);process.exitCode=1;});
