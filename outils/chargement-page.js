const fs = require('node:fs');
const path = require('node:path');
// Le masque critique est présent avant les feuilles externes, y compris sur réseau lent.
module.exports = () => `<style id="chargement-initial">
html.chargement{background:#fcfdfb}
html.chargement body{visibility:hidden}
html.chargement body>:not(#site-chargement){opacity:0!important;pointer-events:none!important}
html.chargement body>:not(#site-chargement),html.chargement body>:not(#site-chargement) *{visibility:hidden!important}
html.chargement::after{content:attr(data-chargement-message);position:fixed;inset:0;display:grid;place-items:center;font:16px/1.6 system-ui,sans-serif;color:#173f52;pointer-events:none}
html.chargement:has(#site-chargement)::after{content:none}
html.chargement #site-chargement{visibility:visible;position:fixed;inset:0;z-index:1000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;background:#fcfdfb;color:#173f52;padding:24px;text-align:center;font:16px/1.6 system-ui,sans-serif}
#site-chargement button{font:inherit;padding:12px 20px;border:1px solid currentColor;border-radius:8px;cursor:pointer}
</style>
<script id="initialisation-site">${fs.readFileSync(path.join(__dirname, '../assets/chargement.js'), 'utf8')}</script>`;
