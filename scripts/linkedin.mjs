/**
 * Publica el artículo del día en la página de empresa de LinkedIn.
 *
 * Corre después de que el despliegue haya subido el sitio, y no antes: un post
 * que enlaza a una página que todavía no existe es un post roto, y LinkedIn
 * guarda la previsualización de la primera vez que mira. No hay segunda
 * oportunidad para esa tarjeta.
 *
 * ---- Lo que hace y lo que no ----
 *
 * Publica UN artículo: el más reciente que el repositorio da por publicado y
 * que no se haya publicado ya. No recupera atrasados ni publica en lote —si un
 * día falla, ese artículo se queda sin post y el siguiente sigue su curso—.
 * Rescatar un día viejo tendría que decidirlo una persona, porque un artículo
 * de hace una semana anunciado como novedad es peor que no anunciarlo.
 *
 * ---- Por qué no se fía de la fecha ----
 *
 * «Publica si el artículo es de hoy» parece suficiente y no lo es: el
 * despliegue puede repetirse —un reintento, un arreglo de la tarde, el
 * centinela relanzándolo— y cada repetición volvería a publicar el mismo post.
 * Por eso hay un registro de lo ya anunciado, y es él quien decide.
 *
 * ---- El talón de Aquiles, escrito aquí para que no sorprenda ----
 *
 * El permiso de LinkedIn caduca. Cuánto dura depende del acceso: con la
 * Community Management API aprobada son 365 días, y sin ella 60. Lo dice la
 * propia API, y por eso este script pregunta en vez de dar por buena una cifra
 * escrita: la de BECOME respondió 365 el día que se comprobó, cuando el código
 * llevaba meses diciendo 60.
 *
 * Renovarlo solo está reservado a los socios aprobados de su programa de
 * marketing; para todos los demás hay que volver a autorizar a mano. Es la parte frágil de este
 * mecanismo y no se puede arreglar con código.
 *
 * Lo que sí se puede es que no pille a nadie por sorpresa: antes de publicar,
 * esto le pregunta a LinkedIn cuándo caduca el permiso y avisa con dos semanas
 * de antelación. Un aviso a tiempo convierte una avería en un recordatorio.
 */

const API = 'https://api.linkedin.com/rest/posts';
const INTROSPECCION = 'https://www.linkedin.com/oauth/v2/introspectToken';
const SITIO = 'https://meetbecome.com';
const REGISTRO = '.github/linkedin-publicado.json';
const CARPETA = 'src/content/insights';

/* LinkedIn saca una versión nueva cada mes y mantiene cada una un año como
   mínimo. Se fija aquí, y no se toma «la del mes actual», porque una versión
   que aún no existe da error: el día 1 de cada mes el mecanismo se rompería
   solo. Se sube a mano cuando toque, y la variable permite probar otra sin
   tocar el código. */
const VERSION = process.env.LINKEDIN_VERSION || '202601';

const { readFileSync, writeFileSync, readdirSync, existsSync } = await import('node:fs');
const { join } = await import('node:path');

/* ---- Los secretos, recortados, y por qué eso no es una manía ----
 *
 * El 1 de septiembre la introspección decía «3L, w_organization_social, 365
 * días» y el post se rechazaba con 401 tres segundos después, con el mismo
 * token. Las dos cosas pueden ser ciertas a la vez si el valor guardado lleva
 * un espacio o un salto de línea al final:
 *
 *   · La introspección lo manda como campo de un formulario, y ahí un espacio
 *     de más se limpia por el camino. Responde que el permiso es válido, y lo es.
 *   · El post lo manda en la cabecera «Authorization: Bearer …», donde ese
 *     mismo espacio forma parte del valor. LinkedIn recibe un token que no
 *     existe y contesta lo único que puede contestar: no es válido.
 *
 * Copiar un token de 400 caracteres de una pantalla y pegarlo en un formulario
 * arrastra un espacio con una facilidad que no se corresponde con lo difícil
 * que es luego encontrarlo. Se recorta, y se dice cuando pasa: fallar por esto
 * en silencio cuesta una tarde, y ya la costó. */
