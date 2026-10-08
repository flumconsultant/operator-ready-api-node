/**
 * ¿Está en la web lo que dice el repositorio?
 *
 * Es la única pregunta que importa, y hasta hoy nadie la hacía en frío. El
 * despliegue comprueba lo que acaba de subir, pero si el despliegue no llega a
 * terminar —o termina en gris— no comprueba nada, y el sitio se queda
 * publicando la versión anterior sin que salte ninguna alarma. Pasó el 22 de
 * agosto: el artículo del día estaba escrito, validado y subido al repositorio,
 * y no estaba en la web. Lo detectó una persona mirando, no el sistema.
 *
 * Esto lo detecta el sistema. Pide al dominio real cada artículo publicado, en
 * los dos idiomas, y comprueba que responde 200 y que el título está dentro del
 * HTML servido —no basta con el 200: una ruta desconocida también responde 200
 * en este sitio, con la plantilla vacía—.
 *
 * Corre solo (a diario, después de la hora del artículo) y también se puede
 * lanzar a mano. Cuando falla, el workflow que lo llama relanza el despliegue.
 *
 * Sin dependencias y sin secretos: solo lee archivos del repositorio y hace
 * peticiones HTTP públicas.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SITIO = process.env.SITIO || 'https://meetbecome.com';
const CARPETA = 'src/content/insights';
const ESPERA_MS = 20000;

/* Los artículos en borrador no deben estar en la web: comprobarlos daría un
   fallo por algo que está bien. */
const articulos = readdirSync(CARPETA)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join(CARPETA, f), 'utf8')))
  .filter((a) => a.estado === 'publicado')
  /* Por fecha y no por nombre de archivo. Leer la carpeta da orden alfabético,
     y con él «el más reciente» era en realidad «el primero por la A»: la
     comprobación del feed buscaba un artículo viejo, que sigue estando, y daba
     por bueno un feed que se había quedado atrás. Se vio probándolo. */
  .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));

if (!articulos.length) {
  console.log('No hay artículos publicados en el repositorio. Nada que comprobar.');
  process.exit(0);
}

/** Una página, servida por el dominio de verdad. */
async function pedir(url) {
  const control = new AbortController();
  const reloj = setTimeout(() => control.abort(), ESPERA_MS);
  try {
    /* El parámetro evita que conteste una copia guardada por el CDN o por el
       propio navegador de GitHub Actions: preguntamos por el estado de ahora,
       no por el de la última vez que alguien pasó por aquí. */
    const r = await fetch(`${url}?centinela=${Date.now()}`, {
      redirect: 'follow',
      signal: control.signal,
      headers: { 'User-Agent': 'centinela-become/1.0', 'Cache-Control': 'no-cache' },
    });
    return { estado: r.status, html: await r.text() };
  } catch (e) {
    return { estado: 0, html: '', error: e.message };
  } finally {
    clearTimeout(reloj);
  }
}

/* El título tal como acaba en el HTML: sin entidades, que es como lo escribe
   el generador de páginas. */
const normaliza = (t) => t
  .replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, '’').replace(/&quot;/g, '"')
  .replace(/\s+/g, ' ').trim().toLowerCase();

const fallos = [];
/* «No pude preguntar» no es «la respuesta fue mala». Van aparte desde que, el
   8 de octubre de 2026, este guardián informó de 74 páginas no servidas cuando
   lo único que pasaba era que no había salida a internet. Un aviso que se
   equivoca en rojo enseña a ignorar los avisos, y entonces el guardián que
   sobrevive es el que nadie lee. */
const mudos = [];
let comprobadas = 0;

for (const a of articulos) {
  for (const [lang, tramo] of [['es', 'es/insights'], ['en', 'en/insights']]) {
    const t = a[lang];
    if (!t?.slug) continue;
    const url = `${SITIO}/${tramo}/${t.slug}`;
    const { estado, html, error } = await pedir(url);
    comprobadas++;

    if (estado !== 200) {
      if (error) mudos.push(`${url} → sin respuesta (${error})`);
      else fallos.push(`${url} → HTTP ${estado}`);
      continue;
    }
    /* La prueba de fondo: que la página servida sea ESTA página. Una ruta que
       el servidor no conoce devuelve la plantilla genérica con 200, así que el
       código de estado por sí solo no distingue «publicado» de «no existe». */
    if (!normaliza(html).includes(normaliza(t.titulo))) {
      fallos.push(`${url} → responde 200 pero su HTML no contiene «${t.titulo}»: el sitio publica una versión anterior.`);
    }
  }
}

/* Y el feed, que es por donde los buscadores se enteran de lo nuevo sin
   releer el sitio entero. Un feed que se queda atrás no rompe ninguna página
   —nadie lo ve— pero apaga en silencio el mecanismo de descubrimiento rápido,
   que es justo el fallo que nadie encuentra mirando la web. */
const reciente = articulos[0];
for (const lang of ['es', 'en']) {
  const t = reciente?.[lang];
  if (!t?.slug) continue;
  const url = `${SITIO}/${lang}/feed.xml`;
  const { estado, html, error } = await pedir(url);
  comprobadas++;
  if (estado !== 200) {
    if (error) mudos.push(`${url} → sin respuesta (${error})`);
    else fallos.push(`${url} → HTTP ${estado}`);
  } else if (!html.includes(`/${lang}/insights/${t.slug}`)) {
    fallos.push(`${url} → no contiene el último artículo («${t.titulo}»): el feed publicado se quedó en una versión anterior.`);
  }
}

console.log(`Artículos publicados en el repositorio: ${articulos.length}`);
console.log(`Direcciones comprobadas contra ${SITIO}: ${comprobadas}`);

/* Si no se pudo preguntar a nada, no hay diagnóstico que dar. Se dice así y se
   sale en rojo igual —algo hay que mirar—, pero nombrando la causa correcta:
   mandar a alguien a revisar el despliegue cuando lo que falla es la red le
   hace perder la tarde y le enseña a desconfiar del aviso. */
if (mudos.length && !fallos.length) {
  console.error(`::error::No se pudo preguntar al sitio: ${mudos.length} direcciones sin respuesta.`);
  console.error(`::error::Esto NO significa que el sitio esté desactualizado. Significa que esta comprobación no pudo mirar: sin red, DNS caído o dominio sin responder.`);
  for (const m of mudos.slice(0, 5)) console.error(`::error::  ${m}`);
  if (mudos.length > 5) console.error(`::error::  …y ${mudos.length - 5} más, todas con el mismo error.`);
  process.exit(1);
}

if (mudos.length) {
  console.log(`::warning::${mudos.length} direcciones no respondieron y no se pudieron comprobar. Son aparte de los fallos de abajo.`);
  for (const m of mudos.slice(0, 3)) console.log(`::warning::  ${m}`);
}

if (fallos.length) {
  console.log('');
  for (const f of fallos) console.error(`::error::${f}`);
  console.error(`::error::${fallos.length === 1
    ? 'Hay una dirección que el repositorio da por publicada'
    : `Hay ${fallos.length} direcciones que el repositorio da por publicadas`} y el sitio no sirve. El último despliegue no llegó a la web.`);
  process.exit(1);
}

console.log('');
console.log('Todo lo que el repositorio da por publicado está en la web.');
