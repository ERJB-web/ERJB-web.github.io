"""Allège la lecture et assemble une galerie exhaustive à partir du manifeste O2."""
from pathlib import Path
import runpy,re,json,html

ROOT=Path(__file__).parents[1]
Tree=runpy.run_path(str(ROOT/'outils/reorganiser-methodologie.py'))['Tree']
def clean(s):return re.sub(r'\s+',' ',re.sub('<[^>]*>',' ',s)).strip()
def main():
 p=ROOT/'index.html';src=p.read_text(encoding='utf-8')
 if 'galerie-o2-complete-48' in src:return
 t=Tree(src);changes=[]
 def byid(id):return next(n for n in t.root.find(lambda n:n.attrs.get('id')==id))
 def edit(n,new):changes.append((n.start,n.end,new))
 def fiche(id,title):
  zone=byid(id)
  return next(n for n in zone.find(lambda n:n.has('these-methode-item')) if clean(t.raw(next(c for c in n.children if c.tag=='dt')))==title)
 def dd(id,title,new):
  n=fiche(id,title);node=next(c for c in n.children if c.tag=='dd');edit(node,'<dd>'+new+'</dd>')
 def remove_fiche(id,title):
  n=fiche(id,title);edit(n.parent if n.parent.tag=='dl' else n,'')
 dd('methode-o1-5','Échantillonnage','La recherche documentaire vise l’ensemble des études admissibles, sans échantillonnage probabiliste : MEDLINE, Embase et APA PsycInfo via Ovid, ainsi que PubMed. La stratégie de 42 lignes, en 7 blocs, a été testée sur 6 articles de référence ; les critères d’admissibilité guideront la sélection.')
 dd('methode-o2-5','Échantillonnage','Inventaire de toutes les ressources repérées dans les sources retenues, sans recrutement de participants ni tirage d’un échantillon. Les 55 fichiers utilisés sont documentés dans la rubrique Population et sources.')
 dd('methode-o2-6','Variables communes et rapprochement','Six variables organisent l’inventaire : position géographique, territoire, secteur, domaine de besoin, date de la source et identifiant construit. Le territoire et le domaine relient les sources ; l’identifiant repère une ressource dans l’inventaire, sans constituer une clé commune à tous les fichiers. Le contrôle de double codage de l’essai est rapporté à κ = 0,94.')
 remove_fiche('methode-o2-6','Collecte')
 dd('methode-o3-5','Échantillonnage, volet qual','Choix raisonné selon la position dans le réseau : intermédiaires, organisations isolées et liens discordants. Cible de 8 à 10 entretiens par CLSC, soit 32 à 40 si les quatre CLSC proposés sont retenus ; l’effectif total dépendra du nombre final de sites. Recrutement par les équipes SAD et les organisations répondantes.')
 dd('methode-o3-5','Pourquoi plusieurs CLSC contrastés','Comparer des contextes différents aide à distinguer les mécanismes récurrents des particularités locales et à discuter leur transférabilité.')
 dd('methode-o3-8','Intégration','<ol class="methode-integration-flux"><li><strong>Relier.</strong> Comparer les réseaux déclarés, les références du 211 et l’offre de l’atlas.</li><li><strong>Expliquer.</strong> Utiliser les écarts pour choisir les situations à approfondir en entretien.</li><li><strong>Réunir.</strong> Construire des tableaux conjoints par CLSC et profil, en explicitant convergences et divergences.</li></ol>')
 remove_fiche('methode-o3-8','Déroulement')
 for node in t.root.find(lambda n:n.has('methode-objectif-tete')):
  code=node.parent.attrs['data-objectif'];paragraphs=[c for c in node.children if c.tag=='p']
  descriptions={'O1':'Décrire les profils de besoins pour construire les vignettes.','O2':'Situer les ressources et comparer leur accessibilité dans les territoires.','O3':'Comprendre les collaborations réelles et les maillons manquants.'}
  edit(paragraphs[-1],'<p>'+descriptions[code]+'</p>')
 for node in t.root.find(lambda n:n.has('methode-rubrique-titre')):
  number=int(node.parent.attrs['id'].split('-')[-1])-3
  edit(node,re.sub(r'<span>\d+</span>',f'<span>{number:02d}</span>',t.raw(node)))
 # Deux captures du même bilan Covidence : conserver la capture commentée avec les critères.
 o1=byid('methode-o1-exemples')
 for n in o1.children:
  if n.tag=='figure' and 'covidence-flux' in t.raw(n):edit(n,'')
 # Les seules étapes qui ont été réalisées restent dans les tableaux existants.
 # En O2 : toutes les planches sont dans la galerie, le détail de la démonstration dans un accordéon.
 manifest=json.loads((ROOT/'assets/these/o2-galerie/index.json').read_text(encoding='utf-8'))
 slides=[]
 for i,card in enumerate(manifest['planches']):
  e=html.escape
  slides.append(f'<figure class="galerie-o2-planche" aria-label="Planche {i+1} sur 48"><a class="galerie-o2-photo" href="{e(card["original"])}" target="_blank" rel="noopener" aria-label="Agrandir : {e(card["titre"])}"><img src="{e(card["image"])}" alt="{e(card["titre"])}" loading="lazy" decoding="async" draggable="false"></a><figcaption><h5>{e(card["titre"])}</h5><p>{e(card["description"])}</p></figcaption></figure>')
 galerie='<section class="galerie-o2" id="galerie-o2" data-galerie-o2 data-planche="1" role="region" aria-roledescription="carrousel" aria-label="48 cartes et résultats de la cartographie O2"><div class="galerie-o2-piste" data-galerie-piste tabindex="0" aria-label="Cartes : flèches gauche et droite pour parcourir">'+''.join(slides)+'</div><nav class="galerie-o2-commandes" aria-label="Parcourir les cartes et résultats"><button type="button" data-galerie-precedente aria-label="Carte précédente" disabled>←</button><span data-galerie-compteur role="status" aria-live="polite" aria-atomic="true">1 / 48</span><button type="button" data-galerie-suivante aria-label="Carte suivante">→</button></nav></section>'
 o2=byid('methode-o2-exemples');header=next(c for c in o2.children if c.tag=='header')
 extras=[]
 for n in o2.children:
  if n is header:continue
  raw=t.raw(n)
  if n.tag=='dl' and '164 îlots' in raw:continue
  if n.tag=='figure' and any(x in raw for x in ['o2-carte-b2','atlas-2-06311','logiciel-positron','logiciel-qgis']):continue
  extras.append(raw)
 extra='\n'.join(extras)
 # Une seule image par résultat : les autres occurrences deviennent des renvois à la planche.
 et=Tree(extra);ec=[]
 map_ids={'carte-04-':4,'carte-08-':8,'carte-09-':9,'atlas-1-06313':12}
 for fig in et.root.find(lambda n:n.tag=='figure'):
  for token,idx in map_ids.items():
   if token in et.raw(fig):
    ec.append((fig.start,fig.end,f'<p class="galerie-o2-renvoi"><a href="#galerie-o2" data-galerie-planche="{idx}">Voir la planche {idx} dans la galerie →</a></p>'));break
 for a,b,new in reversed(ec):extra=extra[:a]+new+extra[b:]
 extra=extra.replace('jeu par jeu (73 jeux)','jeu par jeu (73 jeux dans l’inventaire initial, dont 55 fichiers retenus pour le mapping présenté)')
 extra=extra.replace('indice d’écart','indice d’écart')
 heading='<header class="methode-exemples-tete"><h4>Exemples et résultats exploratoires · O2</h4><p>Les 48 planches du dossier cartographique illustrent les analyses par domaine ; le mapping par profils dépendra des résultats d’O1.</p></header>'
 edit(o2,'<section class="methode-exemples" id="methode-o2-exemples" aria-label="Exemples méthodologiques O2">'+heading+galerie+'<details class="methode-approfondir"><summary>Comprendre la démarche : outils, calculs et sources</summary><div class="methode-detail-corps">'+extra+'</div></details></section>')
 # Appliquer uniquement des plages disjointes (aucune réécriture des autres chapitres).
 changes.sort()
 assert all(changes[i][1]<=changes[i+1][0] for i in range(len(changes)-1))
 for a,b,new in reversed(changes):src=src[:a]+new+src[b:]
 src=src.replace('</head>','<!-- galerie-o2-complete-48 --><link rel="stylesheet" href="assets/galerie-o2.css?v=20261018-complete"><script src="assets/galerie-o2.js?v=20261018-complete" defer></script></head>',1)
 src=re.sub(r'assets/site.js\?v=[^"\s]+','assets/site.js?v=20261018-galerie-complete-48',src)
 src=src.replace('assets/methodologie-ordre.css?v=20261018','assets/methodologie-ordre.css?v=20261018-lecture')
 p.write_text(src,encoding='utf-8')
 site=ROOT/'assets/site.js';js=site.read_text(encoding='utf-8')
 a=js.index('/* atlas-these-cartographie-2026')
 b=js.index('// Atlas O3',a)
 js=js[:a]+'/* Atlas O2 : galerie exhaustive statique ; interactions dans galerie-o2.js. */\n\n'+js[b:]
 site.write_text(js,encoding='utf-8')
 print('Galerie de 48 planches intégrée ; doublons visuels et formulations redondantes allégés.')

if __name__=='__main__':main()
