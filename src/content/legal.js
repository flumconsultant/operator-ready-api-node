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
  /* Buzones propios, no alias del general. Un derecho de datos que llega al
     mismo sitio que una consulta comercial acaba tratado como una consulta
     comercial, y ahí es donde se pierden los plazos legales. */
  correoPrivacidad: 'privacidad@meetbecome.com',
  correoLegal: 'legal@meetbecome.com',
  /* No hay teléfono ni oficial de protección de datos porque la ley peruana no
     los exige aquí: basta un canal de contacto para ejercer derechos, y el
     correo de privacidad lo es. Si algún día se nombra un DPO o se publica un
     teléfono, se añaden como campos y las páginas los recogen solas. */

  bancoDatos: 'Prospectos y contactos comerciales',
  /* Los tres salen de la constancia de inscripción de la Autoridad Nacional de
     Protección de Datos Personales. Se copian tal cual del documento: un dígito
     cambiado convierte una inscripción real en una declaración falsa. */
  bancoDatosCodigo: 'PJ-2026-4289',
  bancoDatosConstancia: 'INS-2026-4832',
  bancoDatosFecha: '2026-08-20',

  vigenciaDesde: '2026-08-20',
  ultimaActualizacion: '2026-08-20',
};

/**
 * Los proveedores que el sitio usa de verdad, auditados leyendo el código.
 *
 * El país de Hostinger no se dedujo: es lo que la propia Hostinger declara por
 * escrito —servidores principalmente en Estados Unidos, incluido Arizona, y en
 * otros países donde operen ella o sus proveedores de infraestructura—. De ahí
 * depende que haya transferencia internacional que declarar, y la hay.
 */
export const PROVEEDORES = [
  {
    nombre: 'Hostinger',
    funcion: { es: 'Alojamiento web, correo y base de datos', en: 'Web hosting, email and database' },
    datos: { es: 'Todos los datos del formulario y de la lista de correo', en: 'All form and mailing-list data' },
    razonSocial: 'Hostinger International, Ltd.',
    pais: {
      es: 'Estados Unidos (Arizona) y otros países donde operen Hostinger o sus proveedores de infraestructura',
      en: 'United States (Arizona) and other countries where Hostinger or its infrastructure providers operate',
    },
  },
  {
    nombre: 'GitHub',
    funcion: { es: 'Alojamiento del código y de los contenidos publicados', en: 'Code and published-content hosting' },
    datos: {
      es: 'Ningún dato personal de visitantes. Solo artículos, imágenes y fichas de autor',
      en: 'No visitor personal data. Only articles, images and author profiles',
    },
    razonSocial: 'GitHub, Inc.',
    pais: { es: 'Estados Unidos', en: 'United States' },
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
    'País del centro de datos de Hostinger': PROVEEDORES[0].pais.es,
  }).filter(([, v]) => v === PENDIENTE).map(([k]) => k);
