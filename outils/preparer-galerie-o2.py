"""Inventorie les 48 planches du dossier officiel, sans dupliquer les PDF équivalents."""
from pathlib import Path
import csv, hashlib, json, re

ROOT=Path(__file__).parents[1]
SOURCE=Path(r'C:\Users\Heima\Documents\Protocole de thèse (officiel)\08 - Cartographie O2 (R et QGIS)\CARTES À CONSULTER')
PHRASES={
'Carte 01':'Les huit territoires de CLSC sont comparés selon les domaines disposant d’une réponse conjointe santé et social à domicile.',
'Carte 02':'Cette carte situe les ressources de santé et les ressources sociales selon leur secteur.',
'Carte 03':'Le score compte les domaines sociaux accessibles à 1 km de marche en présence d’une ressource de santé.',
'Carte 04':'Le score compte les domaines sociaux accessibles à 500 m de marche en présence d’une ressource de santé.',
'Carte 05':'Cette carte estime la capacité des GMF accessible en 30 minutes de transport collectif, en tenant compte de la population qui se la partage.',
'Carte 06':'Ces zones combinent une forte présence de personnes aînées, une faible réponse à 500 m et une défavorisation élevée.',
'Carte 07':'L’analyse spatiale repère les regroupements d’îlots présentant une réponse faible ou forte à 1 km.',
'Carte 08':'Cet indice écologique décrit des besoins sociaux potentiels à partir du recensement de 2021, sans mesurer les besoins individuels.',
'Carte 09':'Cette carte croise les besoins potentiels et la faiblesse de la réponse de proximité à 500 m.',
'Graphique 01':'La matrice présente la réponse conjointe santé et social pour chaque CLSC et domaine de besoin.',
'Graphique 02':'La matrice distingue les ressources disponibles, absentes ou inaccessibles dans chaque territoire.',
'Graphique 03':'Ce graphique compare la part des personnes aînées ayant accès à deux domaines sociaux à la fois à 1 km.',
'Graphique 04':'Ce graphique indique la part des 65 ans et plus vivant à moins de 500 m d’une ressource pour chaque domaine.',
'Graphique 05':'Le nombre de ressources par secteur est mis en regard de la diversité sectorielle dans chaque CLSC.',
'Graphique 06':'Ce graphique distingue les besoins exprimés au 211 par les 60 ans et plus selon qu’ils sont satisfaits ou non.',
'Graphique 07':'Les territoires sont comparés selon leurs besoins potentiels et leur niveau de réponse.',
'Graphique 08':'La matrice résume les écarts entre besoins et ressources par domaine et territoire.',
'Graphique 09':'Ce graphique montre comment les hypothèses retenues modifient le classement des CLSC.',
'Graphique 10':'Cette typologie repère des territoires contrastés pour éclairer le choix des cas d’O3.',
'Québec 01':'Cette carte situe les ressources inventoriées à l’échelle du Québec.',
'Québec 02':'Les territoires de CLSC sont classés selon leur caractère urbain, périurbain ou rural.',
'Québec 03':'Cette carte compare le nombre de lieux de première ligne pour 1 000 personnes de 65 ans et plus.',
'Québec 04':'Cette carte compare l’accessibilité potentielle aux GMF pour 1 000 personnes de 65 ans et plus.',
'Québec 05':'Cette carte compare les places en résidence privée pour aînés pour 1 000 personnes de 65 ans et plus.',
'Québec 06':'Cette carte indique la part des 65 ans et plus vivant à plus de 10 km d’une installation de CLSC.',
'Québec 07':'Cette carte compare la part des 65 ans et plus disposant simultanément des trois ressources de proximité étudiées.',
'Québec 08':'L’analyse spatiale repère les regroupements de territoires présentant une codisponibilité similaire des ressources.',
'Québec 09':'Cette carte rapporte les besoins exprimés au 211 à la population de 60 ans et plus dans les territoires couverts.',
'Contrôle 01':'Ce contrôle repère les aires de diffusion partagées entre plusieurs CLSC avant leur répartition par îlots.',
'Contrôle 02':'Ce contrôle vérifie la présence d’une ressource de santé à 20 minutes de marche de chaque îlot.',
'Contrôle 03':'Ce contrôle estime l’accès potentiel aux pharmacies en 30 minutes de transport collectif.',
'Contrôle 04':'Ce graphique décrit les besoins exprimés au 211 par les 60 ans et plus, à l’échelle des arrondissements.'}

def main():
    rows=list(csv.DictReader((SOURCE/'index_des_cartes.csv').open(encoding='utf-8-sig'),delimiter=';'))
    items=[]
    for r in rows:
        if not r['fichier'].endswith('.png'): continue
        rel=Path(r['dossier'])/r['fichier']; p=SOURCE/rel
        assert hashlib.sha256(p.read_bytes()).hexdigest()==r['sha256'],rel
        title=p.stem; label=title.split(' - ')[0]
        if label.startswith('Atlas'):
            territory=re.sub(r'^Atlas [12] - \d+ ', '',title)
            is_analysis=label=='Atlas 2'
            title=('Analyse territoriale' if is_analysis else 'Ressources disponibles')+' · '+territory
            detail=('Cette planche situe la réponse de proximité et les zones prioritaires' if is_analysis else 'Cette planche réunit les ressources et la réponse conjointe santé et social')+' dans le territoire de '+territory+'.'
        else:
            detail=PHRASES[label]
            title=re.sub(r'^(Carte|Graphique|Québec|Contrôle) \d+ - (CCSMTL - )?','',title)
            if label.startswith('Québec'): title='Québec · '+title
            if label.startswith('Contrôle'): title='Contrôle · '+title
        idx=len(items)+1; slug=f'planche-{idx:02d}'
        items.append(dict(id=slug,titre=title,description=detail,
            image=f'assets/these/o2-galerie/{slug}.webp',original=f'assets/these/o2-galerie/{slug}-grand.webp',
            fichier_source=rel.as_posix(),sha256=r['sha256']))
    pngs=list(SOURCE.rglob('*.png'))
    assert len(items)==len(pngs)==48
    output=ROOT/'assets/these/o2-galerie';output.mkdir(parents=True,exist_ok=True)
    (output/'index.json').write_text(json.dumps(dict(version='20261018-galerie-complete',planches=items),ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'{len(items)} planches uniques : 9 cartes locales, 16 pages d’atlas, 10 graphiques, 9 cartes Québec et 4 contrôles.')

if __name__=='__main__':main()