function secreto(nombre) {
  const bruto = process.env[nombre];
  if (!bruto) return bruto;
  const limpio = bruto.trim();
  if (limpio !== bruto) {
    console.log(
      `::warning::${nombre} traía espacios o saltos de línea alrededor (${bruto.length} caracteres, ${limpio.length} sin ellos). Se han quitado para esta ejecución, pero conviene volver a guardar el secreto limpio en GitHub.`,
    );
  }
  return limpio;
}

const TOKEN = secreto('LINKEDIN_TOKEN');

/* ---- Quién firma el post -------------------------------------------------
 *
 * Hay dos formas de publicar y LinkedIn las separa con dos permisos distintos:
 *
 *   · La página de empresa. Necesita `w_organization_social`, que solo se
 *     obtiene con la Community Management API, y esa la revisa LinkedIn a
 *     mano: puede tardar semanas y puede denegarla.
 *   · El perfil de una persona. Necesita `w_member_social`, que da el producto
 *     «Share on LinkedIn» y se concede al momento, sin revisión.
 *
 * Esto admite las dos, y no por indecisión: la segunda está disponible hoy y
 * la primera no. Además, en LinkedIn un post de una persona suele llegar a más
 * gente que el mismo post en una página de empresa; el algoritmo reparte
 * distinto. Publicar desde el perfil de quien firma los artículos no es el
 * plan B, es una opción defendible por sí sola.
 *
 * Si están los dos, manda la página: es una decisión de marca, y quien puso
 * el identificador de la organización lo puso a propósito. */
const ORG = secreto('LINKEDIN_ORG_ID');
const MIEMBRO = secreto('LINKEDIN_MEMBER_ID');

/* Un ensayo: hace todo el recorrido —elegir el artículo, componer el texto,
   decidir si toca o no— y se detiene justo antes de publicar. Existe porque la
   única alternativa para comprobar que esto funciona era publicar de verdad en
   la página de la empresa, y un post de prueba en una página real no se puede
   deshacer sin que alguien lo haya visto. */
const ENSAYO = process.argv.includes('--ensayo');

if (ENSAYO) console.log('— ENSAYO: no se va a publicar nada —\n');

if (!TOKEN && !ENSAYO) {
  console.log('Sin credenciales de LinkedIn (LINKEDIN_TOKEN). No hay nada que publicar.');
  process.exit(0);
}

/**
 * El identificador de quien firma, resuelto en este orden: la organización si
 * está declarada; si no, la persona.
 *
 * Y si no está declarada ninguna, se le pregunta a LinkedIn quién es el dueño
 * del permiso. El identificador de una persona no es su nombre de usuario ni
 * nada que se pueda leer en el perfil: es un código que solo devuelve la API,
 * así que pedirle a alguien que lo copie a mano en un secreto es pedirle que
 * busque un dato escondido. Preguntarlo cuesta una llamada y no falla nunca
 * mientras el permiso valga.
 */
async function quienPublica() {
  if (ORG) return { urn: `urn:li:organization:${ORG}`, donde: 'la página de empresa' };
  if (MIEMBRO) return { urn: `urn:li:person:${MIEMBRO}`, donde: 'el perfil personal' };
  if (!TOKEN) return { urn: '', donde: 'nadie: falta LINKEDIN_ORG_ID o LINKEDIN_MEMBER_ID' };
  try {
    const r = await fetch('https://api.linkedin.com/v2/userinfo', { headers: { Authorization: `Bearer ${TOKEN}` } });
    if (!r.ok) return { urn: '', donde: `no se pudo averiguar (HTTP ${r.status} al preguntar quién es el dueño del permiso)` };
    const d = await r.json();
    if (!d.sub) return { urn: '', donde: 'no se pudo averiguar: la respuesta no traía identificador' };
    return { urn: `urn:li:person:${d.sub}`, donde: `el perfil personal de ${d.name || 'quien autorizó'}` };
  } catch (e) {
    return { urn: '', donde: `no se pudo averiguar: ${e.message}` };
  }
}

