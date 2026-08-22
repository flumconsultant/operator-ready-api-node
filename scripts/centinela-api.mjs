/**
 * ¿Siguen vivos los cuatro endpoints del sitio?
 *
 * El centinela de publicación pregunta si las páginas están. Este pregunta por
 * lo otro que el sitio hace y que no se ve mirando: recibir un formulario,
 * guardar una suscripción, enviar un correo y dejar entrar al panel.
 *
 * Son la mitad del sitio que puede caerse sin que nadie lo note. Una página
 * rota se ve; un formulario que devuelve error 500 solo lo descubre quien
 * intentaba escribirte, y esa persona no vuelve a intentarlo.
 *
 * ---- Comprueba sin causar efecto ----
 *
 * Ninguna comprobación crea un suscriptor, envía un correo ni abre una sesión.
 * Se pide a cada endpoint algo que TIENE que rechazar —una petición sin datos,
 * una acción sin sesión— y se comprueba que rechaza como debe:
 *
 *   · que responda algo, y no un 500 ni un silencio;
 *   · que responda JSON, porque un PHP roto devuelve HTML con el error dentro;
 *   · que el rechazo sea el suyo y no el del servidor.
 *
 * Un endpoint que rechaza correctamente está vivo y con su código cargado. Uno
 * que devuelve 200 a una petición vacía está peor que caído: está aceptando lo
 * que no debería.
 *
 * ---- Por qué no envía un correo de prueba ----
 *
 * Porque enviarlo es irreversible y llega a una bandeja real. Comprobar que el
 * endpoint vive y valida es todo lo que se puede hacer sin efectos, y es mucho
 * más que lo que había: nada.
 */

const SITIO = process.env.SITIO || 'https://meetbecome.com';
const ESPERA_MS = 20000;

const PRUEBAS = [
  {
    nombre: 'contacto',
    ruta: '/api/contacto.php',
    metodo: 'POST',
    cuerpo: {},
    /* Un formulario vacío tiene que rechazarse. Si lo acepta, cualquiera puede
       llenar la bandeja de mensajes en blanco. */
    esperado: (r) => r.estado >= 400 && r.estado < 500,
    explica: 'debería rechazar un envío vacío con un error del cliente',
  },
  {
    nombre: 'suscripcion',
    ruta: '/api/suscripcion.php',
    metodo: 'POST',
    cuerpo: {},
    esperado: (r) => r.estado >= 400 && r.estado < 500,
    explica: 'debería rechazar un alta sin correo',
  },
  {
    nombre: 'panel',
    ruta: '/api/panel.php?accion=yo',
    metodo: 'GET',
    /* Sin sesión tiene que decir que no. Un 200 aquí significaría que el panel
       contesta a cualquiera quién eres. */
    esperado: (r) => r.estado === 401 || r.estado === 403,
    explica: 'debería negar la entrada sin sesión',
  },
  {
    nombre: 'clave-indexnow',
    ruta: `/${process.env.INDEXNOW_CLAVE || '2f6a4e8c60f1962a409352f15ab7fc1b'}.txt`,
    metodo: 'GET',
    /* El protocolo exige que la clave esté publicada. Si desaparece, los
       avisos a los buscadores se rechazan en silencio. */
    esperado: (r) => r.estado === 200 && r.texto.trim().length > 20,
    explica: 'la clave de IndexNow debe estar publicada y no vacía',
    sinJson: true,
  },
];

async function pedir(prueba) {
  const control = new AbortController();
  const reloj = setTimeout(() => control.abort(), ESPERA_MS);
  try {
    const r = await fetch(`${SITIO}${prueba.ruta}`, {
      method: prueba.metodo,
      signal: control.signal,
      headers: {
        'User-Agent': 'centinela-become/1.0',
        'Cache-Control': 'no-cache',
        ...(prueba.cuerpo ? { 'Content-Type': 'application/json' } : {}),
      },
      body: prueba.cuerpo ? JSON.stringify(prueba.cuerpo) : undefined,
    });
    const texto = await r.text();
    return { estado: r.status, texto, tipo: r.headers.get('content-type') || '' };
  } catch (e) {
    return { estado: 0, texto: '', tipo: '', error: e.message };
  } finally {
    clearTimeout(reloj);
  }
}

const fallos = [];
for (const p of PRUEBAS) {
  const r = await pedir(p);
  const donde = `${SITIO}${p.ruta}`;

  if (r.estado === 0) {
    fallos.push(`${p.nombre} → sin respuesta (${r.error})`);
    console.log(`  ✗  ${p.nombre.padEnd(16)} sin respuesta`);
    continue;
  }
  /* Un PHP que revienta devuelve HTML con el aviso dentro, y a veces con un
     200. Mirar solo el código de estado daría verde a un endpoint roto. */
  if (!p.sinJson && !r.tipo.includes('json')) {
    fallos.push(`${donde} → responde ${r.tipo || 'sin tipo'} en vez de JSON: ${r.texto.slice(0, 120)}`);
    console.log(`  ✗  ${p.nombre.padEnd(16)} HTTP ${r.estado} pero no es JSON`);
    continue;
  }
  if (!p.esperado(r)) {
    fallos.push(`${donde} → HTTP ${r.estado}, y ${p.explica}`);
    console.log(`  ✗  ${p.nombre.padEnd(16)} HTTP ${r.estado}`);
    continue;
  }
  console.log(`  ok  ${p.nombre.padEnd(16)} HTTP ${r.estado}`);
}

console.log('');
if (fallos.length) {
  for (const f of fallos) console.error(`::error::${f}`);
  console.error(`::error::${fallos.length} de ${PRUEBAS.length} endpoints no responden como deben. Es la parte del sitio que se cae sin que se vea.`);
  process.exit(1);
}
console.log(`Los ${PRUEBAS.length} endpoints responden y rechazan lo que tienen que rechazar.`);
