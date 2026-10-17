import { h, icone, lettre } from '../noyau.js?v=63f5f7cb13';
import { indexCorrecte, texteReponse, scoreQuestions } from '../calculs.js?v=63f5f7cb13';

export function panneauQuestions(questions, coque, { surComplet } = {}) {
  const choix = new Array(questions.length).fill(null);
  let corrige = false;
  const el = h('div', { class: 'dfx-questions' });
  if (!questions.length) el.append(h('p', { class: 'dfx-aide', text: 'Aucune question : explore librement.' }));
  const champs = questions.map((q, i) => {
    const reps = Array.isArray(q.reponses) ? q.reponses : [];
    const nom = `${coque.id}-q${i}`;
    const options = reps.map((r, k) => {
      const inp = h('input', { type: 'radio', name: nom, value: String(k) });
      inp.addEventListener('change', () => {
        if (corrige) return;
        choix[i] = k;
        coque.jouer('clic');
        fs.classList.add('dfx-question--repondue');
        surComplet?.(choix.every((c) => c != null));
      });
      return h('label', { class: 'dfx-question-option' }, inp,
        h('span', { class: 'dfx-question-lettre', brut: lettre(k) }),
        h('span', { class: 'dfx-question-texte', text: texteReponse(r) }),
        h('span', { class: 'dfx-question-marque', 'aria-hidden': 'true' }));
    });
    const fs = h('fieldset', { class: 'dfx-question' },
      h('legend', {}, h('span', { class: 'dfx-question-num', brut: String(i + 1) }), h('span', { text: String(q.texte ?? '') })),
      options);
    el.append(fs);
    return { fs, options, q };
  });
  surComplet?.(questions.length === 0);

  return {
    el,
    choix,
    corriger() {
      corrige = true;
      champs.forEach(({ fs, options, q }, i) => {
        const bonnes = indexCorrecte(q);
        options.forEach((lab, k) => {
          lab.querySelector('input').disabled = true;
          const marque = lab.querySelector('.dfx-question-marque');
          if (bonnes.has(k)) { lab.classList.add('dfx-question-option--bonne'); marque.append(icone('valider')); }
          else if (choix[i] === k) { lab.classList.add('dfx-question-option--fausse'); marque.append(icone('fermer')); }
        });
        fs.classList.add(bonnes.has(choix[i]) ? 'dfx-question--juste' : 'dfx-question--fausse');
        const expl = q.explication || q.retour;
        if (expl) fs.append(h('p', { class: 'dfx-question-expl', text: String(expl) }));
      });
      return { ...scoreQuestions(choix, questions), choix: choix.slice() };
    },
    rendreCorrection(zone) {
      if (!questions.length) return;
      zone.append(h('h4', { class: 'dfx-correction-titre', text: 'Tes réponses' }));
      const liste = h('ul', { class: 'dfx-liste-correction' });
      questions.forEach((q, i) => {
        const bonnes = indexCorrecte(q);
        const reps = Array.isArray(q.reponses) ? q.reponses : [];
        const ok = bonnes.has(choix[i]);
        const bonnesTxt = [...bonnes].map((k) => texteReponse(reps[k])).join(' ou ');
        liste.append(h('li', { class: `dfx-ligne-correction ${ok ? 'dfx-ok' : 'dfx-ko'}` },
          h('span', { class: 'dfx-ligne-ico' }, icone(ok ? 'valider' : 'fermer')),
          h('div', {},
            h('p', { class: 'dfx-ligne-titre', text: String(q.texte ?? '') }),
            h('p', { class: 'dfx-ligne-meta', text: ok ? `Ta réponse : ${texteReponse(reps[choix[i]])}` : `Ta réponse : ${choix[i] == null ? 'aucune' : texteReponse(reps[choix[i]])} · Bonne réponse : ${bonnesTxt || '—'}` }),
            q.explication || q.retour ? h('p', { class: 'dfx-ligne-explication', text: String(q.explication || q.retour) }) : null)));
      });
      zone.append(liste);
    },
  };
}