/* ---- Cuánto le queda al permiso -----------------------------------------
 *
 * Se pregunta, no se apunta en un calendario. Una fecha escrita a mano en un
 * secreto es una fecha que alguien tiene que acordarse de actualizar cada vez
 * que renueva, y el día que se olvide el aviso mentirá justo cuando importa. */
async function avisarSiCaduca() {
  const id = secreto('LINKEDIN_CLIENT_ID');
  const clave = secreto('LINKEDIN_CLIENT_SECRET');
  if (!id || !clave) {
    console.log('Sin LINKEDIN_CLIENT_ID y LINKEDIN_CLIENT_SECRET no se puede comprobar el permiso antes de publicar.');
    return 'desconocido';   // No es un fallo, pero tampoco es un visto bueno.
  }
  /* Y sin token no hay nada que preguntar. Pasa en un ensayo local, donde
     ninguno de los tres está puesto. */
  if (!TOKEN) {
    console.log('Sin LINKEDIN_TOKEN no se puede comprobar la caducidad del permiso.');
    return 'desconocido';
  }
  try {
    const r = await fetch(INTROSPECCION, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: id, client_secret: clave, token: TOKEN }),
    });

    /* Aquí ponía `if (!r.ok) return;` y esa línea costó el anuncio del 1 de
       septiembre. Cuando LinkedIn contesta que el token no vale, contesta con
       un error, no con un 200. Así que la comprobación que existía para avisar
       de que el permiso ya no sirve se callaba justo en el único caso en que
       tenía algo que decir, la ejecución seguía adelante e intentaba publicar,
       y el fallo aparecía dos pasos después con un 401 sin contexto.

       Un guardián ciego a lo que vino a vigilar es peor que no tenerlo: ocupa
       el sitio del que sí habría avisado. */
    if (!r.ok) {
      const cuerpo = await r.text().catch(() => '');
      console.log(
        `::error::LinkedIn no reconoce el permiso (HTTP ${r.status}). ${cuerpo.slice(0, 300)}`,
      );
      return 'invalido';
    }

    const d = await r.json();
    /* La introspección responde `active: false` para un token revocado o
       caducado, y algunas respuestas traen `status` en vez de `active`. */
    if (d.active === false || (d.status && d.status !== 'active')) {
      console.log(`::error::El permiso de LinkedIn figura como «${d.status || 'inactivo'}».`);
      return 'invalido';
    }

    /* ---- Vivo no es lo mismo que sirve ----
     *
     * El 1 de septiembre la introspección dijo «activo, 365 días» y el post se
     * rechazó con un 401 tres segundos después. No es una contradicción: un
     * token puede estar perfectamente vivo y no servir para publicar.
     *
     * La respuesta trae los dos campos que lo explican y que no se estaban
     * mirando. `auth_type` distingue un permiso de miembro (3L, el que permite
     * actuar en nombre de alguien) de uno de aplicación (2L, que no puede
     * publicar en ningún muro). Y `scope` dice qué alcances lleva de verdad,
     * que no siempre es lo que se marcó en la pantalla.
     *
     * Sin esto el diagnóstico era adivinar entre tres hipótesis. Con esto lo
     * dice LinkedIn. */
    const alcances = String(d.scope || '').split(/[,\s]+/).filter(Boolean);
    console.log(
      `Permiso de tipo «${d.auth_type || 'sin declarar'}» con alcances: ${alcances.join(', ') || 'ninguno declarado'}`,
    );

    if (d.auth_type && d.auth_type !== '3L') {
      console.log('::error::Ese permiso es de aplicación (2-legged), no de miembro. Sirve para leer datos de la propia aplicación y no puede publicar en ningún muro, ni de persona ni de página.');
      console.log('::error::Hay que generarlo con «Member authorization (3-legged)» en el generador de tokens de LinkedIn.');
      return 'invalido';
    }

    /* Publicar como página pide un alcance distinto que publicar como persona,
       y el que hace falta depende de quién firma. */
    const necesario = ORG ? 'w_organization_social' : 'w_member_social';
    if (alcances.length && !alcances.includes(necesario)) {
      console.log(`::error::Al permiso le falta «${necesario}», que es el que deja publicar ${ORG ? 'en la página de empresa' : 'en el perfil'}. Lo que lleva: ${alcances.join(', ')}.`);
      console.log('::error::Hay que volver a generar el token marcando ese alcance. Marcarlo en la pantalla no basta si al generar no quedó incluido.');
      return 'invalido';
    }

    if (!d.expires_at) {
      console.log('El permiso es válido. LinkedIn no dice cuándo caduca.');
      return 'valido';
    }
    const dias = Math.round((d.expires_at * 1000 - Date.now()) / 86400000);
    console.log(`El permiso de LinkedIn caduca en ${dias} días.`);
    if (dias <= 14) {
      console.log(`::warning::El permiso de LinkedIn caduca en ${dias} días. Hay que volver a autorizar la aplicación: LinkedIn no deja renovarlo solo salvo a los socios de su programa de marketing. Instrucciones en docs/linkedin.md.`);
    }
    return 'valido';
  } catch (e) {
    /* Esto es distinto de «el token no vale»: es «no pude preguntar». Se dice
       con otras palabras a propósito, porque confundirlas lleva a revocar un
       permiso que estaba bien por culpa de un corte de red. */
    console.log(`::warning::No se pudo consultar el permiso: ${e.message}. No es lo mismo que un permiso inválido; se sigue adelante.`);
    return 'desconocido';
  }
}


