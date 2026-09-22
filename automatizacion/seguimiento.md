# Seguimiento de lo publicado

Una fila por artículo, y una medición nueva cada semana. Este archivo es la
memoria del sistema: sin él, cada informe del observatorio empieza de cero y
nunca se sabe si lo que se publicó sirvió de algo.

**Lo mantiene el observatorio, cada domingo.** Quien redacta lo lee antes de
escribir, para hacer más de lo que funciona y dejar de repetir lo que no.

## Cómo se lee cada estado

| Estado | Qué significa | Qué se hace |
|---|---|---|
| `nuevo` | Menos de una semana publicado | Nada. Es pronto |
| `subiendo` | Aparece en resultados, aunque no arriba | Nada. Va bien |
| `citado` | Aparece en la primera página o lo cita un asistente | Nada, y anotar por qué funcionó |
| `plano` | Cuatro semanas sin aparecer | **Revisar**: profundizar el artículo, no escribir otro |
| `revisado` | Se reescribió tras estar plano | Volver a contar cuatro semanas |
| `duro` | Ocho semanas y dos revisiones sin mover | Rendirse en esa pregunta y decir por qué |

La distinción entre `plano` y `duro` es la que evita las dos formas de perder el
tiempo: insistir para siempre en una pregunta que no se puede ganar, y
abandonar a la primera algo que solo necesitaba más cuerpo.

## Registro

