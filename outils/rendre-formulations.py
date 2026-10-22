"""Formulations intégrales sur les diapositives : SVG natifs, 6 langues."""
from pathlib import Path
from html import escape
from io import BytesIO
import json,base64
from PIL import Image,ImageFont
ROOT=Path(__file__).resolve().parent.parent
ALL=json.loads((ROOT/'outils/formulations-recherche.json').read_text(encoding='utf8'))
STRUCT={**json.loads((ROOT/'outils/methodologie-structuree.json').read_text(encoding='utf8')),**json.loads((ROOT/'outils/methodologie-structuree-autres.json').read_text(encoding='utf8'))}
LABELS={
 'fr':['Titre provisoire','Question de recherche','Objectifs spécifiques','Objectifs méthodologiques','Objectif spécifique','Objectif méthodologique'],
 'en':['Provisional title','Research question','Specific objectives','Methodological objectives','Specific objective','Methodological objective'],
 'es':['Título provisional','Pregunta de investigación','Objetivos específicos','Objetivos metodológicos','Objetivo específico','Objetivo metodológico'],
 'zh':['暂定题目','研究问题','具体目标','方法目标','具体目标','方法目标'],
 'ar':['العنوان المؤقت','سؤال البحث','الأهداف المحددة','الأهداف المنهجية','الهدف المحدد','الهدف المنهجي'],
 'ru':['Предварительное название','Исследовательский вопрос','Конкретные задачи','Методологические задачи','Конкретная задача','Методологическая задача']}
COLORS=['#286c23','#006e72','#18559b'];INK='#123c4d'
def rect(x,y,w,h,fill,r=0):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}"/>'
def wrap(s,w,size,lang,bold):
 font=ImageFont.truetype('C:/Windows/Fonts/simsun.ttc' if lang=='zh' else ('C:/Windows/Fonts/arialbd.ttf' if bold else 'C:/Windows/Fonts/arial.ttf'),size)
 tokens=list(s) if lang=='zh' else s.split();words=[]
 for t in tokens:
  if t in [':',';','?','!'] and words:words[-1]+=' '+t
  else:words.append(t)
 lines=[];row='';sep='' if lang=='zh' else ' '
 for word in words:
  trial=(row+sep+word).strip()
  if row and font.getlength(trial)>w:lines.append(row);row=word
  else:row=trial
 if row:lines.append(row)
 return lines
def text(s,x,y,w,size,lang,bold=False,color=INK,maxh=1000):
 for actual in range(size,13,-1):
  lines=wrap(s,w,actual,lang,bold);lead=round(actual*1.30)
  if len(lines)*lead<=maxh:break
 else:raise ValueError((lang,s[:55],w,maxh))
 rtl=lang=='ar';attrs=' direction="rtl" unicode-bidi="plaintext"' if rtl else ''
 family='SimSun, sans-serif' if lang=='zh' else 'Arial, sans-serif'
 return f'<text font-family="{family}" font-size="{actual}" font-weight="{700 if bold else 400}" fill="{color}"{attrs}>'+''.join(f'<tspan x="{x+w if rtl else x}" y="{y+i*lead}">{escape(row)}</tspan>' for i,row in enumerate(lines))+'</text>'
def start(label,w=1600,h=900):return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img" aria-label="{escape(label,quote=True)}">'
def original(n,label):
 buf=BytesIO();Image.open(ROOT/'assets/these/diapos'/f'diapo-{n:02d}.webp').save(buf,format='PNG')
 return start(label)+f'<image width="1600" height="900" href="data:image/png;base64,{base64.b64encode(buf.getvalue()).decode()}"/>'
def save(lang,n,s):
 folder=ROOT/'assets/these/diapos'/(lang if lang!='fr' else '');folder.mkdir(parents=True,exist_ok=True)
 (folder/f'diapo-{n:02d}.svg').write_text(s+'</svg>',encoding='utf8')