/* ---- La sonda: 401 y 403 no significan lo mismo -------------------------
 *
 * El 1 de septiembre se descartaron por medición tres explicaciones del 401 al
 * publicar: el permiso caducado, el token de aplicación en vez de miembro, y un
 * espacio pegado al valor del secreto. El ensayo confirma que el token es de
 * tipo 3L, lleva w_organization_social y le quedan 365 días. Y el post se
 * sigue rechazando.
 *
 * A partir de ahí seguir proponiendo causas es adivinar en voz alta. Esto
 * pregunta en vez de suponer: una llamada de solo lectura al mismo host y con
 * las mismas cabeceras que el post, para leer el código que devuelve.
 *
 *   · 401 aquí también → api.linkedin.com no acepta este token para nada. El
 *     problema no es publicar ni la página: es el token contra esta API.
 *   · 403 → el token SÍ se acepta, y lo que falla es el permiso concreto. Es
 *     buena noticia y estrecha el problema a la relación entre quien autorizó
 *     y la página de empresa.
 *   · 200 → el token funciona de sobra y el problema está en el cuerpo del
 *     post o en el identificador de la organización.
 *
 * No publica nada y no puede romper nada. */
async function sondearApi() {
  if (!TOKEN) return;
  const donde = 'https://api.linkedin.com/v2/me';
  try {
    const r = await fetch(donde, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'X-Restli-Protocol-Version': '2.0.0',
        'LinkedIn-Version': VERSION,
      },
    });
    const cuerpo = await r.text().catch(() => '');
    console.log(`\nSonda a ${donde} → HTTP ${r.status}`);
    if (r.status === 401) {
      console.log('  api.linkedin.com no acepta este token para ninguna llamada, aunque la introspección lo dé por válido.');
      console.log('  Eso apunta a la aplicación, no a la página: revisa que la app de LinkedIn esté verificada por la empresa y que el token se generara desde ESA app.');
    } else if (r.status === 403) {
      console.log('  El token SÍ se acepta. Lo que falta es permiso para algo concreto,');
      console.log('  así que el 401 al publicar no viene del token: viene de la relación');
      console.log('  entre quien autorizó y la página. Comprueba que esa persona sea');
      console.log('  administradora de la página de BECOME y que LINKEDIN_ORG_ID sea la suya.');
    } else if (r.ok) {
      console.log('  El token funciona contra la API. El problema está en el cuerpo del post o en LINKEDIN_ORG_ID.');
    } else {
      console.log(`  Respuesta inesperada: ${cuerpo.slice(0, 200)}`);
    }
  } catch (e) {
    console.log(`\nNo se pudo sondear la API: ${e.message}`);
  }
}


