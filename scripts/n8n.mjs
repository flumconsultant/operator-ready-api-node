/**
 * Hablar con n8n sin el servidor MCP.
 *
 * El proyecto declara en .mcp.json un servidor MCP `n8n-mcp` que se descarga
 * con `npx`. En una sesión de escritorio eso funciona. En las sesiones de
 * Claude Code en la nube no: el registro de npm está bloqueado por la política
 * de salida del entorno (403 en registry.npmjs.org, para cualquier paquete),
 * así que el proceso muere al arrancar y el servidor aparece como caído.
 *
 * Lo que se pierde ahí no es el acceso a n8n —la API REST del VPS responde
 * perfectamente— sino el puente. Este guion es ese puente, reducido a lo que
 * de verdad se usa: leer los flujos, exportarlos, corregir el JSON y volverlo
 * a subir, y mirar por qué falló una ejecución.
 *
 * ---- Lo que la API pública de n8n no deja hacer ----
 *
 * Conviene saberlo antes de buscar el comando que falta:
 *
 *   · no se puede lanzar un flujo bajo demanda; se dispara por su webhook o
 *     desde la interfaz. Aquí no hay `ejecutar` porque no existe;
 *   · no se puede leer el valor de una credencial. Se crean y se borran, pero
 *     el secreto no sale nunca por la API. Es lo correcto;
 *   · `variables` y `projects` son de la licencia Enterprise y devuelven 403.
 *
 * ---- Lo que sí borra ----
 *
 * `borrar` es irreversible y n8n no tiene papelera. Por eso exige `--si` y
 * antes exporta una copia del flujo a disco: si el borrado fue un error, el
 * JSON sigue estando para volver a crearlo.
 *
 * Uso:
 *   node scripts/n8n.mjs listar [--activos]
 *   node scripts/n8n.mjs ver <id>
 *   node scripts/n8n.mjs exportar <id> [ruta.json]
 *   node scripts/n8n.mjs crear <archivo.json>
 *   node scripts/n8n.mjs actualizar <id> <archivo.json>
 *   node scripts/n8n.mjs activar|desactivar <id>
 *   node scripts/n8n.mjs borrar <id> --si
 *   node scripts/n8n.mjs ejecuciones [--flujo <id>] [--error] [--limite N]
 *   node scripts/n8n.mjs ejecucion <id>
 *   node scripts/n8n.mjs etiquetas
 *   node scripts/n8n.mjs diagnostico
 */

/* El fetch de Node no lee HTTPS_PROXY por sí solo. En las sesiones en la nube
   toda la salida pasa por un proxy local, y sin esto cada petición se queda
   colgada hasta el tiempo de espera. En una máquina sin proxy no estorba. */
process.env.NODE_USE_ENV_PROXY ??= '1';

import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const URL_BASE = (process.env.N8N_API_URL || 'https://n8n.srv836595.hstgr.cloud').replace(/\/$/, '');
const CLAVE = process.env.N8N_API_KEY;
const ESPERA_MS = 30000;

if (!CLAVE) {
  console.error('Falta N8N_API_KEY en el entorno. Es la clave de la API pública,');
  console.error('la que se crea en n8n en Ajustes → API. Sin ella no hay nada que hacer.');
  process.exit(1);
}

/* n8n devuelve el error en el cuerpo, no en el código: un 400 con
   {"message":"..."} explica mucho más que el número. Por eso se lee siempre. */
async function pedir(ruta, opciones = {}) {
  const respuesta = await fetch(`${URL_BASE}/api/v1${ruta}`, {
    ...opciones,
    headers: {
      'X-N8N-API-KEY': CLAVE,
      'content-type': 'application/json',
      accept: 'application/json',
      ...(opciones.headers || {}),
    },
    signal: AbortSignal.timeout(ESPERA_MS),
  });

  const texto = await respuesta.text();
  let cuerpo;
  try {
    cuerpo = texto ? JSON.parse(texto) : null;
  } catch {
    cuerpo = texto;
  }

  if (!respuesta.ok) {
    const detalle = cuerpo?.message || cuerpo?.error || (typeof cuerpo === 'string' ? cuerpo.slice(0, 300) : '');
    const error = new Error(`${respuesta.status} ${respuesta.statusText}${detalle ? ` — ${detalle}` : ''}`);
    error.estado = respuesta.status;
    throw error;
  }
  return cuerpo;
}

