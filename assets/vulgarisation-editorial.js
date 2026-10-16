"use strict";
/* Edition média de la rubrique 02.4 : médias publiés, photographies sous licence Unsplash.
 * Réinitialise chaque exemplaire de la salle clonée par le hall.
 */
(() => {
  const local=(document.documentElement.lang||'fr').slice(0,2).toLowerCase();
  const i18n={
    fr:{
      heroLabel:'LA SCIENCE EN IMAGES, EN VOIX ET EN MOUVEMENT',
      galleryTitle:'Un studio de communication, pas une suite de diapositives',
      galleryIntro:'Photographies éditoriales illustrant trois gestes complémentaires : prendre la parole, filmer une explication et enregistrer une discussion. Elles ne représentent pas mes activités personnelles.',
      photos:['Prendre la parole et partager les données','Concevoir une vidéo pédagogique','Enregistrer et écouter plusieurs voix'],
      credit:'Photographies : Vitaly Gariev, Detail.co et Gabriel Weyand · Unsplash',
      videoTag:'VIDÉOTHÈQUE • 6 ÉPISODES AUTHENTIFIÉS',
      videoTitle:'Voir comment la santé publique se raconte',
      videoIntro:'Sélection d’épisodes de « Balade santé », production du ministère de la Santé et des Services sociaux du Québec. Vidéos officielles accompagnées de leur contexte et de leur durée.',
      videoCta:'Regarder', videoLaunch:'Lancer la vidéo sélectionnée', videoOpen:'Ouvrir sur YouTube',
      videoConsent:'Le lecteur YouTube est activé uniquement après votre clic. Les sous-titres dépendent de la vidéo et de la plateforme.',
      audioTag:'ESPACE AUDIO • BALADOS RÉELS',
      audioTitle:'Écouter pour comprendre autrement',
      audioIntro:'Un épisode audio permet de laisser le temps aux exemples, aux interrogations et aux nuances. Découvrez directement le balado québécois « Balade santé ».',
      audioCta:'Activer le lecteur audio Spotify', audioOpen:'Écouter sur Apple Podcasts', audioAnother:'Voir tous les épisodes du Québec', audioConsent:'Spotify n’est chargé qu’après votre accord. Un lien externe reste disponible si le lecteur intégré est bloqué.',
      libraryTitle:'Explorer différents canaux', libraryIntro:'Ressources officielles à consulter, et non productions personnelles. Les plateformes et la langue d’origine varient selon le média.',
      categories:['VIDÉO','BALADO','DONNÉES','COURS','OUTIL','GUIDE'],
      visit:'Consulter', disclaimer:'Démonstrations pédagogiques et références publiques : les contenus externes restent sous la responsabilité de leurs auteurs.',
      choicesTitle:'Transformer le jargon sans trahir les idées',
      choicesIntro:'Choisissez un exemple : la formulation accessible doit conserver les limites du constat.',
      before:'Formulation technique',after:'Pour expliquer au public',context:'La nuance à conserver',
      jargon:[
        ['« Étude transversale écologique, association agrégée. »','« On compare des données entre pays, à un moment donné. »','Un lien observé entre pays ne permet pas de conclure à une relation causale entre personnes.'],
        ['« Risque relatif inférieur de 50 %. »','« On passe de 20 à 10 événements sur 100 personnes. »','Préciser le risque initial, la durée et l’incertitude, plutôt que ne donner que le pourcentage relatif.'],
        ['« Déploiement intersectoriel de dispositifs intégrés. »','« Des services de santé et des services sociaux coordonnent leurs actions. »','La coordination suppose des ressources, des accords et l’attention aux choix des personnes.']
      ],
      videoDescriptions:['La santé publique au quotidien : prévention, environnement et responsabilités collectives.','Les boissons énergisantes : bénéfices annoncés, risques et stratégies de marketing.','Tiques, moustiques et maladies : comprendre pour agir en prévention.','La maltraitance envers les personnes aînées, ses signes et ses multiples formes.','Proche aidance : expériences vécues, besoins de soutien et ressources.','Vagues de chaleur : effets sur la santé et moyens de prévention.']
    },
    en:{
      heroLabel:'SCIENCE THROUGH IMAGES, SOUND AND MOTION',galleryTitle:'A science communication studio, not a slide deck',galleryIntro:'Editorial photographs illustrating presenting research, producing video and recording dialogue. These are not images of my personal work.',photos:['Present findings to the public','Produce an educational video','Record and hear different voices'],credit:'Photography: Vitaly Gariev, Detail.co and Gabriel Weyand · Unsplash',
      videoTag:'VIDEO LIBRARY • 6 VERIFIED EPISODES',videoTitle:'How public health is explained',videoIntro:'Official “Balade santé” episodes produced by Québec’s Ministry of Health and Social Services, available in French.',videoCta:'Watch',videoLaunch:'Play selected video',videoOpen:'Open on YouTube',videoConsent:'The YouTube player loads only after you click. Captions depend on the video and platform.',
      audioTag:'AUDIO LIBRARY • REAL PODCAST',audioTitle:'Listening opens other ways to understand',audioIntro:'The Québec podcast “Balade santé” explores public health through conversations with experts.',audioCta:'Load Spotify audio player',audioOpen:'Listen on Apple Podcasts',audioAnother:'See all Québec episodes',audioConsent:'Spotify loads only with your approval; a direct link is available if embedding is blocked.',
      libraryTitle:'Explore other formats',libraryIntro:'Published resources from institutions, not my own productions. Languages vary.',categories:['VIDEO','PODCAST','DATA','COURSE','TOOL','GUIDE'],visit:'Explore',disclaimer:'Educational demonstrations and external sources remain the responsibility of their publishers.',
      choicesTitle:'Translate jargon without losing the evidence',choicesIntro:'Choose an example: an accessible explanation must preserve the limits of the finding.',before:'Technical phrase',after:'Plain-language explanation',context:'Essential caveat',jargon:[
        ['“Ecological cross-sectional study; aggregate association.”','“We compare country-level data collected at one point in time.”','A country-level association does not demonstrate causation at the individual level.'],
        ['“Relative risk reduction of 50%.”','“Events decreased from 20 to 10 out of 100 people.”','The initial risk, time frame and uncertainty are needed.'],
        ['“Integrated cross-sector implementation.”','“Health and social services coordinate their work.”','Real cooperation depends on resources, agreements and people’s preferences.']
      ],
      videoDescriptions:['Everyday public health and collective responsibilities.','Energy drinks, risks and marketing.','Ticks, mosquitoes and prevention.','Recognising elder abuse and its different forms.','Caregiving, lived experience and support.','Heatwaves, health effects and prevention.']
    },
    es:{
      heroLabel:'CIENCIA EN IMÁGENES, VOZ Y MOVIMIENTO',galleryTitle:'Un estudio de comunicación, no una sucesión de diapositivas',galleryIntro:'Fotografías editoriales que ilustran la presentación, el vídeo y el diálogo; no muestran mis actividades.',photos:['Presentar datos','Crear un vídeo educativo','Grabar y escuchar voces'],credit:'Fotografías: Vitaly Gariev, Detail.co y Gabriel Weyand · Unsplash',
      videoTag:'VIDEOTECA • 6 EPISODIOS VERIFICADOS',videoTitle:'Cómo se explica la salud pública',videoIntro:'Selección oficial del programa « Balade santé » del Ministerio de Salud y Servicios Sociales de Quebec. Vídeos en francés.',videoCta:'Ver',videoLaunch:'Reproducir el vídeo seleccionado',videoOpen:'Abrir en YouTube',videoConsent:'YouTube solo se carga después de pulsar; los subtítulos dependen de la plataforma.',
      audioTag:'AUDIOTECA • PÓDCAST REAL',audioTitle:'Escuchar para comprender',audioIntro:'Conversaciones de expertos en el pódcast quebequense « Balade santé ».',audioCta:'Activar reproductor de Spotify',audioOpen:'Escuchar en Apple Podcasts',audioAnother:'Ver episodios de Quebec',audioConsent:'Spotify solo se carga con tu autorización; hay enlaces externos.',
      libraryTitle:'Explorar formatos',libraryIntro:'Recursos institucionales publicados, no producciones personales.',categories:['VÍDEO','PÓDCAST','DATOS','CURSO','HERRAMIENTA','GUÍA'],visit:'Consultar',disclaimer:'Recursos didácticos: los editores son responsables de sus contenidos.',
      choicesTitle:'Explicar la jerga sin perder rigor',choicesIntro:'Seleccione un ejemplo de reformulación.',before:'Lenguaje técnico',after:'Explicación clara',context:'Matiz esencial',jargon:[
        ['« Estudio transversal ecológico, asociación agregada ».','« Comparamos datos de diferentes países en un momento dado ».','Una asociación entre países no demuestra causalidad individual.'],
        ['« Reducción del riesgo relativo del 50 % ».','« De 20 a 10 eventos por cada 100 personas ».','Precisar el riesgo inicial, la duración y la incertidumbre.'],
        ['« Implantación intersectorial integrada ».','« Los servicios sanitarios y sociales coordinan sus acciones ».','La cooperación necesita recursos, acuerdos y atención a las personas.']
      ],
      videoDescriptions:['La salud pública en la vida cotidiana.','Bebidas energéticas y sus riesgos.','Garrapatas, mosquitos y prevención.','Maltrato de personas mayores.','Experiencias de personas cuidadoras.','Olas de calor y prevención.']
    },
    zh:{
      heroLabel:'以图像、声音与动态传播科学',galleryTitle:'真正的科学传播工作室',galleryIntro:'三张编辑图片分别展示研究报告、视频制作和音频录制；并非本人工作实拍。',photos:['向公众介绍数据','制作科普视频','记录多元声音'],credit:'图片：Vitaly Gariev、Detail.co、Gabriel Weyand · Unsplash',
      videoTag:'视频库 · 六集已核实作品',videoTitle:'公共卫生如何被讲述',videoIntro:'魁北克卫生与社会服务部制作的“Balade santé”法语视频。',videoCta:'观看',videoLaunch:'播放选中视频',videoOpen:'在YouTube观看',videoConsent:'仅点击后加载YouTube播放器；字幕取决于平台。',
      audioTag:'音频库 · 真实播客',audioTitle:'通过聆听加深理解',audioIntro:'魁北克“Balade santé”邀请专家讨论公共卫生话题。',audioCta:'加载Spotify音频播放器',audioOpen:'在Apple Podcasts收听',audioAnother:'查看魁北克全部节目',audioConsent:'得到同意后才加载Spotify，并提供外部链接。',
      libraryTitle:'探索不同形式',libraryIntro:'外部机构已发布的资料，并非本人的作品。',categories:['视频','播客','数据','课程','工具','指南'],visit:'浏览',disclaimer:'教育示例与外部资源；出版机构对内容负责。',
      choicesTitle:'用通俗语言准确表达',choicesIntro:'选择一个术语，比较更易懂的表述及其局限。',before:'专业术语',after:'公众表达',context:'关键限制',jargon:[
        ['“生态学横断面研究、汇总层面的关联。”','“比较某一时间不同国家的数据。”','国家层面的关联不能证明个人层面的因果关系。'],
        ['“相对风险降低50%。”','“每100人中发生事件的人数从20降到10。”','还需说明初始风险、时间范围及不确定性。'],
        ['“跨部门一体化实施。”','“医疗和社会服务部门协调行动。”','协调需要资源、制度安排与当事人的意愿。']
      ],videoDescriptions:['日常公共卫生。','能量饮料与健康风险。','蜱虫、蚊虫与预防。','识别老年虐待。','照护者经历与支持。','热浪的健康影响。']
    },
    ar:{
      heroLabel:'العلم بالصورة والصوت والحركة',galleryTitle:'استوديو تواصل علمي، لا شرائح متتابعة',galleryIntro:'صور تحريرية توضح العرض وإنتاج الفيديو وتسجيل الحوار؛ وليست صوراً لنشاطاتي.',photos:['عرض البيانات','إنتاج فيديو توعوي','تسجيل الأصوات المختلفة'],credit:'الصور: Vitaly Gariev وDetail.co وGabriel Weyand · Unsplash',
      videoTag:'مكتبة الفيديو • ٦ حلقات موثقة',videoTitle:'كيف نشرح الصحة العامة',videoIntro:'حلقات رسمية باللغة الفرنسية من برنامج «Balade santé» لوزارة الصحة والخدمات الاجتماعية في كيبيك.',videoCta:'مشاهدة',videoLaunch:'تشغيل الفيديو المختار',videoOpen:'فتح في يوتيوب',videoConsent:'لا يتم تحميل يوتيوب إلا بعد النقر؛ تعتمد الترجمة على المنصة.',
      audioTag:'مكتبة صوتية • بودكاست حقيقي',audioTitle:'الاستماع وسيلة أخرى للفهم',audioIntro:'بودكاست «Balade santé» يتناول الصحة العامة بحوارات مع خبراء.',audioCta:'تحميل مشغل سبوتيفاي',audioOpen:'استمع عبر Apple Podcasts',audioAnother:'كل حلقات كيبيك',audioConsent:'لا يتم تحميل سبوتيفاي إلا بموافقتك، مع رابط خارجي بديل.',
      libraryTitle:'استكشف الوسائط',libraryIntro:'موارد منشورة من جهات علمية، وليست إنتاجاتي.',categories:['فيديو','بودكاست','بيانات','دورة','أداة','دليل'],visit:'زيارة',disclaimer:'أمثلة تعليمية؛ الناشرون مسؤولون عن المحتوى الخارجي.',
      choicesTitle:'تبسيط المصطلحات دون تشويه العلم',choicesIntro:'اختر مثالاً لمقارنة المصطلح بالشرح وحدوده.',before:'مصطلح تقني',after:'شرح للجمهور',context:'قيد مهم',jargon:[
        ['« دراسة بيئية مقطعية وارتباط إجمالي ».','« مقارنة بيانات البلدان في وقت محدد ».','الارتباط بين البلدان لا يثبت السببية على مستوى الأفراد.'],
        ['« انخفاض الخطر النسبي بنسبة 50٪ ».','« انخفاض الأحداث من 20 إلى 10 من أصل 100 شخص ».','يجب توضيح الخطر الأساسي والفترة وعدم اليقين.'],
        ['« تنفيذ متكامل بين القطاعات ».','« تنسيق العمل بين الخدمات الصحية والاجتماعية ».','يعتمد التنسيق على الموارد والاتفاقيات ورغبات الأشخاص.']
      ],videoDescriptions:['الصحة العامة في الحياة اليومية.','مشروبات الطاقة والمخاطر.','القراد والبعوض والوقاية.','إساءة معاملة كبار السن.','تجارب مقدمي الرعاية.','الحرارة والصحة.']
    },
    ru:{
      heroLabel:'НАУКА В ИЗОБРАЖЕНИЯХ, ЗВУКЕ И ДВИЖЕНИИ',galleryTitle:'Студия научной коммуникации, а не набор слайдов',galleryIntro:'Редакционные фотографии показывают выступление, видеозапись и подкаст; это не фотографии моей работы.',photos:['Представлять данные','Снимать образовательное видео','Записывать разговор'],credit:'Фотографии: Vitaly Gariev, Detail.co, Gabriel Weyand · Unsplash',
      videoTag:'ВИДЕОТЕКА • 6 ПРОВЕРЕННЫХ ВЫПУСКОВ',videoTitle:'Как рассказывают об общественном здоровье',videoIntro:'Официальные выпуски «Balade santé» министерства здравоохранения Квебека на французском языке.',videoCta:'Смотреть',videoLaunch:'Запустить выбранное видео',videoOpen:'Открыть на YouTube',videoConsent:'YouTube загружается только после нажатия; субтитры зависят от платформы.',
      audioTag:'АУДИОТЕКА • НАСТОЯЩИЙ ПОДКАСТ',audioTitle:'Слушать, чтобы лучше понимать',audioIntro:'Квебекский подкаст «Balade santé» — разговоры с экспертами об общественном здоровье.',audioCta:'Загрузить Spotify',audioOpen:'Слушать в Apple Podcasts',audioAnother:'Все выпуски из Квебека',audioConsent:'Spotify загружается только с вашего согласия. Есть прямая ссылка.',
      libraryTitle:'Изучить разные форматы',libraryIntro:'Опубликованные материалы организаций, а не мои собственные работы.',categories:['ВИДЕО','ПОДКАСТ','ДАННЫЕ','КУРС','ИНСТРУМЕНТ','РУКОВОДСТВО'],visit:'Открыть',disclaimer:'Учебные примеры; за внешний контент отвечают его издатели.',
      choicesTitle:'Объяснить научный термин без искажения',choicesIntro:'Выберите пример и сравните формулировки.',before:'Техническое выражение',after:'Понятное объяснение',context:'Важное ограничение',jargon:[
        ['«Экологическое поперечное исследование, агрегированная ассоциация».','«Сравниваются показатели разных стран в один период».','Связь на уровне стран не доказывает причинность у отдельных людей.'],
        ['«Относительное снижение риска на 50%».','«Число событий снизилось с 20 до 10 на 100 человек».','Нужно указать исходный риск, время и неопределённость.'],
        ['«Межсекторальное интегрированное внедрение».','«Медицинские и социальные службы согласуют действия».','Координация зависит от ресурсов, договорённостей и желаний людей.']
      ],videoDescriptions:['Общественное здоровье вокруг нас.','Энергетические напитки и риски.','Клещи, комары и профилактика.','Жестокое обращение с пожилыми.','Опыт и поддержка ухаживающих.','Жара и профилактика.']
    }
  };
  const t=i18n[local]||i18n.fr;
  const photos=[
    {url:'https://images.unsplash.com/photo-1758691736545-5c33b6255dca?auto=format&fit=crop&w=1300&q=80',link:'https://unsplash.com/photos/woman-presenting-a-graph-to-an-audience-LzBMjkvZfh8'},
    {url:'https://images.unsplash.com/photo-1764664035154-379971f0e936?auto=format&fit=crop&w=1300&q=80',link:'https://unsplash.com/photos/podcast-recording-setup-with-camera-microphone-and-laptop-d5Tifmm4ILk'},
    {url:'https://images.unsplash.com/photo-1776690329305-fb4141bd528a?auto=format&fit=crop&w=1300&q=80',link:'https://unsplash.com/photos/a-professional-microphone-in-a-recording-studio-lwR2vJy1zgs'}
  ];
  // Identifiants vérifiés dans les lecteurs de vidéos officiels sur Québec.ca.
  const videos=[
    ['3Hn8VOezFPw','La santé publique, c’est quoi ?','23:34'],
    ['m5TINkkZUvE','Les boissons énergisantes','18:12'],
    ['u9zss0S65Iw','Tiques et moustiques','26:15'],
    ['b-4dPw8mTvY','Comprendre et repérer la maltraitance envers les personnes aînées','23:43'],
    ['2tHU7J9xy4A','Les visages de la proche aidance','22:39'],
    ['6POzcSwM1-Q','Les effets de la chaleur sur la santé','20:00']
  ];
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const h=(tag,className,inner)=>{const x=document.createElement(tag);x.className=className;if(inner!==undefined)x.innerHTML=inner;return x;};
  const bound=new WeakSet();
  function mount(section){
    if(!section||bound.has(section))return;
    bound.add(section);
    const find=(q)=>section.querySelector(q);
    const panel=n=>section.querySelector('[data-rubriques="vulgarisation"] > [data-volet="'+n+'"] .rubrique-contenu');
    const heroArt=find('.vs-hero-art');
    if(heroArt){
      const orbit=heroArt.querySelector('.vs-art-orbit');if(orbit)orbit.remove();
      const heroPhoto=h('figure','ve-hero-image','<img src="https://images.unsplash.com/photo-1766853042063-e7fbaccb42c2?auto=format&fit=crop&w=1300&q=80" loading="lazy" decoding="async" width="900" height="620" alt="'+escape(t.photos[0])+'"><figcaption>Giorgio Tomassetti · Unsplash</figcaption>');
      heroArt.prepend(heroPhoto);
    }
    const gallery=find('.vul-galerie');
    if(gallery){
      gallery.classList.add('ve-gallery');
      gallery.innerHTML='<figcaption><span class="ve-overline">'+escape(t.heroLabel)+'</span><strong>'+escape(t.galleryTitle)+'</strong><p>'+escape(t.galleryIntro)+'</p></figcaption><div class="ve-gallery-grid">'+photos.map((p,i)=>'<figure><img src="'+p.url+'" alt="'+escape(t.photos[i])+'" loading="'+(i?'lazy':'eager')+'" decoding="async" width="700" height="520"><figcaption><b>0'+(i+1)+'</b><span>'+escape(t.photos[i])+'</span></figcaption></figure>').join('')+'</div><p class="ve-credit">'+escape(t.credit)+'</p>';
    }
    const videoSection=panel(3);
    if(videoSection){
      const shell=h('section','ve-theatre','<header class="ve-header"><p>'+escape(t.videoTag)+'</p><h4>'+escape(t.videoTitle)+'</h4><span>'+escape(t.videoIntro)+'</span></header><div class="ve-feature"><div class="ve-player"><div class="ve-player-placeholder" role="group" aria-label="'+escape(t.videoLaunch)+'"><img alt="" src="https://i.ytimg.com/vi/3Hn8VOezFPw/hqdefault.jpg" loading="lazy"><div class="ve-player-overlay"><button type="button" class="ve-play">▶ '+escape(t.videoLaunch)+'</button></div></div></div><div class="ve-feature-info"><span>MINISTÈRE DE LA SANTÉ ET DES SERVICES SOCIAUX · QUÉBEC</span><h5 class="ve-active-title"></h5><p class="ve-active-description"></p><div class="ve-feature-bottom"><strong class="ve-active-time"></strong><a class="ve-active-link" target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v=3Hn8VOezFPw">'+escape(t.videoOpen)+' ↗</a></div><small>'+escape(t.videoConsent)+'</small></div></div><div class="ve-episodes" role="group" aria-label="'+escape(t.videoTitle)+'">'+videos.map((v,i)=>'<button type="button" data-ve-episode="'+i+'" aria-pressed="'+(i===0)+'"><span class="ve-episode-image"><img alt="" loading="lazy" width="180" height="100" src="https://i.ytimg.com/vi/'+v[0]+'/hqdefault.jpg"><i>▶</i></span><span class="ve-episode-copy"><small>'+v[2]+' · FR</small><strong>'+escape(v[1])+'</strong></span></button>').join('')+'</div><p class="ve-source">'+escape(t.disclaimer)+' <a href="https://www.quebec.ca/gouvernement/ministeres-organismes/sante-services-sociaux/balado-sante" target="_blank" rel="noopener noreferrer">Québec.ca ↗</a></p>');
      const existing=find('.vs-video');if(existing)existing.remove();
      videoSection.append(shell);
      const player=shell.querySelector('.ve-player');
      let current=0;
      const setVideo=i=>{
        current=i;
        const [id,title,duration]=videos[i];
        shell.querySelectorAll('[data-ve-episode]').forEach(el=>el.setAttribute('aria-pressed',el.dataset.veEpisode===String(i)));
        shell.querySelector('.ve-active-title').textContent=title;
        shell.querySelector('.ve-active-description').textContent=t.videoDescriptions[i];
        shell.querySelector('.ve-active-time').textContent=duration;
        shell.querySelector('.ve-active-link').href='https://www.youtube.com/watch?v='+id;
        player.innerHTML='<div class="ve-player-placeholder"><img alt="" loading="lazy" width="800" height="450" src="https://i.ytimg.com/vi/'+id+'/hqdefault.jpg"><div class="ve-player-overlay"><button type="button" class="ve-play">▶ '+escape(t.videoLaunch)+'</button></div></div>';
      };
      shell.querySelectorAll('[data-ve-episode]').forEach(button=>button.addEventListener('click',()=>setVideo(Number(button.dataset.veEpisode))));
      player.addEventListener('click',event=>{
        const play=event.target.closest('.ve-play');if(!play)return;
        const id=videos[current][0];
        const frame=document.createElement('iframe');
        frame.title=videos[current][1];
        frame.src='https://www.youtube-nocookie.com/embed/'+id+'?rel=0&autoplay=1';
        frame.loading='lazy';frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';frame.allowFullscreen=true;
        player.replaceChildren(frame);
      });
      setVideo(0);
    }
    const resource=panel(6);
    if(resource){
      const media=h('section','ve-audio','<div class="ve-audio-photo"><img alt="" loading="lazy" src="'+photos[2].url+'"></div><div class="ve-audio-content"><p class="ve-overline">'+escape(t.audioTag)+'</p><h4>'+escape(t.audioTitle)+'</h4><p>'+escape(t.audioIntro)+'</p><div class="ve-audio-actions"><button type="button" class="ve-load-podcast">♫ '+escape(t.audioCta)+'</button><a target="_blank" rel="noopener noreferrer" href="https://podcasts.apple.com/us/podcast/balade-sant%C3%A9/id1821260656?l=fr-FR">'+escape(t.audioOpen)+' ↗</a><a target="_blank" rel="noopener noreferrer" href="https://baladoquebec.ca/baladesante/">'+escape(t.audioAnother)+' ↗</a></div><p class="ve-audio-disclaimer">'+escape(t.audioConsent)+'</p><div class="ve-audio-embed" hidden></div></div>');
      resource.prepend(media);
      media.querySelector('.ve-load-podcast').addEventListener('click',()=>{
        const embed=media.querySelector('.ve-audio-embed');
        const frame=document.createElement('iframe');
        frame.src='https://open.spotify.com/embed/show/30rqlyFNEeDNJCVd9OcxNh?utm_source=generator&theme=0';frame.title='Balade santé · Spotify';frame.loading='lazy';frame.allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
        embed.replaceChildren(frame);embed.hidden=false;
        media.querySelector('.ve-load-podcast').hidden=true;
      });
      const library=[
        ['https://www.who.int/podcasts/series/science-in-5','OMS · Science in 5',0],
        ['https://www.quebec.ca/gouvernement/ministeres-organismes/sante-services-sociaux/balado-sante','Québec · Balade santé',1],
        ['https://ourworldindata.org/grapher/life-expectancy','Our World in Data · Life expectancy',2],
        ['https://training.cochrane.org/essentials','Cochrane · Evidence Essentials',3],
        ['https://www.cdc.gov/ccindex/widget.html','CDC · Clear Communication Index',4],
        ['https://www.w3.org/WAI/media/av/','W3C · Accessible media',5]
      ];
      const shelf=h('section','ve-library','<header class="ve-header"><p>'+escape(t.heroLabel)+'</p><h4>'+escape(t.libraryTitle)+'</h4><span>'+escape(t.libraryIntro)+'</span></header><div>'+library.map(([url,title,cat],i)=>'<a href="'+url+'" target="_blank" rel="noopener noreferrer"><span class="ve-library-number">0'+(i+1)+'</span><span class="ve-library-detail"><small>'+escape(t.categories[cat])+'</small><strong>'+escape(title)+'</strong></span><span aria-hidden="true">↗</span></a>').join('')+'</div>');
      resource.prepend(shelf);
    }
    const communication=panel(2);
    if(communication){
      const jargon=h('section','ve-jargon','<header class="ve-header"><p>'+escape(t.heroLabel)+'</p><h4>'+escape(t.choicesTitle)+'</h4><span>'+escape(t.choicesIntro)+'</span></header><div class="ve-jargon-tabs" role="group" aria-label="'+escape(t.choicesTitle)+'">'+t.jargon.map((_,i)=>'<button type="button" data-jargon="'+i+'" aria-pressed="'+(i===0)+'">'+String(i+1).padStart(2,'0')+'</button>').join('')+'</div><div class="ve-jargon-grid"><article><small>'+escape(t.before)+'</small><p class="ve-jargon-before"></p></article><article><small>'+escape(t.after)+'</small><p class="ve-jargon-after"></p></article></div><div class="ve-jargon-nuance"><small>'+escape(t.context)+'</small><p></p></div>');
      communication.prepend(jargon);
      const setJargon=i=>{jargon.querySelectorAll('[data-jargon]').forEach(btn=>btn.setAttribute('aria-pressed',btn.dataset.jargon===String(i)));jargon.querySelector('.ve-jargon-before').textContent=t.jargon[i][0];jargon.querySelector('.ve-jargon-after').textContent=t.jargon[i][1];jargon.querySelector('.ve-jargon-nuance p').textContent=t.jargon[i][2];};
      jargon.querySelectorAll('[data-jargon]').forEach(b=>b.addEventListener('click',()=>setJargon(Number(b.dataset.jargon))));setJargon(0);
    }
  }
  const root=document.querySelector('#vulgarisation .section-corps.vulgarisation')||document.querySelector('.section-corps.vulgarisation');
  mount(root);
  const room=document.querySelector('.salle-contenu');
  if(room){
    const activate=()=>room.querySelectorAll('.section-corps.vulgarisation').forEach(mount);
    new MutationObserver(activate).observe(room,{childList:true,subtree:false});
    activate();
  }
})();
