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
 * El permiso de LinkedIn caduca a los 60 días. Renovarlo solo está reservado a
 * los socios aprobados de su programa de marketing; para todos los demás hay
 * que volver a autorizar la aplicación a mano. Es la parte frágil de este
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

const TOKEN = process.env.LINKEDIN_TOKEN;

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
const ORG = process.env.LINKEDIN_ORG_ID;
const MIEMBRO = process.env.LINKEDIN_MEMBER_ID;

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
  const id = process.env.LINKEDIN_CLIENT_ID;
  const secreto = process.env.LINKEDIN_CLIENT_SECRET;
  if (!id || !secreto) return;   // Sin ellos no se puede preguntar; no es un fallo.
  try {
    const r = await fetch(INTROSPECCION, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: id, client_secret: secreto, token: TOKEN }),
    });
    if (!r.ok) return;
    const d = await r.json();
    if (d.status && d.status !== 'active') {
      console.log(`::warning::El permiso de LinkedIn figura como «${d.status}».`);
      return;
    }
    if (!d.expires_at) return;
    const dias = Math.round((d.expires_at * 1000 - Date.now()) / 86400000);
    console.log(`El permiso de LinkedIn caduca en ${dias} días.`);
    if (dias <= 14) {
      console.log(`::warning::El permiso de LinkedIn caduca en ${dias} días. Hay que volver a autorizar la aplicación: LinkedIn no deja renovarlo solo salvo a los socios de su programa de marketing. Instrucciones en docs/linkedin.md.`);
    }
  } catch (e) {
    console.log(`No se pudo consultar la caducidad del permiso: ${e.message}`);
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

if (!ENSAYO) await avisarSiCaduca();

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
    console.error('::error::Eso casi siempre significa que el permiso de 60 días caducó. Hay que volver a autorizar la aplicación siguiendo docs/linkedin.md.');
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
