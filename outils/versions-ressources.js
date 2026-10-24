const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
// Les URL changent avec le contenu réel, pas avec une date saisie à la main.
module.exports = function versionsRessources(html, fichier, racine) {
  return html.replace(/(<[\w:-]+\b[^>]*?\s(?:src|href|data-image)=)(["'])([^"']+)(\2)/gi,
    (match, prefixe, quote, url) => {
      if (/^(?:[a-z]+:|\/\/|#)/i.test(url)) return match;
      const [chemin, requete = ''] = url.split('?');
      const diapositive = /(?:^|\/)assets\/these\/(?:diapos\/)?diapo-(?:methodo-)?\d+\.svg$/.test(chemin);
      if (!/\.(?:css|js|mjs)$/.test(chemin) && !diapositive) return match;
      const cible = chemin.startsWith('/') ? path.join(racine, chemin) : path.resolve(path.dirname(fichier), chemin);
      if (!cible.startsWith(racine + path.sep) || !fs.existsSync(cible)) return match;
      const version = crypto.createHash('sha256').update(fs.readFileSync(cible)).digest('hex').slice(0, 10);
      const params = new URLSearchParams(requete.replace(/&amp;/g, '&'));
      params.set('v', version);
      return `${prefixe}${quote}${chemin}?${params.toString().replace(/&/g, '&amp;')}${quote}`;
    });
};