/* ---- La sonda que sí decide -----------------------------------------------
 *
 * La anterior pregunta a /v2/me, y tiene un defecto que hay que decir: ese
 * endpoint pide un alcance de perfil que este token no lleva, así que su 401
 * puede significar «el token no vale» o «el token no puede hacer ESTA llamada».
 * Son dos cosas distintas y ahí no se separan. Otra medición cerca de la
 * pregunta en vez de la pregunta.
 *
 * Esta va al mismo endpoint del post, con las mismas cabeceras, y con un cuerpo
 * vacío a propósito. Un cuerpo vacío no puede publicar nada: le faltan el
 * autor, el texto y la visibilidad, que son obligatorios. Así que solo hay dos
 * finales posibles y cada uno contesta lo que falta saber:
 *
 *   · 401 → LinkedIn rechaza el token ANTES de mirar el contenido. El problema
 *     es la autenticación: el token o la aplicación.
 *   · 400 o 422 → LinkedIn aceptó el token y luego se quejó del contenido, que
 *     es exactamente lo que tiene que pasar. El token sirve, y el 401 del post
 *     de verdad viene de otra cosa: el permiso sobre esa página concreta.
 *
 * Publicar es imposible por construcción. */
async function sondearPublicacion() {
  if (!TOKEN) return;
  try {
    const r = await fetch(API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
        'LinkedIn-Version': VERSION,
      },
      body: '{}',
    });
    const cuerpo = await r.text().catch(() => '');
    console.log(`\nSonda al endpoint de publicación (cuerpo vacío, no puede publicar) → HTTP ${r.status}`);
    if (r.status === 401) {
      /* El cuerpo trae el serviceErrorCode, que es lo que distingue un token
         malformado de una aplicación sin acceso a esta API. Imprimir solo el
         código HTTP y quedarse tan ancho es tirar la mitad de la respuesta. */
      console.log(`  LinkedIn dice: ${cuerpo.slice(0, 400)}`);
      console.log('  LinkedIn rechaza el token antes de mirar el contenido.');
      console.log('  El problema es la autenticación, no la página ni el post.');
      console.log('  Lo que queda por revisar, por orden: que la aplicación de LinkedIn');
      console.log('  esté verificada por la empresa, y que el token se generara desde esa');
      console.log('  misma aplicación y no desde otra.');
    } else if (r.status === 400 || r.status === 422) {
      console.log('  LinkedIn ACEPTÓ el token y se quejó del contenido, que es lo correcto.');
      console.log('  El token sirve para publicar. El 401 del post de verdad viene de otra');
      console.log('  cosa: el permiso sobre esa página. Comprueba que quien autorizó el');
      console.log('  token sea administrador de la página y que LINKEDIN_ORG_ID sea la suya.');
    } else if (r.status === 403) {
      console.log('  El token se acepta pero falta permiso. Apunta a la relación entre');
      console.log('  quien autorizó y la página de empresa.');
    } else {
      console.log(`  Respuesta inesperada: ${cuerpo.slice(0, 250)}`);
    }
  } catch (e) {
    console.log(`\nNo se pudo sondear la publicación: ${e.message}`);
  }
}

