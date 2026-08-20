/**
 * Cliente mínimo de la API de contenidos de GitHub.
 *
 * ---- Por qué el panel no tiene servidor ----
 *
 * Publicar aquí significa escribir un archivo en el repositorio; el despliegue
 * que ya existe se encarga del resto. Eso deja al panel siendo una interfaz
 * sobre una API que ya sabe autenticar y ya lleva el historial de cambios, así
 * que montar un backend propio habría añadido una base de datos, un sistema de
 * usuarios y un sitio más donde el contenido puede quedar desincronizado.
 *
 * Tiene además una consecuencia de seguridad que conviene decir en voz alta:
 * el panel es inofensivo sin un token. Cualquiera puede abrir /admin y no verá
 * nada ni podrá hacer nada, porque quien autoriza es GitHub y no una
 * contraseña que hubiera que guardar en alguna parte.
 *
 * ---- Sobre el token ----
 *
 * Se guarda en el navegador y no viaja a ningún sitio que no sea api.github.com.
 * Debe ser un token de acceso personal «fine-grained» limitado a ESTE
 * repositorio y con un único permiso: Contents (lectura y escritura). Con eso
 * puede escribir artículos y nada más — no puede tocar otros repositorios, ni
 * borrar ramas, ni leer nada privado de la cuenta.
 */

const API = 'https://api.github.com';
export const RUTA = 'src/content/insights';

const CLAVE = 'become.admin.config';

export const leerConfig = () => {
  try { return JSON.parse(localStorage.getItem(CLAVE) || 'null'); } catch { return null; }
};
export const guardarConfig = (c) => localStorage.setItem(CLAVE, JSON.stringify(c));
export const olvidarConfig = () => localStorage.removeItem(CLAVE);

/* btoa solo entiende bytes, y un artículo en español está lleno de caracteres
   que ocupan más de uno. Sin este paso, publicar cualquier texto con una tilde
   lanza una excepción — y publicar el mismo texto sin tildes funcionaría, que
   es la clase de fallo que parece intermitente. */
const aBase64 = (texto) => {
  const bytes = new TextEncoder().encode(texto);
  let bin = '';
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin);
};
const deBase64 = (b64) => {
  const bin = atob(b64.replace(/\s/g, ''));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

async function peticion(cfg, camino, opciones = {}) {
  const r = await fetch(`${API}/repos/${cfg.repo}/${camino}`, {
    ...opciones,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${cfg.token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(opciones.body ? { 'Content-Type': 'application/json' } : {}),
      ...opciones.headers,
    },
  });
  if (r.status === 404 && opciones.method === undefined) return null;
  if (!r.ok) {
    const cuerpo = await r.json().catch(() => ({}));
    /* Los dos errores que de verdad ocurren merecen su propia frase: «401» y
       «403» no le dicen a nadie qué tiene que arreglar. */
    if (r.status === 401) throw new Error('El token no es válido o ha caducado. Genera uno nuevo en GitHub y vuelve a introducirlo.');
    if (r.status === 403) throw new Error('El token es válido pero no tiene permiso de escritura sobre este repositorio. Revisa que incluya «Contents: Read and write».');
    if (r.status === 409) throw new Error('Alguien más modificó este artículo mientras lo editabas. Recarga la lista para traer la última versión antes de volver a guardar.');
    throw new Error(cuerpo.message || `GitHub respondió ${r.status}.`);
  }
  return r.status === 204 ? null : r.json();
}

/** Comprueba que el token sirve antes de dejar entrar, para no descubrirlo al guardar. */
export async function comprobar(cfg) {
  const r = await peticion(cfg, `contents/${RUTA}?ref=${encodeURIComponent(cfg.rama)}`);
  /* Un 404 aquí no es un fallo: significa que todavía no hay ningún artículo.
     El directorio se crea solo con el primero. */
  return Array.isArray(r) ? r : [];
}

export async function listar(cfg) {
  const entradas = await comprobar(cfg);
  const json = entradas.filter((e) => e.type === 'file' && e.name.endsWith('.json'));
  const salida = await Promise.all(json.map(async (e) => {
    const f = await peticion(cfg, `contents/${encodeURIComponent(e.path)}?ref=${encodeURIComponent(cfg.rama)}`);
    return { archivo: e.name, sha: f.sha, articulo: JSON.parse(deBase64(f.content)) };
  }));
  return salida.sort((a, b) => String(b.articulo.fecha).localeCompare(String(a.articulo.fecha)));
}

export function guardar(cfg, { archivo, sha, articulo, mensaje }) {
  return peticion(cfg, `contents/${encodeURIComponent(`${RUTA}/${archivo}`)}`, {
    method: 'PUT',
    body: JSON.stringify({
      message: mensaje,
      content: aBase64(`${JSON.stringify(articulo, null, 2)}\n`),
      branch: cfg.rama,
      ...(sha ? { sha } : {}),
    }),
  });
}

export function borrar(cfg, { archivo, sha }) {
  return peticion(cfg, `contents/${encodeURIComponent(`${RUTA}/${archivo}`)}`, {
    method: 'DELETE',
    body: JSON.stringify({ message: `Retirar artículo ${archivo}`, sha, branch: cfg.rama }),
  });
}

/** El despliegue que dispara el push, para poder enlazarlo tras publicar. */
export const urlAcciones = (cfg) => `https://github.com/${cfg.repo}/actions`;
