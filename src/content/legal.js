/**
 * Hoja de identidad legal y contenido de las tres páginas legales.
 *
 * ---- La regla que gobierna este archivo ----
 *
 * Nada de lo que hay aquí se inventa. Un dato legal inventado no es un error de
 * maquetación: obliga a la empresa ante quien lo lea y ante la autoridad.
 *
 * Lo que todavía no existe se marca con PENDIENTE y la página lo muestra en
 * voz alta en lugar de esconderlo. Esconder un campo incompleto es la peor de
 * las tres opciones: la política parece completa, nadie vuelve a mirarla, y el
 * hueco aparece el día que alguien lo reclama.
 *
 * ---- Sobre las cookies ----
 *
 * Este sitio no tiene analítica, ni píxeles, ni scripts de terceros. Se
 * comprobó leyendo el código, no suponiéndolo. Lo único que guarda en el
 * navegador es lo que hace falta para que funcione lo que la persona ha pedido:
 * el borrador del formulario que está rellenando y la decisión de no volver a
 * ver el aviso de suscripción.
 *
 * Por eso la política de cookies es corta y no hay banner. Un banner que pide
 * permiso para cookies que no existen no protege a nadie: entrena a la gente a
 * aceptar sin leer y estorba a quien viene a leer.
 */

export const PENDIENTE = 'PENDIENTE';

export const IDENTIDAD = {
  marca: 'BECOME',
  razonSocial: 'FLUM E.I.R.L.',
  ruc: '20616001711',
  domicilio: 'Av. José Gálvez Barrenechea 200, La Victoria, Lima, Perú',
  pais: 'Perú',
  dominio: 'meetbecome.com',

  correoGeneral: 'hello@meetbecome.com',
  /* Mientras no existan buzones propios, los tres apuntan al que sí existe.
     Es preferible a publicar una dirección que rebota: quien ejerce un derecho
     de datos y recibe un rebote tiene un motivo de reclamo, no un contratiempo. */
  correoPrivacidad: 'hello@meetbecome.com',
  correoLegal: 'hello@meetbecome.com',
  telefono: PENDIENTE,

  bancoDatos: 'Prospectos y contactos comerciales',
  bancoDatosCodigo: PENDIENTE,
  dpo: PENDIENTE,

  vigenciaDesde: '2026-08-20',
  ultimaActualizacion: '2026-08-20',
};

/**
 * Los proveedores que el sitio usa de verdad, auditados leyendo el código.
 *
 * `pais: PENDIENTE` en Hostinger no es descuido: el centro de datos se elige al
 * contratar y solo lo sabe quien lo contrató. De ahí depende si hay o no
 * transferencia internacional que declarar, así que no se puede suponer.
 */
export const PROVEEDORES = [
  {
    nombre: 'Hostinger',
    funcion: { es: 'Alojamiento web, correo y base de datos', en: 'Web hosting, email and database' },
    datos: { es: 'Todos los datos del formulario y de la lista de correo', en: 'All form and mailing-list data' },
    pais: PENDIENTE,
  },
  {
    nombre: 'GitHub',
    funcion: { es: 'Alojamiento del código y de los contenidos publicados', en: 'Code and published-content hosting' },
    datos: {
      es: 'Ningún dato personal de visitantes. Solo artículos, imágenes y fichas de autor',
      en: 'No visitor personal data. Only articles, images and author profiles',
    },
    pais: 'Estados Unidos',
  },
];

/**
 * Lo que el sitio guarda en el navegador. La lista sale del código, una por
 * una, y por eso es corta: no hay analítica ni terceros.
 */
export const ALMACENAMIENTO = [
  {
    nombre: 'become.formulario',
    tipo: { es: 'Almacenamiento local', en: 'Local storage' },
    categoria: { es: 'Estrictamente necesaria', en: 'Strictly necessary' },
    finalidad: {
      es: 'Conservar lo que estás escribiendo en el formulario para que no se pierda si recargas o cierras sin querer',
      en: 'Keep what you are typing in the form so it is not lost if you reload or close the page by accident',
    },
    duracion: { es: 'Hasta enviar el formulario o borrar los datos del navegador', en: 'Until the form is sent or browser data is cleared' },
  },
  {
    nombre: 'become.suscripcion',
    tipo: { es: 'Almacenamiento local', en: 'Local storage' },
    categoria: { es: 'Estrictamente necesaria', en: 'Strictly necessary' },
    finalidad: {
      es: 'Recordar que cerraste el aviso de suscripción, para no volver a mostrártelo',
      en: 'Remember that you dismissed the subscription notice, so it is not shown again',
    },
    duracion: { es: '90 días', en: '90 days' },
  },
  {
    nombre: 'become_panel',
    tipo: { es: 'Cookie', en: 'Cookie' },
    categoria: { es: 'Estrictamente necesaria', en: 'Strictly necessary' },
    finalidad: {
      es: 'Mantener la sesión de quien administra el sitio. Solo se crea al entrar en el panel; un visitante nunca la recibe',
      en: 'Keep the session of whoever administers the site. Created only on signing into the panel; a visitor never receives it',
    },
    duracion: { es: '12 horas', en: '12 hours' },
  },
];

export const AUTORIDAD = {
  es: 'Autoridad Nacional de Protección de Datos Personales del Ministerio de Justicia y Derechos Humanos del Perú',
  en: 'National Authority for Personal Data Protection, Ministry of Justice and Human Rights of Peru',
};

/** Los campos sin los que una página legal no debería publicarse. */
export const faltantes = () =>
  Object.entries({
    'Código de inscripción del banco de datos': IDENTIDAD.bancoDatosCodigo,
    'País del centro de datos de Hostinger': PROVEEDORES[0].pais,
  }).filter(([, v]) => v === PENDIENTE).map(([k]) => k);
