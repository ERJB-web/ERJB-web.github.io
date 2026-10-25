/* Exécuté dans l'en-tête, avant tout contenu : ne jamais révéler une vue inachevée. */
(() => {
  const root = document.documentElement;
  // Les salles fermées restent hors mise en page dès le départ (sans effet sur les pages sans salles).
  root.classList.add('js', 'chargement', 'salles');
  let navigation = false, dom = false, revelation = false;
  const preparations = [];
  window.ebQuandPret = () => Promise.all(preparations);
  window.ebAttendre = promise => { preparations.push(promise); promise.catch(() => {}); };
  const lang = (root.lang || 'fr').split('-')[0];
  const messages = {
    fr: ['Chargement…', 'Le chargement prend plus de temps que prévu.', 'Réessayer'],
    en: ['Loading…', 'Loading is taking longer than expected.', 'Retry'],
    es: ['Cargando…', 'La carga está tardando más de lo previsto.', 'Reintentar'],
    zh: ['正在加载…', '加载时间比预期长。', '重试'],
    ar: ['جارٍ التحميل…', 'يستغرق التحميل وقتًا أطول من المتوقع.', 'إعادة المحاولة'],
    ru: ['Загрузка…', 'Загрузка занимает больше времени, чем ожидалось.', 'Повторить']
  }[lang] || ['Chargement…', 'Le chargement prend plus de temps que prévu.', 'Réessayer'];
  root.dataset.chargementMessage = messages[0];
  try {
    const modes = (localStorage.getItem('eb-modes') || '').split(' ');
    const taille = +localStorage.getItem('eb-taille') || 0;
    if (/^#(?:daltonien|colour-blind)$/.test(location.hash)) modes.push('cb');
    if (/^#(?:basse-vision|low-vision)$/.test(location.hash)) modes.push('lv');
    modes.filter(m => /^(cb|lv|hc)$/.test(m)).forEach(m => root.classList.add(m));
    if (taille > 0 && taille < 4) root.classList.add('t' + taille);
  } catch { /* Les préférences restent facultatives si le stockage est indisponible. */ }
  let retard = false;
  const afficherAttente = () => {
    if (!document.body) return;
    let status = document.getElementById('site-chargement');
    if (!status) {
      status = document.createElement('div');
      status.id = 'site-chargement';
      status.setAttribute('role', 'status');
      status.append(document.createElement('p'));
      document.body.append(status);
    }
    status.querySelector('p').textContent = messages[retard ? 1 : 0];
    if (retard && !status.querySelector('button')) {
      const retry = document.createElement('button');
      retry.textContent = messages[2];
      retry.onclick = () => location.reload();
      status.append(retry);
    }
  };
  // Sortie de secours : une préparation facultative ou un script en échec
  // ne doit jamais rendre la totalité du site inaccessible.
  const debloquer = () => {
    document.getElementById('site-chargement')?.remove();
    root.classList.remove('chargement');
    delete root.dataset.chargementMessage;
  };
  const attente = setTimeout(debloquer, 4000);
  const reveler = () => {
    if (!navigation || !dom || revelation) return;
    revelation = true;
    Promise.all(preparations).then(() => document.fonts?.ready).then(() => requestAnimationFrame(() => requestAnimationFrame(() => {
      clearTimeout(attente);
      debloquer();
    }))).catch(() => {
      clearTimeout(attente);
      debloquer();
    });
  };
  document.addEventListener('eb:navigation-prete', () => { navigation = true; reveler(); });
  document.addEventListener('DOMContentLoaded', () => {
    dom = true;
    afficherAttente();
    reveler();
  }, {once:true});
})();
