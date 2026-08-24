/**
 * Avisa por correo de los artículos publicados que todavía no se han anunciado.
 *
 * ---- Por qué esto ya no mira el diff de git ----
 *
 * Lo hacía, y ha fallado dos veces en dos días por dos motivos distintos:
 *
 *   · El 23 de agosto, por un clon superficial: el commit anterior no estaba en
 *     la copia local, el diff no devolvía nada y el paso lo leía como «no hay
 *     artículos nuevos».
 *   · El 24 de agosto, por un despliegue fallido: el artículo se añadió en un
 *     commit cuyo despliegue murió en el QA de lenguaje. En el siguiente
 *     despliegue —el que sí terminó bien— ese archivo ya no era «añadido» sino
 *     «modificado», así que nadie lo anunció. El artículo salió a la web y no
 *     salió por correo.
 *
 * Los dos son el mismo error de fondo: **la ventana del diff es por push, y lo
 * que hay que saber es por artículo**. Un push fallido, un reintento, un
 * arreglo de la tarde o dos commits seguidos consumen esa ventana, y cuando se
 * consume no hay forma de recuperarla.
 *
 * Ahora se lleva un registro de lo ya enviado, igual que el de LinkedIn. El
 * registro no depende de qué commit vino antes, así que un despliegue fallido
 * ya no se lleva por delante el aviso: el siguiente lo manda.
 *
 * ---- Las dos redes de seguridad, y por qué hacen falta las dos ----
 *
 * La primera: solo se anuncian artículos de los últimos tres días.
 *
 * La segunda: **como mucho uno por ejecución**. Se descubrió probando la
 * primera: con el registro en blanco, la ventana de tres días dejaba pasar
 * cuatro artículos a la vez, que es exactamente el correo masivo que la red
 * venía a evitar. Aquí se publica un artículo al día; que haya dos pendientes
 * significa que algo se rompió, y rescatar un día atrasado es una decisión de
 * una persona, no de un despliegue. Los que se quedan fuera se nombran, con el
 * comando para mandarlos.
 *
 * Uso:
 *   node scripts/difundir.mjs
 *   node scripts/difundir.mjs --ensayo          hace todo menos enviar
 *   SOLO=archivo.json node scripts/difundir.mjs reenvía uno a mano
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const CARPETA = 'src/content/insights';
const REGISTRO = '.github/correo-enviado.json';
const PUNTO = 'https://meetbecome.com/api/suscripcion.php';
const GRACIA_DIAS = 3;

const TOKEN = process.env.DIFUSION_TOKEN;
const SOLO = process.env.SOLO || '';
const ENSAYO = process.argv.includes('--ensayo');
/* Modo vigilancia, para el centinela. La diferencia es qué se considera un
   fallo: en un despliegue, un artículo viejo sin anunciar no debe teñir de rojo
   una publicación que no tiene nada que ver; en el centinela sí, porque el
   centinela existe justamente para que eso no pase inadvertido. */
const VIGILAR = process.argv.includes('--vigilar');

if (ENSAYO) console.log('— ENSAYO: no se va a enviar ningún correo —\n');

if (!TOKEN && !ENSAYO) {
  console.log('Sin DIFUSION_TOKEN no se avisa a nadie. Es opcional.');
  process.exit(0);
}

const registro = existsSync(REGISTRO)
  ? JSON.parse(readFileSync(REGISTRO, 'utf8'))
  : { _: '', enviados: [] };
const enviados = new Set(registro.enviados || []);

const dias = (fecha) => Math.floor((Date.now() - Date.parse(`${fecha}T00:00:00Z`)) / 86400000);

/* Qué toca anunciar. Un artículo entra si está publicado, si no está en el
   registro y si es reciente. El orden es por fecha: si algún día se acumulan
   dos, sale antes el más viejo, que es como se leerían. */
/* Los que se quedaron fuera de la ventana sin anunciar. No se mandan solos
   —tres días después, un correo que dice «nuevo artículo» ya no es cierto— pero
   tampoco se callan. */
const olvidados = [];

const pendientes = readdirSync(CARPETA)
  .filter((f) => f.endsWith('.json'))
  .filter((f) => (SOLO ? f === SOLO : true))
  .map((f) => ({ archivo: f, a: JSON.parse(readFileSync(join(CARPETA, f), 'utf8')) }))
  .filter(({ archivo, a }) => {
    if (a.estado !== 'publicado') { if (SOLO) console.log(`${archivo} es un borrador; no se avisa.`); return false; }
    if (SOLO) return true;                       // a mano se manda igual
    if (enviados.has(archivo)) return false;
    const d = dias(a.fecha);
    if (!(d >= 0 && d <= GRACIA_DIAS)) {
      olvidados.push({ archivo, fecha: a.fecha, dias: d });
      return false;
    }
    return true;
  })
  .sort((x, y) => String(x.a.fecha).localeCompare(String(y.a.fecha)));