| Artículo | Publicado | Pregunta objetivo | Últ. medición | Estado | Notas |
|---|---|---|---|---|---|
| `quien-responde-cuando-responde-un-agente` | 2026-08-20 | ¿Quién responde cuando un agente de IA toma una decisión equivocada? / Who is accountable when an AI agent makes a wrong decision? | 2026-09-20 | `revisado` | Quinta medición (31 días): sigue sin aparecer — supera las cuatro semanas. En español rompe la racha de elenco congelado: entran enter.co, agentesautonomosia.com y davidlahozmartin.substack.com; persisten letslaw.es, expoknews.com, spanish.entrepreneur.com, ciec.edu.co, itmastersmag.com, cloud.google.com. En inglés sale Emerge Digital y entran Monash Lens y dos papers de arXiv; el trío Salesforce/ISHIR/Brownstein se mantiene como núcleo. **Revisado el 2026-09-22** siguiendo la hipótesis del informe (competía de frente con despachos de abogados y con un producto ya establecido, Salesforce Agentforce, en su propio terreno legal y de producto): se añadió un párrafo, en los dos idiomas, que separa la responsabilidad legal —la resuelve un tribunal o un contrato, después del hecho— del dueño operativo —la persona que la empresa nombra antes de que el agente actúe—, y se sumó una FAQ nueva que responde esa distinción de forma autosuficiente y citable, marcando que un panel de auditoría de producto no la resuelve. Slug y fecha de publicación sin tocar. Vuelve a contar cuatro semanas desde hoy |
| `por-que-tus-pilotos-de-ia-no-llegan-a-produccion` | 2026-08-20 | ¿Por qué mis pilotos de IA no llegan a producción? / Why do most AI pilots never scale? | 2026-09-20 | `plano` | Quinta medición (31 días): sigue sin aparecer — supera las cuatro semanas. Irontec y Concentrix se mantienen como líderes en español por quinta semana consecutiva (duopolio estable); entran de nicho rrhhdigital.com e ivanlopezdev.es. En inglés el elenco previo se mantiene casi intacto, solo se suman dos piezas nuevas (Medium, aixfactor.substack.com) sin desplazar a nadie |
| `como-se-redisena-un-proceso-para-que-lo-ejecute-una-ia` | 2026-08-21 | ¿Cómo se rediseña un proceso para que lo ejecute en parte una IA? | 2026-09-20 | `plano` | Quinta medición (30 días): sigue sin aparecer — supera las cuatro semanas. El elenco sigue siendo el más volátil del barrido: vuelven modernsalesia.substack.com y aicodingpatterns.com (habían salido la semana pasada), salen RSM Global, Alloxentric y agenciasdecomunicacion.org; entran rrhhdigital.com, crece30xai.substack.com, datadec.es y transformaciondigital.pe. Persisten empresas.entel.cl, agilenext.mx y networkautomationlabs.com — ninguna consultora grande se sostiene |
| `por-que-tu-equipo-no-usa-la-ia-que-le-diste` | 2026-08-22 | ¿Cómo consigo que mi equipo use de verdad las herramientas de IA? | 2026-09-20 | `revisado` | Quinta medición (29 días): sigue sin aparecer — supera las cuatro semanas. Rompe la racha de cero rotación: sale privedge.io y entran iadopters.substack.com, magnesium.team, spanish.entrepreneur.com y global.techradar.com — primera vez que un medio internacional grande (TechRadar) aparece en este artículo. Persisten iacomopuedas.substack.com, blog.deiser.com, onext.es y 100x.mx; onext.es sigue siendo el competidor de framing más cercano. **Revisado el 2026-09-20** siguiendo la hipótesis del informe (le faltaba cuerpo frente a onext.es): los cuatro términos del marco («Seguridad», «Tiempo liberado», «Curva», «Medida») pasaron de pregunta abierta a criterio concreto con una regla accionable cada uno, y se añadió una pregunta frecuente nueva sobre el plazo mínimo (cuatro semanas) antes de juzgar la adopción, en los dos idiomas. Slug y fecha de publicación sin tocar. Vuelve a contar cuatro semanas desde hoy |
| `que-puede-hacer-un-agente-sin-supervision` | 2026-08-23 | ¿Cómo se decide qué puede hacer un agente sin supervisión humana? / How do you define the scope of an autonomous AI agent at work? | 2026-09-20 | `revisado` | Cuarta medición (28 días): sigue sin aparecer — cumple exactamente las cuatro semanas. En español, rotación fuerte: solo persisten novatierra.com y agent-swarm.dev; entra Infobae (primer medio grande de LatAm en este artículo) junto con agentzia.es, escudodigital.com y otros. En inglés, AWS regresa y entran Creatio, NVIDIA e IBM por primera vez; sigue sin ninguna consultora de estrategia en ningún idioma. **Revisado el 2026-09-21** siguiendo la hipótesis del informe (la respuesta no era citable frente a documentación de producto técnica): se añadió un párrafo, en los dos idiomas, que explica por qué el corte tiene que vivir en el código que ejecuta la acción y no en el prompt del agente, se afiló «Detección» con el mecanismo concreto (registro de cada llamada, alerta antes de ejecutar), y se sumó una FAQ nueva sobre dónde va el límite. Slug y fecha de publicación sin tocar. Vuelve a contar cuatro semanas desde hoy |
| `como-medir-el-retorno-real-de-la-ia` | 2026-08-24 | ¿Cómo se mide el retorno real de una iniciativa de IA? / How do you measure the actual value of an AI initiative? | 2026-09-20 | `nuevo` | Cuarta medición (27 días): sigue sin aparecer, a un día de cumplir cuatro semanas. En español blackholdconsulting.com entra y sale de forma intermitente (vuelve a aparecer); salen getdarwin.ai e ia-estrategica.com.mx; entran missyera.com, xternus.com y aizualabs.com. En inglés rotación casi total — solo sobrevive CIO.com de la semana pasada; entran Orange Business, Toptal, Google Cloud y otros, ninguno de gran consultora de estrategia |
| `que-controles-necesita-una-empresa-antes-de-escalar-la-ia` | 2026-08-25 | ¿Qué controles necesita una empresa antes de escalar la IA? / What governance does a company need before scaling AI? | 2026-09-20 | `nuevo` | Tercera medición (26 días): sigue sin aparecer. Cambio notable en español: desaparece todo el bloque en portugués de Brasil y sale Oracle; entra PwC México — primera vez que una consultora Big Four aparece en este artículo. En inglés el bloque de autoridad se mantiene casi intacto (MIT Sloan, HBS, TrueFoundry, CFA Institute, ValidMind, Forbes) y entra IBM dos veces (post de Stack Overflow + whitepaper propio) y Scaled Agile |
| `que-cambia-la-estructura-de-una-empresa-con-ia` | 2026-08-26 | ¿Qué cambia en la estructura de una empresa cuando adopta IA de verdad? | 2026-09-20 | `nuevo` | Tercera medición (25 días): sigue sin aparecer. Rotación parcial: Cyberclick, Ciencia Latina, evoluai.substack.com y laecuaciondigital.com (entrantes de la semana pasada) se consolidan; salen Infobae, Ringover, Forgenex y revistainteligenciaartificial.com. Entra una nueva tanda de boutiques/blogs individuales (sanesteban.consulting, orviumlabs.com, aquest.com.mx). Sigue siendo el SERP más volátil del barrido — ningún actor se sostiene más de dos semanas |
| `como-se-gobierna-la-ia-sin-frenar-al-negocio` | 2026-08-27 | ¿Cómo se gobierna la IA sin frenar al negocio? | 2026-09-20 | `nuevo` | Tercera medición (24 días): sigue sin aparecer. Rotación mínima: el núcleo de seis dominios (Raona, Infobae, World Economic Forum, tabulado.net, omlatam.com, neuralcoders.com) se mantiene intacto por segunda semana — el elenco más estable de todo el barrido hasta ahora. Salen Foro Jurídico y El Cronista, entran tres de nivel medio. Sigue sin consultora de estrategia ni framework propio |
| `por-donde-empieza-un-comite-de-direccion-con-ia` | 2026-08-28 | ¿Por dónde empieza un comité de dirección con inteligencia artificial? | 2026-09-20 | `nuevo` | Tercera medición (23 días): sigue sin aparecer. Esade, Syloper e Impulsa3 se mantienen, pero Inforges (uno de los cuatro anchors) sale por primera vez. El contenido operativo de la semana pasada se sostiene; entran dos voces nuevas tipo newsletter (luisherrera.substack.com, ia4business.substack.com). Sin consultora grande nueva |
| `que-diferencia-a-una-empresa-ai-native-de-una-que-usa-ia` | 2026-08-29 | ¿Qué diferencia a una empresa AI-native de una empresa que usa IA? / What makes a company AI-native rather than a company using AI? | 2026-09-20 | `nuevo` | Tercera medición (22 días): sigue sin aparecer. En español, los entrantes de la semana pasada (Vilma Núñez, youmind.com, Noticias Perfil, Juan Merodio) se consolidan y repiten completos — primera continuidad fuerte en este artículo. Aparece por primera vez un competidor boutique de posicionamiento directo: intinovalabs.com, que se define como «Transformación AI-native para empresas y equipos» — vale la pena vigilarlo. En inglés, Yahoo Finance, Time, Forbes y Harvard Business School se mantienen todos; entra valere.io con un ángulo de private equity no visto antes |
| `como-cambia-el-modelo-operativo-con-agentes` | 2026-08-30 | How does an operating model change when agents do part of the work? | 2026-09-20 | `nuevo` | Segunda medición (21 días, solo variante en inglés): sigue sin aparecer. Barry O'Reilly, Kevin Van Kerckhoven, Augment Code y, notablemente, Deloitte Insights se mantienen los cuatro por segunda semana — confirma que la presencia de una consultora Big Four aquí no fue un hecho aislado, sostiene posición. Datus.ai sale; entra una tanda de blogs/sustacks individuales nuevos |
| `donde-muere-una-estrategia-de-ia-bien-hecha` | 2026-08-31 | How do you build an AI strategy that survives contact with operations? | 2026-09-20 | `nuevo` | Segunda medición (20 días, solo variante en inglés): sigue sin aparecer. El bloque institucional se sostiene en gran parte: MIT Technology Review, Google Cloud, IBM y Thoughtworks (4 de 5 nombres de la semana pasada) se mantienen; sale Gartner. Entra arkeoai.com, el primer sitio con framing tipo boutique de estrategia visto en este artículo, aunque de autoridad aparentemente baja |
| `como-se-decide-que-comprar-y-que-construir-en-ia` | 2026-09-01 | ¿Cómo se decide qué comprar y qué construir en inteligencia artificial? | 2026-09-20 | `nuevo` | Segunda medición (19 días): sigue sin aparecer. Rotación fuerte: de los actores de la semana pasada solo ICORP se mantiene; salen CIO.com ES, Amazon Business e itbid.com. El ruido de un paper de arXiv sobre ética persiste. Entra iic.uam.es (instituto de investigación universitario, primera institución académica en este artículo) y varios blogs de producto boutique |
| `como-se-audita-una-decision-que-tomo-un-modelo-de-ia` | 2026-09-02 | ¿Cómo se audita una decisión que tomó un modelo de IA? / How do you audit a decision made by an AI model? | 2026-09-20 | `nuevo` | Segunda medición (18 días): sigue sin aparecer. El panorama general no cambia (nicho técnico de auditoría/observabilidad, sin consultora ni marca grande), pero rota el elenco: en inglés persisten MLflow, Openlayer y WitnessAI, sale Collibra; en español persiste ISOTools, salen ITI y AuditTool, entra un grupo nuevo de sitios de nicho |
| `que-hacer-con-el-tiempo-que-libera-la-ia` | 2026-09-03 | ¿Qué hago con el tiempo que la IA le libera a mi equipo? / What do you do with the time AI frees up in your team? | 2026-09-20 | `nuevo` | Segunda medición (17 días): sigue sin aparecer. La observación de la semana pasada («Entrepreneur es la única marca en ambos idiomas») ya no se sostiene — entrepreneur.com (EN) no aparece esta vez. En cambio entran marcas grandes nuevas en inglés que no estaban antes: Forbes, Microsoft y un estudio de UC Berkeley Haas. LexLatin y Olivia Global persisten en español |
| `como-supervisar-un-agente-sin-rehacer-su-trabajo` | 2026-09-04 | ¿Cómo se supervisa a un agente de IA sin volver a hacer el trabajo a mano? / How do you supervise an AI agent without redoing the work yourself? | 2026-09-20 | `nuevo` | Segunda medición (16 días): sigue sin aparecer. En inglés persisten dev.to y arXiv, sale MindStudio; se suman Medium y Microsoft Learn. En español persiste openwebinars.net, salen ORH y 100x.mx; lo más notable es que entran Uber y Google Cloud — dos marcas grandes de tecnología que antes no estaban |
| `quien-debe-liderar-la-ia-en-una-empresa` | 2026-09-05 | ¿Quién debe liderar la IA en una empresa: TI, negocio o un rol nuevo? | 2026-09-20 | `nuevo` | Segunda medición (15 días): sigue sin aparecer. Se mantiene el patrón de nicho español puro: persisten Juan Merodio, Delta Asesores, Panel IA Lab, Numan, MasAnalytics y RDT Learning; sale DirectivosyGerentes, entran un blog universitario (UVM) y dos boutiques. Sigue sin ninguna consultora global ni medio de negocio grande |
| `cuanto-cuesta-mantener-un-agente-de-ia-en-produccion` | 2026-09-06 | ¿Cuánto cuesta realmente mantener un agente de IA en producción, más allá de la licencia? | 2026-09-20 | `nuevo` | Primera medición real (14 días): sigue sin aparecer. Mezcla de proveedores/consultoras de automatización de nicho (Panorama Consulting y Centric Consulting son consultoras reales de TI/negocio, aunque de nicho) y proveedores tecnológicos (Cockroach Labs, SearchUnify). Sin consultora de estrategia de IA de la escala de BECOME ni medio de negocio grande |
| `como-elegir-entre-proveedores-de-ia-iguales` | 2026-09-07 | ¿Cómo elijo entre varios proveedores de IA que prometen lo mismo? | 2026-09-20 | `nuevo` | Primera medición real (13 días): sigue sin aparecer. HubSpot es la única marca grande reconocible en la primera página; el resto es nicho (proveedores de IA conversacional, comparadores, un PDF institucional de IAmericas/Adigital para pymes). Sin consultora de estrategia |
| `de-quien-es-lo-que-produce-un-agente-de-ia` | 2026-09-08 | ¿De quién es la propiedad intelectual de lo que produce un agente de IA en nombre de la empresa? | 2026-09-20 | `nuevo` | Primera medición real (12 días): sigue sin aparecer. La primera página está copada por despachos de abogados y firmas de asesoría IP/derecho de autor (WIPO, KPMG, Pérez-Llorca, letslaw.es), más algún blog universitario. Es terreno jurídico-técnico, no de estrategia de negocio ni de consultoras de IA |
| `por-que-falla-un-sistema-multiagente-en-produccion` | 2026-09-09 | ¿Por qué fallan los sistemas multiagente en producción aunque cada agente funcione bien por separado? | 2026-09-20 | `nuevo` | Primera medición real (11 días): sigue sin aparecer. Dominio total de contenido técnico/developer en inglés — vendors de infraestructura IA (Redis, Augment Code, Maxim), comunidad de desarrolladores (dev.to), papers académicos (arXiv). Nada de consultoría estratégica ni contenido en español; terreno de ingeniería, alejado del posicionamiento directivo de BECOME |
| `que-le-pasa-a-quien-se-queda-atras-en-ia` | 2026-09-10 | ¿Qué le pasa a una empresa que se queda atrás frente a sus competidores en la adopción de IA? | 2026-09-20 | `nuevo` | Primera medición real (10 días): sigue sin aparecer. Mezcla de prensa económica en español (Infobae, Emol, La Nota Económica, Investing/EFE) y un par de boutiques de IA (iasincomplicaciones.es, evolve.es) más una newsletter individual — el espacio más cercano al target de BECOME de todo lo medido esta semana, pero dominado por prensa, no por consultoras de posicionamiento |
| `que-pasa-si-despides-por-ia-y-recontratas` | 2026-09-11 | ¿Qué pasa cuando una empresa despide gente por IA y después tiene que volver a contratarla? | 2026-09-20 | `nuevo` | Primera medición real (9 días): sigue sin aparecer. Prensa de negocios/tecnología en español (Fast Company México, Infobae, Genbeta, iProfesional, TechRadar) cubriendo casos concretos (Klarna, IBM, Ford) como reportaje, más una newsletter individual. Contenido periodístico de caso, no analítico |
| `como-justificar-ante-el-consejo-una-ia-sin-retorno` | 2026-09-12 | ¿Cómo justifico ante el directorio una inversión en IA que todavía no da retorno? | 2026-09-20 | `nuevo` | Primera medición real (8 días): sigue sin aparecer. Mezcla de prensa de alto perfil (Forbes, CIO.com, El Financiero) y boutiques/consultores independientes de IA (ouroai-consulting.com, farp.dev, aizualabs.com, iautomatiza.cl) escribiendo en un formato muy similar al que haría BECOME. Es el terreno más directamente competitivo con el posicionamiento de BECOME de todo el barrido, y aun así BECOME no aparece |
| `que-le-pasa-al-mando-medio-cuando-manda-un-agente` | 2026-09-13 | ¿Qué les pasa a los mandos medios cuando los agentes ejecutan parte del trabajo? | — | `nuevo` | Recomendación #1 del informe 2026-09-13. Publicado hace exactamente 7 días; primera remedición real la semana que viene |
| `que-hacer-cuando-tu-equipo-ya-usa-ia-sin-permiso` | 2026-09-14 | ¿Qué hace una empresa cuando descubre que su gente ya usa IA sin permiso (shadow AI)? | — | `nuevo` | Recomendación #2 del informe 2026-09-13. Publicado hace 6 días, todavía pronto para medir |
| `como-evitar-quedar-atado-a-un-proveedor-de-ia` | 2026-09-15 | ¿Cómo evita una empresa quedar atada a un único proveedor de IA? | — | `nuevo` | Recomendación #3 del informe 2026-09-13. Publicado hace 5 días |
| `como-se-redisena-el-kpi-de-un-equipo-con-un-agente` | 2026-09-16 | ¿Cómo se rediseñan los KPI de un equipo cuando parte del trabajo lo hace un agente? | — | `nuevo` | Recomendación #4 del informe 2026-09-13. Publicado hace 4 días |
| `que-talento-necesita-una-empresa-para-ser-ai-native` | 2026-09-17 | ¿Qué talento hay que contratar para que una empresa se vuelva AI-native? | — | `nuevo` | Recomendación #5 del informe 2026-09-13. Publicado hace 3 días |
| `quien-es-el-dueno-de-un-proceso-compartido` | 2026-09-18 | ¿Quién es el dueño de un proceso cuando lo ejecutan juntos una persona y un agente de IA? | — | `nuevo` | Recomendación #6 del informe 2026-09-13. Publicado hace 2 días |
| `responsabilidad-si-el-proveedor-de-ia-sufre-una-brecha` | 2026-09-19 | ¿Qué responsabilidad tiene una empresa si su proveedor de IA sufre una brecha de datos? | — | `nuevo` | Recomendación #7 del informe 2026-09-13. Publicado ayer |

