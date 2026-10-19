"""Réorganisation ciblée du HTML publié, sans régénérer les autres chapitres."""
from html.parser import HTMLParser
from pathlib import Path
import re

class Node:
    def __init__(self, tag, attrs, start, parent=None):
        self.tag, self.attrs, self.start, self.end, self.parent = tag, dict(attrs), start, None, parent
        self.children = []
    def has(self, cls): return cls in self.attrs.get('class', '').split()
    def find(self, pred):
        return [n for c in self.children for n in ([c] if pred(c) else []) + c.find(pred)]

class Tree(HTMLParser):
    def __init__(self, src):
        super().__init__(convert_charrefs=False)
        self.src=src; self.lines=[0]+[m.end() for m in re.finditer('\n',src)]
        self.root=Node('root',[],0); self.stack=[self.root]; self.feed(src)
    def pos(self):
        line,col=self.getpos(); return self.lines[line-1]+col
    def handle_starttag(self,tag,attrs):
        n=Node(tag,attrs,self.pos(),self.stack[-1]); self.stack[-1].children.append(n)
        if tag in {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}: n.end=self.pos()+len(self.get_starttag_text())
        else: self.stack.append(n)
    def handle_endtag(self,tag):
        for i in range(len(self.stack)-1,0,-1):
            if self.stack[i].tag==tag:
                self.stack[i].end=self.src.index('>',self.pos())+1
                self.stack=self.stack[:i]; break
    def raw(self,n): return self.src[n.start:n.end]