/* ---- Qué artículo toca --------------------------------------------------- */
const publicados = existsSync(REGISTRO) ? JSON.parse(readFileSync(REGISTRO, 'utf8')) : { anunciados: [] };

const articulos = readdirSync(CARPETA)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join(CARPETA, f), 'utf8')))
  .filter((a) => a.estado === 'publicado' && a.es?.slug)
  /* Por fecha, nunca por nombre de archivo: la carpeta se lee en orden
     alfabético y «el más reciente» sería «el primero por la A». Es el mismo
     error que tuvo el centinela, y allí llegó a dar por bueno un feed atrasado. */
  .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));

const nuevo = articulos.find((a) => !publicados.anunciados.includes(a.es.slug));

if (!nuevo) {
  console.log('Todos los artículos publicados ya se anunciaron en LinkedIn.');
  process.exit(0);
}

/* Solo lo reciente. Sin este corte, la primera vez que esto corriera anunciaría
   como novedad un artículo de hace semanas —y con el registro vacío, los
   anunciaría todos, uno por despliegue, durante días. */
const DIAS_GRACIA = 3;
const edad = Math.round((Date.now() - Date.parse(nuevo.fecha)) / 86400000);
if (!Number.isFinite(edad) || edad > DIAS_GRACIA) {
  console.log(`El artículo más antiguo sin anunciar («${nuevo.es.titulo}») es de hace ${edad} días. No se anuncia como novedad; se da por pasado.`);
  /* Un ensayo no toca el registro. Se escapó al añadirlo y lo cazó la propia
     prueba: el primer ensayo dejó marcado como «pasado» un artículo que nadie
     había decidido saltarse. Un ensayo que cambia algo no es un ensayo. */
  if (!ENSAYO) {
    publicados.anunciados.push(nuevo.es.slug);
    writeFileSync(REGISTRO, `${JSON.stringify(publicados, null, 2)}\n`);
  }
  process.exit(0);
}

/* También en el ensayo, y esto estaba mal.
 *
 * La comprobación de caducidad pregunta a LinkedIn por el permiso y no publica
 * nada, así que no había motivo para saltársela en el modo que existe
 * precisamente para hacerlo todo menos publicar. Y sí había un motivo fuerte
 * para ejecutarla: es la ÚNICA forma de saber que el token funciona de verdad
 * sin dejar un post en la página de la empresa.
 *
 * Se descubrió el día del primer ensayo real: los cuatro secretos estaban
 * puestos, el ensayo salió en verde, y no se sabía si el token servía. Un
 * ensayo que no comprueba lo único que se puede comprobar es un ensayo que
 * tranquiliza sin informar. */
const permiso = await avisarSiCaduca();

/* Si ya sabemos que el permiso no sirve, no se intenta publicar. Antes se
   intentaba igual y el 401 llegaba dos pasos más allá, sin decir la causa. */
if (permiso === 'invalido') {
  console.error('::error::No se intenta publicar con un permiso que LinkedIn ya ha rechazado.');
  console.error('::error::Hay que volver a autorizar la aplicación y actualizar LINKEDIN_TOKEN. El paso a paso está en docs/linkedin.md.');
  console.error('::error::Si acabas de rotar LINKEDIN_CLIENT_SECRET, esa es la causa más probable: el token se emitió con el secreto anterior.');
  process.exit(1);
}

/* ---- El texto del post ---------------------------------------------------
 *
 * El copy viene escrito dentro del artículo, en `es.linkedin`, y lo escribe
 * quien escribe el artículo siguiendo `automatizacion/copy-linkedin.md`.
 *
 * Antes se componía aquí, juntando la entradilla con el título y el enlace.
 * Funcionaba y estaba mal: eso es un resumen, y un resumen resuelto es la
 * forma más eficaz de que nadie abra el artículo. El lector lo lee, entiende
 * de qué va, y sigue bajando. Un post tiene un trabajo distinto al de una
 * entradilla —abrir una pregunta, no cerrarla— y ese trabajo no se puede hacer
 * concatenando campos que se escribieron para otra cosa.
 *
 * El enlace lo pone este script, no el copy: una dirección escrita a mano en
 * el texto es una dirección que puede estar mal, y cuando se note, el post ya
 * está publicado y la tarjeta que LinkedIn compuso la primera vez ya no se
 * puede cambiar. Los hashtags igual: llegan como lista, sin almohadilla, y se
 * añaden al final. */