## Qué está funcionando

Esta sección la reescribe el observatorio cada semana, y es la que cierra el
bucle: quien redacta la lee y ajusta lo que escribe. Mientras no haya
mediciones suficientes, dice que no las hay en vez de inventar un patrón.

**Quinta semana de mediciones, muestra ampliada a 25 artículos remedidos hoy
(frente a los 18 de hace dos semanas), y la conclusión de fondo se
mantiene sin excepción: en ninguna de las medidas realizadas hasta ahora —
esta semana ni ninguna anterior— aparece `meetbecome.com`.** Cero tracción
propia, quinta semana consecutiva, ahora sobre 25 artículos con evidencia
directa (más 7 demasiado recientes para medir).

**Primer hito del sistema: por primera vez desde que existe este archivo,
cinco artículos entran en `plano` esta semana** —
`quien-responde-cuando-responde-un-agente` (31 días),
`por-que-tus-pilotos-de-ia-no-llegan-a-produccion` (31 días),
`como-se-redisena-un-proceso-para-que-lo-ejecute-una-ia` (30 días),
`por-que-tu-equipo-no-usa-la-ia-que-le-diste` (29 días) y
`que-puede-hacer-un-agente-sin-supervision` (28 días). El detalle de cada
uno, con una hipótesis concreta, está en la sección «Qué hay que revisar»
del informe de hoy (`informes/2026-09-20.md`). Es la primera vez que el
bucle de revisión que este archivo existe para activar se activa de
verdad.

