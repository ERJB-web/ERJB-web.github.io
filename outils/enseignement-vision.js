"use strict";
// Projet pédagogique : expériences publiées conservées, propositions distinguées des pratiques documentées.
module.exports = {
  references: {
  "biesta": {
    "court": "Biesta (2009)",
    "citation": "Biesta, G. (2009). Good education in an age of measurement: On the need to reconnect with the question of purpose in education. Educational Assessment, Evaluation and Accountability, 21, 33–46.",
    "href": "https://doi.org/10.1007/s11092-008-9064-9"
  },
  "freire": {
    "court": "Freire (2018)",
    "citation": "Freire, P. (2018). Pedagogy of the oppressed (M. B. Ramos, Trans.; 50th anniversary ed.). Bloomsbury Academic.",
    "href": "https://www.bloomsbury.com/us/pedagogy-of-the-oppressed-9781501314162/"
  },
  "hooks": {
    "court": "hooks (1994)",
    "citation": "hooks, b. (1994). Teaching to transgress: Education as the practice of freedom. Routledge.",
    "href": "https://doi.org/10.4324/9780203700280"
  },
  "ripph": {
    "court": "RIPPH · MDH-PPH",
    "citation": "Réseau international sur le Processus de production du handicap. (s. d.). Concepts-clés du Modèle de développement humain – Processus de production du handicap (MDH-PPH).",
    "href": "https://ripph.qc.ca/modele-mdh-pph/concepts-cles/"
  },
  "inclusion": {
    "court": "CAST (2024) · UDL 3.0",
    "citation": "CAST. (2024). Universal Design for Learning Guidelines, version 3.0.",
    "href": "https://udlguidelines.cast.org/"
  },
  "autonomie": {
    "court": "CAST (2024) · Strategy development",
    "citation": "CAST. (2024). Strategy development. Universal Design for Learning Guidelines, version 3.0.",
    "href": "https://udlguidelines.cast.org/action-expression/strategy-development/"
  },
  "carless": {
    "court": "Carless & Boud (2018)",
    "citation": "Carless, D., & Boud, D. (2018). The development of student feedback literacy: Enabling uptake of feedback. Assessment & Evaluation in Higher Education, 43(8), 1315–1325.",
    "href": "https://doi.org/10.1080/02602938.2018.1463354"
  },
  "alignement": {
    "court": "Eberly Center · Learning objectives",
    "citation": "Carnegie Mellon University, Eberly Center. (n.d.). Articulate your learning objectives.",
    "href": "https://www.cmu.edu/teaching/designteach/design/learningobjectives.html"
  },
  "actif": {
    "court": "Freeman et al. (2014)",
    "citation": "Freeman, S., Eddy, S. L., McDonough, M., Smith, M. K., Okoroafor, N., Jordt, H., & Wenderoth, M. P. (2014). Active learning increases student performance in science, engineering, and mathematics. Proceedings of the National Academy of Sciences, 111(23), 8410–8415.",
    "href": "https://doi.org/10.1073/pnas.1319030111"
  },
  "rappel": {
    "court": "Dunlosky et al. (2013)",
    "citation": "Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students’ learning with effective learning techniques: Promising directions from cognitive and educational psychology. Psychological Science in the Public Interest, 14(1), 4–58.",
    "href": "https://doi.org/10.1177/1529100612453266"
  },
  "feedback": {
    "court": "Eberly Center · Assessment",
    "citation": "Carnegie Mellon University, Eberly Center. (n.d.). Formative vs summative assessment.",
    "href": "https://www.cmu.edu/teaching/assessment/basics/formative-summative.html"
  },
  "pairr": {
    "court": "Sperber et al. (2025)",
    "citation": "Sperber, L., MacArthur, M., Minnillo, S., Stillman, N., & Whithaus, C. (2025). Peer and AI review + reflection (PAIRR): A human-centered approach to formative assessment. Computers and Composition, Article 102921.",
    "href": "https://doi.org/10.1016/j.compcom.2025.102921"
  },
  "unesco": {
    "court": "UNESCO (2021)",
    "citation": "International Commission on the Futures of Education. (2021). Reimagining our futures together: A new social contract for education. UNESCO.",
    "href": "https://unesdoc.unesco.org/ark:/48223/pf0000379707"
  },
  "barnett": {
    "court": "Barnett (2004)",
    "citation": "Barnett, R. (2004). Learning for an unknown future. Higher Education Research & Development, 23(3), 247–260.",
    "href": "https://doi.org/10.1080/0729436042000235382"
  }
},
  langues: Object.fromEntries(["fr", "en", "es", "zh", "ar", "ru"].map(code => [code, require("./enseignement/" + code + ".json")]))
};
