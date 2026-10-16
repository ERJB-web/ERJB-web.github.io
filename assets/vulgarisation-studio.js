"use strict";
/* Studio de vulgarisation scientifique : démonstrations pédagogiques, aucun résultat personnel simulé. */
(() => {
  const bound = new WeakSet();
  const initializeSection = (section) => {
    if (!section || bound.has(section)) return;
    bound.add(section);
    // The hall clones the content whenever a room opens; cloneNode(true)
    // does not clone event listeners. Rebuild interactive widgets per instance.
    section.querySelectorAll('.vs-hero,.vs-map,.vs-bridge,.vs-lab,.vs-studio,.vs-video,.vs-trust,.vs-media,.vs-quiz').forEach(el => el.remove());
  const lang = (document.documentElement.lang || 'fr').slice(0, 2).toLowerCase();
  const tr = {
    fr: {
      eyebrow:'LE LABORATOIRE DE VULGARISATION', hero:'Une idée, plusieurs façons de la comprendre', sub:'Explorer un résultat, mettre des chiffres en perspective, tester un format et revenir aux sources. Les démonstrations sont pédagogiques : elles ne présentent pas des résultats de ma recherche.',
      trail:['Observer','Expliquer','Questionner','Partager'], trailDesc:['Établir ce que les données montrent','Trouver un langage intelligible','Examiner les limites et les objections','Ouvrir une discussion utile'],
      key:'Un principe central', keyText:'Rendre une idée accessible ne consiste pas à enlever les nuances : il faut choisir celles qui permettent de comprendre et de juger.',
      mapTitle:'Une information ne circule jamais seule', mapSub:'Dans une question de santé publique, données, expériences vécues et décisions collectives se répondent, sans être interchangeables.', mapNodes:['Données','Expériences','Décisions'], mapDetail:['Méthodes et incertitudes','Situations et besoins','Valeurs et contraintes'], mapCaption:'Schéma de conception, pas modèle causal ni résultat empirique.',
      riskTitle:'Laboratoire des risques : lire un chiffre autrement', riskIntro:'Deux groupes fictifs de 100 personnes. Ajustez les événements du groupe B pour examiner la différence entre points de pourcentage et réduction relative. Même période, même événement, aucune interprétation causale.',
      groupA:'Groupe A',groupB:'Groupe B',change:'Événements dans le groupe B',people:'personnes sur 100',absolute:'Écart absolu',relative:'Écart relatif par rapport au groupe A',ppts:'points de pourcentage',plus:'de plus',less:'de moins',same:'aucune différence',base:'Taux du groupe A',headG:'Groupe',headN:'Avec événement',headWithout:'Sans événement',headRate:'Fréquence',riskNote:'Ces nombres sont inventés pour expliquer la lecture d’un tableau. Comparer deux groupes ne permet pas, à lui seul, d’attribuer un effet à une intervention.',
      bridgeTitle:'Du matériau scientifique à un message public',bridgeSub:'L’information se transforme, mais la traçabilité doit rester intacte.',bridge:['Question étudiée','Méthode et population','Résultat et incertitude','Message accessible','Source et possibilité de discussion'],
      stageTitle:'Studio narratif : cinq cartes pour expliquer un parcours',stageSub:'Exemple fictif sur la coordination des services. Cliquez pour explorer la progression d’un carrousel. Il s’agit d’une maquette, pas d’une publication réalisée.',
      slides:[['Pourquoi plusieurs services ?','Une situation peut associer besoins de santé, de logement et de soutien social.'],['Chaque acteur voit une partie','Le professionnel de santé, le travailleur social et les services de proximité ont des mandats distincts.'],['Le lien compte autant que le nombre','Sans échange, multiplier les acteurs ne suffit pas à assurer une réponse coordonnée.'],['Le contexte change la réponse','Temps, ressources, accords et choix de la personne influencent la coopération.'],['Et maintenant, quelles questions ?','Qui coordonne ? Que souhaite la personne ? Quelles informations peuvent être partagées ?']],
      previous:'Carte précédente',next:'Carte suivante',card:'Carte',of:'sur',stageHint:'Maquette interactive · illustrations schématiques originales',
      mediaTitle:'À regarder, à écouter, à explorer',mediaSub:'Des ressources réellement publiées, à consulter sur les sites de leurs organismes. Elles ne sont pas des productions personnelles.',
      media:[['VIDÉOS ET BALADOS','OMS · Science in 5','Courtes explications de santé publique avec des spécialistes et des épisodes à écouter ou regarder.','https://www.who.int/podcasts/series/science-in-5'],['APPRENTISSAGE INTERACTIF','Cochrane · Evidence Essentials','Parcours pédagogique avec lectures, vidéos, sons et quiz sur les preuves en santé.','https://training.cochrane.org/essentials'],['GRAPHIQUES ET DONNÉES','Our World in Data · Espérance de vie','Explorer un graphique international, changer les pays et consulter les sources et les données.','https://ourworldindata.org/grapher/life-expectancy'],['GUIDE D’ACCESSIBILITÉ','W3C · Audio et vidéo accessibles','Transcriptions, sous-titres, audiodescription et conception accessible dès le scénario.','https://www.w3.org/WAI/media/av/']],
      open:'Explorer la ressource',mediaFoot:'Liens externes · contenus et disponibilités sous la responsabilité des organismes éditeurs.',
      trustTitle:'Dialoguer sans effacer les désaccords',trustSteps:['Écouter les questions','Vérifier les éléments','Montrer les limites','Répondre et corriger'],trustNotes:['Recueillir sans exposer de données privées.','Retrouver méthodes et sources primaires.','Séparer constat, interprétation et choix.','Rendre les corrections visibles et accessibles.'],
      quizTitle:'Testez votre lecture critique',quizIntro:'Trois situations pour s’entraîner à repérer ce qu’un message scientifique peut réellement affirmer. Réponses commentées, sans collecte de données.',
      questions:[
        ['Dans une étude observationnelle, deux variables sont associées. Que peut-on conclure ?', ['La première provoque la seconde.','Une association est observée ; la causalité reste à établir.','Les résultats s’appliquent à toute la population.'],1,'La présence d’une association ne suffit pas à éliminer les facteurs de confusion ou les autres explications.'],
        ['Un risque passe de 20 sur 100 à 10 sur 100. Quelle formulation est juste ?', ['Une baisse de 10 points de pourcentage, soit 50 % en relatif.','Une baisse de 50 points de pourcentage.','Une baisse de 10 % en relatif.'],0,'Le passage de 20 % à 10 % correspond à 10 points en valeur absolue et à la moitié du risque initial.'],
        ['Pour rendre une vidéo scientifique accessible, que faut-il prévoir ?', ['Seulement un visuel plus attrayant.','Uniquement une musique moins forte.','Des sous-titres vérifiés, une transcription et la description des éléments visuels nécessaires.'],2,'Une transcription, des sous-titres et une description adaptée rendent l’information utilisable par davantage de personnes.']
      ],
      validate:'Vérifier la réponse',continue:'Question suivante',restart:'Recommencer',right:'Bonne réponse',wrong:'À revoir',score:'Résultat',scoreEnd:'bonnes réponses sur 3',quizSource:'Pour aller plus loin : Cochrane Evidence Essentials et les recommandations du W3C.'
    },
    en: {
      eyebrow:'SCIENCE COMMUNICATION LAB',hero:'One idea, many ways to understand it',sub:'Examine findings, put numbers into context, test a format and return to the sources. These are educational demonstrations, not results from my research.',
      trail:['Observe','Explain','Question','Share'],trailDesc:['Establish what data show','Find understandable language','Consider limitations and objections','Open a useful discussion'],
      key:'A guiding principle',keyText:'Making an idea accessible does not mean removing nuance: it means choosing the nuances that support understanding and judgement.',
      mapTitle:'Information never travels alone',mapSub:'In public health, data, lived experience and collective decisions inform each other without being interchangeable.',mapNodes:['Data','Experience','Decisions'],mapDetail:['Methods and uncertainty','Situations and needs','Values and constraints'],mapCaption:'Conceptual diagram, not a causal model or empirical finding.',
      riskTitle:'Risk lab: looking at numbers differently',riskIntro:'Two fictional groups of 100 people. Adjust events in group B to compare percentage points and relative difference. Same period and outcome, with no causal claim.',
      groupA:'Group A',groupB:'Group B',change:'Events in group B',people:'people out of 100',absolute:'Absolute difference',relative:'Relative difference compared with group A',ppts:'percentage points',plus:'more',less:'fewer',same:'no difference',base:'Group A rate',headG:'Group',headN:'With event',headWithout:'Without event',headRate:'Frequency',riskNote:'These figures are invented for learning. Comparing groups alone does not demonstrate an intervention effect.',
      bridgeTitle:'From evidence to a public message',bridgeSub:'The form changes, but the evidence trail must remain visible.',bridge:['Research question','Method and population','Finding and uncertainty','Accessible message','Source and discussion'],
      stageTitle:'Story studio: five cards to explain a journey',stageSub:'A fictional example about service coordination. Explore a sample carousel; it is not a published post.',
      slides:[['Why several services?','A person may face health, housing and social-support needs together.'],['Each actor sees a part','Health professionals, social workers and community services have different responsibilities.'],['Connections matter','Adding actors does not automatically ensure coordination.'],['Context shapes action','Time, resources, agreements and individual preferences shape cooperation.'],['What would you ask?','Who coordinates? What does the person want? What can be shared?']],
      previous:'Previous card',next:'Next card',card:'Card',of:'of',stageHint:'Interactive mock-up · original schematic illustrations',
      mediaTitle:'Watch, listen and explore',mediaSub:'Published resources from institutional and academic organizations. These are not my own productions.',
      media:[['VIDEO & AUDIO','WHO · Science in 5','Short public-health conversations with experts and episodes to watch or listen to.','https://www.who.int/podcasts/series/science-in-5'],['INTERACTIVE LEARNING','Cochrane · Evidence Essentials','An educational path with reading, video, audio and quizzes about health evidence.','https://training.cochrane.org/essentials'],['DATA & CHARTS','Our World in Data · Life expectancy','Explore countries, charts and their underlying methods and sources.','https://ourworldindata.org/grapher/life-expectancy'],['ACCESSIBILITY','W3C · Accessible audio and video','Captions, transcripts, descriptions and accessible planning.','https://www.w3.org/WAI/media/av/']],
      open:'Visit resource',mediaFoot:'External links · availability and content are managed by the publishers.',
      trustTitle:'Disagree without losing the dialogue',trustSteps:['Listen','Verify','Acknowledge limits','Respond and correct'],trustNotes:['Avoid collecting private information.','Return to methods and original sources.','Distinguish findings, interpretations and choices.','Make corrections accessible and visible.'],
      quizTitle:'Check your critical reading',quizIntro:'Three scenarios with explanations. No data collected.',
      questions:[['Two variables are associated in an observational study. What follows?',['One causes the other.','An association is observed; causality is not established.','It applies to everyone.'],1,'An association alone cannot rule out confounding or alternative explanations.'],['A risk falls from 20 in 100 to 10 in 100. What is correct?',['10 percentage points, or 50% relatively.','50 percentage points.','10% relatively.'],0,'It is a 10-point absolute difference and half the baseline risk.'],['What helps make a scientific video accessible?',['Only attractive visuals.','Only quieter music.','Reviewed captions, a transcript and descriptions of necessary visual content.'],2,'Multiple alternatives help different audiences access the content.']],
      validate:'Check answer',continue:'Next question',restart:'Try again',right:'Correct',wrong:'Review this',score:'Your score',scoreEnd:'correct out of 3',quizSource:'Further reading: Cochrane Evidence Essentials and W3C guidance.'
    },
    es: {
      eyebrow:'LABORATORIO DE DIVULGACIÓN',hero:'Una idea, distintas formas de comprenderla',sub:'Examinar resultados, contextualizar cifras, probar un formato y consultar las fuentes. Son demostraciones didácticas, no resultados de mi investigación.',
      trail:['Observar','Explicar','Cuestionar','Compartir'],trailDesc:['Determinar qué muestran los datos','Utilizar un lenguaje comprensible','Reconocer límites y objeciones','Abrir un diálogo útil'],
      key:'Un principio central',keyText:'Hacer accesible una idea no exige eliminar los matices, sino seleccionar los que ayudan a comprender y juzgar.',
      mapTitle:'La información nunca circula sola',mapSub:'Datos, experiencias vividas y decisiones colectivas se influyen sin ser intercambiables.',mapNodes:['Datos','Experiencias','Decisiones'],mapDetail:['Métodos e incertidumbre','Situaciones y necesidades','Valores y límites'],mapCaption:'Esquema conceptual; no es un modelo causal ni un resultado empírico.',
      riskTitle:'Laboratorio de riesgos',riskIntro:'Dos grupos ficticios de 100 personas. Ajuste los eventos del grupo B para comparar la diferencia absoluta y la relativa, sin atribuir causalidad.',
      groupA:'Grupo A',groupB:'Grupo B',change:'Eventos en el grupo B',people:'personas de 100',absolute:'Diferencia absoluta',relative:'Diferencia relativa frente al grupo A',ppts:'puntos porcentuales',plus:'más',less:'menos',same:'sin diferencia',base:'Tasa del grupo A',headG:'Grupo',headN:'Con evento',headWithout:'Sin evento',headRate:'Frecuencia',riskNote:'Cifras inventadas con fines educativos. La comparación por sí sola no demuestra efectos causales.',
      bridgeTitle:'De la evidencia al mensaje público',bridgeSub:'Cambia la forma, no la trazabilidad.',bridge:['Pregunta','Método y población','Resultados e incertidumbre','Mensaje comprensible','Fuentes y debate'],
      stageTitle:'Taller narrativo: cinco tarjetas',stageSub:'Ejemplo ficticio de coordinación de servicios. Es una maqueta interactiva, no una publicación real.',
      slides:[['¿Por qué varios servicios?','Una persona puede necesitar apoyo sanitario, social y de vivienda.'],['Cada actor ve una parte','La atención sanitaria, el trabajo social y los servicios comunitarios tienen funciones distintas.'],['Importan las conexiones','Más actores no implican automáticamente mayor coordinación.'],['El contexto importa','Tiempo, recursos y preferencias personales influyen en la cooperación.'],['¿Qué preguntarías?','¿Quién coordina? ¿Qué quiere la persona? ¿Qué puede compartirse?']],
      previous:'Anterior',next:'Siguiente',card:'Tarjeta',of:'de',stageHint:'Maqueta interactiva · ilustraciones esquemáticas originales',
      mediaTitle:'Ver, escuchar y explorar',mediaSub:'Recursos reales de organizaciones científicas, no producciones personales.',
      media:[['VÍDEO Y AUDIO','OMS · Science in 5','Explicaciones breves de salud pública por especialistas.','https://www.who.int/podcasts/series/science-in-5'],['APRENDIZAJE','Cochrane · Evidence Essentials','Lecturas, vídeos, audios y cuestionarios sobre evidencia en salud.','https://training.cochrane.org/essentials'],['GRÁFICOS','Our World in Data · Esperanza de vida','Explorar países y consultar datos y fuentes.','https://ourworldindata.org/grapher/life-expectancy'],['ACCESIBILIDAD','W3C · Audio y vídeo accesibles','Subtítulos, transcripciones y descripciones visuales.','https://www.w3.org/WAI/media/av/']],
      open:'Abrir recurso',mediaFoot:'Enlaces externos · contenidos gestionados por sus editores.',
      trustTitle:'Dialogar a pesar del desacuerdo',trustSteps:['Escuchar','Verificar','Mostrar límites','Responder y corregir'],trustNotes:['Proteger datos personales.','Consultar métodos y fuentes.','Separar hechos y decisiones.','Hacer visibles las correcciones.'],
      quizTitle:'Pon a prueba tu lectura crítica',quizIntro:'Tres preguntas comentadas, sin recopilar datos.',
      questions:[['Dos variables se asocian en un estudio observacional. ¿Qué implica?',['Una causa la otra.','Existe una asociación; no se demuestra causalidad.','Se aplica a todas las personas.'],1,'Una asociación no excluye factores de confusión.'],['Un riesgo baja de 20 de cada 100 a 10 de cada 100.',['Baja 10 puntos porcentuales, un 50 % relativo.','Baja 50 puntos porcentuales.','Baja 10 % relativo.'],0,'La diferencia absoluta es de 10 puntos; la relativa es la mitad del riesgo inicial.'],['¿Qué requiere un vídeo accesible?',['Solo mejores imágenes.','Solo bajar la música.','Subtítulos revisados, transcripción y descripciones visuales pertinentes.'],2,'Las alternativas ofrecen acceso a públicos diversos.']],
      validate:'Comprobar',continue:'Siguiente pregunta',restart:'Reiniciar',right:'Correcto',wrong:'Para revisar',score:'Resultado',scoreEnd:'aciertos de 3',quizSource:'Recursos: Cochrane Evidence Essentials y W3C.'
    },
    zh: {
      eyebrow:'科学传播互动实验室',hero:'一个观点，多种理解方式',sub:'解读研究结果、理解数据、体验传播形式，并查阅原始来源。以下均为教学示例，不代表本人的研究结果。',
      trail:['观察','解释','提问','分享'],trailDesc:['确认数据揭示了什么','选择易懂的表达','审视局限和不同意见','开启有意义的对话'],
      key:'核心原则',keyText:'通俗易懂不意味着删去不确定性，而是保留理解与判断所需的关键信息。',
      mapTitle:'信息从不孤立传播',mapSub:'在公共卫生领域，数据、亲身经历和集体决策相互关联，但不可混为一谈。',mapNodes:['数据','经历','决策'],mapDetail:['方法与不确定性','情境与需求','价值与约束'],mapCaption:'概念示意图，不是因果模型或实证结果。',
      riskTitle:'风险实验室：解读数字',riskIntro:'两组各100人的虚构数据。调整B组事件数，比较百分点差与相对差异，不做因果推断。',
      groupA:'A组',groupB:'B组',change:'B组事件数',people:'每100人',absolute:'绝对差异',relative:'相对于A组的差异',ppts:'个百分点',plus:'增加',less:'减少',same:'无差异',base:'A组发生率',headG:'组别',headN:'发生',headWithout:'未发生',headRate:'比例',riskNote:'以上数字纯属教学示例。组间比较本身不能证明干预效果。',
      bridgeTitle:'从证据到公众信息',bridgeSub:'表达方式可以改变，证据链必须保留。',bridge:['研究问题','方法与研究对象','结果与不确定性','易懂的信息','来源与讨论'],
      stageTitle:'叙事工作室：五张卡片',stageSub:'服务协调的虚构案例。可互动浏览，尚未发表为真实作品。',
      slides:[['为什么需要多种服务？','一人可能同时需要医疗、住房与社会支持。'],['各方只看到部分情况','医护人员、社工与社区机构职责各异。'],['连接比数量更重要','参与者增多并不自动带来协调。'],['情境影响行动','时间、资源与个人意愿都会影响合作。'],['接下来问什么？','由谁协调？本人希望什么？哪些信息可以共享？']],
      previous:'上一张',next:'下一张',card:'第',of:'共',stageHint:'互动样例 · 原创示意插图',
      mediaTitle:'观看、聆听、探索',mediaSub:'机构正式发布的资源，并非本人的作品。',
      media:[['音视频','世卫组织 · Science in 5','专家提供的简短公共卫生说明。','https://www.who.int/podcasts/series/science-in-5'],['互动学习','Cochrane · Evidence Essentials','关于卫生证据的阅读、视频、音频和测验。','https://training.cochrane.org/essentials'],['数据图表','Our World in Data · 预期寿命','查看国家比较、数据和来源。','https://ourworldindata.org/grapher/life-expectancy'],['无障碍指南','W3C · 无障碍音视频','字幕、文字稿及视觉内容描述。','https://www.w3.org/WAI/media/av/']],
      open:'查看资源',mediaFoot:'外部链接，内容由发布机构负责。',
      trustTitle:'保留分歧，继续对话',trustSteps:['倾听','核实','说明局限','回应与更正'],trustNotes:['保护个人隐私。','核对方法和原始来源。','区分事实和选择。','公开提供更正。'],
      quizTitle:'检验科学阅读能力',quizIntro:'三道附解释的练习题，不收集数据。',
      questions:[['观察性研究发现两个变量有关联，可以得出什么结论？',['前者导致后者。','观察到关联，但不能据此确定因果。','结果适用于所有人。'],1,'相关性不能排除混杂因素。'],['风险从每100人20例降至10例，哪项正确？',['下降10个百分点，相对下降50%。','下降50个百分点。','相对下降10%。'],0,'绝对差为10个百分点，相对差为原风险的一半。'],['什么有助于视频无障碍？',['只增加精美画面。','只降低背景音乐。','校对字幕、文字稿及必要的视觉描述。'],2,'多种呈现方式可满足不同人群的需要。']],
      validate:'核对答案',continue:'下一题',restart:'重新开始',right:'回答正确',wrong:'请再思考',score:'成绩',scoreEnd:'题正确（共3题）',quizSource:'延伸阅读：Cochrane Evidence Essentials 与 W3C 指南。'
    },
    ar: {
      eyebrow:'مختبر التواصل العلمي',hero:'فكرة واحدة، وطرق متعددة لفهمها',sub:'استكشاف النتائج ووضع الأرقام في سياقها وتجربة أساليب العرض والعودة إلى المصادر. هذه أمثلة تعليمية وليست نتائج من أبحاثي.',
      trail:['ملاحظة','شرح','تساؤل','مشاركة'],trailDesc:['تحديد ما تظهره البيانات','اختيار لغة مفهومة','فحص الحدود والاعتراضات','فتح حوار مفيد'],
      key:'مبدأ أساسي',keyText:'لا تعني إتاحة الفكرة للجميع حذف الفروق الدقيقة، بل إبراز ما يساعد على الفهم والحكم.',
      mapTitle:'المعلومة لا تنتقل وحدها',mapSub:'تتفاعل البيانات والتجارب المعيشة والقرارات الجماعية دون أن تكون قابلة للاستبدال.',mapNodes:['البيانات','التجارب','القرارات'],mapDetail:['المنهج وعدم اليقين','السياق والاحتياجات','القيم والقيود'],mapCaption:'رسم مفاهيمي توضيحي، وليس نموذجاً سببياً أو نتيجة تجريبية.',
      riskTitle:'مختبر المخاطر: قراءة الأرقام',riskIntro:'مجموعتان افتراضيتان من 100 شخص. غيّر عدد الأحداث في المجموعة ب لمقارنة الفرق المطلق والنسبي دون افتراض السببية.',
      groupA:'المجموعة أ',groupB:'المجموعة ب',change:'الأحداث في المجموعة ب',people:'من كل 100 شخص',absolute:'الفرق المطلق',relative:'الفرق النسبي مقارنة بالمجموعة أ',ppts:'نقطة مئوية',plus:'أكثر',less:'أقل',same:'لا فرق',base:'معدل المجموعة أ',headG:'المجموعة',headN:'مع الحدث',headWithout:'دون الحدث',headRate:'النسبة',riskNote:'الأرقام مختلقة للتعليم، والمقارنة وحدها لا تثبت تأثير أي تدخل.',
      bridgeTitle:'من الدليل إلى الرسالة العامة',bridgeSub:'يتغير الشكل ولكن يجب الحفاظ على مصدر الدليل.',bridge:['السؤال البحثي','المنهج والعينة','النتيجة وعدم اليقين','رسالة مفهومة','المصدر والنقاش'],
      stageTitle:'ورشة السرد: خمس بطاقات',stageSub:'مثال افتراضي حول تنسيق الخدمات. نموذج تفاعلي وليس منشوراً فعلياً.',
      slides:[['لماذا خدمات متعددة؟','قد يحتاج الشخص إلى الصحة والسكن والدعم الاجتماعي معاً.'],['كل طرف يرى جانباً','تختلف أدوار الرعاية الصحية والعمل الاجتماعي والخدمات المجتمعية.'],['الروابط مهمة','زيادة الأطراف لا تعني تنسيقاً أفضل تلقائياً.'],['السياق يصنع الفرق','تؤثر الموارد والوقت وخيارات الشخص في التعاون.'],['ما السؤال التالي؟','من ينسّق؟ ماذا يريد الشخص؟ ما المعلومات التي يمكن مشاركتها؟']],
      previous:'السابق',next:'التالي',card:'البطاقة',of:'من',stageHint:'نموذج تفاعلي · رسوم توضيحية أصلية',
      mediaTitle:'شاهد واستمع واستكشف',mediaSub:'موارد منشورة من مؤسسات علمية وليست من إنتاجي.',
      media:[['فيديو وصوت','WHO · Science in 5','شروح قصيرة للصحة العامة يقدمها متخصصون.','https://www.who.int/podcasts/series/science-in-5'],['تعلم تفاعلي','Cochrane · Evidence Essentials','قراءات ومقاطع واختبارات حول الأدلة الصحية.','https://training.cochrane.org/essentials'],['بيانات ورسوم','Our World in Data · العمر المتوقع','رسوم تفاعلية مع البيانات والمصادر.','https://ourworldindata.org/grapher/life-expectancy'],['إمكانية الوصول','W3C · الوسائط المتاحة','الترجمة النصية والتفريغ ووصف المعلومات المرئية.','https://www.w3.org/WAI/media/av/']],
      open:'فتح المورد',mediaFoot:'روابط خارجية؛ محتواها مسؤولية الجهات الناشرة.',
      trustTitle:'حوار يحترم الاختلاف',trustSteps:['الاستماع','التحقق','بيان الحدود','الرد والتصحيح'],trustNotes:['حماية الخصوصية.','مراجعة المنهج والمصادر.','الفصل بين النتائج والاختيارات.','إظهار التصحيحات للجميع.'],
      quizTitle:'اختبر قراءتك النقدية',quizIntro:'ثلاثة أسئلة مع الشرح، دون جمع بيانات.',
      questions:[['وجدت دراسة رصدية ارتباطاً بين متغيرين. ما الاستنتاج؟',['أحدهما يسبب الآخر.','توجد علاقة، لكن السببية غير مثبتة.','تنطبق النتائج على الجميع.'],1,'لا يكفي الارتباط لاستبعاد العوامل المربكة.'],['انخفض خطر من 20 إلى 10 من كل 100. ما الصحيح؟',['انخفاض 10 نقاط مئوية، أو 50٪ نسبياً.','انخفاض 50 نقطة مئوية.','انخفاض نسبي 10٪.'],0,'الفرق المطلق 10 نقاط والنسبـي نصف الخطر الأولي.'],['كيف نجعل الفيديو العلمي متاحاً؟',['بتحسين الصور فقط.','بخفض الموسيقى فقط.','بتوفير ترجمة نصية مراجعة وتفريغ ووصف بصري عند الحاجة.'],2,'تدعم البدائل الوصول لفئات مختلفة.']],
      validate:'تحقق',continue:'السؤال التالي',restart:'ابدأ من جديد',right:'إجابة صحيحة',wrong:'للمراجعة',score:'النتيجة',scoreEnd:'إجابات صحيحة من 3',quizSource:'للمزيد: Cochrane Evidence Essentials وإرشادات W3C.'
    },
    ru: {
      eyebrow:'ЛАБОРАТОРИЯ НАУЧНОЙ КОММУНИКАЦИИ',hero:'Одна идея — много способов понять её',sub:'Исследуйте результаты, сопоставляйте числа, пробуйте форматы и обращайтесь к источникам. Это учебные примеры, а не результаты моей работы.',
      trail:['Наблюдать','Объяснять','Спрашивать','Делиться'],trailDesc:['Установить, что показывают данные','Найти понятные слова','Оценить ограничения и возражения','Открыть содержательный диалог'],
      key:'Главный принцип',keyText:'Доступность не требует отказываться от нюансов: важно сохранить то, что помогает понять и оценить.',
      mapTitle:'Информация не существует в вакууме',mapSub:'Данные, жизненный опыт и коллективные решения связаны между собой, но не взаимозаменяемы.',mapNodes:['Данные','Опыт','Решения'],mapDetail:['Методы и неопределённость','Ситуации и потребности','Ценности и ограничения'],mapCaption:'Концептуальная схема, не причинная модель и не результат исследования.',
      riskTitle:'Лаборатория рисков: как читать числа',riskIntro:'Две вымышленные группы по 100 человек. Меняйте число событий в группе Б и сравнивайте абсолютное и относительное различие без причинных выводов.',
      groupA:'Группа А',groupB:'Группа Б',change:'События в группе Б',people:'из 100 человек',absolute:'Абсолютная разница',relative:'Относительная разница к группе А',ppts:'процентных пунктов',plus:'больше',less:'меньше',same:'без разницы',base:'Частота в группе А',headG:'Группа',headN:'Событие',headWithout:'Без события',headRate:'Частота',riskNote:'Все числа придуманы для обучения. Одно сравнение не доказывает эффект вмешательства.',
      bridgeTitle:'От доказательств к публичному сообщению',bridgeSub:'Форма меняется, связь с источниками должна сохраняться.',bridge:['Вопрос','Метод и участники','Результат и неопределённость','Понятное сообщение','Источник и обсуждение'],
      stageTitle:'Студия историй: пять карточек',stageSub:'Вымышленный пример координации служб. Это интерактивный макет, а не опубликованный материал.',
      slides:[['Зачем несколько служб?','Человеку может требоваться помощь со здоровьем, жильём и социальной поддержкой.'],['Каждый видит свою часть','У врачей, социальных работников и общественных служб разные роли.'],['Важны связи','Больше участников не означает лучшую координацию.'],['Контекст влияет на действия','Время, ресурсы и пожелания человека определяют сотрудничество.'],['О чём спросить?','Кто координирует? Чего хочет человек? Что можно сообщать другим?']],
      previous:'Назад',next:'Далее',card:'Карточка',of:'из',stageHint:'Интерактивный макет · оригинальные схематические рисунки',
      mediaTitle:'Смотреть, слушать, исследовать',mediaSub:'Реальные материалы научных организаций, а не мои собственные публикации.',
      media:[['ВИДЕО И АУДИО','ВОЗ · Science in 5','Короткие объяснения по общественному здоровью.','https://www.who.int/podcasts/series/science-in-5'],['ИНТЕРАКТИВ','Cochrane · Evidence Essentials','Чтение, видео, аудио и тесты о медицинских доказательствах.','https://training.cochrane.org/essentials'],['ГРАФИКИ','Our World in Data · Продолжительность жизни','Сравнения стран, данные и источники.','https://ourworldindata.org/grapher/life-expectancy'],['ДОСТУПНОСТЬ','W3C · Доступное аудио и видео','Субтитры, расшифровки и описание изображений.','https://www.w3.org/WAI/media/av/']],
      open:'Открыть источник',mediaFoot:'Внешние ссылки: за содержимое отвечают издатели.',
      trustTitle:'Диалог с уважением к разногласиям',trustSteps:['Слушать','Проверять','Признавать границы','Отвечать и исправлять'],trustNotes:['Беречь личные данные.','Проверять методы и первоисточники.','Разделять выводы и решения.','Показывать исправления открыто.'],
      quizTitle:'Проверьте критическое мышление',quizIntro:'Три задачи с пояснениями, без сбора данных.',
      questions:[['В наблюдательном исследовании найдена связь переменных. Что верно?',['Одна вызывает другую.','Обнаружена связь, но причинность не установлена.','Вывод применим ко всем.'],1,'Связь сама по себе не исключает смешивающие факторы.'],['Риск снизился с 20 до 10 на 100. Что верно?',['На 10 процентных пунктов, или на 50% относительно.','На 50 процентных пунктов.','На 10% относительно.'],0,'Абсолютная разница — 10 пунктов, относительная — половина исходного риска.'],['Что нужно для доступного научного видео?',['Только красивые иллюстрации.','Только тихая музыка.','Проверенные субтитры, расшифровка и описание нужной визуальной информации.'],2,'Альтернативные форматы делают информацию доступнее.']],
      validate:'Проверить',continue:'Следующий вопрос',restart:'Начать снова',right:'Верно',wrong:'Проверьте ещё раз',score:'Результат',scoreEnd:'верных ответов из 3',quizSource:'Подробнее: Cochrane Evidence Essentials и рекомендации W3C.'
    }
  };
  const t = tr[lang] || tr.fr;
  const $ = (q, root = section) => root.querySelector(q);
  const h = (tag, className, html) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (html !== undefined) el.innerHTML = html;
    return el;
  };
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const panel = n => section.querySelector('[data-rubriques="vulgarisation"] > [data-volet="' + n + '"] .rubrique-contenu');
  const chain = h('section','vs-hero','<div class="vs-hero-copy"><p class="vs-eyebrow">' + escape(t.eyebrow) + '</p><h3>' + escape(t.hero) + '</h3><p>' + escape(t.sub) + '</p><div class="vs-principle"><strong>' + escape(t.key) + '</strong><span>' + escape(t.keyText) + '</span></div></div><div class="vs-hero-art" aria-label="' + escape(t.trail.join(' → ')) + '"><div class="vs-art-orbit"><span>01</span><span>02</span><span>03</span><span>04</span><i></i></div><ol>' + t.trail.map((v,i) => '<li><b>' + escape(v) + '</b><small>' + escape(t.trailDesc[i]) + '</small></li>').join('') + '</ol></div>');
  const gallery = $('.vul-galerie');
  if (gallery) gallery.before(chain);

  const map = h('figure','vs-map','<figcaption><strong>' + escape(t.mapTitle) + '</strong><span>' + escape(t.mapSub) + '</span></figcaption><div class="vs-map-nodes">' + t.mapNodes.map((n,i) => '<article><div class="vs-map-symbol">' + ['◎','◇','↗'][i] + '</div><h5>' + escape(n) + '</h5><p>' + escape(t.mapDetail[i]) + '</p></article>').join('') + '</div><p class="vs-micro">' + escape(t.mapCaption) + '</p>');
  if (panel(0)) panel(0).insertBefore(map,panel(0).firstChild);

  const bridge = h('section','vs-bridge','<header><h4>' + escape(t.bridgeTitle) + '</h4><p>' + escape(t.bridgeSub) + '</p></header><ol>' + t.bridge.map((v,i)=>'<li><span>' + String(i+1).padStart(2,'0') + '</span><strong>' + escape(v) + '</strong></li>').join('') + '</ol>');
  if (panel(2)) panel(2).append(bridge);

  const risk = h('section','vs-lab');
  risk.innerHTML = '<header class="vs-head"><span class="vs-kicker">01 / DATA LAB</span><h4>' + escape(t.riskTitle) + '</h4><p>' + escape(t.riskIntro) + '</p></header><div class="vs-risk-controls"><label for="vs-risk-range">' + escape(t.change) + '</label><output id="vs-risk-count" for="vs-risk-range">10 / 100</output><input id="vs-risk-range" type="range" min="0" max="60" step="1" value="10"></div><div class="vs-bars" role="img"><div><label>' + escape(t.groupA) + '</label><div class="vs-bar-rail"><span class="vs-bar-a" style="width:20%"></span></div><b>20 / 100</b></div><div><label>' + escape(t.groupB) + '</label><div class="vs-bar-rail"><span class="vs-bar-b" style="width:10%"></span></div><b id="vs-risk-bar-text">10 / 100</b></div></div><div class="vs-risk-stats"><article><small>' + escape(t.absolute) + '</small><strong id="vs-absolute">10</strong><span>' + escape(t.ppts) + '</span></article><article><small>' + escape(t.relative) + '</small><strong id="vs-relative">50 %</strong><span id="vs-relative-label">' + escape(t.less) + '</span></article></div><div class="vs-table-wrap"><table><caption>' + escape(t.riskTitle) + '</caption><thead><tr>' + [t.headG,t.headN,t.headWithout,t.headRate].map(x=>'<th scope="col">' + escape(x) + '</th>').join('') + '</tr></thead><tbody><tr><th scope="row">' + escape(t.groupA) + '</th><td>20</td><td>80</td><td>20 %</td></tr><tr><th scope="row">' + escape(t.groupB) + '</th><td id="vs-table-yes">10</td><td id="vs-table-no">90</td><td id="vs-table-percent">10 %</td></tr></tbody></table></div><p class="vs-micro">' + escape(t.riskNote) + '</p>';
  if (panel(1)) panel(1).append(risk);
  const slider = $('#vs-risk-range');
  if (slider) slider.addEventListener('input',()=>{
    const n=Number(slider.value),d=Math.abs(20-n),ratio=Math.round((n-20)/20*100);
    $('#vs-risk-count').textContent = n + ' / 100';
    $('.vs-bar-b').style.width = n + '%';
    $('#vs-risk-bar-text').textContent = n + ' / 100';
    $('#vs-absolute').textContent = d;
    $('#vs-relative').textContent = Math.abs(ratio) + ' %';
    $('#vs-relative-label').textContent = ratio > 0 ? t.plus : ratio < 0 ? t.less : t.same;
    $('#vs-table-yes').textContent = n;
    $('#vs-table-no').textContent = 100-n;
    $('#vs-table-percent').textContent = n + ' %';
    $('.vs-bars').setAttribute('aria-label',t.groupA+': 20 / 100; '+t.groupB+': '+n+' / 100');
  });
  if ($('.vs-bars')) $('.vs-bars').setAttribute('aria-label',t.groupA+': 20 / 100; '+t.groupB+': 10 / 100');

  const studio = h('section','vs-studio','<header class="vs-head"><span class="vs-kicker">02 / STORYBOARD</span><h4>' + escape(t.stageTitle) + '</h4><p>' + escape(t.stageSub) + '</p></header><div class="vs-screen"><div class="vs-screen-art" aria-hidden="true"><div class="vs-scene vs-scene-0"><span>+</span><span>+</span><span>+</span><i></i></div></div><div class="vs-screen-copy" aria-live="polite" aria-atomic="true"><small id="vs-slide-number"></small><h5 id="vs-slide-title"></h5><p id="vs-slide-text"></p></div></div><div class="vs-stage-bottom"><button type="button" class="vs-stage-prev">' + escape(t.previous) + '</button><div class="vs-stage-dots" aria-hidden="true">' + t.slides.map((_,i)=>'<span data-dot="' + i + '"></span>').join('') + '</div><button type="button" class="vs-stage-next">' + escape(t.next) + ' →</button></div><p class="vs-micro">' + escape(t.stageHint) + '</p>');
  if (panel(3)) panel(3).insertBefore(studio,panel(3).firstChild);
  let slide=0;
  const updateSlide=()=>{
    if(!$('.vs-screen'))return;
    $('#vs-slide-number').textContent = t.card + ' ' + (slide+1) + ' ' + t.of + ' 5';
    $('#vs-slide-title').textContent = t.slides[slide][0];
    $('#vs-slide-text').textContent = t.slides[slide][1];
    $('.vs-screen-art').firstElementChild.className = 'vs-scene vs-scene-'+slide;
    $('.vs-stage-prev').disabled = slide===0;
    $('.vs-stage-next').disabled = slide===4;
    section.querySelectorAll('[data-dot]').forEach((node,i)=>node.classList.toggle('active',i===slide));
  };
  if ($('.vs-screen')){updateSlide();$('.vs-stage-prev').addEventListener('click',()=>{slide=Math.max(0,slide-1);updateSlide();});$('.vs-stage-next').addEventListener('click',()=>{slide=Math.min(4,slide+1);updateSlide();});}

  /* Vidéo officielle : chargement différé et déclenché par l'utilisateur. */
  const watchLabel={fr:'Regarder cette vidéo',en:'Watch this video',es:'Ver este vídeo',zh:'观看视频',ar:'مشاهدة الفيديو',ru:'Посмотреть видео'};
  const watchNote={fr:'OMS, Science in 5, « Future of Health » (2022). Le lecteur YouTube n’est chargé qu’après votre clic. Les sous-titres disponibles sont gérés par YouTube.',en:'WHO, Science in 5, “Future of Health” (2022). The YouTube player loads only after you click; captions are managed by YouTube.',es:'OMS, Science in 5, « Future of Health » (2022). El reproductor de YouTube se carga al pulsar; los subtítulos dependen de YouTube.',zh:'世界卫生组织 Science in 5《Future of Health》（2022）。点击后才加载 YouTube 播放器；字幕由 YouTube 提供。',ar:'منظمة الصحة العالمية، Science in 5، «Future of Health» (2022). لا يُحمَّل مشغّل يوتيوب إلا بعد النقر، وتدير يوتيوب الترجمات.',ru:'ВОЗ, Science in 5, «Future of Health» (2022). Проигрыватель YouTube загружается только после нажатия; субтитры доступны на YouTube.'};
  const youtubeUrl='https://www.youtube.com/watch?v=J4tTzjFEECE';
  const videoShell=h('section','vs-video','<div class="vs-video-copy"><span class="vs-kicker">05 / VIDEO</span><h4>WHO · Science in 5</h4><p>'+escape(t.media[0][2])+'</p><p class="vs-micro">'+escape(watchNote[lang]||watchNote.fr)+'</p><button type="button" class="vs-video-play">'+escape(watchLabel[lang]||watchLabel.fr)+' ▶</button><a href="'+youtubeUrl+'" target="_blank" rel="noopener noreferrer">YouTube ↗</a></div><div class="vs-video-preview"><div class="vs-video-poster" aria-hidden="true"><span>▶</span><b>WORLD HEALTH ORGANIZATION</b><small>Science in 5 · Future of Health</small></div></div>');
  if(panel(3)&&$('.vs-studio')){
    $('.vs-studio').after(videoShell);
    $('.vs-video-play').addEventListener('click',()=>{
      const frame=document.createElement('iframe');
      frame.src='https://www.youtube-nocookie.com/embed/J4tTzjFEECE?rel=0';
      frame.title='WHO Science in 5: Future of Health (2022)';
      frame.loading='lazy';frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';frame.allowFullscreen=true;
      $('.vs-video-preview').replaceChildren(frame);
      $('.vs-video-play').disabled=true;
    });
  }

  const trust = h('section','vs-trust','<h4>' + escape(t.trustTitle) + '</h4><div>' + t.trustSteps.map((v,i)=>'<article><b>0'+(i+1)+'</b><strong>'+escape(v)+'</strong><p>'+escape(t.trustNotes[i])+'</p></article>').join('')+'</div>');
  if(panel(4))panel(4).append(trust);

  const media = h('section','vs-media','<header class="vs-head"><span class="vs-kicker">03 / MEDIA LIBRARY</span><h4>' + escape(t.mediaTitle) + '</h4><p>' + escape(t.mediaSub) + '</p></header><div class="vs-media-grid">' + t.media.map((m,i)=>'<article class="vs-media-card"><div class="vs-media-visual vs-media-visual-'+i+'" aria-hidden="true"><span>'+['▶','◈','▥','CC'][i]+'</span></div><div class="vs-media-info"><small>'+escape(m[0])+'</small><h5>'+escape(m[1])+'</h5><p>'+escape(m[2])+'</p><a href="'+escape(m[3])+'" rel="noopener noreferrer" target="_blank">'+escape(t.open)+' ↗</a></div></article>').join('')+'</div><p class="vs-micro">'+escape(t.mediaFoot)+'</p>');
  if(panel(6))panel(6).insertBefore(media,panel(6).firstChild);

  const quiz = h('section','vs-quiz','<header class="vs-head"><span class="vs-kicker">04 / QUIZ</span><h4>'+escape(t.quizTitle)+'</h4><p>'+escape(t.quizIntro)+'</p></header><div class="vs-quiz-body" aria-live="polite"><p class="vs-quiz-step"></p><fieldset class="vs-quiz-field"><legend class="vs-quiz-question"></legend><div class="vs-quiz-options"></div></fieldset><p class="vs-quiz-feedback" hidden></p><button type="button" class="vs-quiz-action"></button></div><p class="vs-micro">'+escape(t.quizSource)+'</p>');
  if(panel(5))panel(5).append(quiz);
  let qi=0,score=0,answered=false,choice=-1;
  const quizStep=()=>{
    const q=t.questions[qi];
    $('.vs-quiz-step').textContent=(qi+1)+' / '+t.questions.length;
    $('.vs-quiz-question').textContent=q[0];
    const opts=$('.vs-quiz-options');opts.replaceChildren();
    q[1].forEach((v,i)=>{
      const label=document.createElement('label');
      const radio=document.createElement('input');radio.type='radio';radio.name='vs-quiz-'+lang;radio.value=String(i);
      radio.addEventListener('change',()=>{choice=i;});
      const span=document.createElement('span');span.textContent=v;
      label.append(radio,span);opts.append(label);
    });
    $('.vs-quiz-feedback').hidden=true;$('.vs-quiz-action').textContent=t.validate;
    $('.vs-quiz-field').disabled=false;answered=false;choice=-1;
  };
  const finish=()=>{
    $('.vs-quiz-body').innerHTML='<div class="vs-quiz-result"><strong>'+score+' / '+t.questions.length+'</strong><p>'+escape(t.score)+': '+score+' '+escape(t.scoreEnd)+'</p><button type="button" class="vs-quiz-restart">'+escape(t.restart)+'</button></div>';
    $('.vs-quiz-restart').addEventListener('click',()=>{qi=0;score=0;answered=false;choice=-1;$('.vs-quiz-body').replaceWith(h('div','vs-quiz-body','<p class="vs-quiz-step"></p><fieldset class="vs-quiz-field"><legend class="vs-quiz-question"></legend><div class="vs-quiz-options"></div></fieldset><p class="vs-quiz-feedback" hidden></p><button type="button" class="vs-quiz-action"></button>'));initQuiz();});
  };
  const quizAction=()=>{
    if(!answered){
      if(choice<0){$('.vs-quiz-options input')?.focus();return;}
      const correct=t.questions[qi][2],good=choice===correct;
      if(good)score++;
      $('.vs-quiz-field').disabled=true;answered=true;
      const feedback=$('.vs-quiz-feedback');feedback.hidden=false;feedback.innerHTML='<strong>'+escape(good?t.right:t.wrong)+'</strong> '+escape(t.questions[qi][3]);
      $('.vs-quiz-action').textContent=qi===t.questions.length-1?t.score:t.continue;
    }else{if(qi===t.questions.length-1)finish();else{qi++;quizStep();}}
  };
  const initQuiz=()=>{quizStep();$('.vs-quiz-action').addEventListener('click',quizAction);};
  if(panel(5))initQuiz();
  };
  initializeSection(document.querySelector('#vulgarisation .section-corps.vulgarisation') || document.querySelector('.section-corps.vulgarisation'));
  const room=document.querySelector('.salle-contenu');
  if(room){
    const initializeRoom=()=>room.querySelectorAll('.section-corps.vulgarisation').forEach(initializeSection);
    new MutationObserver(initializeRoom).observe(room,{childList:true,subtree:false});
    initializeRoom();
  }
})();