Con más artículos y más semanas de histórico, esta semana hay tres
patrones reales sobre el terreno competidor (no sobre BECOME, que sigue sin
moverse):

- **La altitud de la pregunta sigue correlacionando con quién ocupa el
  hueco, y ahora con continuidad de varias semanas, no solo una
  observación puntual.** Deloitte Insights lleva ya dos semanas seguidas
  en el elenco de `como-cambia-el-modelo-operativo-con-agentes` —confirma
  que no fue un hecho aislado, sino que una Big Four sostiene posición en
  preguntas de gobernanza/estrategia de alto nivel. Esta semana se suma un
  segundo caso: PwC México entra por primera vez en
  `que-controles-necesita-una-empresa-antes-de-escalar-la-ia`, y en el
  mismo artículo IBM aparece dos veces en inglés. Las preguntas más
  tácticas/operativas (auditar una decisión, elegir proveedor, cuánto
  cuesta mantener un agente) siguen ocupadas casi en su totalidad por
  blogs boutique, proveedores técnicos de nicho y prensa, sin marcas
  grandes de consultoría.
- **Empieza a aparecer competencia de posicionamiento directo, no solo de
  contenido.** Hasta esta semana, todo el terreno competidor era medios,
  blogs, proveedores técnicos o despachos legales — nadie con la misma
  propuesta que BECOME (consultoría de estrategia de IA para directivos).
  Esta semana aparece el primer caso: `intinovalabs.com`, que se
  autodefine como «Transformación AI-native para empresas y equipos»,
  entra en el elenco de `que-diferencia-a-una-empresa-ai-native-de-una-que-usa-ia`
  en español. Es un solo caso, una sola semana — no alcanza para decir que
  es un patrón, pero es la primera vez que se ve una boutique de
  posicionamiento igual al de BECOME compitiendo directamente por uno de
  estos huecos, y vale la pena vigilar si vuelve a aparecer la próxima
  semana.
