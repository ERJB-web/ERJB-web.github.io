"use strict";

/* Vérification du rendu réel de l'accueil mobile dans Chrome.
   Aucun accès externe requis ; le site généré est ouvert localement. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const puppeteer = require("puppeteer-core");

const executable = [
  process.env.CHROME_BIN,
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].find(p => p && fs.existsSync(p));
if (!executable) throw new Error("Chrome non disponible : vérification visuelle impossible");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: executable,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--allow-file-access-from-files"],
  });
  const widths = [360, 393, 430, 700];
  const errors = [];
  try {
    for (const width of widths) {
      const page = await browser.newPage();
      await page.setViewport({ width, height: 850, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
      await page.goto(pathToFileURL(path.resolve("index.html")).href, {
        waitUntil: "domcontentloaded", timeout: 60000,
      });
      await page.waitForSelector(".entete .direct-entete", { timeout: 15000 });
      await new Promise(r => setTimeout(r, 450));
      const result = await page.evaluate(() => {
        const rect = el => {
          const r = el.getBoundingClientRect();
          return { x:r.x, y:r.y, left:r.left, right:r.right, top:r.top, bottom:r.bottom,
            width:r.width, height:r.height, scrollWidth:el.scrollWidth, clientWidth:el.clientWidth,
            text:el.innerText || el.textContent || "" };
        };
        const $ = selector => document.querySelector(selector);
        const selectors = [
          ".entete .nav .acces-these",
          ".entete .outils .menu-langues > summary",
          ".entete .outils .menu-acces > summary",
          ".entete .outils a.bouton-cv:first-of-type",
          ".entete .outils a.bouton-cv:last-of-type",
        ];
        const buttons = selectors.map(sel=>$(sel)).filter(Boolean).map(rect);
        const contacts = [...document.querySelectorAll(".entete .coordonnees-haut > a")].map(rect);
        const status = $(".entete .direct-entete .direct-activite");
        const hero = $(".accueil .identite");
        const portrait = $(".accueil .portrait");
        const city = $(".accueil .hall");
        const cs = getComputedStyle(hero);
        const pseudo = getComputedStyle(hero, "::before");
        return {
          viewport: innerWidth,
          header: rect($(".entete")),
          buttons,
          contacts,
          status: status && rect(status),
          hero: rect(hero),
          portrait: rect(portrait),
          hall: rect(city),
          heroBackground: cs.backgroundImage,
          heroPseudoContent: pseudo.content,
          heroPseudoBackground: pseudo.backgroundImage,
          cssLoaded: getComputedStyle($(".entete")).display === "grid",
          fullPageHorizontalOverflow: document.documentElement.scrollWidth > innerWidth + 3,
        };
      });
      const issue = m => errors.push(width + "px: " + m);
      if (!result.cssLoaded) issue("CSS mobile non chargé");
      if (result.buttons.length !== 5) issue("les cinq commandes ne sont pas présentes");
      const btn = result.buttons;
      for (let i=0;i<btn.length;i++){
        const b=btn[i];
        if(b.left < -2 || b.right > width + 2) issue("bouton "+i+" hors écran "+JSON.stringify(b));
        if(i>0 && (b.left < btn[i-1].right-1 || Math.abs(b.top-btn[0].top)>4)){
          issue("boutons chevauchés ou sur plusieurs lignes "+JSON.stringify(btn));
          break;
        }
      }
      if (result.contacts.length !== 3) issue("une coordonnée manque");
      for (const [i,c] of result.contacts.entries()){
        if (c.left < -2 || c.right > width+2) issue("coordonnée hors écran "+i);
        if(c.scrollWidth > c.clientWidth + 3) issue("texte de coordonnée coupé "+i+" : "+JSON.stringify(c));
      }
      if(result.status){
        if(result.status.scrollWidth > result.status.clientWidth+3) issue("statut météo coupé");
        if (result.status.height > 44) issue("statut météo sur trop de lignes");
      }
      if (result.heroBackground.includes("url(") || (result.heroPseudoContent !== "none" && result.heroPseudoBackground.includes("url("))) {
        issue("deuxième image de Montréal encore dans le portrait");
      }
      if(result.fullPageHorizontalOverflow) issue("la page dépasse horizontalement");
      if(result.portrait.bottom > result.hall.top + 5) issue("le portrait recouvre les commandes du hall");
      if (width === 360) await page.screenshot({path:"/tmp/entete-mobile-360.png"});
      console.log(JSON.stringify({width, buttons:btn.map(b=>({x:b.x,y:b.y,w:b.width,h:b.height})),
        contacts: result.contacts.map(c=>({w:c.width,scroll:c.scrollWidth,client:c.clientWidth})),
        status: result.status && {width:result.status.width,scroll:result.status.scrollWidth,client:result.status.clientWidth},
        heroBackground: result.heroBackground, horizontalOverflow:result.fullPageHorizontalOverflow}));
      await page.close();
    }
  } finally {
    await browser.close();
  }
  assert.equal(errors.length, 0, "Échecs visuels :\n" + errors.join("\n"));
  console.log("OK : cinq commandes alignées, contacts lisibles, météo compacte, une seule photo de Montréal.");
})().catch(e=>{console.error(e);process.exitCode=1});