for lang,d in ALL.items():
 labels=LABELS[lang]
 s=original(1,d['titre'])+rect(77,258,945,293,'white')+text(d['titre'],87,300,925,36,lang,True,maxh=270);save(lang,1,s)
 s=original(9,d['question'])+rect(119,307,1360,77,'#e8f6f6')+text(d['question'],127,333,1345,25,lang,True,maxh=70);save(lang,9,s)
 unit=STRUCT[lang]
 s=start(unit['titres'][0])+rect(0,0,1600,900,'white')
 s+=text(unit['titres'][0],80,90,1440,38,lang,True,maxh=60)
 s+=text(d['question'],80,170,1440,23,lang,maxh=100)
 contenus=[unit['objectifs'][0][0][0],unit['objectifs'][0][0][1],unit['objectifs'][1][0][1],unit['objectifs'][2][0][0]+' '+unit['objectifs'][2][0][1]]
 for i,contenu in enumerate(contenus):
  x=80+(i%2)*740;y=285+(i//2)*265
  s+=rect(x,y,700,235,['#eaf3fa','#eaf3fa','#eaf7f4','#f0f7e9'][i],12)
  s+=text(unit['titres'][0] if i==0 else 'O'+str(i),x+20,y+45,660,25,lang,True,maxh=50)
  s+=text(contenu,x+20,y+90,660,24,lang,maxh=145)
 save(lang,8,s)
 # Comparaison sans abrégement : les deux catégories sont explicitement distinctes.
 s=start(labels[2]+' · '+labels[3],2400,1350)+rect(0,0,2400,1350,'white')
 s+=text(labels[2]+' · '+labels[3],100,110,2200,44,lang,True,maxh=100)
 s+=text(d['question'],100,215,2200,29,lang,maxh=100)
 for x,label in [(100,labels[2]),(1215,labels[3])]:
  s+=rect(x,315,1085,75,INK,12)+text(label,x+20,365,1045,28,lang,True,'white',maxh=55)
 for i in range(3):
  y=410+i*270
  for x,key in [(100,'objectifs'),(1215,'methodologiques')]:
   s+=rect(x,y,1085,250,['#eaf3fa','#eaf7f4','#f0f7e9'][i],12)
   s+=text('O'+str(i+1),x+20,y+35,1045,27,lang,True,COLORS[i],maxh=40)
   s+=text(d[key][i],x+20,y+72,1045,27,lang,maxh=195)
 s+=text('Éric Bernier · 21 octobre 2026',100,1290,2000,21,lang,color='#607781',maxh=35)
 save(lang,10,s)
 for i,n in enumerate([24,27,28]):
  s=original(n,d['objectifs'][i])+rect(852,249,636,298,'white')
  s+=text(d['objectifs'][i],862,282,615,25,lang,True,maxh=267)
  s+=rect(112,629,632,166,['#eaf3fa','#e8f6f6','#f0f8e9'][i])
  s+=text(d['methodologiques'][i],125,649,606,18,lang,maxh=155)
  save(lang,n,s)
 for i,n in enumerate([11,13,16]):
  s=original(n,d['methodologiques'][i])+rect(90,72,1320,122,'white')
  s+=text(labels[5]+' '+str(i+1),100,94,1300,21,lang,True,maxh=30)
  s+=text(d['methodologiques'][i],100,124,1300,20,lang,maxh=80)
  if n==16:
   s=start(d['methodologiques'][i])+rect(0,0,1600,900,'white')
   s+=text(labels[5]+' 3',80,70,1440,28,lang,True,COLORS[2],maxh=45)
   s+=text(d['methodologiques'][2],80,122,1440,25,lang,maxh=160)
   for k,section in enumerate([unit['objectifs'][2][2],unit['objectifs'][2][3],unit['objectifs'][2][4]]):
    y=310+k*185
    s+=rect(80,y,1440,165,'#f1f6fc',10)
    for j,item in enumerate(section):s+=text(item,100+j*715,y+35,685,23,lang,maxh=140)
  save(lang,n,s)
 for n in [8,9,10]:
  folder=ROOT/'assets/these'/(lang if lang!='fr' else '');folder.mkdir(parents=True,exist_ok=True)
  (folder/f'diapo-methodo-{n:02d}.svg').write_text((ROOT/'assets/these/diapos'/(lang if lang!='fr' else '')/f'diapo-{n:02d}.svg').read_text(encoding='utf8'),encoding='utf8')
print('78 diapositives SVG : formulations et populations harmonisées, six langues.')
