"use strict";
// Source : Eric_Bernier_Methodologie_Officiel_Aere_FilRouge.pptx, confirmé par Éric.
// Il s'agit du devis prévu : les effectifs sont des cibles, pas des résultats.
module.exports = {
  fr: {
    objectifs: {
      titre: "Objectifs spécifiques",
      items: [
        ["O1 · Identifier", "Repérer les combinaisons de besoins sociaux qui nécessitent une réponse intersectorielle."],
        ["O2 · Analyser", "Comparer les partenaires, les liens et la coordination autour de chaque profil de besoins."],
        ["O3 · Recommander", "Transformer les résultats en recommandations adaptées au contexte local."],
      ],
    },
    titre: "Méthodologie détaillée",
    etat: "Protocole de recherche en cours : les étapes ci-dessous décrivent le devis prévu. Les effectifs, durées et taux de réponse sont des cibles à confirmer, et non des résultats obtenus.",
    devis: {
      titre: "Devis et posture de recherche",
      items: [
        ["Devis en plusieurs phases", "Une revue de portée (O1), une analyse de réseaux sociaux égocentrée sur le CLSC avec un devis mixte séquentiel explicatif (O2 : quantitatif puis qualitatif), puis un atelier délibératif (O3)."],
        ["Posture pragmatique", "Choisir et articuler les méthodes pour comprendre et organiser la réponse intersectorielle : les cartes de réseaux orientent les entretiens, puis les résultats réunis alimentent l’atelier."],
      ],
    },
    etapes: [
      {
        code: "O1", titre: "Revue de portée et construction des vignettes", cible: "4–6 vignettes · validation par 6–8 acteurs",
        blocs: [
          ["Corpus et critères", "Études empiriques publiées depuis 2006, en français ou en anglais, dans tous les milieux : adultes de 18 ans et plus, au moins deux domaines sociaux mesurés chez les mêmes personnes et profils issus d’une analyse conjointe des données (classes, regroupements ou typologies). Les données adultes doivent être séparables dans les populations mixtes. Les études sur un seul domaine et les profils uniquement cliniques sont exclus."],
          ["Recherche, sélection et extraction", "MEDLINE, Embase, PsycINFO et PubMed, complétés par la littérature grise. Deux évaluateurs indépendants sélectionnent les études dans Covidence. L’extraction porte sur les domaines sociaux, les profils, leurs fréquences, la méthode, le contexte et la réponse décrite. La revue suit JBI, avec PRESS pour la recherche documentaire et PRISMA-ScR pour le compte rendu."],
          ["Synthèse et vignettes", "Les domaines sont harmonisés à partir du Gravity Project en conservant leur sens d’origine. Une matrice étude × profil et une synthèse inspirée du « best fit » permettent de retenir 4 à 6 profils : chacun doit être étayé par au moins deux études indépendantes, présenter une dominante distincte et être plausible localement. Les vignettes fictives sont validées par 6 à 8 acteurs avant le questionnaire."],
        ],
        reperes: "Repères : Peters et al., 2020 ; Carroll et al., 2013 ; Gravity Project.",
      },
      {
        code: "O2", titre: "Analyse de réseaux : volet quantitatif", cible: "40–80 organisations · ≥ 80 % de réponses visées",
        blocs: [
          ["Terrain et recrutement", "Le réseau est étudié à partir du CLSC (ego) et de ses partenaires. Ses intervenants et gestionnaires nomment leurs interlocuteurs, ensuite sollicités pour documenter aussi les liens entre partenaires. L’équipe d’organisation communautaire, les concertations locales et les répertoires soutiennent le repérage et l’accès au terrain. Un répondant informé par organisation est prévu, avec trois relances."],
          ["Questionnaire par vignette", "Les vignettes décrivent le réseau potentiel : qui mobiliser, pour quel lien (référence, échange d’information, planification conjointe) et qui devrait coordonner ? Les interactions des douze derniers mois documentent le réseau réel. Une liste commune issue du repérage des partenaires permet la comparaison des profils. Le recueil est prévu dans REDCap, avec une durée cible maximale de 30 minutes à vérifier au prétest et deux versions de genre des vignettes."],
          ["Analyses prévues", "Une carte est produite par profil, puis les configurations sont comparées : secteurs mobilisés (tests de permutation), structure cœur–périphérie, fragmentation (modèles mixtes), rôle du CLSC et interaction profil × genre. La comparaison au réseau global mobilise la procédure QAP, fondée sur des permutations de matrices. La puissance est estimée par simulation. Les liens décrivent des intentions déclarées face aux vignettes."],
        ],
        reperes: "Unité de comparaison : une configuration de réseau par profil, avec le même ensemble d’organisations possibles.",
      },
      {
        code: "O2", titre: "Entretiens avec les cartes : volet qualitatif", cible: "15–25 intervenants et gestionnaires",
        blocs: [
          ["Échantillonnage et recueil", "Un échantillonnage raisonné combine le secteur et la position dans le réseau (centre, périphérie, ponts). Les entretiens s’appuient sur les cartes pour explorer le choix ou l’absence de partenaires, les obstacles, les ressources, la coordination et le rôle du CLSC. La démarche relève de la description interprétative ; la taille est guidée par le pouvoir informationnel."],
          ["Méthode du cadre", "La Framework Method associe des codes déductifs (rôle du CLSC, gouvernance, coordination) et des codes inductifs issus des entretiens. Une matrice participants × thèmes rassemble résumés codés et extraits, afin de comparer les secteurs, les positions, les expériences et les profils de besoins."],
          ["Rigueur et intégration", "Un double codage de 20 % du corpus, un journal réflexif et une restitution aux participants sont prévus. Les explications qualitatives sont mises en regard des configurations quantitatives pour comprendre les choix observés et préparer l’atelier."],
        ],
        reperes: "Repères : Thorne, 2016 ; Malterud et al., 2016 ; Gale et al., 2013.",
      },
      {
        code: "O3", titre: "Atelier délibératif et recommandations", cible: "15–20 participants · diversité des perspectives",
        blocs: [
          ["Participants et préparation", "Patients partenaires, soins primaires, organisation communautaire et santé publique, organismes communautaires, acteurs municipaux ou privés et décideurs sont recrutés de manière raisonnée via O2 et les concertations locales. Un dossier par profil réunit la carte, les explications et les questions ouvertes ; les patients partenaires sont préparés à l’atelier."],
          ["Délibération et analyse", "Une animation neutre structure la discussion par profil et documente convergences et divergences, avec des échanges non attribués. La méthode du cadre relie les configurations de réseau, les obstacles, les rôles du CLSC et la faisabilité locale."],
          ["Validation et sortie attendue", "Les recommandations contextualisées sont retournées aux participants pour validation. Un tableau conjoint réunit, pour chaque profil, la configuration du réseau, les explications, les rôles de coordination et les recommandations."],
        ],
        reperes: "La délibération transforme les résultats intégrés en repères pour l’action locale.",
      },
    ],
    integration: {
      titre: "Fil conducteur et intégration",
      texte: "Profil repéré dans les études → vignette fictive validée → carte de réseau → explications des acteurs → recommandations contextualisées. Les cartes guident les entretiens ; cartes et explications alimentent l’atelier et le tableau conjoint, organisé par profil.",
    },
    limites: {
      titre: "Limites et mesures prévues",
      intro: "La thèse vise des repères sur les partenaires, la coordination et les conditions de mise en œuvre pour chaque profil. Elle ne cherche pas à établir un réseau idéal universel.",
      items: [
        ["Intentions déclarées et genre", "Les vignettes comparent des intentions organisationnelles, sans prédire une trajectoire individuelle. Deux versions de genre sont prévues ; d’autres identités sont explorées en entretien."],
        ["Répondant unique et désirabilité sociale", "Solliciter un répondant informé par organisation et formuler les questions de manière neutre."],
        ["Non-réponse", "Prévoir trois relances et des analyses de sensibilité."],
        ["Complexité et contenu associés", "Interpréter les différences en tenant compte de la combinaison des besoins, sans les attribuer à la complexité seule."],
        ["Profils surtout états-uniens et territoire unique", "Valider les vignettes localement et documenter le contexte pour situer la portée des recommandations."],
      ],
    },
  },
  en: {
    objectifs: {
      titre: "Specific objectives",
      items: [
        ["O1 · Identify", "Identify combinations of social needs that require an intersectoral response."],
        ["O2 · Analyse", "Compare partners, ties and coordination around each needs profile."],
        ["O3 · Recommend", "Translate findings into recommendations suited to the local context."],
      ],
    },
    titre: "Detailed methodology",
    etat: "Research protocol in progress: the stages below describe the planned design. Sample sizes, durations and response rates are targets to be confirmed, rather than findings.",
    devis: {
      titre: "Design and research stance",
      items: [
        ["Multiphase design", "A scoping review (O1), CLSC ego-centred social network analysis with an explanatory sequential mixed-methods design (O2: quantitative then qualitative), followed by a deliberative workshop (O3)."],
        ["Pragmatic stance", "Select and connect methods to understand and organise the intersectoral response: network maps guide the interviews, and the integrated findings inform the workshop."],
      ],
    },
    etapes: [
      {
        code: "O1", titre: "Scoping review and vignette development", cible: "4–6 vignettes · validation by 6–8 stakeholders",
        blocs: [
          ["Evidence and criteria", "Empirical studies published since 2006, in French or English, across all settings: adults aged 18 or over, at least two social domains measured in the same people, and profiles derived from joint data analysis (classes, clusters or typologies). Adult data must be separable in mixed populations. Single-domain studies and exclusively clinical profiles are excluded."],
          ["Search, selection and extraction", "MEDLINE, Embase, PsycINFO and PubMed, supplemented by grey literature. Two independent reviewers select studies in Covidence. Extraction covers social domains, profiles, frequencies, methods, context and the response described. The review follows JBI, with PRESS for the search and PRISMA-ScR for reporting."],
          ["Synthesis and vignettes", "Domains are harmonised using the Gravity Project while preserving their original meaning. A study × profile matrix and a synthesis inspired by the best-fit approach yield 4–6 profiles: each must be supported by at least two independent studies, have a distinct dominant domain and be locally plausible. The fictional vignettes are validated by 6–8 stakeholders before the questionnaire."],
        ],
        reperes: "Frameworks: Peters et al., 2020; Carroll et al., 2013; Gravity Project.",
      },
      {
        code: "O2", titre: "Network analysis: quantitative phase", cible: "40–80 organisations · target response rate ≥ 80%",
        blocs: [
          ["Setting and recruitment", "The network is studied from the CLSC (ego) and its partners. Its practitioners and managers name their contacts, who are then approached to document ties between partners as well. The community organising team, local coordination bodies and directories support identification and access. One knowledgeable respondent per organisation is planned, with three reminders."],
          ["Vignette questionnaire", "Vignettes describe the potential network: whom to involve, for which tie (referral, information exchange, joint planning), and who should coordinate? Interactions over the past twelve months document the actual network. A shared list derived from partner identification allows comparison across profiles. Collection is planned in REDCap, with a maximum target duration of 30 minutes to check in pretesting and two gender versions of the vignettes."],
          ["Planned analyses", "A map is produced for each profile, then configurations are compared: sectors involved (permutation tests), core–periphery structure, fragmentation (mixed models), the CLSC’s role, and profile × gender interaction. Comparison with the overall network uses QAP, a matrix permutation procedure. Power is estimated through simulation. Ties describe stated intentions in response to vignettes."],
        ],
        reperes: "Unit of comparison: one network configuration per profile, with the same set of possible organisations.",
      },
      {
        code: "O2", titre: "Map-guided interviews: qualitative phase", cible: "15–25 practitioners and managers",
        blocs: [
          ["Sampling and data collection", "Purposive sampling combines sector and network position (core, periphery, bridges). Map-guided interviews explore the choice or absence of partners, barriers, resources, coordination and the CLSC’s role. The approach draws on interpretive description; sample size is guided by information power."],
          ["Framework Method", "The Framework Method combines deductive codes (CLSC role, governance, coordination) and inductive codes emerging from interviews. A participants × themes matrix brings together coded summaries and extracts to compare sectors, positions, experiences and needs profiles."],
          ["Rigour and integration", "Double coding of 20% of the material, a reflexive journal and feedback to participants are planned. Qualitative explanations are considered alongside quantitative configurations to understand the observed choices and prepare the workshop."],
        ],
        reperes: "Frameworks: Thorne, 2016; Malterud et al., 2016; Gale et al., 2013.",
      },
      {
        code: "O3", titre: "Deliberative workshop and recommendations", cible: "15–20 participants · diverse perspectives",
        blocs: [
          ["Participants and preparation", "Patient partners, primary care, community organising and public health, community organisations, municipal or private actors and decision-makers are purposively recruited through O2 and local coordination bodies. A profile-specific dossier combines the map, explanations and open questions; patient partners are prepared for the workshop."],
          ["Deliberation and analysis", "Neutral facilitation structures discussion by profile and documents agreement and disagreement, with non-attributed exchanges. The Framework Method connects network configurations, barriers, CLSC roles and local feasibility."],
          ["Validation and expected output", "Contextualised recommendations are returned to participants for validation. A joint display brings together, for each profile, the network configuration, explanations, coordination roles and recommendations."],
        ],
        reperes: "Deliberation translates integrated findings into guidance for local action.",
      },
    ],
    integration: {
      titre: "Connecting the phases",
      texte: "Profile identified in studies → validated fictional vignette → network map → stakeholders’ explanations → contextualised recommendations. Maps guide interviews; maps and explanations inform the workshop and the joint display, organised by profile.",
    },
    limites: {
      titre: "Limitations and planned measures",
      intro: "The thesis aims to provide guidance on partners, coordination and implementation conditions for each profile. It does not seek to establish a universal ideal network.",
      items: [
        ["Stated intentions and gender", "Vignettes compare organisational intentions without predicting individual trajectories. Two gender versions are planned; other identities are explored in interviews."],
        ["Single respondent and social desirability", "Approach one knowledgeable respondent per organisation and use neutral question wording."],
        ["Non-response", "Plan three reminders and sensitivity analyses."],
        ["Complexity and content are linked", "Interpret differences in relation to the combination of needs, without attributing them to complexity alone."],
        ["Mostly US profiles and a single territory", "Validate vignettes locally and document the context to situate the scope of recommendations."],
      ],
    },
  },
  es: {
    objectifs: {
      titre: "Objetivos específicos",
      items: [
        ["O1 · Identificar", "Identificar las combinaciones de necesidades sociales que requieren una respuesta intersectorial."],
        ["O2 · Analizar", "Comparar los socios, los vínculos y la coordinación en torno a cada perfil de necesidades."],
        ["O3 · Recomendar", "Transformar los resultados en recomendaciones adaptadas al contexto local."],
      ],
    },
    titre: "Metodología detallada",
    etat: "Protocolo de investigación en curso: las etapas siguientes describen el diseño previsto. Los tamaños de muestra, las duraciones y las tasas de respuesta son metas por confirmar, no resultados obtenidos.",
    devis: {
      titre: "Diseño y postura de investigación",
      items: [
        ["Diseño en varias fases", "Una revisión de alcance (O1), un análisis de redes sociales egocéntrico centrado en el CLSC con diseño mixto secuencial explicativo (O2: cuantitativo y luego cualitativo), seguido de un taller deliberativo (O3)."],
        ["Postura pragmática", "Elegir y articular los métodos para comprender y organizar la respuesta intersectorial: los mapas de redes orientan las entrevistas y los resultados integrados alimentan el taller."],
      ],
    },
    etapes: [
      {
        code: "O1", titre: "Revisión de alcance y construcción de viñetas", cible: "4–6 viñetas · validación por 6–8 actores",
        blocs: [
          ["Corpus y criterios", "Estudios empíricos publicados desde 2006, en francés o inglés, en cualquier entorno: adultos de 18 años o más, al menos dos ámbitos sociales medidos en las mismas personas y perfiles derivados de un análisis conjunto de los datos (clases, agrupaciones o tipologías). Los datos de adultos deben poder separarse en poblaciones mixtas. Se excluyen los estudios de un solo ámbito y los perfiles únicamente clínicos."],
          ["Búsqueda, selección y extracción", "MEDLINE, Embase, PsycINFO y PubMed, junto con literatura gris. Dos revisores independientes seleccionan los estudios en Covidence. Se extraen los ámbitos sociales, los perfiles, sus frecuencias, el método, el contexto y la respuesta descrita. La revisión sigue JBI, con PRESS para la búsqueda documental y PRISMA-ScR para la presentación."],
          ["Síntesis y viñetas", "Los ámbitos se armonizan a partir del Gravity Project, conservando su sentido original. Una matriz estudio × perfil y una síntesis inspirada en el enfoque «best fit» permiten seleccionar de 4 a 6 perfiles: cada uno debe estar respaldado por al menos dos estudios independientes, tener un ámbito dominante distinto y ser plausible localmente. Las viñetas ficticias se validan con 6 a 8 actores antes del cuestionario."],
        ],
        reperes: "Marcos: Peters et al., 2020; Carroll et al., 2013; Gravity Project.",
      },
      {
        code: "O2", titre: "Análisis de redes: fase cuantitativa", cible: "40–80 organizaciones · meta de respuestas ≥ 80 %",
        blocs: [
          ["Terreno y reclutamiento", "La red se estudia a partir del CLSC (ego) y de sus socios. Sus profesionales y gestores nombran a sus interlocutores, a quienes se solicita documentar también los vínculos entre socios. El equipo de organización comunitaria, las instancias locales de concertación y los directorios apoyan la identificación y el acceso. Se prevé un encuestado informado por organización y tres recordatorios."],
          ["Cuestionario por viñeta", "Las viñetas describen la red potencial: ¿a quién movilizar, para qué vínculo (derivación, intercambio de información, planificación conjunta) y quién debería coordinar? Las interacciones de los últimos doce meses documentan la red real. Una lista común derivada de la identificación de socios permite comparar perfiles. La recogida se prevé en REDCap, con una duración objetivo máxima de 30 minutos que se comprobará en la prueba piloto y dos versiones de género de las viñetas."],
          ["Análisis previstos", "Se produce un mapa por perfil y se comparan las configuraciones: sectores movilizados (pruebas de permutación), estructura núcleo–periferia, fragmentación (modelos mixtos), papel del CLSC e interacción perfil × género. La comparación con la red global emplea QAP, un procedimiento de permutación de matrices. La potencia se estima por simulación. Los vínculos describen intenciones declaradas ante las viñetas."],
        ],
        reperes: "Unidad de comparación: una configuración de red por perfil, con el mismo conjunto de organizaciones posibles.",
      },
      {
        code: "O2", titre: "Entrevistas con los mapas: fase cualitativa", cible: "15–25 profesionales de intervención y gestores",
        blocs: [
          ["Muestreo y recogida", "Un muestreo intencional combina el sector y la posición en la red (núcleo, periferia, puentes). Las entrevistas se apoyan en los mapas para explorar la elección o ausencia de socios, los obstáculos, los recursos, la coordinación y el papel del CLSC. Se adopta la descripción interpretativa; el tamaño de la muestra se guía por el poder informativo."],
          ["Método del marco", "La Framework Method combina códigos deductivos (papel del CLSC, gobernanza, coordinación) e inductivos surgidos de las entrevistas. Una matriz participantes × temas reúne resúmenes codificados y extractos para comparar sectores, posiciones, experiencias y perfiles de necesidades."],
          ["Rigor e integración", "Se prevén una doble codificación del 20 % del corpus, un diario reflexivo y una devolución a los participantes. Las explicaciones cualitativas se relacionan con las configuraciones cuantitativas para comprender las elecciones observadas y preparar el taller."],
        ],
        reperes: "Marcos: Thorne, 2016; Malterud et al., 2016; Gale et al., 2013.",
      },
      {
        code: "O3", titre: "Taller deliberativo y recomendaciones", cible: "15–20 participantes · diversidad de perspectivas",
        blocs: [
          ["Participantes y preparación", "Pacientes colaboradores, atención primaria, organización comunitaria y salud pública, organizaciones comunitarias, actores municipales o privados y responsables de decisiones se reclutan intencionalmente mediante O2 y las instancias locales de concertación. Un dossier por perfil reúne el mapa, las explicaciones y las preguntas abiertas; se prepara a los pacientes colaboradores para el taller."],
          ["Deliberación y análisis", "Una facilitación neutral estructura la discusión por perfil y documenta convergencias y divergencias, con intercambios no atribuidos. El método del marco relaciona las configuraciones de red, los obstáculos, los papeles del CLSC y la viabilidad local."],
          ["Validación y producto esperado", "Las recomendaciones contextualizadas se devuelven a los participantes para su validación. Una tabla conjunta reúne, para cada perfil, la configuración de la red, las explicaciones, los papeles de coordinación y las recomendaciones."],
        ],
        reperes: "La deliberación transforma los resultados integrados en orientaciones para la acción local.",
      },
    ],
    integration: {
      titre: "Hilo conductor e integración",
      texte: "Perfil identificado en los estudios → viñeta ficticia validada → mapa de red → explicaciones de los actores → recomendaciones contextualizadas. Los mapas guían las entrevistas; los mapas y las explicaciones alimentan el taller y la tabla conjunta, organizada por perfil.",
    },
    limites: {
      titre: "Limitaciones y medidas previstas",
      intro: "La tesis busca orientaciones sobre los socios, la coordinación y las condiciones de implementación para cada perfil. No pretende establecer una red ideal universal.",
      items: [
        ["Intenciones declaradas y género", "Las viñetas comparan intenciones organizativas sin predecir una trayectoria individual. Se prevén dos versiones de género; otras identidades se exploran en las entrevistas."],
        ["Encuestado único y deseabilidad social", "Solicitar una persona bien informada por organización y formular las preguntas de manera neutral."],
        ["Falta de respuesta", "Prever tres recordatorios y análisis de sensibilidad."],
        ["Complejidad y contenido asociados", "Interpretar las diferencias considerando la combinación de necesidades, sin atribuirlas únicamente a la complejidad."],
        ["Perfiles principalmente estadounidenses y un solo territorio", "Validar las viñetas localmente y documentar el contexto para situar el alcance de las recomendaciones."],
      ],
    },
  },
  zh: {
    objectifs: {
      titre: "具体研究目标",
      items: [
        ["O1 · 识别", "识别需要跨部门回应的社会需求组合。"],
        ["O2 · 分析", "比较各需求类型所涉及的合作伙伴、联系及协调方式。"],
        ["O3 · 建议", "将研究结果转化为适合当地情境的建议。"],
      ],
    },
    titre: "详细研究方法",
    etat: "研究方案正在推进：以下内容描述拟采用的研究设计。样本量、时长和响应率均为有待确认的目标，并非已经取得的结果。",
    devis: {
      titre: "研究设计与立场",
      items: [
        ["多阶段设计", "范围综述（O1）、以CLSC为ego的自我中心社会网络分析，采用解释性顺序混合方法设计（O2：先定量、后定性），以及审议式工作坊（O3）。"],
        ["实用主义立场", "根据理解和组织跨部门回应的需要选择并衔接方法：网络图指导访谈，整合后的结果再用于工作坊。"],
      ],
    },
    etapes: [
      {
        code: "O1", titre: "范围综述与情景案例构建", cible: "4–6个案例 · 由6–8位相关行动者验证",
        blocs: [
          ["文献与纳入标准", "纳入2006年以来以法语或英语发表、涵盖各类场景的实证研究：对象为18岁及以上成年人，在同一批人中测量至少两个社会需求领域，并通过联合数据分析形成类型（类别、聚类或类型学）。混合年龄人群的成年数据须能单独提取。仅涉及一个领域或纯临床类型的研究不纳入。"],
          ["检索、筛选与提取", "检索MEDLINE、Embase、PsycINFO和PubMed，并补充灰色文献。两名独立评审者在Covidence中筛选研究。提取社会领域、类型、频率、方法、情境及所描述的回应。综述遵循JBI方法，检索参考PRESS，报告遵循PRISMA-ScR。"],
          ["综合与案例", "借助Gravity Project统一领域分类，同时保留原有含义。使用研究×类型矩阵及借鉴“best fit”的综合方法，选出4–6种类型：每种均需至少两项独立研究支持，具有不同的主导领域，且在当地具有合理性。问卷使用前，由6–8位相关行动者验证这些虚构案例。"],
        ],
        reperes: "方法依据：Peters等，2020；Carroll等，2013；Gravity Project。",
      },
      {
        code: "O2", titre: "网络分析：定量阶段", cible: "40–80个组织 · 目标响应率≥80%",
        blocs: [
          ["研究场域与招募", "研究以CLSC（ego）及其合作伙伴为起点。其从业人员与管理者列出联系对象，再邀请这些对象记录合作伙伴之间的联系。社区组织工作团队、当地协调平台及名录协助识别伙伴并进入研究场域。计划每个组织由一位知情答卷者参与，并发送三次提醒。"],
          ["情景案例问卷", "情景案例描述潜在网络：动员谁、建立何种联系（转介、信息交换、共同规划）、由谁协调？过去十二个月的互动记录实际网络。根据伙伴识别形成的共同名单，用于比较不同需求类型。计划通过REDCap收集数据，目标答卷时间最多30分钟，需经预试确认，案例设有两个性别版本。"],
          ["拟进行的分析", "为各类型生成网络图，再比较所动员的部门（置换检验）、核心—边缘结构、碎片化（混合模型）、CLSC的角色及类型×性别交互作用。与总体网络的比较采用基于矩阵置换的QAP程序。通过模拟估计统计功效。网络联系反映面对案例时申报的行动意向。"],
        ],
        reperes: "比较单位：各类型对应的网络配置，使用相同的潜在组织集合。",
      },
      {
        code: "O2", titre: "以网络图为引导的访谈：定性阶段", cible: "15–25名从业人员与管理者",
        blocs: [
          ["抽样与资料收集", "目的性抽样结合部门和网络位置（核心、边缘、桥接）。访谈以网络图为依据，探讨合作伙伴的选择或缺席、障碍、资源、协调以及CLSC的角色。采用解释性描述方法，样本量由信息力指导。"],
          ["框架法", "Framework Method结合演绎编码（CLSC角色、治理、协调）和访谈中产生的归纳编码。参与者×主题矩阵汇集编码摘要和原文片段，用于比较部门、位置、经历及需求类型。"],
          ["严谨性与整合", "计划对20%的资料进行双重编码，保留反思日志，并向参与者反馈。将定性解释与定量网络配置对照，以理解所观察到的选择并为工作坊做准备。"],
        ],
        reperes: "方法依据：Thorne，2016；Malterud等，2016；Gale等，2013。",
      },
      {
        code: "O3", titre: "审议式工作坊与建议", cible: "15–20名参与者 · 多元视角",
        blocs: [
          ["参与者与准备", "通过O2和当地协调平台进行目的性招募，涵盖患者伙伴、初级照护、社区组织工作与公共卫生团队、社区机构、市政或私营部门及决策者。为每种类型准备包含网络图、解释及开放问题的资料包，并提前帮助患者伙伴做好参与准备。"],
          ["审议与分析", "由中立主持者按类型组织讨论，记录共识和分歧，不将讨论内容归于个人。框架法用于关联网络配置、障碍、CLSC角色及当地可行性。"],
          ["验证与预期产出", "将情境化建议反馈给参与者验证。按类型建立联合展示表，汇集网络配置、解释、协调角色及建议。"],
        ],
        reperes: "通过审议，将整合结果转化为当地行动的参考依据。",
      },
    ],
    integration: {
      titre: "各阶段的衔接与整合",
      texte: "文献中识别的类型→经验证的虚构案例→网络图→行动者的解释→情境化建议。网络图指导访谈；网络图与解释共同用于工作坊及按类型组织的联合展示表。",
    },
    limites: {
      titre: "局限与拟采取的措施",
      intro: "论文旨在为各需求类型提供有关合作伙伴、协调及实施条件的参考，而非建立一种普遍适用的理想网络。",
      items: [
        ["申报意向与性别", "情景案例比较组织意向，不能预测个人轨迹。设置两个性别版本，其他身份在访谈中探讨。"],
        ["单一答卷者与社会期许偏差", "每个组织邀请一位知情答卷者，并采用中性问题表述。"],
        ["未响应", "计划发送三次提醒并进行敏感性分析。"],
        ["复杂性与内容相关", "结合需求组合解释差异，避免将差异仅归于复杂性。"],
        ["类型主要来自美国且仅研究一个辖区", "在当地验证案例，并记录情境以明确建议的适用范围。"],
      ],
    },
  },
  ar: {
    objectifs: {
      titre: "الأهداف المحددة",
      items: [
        ["O1 · تحديد", "تحديد مجموعات الاحتياجات الاجتماعية التي تستلزم استجابة مشتركة بين القطاعات."],
        ["O2 · تحليل", "مقارنة الشركاء والروابط والتنسيق حول كل نمط من الاحتياجات."],
        ["O3 · توصية", "تحويل النتائج إلى توصيات ملائمة للسياق المحلي."],
      ],
    },
    titre: "المنهجية التفصيلية",
    etat: "بروتوكول بحث قيد العمل: تصف المراحل التالية التصميم المزمع. أحجام العينات والمدد ومعدلات الاستجابة أهداف تحتاج إلى تأكيد، وليست نتائج محققة.",
    devis: {
      titre: "تصميم البحث وموقفه المنهجي",
      items: [
        ["تصميم متعدد المراحل", "مراجعة نطاقية (O1)، وتحليل للشبكات الاجتماعية يتمركز حول CLSC بوصفه ego ضمن تصميم مختلط تتابعي تفسيري (O2: كمي ثم نوعي)، ثم ورشة تداولية (O3)."],
        ["موقف براغماتي", "اختيار المناهج وربطها لفهم الاستجابة بين القطاعات وتنظيمها: توجّه خرائط الشبكات المقابلات، ثم تغذّي النتائج المتكاملة الورشة."],
      ],
    },
    etapes: [
      {
        code: "O1", titre: "المراجعة النطاقية وبناء الحالات الافتراضية", cible: "4–6 حالات · مراجعتها من 6–8 فاعلين",
        blocs: [
          ["المصادر ومعايير الإدراج", "دراسات تجريبية منشورة منذ 2006 بالفرنسية أو الإنجليزية، في جميع البيئات: بالغون من 18 سنة فأكثر، وقياس مجالين اجتماعيين على الأقل لدى الأشخاص أنفسهم، وأنماط مستمدة من تحليل مشترك للبيانات (فئات أو عناقيد أو تصنيفات). يجب إمكان فصل بيانات البالغين في العينات المختلطة. تُستبعد دراسات المجال الواحد والأنماط السريرية فقط."],
          ["البحث والاختيار والاستخراج", "MEDLINE وEmbase وPsycINFO وPubMed، مع الأدبيات الرمادية. يختار مراجعان مستقلان الدراسات باستخدام Covidence. يشمل الاستخراج المجالات الاجتماعية والأنماط وتواترها والمنهج والسياق والاستجابة الموصوفة. تتبع المراجعة JBI، مع PRESS للبحث الوثائقي وPRISMA-ScR للتقرير."],
          ["التوليف والحالات", "تُوحّد المجالات بالاستناد إلى Gravity Project مع الحفاظ على معناها الأصلي. تتيح مصفوفة دراسة × نمط وتوليف مستلهم من «best fit» اختيار 4 إلى 6 أنماط: تدعم كل نمط دراستان مستقلتان على الأقل، وله مجال غالب مميز، ويكون معقولًا محليًا. يراجع 6 إلى 8 فاعلين الحالات الافتراضية قبل الاستبيان."],
        ],
        reperes: "مرجعيات منهجية: Peters وآخرون، 2020؛ Carroll وآخرون، 2013؛ Gravity Project.",
      },
      {
        code: "O2", titre: "تحليل الشبكات: المرحلة الكمية", cible: "40–80 منظمة · معدل استجابة مستهدف ≥ 80٪",
        blocs: [
          ["الميدان والاستقطاب", "تُدرس الشبكة انطلاقًا من CLSC بوصفه الفاعل المحوري (ego) وشركائه. يسمّي ممارسوه ومديروه الجهات التي يتعاملون معها، ثم تُدعى هذه الجهات لتوثيق الروابط بين الشركاء أيضًا. يدعم فريق التنظيم المجتمعي وهيئات التنسيق المحلية والأدلة تحديد الشركاء والوصول إليهم. يُخطط لمجيب مطّلع لكل منظمة وثلاث رسائل تذكير."],
          ["استبيان الحالات الافتراضية", "تصف الحالات الافتراضية الشبكة المحتملة: من يُشرك، ولأي رابط (إحالة، تبادل معلومات، تخطيط مشترك)، ومن ينبغي أن ينسّق؟ توثّق تفاعلات الأشهر الاثني عشر الماضية الشبكة الفعلية. تتيح قائمة مشتركة ناتجة عن تحديد الشركاء مقارنة الأنماط. يُخطط لجمع البيانات عبر REDCap بمدة مستهدفة قصوى 30 دقيقة تُراجع في الاختبار الأولي، مع نسختين للحالات بحسب النوع الاجتماعي."],
          ["التحليلات المقررة", "تُنتج خريطة لكل نمط، ثم تُقارن التكوينات: القطاعات المشاركة (اختبارات التبديل)، وبنية المركز–الأطراف، والتجزؤ (نماذج مختلطة)، ودور CLSC، وتفاعل النمط × النوع الاجتماعي. تستخدم المقارنة بالشبكة الإجمالية إجراء QAP القائم على تبديل المصفوفات. تُقدّر القوة الإحصائية بالمحاكاة. تصف الروابط نوايا مُعلنة إزاء الحالات الافتراضية."],
        ],
        reperes: "وحدة المقارنة: تكوين شبكة لكل نمط، مع المجموعة نفسها من المنظمات الممكنة.",
      },
      {
        code: "O2", titre: "مقابلات تستند إلى الخرائط: المرحلة النوعية", cible: "15–25 ممارسًا ومديرًا",
        blocs: [
          ["أخذ العينة وجمع البيانات", "يجمع أخذ العينات القصدي بين القطاع والموقع في الشبكة (المركز، الأطراف، الجسور). تستند المقابلات إلى الخرائط لاستكشاف اختيار الشركاء أو غيابهم والعوائق والموارد والتنسيق ودور CLSC. تستند المقاربة إلى الوصف التفسيري، ويسترشد حجم العينة بالقوة المعلوماتية."],
          ["منهج الإطار", "يجمع Framework Method بين رموز استنباطية (دور CLSC، الحوكمة، التنسيق) ورموز استقرائية ناشئة من المقابلات. تجمع مصفوفة مشاركين × موضوعات ملخصات مرمّزة ومقتطفات لمقارنة القطاعات والمواقع والخبرات وأنماط الاحتياجات."],
          ["الصرامة والتكامل", "يُخطط لترميز مزدوج لـ20٪ من المادة، ودفتر تأملي، وإعادة عرض النتائج على المشاركين. تُربط التفسيرات النوعية بالتكوينات الكمية لفهم الخيارات المرصودة وإعداد الورشة."],
        ],
        reperes: "مرجعيات منهجية: Thorne، 2016؛ Malterud وآخرون، 2016؛ Gale وآخرون، 2013.",
      },
      {
        code: "O3", titre: "الورشة التداولية والتوصيات", cible: "15–20 مشاركًا · تنوع وجهات النظر",
        blocs: [
          ["المشاركون والتحضير", "يُستقطب قصديًا مرضى شركاء، والعاملون في الرعاية الأولية والتنظيم المجتمعي والصحة العامة، والمنظمات المجتمعية، والجهات البلدية أو الخاصة وصانعو القرار، عبر O2 وهيئات التنسيق المحلية. يجمع ملف لكل نمط الخريطة والتفسيرات والأسئلة المفتوحة، ويُحضّر المرضى الشركاء للمشاركة في الورشة."],
          ["التداول والتحليل", "ينظّم تيسير محايد النقاش بحسب النمط ويوثّق نقاط الاتفاق والاختلاف، دون إسناد المداخلات إلى أصحابها. يربط منهج الإطار بين تكوينات الشبكة والعوائق وأدوار CLSC والجدوى المحلية."],
          ["التحقق والمخرج المتوقع", "تُعاد التوصيات المرتبطة بالسياق إلى المشاركين للتحقق منها. يجمع جدول مشترك لكل نمط تكوين الشبكة والتفسيرات وأدوار التنسيق والتوصيات."],
        ],
        reperes: "يحوّل التداول النتائج المتكاملة إلى مرجعيات للعمل المحلي.",
      },
    ],
    integration: {
      titre: "الخيط الناظم والتكامل",
      texte: "نمط محدد في الدراسات ← حالة افتراضية متحقق منها ← خريطة شبكة ← تفسيرات الفاعلين ← توصيات مرتبطة بالسياق. توجّه الخرائط المقابلات؛ وتغذّي الخرائط والتفسيرات الورشة والجدول المشترك المنظم بحسب النمط.",
    },
    limites: {
      titre: "الحدود والتدابير المقررة",
      intro: "تهدف الأطروحة إلى توفير مرجعيات بشأن الشركاء والتنسيق وشروط التنفيذ لكل نمط. ولا تسعى إلى وضع شبكة مثالية صالحة لكل السياقات.",
      items: [
        ["النوايا المعلنة والنوع الاجتماعي", "تقارن الحالات الافتراضية نوايا المنظمات دون التنبؤ بمسار فردي. تُعد نسختان بحسب النوع الاجتماعي، وتُستكشف هويات أخرى في المقابلات."],
        ["مجيب واحد والرغبة في القبول الاجتماعي", "طلب مجيب مطّلع لكل منظمة وصياغة الأسئلة بحياد."],
        ["عدم الاستجابة", "تخطيط ثلاث رسائل تذكير وتحليلات حساسية."],
        ["ارتباط التعقيد بالمحتوى", "تفسير الفروق في ضوء مجموعة الاحتياجات دون نسبتها إلى التعقيد وحده."],
        ["أنماط أمريكية غالبًا ومنطقة واحدة", "التحقق من الحالات محليًا وتوثيق السياق لتحديد نطاق التوصيات."],
      ],
    },
  },
  ru: {
    objectifs: {
      titre: "Конкретные цели",
      items: [
        ["O1 · Выявить", "Выявить сочетания социальных потребностей, требующие межсекторального ответа."],
        ["O2 · Проанализировать", "Сравнить партнёров, связи и координацию для каждого профиля потребностей."],
        ["O3 · Рекомендовать", "Преобразовать результаты в рекомендации, соответствующие местному контексту."],
      ],
    },
    titre: "Подробная методология",
    etat: "Исследовательский протокол в работе: ниже описан планируемый дизайн. Объёмы выборок, длительность и доли ответивших — целевые показатели, требующие подтверждения, а не полученные результаты.",
    devis: {
      titre: "Дизайн и исследовательская позиция",
      items: [
        ["Многоэтапный дизайн", "Обзор предметного поля (O1), эгоцентрический анализ социальных сетей с CLSC в центре в последовательном объяснительном дизайне со смешанными методами (O2: количественный, затем качественный этап) и совещательный семинар (O3)."],
        ["Прагматическая позиция", "Выбирать и сочетать методы, чтобы понять и организовать межсекторальный ответ: карты сетей направляют интервью, а объединённые результаты служат основой семинара."],
      ],
    },
    etapes: [
      {
        code: "O1", titre: "Обзор предметного поля и разработка виньеток", cible: "4–6 виньеток · проверка с 6–8 участниками системы",
        blocs: [
          ["Источники и критерии", "Эмпирические исследования с 2006 года на французском или английском языке, в любых условиях: взрослые от 18 лет, не менее двух социальных сфер, измеренных у одних и тех же людей, и профили, полученные при совместном анализе данных (классы, кластеры или типологии). В смешанных популяциях данные взрослых должны выделяться отдельно. Исследования одной сферы и исключительно клинические профили исключаются."],
          ["Поиск, отбор и извлечение", "MEDLINE, Embase, PsycINFO и PubMed, дополненные серой литературой. Два независимых рецензента отбирают исследования в Covidence. Извлекаются социальные сферы, профили, частоты, метод, контекст и описанный ответ. Обзор следует JBI, поиск — PRESS, представление результатов — PRISMA-ScR."],
          ["Синтез и виньетки", "Сферы согласуются на основе Gravity Project с сохранением исходного смысла. Матрица исследование × профиль и синтез, основанный на подходе «best fit», позволяют выбрать 4–6 профилей: каждый должен опираться как минимум на два независимых исследования, иметь отличающуюся ведущую сферу и быть правдоподобным в местных условиях. Вымышленные виньетки проверяются с 6–8 участниками системы до анкетирования."],
        ],
        reperes: "Методологические ориентиры: Peters и др., 2020; Carroll и др., 2013; Gravity Project.",
      },
      {
        code: "O2", titre: "Анализ сетей: количественный этап", cible: "40–80 организаций · целевая доля ответов ≥ 80%",
        blocs: [
          ["Территория и набор", "Сеть изучается от CLSC как центрального участника (ego) и его партнёров. Специалисты и руководители CLSC называют свои контакты, которым затем предлагают описать также связи между партнёрами. Команда по работе с сообществами, местные координационные структуры и справочники помогают определить партнёров и установить контакт. Предусмотрен один осведомлённый респондент от организации и три напоминания."],
          ["Анкета по виньеткам", "Виньетки описывают потенциальную сеть: кого привлечь, для какой связи (направление, обмен информацией, совместное планирование) и кто должен координировать? Взаимодействия за последние двенадцать месяцев описывают фактическую сеть. Общий список выявленных партнёров позволяет сравнивать профили. Сбор запланирован в REDCap с целевой длительностью не более 30 минут, проверяемой предварительно, и двумя гендерными версиями виньеток."],
          ["Планируемый анализ", "Для каждого профиля создаётся карта, затем сравниваются конфигурации: задействованные секторы (пермутационные тесты), структура ядро–периферия, фрагментация (смешанные модели), роль CLSC и взаимодействие профиль × гендер. Для сравнения с общей сетью используется QAP — процедура перестановки матриц. Мощность оценивается моделированием. Связи описывают заявленные намерения в ответ на виньетки."],
        ],
        reperes: "Единица сравнения: конфигурация сети для каждого профиля при одинаковом наборе возможных организаций.",
      },
      {
        code: "O2", titre: "Интервью с опорой на карты: качественный этап", cible: "15–25 специалистов и руководителей",
        blocs: [
          ["Выборка и сбор данных", "Целенаправленная выборка учитывает сектор и положение в сети (ядро, периферия, мосты). Интервью с опорой на карты раскрывают выбор или отсутствие партнёров, препятствия, ресурсы, координацию и роль CLSC. Подход основан на интерпретативном описании; объём выборки определяется информационной силой."],
          ["Рамочный метод", "Framework Method сочетает дедуктивные коды (роль CLSC, управление, координация) с индуктивными кодами из интервью. Матрица участники × темы объединяет закодированные резюме и выдержки для сравнения секторов, позиций, опыта и профилей потребностей."],
          ["Строгость и интеграция", "Предусмотрены двойное кодирование 20% материала, рефлексивный дневник и обратная связь с участниками. Качественные объяснения сопоставляются с количественными конфигурациями, чтобы понять выявленные решения и подготовить семинар."],
        ],
        reperes: "Методологические ориентиры: Thorne, 2016; Malterud и др., 2016; Gale и др., 2013.",
      },
      {
        code: "O3", titre: "Совещательный семинар и рекомендации", cible: "15–20 участников · разнообразие взглядов",
        blocs: [
          ["Участники и подготовка", "Пациенты-партнёры, представители первичной помощи, организации работы с сообществами и общественного здоровья, общественных организаций, муниципальных или частных структур и лица, принимающие решения, целенаправленно приглашаются через O2 и местные координационные структуры. Для каждого профиля готовится досье с картой, объяснениями и открытыми вопросами; пациенты-партнёры заранее готовятся к семинару."],
          ["Обсуждение и анализ", "Нейтральный ведущий организует обсуждение по профилям и фиксирует совпадения и расхождения мнений без указания авторов высказываний. Рамочный метод связывает конфигурации сетей, препятствия, роли CLSC и местную осуществимость."],
          ["Проверка и ожидаемый результат", "Контекстуализированные рекомендации возвращаются участникам для проверки. Совместная таблица объединяет для каждого профиля конфигурацию сети, объяснения, роли координации и рекомендации."],
        ],
        reperes: "Обсуждение преобразует объединённые результаты в ориентиры для местных действий.",
      },
    ],
    integration: {
      titre: "Связь этапов и интеграция",
      texte: "Профиль из исследований → проверенная вымышленная виньетка → карта сети → объяснения участников системы → контекстуализированные рекомендации. Карты направляют интервью; карты и объяснения служат основой семинара и совместной таблицы по профилям.",
    },
    limites: {
      titre: "Ограничения и предусмотренные меры",
      intro: "Диссертация должна дать ориентиры о партнёрах, координации и условиях реализации для каждого профиля. Она не ставит целью универсальную идеальную сеть.",
      items: [
        ["Заявленные намерения и гендер", "Виньетки сравнивают намерения организаций, не предсказывая индивидуальные траектории. Предусмотрены две гендерные версии; другие идентичности изучаются в интервью."],
        ["Один респондент и социальная желательность", "Приглашать осведомлённого респондента от каждой организации и нейтрально формулировать вопросы."],
        ["Неответы", "Предусмотреть три напоминания и анализ чувствительности."],
        ["Связь сложности и содержания", "Интерпретировать различия с учётом сочетания потребностей, не объясняя их одной лишь сложностью."],
        ["Профили преимущественно из США и одна территория", "Проверить виньетки на месте и описать контекст, чтобы обозначить границы применимости рекомендаций."],
      ],
    },
  },
};
