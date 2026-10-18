from pathlib import Path
import runpy
root=Path(__file__).parents[1]
p=root/'index.html'
s=p.read_text(encoding='utf-8')
s=s.replace('Les 48 planches du dossier cartographique illustrent les analyses par domaine ; le mapping par profils dépendra des résultats d’O1.','Cette galerie provient d’un mapping spatial réalisé à titre d’exemple illustratif, notamment à partir des données du recensement de 2021 et de données publiques sur les ressources. <strong>Ce n’est pas le mapping de la thèse</strong> : elle montre à quoi les cartes et les résultats pourraient ressembler.')
s=s.replace('<a class="galerie-o2-photo"','<a draggable="false" class="galerie-o2-photo"')
t=runpy.run_path(str(root/'outils/reorganiser-methodologie.py'))['Tree'](s)
changes=[(n.start,n.end) for n in t.root.find(lambda n:n.has('these-encadre-o2'))]
for a,b in reversed(changes):s=s[:a]+s[b:]
p.write_text(s,encoding='utf-8')