/* La API pagina de 100 en 100 y devuelve un cursor. Con 44 flujos hoy no hace
   falta, pero el día que sean 300 este bucle es la diferencia entre verlos
   todos y ver los primeros cien sin enterarse. */
async function pedirTodo(ruta, parametros = {}) {
  const acumulado = [];
  let cursor;
  do {
    const busqueda = new URLSearchParams({ limit: '100', ...parametros });
    if (cursor) busqueda.set('cursor', cursor);
    const pagina = await pedir(`${ruta}?${busqueda}`);
    acumulado.push(...(pagina.data || []));
    cursor = pagina.nextCursor;
  } while (cursor);
  return acumulado;
}

/* Al subir un flujo, n8n rechaza las propiedades que él mismo pone (id, fechas,
   estado activo, etiquetas). Mandar de vuelta el JSON tal como se exportó da un
   400 con "request/body must NOT have additional properties", que no dice cuál.
   Se recorta aquí para que no ocurra. */
const ACEPTADAS = ['name', 'nodes', 'connections', 'settings', 'staticData'];

function paraEnviar(flujo) {
  const limpio = {};
  for (const clave of ACEPTADAS) {
    if (flujo[clave] !== undefined) limpio[clave] = flujo[clave];
  }
  limpio.settings ??= { executionOrder: 'v1' };
  return limpio;
}

function leerJson(ruta) {
  try {
    return JSON.parse(readFileSync(ruta, 'utf8'));
  } catch (error) {
    console.error(`No se pudo leer ${ruta}: ${error.message}`);
    process.exit(1);
  }
}

function guardar(ruta, datos) {
  mkdirSync(dirname(ruta), { recursive: true });
  writeFileSync(ruta, JSON.stringify(datos, null, 2));
}

const [, , orden, ...resto] = process.argv;
const argumentos = resto.filter((a) => !a.startsWith('--'));
const bandera = (nombre) => resto.includes(`--${nombre}`);
const valor = (nombre) => {
  const i = resto.indexOf(`--${nombre}`);
  return i === -1 ? undefined : resto[i + 1];
};