const url = `${SITIO}/es/insights/${nuevo.es.slug}`;

const copy = nuevo.es.linkedin || {};
const etiquetas = (copy.hashtags || [])
  .slice(0, 3)
  .map((h) => `#${String(h).replace(/[^\p{L}\p{N}]/gu, '')}`)
  .filter((h) => h.length > 1);

/* Sin copy escrito hay que decidir entre no publicar nada o publicar algo
   pobre. Gana publicar: el artículo ya está en la web y el post es lo que lo
   lleva gente. Pero queda dicho en el registro del despliegue, porque un
   respaldo silencioso se convierte en el comportamiento normal. */
if (!copy.texto) {
  console.log(`::warning::«${nuevo.es.titulo}» no trae copy de LinkedIn escrito (es.linkedin.texto). Se publica con un texto de respaldo, que es peor. Lo correcto está en automatizacion/copy-linkedin.md.`);
}

const cuerpoTexto = (copy.texto || `${nuevo.es.entradilla}\n\nLo desarrollamos en este nuevo análisis de BECOME.`).trim();

const texto = [cuerpoTexto, url, etiquetas.join(' ')].filter(Boolean).join('\n\n');

/* LinkedIn corta el post a los 3.000 caracteres. Ninguno de los nuestros se
   acerca, y por eso mismo si uno llegara sería por un error —un campo pegado
   dos veces, un artículo entero donde iba el copy— y cortarlo en silencio
   publicaría ese error a medias. */
if (texto.length > 3000) {
  console.error(`::error::El post mide ${texto.length} caracteres y LinkedIn admite 3.000. No se publica: revisa es.linkedin.texto de «${nuevo.es.slug}».`);
  process.exit(1);
}

const firma = await quienPublica();
if (!firma.urn && !ENSAYO) {
  console.error(`::error::No se sabe en nombre de quién publicar. Hace falta LINKEDIN_ORG_ID (página de empresa, con Community Management API) o LINKEDIN_MEMBER_ID (perfil personal, con Share on LinkedIn). ${firma.donde}`);
  process.exit(1);
}

const cuerpo = {
  author: firma.urn,
  commentary: texto,
  visibility: 'PUBLIC',
  distribution: { feedDistribution: 'MAIN_FEED', targetEntities: [], thirdPartyDistributionChannels: [] },
  /* La tarjeta del enlace se manda escrita, no se deja adivinar: LinkedIn no
     rastrea la página para componerla, así que sin estos campos el post sale
     con un enlace pelado. */
  content: { article: { source: url, title: nuevo.es.titulo, description: nuevo.es.descripcion } },
  lifecycleState: 'PUBLISHED',
  isReshareDisabledByAuthor: false,
};

if (ENSAYO) {
  console.log(`Tocaría publicar: «${nuevo.es.titulo}» (${edad} días)\n`);
  console.log('──── el post ────');
  console.log(texto);
  console.log('──── la tarjeta ────');
  console.log(`  ${cuerpo.content.article.title}`);
  console.log(`  ${cuerpo.content.article.description}`);
  console.log(`  ${cuerpo.content.article.source}`);
  await sondearApi();
await sondearPublicacion();
console.log(`\nSaldría en ${firma.donde}${firma.urn ? ` (${firma.urn})` : ''} · versión de la API: ${VERSION}`);
  process.exit(0);
}

