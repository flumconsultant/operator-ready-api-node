/**
 * Por qué el correo de BECOME acaba en spam: las tres firmas del dominio.
 *
 * ---- Qué decide que un correo entre o no en la bandeja ----
 *
 * El mensaje en sí ya está bien construido —texto plano además del HTML,
 * cabecera de baja en un clic, identificador del mensaje del propio dominio, el
 * remitente del sobre igual que el del encabezado—. Eso importa, y ya está
 * hecho. Pero no es lo que decide.
 *
 * Lo que decide es si el dominio puede DEMOSTRAR que el correo es suyo, y eso
 * son tres registros de DNS:
 *
 *   · SPF   — qué servidores tienen permiso para enviar en nombre del dominio.
 *   · DKIM  — una firma criptográfica en cada mensaje, que prueba que salió de
 *             ahí y que nadie lo tocó por el camino.
 *   · DMARC — qué debe hacer el buzón que recibe cuando alguna de las dos
 *             anteriores falla, y a dónde mandar el informe.
 *
 * Desde febrero de 2024, Gmail manda a spam el correo masivo que no trae DKIM y
 * DMARC. No es una penalización por contenido: es que sin ellos no hay forma de
 * distinguir un boletín de una suplantación.
 *
 * ---- Por qué esto es un script y no una nota en un documento ----
 *
 * Porque un documento que dice «configura DKIM» no sabe si está configurado.
 * Esto lo pregunta al DNS y responde con lo que hay. Se ejecuta donde hay red:
 * en el despliegue y en el centinela, no en el portátil de nadie.
 *
 * Uso:  node scripts/correo-dns.mjs [dominio]
 */

import { resolveTxt } from 'node:dns/promises';

const DOMINIO = process.argv[2] || 'meetbecome.com';

/* Los selectores que usa Hostinger, más los dos genéricos. No hay forma de
   listar los selectores de un dominio: DKIM se consulta por nombre, así que
   solo se puede preguntar por los que uno sospecha. */
const SELECTORES = [
  'hostingermail-a', 'hostingermail-b', 'hostingermail-c',
  'default', 'mail', 'dkim', 's1', 's2', 'google', 'k1',
];

const txt = async (nombre) => {
  try {
    return (await resolveTxt(nombre)).map((p) => p.join(''));
  } catch {
    return [];
  }
};

const fallos = [];
const avisos = [];
const di = (ok, texto) => console.log(`${ok ? 'ok ' : '·  '} ${texto}`);

console.log(`Firmas del correo de ${DOMINIO}\n`);

/* ---- SPF ---------------------------------------------------------------- */

const raiz = await txt(DOMINIO);
const spf = raiz.find((r) => r.toLowerCase().startsWith('v=spf1'));
if (!spf) {
  di(false, 'SPF: no hay ningún registro v=spf1');
  fallos.push('Falta SPF. Sin él, cualquiera puede enviar correo diciendo que es de este dominio, y los buzones lo saben.');
} else {
  di(true, `SPF: ${spf}`);
  /* `~all` es «sospechoso» y `-all` es «recházalo». `+all` o `?all` dejan la
     puerta abierta y valen tanto como no tener SPF. */
  if (/[+?]all/.test(spf)) avisos.push(`El SPF termina en «${spf.match(/[+?~-]all/)?.[0]}», que no rechaza nada. Debería terminar en «~all» o «-all».`);
}

/* ---- DKIM --------------------------------------------------------------- */

/* Un selector cuenta solo si trae CLAVE. Hostinger publica «v=DKIM1;p=» —sin
   nada detrás— en los selectores de repuesto, y eso no es una firma: un «p=»
   vacío significa clave revocada. La primera versión de este script los daba
   por buenos y decía que el dominio firmaba con dos selectores que no firman
   nada. Un diagnóstico que se equivoca en verde es peor que ninguno.
 *
   Y se sigue el CNAME a mano: la clave real de Hostinger no vive en el dominio,
   vive en el suyo, y el dominio solo apunta. Preguntar por el TXT sin seguir el
   alias da tiempo de espera agotado, que se lee como «no existe». */
const conClave = (registros) => registros.some((x) => /p=[A-Za-z0-9+/]{20,}/.test(x));

const encontrados = [];
for (const s of SELECTORES) {
  const nombre = `${s}._domainkey.${DOMINIO}`;
  if (conClave(await txt(nombre))) { encontrados.push(s); continue; }
  try {
    const { resolveCname } = await import('node:dns/promises');
    for (const destino of await resolveCname(nombre)) {
      if (conClave(await txt(destino))) { encontrados.push(`${s} → ${destino}`); break; }
    }
  } catch { /* ese selector no existe, que es la respuesta normal */ }
}
if (!encontrados.length) {
  di(false, `DKIM: ningún selector responde (probados: ${SELECTORES.join(', ')})`);
  fallos.push('Falta DKIM, y es la causa más probable de que el correo caiga en spam. Se activa en el panel de Hostinger, en Correos → tu dominio → Configuración DNS, y añade el registro que te dé al DNS del dominio.');
} else {
  di(true, `DKIM: firmando con ${encontrados.join(', ')}`);
}

/* ---- DMARC -------------------------------------------------------------- */

const dm = await txt(`_dmarc.${DOMINIO}`);
const dmarc = dm.find((r) => r.toLowerCase().startsWith('v=dmarc1'));
if (!dmarc) {
  di(false, 'DMARC: no hay registro en _dmarc');
  fallos.push('Falta DMARC. Empieza suave: un TXT en «_dmarc» con «v=DMARC1; p=none; rua=mailto:tu-correo». «p=none» no rechaza nada todavía, solo te manda informes de quién envía en tu nombre.');
} else {
  di(true, `DMARC: ${dmarc}`);
  const politica = dmarc.match(/p=(\w+)/)?.[1];
  if (politica === 'none') avisos.push('El DMARC está en «p=none»: informa pero no protege. Cuando lleves unas semanas viendo informes limpios, súbelo a «p=quarantine».');
}

/* ---- Lo que no se puede ver desde aquí ----------------------------------- */

console.log('');
for (const a of avisos) console.log(`::warning::${a}`);
for (const f of fallos) console.log(`::warning::${f}`);

if (!fallos.length) {
  console.log('Las tres firmas están puestas. Si aun así el correo cae en spam, ya no es configuración: es reputación del dominio, y eso se gana enviando poco, a gente que abre, durante unas semanas.');
} else {
  console.log(`\n${fallos.length} de 3 firmas ${fallos.length === 1 ? 'falta' : 'faltan'}. Mientras falten, el correo seguirá cayendo en spam por mucho que se mejore el mensaje.`);
}

/* No se sale en rojo a propósito: esto no lo puede arreglar un despliegue.
   Lo arregla una persona en el panel del dominio, y un trabajo en rojo todos
   los días acabaría ignorándose junto con los que sí puede arreglar. */