def reorganiser(src):
    if 'methodologie-ordre-20261018' in src: return src
    t=Tree(src); changes=[]
    def text(n): return re.sub(r'\s+',' ',re.sub('<[^>]*>',' ',t.raw(n))).strip()
    def item(title,body): return f'<div class="these-methode-item"><dt>{title}</dt><dd>{body}</dd></div>'
    for v in t.root.find(lambda n:n.has('these-objectif-vue')):
        code=v.attrs['data-vue-objectif']; num=code[-1]
        article=next(n for n in v.children if n.has('these-methode-objectif'))
        corps=next(n for n in article.children if n.has('methode-these-corps'))
        dl=next(n for n in corps.children if n.tag=='dl')
        groups={k:[] for k in ['devis','population','echantillon','collecte','analyse','integration','produit']}
        examples=[]
        for n in dl.children:
            dt=next(c for c in n.children if c.tag=='dt'); label=text(dt).lower()
            key=('devis' if label=='devis' else 'population' if label.startswith('population') else
                 'echantillon' if label.startswith('échantillonnage') or label.startswith('pourquoi plusieurs') else
                 'collecte' if label.startswith(('collecte','mesures','association')) else
                 'analyse' if label.startswith('analyse') else 'produit' if label=='produit' else 'integration')
            raw=t.raw(n)
            if code=='O1' and label=='collecte':
                examples.append(raw)
                raw=item('Sélection et extraction prévues','Après l’affinement de la grille et le pilote de concordance, deux évaluateurs sélectionneront indépendamment les titres et résumés, puis les textes intégraux. Un troisième arbitre tranchera les désaccords persistants. L’extraction en double recueillera les définitions, instruments, domaines et profils. Les données agrégées du 211 décriront les besoins déclarés, leur statut et les motifs de non-réponse aux besoins.')
            if code=='O2' and label=='produit':
                examples.append(raw)
                raw=raw.replace(' Exemple : 164 îlots en écart, où vivent 15,4 % des 65 ans et plus.','')
            groups[key].append(raw)
        extras=[]
        for n in article.children:
            if n is corps or n.tag=='h4': continue
            if code=='O2' and (n.has('these-provenance-o2') or n.has('these-encadre-o2')):
                groups['population'].append(t.raw(n))
            elif n.has('ia-reperes'): extras.append(t.raw(n))
            else: examples.append(t.raw(n))
        if code=='O2':
            groups['population'].insert(1,item('Origine et rôle des données','Les limites du MSSS définissent les territoires de CLSC ; le recensement de 2021 et l’ISQ décrivent les populations aînées. Les répertoires publics, municipaux, sectoriels et du 211 localisent les ressources ; OpenStreetMap et les données de transport décrivent les déplacements. Les tableaux agrégés du 211 renseignent les demandes, les besoins et les motifs de besoins non comblés. Ces sources décrivent des unités différentes : territoires, lieux de services et demandes, sans appariement individuel.'))
            groups['collecte'].insert(0,item('Variables communes et rapprochement','Les fichiers seront harmonisés selon six variables : position géographique, territoire, secteur, domaine de besoin, date de la source et identifiant construit. Le rattachement spatial au territoire et le codage commun des domaines permettront de croiser besoins, population et ressources. L’identifiant construit repère les ressources dans l’inventaire ; il ne constitue pas une clé commune déjà présente dans tous les fichiers.'))
        if code=='O1':
            groups['integration'].append(item('Articulation avec les objectifs suivants','La revue de portée et la description des demandes au 211 seront mises en correspondance par domaine, en distinguant leurs populations et unités d’observation. Les profils et vignettes d’O1 orienteront ensuite la lecture de l’atlas O2 et le générateur de noms d’O3. O1 n’est pas un volet mixte QUAN → qual.'))
        elif code=='O2':
            groups['integration'].append(item('Articulation avec O1 et O3','Le rapprochement des sources sera spatial et thématique : population, besoins et ressources seront réunis par territoire et domaine. Les profils issus d’O1 permettront ensuite une lecture par combinaison de besoins ; les contrastes territoriaux guideront le choix des CLSC d’O3. L’intégration qualitative et quantitative sera réalisée en O3.'))
        title=t.raw(next(n for n in article.children if n.tag=='h4'))
        sections=''.join(groups['devis'])
        for number,key,label in [(4,'population','Population à l’étude et sources'),(5,'echantillon','Échantillonnage'),(6,'collecte','Collecte de données'),(7,'analyse','Analyse des données'),(8,'integration','Intégration et articulation des données')]:
            sections+=f'<section class="methode-rubrique" id="methode-{code.lower()}-{number}"><h5 class="methode-rubrique-titre"><span>{number:02d}</span>{label}</h5><div class="methode-rubrique-contenu">'+''.join(groups[key])+'</div></section>'
        limits=[n for n in v.children if n.has('limites-these')]
        sections+=f'<section class="methode-rubrique" id="methode-{code.lower()}-9"><h5 class="methode-rubrique-titre"><span>09</span>Limitations et mesures prévues</h5>'+''.join(t.raw(n) for n in limits)+'</section>'
        sections+='<div class="methode-produit">'+''.join(groups['produit'])+'</div>'+''.join(extras)
        for n in v.children:
            if n is article or n in limits or n.has('these-objectif-limites-titre') or n.tag=='style': continue
            examples.append(t.raw(n))
        intro={
          'O1':'Les captures et décomptes ci-dessous documentent les essais et l’avancement réel de la recherche documentaire. Ils ne constituent pas une sélection achevée ni une typologie définitive. Les illustrations fictives restent identifiées comme telles.',
          'O2':'Les cartes, scripts et indicateurs ci-dessous sont des exemples exploratoires réalisés à partir des sources disponibles. Ils illustrent la démarche ; ils ne constituent pas le mapping définitif par profils de besoins, qui dépendra des résultats d’O1. Les îlots fictifs utilisés pour expliquer un calcul sont signalés séparément.',
          'O3':'Les schémas simulés, les exemples tirés des données du 211 et les figures publiées ci-dessous illustrent les analyses possibles. Leur statut est précisé dans chaque légende ; ils ne constituent pas les résultats du futur recueil auprès des équipes SAD.'}[code]
        header= '' if code=='O3' else f'<header class="methode-exemples-tete"><p>FIN DE LA MÉTHODE · {code}</p><h4>Exemples et illustrations · {code}</h4><p>{intro}</p></header>'
        example=f'<section class="methode-exemples" id="methode-{code.lower()}-exemples" aria-label="Exemples méthodologiques {code}">'+header+''.join(examples)+'</section>'
        styles=''.join(t.raw(n) for n in v.children if n.tag=='style')
        new=f'<section class="these-objectif-vue methode-objectif-separe" id="{v.attrs["id"]}" data-vue-objectif="{code}" aria-label="Méthodologie de l’objectif {num}">{styles}<article class="these-methode-objectif" data-objectif="{code}" id="these-methode-{code.lower()}"><header class="methode-objectif-tete"><p>OBJECTIF {num} · MÉTHODOLOGIE</p>{title}<p>Population et sources → échantillonnage → collecte → analyse → intégration → limitations → exemples</p></header><div class="methode-these-corps">{sections}</div></article>{example}</section>'
        changes.append((v.start,v.end,new))
    assert len(changes)==3
    for start,end,new in reversed(changes): src=src[:start]+new+src[end:]
    src=src.replace('</head>','<!-- methodologie-ordre-20261018 --><link rel="stylesheet" href="assets/methodologie-ordre.css?v=20261018"></head>',1)
    return src

if __name__=='__main__':
    path=Path(__file__).parents[1]/'index.html'
    src=reorganiser(path.read_text(encoding='utf-8'))
    t=Tree(src); changes=[]
    for n in t.root.find(lambda n:n.has('these-methode-item')):
        if n.parent.tag!='dl' and n.parent.parent.tag!='dl':
            changes.append((n.start,n.end,'<dl class="methode-fiche">'+t.raw(n)+'</dl>'))
    for start,end,new in reversed(changes): src=src[:start]+new+src[end:]
    src=src.replace('motifs de non-réponse aux besoins','motifs des besoins non comblés')
    src=src.replace('assets/site.js?v=20261018-methodes-chapitre-complet-v1','assets/site.js?v=20261018-methodes-ordre-v2')
    path.write_text(src,encoding='utf-8')
