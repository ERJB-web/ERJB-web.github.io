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
      eyebrow:'LE LABORATOIRE DE VULGARISATION', hero:'One idea, several ways of understanding it', sub:'Exploring a result, putting figures into perspective, testing a format and returning to the sources. The demonstrations are educational: they do not present results of my research.',
      trail:['Observer','Expliquer','Questionner','Partager'], trailDesc:['Establishing what the data show','Finding intelligible language','Examining limits and objections','Opening a useful discussion'],
      key:'Un principe central', keyText:'Making an idea accessible does not mean removing the nuances: it means choosing those that make it possible to understand and to judge.',
      mapTitle:'Une information ne circule jamais seule', mapSub:'In a public health question, data, lived experiences and collective decisions respond to one another, without being interchangeable.', mapNodes:['Data','Experiences','Decisions'], mapDetail:['Methods and uncertainties','Situations and needs','Values and constraints'], mapCaption:'Conceptual diagram, not a causal model or an empirical result.',
      riskTitle:'Risk laboratory: reading a number differently', riskIntro:'Two fictitious groups of 100 people. Adjust the events in group B to examine the difference between percentage points and relative reduction. Same period, same event, no causal interpretation.',
      groupA:'Groupe A',groupB:'Groupe B',change:'Events in group B',people:'personnes sur 100',absolute:'Écart absolu',relative:'Écart relatif par rapport au groupe A',ppts:'percentage points',plus:'more',less:'fewer',same:'no difference',base:'Group A rate',headG:'Groupe',headN:'With event',headWithout:'Without event',headRate:'Frequency',riskNote:'These numbers are invented to explain how to read a table. Comparing two groups does not, by itself, make it possible to attribute an effect to an intervention.',
      bridgeTitle:'From scientific material to a public message',bridgeSub:'The information is transformed, but traceability must remain intact.',bridge:['Question studied','Method and population','Result and uncertainty','Message accessible','Source and opportunity for discussion'],
      stageTitle:'Narrative studio: five cards to explain a pathway',stageSub:'Fictitious example on the coordination of services. Click to explore the progression of a carousel. This is a mock-up, not an actual publication.',
      slides:[['Pourquoi plusieurs services ?','A situation may combine health, housing and social support needs.'],['Each actor sees one part','The health professional, the social worker and local services have distinct mandates.'],['The tie matters as much as the number','Without exchange, multiplying the actors is not enough to ensure a coordinated response.'],['Context changes the response','Time, resources, agreements and the person’s choices influence cooperation.'],['And now, what questions?','Who coordinates? What does the person want? What information can be shared?']],
      previous:'Previous map',next:'Next card',card:'Carte',of:'sur',stageHint:'Interactive mock-up · original schematic illustrations',
      mediaTitle:'To watch, to listen to, to explore',mediaSub:'Resources that have actually been published, to consult on their organizations’ websites. They are not personal productions.',
      media:[['VIDÉOS ET BALADOS','OMS · Science in 5','Short public health explanations with specialists, and episodes to listen to or watch.','https://www.who.int/podcasts/series/science-in-5'],['APPRENTISSAGE INTERACTIF','Cochrane · Evidence Essentials','Educational pathway with readings, videos, audio and quizzes on evidence in health.','https://training.cochrane.org/essentials'],['GRAPHIQUES ET DONNÉES','Our World in Data · Life expectancy','Explore an international chart, change the countries and consult the sources and data.','https://ourworldindata.org/grapher/life-expectancy'],['ACCESSIBILITY GUIDE','W3C · Accessible audio and video','Transcripts, captions, audio description and accessible design from the script stage.','https://www.w3.org/WAI/media/av/']],
      open:'Explore the resource',mediaFoot:'External links · content and availability are the responsibility of the publishing organizations.',
      trustTitle:'Dialoguing without erasing disagreements',trustSteps:['Listen to the questions','Verify the elements','Show the limits','Respond and correct'],trustNotes:['Collect without exposing private data.','Find methods and primary sources.','Separate finding, interpretation and choice.','Make corrections visible and accessible.'],
      quizTitle:'Test your critical reading',quizIntro:'Three situations to practise identifying what a scientific message can actually claim. Commented answers, with no data collection.',
      questions:[
        ['In an observational study, two variables are associated. What can we conclude?', ['The first causes the second.','An association is observed; causality remains to be established.','The results apply to the whole population.'],1,'The presence of an association is not enough to rule out confounding factors or other explanations.'],
        ['A risk goes from 20 in 100 to 10 in 100. Which wording is correct?', ['A drop of 10 percentage points, or 50% in relative terms.','A decrease of 50 percentage points.','A drop of 10% in relative terms.'],0,'Going from 20% to 10% corresponds to 10 points in absolute terms and to half the baseline risk.'],
        ['To make a scientific video accessible, what should be planned?', ['Only a more attractive visual.','Only quieter music.','Verified captions, a transcript and a description of the necessary visual elements.'],2,'A transcript, captions and an adapted description make the information usable by more people.']
      ],
      validate:'Check the answer',continue:'Question suivante',restart:'Recommencer',right:'Correct answer',wrong:'À revoir',score:'Result',scoreEnd:'correct answers',quizSource:'To go further: Cochrane Evidence Essentials and the W3C recommendations.'
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
      validate:'Check answer',continue:'Next question',restart:'Try again',right:'Correct',wrong:'Review this',score:'Your score',scoreEnd:'correct answers',quizSource:'Further reading: Cochrane Evidence Essentials and W3C guidance.'
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
      validate:'Comprobar',continue:'Siguiente pregunta',restart:'Reiniciar',right:'Correcto',wrong:'Para revisar',score:'Resultado',scoreEnd:'respuestas correctas',quizSource:'Recursos: Cochrane Evidence Essentials y W3C.'
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
      validate:'核对答案',continue:'下一题',restart:'重新开始',right:'回答正确',wrong:'请再思考',score:'成绩',scoreEnd:'道正确',quizSource:'延伸阅读：Cochrane Evidence Essentials 与 W3C 指南。'
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
      validate:'تحقق',continue:'السؤال التالي',restart:'ابدأ من جديد',right:'إجابة صحيحة',wrong:'للمراجعة',score:'النتيجة',scoreEnd:'إجابات صحيحة',quizSource:'للمزيد: Cochrane Evidence Essentials وإرشادات W3C.'
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
      validate:'Проверить',continue:'Следующий вопрос',restart:'Начать снова',right:'Верно',wrong:'Проверьте ещё раз',score:'Результат',scoreEnd:'правильных ответов',quizSource:'Подробнее: Cochrane Evidence Essentials и рекомендации W3C.'
    }
  };
  const t = tr[lang] || tr.fr;
  // Beyond recognition questions: application of evidence, equity and public dialogue.
  const extension={
    fr:[
      ['A comparison of twelve countries shows two associated indicators. Which limitation is essential?',['The link necessarily holds for each patient.','An aggregate correlation does not demonstrate an individual mechanism.','The result proves the effectiveness of a policy.'],1,'There is a risk of ecological fallacy: relationships observed between countries do not automatically hold at the individual level.'],
      ['An uncertainty interval around an estimate is wide. Which sentence should be preferred?',['“The exact effect is demonstrated.”','« Il n’y a aucun effet. »','“The estimate remains imprecise; several values are compatible with the data.”'],2,'Uncertainty deserves to be explained, without suggesting that all hypotheses are equally likely.'],
      ['A poster mentions “80% improvement”. What should be looked for first?',['The definition of improvement, the numbers of participants and the starting point.','The colour of the graph.','The number of shares on social media.'],0,'A relative change without a denominator or point of comparison can be misleading.'],
      ['A person challenges a health message by reporting a lived experience. Which response is appropriate?',['Dismiss their experience as unscientific.','Acknowledge the experience, clarify the scope of the results and welcome the question.','Present the testimony as evidence of a general effect.'],1,'The discussion can welcome experiences while distinguishing testimony, scientific observation and decision.'],
      ['A video uses an AI-generated photo depicting a real scene. What should be done?',['Present it as documentary.','Omit any mention if it is aesthetic.','Label it as an illustration and verify the accuracy of the associated facts.'],2,'An illustration must not create confusion about the existence of a real scene, person or data.']
    ],
    en:[
      ['Twelve countries show a country-level association. What limitation matters?',['It necessarily holds for every patient.','An aggregate correlation does not establish individual-level mechanisms.','It proves a policy is effective.'],1,'Ecological bias is a risk: country-level patterns do not automatically apply to individuals.'],
      ['An estimate has a wide uncertainty interval. What should you say?',['“The exact effect is proven.”','“There is no effect.”','“The estimate is imprecise; several values are compatible with the data.”'],2,'Uncertainty should be made understandable without implying that every explanation is equally likely.'],
      ['A poster claims “80% improvement.” What do you examine first?',['What improved, the starting point and group sizes.','The chart colours.','Its number of shares.'],0,'Relative changes without a baseline or denominator are easily misread.'],
      ['Someone challenges a public-health message using lived experience. Your response?',['Dismiss the experience.','Acknowledge it, clarify evidence limits and listen to the question.','Treat the experience as proof of a general effect.'],1,'Lived experience informs dialogue but has a different role from population-level evidence.'],
      ['A video uses an AI-generated photo that looks documentary. What is needed?',['Label it as real documentary footage.','Say nothing if it looks good.','Disclose it as an illustration and verify related claims.'],2,'Illustrations should not falsely suggest that people, scenes or evidence existed.']
    ],
    es:[
      ['Hay una asociación entre indicadores de doce países. ¿Qué límite importa?',['Se aplica a cada paciente.','Una correlación agregada no demuestra mecanismos individuales.','Prueba el efecto de una política.'],1,'Las asociaciones entre países no se trasladan automáticamente a individuos.'],
      ['El intervalo de incertidumbre es amplio. ¿Qué decir?',['« El efecto exacto está demostrado ».','« No hay ningún efecto ».','« La estimación es imprecisa; los datos admiten varios valores ».'],2,'La incertidumbre debe comunicarse con claridad.'],
      ['Un cartel anuncia « 80 % de mejora ». ¿Qué examinar primero?',['La definición, el punto de partida y las muestras.','El color del gráfico.','El número de compartidos.'],0,'Sin denominador ni referencia, un cambio relativo puede engañar.'],
      ['Una persona cuestiona un mensaje a partir de su experiencia. ¿Qué hacer?',['Ignorarla.','Reconocer su experiencia, distinguir las pruebas y dialogar.','Generalizar su testimonio.'],1,'Experiencia y evidencia científica ofrecen perspectivas distintas.'],
      ['Una foto creada con IA parece documental. ¿Qué hacer?',['Presentarla como real.','No indicar nada.','Identificarla como ilustración y verificar las afirmaciones.'],2,'No se debe inventar una escena real con apariencia documental.']
    ],
    zh:[
      ['比较十二个国家发现指标有关联。重要局限是什么？',['一定适用于每位患者。','国家层面的相关性不能确定个人机制。','证明某项政策有效。'],1,'国家层面的关系不能自动推广到个人。'],
      ['一项估计的不确定区间较宽，如何表达？',['“准确效应已得到证明。”','“肯定没有效应。”','“估计尚不精确，多种数值与数据相符。”'],2,'应当解释不确定性，而非掩盖它。'],
      ['一张海报写着“改善80%”，先检查什么？',['改善的定义、基线和样本人数。','图表颜色。','社交媒体转发量。'],0,'缺乏基线的相对变化容易误导。'],
      ['有人以亲身经历质疑公共卫生建议，如何回应？',['否定其经历。','尊重经历、说明证据边界并倾听问题。','将一例经历当作普遍证据。'],1,'个人经验和研究结果承担不同的解释功能。'],
      ['视频用AI生成的照片模拟真实现场，如何处理？',['称之为纪实照片。','无需说明。','标注为插图，并核实相关事实。'],2,'不可让插图伪装成真实场景或证据。']
    ],
    ar:[
      ['تظهر علاقة بين مؤشرين في اثنتي عشرة دولة. ما القيد الأساسي؟',['تنطبق بالضرورة على كل مريض.','العلاقة بين الدول لا تثبت آلية على مستوى الأفراد.','تثبت فعالية سياسة معينة.'],1,'قد تنتج مغالطة بيئية عند تعميم العلاقات المجمعة على الأفراد.'],
      ['مجال عدم اليقين حول تقدير واسع. ما التفسير الصحيح؟',['« ثبت التأثير الدقيق ».','« لا يوجد أي تأثير ».','« التقدير غير دقيق وهناك عدة قيم متوافقة مع البيانات ».'],2,'ينبغي شرح عدم اليقين بدلاً من إخفائه.'],
      ['يشير ملصق إلى « تحسن بنسبة 80٪ ». ماذا نفحص أولاً؟',['التعريف وخط الأساس وحجم المجموعة.','ألوان الرسم.','عدد المشاركات.'],0,'قد يضلل التغير النسبي دون خط أساس أو مقام.'],
      ['اعترض شخص على رسالة صحية استناداً إلى تجربته. ماذا تفعل؟',['تجاهل التجربة.','احترام التجربة وشرح حدود الدليل وفتح الحوار.','اعتبار التجربة دليلاً عاماً.'],1,'الخبرة المعيشة والدليل العلمي لهما أدوار مختلفة.'],
      ['صورة مولدة بالذكاء الاصطناعي تبدو وثائقية. ماذا يلزم؟',['عرضها كصورة واقعية.','عدم التصريح بشيء.','توضيح أنها رسم توضيحي والتحقق من الوقائع.'],2,'لا ينبغي اختلاق مشاهد واقعية أو أدلة مصورة.']
    ],
    ru:[
      ['Обнаружена связь показателей двенадцати стран. Какое ограничение важно?',['Она обязательно действует для каждого пациента.','Связь на уровне стран не доказывает механизм у отдельных людей.','Она доказывает эффективность политики.'],1,'Агрегированные зависимости не обязательно действуют на индивидуальном уровне.'],
      ['Интервал неопределённости широк. Как верно описать?',['«Точный эффект доказан».','«Эффекта нет».','«Оценка неточна: с данными совместимы разные значения».'],2,'Неопределённость нужно объяснять, а не скрывать.'],
      ['Плакат обещает «улучшение на 80%». Что проверить?',['Определение, исходный уровень и численность групп.','Цвет графика.','Количество репостов.'],0,'Относительные изменения без исходного уровня вводят в заблуждение.'],
      ['Человек оспаривает совет, опираясь на личный опыт. Что делать?',['Игнорировать опыт.','Признать опыт, пояснить пределы данных и выслушать вопрос.','Считать один случай универсальным доказательством.'],1,'Личный опыт и научные данные играют разные роли.'],
      ['Сгенерированное ИИ фото выглядит документальным. Как поступить?',['Назвать настоящим.','Не сообщать об этом.','Указать, что это иллюстрация, и проверить утверждения.'],2,'Иллюстрация не должна выдавать вымышленную сцену за реальную.']
    ]
  };
  t.questions = [...t.questions,...(extension[lang]||extension.fr)];
  const $ = (q, root = section) => root.querySelector(q);
  const h = (tag, className, html) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (html !== undefined) el.innerHTML = html;
    return el;
  };
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const panel = n => section.querySelector('[data-volet="' + n + '"] .chapitre-contenu');
  const chain = h('section','vs-hero','<div class="vs-hero-copy"><p class="vs-eyebrow">' + escape(t.eyebrow) + '</p><h3>' + escape(t.hero) + '</h3><p>' + escape(t.sub) + '</p><div class="vs-principle"><strong>' + escape(t.key) + '</strong><span>' + escape(t.keyText) + '</span></div></div><div class="vs-hero-art" aria-label="' + escape(t.trail.join(' → ')) + '"><div class="vs-art-orbit"><span>01</span><span>02</span><span>03</span><span>04</span><i></i></div><ol>' + t.trail.map((v,i) => '<li><b>' + escape(v) + '</b><small>' + escape(t.trailDesc[i]) + '</small></li>').join('') + '</ol></div>');
  const gallery = $('.vul-galerie');
  const firstChapter=section.querySelector(".gab-chapitre .gab-corps");
  if(firstChapter) firstChapter.prepend(chain);
  else if (gallery) gallery.before(chain);

  const map = h('figure','vs-map','<figcaption><strong>' + escape(t.mapTitle) + '</strong><span>' + escape(t.mapSub) + '</span></figcaption><div class="vs-map-nodes">' + t.mapNodes.map((n,i) => '<article><div class="vs-map-symbol">' + ['◎','◇','↗'][i] + '</div><h5>' + escape(n) + '</h5><p>' + escape(t.mapDetail[i]) + '</p></article>').join('') + '</div><p class="vs-micro">' + escape(t.mapCaption) + '</p>');
  if (panel(0)) panel(0).insertBefore(map,panel(0).firstChild);

  const bridge = h('section','vs-bridge','<header><h4>' + escape(t.bridgeTitle) + '</h4><p>' + escape(t.bridgeSub) + '</p></header><ol>' + t.bridge.map((v,i)=>'<li><span>' + String(i+1).padStart(2,'0') + '</span><strong>' + escape(v) + '</strong></li>').join('') + '</ol>');
  if (panel(2)) panel(2).append(bridge);

  const risk = h('section','vs-lab');
  risk.innerHTML = '<header class="vs-head"><span class="vs-kicker">01 / DATA LAB</span><h4>' + escape(t.riskTitle) + '</h4><p>' + escape(t.riskIntro) + '</p></header><div class="vs-risk-controls"><label for="vs-risk-range">' + escape(t.change) + '</label><output id="vs-risk-count" for="vs-risk-range">10 / 100</output><input id="vs-risk-range" type="range" min="0" max="60" step="1" value="10"></div><div class="vs-bars" role="img"><div><label>' + escape(t.groupA) + '</label><div class="vs-bar-rail"><span class="vs-bar-a" style="width:20%"></span></div><b>20 / 100</b></div><div><label>' + escape(t.groupB) + '</label><div class="vs-bar-rail"><span class="vs-bar-b" style="width:10%"></span></div><b id="vs-risk-bar-text">10 / 100</b></div></div><div class="vs-risk-stats"><article><small>' + escape(t.absolute) + '</small><strong id="vs-absolute">10</strong><span>' + escape(t.ppts) + '</span></article><article><small>' + escape(t.relative) + '</small><strong id="vs-relative">50 %</strong><span id="vs-relative-label">' + escape(t.less) + '</span></article></div><div class="vs-table-wrap"><table><caption>' + escape(t.riskTitle) + '</caption><thead><tr>' + [t.headG,t.headN,t.headWithout,t.headRate].map(x=>'<th scope="col">' + escape(x) + '</th>').join('') + '</tr></thead><tbody><tr><th scope="row">' + escape(t.groupA) + '</th><td>20</td><td>80</td><td>20 %</td></tr><tr><th scope="row">' + escape(t.groupB) + '</th><td id="vs-table-yes">10</td><td id="vs-table-no">90</td><td id="vs-table-percent">10 %</td></tr></tbody></table></div><p class="vs-micro">' + escape(t.riskNote) + '</p>';
  if (panel(1)) panel(1).append(risk);
  if(lang==='fr') {
    const source=h('p','vs-micro');
    source.innerHTML='To learn more: <a href="https://www.cochrane.org/CD006776/COMMUN_using-different-statistical-formats-for-presenting-health-information" target="_blank" rel="noopener">Cochrane — the effects of different ways of presenting a risk</a>. Always compare frequencies and the time period before reading a relative percentage.';
    risk.append(source);
  }
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
  // Vector chart with a real 0–100 scale; the underlying data remain fictitious.
  if($('.vs-bars')){
    const x=n=>160+Math.min(100,Math.max(0,n))*6.2;
    const diagram=h('figure','vs-risk-chart');
    diagram.setAttribute('aria-label',t.riskTitle);
    diagram.innerHTML='<svg viewBox="0 0 920 278" role="img" aria-label="'+escape(t.groupA)+': 20/100; '+escape(t.groupB)+': 10/100" xmlns="http://www.w3.org/2000/svg">'+
      '<g class="vs-chart-grid">'+[0,20,40,60,80,100].map(n=>'<line x1="'+x(n)+'" x2="'+x(n)+'" y1="27" y2="222"/><text x="'+x(n)+'" y="254" text-anchor="middle">'+n+' %</text>').join('')+'</g>'+
      '<g class="vs-chart-labels"><text x="8" y="101">'+escape(t.groupA)+'</text><text x="8" y="184">'+escape(t.groupB)+'</text></g>'+
      '<line class="vs-chart-range-a" x1="'+x(0)+'" x2="'+x(20)+'" y1="94" y2="94"/>'+
      '<circle class="vs-chart-point-a" cx="'+x(20)+'" cy="94" r="12"/>'+
      '<line class="vs-chart-range-b" x1="'+x(0)+'" x2="'+x(10)+'" y1="177" y2="177"/>'+
      '<circle class="vs-chart-point-b" cx="'+x(10)+'" cy="177" r="12"/>'+
      '<text class="vs-chart-number-a" x="'+(x(20)+25)+'" y="101">20 %</text>'+
      '<text class="vs-chart-number-b" x="'+(x(10)+25)+'" y="184">10 %</text></svg>';
    $('.vs-bars').after(diagram);
    const updateChart=()=>{
      const n=Number(slider.value);
      const svg=diagram.querySelector('svg');
      svg.setAttribute('aria-label',t.groupA+': 20/100; '+t.groupB+': '+n+'/100');
      diagram.querySelector('.vs-chart-range-b').setAttribute('x2',String(x(n)));
      diagram.querySelector('.vs-chart-point-b').setAttribute('cx',String(x(n)));
      const label=diagram.querySelector('.vs-chart-number-b');
      label.setAttribute('x',String(x(n)+25));
      label.textContent=n+' %';
    };
    slider.addEventListener('input',updateChart);
  }

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

  const trust = h('section','vs-trust','<h4>' + escape(t.trustTitle) + '</h4><div>' + t.trustSteps.map((v,i)=>'<article><b>0'+(i+1)+'</b><strong>'+escape(v)+'</strong><p>'+escape(t.trustNotes[i])+'</p></article>').join('')+'</div>');
  if(panel(4))panel(4).append(trust);

  const media = h('section','vs-media','<header class="vs-head"><span class="vs-kicker">03 / MEDIA LIBRARY</span><h4>' + escape(t.mediaTitle) + '</h4><p>' + escape(t.mediaSub) + '</p></header><div class="vs-media-grid">' + t.media.map((m,i)=>'<article class="vs-media-card"><div class="vs-media-visual vs-media-visual-'+i+'" aria-hidden="true"><span>'+['▶','◈','▥','CC'][i]+'</span></div><div class="vs-media-info"><small>'+escape(m[0])+'</small><h5>'+escape(m[1])+'</h5><p>'+escape(m[2])+'</p><a href="'+escape(m[3])+'" rel="noopener noreferrer" target="_blank">'+escape(t.open)+' ↗</a></div></article>').join('')+'</div><p class="vs-micro">'+escape(t.mediaFoot)+'</p>');
  if(panel(6))panel(6).insertBefore(media,panel(6).firstChild);

  // Independent quiz state: listeners belong to the currently open room.
  const quiz = h('section','vs-quiz','<header class="vs-head"><span class="vs-kicker">04 / QUIZ</span><h4>'+escape(t.quizTitle)+'</h4><p>'+escape(t.quizIntro)+'</p></header><div class="vs-quiz-body"></div><p class="vs-micro">'+escape(t.quizSource)+'</p>');
  const quizPanel=panel(5);
  if(quizPanel){
    quizPanel.append(quiz);
    const root=quiz.querySelector('.vs-quiz-body');
    let index=0,points=0,locked=false;
    function renderQuestion(){
      locked=false;
      const q=t.questions[index];
      root.replaceChildren();
      const step=h('p','vs-quiz-step');step.textContent=(index+1)+' / '+t.questions.length;
      const field=document.createElement('fieldset');field.className='vs-quiz-field';
      const legend=document.createElement('legend');legend.className='vs-quiz-question';legend.textContent=q[0];field.append(legend);
      const opts=h('div','vs-quiz-options');
      q[1].forEach((labelText,k)=>{
        const label=document.createElement('label');
        const radio=document.createElement('input');radio.type='radio';radio.name='vs-question-'+index;radio.value=String(k);
        const name=document.createElement('span');name.textContent=labelText;
        label.append(radio,name);opts.append(label);
      });field.append(opts);
      const feedback=h('p','vs-quiz-feedback');feedback.hidden=true;feedback.setAttribute('role','status');
      const action=document.createElement('button');action.type='button';action.className='vs-quiz-action';action.textContent=t.validate;
      action.addEventListener('click',()=>{
        if(!locked){
          const selected=opts.querySelector('input:checked');
          if(!selected){feedback.hidden=false;feedback.textContent=t.quizIntro;opts.querySelector('input')?.focus();return;}
          locked=true;field.disabled=true;
          const correct=Number(selected.value)===q[2];
          if(correct)points++;
          feedback.hidden=false;
          feedback.replaceChildren();
          const bold=document.createElement('strong');bold.textContent=correct?t.right:t.wrong;
          feedback.append(bold,document.createTextNode(' '+q[3]));
          action.textContent=index===t.questions.length-1?t.score:t.continue;
        }else if(index<t.questions.length-1){index++;renderQuestion();}
        else renderResult();
      });
      root.append(step,field,feedback,action);
    }
    function renderResult(){
      root.replaceChildren();
      const result=h('div','vs-quiz-result');
      const tally=h('strong');tally.textContent=points+' / '+t.questions.length;
      const desc=h('p');desc.textContent=t.score+': '+points+' / '+t.questions.length;
      const restart=document.createElement('button');restart.type='button';restart.className='vs-quiz-restart';restart.textContent=t.restart;
      restart.addEventListener('click',()=>{index=0;points=0;renderQuestion();});
      result.append(tally,desc,restart);root.append(result);
    }
    renderQuestion();
  }
  };
  initializeSection(document.querySelector('#vulgarisation .section-corps.vulgarisation') || document.querySelector('.section-corps.vulgarisation'));
  const room=document.querySelector('.salle-contenu');
  if(room){
    const initializeRoom=()=>room.querySelectorAll('.section-corps.vulgarisation').forEach(initializeSection);
    new MutationObserver(initializeRoom).observe(room,{childList:true,subtree:false});
    initializeRoom();
  }
})();
