export function initUI({ bus, etat, racine }) {
  racine.innerHTML = `
  <style>
    .s-ecran{position:fixed;inset:0;display:none;align-items:center;justify-content:center;flex-direction:column;gap:14px;color:#F6F4F1;font:16px/1.5 Lato,system-ui,sans-serif;background:linear-gradient(180deg,rgba(13,42,58,.2),rgba(13,42,58,.85))}
    .s-ecran.on{display:flex}
    .s-ecran h1{font-weight:900;letter-spacing:.32em;font-size:clamp(28px,5vw,64px);margin:0}
    .s-ecran button{font:inherit;padding:12px 26px;border-radius:999px;border:1px solid rgba(255,255,255,.35);background:#0755AD;color:#fff;cursor:pointer;min-width:240px}
    .s-hud{position:fixed;left:18px;top:16px;color:#F6F4F1;font:14px Lato,system-ui,sans-serif;text-shadow:0 1px 3px #000;display:none;max-width:40ch}
    .s-hud.on{display:block}
    .s-st{position:fixed;left:50%;bottom:9vh;transform:translateX(-50%);max-width:70ch;text-align:center;color:#fff;font:18px/1.45 Lato,system-ui,sans-serif;text-shadow:0 2px 4px #000;display:none}
    .s-st b{display:block;font-size:12px;letter-spacing:.2em;text-transform:uppercase}
    .s-inv{position:fixed;left:50%;bottom:22vh;transform:translateX(-50%);color:#fff;font:14px Lato,system-ui;background:rgba(13,42,58,.7);padding:6px 14px;border-radius:999px;display:none}
    .s-choix{position:fixed;left:50%;bottom:20vh;transform:translateX(-50%);display:none;flex-direction:column;gap:8px}
    .s-choix button{font:15px Lato,system-ui;padding:10px 18px;border-radius:10px;border:1px solid #11A7A5;background:rgba(13,42,58,.85);color:#fff;cursor:pointer}
    .s-toast{position:fixed;right:18px;top:16px;color:#fff;font:14px Lato,system-ui;background:rgba(7,85,173,.85);padding:8px 14px;border-radius:8px;display:none}
  </style>
  <div class="s-ecran" data-e="titre"><h1>PROTOCOLE</h1><p>La thèse d’Éric</p><button data-a="nouvelle">Nouvelle partie</button><button data-a="continuer">Continuer</button></div>
  <div class="s-ecran" data-e="chargement"><p>Chargement… <span class="s-pc">0</span> %</p></div>
  <div class="s-ecran" data-e="pause"><h1>PAUSE</h1><button data-a="reprendre">Reprendre</button><button data-a="quitter">Menu principal</button></div>
  <div class="s-ecran" data-e="fin"><h1>FIN</h1><p class="s-issue"></p><button data-a="quitter">Menu principal</button></div>
  <div class="s-hud"></div><div class="s-st"></div><div class="s-inv"></div><div class="s-choix"></div><div class="s-toast"></div>`;
  const q = (s) => racine.querySelector(s);
  const ecrans = racine.querySelectorAll('.s-ecran');
  function montrer(nom) {
    ecrans.forEach((e) => e.classList.toggle('on', e.dataset.e === nom));
    q('.s-hud').classList.toggle('on', nom === 'jeu' || nom === 'dialogue');
  }
  racine.addEventListener('click', (e) => {
    const a = e.target.closest('[data-a]')?.dataset.a;
    if (!a) return;
    if (a === 'nouvelle') bus.emit('partie:nouvelle');
    if (a === 'continuer') bus.emit(etat.existeSauvegarde ? 'partie:continuer' : 'partie:nouvelle');
    if (a === 'reprendre') bus.emit('reprendre');
    if (a === 'quitter') bus.emit('quitter');
  });
  bus.on('ecran', ({ nom, issue }) => { if (nom === 'journal' || nom === 'carte') return; montrer(nom === 'dialogue' || nom === 'defi' ? 'jeu' : nom); if (issue) q('.s-issue').textContent = issue; });
  bus.on('chargement', ({ progression }) => { q('.s-pc').textContent = Math.round((progression || 0) * 100); });
  bus.on('hud', (h) => { q('.s-hud').textContent = `${h.objectif || ''} · ${h.semaines} sem. · pression ${Math.round(h.pression)}`; });
  bus.on('sousTitre', (s) => { const el = q('.s-st'); if (!s) { el.style.display = 'none'; return; } el.innerHTML = `<b style="color:${s.couleur}">${s.nom}</b>${s.texte}`; el.style.display = 'block'; });
  bus.on('invite', (i) => { const el = q('.s-inv'); el.style.display = i ? 'block' : 'none'; if (i) el.textContent = `${i.touche ? i.touche + ' — ' : ''}${i.texte}`; });
  bus.on('dialogue:choix', ({ options }) => {
    const el = q('.s-choix');
    el.innerHTML = options.map((o, i) => `<button data-i="${i}">${o}</button>`).join('');
    el.style.display = 'flex';
    el.onclick = (e) => { const b = e.target.closest('button'); if (!b) return; el.style.display = 'none'; bus.emit('dialogue:reponse', { index: Number(b.dataset.i) }); };
  });
  let t = null;
  bus.on('toast', ({ texte }) => { const el = q('.s-toast'); el.textContent = texte; el.style.display = 'block'; clearTimeout(t); t = setTimeout(() => { el.style.display = 'none'; }, 3500); });
  return {};
}