const r = await fetch(API, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
    'X-Restli-Protocol-Version': '2.0.0',
    'LinkedIn-Version': VERSION,
  },
  body: JSON.stringify(cuerpo),
});

if (!r.ok) {
  const detalle = (await r.text()).slice(0, 500);
  console.error(`::error::LinkedIn rechazó el post (HTTP ${r.status}). ${detalle}`);
  /* 401 es siempre lo mismo y conviene decirlo con nombre: el permiso caducó.
     Buscar «401» en la documentación de LinkedIn no lleva a esa respuesta. */
  if (r.status === 403) {
    console.error('::error::Un 403 casi siempre es un permiso que no cubre a quien firma: publicar en la PÁGINA de empresa necesita w_organization_social (Community Management API) y publicar en un PERFIL necesita w_member_social (Share on LinkedIn). Comprueba que el permiso y el autor son del mismo tipo.');
  }
  if (r.status === 401) {
    console.error('::error::El permiso pasó la comprobación previa y aun así LinkedIn rechaza el post. La sonda de abajo dice dónde está el problema.');
    await sondearApi();
    await sondearPublicacion();
  }
  process.exit(1);
}

/* El identificador del post viaja en una cabecera, no en el cuerpo. */
const urn = r.headers.get('x-restli-id') || '(sin identificador)';
console.log(`Publicado en LinkedIn, en ${firma.donde}: «${nuevo.es.titulo}»`);
console.log(`  ${url}`);
console.log(`  ${urn}`);

publicados.anunciados.push(nuevo.es.slug);
writeFileSync(REGISTRO, `${JSON.stringify(publicados, null, 2)}\n`);
console.log(`Registrado en ${REGISTRO} para que no se repita.`);

/* ---- El centinela: ¿existe el post de verdad? ----------------------------
 *
 * LinkedIn ha respondido que sí, y eso no es lo mismo que que el post esté en
 * la página. Es la distinción que costó un artículo esta semana: «terminó en
 * verde» y «funcionó» son cosas distintas, y solo se sabe preguntando por el
 * resultado.
 *
 * Se le pide a LinkedIn el post recién creado por su identificador. Si no está,
 * no se deshace nada —no hay nada que deshacer— pero el aviso sale y el
 * registro NO se deja mentir: se quita el artículo para que el siguiente
 * intento vuelva a publicarlo.
 *
 * Necesita permiso de lectura sobre la organización. Si no lo hay, lo dice y no
 * falla: media comprobación es mejor que ninguna, y peor sería poner el
 * despliegue en rojo por un permiso que quizá LinkedIn no concedió. */
if (urn && urn.startsWith('urn:li:')) {
  try {
    const c = await fetch(`https://api.linkedin.com/rest/posts/${encodeURIComponent(urn)}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'X-Restli-Protocol-Version': '2.0.0',
        'LinkedIn-Version': VERSION,
      },
    });
    if (c.ok) {
      const d = await c.json();
      const vivo = d?.lifecycleState === 'PUBLISHED';
      console.log(vivo
        ? 'Centinela: el post existe en la página y está publicado.'
        : `::warning::El post existe pero figura como «${d?.lifecycleState}». Míralo en la página.`);
    } else if (c.status === 403) {
      console.log('Centinela: sin permiso de lectura sobre la organización, no se pudo comprobar que el post exista. Añade r_organization_social al token.');
    } else {
      console.log(`::warning::LinkedIn dijo que publicó, pero al pedir el post responde HTTP ${c.status}. Comprueba la página a mano.`);
      publicados.anunciados = publicados.anunciados.filter((x) => x !== nuevo.es.slug);
      writeFileSync(REGISTRO, `${JSON.stringify(publicados, null, 2)}\n`);
      console.log('El artículo vuelve a la cola: el registro no puede decir que se anunció algo que no está.');
    }
  } catch (e) {
    console.log(`Centinela: no se pudo comprobar el post (${e.message}).`);
  }
}