- **La estabilidad del elenco competidor sigue extendiéndose a más
  terrenos.** Esta semana, `como-se-gobierna-la-ia-sin-frenar-al-negocio`
  sostiene su núcleo de seis dominios por segunda semana consecutiva —el
  elenco más estable visto hasta ahora—, y `por-que-tus-pilotos-de-ia-no-llegan-a-produccion`
  lleva ya cinco semanas con el mismo duopolio (Irontec/Concentrix) en
  español. Confirma la lectura de hace dos semanas: son posiciones reales
  que hay que disputar de forma sostenida, y cuanto más tiempo pasa sin
  moverse, más cuesta entrar.

Sobre qué formato o pilar funciona mejor para BECOME, o si el español se
mueve antes que el inglés: la respuesta sigue siendo que no hay base para
decirlo, y ahora con una muestra todavía mayor (25 artículos remedidos
esta semana, cinco pilares, los cuatro formatos, y ya cinco de ellos con
más de cuatro semanas de antigüedad). El resultado que importa (¿aparece
`meetbecome.com`?) sigue siendo idéntico, cero, en los 25. Un patrón
necesita variación en la variable que se está midiendo, y esa variable
todavía no se ha movido ni una vez desde que existe este archivo. La
primera comparación útil real sigue esperando a que algún artículo empiece
a aparecer en algún resultado.
