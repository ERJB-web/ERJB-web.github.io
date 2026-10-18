"""Une capture par outil, dans la démarche de l'objectif concerné."""
from pathlib import Path
import runpy,re
root=Path(__file__).parents[1];p=root/'index.html';src=p.read_text(encoding='utf-8')
if 'captures-methodes-uniques-20261018' not in src:
 Tree=runpy.run_path(str(root/'outils/reorganiser-methodologie.py'))['Tree'];t=Tree(src);changes=[]
 def byid(id):return next(n for n in t.root.find(lambda n:n.attrs.get('id')==id))
 outils=next(n for n in byid('methode-o2-exemples').find(lambda n:n.has('a-apercu-o2')))
 figures=outils.find(lambda n:n.tag=='figure')
 positron=next(n for n in figures if 'capture_positron' in t.raw(n))
 qgis=next(n for n in figures if 'capture_qgis' in t.raw(n))
 for id,fig in [('methode-o2-6',positron),('methode-o2-7',qgis)]:
  n=byid(id);raw=t.raw(n)
  capture=t.raw(fig).replace('class="a-cap"','class="figure-officielle capture-methode"')
  changes.append((n.start,n.end,raw[:-len('</section>')]+capture+'</section>'))
 changes.append((outils.start,outils.end,''))
 for n in byid('methode-o2-exemples').find(lambda n:n.tag=='figure'):
  if 'o2-script-r-05b' in t.raw(n):changes.append((n.start,n.end,''))
 for n in byid('methode-o2-exemples').find(lambda n:n.has('code-vers-carte')):
  changes.append((n.start,n.end,'<p class="galerie-o2-renvoi"><a href="#galerie-o2" data-galerie-planche="4">Voir le résultat du calcul sur la carte à 500 m dans la galerie →</a></p>'))
 o1=next(n for n in byid('methode-o1-exemples').find(lambda n:n.has('a-apercu-o1')))
 h=next(n for n in o1.children if n.tag=='h4');changes.append((h.start,h.end,''))
 changes.sort();assert all(changes[i][1]<=changes[i+1][0] for i in range(len(changes)-1))
 for a,b,new in reversed(changes):src=src[:a]+new+src[b:]
 src=src.replace('Voici le script : il prend','Le calcul prend')
 src=src.replace('Lire le code ligne à ligne','Comprendre les variables et le calcul')
 src=src.replace('Un exemple concret : du code R à la carte QGIS','Un exemple concret : calculer la réponse à 500 m')
 src=src.replace('Comprendre la démarche : outils, calculs et sources','Approfondir le calcul et ses sources')
 src=src.replace('</head>','<!-- captures-methodes-uniques-20261018 --></head>',1)
 p.write_text(src,encoding='utf-8')