const avisarDeOlvidados = () => {
  if (!olvidados.length) return;
  const uno = olvidados.length === 1;
  console.log(`::warning::${olvidados.length} ${uno ? 'artículo publicado no llegó a anunciarse por correo y ya está' : 'artículos publicados no llegaron a anunciarse por correo y ya están'} fuera de la ventana de ${GRACIA_DIAS} días.`);
  for (const o of olvidados) {
    console.log(`   · ${o.archivo} (${o.fecha}, hace ${o.dias} días) — para mandarlo: Actions → Desplegar a Hostinger → Run workflow → difundir = ${o.archivo}`);
  }
};

if (!pendientes.length) {
  avisarDeOlvidados();
  if (olvidados.length && VIGILAR) {
    console.log('\n::error::Hay artículos publicados que nunca se anunciaron por correo. Decide si se mandan o se dan por perdidos: hasta entonces esto seguirá en rojo.');
    process.exit(1);
  }
  console.log('No hay ningún artículo pendiente de anunciar por correo.');
  process.exit(0);
}

avisarDeOlvidados();

/* El más reciente, y solo ese. Un despliegue que manda cuatro correos seguidos
   a la lista no es un despliegue: es un incidente. */
const atrasados = SOLO ? [] : pendientes.slice(0, -1);
const toca = SOLO ? pendientes : pendientes.slice(-1);

if (atrasados.length) {
  console.log(`::warning::Hay ${atrasados.length} ${atrasados.length === 1 ? 'artículo anterior' : 'artículos anteriores'} sin anunciar. No se mandan solos: se anuncia el más reciente y estos esperan a que alguien decida.`);
  for (const { archivo, a } of atrasados) {
    console.log(`   · ${archivo} (${a.fecha}) — para mandarlo: Actions → Desplegar a Hostinger → Run workflow → difundir = ${archivo}`);
  }
  console.log('');
}

let fallos = 0;

for (const { archivo, a } of toca) {
  console.log(`\n── ${archivo} · ${a.es?.titulo || ''}`);
  let algunoSalio = false;

  for (const lang of ['es', 'en']) {
    const t = a[lang];
    if (!t?.slug) { console.log(`   ${lang}: no hay versión; se salta.`); continue; }

    const carga = {
      accion: 'difundir',
      token: TOKEN,
      idioma: lang,
      titulo: t.titulo,
      entradilla: t.entradilla || t.descripcion || '',
      ruta: `/${lang}/insights/${t.slug}`,
    };

    if (ENSAYO) { console.log(`   ${lang}: se enviaría «${t.titulo}» → ${carga.ruta}`); algunoSalio = true; continue; }

    try {
      const r = await fetch(PUNTO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carga),
        signal: AbortSignal.timeout(180000),
      });
      const texto = await r.text();
      console.log(`   ${lang} → ${texto.slice(0, 200)}`);
      /* Una respuesta que no confirma el envío es un fallo, no un aviso: el
         propósito entero de este script es que el correo salga. */
      if (texto.includes('"ok":true')) algunoSalio = true;
      else { console.log(`::error::La difusión en ${lang} de ${archivo} no salió: ${texto || '(sin respuesta del servidor)'}`); fallos++; }
    } catch (e) {
      console.log(`::error::La difusión en ${lang} de ${archivo} no salió: ${e.message}`);
      fallos++;
    }
  }

  /* Se apunta solo si algo salió. Apuntarlo pase lo que pase convertiría un
     fallo de red en un artículo que nadie volverá a intentar anunciar. */
  if (algunoSalio && !ENSAYO && !SOLO) enviados.add(archivo);
  if (algunoSalio && !ENSAYO && SOLO) enviados.add(archivo);
}

if (!ENSAYO) {
  registro.enviados = [...enviados].sort();
  writeFileSync(REGISTRO, `${JSON.stringify(registro, null, 2)}\n`);
}

console.log('');
if (fallos) {
  console.log(`${fallos} ${fallos === 1 ? 'envío falló' : 'envíos fallaron'}.`);
  process.exit(1);
}
if (olvidados.length && VIGILAR) {
  console.log('::error::Hay artículos publicados que nunca se anunciaron por correo. Decide si se mandan o se dan por perdidos: hasta entonces esto seguirá en rojo.');
  process.exit(1);
}
console.log(`Anunciado${toca.length === 1 ? '' : 's'} ${toca.length} ${toca.length === 1 ? 'artículo' : 'artículos'}.`);
