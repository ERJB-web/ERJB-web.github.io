"""Diapositives vectorielles : formulations de recherche approuvées par l'auteur."""
from pathlib import Path
from html import escape
import json,base64
from PIL import ImageFont,Image
from io import BytesIO
ROOT=Path(__file__).resolve().parent.parent
D=json.loads((ROOT/'outils/formulations-recherche.json').read_text(encoding='utf8'))['fr']
INK='#123c4d';COLORS=['#0879be','#078786','#568e2d']
def measure(s,size,bold=False):
    return ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf' if bold else 'C:/Windows/Fonts/arial.ttf',size).getlength(s)
def text(s,x,y,w,size=36,bold=False,color=INK,maxh=1000):
    words=[];lines=[];row=''
    for token in s.split():
        if token in [':',';','?','!'] and words:words[-1]+=' '+token
        else:words.append(token)
    for word in words:
        if row and measure(row+' '+word,size,bold)>w:lines.append(row);row=word
        else:row=(row+' '+word).strip()
    if row:lines.append(row)
    lead=round(size*1.32)
    assert len(lines)*lead<=maxh,(s[:50],len(lines)*lead,maxh)
    return '<text fill="'+color+'" font-family="Arial, sans-serif" font-size="'+str(size)+'" font-weight="'+('700' if bold else '400')+'">'+''.join(f'<tspan x="{x}" y="{y+i*lead}">{escape(line)}</tspan>' for i,line in enumerate(lines))+'</text>'
def rect(x,y,w,h,fill,stroke='none',r=14):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="2"/>'
def start(title,num,sub=''):
    s=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 1350" role="img" aria-label="{escape(title,quote=True)}"><rect width="2400" height="1350" fill="white"/>'
    s+=text('PROTOCOLE DE RECHERCHE · MÉTHODOLOGIE',100,65,1400,22,True,'#18788a')
    s+=text(title,100,165,2200,46,True,maxh=160)
    if sub:s+=text(sub,100,235,2200,28,color='#526b76',maxh=100)
    return s+text('Éric Bernier · Formulations approuvées · 21 octobre 2026',100,1290,1900,21,color='#607781')+text(str(num),2250,1290,100,21)
def save(n,s):
    p=ROOT/'assets/these/diapos'/f'diapo-{n:02d}.svg';p.write_text(s+'</svg>',encoding='utf8');return p
paths=[]
s=start('Projet de thèse · Titre provisoire',1)
s+=rect(100,300,14,600,COLORS[1],r=0)
s+=text(D['titre'],165,385,1990,68,True,maxh=600)
s+=text('Éric Bernier, LL.M. et M. Sc.',165,1080,1900,37,True)
s+=text('Doctorat en santé publique · ESPUM · Université de Montréal',165,1140,1900,29)
s+=text('Sous la codirection des Dres Nadia Sourial et Géraldine Layani',165,1190,1900,27,color='#526b76')
paths.append(save(1,s))
s=start('Question de recherche',9)
s+=rect(100,300,2200,410,'#eaf6f5','#8bbeb9')
s+=text('QUESTION DE RECHERCHE',145,365,2100,27,True,COLORS[1])
s+=text(D['question'],145,450,2070,55,True,maxh=250)
s+=rect(100,770,2200,275,'#f1f7eb','#bed4aa')
s+=text('OBJECTIF GÉNÉRAL',145,830,2100,27,True,COLORS[2])
s+=text('Produire, par profil et par territoire de CLSC, des repères pour organiser la réponse intersectorielle avec les ressources réellement disponibles.',145,910,2070,42,True,maxh=180)
s+=rect(100,1095,2200,100,INK)
s+=text('PROFILS → CARTOGRAPHIE DES RESSOURCES → ANALYSE DES RÉSEAUX',145,1158,2090,33,True,'#ffffff')
paths.append(save(9,s))
s=start('Objectifs spécifiques et devis de la thèse',10)
s+=text(D['question'],100,255,2200,28,maxh=90)
headers=['OBJECTIF SPÉCIFIQUE','DEVIS','POPULATION ET SOURCES','PRODUIT ATTENDU']
xs=[100,1120,1510,1940];ws=[990,360,400,360]
for x,w,label in zip(xs,ws,headers):s+=rect(x,340,w,75,INK)+text(label,x+18,388,w-36,24,True,'#fff')
methods=['Revue de portée selon JBI et PRISMA-ScR.','Analyse écologique et spatiale ; R et QGIS.','Méthodes mixtes : analyse des réseaux puis entretiens explicatifs.']
pops=['Études sur les personnes aînées vivant à domicile.','Répertoires des ressources et données territoriales.','Équipes SAD et organisations partenaires ; situations réelles.']
products=['Typologie des profils de besoins concomitants, traduite en vignettes.','Atlas par CLSC, matrice besoins × ressources × territoire, indice d’écart.','Réseau par CLSC et par profil : acteurs, niveaux de collaboration, maillons manquants.']
matrix_methods=['Revue de portée (JBI, PRISMA-ScR) et analyse descriptive des demandes au 211.','Quantitatif observationnel écologique : données secondaires, analyse spatiale.','Mixte séquentiel explicatif (QUAN → qual) : analyse de réseaux égocentrée, puis entretiens.']
matrix_pops=['Études sur les 65 ans et plus à domicile ayant une ou plusieurs morbidités ; demandes au 211 des 60 ans et plus.','8 territoires de CLSC du CCSMTL ; 7 216 lieux de service des six secteurs ; aînés de 65 ans et plus.','Équipes SAD du CIUSSS (egos) et organisations partenaires de 3 ou 4 CLSC contrastés.']
for i in range(3):
    y=440+i*245
    for x,w in zip(xs,ws):s+=rect(x,y,w,225,['#eaf3fa','#eaf7f4','#f0f7e9'][i],'#c6d9df')
    s+=text('O'+str(i+1),120,y+40,940,29,True,COLORS[i])
    s+=text(D['objectifs'][i],120,y+70,945,26,maxh=180)
    for x,w,t in zip(xs[1:],ws[1:],[matrix_methods[i],matrix_pops[i],products[i]]):s+=text(t,x+20,y+40,w-40,26,maxh=210)
