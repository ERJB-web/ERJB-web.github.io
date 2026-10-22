/* Formulations approuvées par l'auteur. Retouche ciblée, sans reconstruction du site. */
const fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..');
const fr=require('./these/fr.json'),en=require('./these/en.json');
const pick=x=>({titre:x.titre,question:x.question,objectifs:x.objectifs});
const forms={fr:pick(fr),en:pick(en),es:{
 titre:'Favorecer la respuesta intersectorial a las diferentes necesidades sociales y de atención de salud concomitantes de las personas mayores que viven en su domicilio: perfiles, cartografía de recursos y análisis de redes.',
 question:'¿Cómo se organiza la respuesta intersectorial a las necesidades sociales y de atención de salud concomitantes de los distintos perfiles de personas mayores que viven en su domicilio?',
 objectifs:[
 'Identificar los distintos perfiles de personas mayores que viven en su domicilio y presentan necesidades sociales y de atención de salud concomitantes que pueden requerir una respuesta intersectorial en el contexto de la atención primaria.',
 'Cartografiar los recursos territoriales que pueden responder a las necesidades sociales y de atención de salud concomitantes de los distintos perfiles de personas mayores que viven en su domicilio, y caracterizar las variaciones territoriales de su disponibilidad, diversidad, complementariedad y accesibilidad.',
 'Analizar las configuraciones organizativas de las redes intersectoriales movilizadas en el territorio para responder a las necesidades sociales y de atención de salud concomitantes de los distintos perfiles de personas mayores que viven en su domicilio, con el fin de caracterizar sus modalidades de funcionamiento.'
 ]},zh:{
 titre:'促进对居家老年人同时存在的不同社会需求和医疗照护需求的跨部门响应：人群特征类型、资源制图与网络分析。',
 question:'如何组织跨部门响应，以满足居家老年人不同特征类型同时存在的社会需求和医疗照护需求？',
 objectifs:[
 '识别居家老年人的不同特征类型：这些人同时存在社会需求和医疗照护需求，可能需要在初级卫生保健背景下获得跨部门响应。',
 '绘制可能满足居家老年人不同特征类型同时存在的社会需求和医疗照护需求的地区资源，并描述其可用性、多样性、互补性和可及性的地区差异。',
 '分析地区内为满足居家老年人不同特征类型同时存在的社会需求和医疗照护需求而动员的跨部门网络的组织配置，以描述其运作方式。'
 ]},ar:{
 titre:'تعزيز الاستجابة المشتركة بين القطاعات لمختلف الاحتياجات الاجتماعية واحتياجات الرعاية الصحية المتزامنة لدى كبار السن الذين يعيشون في منازلهم: الأنماط، ورسم خرائط الموارد، وتحليل الشبكات.',
 question:'كيف تُنظَّم الاستجابة المشتركة بين القطاعات للاحتياجات الاجتماعية واحتياجات الرعاية الصحية المتزامنة لمختلف أنماط كبار السن الذين يعيشون في منازلهم؟',
 objectifs:[
 'تحديد مختلف أنماط كبار السن الذين يعيشون في منازلهم ولديهم احتياجات اجتماعية واحتياجات رعاية صحية متزامنة قد تستلزم استجابة مشتركة بين القطاعات في سياق الرعاية الأولية.',
 'رسم خرائط الموارد المحلية التي يمكن أن تستجيب للاحتياجات الاجتماعية واحتياجات الرعاية الصحية المتزامنة لمختلف أنماط كبار السن الذين يعيشون في منازلهم، وتوصيف التباينات المكانية في توافرها وتنوعها وتكاملها وإمكانية الوصول إليها.',
 'تحليل التشكيلات التنظيمية للشبكات المشتركة بين القطاعات المعبأة في المنطقة للاستجابة للاحتياجات الاجتماعية واحتياجات الرعاية الصحية المتزامنة لمختلف أنماط كبار السن الذين يعيشون في منازلهم، بهدف توصيف آليات عملها.'
 ]},ru:{
 titre:'Содействие межсекторальному ответу на различные одновременно возникающие социальные потребности и потребности в медицинской помощи пожилых людей, живущих дома: профили, картографирование ресурсов и анализ сетей.',
 question:'Как организуется межсекторальный ответ на одновременно возникающие социальные потребности и потребности в медицинской помощи различных профилей пожилых людей, живущих дома?',
 objectifs:[
 'Выявить различные профили пожилых людей, живущих дома, с одновременно возникающими социальными потребностями и потребностями в медицинской помощи, которые могут требовать межсекторального ответа в контексте первичной медицинской помощи.',
 'Картографировать территориальные ресурсы, способные отвечать на одновременно возникающие социальные потребности и потребности в медицинской помощи различных профилей пожилых людей, живущих дома, и охарактеризовать территориальные различия их наличия, разнообразия, взаимодополняемости и доступности.',
 'Проанализировать организационные конфигурации межсекторальных сетей, задействованных на территории для ответа на одновременно возникающие социальные потребности и потребности в медицинской помощи различных профилей пожилых людей, живущих дома, чтобы охарактеризовать способы их функционирования.'
 ]}};
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const aliases=new Map();
for(const [l,v] of Object.entries(forms)){
 const p=path.join(__dirname,'these',l+'.json'),old=JSON.parse(fs.readFileSync(p,'utf8'));
 for(const key of ['titre','question'])if(old[key]&&old[key]!==v[key])aliases.set(old[key],v[key]);
 old.objectifs.forEach((s,i)=>{if(s!==v.objectifs[i])aliases.set(s,v.objectifs[i]);});
 Object.assign(old,v);fs.writeFileSync(p,JSON.stringify(old,null,2)+'\n');
}
const pages=['index.html','methode-vulgarisee.html','innu/index.html','iu/index.html','en/index.html','es/index.html','zh/index.html','ar/index.html','ru/index.html'];
const edits=[];
for(const file of pages){
 const p=path.join(root,file);if(!fs.existsSync(p))continue;
 const before=fs.readFileSync(p,'utf8');const dom=new JSDOM(before,{includeNodeLocations:true}),d=dom.window.document;
 const l=['innu','iu'].includes(file.split('/')[0])?'fr':(d.documentElement.lang||'fr').split('-')[0];const v=forms[l]||forms.fr;
 const changes=new Map();
 const replace=(e,s,bold=false)=>{if(!e)return;const n=dom.nodeLocation(e);if(!n?.startTag||!n.endTag)return;changes.set(n.startTag.endOffset,{a:n.startTag.endOffset,b:n.endTag.startOffset,s:bold?s.replace(/^([^\s]+)(\s+)/,(_,w,g)=>'<strong>'+esc(w)+'</strong>'+g):esc(s)});if(e.textContent.trim()!==s)aliases.set(e.textContent.trim(),s);};
 d.querySelectorAll('.these-introduction h2').forEach(e=>replace(e,v.titre));
 d.querySelectorAll('.these-question-principale p,.these-problematique-bandeau p,.question-these').forEach(e=>replace(e,v.question));
 d.querySelectorAll('.ov-carte[data-objectif],.these-objectifs .objectif-carte[data-objectif]').forEach(e=>{
   const i=+e.dataset.objectif.slice(1)-1;
   const target=e.querySelector('.ov-details .these-formulation')||e.querySelector('p.these-formulation');replace(target,v.objectifs[i],true);
 });
 let after=before;for(const c of [...changes.values()].sort((a,b)=>b.a-a.a))after=after.slice(0,c.a)+c.s+after.slice(c.b);
 if(after!==before){fs.writeFileSync(p,after);edits.push(file);}
}
// Variantes textuelles des mêmes formulations, dont données de narration et descriptions.
for(const dir of ['assets','outils']){
 function walk(folder){for(const e of fs.readdirSync(folder,{withFileTypes:true})){
   const p=path.join(folder,e.name);if(e.isDirectory()){walk(p);continue;}
   if(!/\.(?:js|json|html)$/.test(e.name)||p===__filename||p.endsWith('formulations-recherche.json'))continue;
   let s=fs.readFileSync(p,'utf8'),n=s;
   for(const [a,b]of aliases){if(a.length>70)n=n.split(a).join(b).split(esc(a)).join(esc(b));}
   if(n!==s){fs.writeFileSync(p,n);edits.push(path.relative(root,p));}
 }}walk(path.join(root,dir));
}
for(const file of pages){const p=path.join(root,file);if(!fs.existsSync(p))continue;let s=fs.readFileSync(p,'utf8'),n=s;for(const [a,b]of aliases){if(a.length>70)n=n.split(a).join(esc(b)).split(esc(a)).join(esc(b));}if(n!==s)fs.writeFileSync(p,n);}
fs.writeFileSync(path.join(__dirname,'formulations-recherche.json'),JSON.stringify(forms,null,2)+'\n');
console.log('Formulations mises à jour :', [...new Set(edits)].join(', '));
