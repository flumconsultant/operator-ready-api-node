/**
 * Cliente del panel.
 *
 * Habla con /api/panel.php, que vive en el mismo hosting, y no con GitHub. Esa
 * es toda la diferencia con la primera versión y es lo que permite que entre
 * gente con usuario y contraseña: el token de GitHub existe una sola vez, en
 * el servidor, y quien escribe un artículo no necesita cuenta de GitHub ni
 * llega a ver ese token.
 *
 * La sesión va en una cookie que el navegador manda sola y que el JavaScript
 * de esta página no puede leer. Por eso aquí no se guarda nada: no hay ningún
 * dato de acceso en el navegador que alguien pueda extraer.
 */

const PUNTO = '/api/panel.php';

/* La primera versión del panel guardaba el token de GitHub de cada persona en
   el navegador. Ya no lo lee nadie, pero seguiría ahí en el equipo de quien lo
   usó, y un token de escritura olvidado en un almacén del navegador es
   exactamente la clase de cosa que sigue siendo válida meses después de dejar
   de hacer falta. Se borra al abrir el panel, sin que nadie tenga que saber
   que estaba. */
try { localStorage.removeItem('become.admin.config'); } catch { /* modo privado */ }

async function llamar(accion, cuerpo) {
  let r;
  try {
    r = await fetch(cuerpo ? PUNTO : `${PUNTO}?accion=${encodeURIComponent(accion)}`, {
      method: cuerpo ? 'POST' : 'GET',
      /* Sin esto el navegador no envía la cookie de sesión y todo respondería
         «sin sesión» justo después de haber entrado. */
      credentials: 'same-origin',
      headers: cuerpo ? { 'Content-Type': 'application/json' } : {},
      body: cuerpo ? JSON.stringify({ accion, ...cuerpo }) : undefined,
    });
  } catch {
    throw new Error('No se pudo contactar con el servidor. Comprueba la conexión y vuelve a intentarlo.');
  }

  const datos = await r.json().catch(() => ({}));
  if (r.ok && datos.ok) return datos;

  /* La sesión caducada tiene su propio tipo de error porque el panel responde
     distinto: no es un fallo que enseñar, es volver a la pantalla de entrada. */
  const e = new Error(datos.mensaje || `El servidor respondió ${r.status}.`);
  e.tipo = datos.error || 'desconocido';
  throw e;
}

export const entrar = (usuario, clave) => llamar('entrar', { usuario, clave });
export const salir = () => llamar('salir', {});
export const quienSoy = () => llamar('yo');
/* Devuelven la respuesta entera y no solo el array: cuando viene vacía, el
   servidor dice en `vacio_en` dónde miró. Una lista vacía sin esa pista no se
   puede distinguir de una avería, y durante un tiempo lo fue: una ruta mal
   construida hacía que el panel enseñara «todavía no hay nada» con el
   repositorio lleno. */
export const listar = () => llamar('listar');
export const guardar = (datos) => llamar('guardar', datos);
export const borrar = (datos) => llamar('borrar', datos);
export const listarAutores = () => llamar('listar-autores');
export const guardarAutor = (datos) => llamar('guardar-autor', datos);
export const subirFoto = (datos) => llamar('subir-foto', datos);
export const listarPaginas = (carpeta = 'paginas') => llamar('listar-paginas', { carpeta });
export const listarEsquemas = () => llamar('listar-esquemas');
export const abrirEsquema = (esquema, idioma) => llamar('abrir-esquema', { esquema, idioma });
export const guardarContenido = (datos) => llamar('guardar-contenido', datos);
/* El historial de versiones de un archivo de contenido: los commits que lo
   tocaron. No hay tabla propia de versiones porque el repositorio ya es una. */
export const historial = (esquema, idioma) => llamar('historial', { esquema, idioma });
export const guardarPagina = (datos) => llamar('guardar-pagina', datos);
export const suscriptores = () => llamar('suscriptores');
export const diagnosticoCorreo = () => llamar('diagnostico-correo');