const ordenes = {
  async listar() {
    const flujos = await pedirTodo('/workflows');
    const visibles = bandera('activos') ? flujos.filter((f) => f.active) : flujos;
    for (const f of visibles.sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name))) {
      console.log(
        `${f.active ? 'ACTIVO  ' : 'inactivo'}  ${f.id.padEnd(24)}  ${String(f.nodes?.length ?? 0).padStart(3)} nodos  ${f.name}`,
      );
    }
    console.log(`\n${visibles.length} de ${flujos.length} flujos · ${flujos.filter((f) => f.active).length} activos`);
  },

  async ver() {
    console.log(JSON.stringify(await pedir(`/workflows/${argumentos[0]}`), null, 2));
  },

  async exportar() {
    const flujo = await pedir(`/workflows/${argumentos[0]}`);
    const ruta = argumentos[1] || `automatizacion/n8n/${flujo.id}.json`;
    guardar(ruta, flujo);
    console.log(`${flujo.name} → ${ruta}`);
  },

  async crear() {
    const flujo = await pedir('/workflows', { method: 'POST', body: JSON.stringify(paraEnviar(leerJson(argumentos[0]))) });
    console.log(`Creado ${flujo.id} — ${flujo.name} (inactivo; n8n siempre los crea así)`);
  },

  /* Se exporta antes de sobrescribir. Un PUT reemplaza el flujo entero, y sin
     copia previa no hay forma de volver a la versión anterior. */
  async actualizar() {
    const [id, archivo] = argumentos;
    const previo = await pedir(`/workflows/${id}`);
    const copia = `automatizacion/n8n/copias/${id}-${Date.now()}.json`;
    guardar(copia, previo);
    const flujo = await pedir(`/workflows/${id}`, { method: 'PUT', body: JSON.stringify(paraEnviar(leerJson(archivo))) });
    console.log(`Actualizado ${flujo.id} — ${flujo.name}`);
    console.log(`Copia de la versión anterior en ${copia}`);
  },

  async activar() {
    const flujo = await pedir(`/workflows/${argumentos[0]}/activate`, { method: 'POST' });
    console.log(`ACTIVO — ${flujo.name}`);
  },

  async desactivar() {
    const flujo = await pedir(`/workflows/${argumentos[0]}/deactivate`, { method: 'POST' });
    console.log(`inactivo — ${flujo.name}`);
  },

  async borrar() {
    const id = argumentos[0];
    if (!bandera('si')) {
      const flujo = await pedir(`/workflows/${id}`);
      console.error(`Esto borra «${flujo.name}» (${flujo.nodes?.length ?? 0} nodos) y n8n no tiene papelera.`);
      console.error(`Si es lo que quieres: node scripts/n8n.mjs borrar ${id} --si`);
      process.exit(1);
    }
    const flujo = await pedir(`/workflows/${id}`);
    const copia = `automatizacion/n8n/copias/${id}-borrado-${Date.now()}.json`;
    guardar(copia, flujo);
    await pedir(`/workflows/${id}`, { method: 'DELETE' });
    console.log(`Borrado ${id} — ${flujo.name}`);
    console.log(`Queda el JSON en ${copia} por si hubo que deshacerlo.`);
  },

  async ejecuciones() {
    const parametros = { limit: valor('limite') || '20' };
    if (valor('flujo')) parametros.workflowId = valor('flujo');
    if (bandera('error')) parametros.status = 'error';
    const { data = [] } = await pedir(`/executions?${new URLSearchParams(parametros)}`);
    if (!data.length) return console.log('Sin ejecuciones que coincidan.');
    for (const e of data) {
      console.log(`${String(e.id).padEnd(10)} ${String(e.status).padEnd(9)} ${e.startedAt}  ${e.workflowData?.name || e.workflowId}`);
    }
  },

  /* El detalle trae el volcado entero de datos de cada nodo y son megas de
     ruido. Lo que se busca al mirar una ejecución fallida es el nodo que
     reventó y su mensaje: eso es lo que se imprime. */
  async ejecucion() {
    const e = await pedir(`/executions/${argumentos[0]}?includeData=true`);
    console.log(`${e.id} · ${e.status} · ${e.workflowData?.name}`);
    console.log(`Empezó ${e.startedAt} · terminó ${e.stoppedAt || '(no terminó)'}`);
    const resultado = e.data?.resultData;
    if (resultado?.error) {
      console.log(`\nFalló en: ${resultado.lastNodeExecuted || '(nodo desconocido)'}`);
      console.log(`${resultado.error.message || resultado.error.description || JSON.stringify(resultado.error).slice(0, 500)}`);
    } else {
      console.log(`\nSin error registrado. Último nodo: ${resultado?.lastNodeExecuted || '(ninguno)'}`);
    }
  },

  async etiquetas() {
    for (const t of await pedirTodo('/tags')) console.log(`${t.id.padEnd(38)} ${t.name}`);
  },

  /* Lo primero que se ejecuta cuando «n8n no responde», para separar el fallo
     de red del de permisos y del de licencia. */
  async diagnostico() {
    console.log(`Instancia: ${URL_BASE}`);
    console.log(`Clave: presente (${CLAVE.length} caracteres)\n`);
    for (const [nombre, ruta] of [
      ['workflows', '/workflows?limit=1'],
      ['executions', '/executions?limit=1'],
      ['tags', '/tags?limit=1'],
      ['users', '/users?limit=1'],
      ['credentials', '/credentials?limit=1'],
      ['variables (Enterprise)', '/variables'],
      ['projects (Enterprise)', '/projects'],
    ]) {
      try {
        await pedir(ruta);
        console.log(`  ok    ${nombre}`);
      } catch (error) {
        console.log(`  ${String(error.estado || '???').padEnd(5)} ${nombre} — ${error.message.slice(0, 90)}`);
      }
    }
  },
};

if (!orden || !ordenes[orden]) {
  if (orden) console.error(`No existe la orden «${orden}».\n`);
  console.error(`Órdenes:
  listar [--activos]              los flujos de la instancia
  ver <id>                        el JSON completo de un flujo
  exportar <id> [ruta.json]       guardarlo a disco
  crear <archivo.json>            subir un flujo nuevo
  actualizar <id> <archivo.json>  reemplazarlo (deja copia del anterior)
  activar|desactivar <id>
  borrar <id> --si                irreversible; deja copia del JSON
  ejecuciones [--flujo <id>] [--error] [--limite N]
  ejecucion <id>                  en qué nodo falló y por qué
  etiquetas
  diagnostico                     qué endpoints responden y cuáles no`);
  process.exit(orden ? 1 : 0);
}

try {
  await ordenes[orden]();
} catch (error) {
  console.error(`Falló «${orden}»: ${error.message}`);
  process.exit(1);
}