s+=text('Posture pragmatique · méthodes mixtes multiphases (Creswell et Plano Clark, 2017) : O1 → O2 → O3 · un ou plusieurs patients partenaires associés à toutes les étapes.',100,1230,2200,23,maxh=65)
paths.append(save(10,s))
for i,n in enumerate([24,27,28]):
    s=start(['O1 · Profils','O2 · Ressources','O3 · Réseaux'][i]+' : objectif spécifique',n)
    s+=rect(100,295,2200,640,['#eaf3fa','#eaf7f4','#f0f7e9'][i],'#b8d1dc')
    s+=text('O'+str(i+1),150,380,2080,55,True,COLORS[i])
    s+=text(D['objectifs'][i],150,495,2080,53,True,maxh=420)
    s+=rect(100,995,2200,190,INK)
    s+=text('MÉTHODE',145,1050,2090,25,True,'#b9dfe5')
    s+=text(methods[i],145,1120,2070,40,True,'#fff',maxh=100)
    paths.append(save(n,s))
for n in [9,10]:
    (ROOT/'assets/these'/f'diapo-methodo-{n:02d}.svg').write_text((ROOT/'assets/these/diapos'/f'diapo-{n:02d}.svg').read_text(encoding='utf8'),encoding='utf8')
# Conserver les photographies, logos, lacunes et méthodes des diapositives sources.
# Seules les zones de formulation sont composées en texte SVG sélectionnable.
def original(n,label):
    buf=BytesIO();Image.open(ROOT/'assets/these/diapos'/f'diapo-{n:02d}.webp').save(buf,format='PNG')
    raw=base64.b64encode(buf.getvalue()).decode()
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-label="{escape(label,quote=True)}"><image width="1600" height="900" href="data:image/png;base64,{raw}"/>'
def over(n,s):
    (ROOT/'assets/these/diapos'/f'diapo-{n:02d}.svg').write_text(s+'</svg>',encoding='utf8')
s=original(1,D['titre'])+rect(77,258,945,293,'white',r=0)
s+=text(D['titre'],87,300,925,36,True,maxh=270)
over(1,s)
s=original(9,D['question'])+rect(119,307,1360,77,'#e8f6f6',r=0)
s+=text(D['question'],127,333,1345,25,True,maxh=70)
over(9,s)
for i,n in enumerate([24,27,28]):
    s=original(n,D['objectifs'][i])+rect(852,249,636,298,'white',r=0)
    s+=text(D['objectifs'][i],862,282,615,25,True,maxh=245)
    if i==1:s+=text('Six secteurs : réseau public, première ligne, parapublic, communauté, municipalité, habitation.',862,516,615,17,color='#607781',maxh=46)
    if i==2:s+=text('Ego = l’équipe SAD de chaque territoire, au CIUSSS du Centre-Sud-de-l’Île-de-Montréal. Volet quantitatif égocentré, puis entretiens.',862,516,615,16,color='#607781',maxh=46)
    over(n,s)
(ROOT/'assets/these/diapo-methodo-09.svg').write_text((ROOT/'assets/these/diapos/diapo-09.svg').read_text(encoding='utf8'),encoding='utf8')
print('Diapositives vectorielles :',len(paths)+2)
