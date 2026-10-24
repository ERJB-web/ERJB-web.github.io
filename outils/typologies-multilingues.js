"use strict";
// Dénomination des types d'études ; références et titres originaux restent inchangés.
const types={
  "Essai randomisé": {
    "en": "Randomized trial",
    "es": "Ensayo aleatorizado",
    "zh": "随机试验",
    "ar": "تجربة عشوائية",
    "ru": "Рандомизированное исследование"
  },
  "Article": {
    "en": "Article",
    "es": "Artículo",
    "zh": "文章",
    "ar": "مقالة",
    "ru": "Статья"
  },
  "Cohorte comparative": {
    "en": "Comparative cohort study",
    "es": "Estudio comparativo de cohortes",
    "zh": "比较性队列研究",
    "ar": "دراسة أترابية مقارنة",
    "ru": "Сравнительное когортное исследование"
  },
  "Enquête transversale pondérée": {
    "en": "Weighted cross-sectional survey",
    "es": "Encuesta transversal ponderada",
    "zh": "加权横断面调查",
    "ar": "مسح مقطعي مرجح",
    "ru": "Взвешенное поперечное обследование"
  },
  "Article qualitatif": {
    "en": "Qualitative article",
    "es": "Artículo cualitativo",
    "zh": "定性研究文章",
    "ar": "مقالة بحثية نوعية",
    "ru": "Статья по качественному исследованию"
  },
  "Étude de programme": {
    "en": "Programme study",
    "es": "Estudio de programa",
    "zh": "项目研究",
    "ar": "دراسة برنامج",
    "ru": "Исследование программы"
  },
  "Conference Abstract": {
    "en": "Conference abstract",
    "es": "Resumen de congreso",
    "zh": "会议摘要",
    "ar": "ملخص مؤتمر",
    "ru": "Тезисы конференции"
  },
  "Étude comparative": {
    "en": "Comparative study",
    "es": "Estudio comparativo",
    "zh": "比较研究",
    "ar": "دراسة مقارنة",
    "ru": "Сравнительное исследование"
  },
  "Évaluation pragmatique d’amélioration de la qualité": {
    "en": "Pragmatic quality-improvement evaluation",
    "es": "Evaluación pragmática de mejora de la calidad",
    "zh": "务实性质量改进评估",
    "ar": "تقييم عملي لتحسين الجودة",
    "ru": "Практическая оценка улучшения качества"
  },
  "Clinical Trial; Journal Article": {
    "en": "Clinical trial; journal article",
    "es": "Ensayo clínico; artículo de revista",
    "zh": "临床试验；期刊论文",
    "ar": "تجربة سريرية؛ مقالة علمية",
    "ru": "Клиническое испытание; журнальная статья"
  },
  "Étude comparative de méthodes": {
    "en": "Comparative methods study",
    "es": "Estudio comparativo de métodos",
    "zh": "方法比较研究",
    "ar": "دراسة مقارنة للمنهجيات",
    "ru": "Сравнительное исследование методов"
  },
  "Étude d’implantation et de suivi": {
    "en": "Implementation and follow-up study",
    "es": "Estudio de implementación y seguimiento",
    "zh": "实施与随访研究",
    "ar": "دراسة تنفيذ ومتابعة",
    "ru": "Исследование внедрения и последующего наблюдения"
  },
  "Cohorte rétrospective": {
    "en": "Retrospective cohort study",
    "es": "Estudio de cohorte retrospectiva",
    "zh": "回顾性队列研究",
    "ar": "دراسة أترابية استعادية",
    "ru": "Ретроспективное когортное исследование"
  },
  "Analyse dans un essai randomisé": {
    "en": "Analysis within a randomized trial",
    "es": "Análisis dentro de un ensayo aleatorizado",
    "zh": "随机试验内分析",
    "ar": "تحليل ضمن تجربة عشوائية",
    "ru": "Анализ в рамках рандомизированного исследования"
  },
  "Évaluation de programme avec comparaison randomisée": {
    "en": "Programme evaluation with randomized comparison",
    "es": "Evaluación de programa con comparación aleatorizada",
    "zh": "采用随机比较的项目评估",
    "ar": "تقييم برنامج مع مقارنة عشوائية",
    "ru": "Оценка программы со случайным распределением групп"
  },
  "Cohorte observationnelle": {
    "en": "Observational cohort study",
    "es": "Estudio de cohorte observacional",
    "zh": "观察性队列研究",
    "ar": "دراسة أترابية رصدية",
    "ru": "Наблюдательное когортное исследование"
  },
  "Revue systématique": {
    "en": "Systematic review",
    "es": "Revisión sistemática",
    "zh": "系统综述",
    "ar": "مراجعة منهجية",
    "ru": "Систематический обзор"
  },
  "Journal Article": {
    "en": "Journal article",
    "es": "Artículo de revista",
    "zh": "期刊论文",
    "ar": "مقالة في مجلة علمية",
    "ru": "Журнальная статья"
  },
  "Évaluation descriptive de dispositif": {
    "en": "Descriptive evaluation of a service",
    "es": "Evaluación descriptiva de un servicio",
    "zh": "服务项目描述性评估",
    "ar": "تقييم وصفي لخدمة",
    "ru": "Описательная оценка службы"
  },
  "Étude qualitative dirigée intégrée à un suivi": {
    "en": "Directed qualitative study embedded in follow-up",
    "es": "Estudio cualitativo dirigido integrado en el seguimiento",
    "zh": "随访中嵌入的定向定性研究",
    "ar": "دراسة نوعية موجّهة مدمجة في المتابعة",
    "ru": "Направленное качественное исследование в рамках наблюдения"
  },
  "Journal Article; Research Support, N.I.H., Extramural; Research Support, Non-U.S. Gov't; Research Support, U.S. Gov't, P.H.S.": {
    "en": "Journal article; extramural NIH research funding; non-U.S. government research funding; U.S. Public Health Service research funding",
    "es": "Artículo de revista; financiación extramuros de los NIH; financiación pública de fuera de Estados Unidos; financiación del Servicio de Salud Pública de Estados Unidos",
    "zh": "期刊论文；美国国立卫生研究院院外研究资助；非美国政府研究资助；美国公共卫生署研究资助",
    "ar": "مقالة في مجلة علمية؛ تمويل بحثي خارجي من المعاهد الوطنية للصحة الأمريكية؛ دعم بحثي حكومي من خارج الولايات المتحدة؛ تمويل من خدمة الصحة العامة الأمريكية",
    "ru": "Журнальная статья; внешнее исследовательское финансирование NIH; государственная поддержка из-за пределов США; финансирование Службы общественного здравоохранения США"
  },
  "Méthodes mixtes + analyse de réseau social": {
    "en": "Mixed methods and social network analysis",
    "es": "Métodos mixtos y análisis de redes sociales",
    "zh": "混合方法与社会网络分析",
    "ar": "أساليب مختلطة وتحليل الشبكات الاجتماعية",
    "ru": "Смешанные методы и анализ социальных сетей"
  },
  "Étude transversale / amélioration de la qualité": {
    "en": "Cross-sectional study / quality improvement",
    "es": "Estudio transversal / mejora de la calidad",
    "zh": "横断面研究／质量改进",
    "ar": "دراسة مقطعية / تحسين الجودة",
    "ru": "Поперечное исследование / улучшение качества"
  },
  "Enquête multisite": {
    "en": "Multisite survey",
    "es": "Encuesta multicéntrica",
    "zh": "多地点调查",
    "ar": "مسح متعدد المواقع",
    "ru": "Многоцентровое обследование"
  },
  "Étude d’implantation": {
    "en": "Implementation study",
    "es": "Estudio de implementación",
    "zh": "实施研究",
    "ar": "دراسة التنفيذ",
    "ru": "Исследование внедрения"
  },
  "Évaluation de programme mixte": {
    "en": "Mixed-method programme evaluation",
    "es": "Evaluación de programa con métodos mixtos",
    "zh": "混合方法项目评估",
    "ar": "تقييم برنامج بأساليب مختلطة",
    "ru": "Оценка программы смешанными методами"
  },
  "Amélioration de la qualité": {
    "en": "Quality improvement",
    "es": "Mejora de la calidad",
    "zh": "质量改进",
    "ar": "تحسين الجودة",
    "ru": "Улучшение качества"
  },
  "Étude pilote": {
    "en": "Pilot study",
    "es": "Estudio piloto",
    "zh": "试点研究",
    "ar": "دراسة تجريبية أولية",
    "ru": "Пилотное исследование"
  },
  "Delphi modifié / développement d’intervention": {
    "en": "Modified Delphi / intervention development",
    "es": "Delphi modificado / desarrollo de una intervención",
    "zh": "改良德尔菲法／干预开发",
    "ar": "دلفي معدّل / تطوير تدخل",
    "ru": "Модифицированный метод Дельфи / разработка вмешательства"
  },
  "Enquête nationale": {
    "en": "National survey",
    "es": "Encuesta nacional",
    "zh": "全国调查",
    "ar": "مسح وطني",
    "ru": "Национальное обследование"
  },
  "Méthodes mixtes": {
    "en": "Mixed methods",
    "es": "Métodos mixtos",
    "zh": "混合方法",
    "ar": "أساليب مختلطة",
    "ru": "Смешанные методы"
  },
  "Revue de portée": {
    "en": "Scoping review",
    "es": "Revisión de alcance",
    "zh": "范围综述",
    "ar": "مراجعة استكشافية",
    "ru": "Обзор охвата литературы"
  },
  "Cohorte d’implantation": {
    "en": "Implementation cohort",
    "es": "Cohorte de implementación",
    "zh": "实施队列研究",
    "ar": "أتراب التنفيذ",
    "ru": "Когорта внедрения"
  },
  "Étude qualitative multiacteurs": {
    "en": "Multi-stakeholder qualitative study",
    "es": "Estudio cualitativo con múltiples actores",
    "zh": "多方利益相关者定性研究",
    "ar": "دراسة نوعية لأطراف متعددة",
    "ru": "Качественное исследование с участием разных заинтересованных сторон"
  },
  "Journal Article; Review": {
    "en": "Journal article; review",
    "es": "Artículo de revista; revisión",
    "zh": "期刊论文；综述",
    "ar": "مقالة علمية؛ مراجعة",
    "ru": "Журнальная статья; обзор"
  },
  "Étude qualitative multicentrique": {
    "en": "Multicentre qualitative study",
    "es": "Estudio cualitativo multicéntrico",
    "zh": "多中心定性研究",
    "ar": "دراسة نوعية متعددة المراكز",
    "ru": "Многоцентровое качественное исследование"
  },
  "Étude transversale pondérée": {
    "en": "Weighted cross-sectional study",
    "es": "Estudio transversal ponderado",
    "zh": "加权横断面研究",
    "ar": "دراسة مقطعية مرجحة",
    "ru": "Взвешенное поперечное исследование"
  },
  "Essai randomisé / analyse prospective": {
    "en": "Randomized trial / prospective analysis",
    "es": "Ensayo aleatorizado / análisis prospectivo",
    "zh": "随机试验／前瞻性分析",
    "ar": "تجربة عشوائية / تحليل مستقبلي",
    "ru": "Рандомизированное исследование / проспективный анализ"
  },
  "Étude qualitative descriptive": {
    "en": "Descriptive qualitative study",
    "es": "Estudio cualitativo descriptivo",
    "zh": "描述性定性研究",
    "ar": "دراسة نوعية وصفية",
    "ru": "Описательное качественное исследование"
  },
  "Clinical Trial": {
    "en": "Clinical trial",
    "es": "Ensayo clínico",
    "zh": "临床试验",
    "ar": "تجربة سريرية",
    "ru": "Клиническое испытание"
  },
  "Étude d’implantation/planification": {
    "en": "Implementation / planning study",
    "es": "Estudio de implementación y planificación",
    "zh": "实施／规划研究",
    "ar": "دراسة التنفيذ والتخطيط",
    "ru": "Исследование внедрения и планирования"
  },
  "Étude de validation": {
    "en": "Validation study",
    "es": "Estudio de validación",
    "zh": "验证研究",
    "ar": "دراسة تحقق",
    "ru": "Валидационное исследование"
  },
  "Étude transversale sur dossiers cliniques": {
    "en": "Cross-sectional clinical record study",
    "es": "Estudio transversal de historias clínicas",
    "zh": "病历横断面研究",
    "ar": "دراسة مقطعية للسجلات السريرية",
    "ru": "Поперечное исследование медицинских карт"
  },
  "Protocole d’essai randomisé pragmatique": {
    "en": "Pragmatic randomized trial protocol",
    "es": "Protocolo de ensayo aleatorizado pragmático",
    "zh": "务实性随机试验方案",
    "ar": "بروتوكول تجربة عشوائية عملية",
    "ru": "Протокол прагматического рандомизированного исследования"
  },
  "Méthodes mixtes participatives": {
    "en": "Participatory mixed methods",
    "es": "Métodos mixtos participativos",
    "zh": "参与式混合方法",
    "ar": "أساليب مختلطة تشاركية",
    "ru": "Партисипативные смешанные методы"
  },
  "Cohorte/évaluation AHC": {
    "en": "AHC cohort / evaluation",
    "es": "Cohorte / evaluación AHC",
    "zh": "AHC 队列／评估",
    "ar": "أتراب / تقييم AHC",
    "ru": "Когорта / оценка AHC"
  },
  "Delphi / panel d’experts": {
    "en": "Delphi / expert panel",
    "es": "Delphi / panel de expertos",
    "zh": "德尔菲法／专家小组",
    "ar": "دلفي / لجنة خبراء",
    "ru": "Метод Дельфи / экспертная панель"
  },
  "Étude de cas d’implantation": {
    "en": "Implementation case study",
    "es": "Estudio de caso de implementación",
    "zh": "实施案例研究",
    "ar": "دراسة حالة للتنفيذ",
    "ru": "Кейс-исследование внедрения"
  },
  "Étude qualitative d’implantation": {
    "en": "Qualitative implementation study",
    "es": "Estudio cualitativo de implementación",
    "zh": "定性实施研究",
    "ar": "دراسة نوعية للتنفيذ",
    "ru": "Качественное исследование внедрения"
  },
  "Protocole d’essai randomisé": {
    "en": "Randomized trial protocol",
    "es": "Protocolo de ensayo aleatorizado",
    "zh": "随机试验方案",
    "ar": "بروتوكول تجربة عشوائية",
    "ru": "Протокол рандомизированного исследования"
  },
  "Méthodes mixtes interorganisationnelles": {
    "en": "Interorganizational mixed methods",
    "es": "Métodos mixtos interorganizacionales",
    "zh": "跨组织混合方法",
    "ar": "أساليب مختلطة بين المنظمات",
    "ru": "Межорганизационные смешанные методы"
  },
  "Étude qualitative": {
    "en": "Qualitative study",
    "es": "Estudio cualitativo",
    "zh": "定性研究",
    "ar": "دراسة نوعية",
    "ru": "Качественное исследование"
  },
  "Étude de développement/validation d’algorithmes": {
    "en": "Algorithm development / validation study",
    "es": "Estudio de desarrollo y validación de algoritmos",
    "zh": "算法开发与验证研究",
    "ar": "دراسة تطوير الخوارزميات والتحقق منها",
    "ru": "Разработка и валидация алгоритмов"
  },
  "Évaluation de programme": {
    "en": "Programme evaluation",
    "es": "Evaluación de programa",
    "zh": "项目评估",
    "ar": "تقييم برنامج",
    "ru": "Оценка программы"
  },
  "Analyse par classes latentes": {
    "en": "Latent class analysis",
    "es": "Análisis de clases latentes",
    "zh": "潜在类别分析",
    "ar": "تحليل الفئات الكامنة",
    "ru": "Анализ латентных классов"
  },
  "Enquête transversale": {
    "en": "Cross-sectional survey",
    "es": "Encuesta transversal",
    "zh": "横断面调查",
    "ar": "مسح مقطعي",
    "ru": "Поперечное обследование"
  },
  "Revue systématique mixte": {
    "en": "Mixed-method systematic review",
    "es": "Revisión sistemática de métodos mixtos",
    "zh": "混合方法系统综述",
    "ar": "مراجعة منهجية بأساليب مختلطة",
    "ru": "Систематический обзор смешанных исследований"
  },
  "Étude qualitative nationale": {
    "en": "National qualitative study",
    "es": "Estudio cualitativo nacional",
    "zh": "全国性定性研究",
    "ar": "دراسة نوعية وطنية",
    "ru": "Национальное качественное исследование"
  },
  "Protocole/étude d’intervention": {
    "en": "Intervention protocol / study",
    "es": "Protocolo / estudio de intervención",
    "zh": "干预方案／研究",
    "ar": "بروتوكول / دراسة تدخل",
    "ru": "Протокол / исследование вмешательства"
  },
  "Étude de cas + approche de réseau social": {
    "en": "Case study and social network approach",
    "es": "Estudio de caso y enfoque de redes sociales",
    "zh": "案例研究与社会网络方法",
    "ar": "دراسة حالة ومنهج الشبكات الاجتماعية",
    "ru": "Кейс-исследование и сетевой подход"
  },
  "Chapitre d’ouvrage / retour d’expérience": {
    "en": "Book chapter / experience report",
    "es": "Capítulo de libro / relato de experiencia",
    "zh": "书籍章节／实践经验报告",
    "ar": "فصل من كتاب / تقرير تجربة",
    "ru": "Глава книги / описание опыта"
  },
  "Développement de cadre + application": {
    "en": "Framework development and application",
    "es": "Desarrollo y aplicación de un marco",
    "zh": "框架开发与应用",
    "ar": "تطوير إطار وتطبيقه",
    "ru": "Разработка и применение концептуальной модели"
  },
  "Analyse rétrospective d’implantation": {
    "en": "Retrospective implementation analysis",
    "es": "Análisis retrospectivo de implementación",
    "zh": "回顾性实施分析",
    "ar": "تحليل استعادي للتنفيذ",
    "ru": "Ретроспективный анализ внедрения"
  },
  "Étude qualitative organisationnelle": {
    "en": "Organizational qualitative study",
    "es": "Estudio cualitativo organizacional",
    "zh": "组织定性研究",
    "ar": "دراسة نوعية تنظيمية",
    "ru": "Качественное организационное исследование"
  },
  "Étude transversale": {
    "en": "Cross-sectional study",
    "es": "Estudio transversal",
    "zh": "横断面研究",
    "ar": "دراسة مقطعية",
    "ru": "Поперечное исследование"
  },
  "Analyse d’enquête nationale": {
    "en": "National survey analysis",
    "es": "Análisis de encuesta nacional",
    "zh": "全国调查分析",
    "ar": "تحليل مسح وطني",
    "ru": "Анализ национального обследования"
  },
  "Revue intégrative": {
    "en": "Integrative review",
    "es": "Revisión integradora",
    "zh": "整合性综述",
    "ar": "مراجعة تكاملية",
    "ru": "Интегративный обзор"
  },
  "Étude qualitative sociotechnique": {
    "en": "Sociotechnical qualitative study",
    "es": "Estudio cualitativo sociotécnico",
    "zh": "社会技术定性研究",
    "ar": "دراسة نوعية اجتماعية تقنية",
    "ru": "Социотехническое качественное исследование"
  },
  "Journal Article; Observational Study; Research Support, Non-U.S. Gov't": {
    "en": "Journal article; observational study; non-US government funding",
    "es": "Artículo de revista; estudio observacional; financiación pública no estadounidense",
    "zh": "期刊论文；观察性研究；非美国政府资助",
    "ar": "مقالة علمية؛ دراسة رصدية؛ تمويل حكومي من خارج الولايات المتحدة",
    "ru": "Журнальная статья; наблюдательное исследование; иностранная государственная поддержка"
  },
  "Étude observationnelle de programme": {
    "en": "Observational programme study",
    "es": "Estudio observacional de programa",
    "zh": "观察性项目研究",
    "ar": "دراسة رصدية لبرنامج",
    "ru": "Наблюдательное исследование программы"
  },
  "Article conceptuel": {
    "en": "Conceptual article",
    "es": "Artículo conceptual",
    "zh": "概念性文章",
    "ar": "مقالة مفاهيمية",
    "ru": "Концептуальная статья"
  },
  "Étude quasi-expérimentale": {
    "en": "Quasi-experimental study",
    "es": "Estudio cuasiexperimental",
    "zh": "准实验研究",
    "ar": "دراسة شبه تجريبية",
    "ru": "Квазиэкспериментальное исследование"
  },
  "Étude observationnelle": {
    "en": "Observational study",
    "es": "Estudio observacional",
    "zh": "观察性研究",
    "ar": "دراسة رصدية",
    "ru": "Наблюдательное исследование"
  },
  "Revue des outils / article de synthèse": {
    "en": "Tool review / synthesis article",
    "es": "Revisión de herramientas / artículo de síntesis",
    "zh": "工具综述／综合性文章",
    "ar": "مراجعة أدوات / مقالة تركيبية",
    "ru": "Обзор инструментов / обзорная статья"
  },
  "Analyse de réseau social d’implantation": {
    "en": "Implementation social network analysis",
    "es": "Análisis de redes sociales de implementación",
    "zh": "实施过程社会网络分析",
    "ar": "تحليل الشبكات الاجتماعية للتنفيذ",
    "ru": "Анализ социальных сетей при внедрении"
  },
  "Étude mixte": {
    "en": "Mixed-method study",
    "es": "Estudio de métodos mixtos",
    "zh": "混合方法研究",
    "ar": "دراسة بأساليب مختلطة",
    "ru": "Исследование смешанными методами"
  },
  "Entrepreneuriat": {
    "en": "Entrepreneurship",
    "es": "Emprendimiento",
    "zh": "创业",
    "ar": "ريادة الأعمال",
    "ru": "Предпринимательство"
  },
  "Formation": {
    "en": "Education",
    "es": "Formación",
    "zh": "教育",
    "ar": "التعليم",
    "ru": "Образование"
  },
  "Expérience": {
    "en": "Experience",
    "es": "Experiencia",
    "zh": "工作经历",
    "ar": "الخبرة المهنية",
    "ru": "Опыт работы"
  }
};
const traduire=(lang,libelle)=>lang==="fr" ? libelle : (types[libelle]?.[lang] || libelle);
module.exports={types,traduire};
