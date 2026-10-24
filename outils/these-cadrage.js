"use strict";
// Les formulations françaises sont celles fournies par Éric, sans reformulation.
module.exports = {
  references: [
    ["World Health Organization. (2025). World report on social determinants of health equity.", "https://www.who.int/publications/i/item/9789240107588"],
    ["Canadian Institute for Health Information. (2025). Primary health care, 2025.", "https://www.cihi.ca/en/taking-the-pulse-measuring-shared-priorities-for-canadian-health-care-2025/primary-health-care-2025"],
    ["Institut national de santé publique du Québec. (s. d.). Inégalités sociales de santé (ISS).", "https://www.inspq.qc.ca/inegalites-sociales-de-sante"],
  ],
  langues: Object.fromEntries(["fr", "en", "es", "zh", "ar", "ru"].map(l => [l, require("./these/" + l + ".json")])),
};
