<?php
/**
 * Autenticación y publicación del panel de artículos (/admin).
 *
 * ---- Por qué existe este archivo ----
 *
 * La primera versión del panel hablaba directamente con la API de GitHub desde
 * el navegador, y cada persona tenía que llevar su propio token. Eso funciona
 * para una persona técnica y no funciona para un equipo: obliga a que todo el
 * mundo tenga cuenta de GitHub con permiso de escritura sobre el repositorio,
 * que es mucho más de lo que necesita quien solo va a escribir un artículo.
 *
 * Con este intermediario, quien escribe entra con usuario y contraseña. El
 * token de GitHub existe una sola vez, vive en el servidor y no sale de él;
 * las personas del equipo no llegan a verlo y no pueden hacer con él nada
 * distinto de lo que este archivo permite: leer, escribir y borrar artículos
 * dentro de src/content/insights, y editar el texto de las páginas ya
 * declaradas en src/content/paginas.
 *
 * ---- Por qué la sesión va firmada y no guardada ----
 *
 * El despliegue sincroniza public_html borrando lo que no viene en el paquete,
 * así que cualquier sesión guardada en un archivo del servidor desaparecería
 * en el siguiente despliegue y echaría a todo el mundo a media edición. Una
 * cookie firmada no necesita que el servidor recuerde nada: lleva dentro quién
 * es y hasta cuándo, y la firma impide modificarla sin la clave.
 *
 * Las credenciales NO están aquí. Viven en config-panel.php, que lo genera el
 * despliegue a partir de los secretos del repositorio.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

const SESION_HORAS     = 12;
const COOKIE           = 'become_panel';
const RUTA_ARTICULOS   = 'src/content/insights';
const RUTA_AUTORES     = 'src/content/autores';
const RUTA_FOTOS       = 'assets/images/autores';
const RUTA_PAGINAS     = 'src/content/paginas';
const RUTA_ESQUEMAS    = 'src/content/esquemas';
const RUTA_CONOCIMIENTO = 'src/content/conocimiento';
const FOTO_MAX_BYTES   = 3_000_000;
const INTENTOS_MAX     = 8;      // intentos de entrar...
const INTENTOS_SECS    = 900;    // ...por cada cuarto de hora e IP

function responder(int $code, array $data): never {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

$config = @include __DIR__ . '/config-panel.php';
if (!is_array($config) || empty($config['secreto']) || empty($config['token'])) {
    responder(500, ['ok' => false, 'error' => 'sin_config',
        'mensaje' => 'El servidor no tiene configurado el panel. Falta desplegar con los secretos PANEL_USUARIOS y PANEL_TOKEN.']);
}

/* ------------------------------------------------------------ peticiones */

$metodo = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$cuerpo = [];
if ($metodo === 'POST') {
    $crudo = file_get_contents('php://input') ?: '';
    if (strlen($crudo) > 2_000_000) responder(413, ['ok' => false, 'error' => 'demasiado_grande']);
    $cuerpo = json_decode($crudo, true) ?: [];
}
$accion = (string) ($cuerpo['accion'] ?? $_GET['accion'] ?? '');

/* Una petición que cambia algo tiene que venir de la propia web. La cookie ya
   es SameSite=Strict, así que un formulario de otro dominio no la enviaría;
   esto cubre además al navegador que no respete ese atributo. */
if ($metodo === 'POST' && $accion !== 'entrar') {
    $origen = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
    if ($origen !== '') {
        /* Se compara solo el nombre de dominio, sin el puerto, y se aceptan
           tanto el Host que ve PHP como el que declara un proxy por delante.
           Si el sitio pasa algún día por una capa intermedia que reescribe
           Host, una comprobación estricta rechazaría peticiones legítimas —y
           el síntoma sería que publicar deja de funcionar sin motivo visible. */
        $suyo = strtolower((string) parse_url($origen, PHP_URL_HOST));
        $nuestros = [];
        foreach ([$_SERVER['HTTP_X_FORWARDED_HOST'] ?? '', $_SERVER['HTTP_HOST'] ?? '', $_SERVER['SERVER_NAME'] ?? ''] as $h) {
            foreach (explode(',', (string) $h) as $uno) {
                $uno = strtolower(trim(explode(':', trim($uno))[0]));
                if ($uno !== '') $nuestros[] = $uno;
            }
        }
        if (!in_array($suyo, $nuestros, true)) {
            responder(403, ['ok' => false, 'error' => 'origen',
                'mensaje' => 'La petición no viene del propio sitio.']);
        }
    }
}

/* ---------------------------------------------------------------- sesión */

function firmar(string $carga, string $secreto): string {
    return hash_hmac('sha256', $carga, $secreto);
}

function crear_sesion(string $usuario, string $secreto): string {
    $carga = base64_encode(json_encode(['u' => $usuario, 'exp' => time() + SESION_HORAS * 3600]));
    return $carga . '.' . firmar($carga, $secreto);
}

/** Devuelve el usuario de la cookie, o null si no hay, no cuadra o caducó. */
function sesion_de_cookie(string $secreto): ?string {
    $v = $_COOKIE[COOKIE] ?? '';
    if (!is_string($v) || !str_contains($v, '.')) return null;
    [$carga, $firma] = explode('.', $v, 2);
    /* Comparación en tiempo constante: comparar firmas con === filtra la
       respuesta por el tiempo que tarda, y eso deja adivinarlas byte a byte. */
    if (!hash_equals(firmar($carga, $secreto), $firma)) return null;
    $datos = json_decode((string) base64_decode($carga, true), true);
    if (!is_array($datos) || ($datos['exp'] ?? 0) < time()) return null;
    return (string) ($datos['u'] ?? '') ?: null;
}

function poner_cookie(string $valor, int $vida): void {
    setcookie(COOKIE, $valor, [
        'expires'  => $vida > 0 ? time() + $vida : 1,
        'path'     => '/',
        'secure'   => true,
        /* httponly: el JavaScript de la página no puede leerla. Si algún día
           se colara un script ajeno en el sitio, no podría llevarse la sesión. */
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
}

/* ----------------------------------------------------------------- entrar */

if ($accion === 'entrar') {
    if ($metodo !== 'POST') responder(405, ['ok' => false, 'error' => 'metodo']);

    /* Sin este límite, una contraseña se adivina probando. Se cuenta por IP y
       se guarda en el directorio temporal, igual que hace el formulario. */
    $ip     = (string) ($_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
    $marca  = sys_get_temp_dir() . '/becomepanel_' . hash('sha256', $ip);
    $previos = array_filter(
        json_decode((string) @file_get_contents($marca), true) ?: [],
        static fn($t) => is_int($t) && $t > time() - INTENTOS_SECS
    );
    if (count($previos) >= INTENTOS_MAX) {
        responder(429, ['ok' => false, 'error' => 'demasiados_intentos',
            'mensaje' => 'Demasiados intentos fallidos. Espera un cuarto de hora y vuelve a probar.']);
    }

    $usuario = strtolower(trim((string) ($cuerpo['usuario'] ?? '')));
    $clave   = (string) ($cuerpo['clave'] ?? '');
    $hash    = $config['usuarios'][$usuario]['hash'] ?? null;

    /* Se comprueba siempre contra un hash, exista el usuario o no: si un
       usuario inexistente respondiera al instante y uno real tardara lo que
       tarda bcrypt, la diferencia de tiempo revelaría qué cuentas existen. */
    $valido = password_verify($clave, $hash ?? '$2y$10$invalidoinvalidoinvalidoinvalidoinvalidoinvalidoinvali');

    if (!$valido || $hash === null) {
        $previos[] = time();
        @file_put_contents($marca, json_encode(array_values($previos)), LOCK_EX);
        responder(401, ['ok' => false, 'error' => 'credenciales',
            'mensaje' => 'Usuario o contraseña incorrectos.']);
    }

    @unlink($marca);
    poner_cookie(crear_sesion($usuario, $config['secreto']), SESION_HORAS * 3600);
    responder(200, ['ok' => true, 'usuario' => $usuario,
        'nombre' => $config['usuarios'][$usuario]['nombre'] ?? $usuario]);
}

if ($accion === 'salir') {
    poner_cookie('', 0);
    responder(200, ['ok' => true]);
}

/* --------------------------------------------- a partir de aquí, con sesión */

$usuario = sesion_de_cookie($config['secreto']);
if ($usuario === null || !isset($config['usuarios'][$usuario])) {
    poner_cookie('', 0);
    responder(401, ['ok' => false, 'error' => 'sin_sesion']);
}
$nombre = $config['usuarios'][$usuario]['nombre'] ?? $usuario;

if ($accion === 'yo') {
    responder(200, ['ok' => true, 'usuario' => $usuario, 'nombre' => $nombre, 'rama' => $config['rama']]);
}

/* --------------------------------------------------- intermediario a GitHub */

/**
 * Llama a la API de contenidos de GitHub con el token del servidor.
 *
 * El camino se construye aquí y nunca llega desde el navegador: quien escribe
 * solo elige el NOMBRE del archivo, y este archivo decide en qué directorio va.
 * Si el camino viniera de fuera, un nombre con «../» dejaría escribir en
 * cualquier punto del repositorio con el token del servidor.
 */
function github(array $config, string $camino, string $metodo = 'GET', ?array $cuerpo = null): array {
    $ch = curl_init("https://api.github.com/repos/{$config['repo']}/$camino");
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST  => $metodo,
        CURLOPT_TIMEOUT        => 25,
        CURLOPT_HTTPHEADER     => [
            'Accept: application/vnd.github+json',
            'Authorization: Bearer ' . $config['token'],
            'X-GitHub-Api-Version: 2022-11-28',
            'User-Agent: become-panel',
            'Content-Type: application/json',
        ],
    ]);
    /* El cuerpo se pone aparte y no con un `...` dentro del array de opciones:
       las constantes CURLOPT_* son números, y al esparcir un array de claves
       numéricas PHP las renumera. La opción se habría perdido en silencio y la
       petición habría salido sin contenido —que es exactamente lo que pasaba
       antes de probarlo contra un servidor que enseñara lo que recibe. */
    if ($cuerpo !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($cuerpo, JSON_UNESCAPED_UNICODE));
    }
    $respuesta = curl_exec($ch);
    $codigo    = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $fallo     = curl_error($ch);
    curl_close($ch);
    if ($respuesta === false) {
        responder(502, ['ok' => false, 'error' => 'github_inalcanzable', 'mensaje' => 'No se pudo contactar con GitHub: ' . $fallo]);
    }
    return ['codigo' => $codigo, 'datos' => json_decode((string) $respuesta, true)];
}

/** Solo nombres de archivo simples: ni rutas, ni subir de directorio. */
function archivo_valido(string $n): bool {
    return (bool) preg_match('/^[a-z0-9][a-z0-9-]{0,80}\.json$/', $n);
}

$rama = (string) $config['rama'];

/* ---- Contenido declarado por esquema ---------------------------------------
 *
 * Industrias, servicios, el método: colecciones con listas dentro, en dos
 * idiomas. Demasiado para el formulario plano de las páginas.
 *
 * La regla de seguridad es la misma de siempre y aquí es más importante: el
 * navegador NO dice qué archivo escribir. Dice qué esquema usar, y el esquema
 * —que vive en el repositorio y solo se cambia con un commit— dice a qué
 * archivo apunta y qué campos tiene. Si alguien pide guardar un campo que el
 * esquema no declara, ese campo se ignora; si pide un esquema que no existe,
 * no pasa nada. No hay forma de escribir fuera de lo declarado.
 *
 * Y el archivo de datos tiene que estar bajo src/content y acabar en .json: un
 * esquema mal escrito no puede convertirse en permiso para tocar otra cosa.
 */
function esquema_leer(array $config, string $rama, string $id) {
    if (!preg_match('/^[a-z][a-z0-9-]{0,40}$/', $id)) return null;
    $r = github($config, 'contents/' . rawurlencode(RUTA_ESQUEMAS . '/' . $id . '.json') . '?ref=' . rawurlencode($rama));
    if ($r['codigo'] !== 200) return null;
    $e = json_decode((string) base64_decode(str_replace("\n", '', (string) ($r['datos']['content'] ?? ''))), true);
    if (!is_array($e) || empty($e['campos'])) return null;
    $rutas = is_array($e['archivosPorIdioma'] ?? null) ? array_values($e['archivosPorIdioma']) : [(string) ($e['archivoDatos'] ?? '')];
    if (!$rutas) return null;
    foreach ($rutas as $destino) {
        if (!preg_match('#^src/content/[a-z0-9./-]+\.json$#', (string) $destino) || str_contains((string) $destino, '..')) return null;
    }
    return $e;
}

if ($accion === 'listar-esquemas') {
    $r = github($config, 'contents/' . rawurlencode(RUTA_ESQUEMAS) . '?ref=' . rawurlencode($rama));
    if ($r['codigo'] === 404) responder(200, ['ok' => true, 'esquemas' => []]);
    if ($r['codigo'] !== 200 || !is_array($r['datos'])) {
        responder(502, ['ok' => false, 'error' => 'github', 'mensaje' => 'No se pudieron listar los esquemas.']);
    }
    $lista = [];
    foreach ($r['datos'] as $e) {
        if (($e['type'] ?? '') !== 'file' || !archivo_valido((string) $e['name'])) continue;
        $id = substr((string) $e['name'], 0, -5);
        $esq = esquema_leer($config, $rama, $id);
        if ($esq) $lista[] = ['id' => $id, 'titulo' => $esq['titulo'] ?? $id, 'campos' => count($esq['campos'])];
    }
    responder(200, ['ok' => true, 'esquemas' => $lista]);
}

/* Qué le pasó al guardado, dicho de forma que se pueda actuar.
 *
 * Antes esto decía «GitHub rechazó el guardado» y nada más. Es la clase de
 * mensaje que deja a quien edita sin saber si el problema es suyo, es de la
 * conexión o hay que llamar a alguien — y las tres causas probables tienen
 * arreglos distintos:
 *
 *   · 409 — el archivo cambió en el repositorio mientras estaba abierto en el
 *     panel. Ocurre de verdad: basta con que un despliegue toque ese archivo
 *     entre que se abre y se guarda. Se arregla recargando y volviendo a
 *     escribir, y NO se debe reintentar solo: reintentar aquí es pisar el
 *     cambio de otro sin haberlo visto.
 *   · 401 o 403 — el token de GitHub caducó o perdió permiso. No se arregla
 *     desde el panel.
 *   · 404 — la rama o la ruta no existen. Es configuración.
 *
 * El mensaje de GitHub se añade al final cuando lo hay, porque a veces dice
 * exactamente qué falta y traducirlo sería perder información.
 */
function fallo_al_guardar(array $r, string $que) {
    $codigo = (int) ($r['codigo'] ?? 0);
    $detalle = trim((string) ($r['datos']['message'] ?? ''));

    if ($codigo === 409) {
        $mensaje = 'No se guardó: ' . $que . ' cambió en el repositorio mientras lo tenías abierto. '
            . 'Vuelve atrás, entra otra vez y repite el cambio — así ves lo que hay ahora antes de escribir encima.';
    } elseif ($codigo === 401 || $codigo === 403) {
        $mensaje = 'No se guardó: GitHub no aceptó el permiso del panel. El token caducó o perdió acceso al repositorio. '
            . 'Esto no se arregla desde aquí: hay que renovar el secreto PANEL_TOKEN.';
    } elseif ($codigo === 404) {
        $mensaje = 'No se guardó: GitHub no encuentra ' . $que . ' en la rama configurada. Es un problema de configuración del panel.';
    } elseif ($codigo === 422) {
        $mensaje = 'No se guardó: GitHub rechazó el contenido por no ser válido para esa ruta.';
    } elseif ($codigo === 0) {
        $mensaje = 'No se guardó: el servidor no pudo hablar con GitHub. Vuelve a intentarlo en un minuto; si sigue, es la red del hosting.';
    } else {
        $mensaje = 'No se guardó: GitHub respondió ' . $codigo . '.';
    }
    if ($detalle !== '') $mensaje .= ' GitHub dice: «' . $detalle . '».';

    responder(502, ['ok' => false, 'error' => 'github', 'codigo_github' => $codigo, 'mensaje' => $mensaje]);
}

/* Dónde vive el contenido de un esquema, para un idioma dado.
 *
 * Hay tres formas en el sitio y ninguna se puede forzar a las otras:
 *
 *   · industrias  — un array, cada elemento con su bloque es/en dentro
 *   · servicios   — un archivo por idioma, y dentro un mapa por slug
 *   · el método   — un archivo, y dentro un bloque es/en
 *
 * Generalizarlo cuesta veinte líneas. Hacer un caso especial por forma cuesta
 * un módulo nuevo cada vez que aparezca contenido con otra pinta. */
function contenido_archivo(array $esq, string $lang): string {
    $porIdioma = $esq['archivosPorIdioma'] ?? null;
    $ruta = is_array($porIdioma) ? (string) ($porIdioma[$lang] ?? '') : (string) ($esq['archivoDatos'] ?? '');
    return preg_match('#^src/content/[a-z0-9./-]+\.json$#', $ruta) && !str_contains($ruta, '..') ? $ruta : '';
}

/** Los elementos que se pueden elegir, con su nombre para el desplegable. */
function contenido_claves(array $esq, $datos, string $lang): array {
    $raiz = (string) ($esq['raiz'] ?? '');
    $base = $raiz !== '' ? ($datos[$raiz] ?? null) : $datos;
    $etiqueta = (string) ($esq['etiqueta'] ?? '');
    $salida = [];
    if (($esq['forma'] ?? '') === 'mapa' && is_array($base)) {
        /* El mapa puede tener el idioma DENTRO de cada elemento —los programas
           NOW— o fuera, en el nombre del archivo —los casos de uso—. El rótulo
           del desplegable sale de donde toque en cada caso. */
        foreach ($base as $k => $v) {
            $fuente = !empty($esq['porIdiomaDentro']) ? ($v[$lang] ?? $v['es'] ?? []) : $v;
            $salida[] = ['clave' => (string) $k, 'nombre' => (string) ($fuente[$etiqueta] ?? $k)];
        }
    } elseif (!empty($esq['coleccion']) && is_array($base)) {
        foreach ($base as $i => $v) $salida[] = ['clave' => (string) $i, 'nombre' => (string) ($v[$lang][$etiqueta] ?? $v['es'][$etiqueta] ?? ('Elemento ' . ($i + 1)))];
    } else {
        $salida[] = ['clave' => '', 'nombre' => (string) ($esq['titulo'] ?? 'Contenido')];
    }
    return $salida;
}

if ($accion === 'abrir-esquema') {
    $id   = (string) ($cuerpo['esquema'] ?? $_GET['esquema'] ?? '');
    $lang = (string) ($cuerpo['idioma'] ?? $_GET['idioma'] ?? '');
    $esq  = esquema_leer($config, $rama, $id);
    if (!$esq) responder(404, ['ok' => false, 'error' => 'sin_esquema', 'mensaje' => 'Ese esquema no existe.']);
    $idiomas = (array) ($esq['idiomas'] ?? ['es']);
    if (!in_array($lang, $idiomas, true)) $lang = (string) $idiomas[0];

    $ruta = contenido_archivo($esq, $lang);
    if ($ruta === '') responder(500, ['ok' => false, 'error' => 'esquema_roto', 'mensaje' => 'El esquema no apunta a un archivo válido.']);
    $d = github($config, 'contents/' . rawurlencode($ruta) . '?ref=' . rawurlencode($rama));
    if ($d['codigo'] !== 200) responder(404, ['ok' => false, 'error' => 'sin_datos', 'mensaje' => 'El esquema apunta a un archivo que no existe.']);
    $datos = json_decode((string) base64_decode(str_replace("\n", '', (string) ($d['datos']['content'] ?? ''))), true);
    responder(200, ['ok' => true, 'esquema' => $esq, 'datos' => $datos, 'idioma' => $lang,
                    'claves' => contenido_claves($esq, $datos, $lang)]);
}

if ($accion === 'guardar-contenido') {
    $id     = (string) ($cuerpo['esquema'] ?? '');
    $indice = $cuerpo['indice'] ?? null;      // qué elemento de la colección
    $lang   = (string) ($cuerpo['idioma'] ?? '');
    $vals   = $cuerpo['valores'] ?? null;
    $esq    = esquema_leer($config, $rama, $id);
    if (!$esq || !is_array($vals)) {
        responder(400, ['ok' => false, 'error' => 'peticion', 'mensaje' => 'Falta el esquema o los valores.']);
    }
    if (!in_array($lang, (array) ($esq['idiomas'] ?? ['es']), true)) {
        responder(400, ['ok' => false, 'error' => 'idioma', 'mensaje' => 'Ese idioma no está declarado en el esquema.']);
    }

    $ruta = contenido_archivo($esq, $lang);
    if ($ruta === '') responder(500, ['ok' => false, 'error' => 'esquema_roto', 'mensaje' => 'El esquema no apunta a un archivo válido.']);
    $d = github($config, 'contents/' . rawurlencode($ruta) . '?ref=' . rawurlencode($rama));
    if ($d['codigo'] !== 200) responder(404, ['ok' => false, 'error' => 'sin_datos', 'mensaje' => 'No se encontró el archivo de datos.']);
    $datos = json_decode((string) base64_decode(str_replace("\n", '', (string) ($d['datos']['content'] ?? ''))), true);
    if (!is_array($datos)) responder(500, ['ok' => false, 'error' => 'datos_rotos', 'mensaje' => 'El archivo de datos no se pudo leer.']);

    $raiz = (string) ($esq['raiz'] ?? '');
    $base =& $datos;
    if ($raiz !== '') {
        if (!isset($datos[$raiz]) || !is_array($datos[$raiz])) {
            responder(500, ['ok' => false, 'error' => 'datos_rotos', 'mensaje' => 'El archivo no tiene la raíz que el esquema declara.']);
        }
        $base =& $datos[$raiz];
    }
    $clave = (string) ($cuerpo['clave'] ?? $indice ?? '');
    if (($esq['forma'] ?? '') === 'mapa') {
        if (!isset($base[$clave]) || !is_array($base[$clave])) {
            responder(400, ['ok' => false, 'error' => 'clave', 'mensaje' => 'Ese elemento no existe.']);
        }
        if (!empty($esq['porIdiomaDentro'])) {
            if (!isset($base[$clave][$lang]) || !is_array($base[$clave][$lang])) {
                responder(400, ['ok' => false, 'error' => 'idioma', 'mensaje' => 'Ese elemento no tiene ese idioma.']);
            }
            $destino =& $base[$clave][$lang];
        } else {
            $destino =& $base[$clave];
        }
    } elseif (!empty($esq['coleccion'])) {
        $i = (int) $clave;
        if (!isset($base[$i][$lang]) || !is_array($base[$i][$lang])) {
            responder(400, ['ok' => false, 'error' => 'indice', 'mensaje' => 'Ese elemento no existe.']);
        }
        $destino =& $base[$i][$lang];
    } else {
        if (!isset($base[$lang]) || !is_array($base[$lang])) {
            responder(400, ['ok' => false, 'error' => 'idioma', 'mensaje' => 'Ese idioma no está en los datos.']);
        }
        $destino =& $base[$lang];
    }

    $cambiados = 0;
    foreach ($esq['campos'] as $campo) {
        $cid = (string) ($campo['id'] ?? '');
        if ($cid === '' || !array_key_exists($cid, $vals)) continue;
        $tipo = (string) ($campo['tipo'] ?? 'linea');
        $tope = $campo['maximo'] ?? 0;
        $v = $vals[$cid];
        $rotulo = (string) ($campo['rotulo'] ?? $cid);

        $limitar = function ($texto, $max) use ($rotulo) {
            $t = trim((string) $texto);
            if ($max > 0 && mb_strlen($t) > $max) {
                responder(400, ['ok' => false, 'error' => 'largo',
                    'mensaje' => 'En «' . $rotulo . '» hay un texto de ' . mb_strlen($t) . ' caracteres y el máximo es ' . $max . '.']);
            }
            return $t;
        };

        if ($tipo === 'linea' || $tipo === 'parrafo') {
            $nuevo = $limitar($v, (int) $tope);
            if ($nuevo === '' && empty($campo['opcional'])) {
                responder(400, ['ok' => false, 'error' => 'vacio', 'mensaje' => 'El campo «' . $rotulo . '» no puede quedar vacío.']);
            }
        } elseif ($tipo === 'lista') {
            if (!is_array($v)) continue;
            $nuevo = [];
            foreach ($v as $x) { $t = $limitar($x, (int) $tope); if ($t !== '') $nuevo[] = $t; }
        } elseif ($tipo === 'pares' || $tipo === 'trios' || $tipo === 'tupla') {
            if (!is_array($v)) continue;
            /* La anchura la dan las columnas declaradas, no el nombre del tipo.
               Con «pares» y «trios» codificados a dos y tres, un campo de cinco
               columnas obligaba a inventar un tipo nuevo por cada anchura. */
            $columnas = (array) ($campo['columnas'] ?? []);
            $anchura = count($columnas) ?: ($tipo === 'pares' ? 2 : 3);
            $topes = is_array($tope) ? $tope : array_fill(0, $anchura, (int) $tope);
            $nuevo = [];
            foreach ($v as $fila) {
                if (!is_array($fila)) continue;
                $f = [];
                for ($k = 0; $k < $anchura; $k++) $f[] = $limitar($fila[$k] ?? '', (int) ($topes[$k] ?? 0));
                if (implode('', $f) !== '') $nuevo[] = $f;
            }
        } elseif ($tipo === 'bloque') {
            if (!is_array($v)) continue;
            $nuevo = [];
            foreach ((array) ($campo['partes'] ?? []) as $parte) {
                $pid = (string) ($parte['id'] ?? '');
                if ($pid === '') continue;
                $ptipo = (string) ($parte['tipo'] ?? 'linea');
                $ptope = $parte['maximo'] ?? 0;
                /* Un bloque puede llevar listas dentro —«el problema» es un
                   titular más varios párrafos— y sin esto había que inventar un
                   tipo nuevo por cada combinación de bloque y lista. */
                if ($ptipo === 'lista') {
                    $lista = [];
                    foreach ((array) ($v[$pid] ?? []) as $x) { $t = $limitar($x, (int) $ptope); if ($t !== '') $lista[] = $t; }
                    $nuevo[$pid] = $lista;
                } elseif ($ptipo === 'pares' || $ptipo === 'tupla') {
                    $cols = (array) ($parte['columnas'] ?? []);
                    $ancho = count($cols) ?: 2;
                    $topes = is_array($ptope) ? $ptope : array_fill(0, $ancho, (int) $ptope);
                    $lista = [];
                    foreach ((array) ($v[$pid] ?? []) as $fila) {
                        if (!is_array($fila)) continue;
                        $f = [];
                        for ($k = 0; $k < $ancho; $k++) $f[] = $limitar($fila[$k] ?? '', (int) ($topes[$k] ?? 0));
                        if (implode('', $f) !== '') $lista[] = $f;
                    }
                    $nuevo[$pid] = $lista;
                } else {
                    $nuevo[$pid] = $limitar($v[$pid] ?? '', (int) $ptope);
                }
            }
            if (json_encode($nuevo) === json_encode(array_fill_keys(array_keys($nuevo), '')) ) $nuevo = null;
        } else {
            continue;
        }

        $antes = $destino[$cid] ?? null;
        if (json_encode($antes) !== json_encode($nuevo)) $cambiados++;
        if ($nuevo === null) unset($destino[$cid]); else $destino[$cid] = $nuevo;
    }

    if ($cambiados === 0) responder(200, ['ok' => true, 'sin_cambios' => true]);

    $json = json_encode($datos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n";
    $r = github($config, 'contents/' . rawurlencode($ruta), 'PUT', [
        'message' => ($esq['titulo'] ?? $id) . ' editado desde el panel (' . $lang . ')',
        'content' => base64_encode($json),
        'sha'     => $d['datos']['sha'] ?? '',
        'branch'  => $rama,
    ]);
    if ($r['codigo'] < 200 || $r['codigo'] >= 300) {
        fallo_al_guardar($r, 'este contenido');
    }
    responder(200, ['ok' => true, 'cambiados' => $cambiados]);
}

/* ---- Las páginas del sitio ------------------------------------------------
 *
 * Editar los textos del sitio, no solo los artículos. Se apoya en la misma
 * validación de nombre que todo lo demás —solo `algo.json`, sin barras ni
 * puntos dobles— así que este token no puede escribir fuera de esa carpeta por
 * mucho que se le pida.
 *
 * Y guarda con una comprobación propia: solo se aceptan los campos que la
 * página YA declara, y solo su texto. Nadie puede añadir un campo nuevo desde
 * el navegador ni cambiar el rótulo, la ayuda o el límite: eso son decisiones
 * de diseño y viven en el repositorio. Sin esta regla, el panel sería una
 * forma de escribir JSON arbitrario dentro del sitio, que es exactamente lo
 * que este archivo existe para impedir.
 */
/* Dos carpetas con la misma forma —páginas del sitio y conocimiento— y una
   sola pareja de acciones. La carpeta llega del navegador, así que se elige de
   una lista cerrada: fuera de estas dos no hay nada que escribir. */
function carpeta_declarada(string $c): string {
    return ['paginas' => RUTA_PAGINAS, 'conocimiento' => RUTA_CONOCIMIENTO][$c] ?? '';
}

if ($accion === 'listar-paginas') {
    $carpeta = carpeta_declarada((string) ($cuerpo['carpeta'] ?? $_GET['carpeta'] ?? 'paginas'));
    if ($carpeta === '') responder(400, ['ok' => false, 'error' => 'carpeta', 'mensaje' => 'Esa carpeta no existe.']);
    $r = github($config, 'contents/' . rawurlencode($carpeta) . '?ref=' . rawurlencode($rama));
    if ($r['codigo'] === 404) {
        responder(200, ['ok' => true, 'paginas' => [],
            'vacio_en' => $carpeta . ' @ ' . $config['repo'] . ':' . $rama]);
    }
    if ($r['codigo'] !== 200 || !is_array($r['datos'])) {
        responder(502, ['ok' => false, 'error' => 'github', 'mensaje' => 'No se pudieron listar las páginas.']);
    }
    $paginas = [];
    foreach ($r['datos'] as $e) {
        if (($e['type'] ?? '') !== 'file' || !archivo_valido((string) $e['name'])) continue;
        $f = github($config, 'contents/' . rawurlencode($carpeta . '/' . $e['name']) . '?ref=' . rawurlencode($rama));
        if ($f['codigo'] !== 200) continue;
        $datos = json_decode((string) base64_decode(str_replace("\n", '', (string) ($f['datos']['content'] ?? ''))), true);
        if (!is_array($datos)) continue;
        $datos['_archivo'] = $e['name'];
        $datos['_sha'] = $f['datos']['sha'] ?? '';
        $paginas[] = $datos;
    }
    responder(200, ['ok' => true, 'paginas' => $paginas]);
}

if ($accion === 'guardar-pagina') {
    $carpeta = carpeta_declarada((string) ($cuerpo['carpeta'] ?? 'paginas'));
    if ($carpeta === '') responder(400, ['ok' => false, 'error' => 'carpeta', 'mensaje' => 'Esa carpeta no existe.']);
    $archivo = (string) ($cuerpo['archivo'] ?? '');
    $valores = $cuerpo['valores'] ?? null;
    if (!archivo_valido($archivo) || !is_array($valores)) {
        responder(400, ['ok' => false, 'error' => 'peticion', 'mensaje' => 'Falta el archivo de la página o los valores.']);
    }

    $f = github($config, 'contents/' . rawurlencode($carpeta . '/' . $archivo) . '?ref=' . rawurlencode($rama));
    if ($f['codigo'] !== 200) {
        responder(404, ['ok' => false, 'error' => 'no_existe', 'mensaje' => 'Esa página no existe en el repositorio.']);
    }
    $pagina = json_decode((string) base64_decode(str_replace("\n", '', (string) ($f['datos']['content'] ?? ''))), true);
    if (!is_array($pagina) || !isset($pagina['campos']) || !is_array($pagina['campos'])) {
        responder(500, ['ok' => false, 'error' => 'pagina_rota', 'mensaje' => 'La página guardada no tiene la forma esperada.']);
    }

    /* Solo el texto de los campos que ya existen, y respetando su límite. */
    $cambiados = 0;
    foreach ($pagina['campos'] as $i => $campo) {
        $id = (string) ($campo['id'] ?? '');
        if ($id === '' || !array_key_exists($id, $valores)) continue;
        $rotulo = (string) ($campo['rotulo'] ?? $id);
        $tipo = (string) ($campo['tipo'] ?? 'linea');
        $tope = $campo['maximo'] ?? 0;
        $v = $valores[$id];

        $limitar = function ($texto, $max) use ($rotulo) {
            $t = trim((string) $texto);
            if ($max > 0 && mb_strlen($t) > $max) {
                responder(400, ['ok' => false, 'error' => 'demasiado_largo',
                    'mensaje' => 'En «' . $rotulo . '» hay un texto de ' . mb_strlen($t) . ' caracteres y el máximo es ' . $max . '.']);
            }
            return $t;
        };

        /* Los documentos de conocimiento llevan listas y tablas, no solo
           líneas. Y aquí un campo vacío SÍ se acepta: el conocimiento se
           rellena poco a poco y obligar a completarlo de una vez sería
           obligar a inventarlo. */
        if ($tipo === 'lista') {
            $nuevo = [];
            foreach ((array) $v as $x) { $t = $limitar($x, (int) $tope); if ($t !== '') $nuevo[] = $t; }
        } elseif ($tipo === 'pares' || $tipo === 'trios' || $tipo === 'tupla') {
            $cols = (array) ($campo['columnas'] ?? []);
            $ancho = count($cols) ?: ($tipo === 'trios' ? 3 : 2);
            $topes = is_array($tope) ? $tope : array_fill(0, $ancho, (int) $tope);
            $nuevo = [];
            foreach ((array) $v as $fila) {
                if (!is_array($fila)) continue;
                $f = [];
                for ($k = 0; $k < $ancho; $k++) $f[] = $limitar($fila[$k] ?? '', (int) ($topes[$k] ?? 0));
                if (implode('', $f) !== '') $nuevo[] = $f;
            }
        } else {
            $nuevo = $limitar($v, (int) $tope);
            if ($nuevo === '' && empty($campo['opcional']) && ($carpeta === RUTA_PAGINAS)) {
                responder(400, ['ok' => false, 'error' => 'vacio',
                    'mensaje' => 'El campo «' . $rotulo . '» no puede quedar vacío.']);
            }
        }
        if (json_encode($nuevo) !== json_encode($campo['valor'] ?? null)) $cambiados++;
        $pagina['campos'][$i]['valor'] = $nuevo;
    }
    if ($cambiados === 0) {
        responder(200, ['ok' => true, 'sin_cambios' => true]);
    }

    unset($pagina['_archivo'], $pagina['_sha']);
    $json = json_encode($pagina, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n";
    $r = github($config, 'contents/' . rawurlencode($carpeta . '/' . $archivo), 'PUT', [
        'message' => 'Página «' . ($pagina['titulo'] ?? $archivo) . '» editada desde el panel',
        'content' => base64_encode($json),
        'sha'     => $f['datos']['sha'] ?? '',
        'branch'  => $rama,
    ]);
    if ($r['codigo'] < 200 || $r['codigo'] >= 300) {
        fallo_al_guardar($r, 'esta página');
    }
    responder(200, ['ok' => true, 'cambiados' => $cambiados]);
}

if ($accion === 'listar') {
    $r = github($config, 'contents/' . rawurlencode(RUTA_ARTICULOS) . '?ref=' . rawurlencode($rama));
    /* Un 404 significa que el directorio todavía no existe, y eso es normal:
       nace con el primero que se guarde. Pero también es lo que devuelve una
       ruta mal construida, y durante un tiempo lo fue: a esta llamada le
       faltaba el «contents/» de la API, así que GitHub respondía 404 y el
       panel enseñaba «todavía no hay nada» con el repositorio lleno.
       Por eso ahora se dice DÓNDE se miró. Una lista vacía que no explica de
       dónde sale no se puede distinguir de una avería. */
    if ($r['codigo'] === 404) {
        responder(200, ['ok' => true, 'articulos' => [],
            'vacio_en' => RUTA_ARTICULOS . ' @ ' . $config['repo'] . ':' . $rama]);
    }
    if ($r['codigo'] >= 400) {
        responder(502, ['ok' => false, 'error' => 'github', 'mensaje' => $r['datos']['message'] ?? "GitHub respondió {$r['codigo']}."]);
    }

    $salida = [];
    foreach ($r['datos'] as $e) {
        if (($e['type'] ?? '') !== 'file' || !str_ends_with((string) $e['name'], '.json')) continue;
        $f = github($config, 'contents/' . rawurlencode(RUTA_ARTICULOS . '/' . $e['name']) . '?ref=' . rawurlencode($rama));
        if ($f['codigo'] >= 400) continue;
        $salida[] = [
            'archivo'  => $e['name'],
            'sha'      => $f['datos']['sha'] ?? null,
            'articulo' => json_decode((string) base64_decode(str_replace("\n", '', (string) $f['datos']['content']), true), true),
        ];
    }
    responder(200, ['ok' => true, 'articulos' => $salida]);
}

if ($accion === 'guardar') {
    $archivo  = (string) ($cuerpo['archivo'] ?? '');
    $articulo = $cuerpo['articulo'] ?? null;
    if (!archivo_valido($archivo) || !is_array($articulo)) {
        responder(400, ['ok' => false, 'error' => 'datos', 'mensaje' => 'El nombre del archivo o el artículo no son válidos.']);
    }
    $r = github($config, 'contents/' . rawurlencode(RUTA_ARTICULOS . '/' . $archivo), 'PUT', [
        'message' => sprintf('%s (desde el panel, por %s)', (string) ($cuerpo['mensaje'] ?? 'Actualizar artículo'), $nombre),
        'content' => base64_encode(json_encode($articulo, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n"),
        'branch'  => $rama,
        ...(!empty($cuerpo['sha']) ? ['sha' => (string) $cuerpo['sha']] : []),
    ]);
    if ($r['codigo'] === 409 || $r['codigo'] === 422) {
        responder(409, ['ok' => false, 'error' => 'conflicto',
            'mensaje' => 'Alguien modificó este artículo mientras lo editabas. Vuelve al listado, ábrelo de nuevo y repite el cambio.']);
    }
    if ($r['codigo'] >= 400) {
        responder(502, ['ok' => false, 'error' => 'github', 'mensaje' => $r['datos']['message'] ?? "GitHub respondió {$r['codigo']}."]);
    }
    responder(200, ['ok' => true, 'sha' => $r['datos']['content']['sha'] ?? null]);
}

if ($accion === 'borrar') {
    $archivo = (string) ($cuerpo['archivo'] ?? '');
    $sha     = (string) ($cuerpo['sha'] ?? '');
    if (!archivo_valido($archivo) || $sha === '') {
        responder(400, ['ok' => false, 'error' => 'datos']);
    }
    $r = github($config, 'contents/' . rawurlencode(RUTA_ARTICULOS . '/' . $archivo), 'DELETE', [
        'message' => sprintf('Retirar artículo %s (desde el panel, por %s)', $archivo, $nombre),
        'sha'     => $sha,
        'branch'  => $rama,
    ]);
    if ($r['codigo'] >= 400) {
        responder(502, ['ok' => false, 'error' => 'github', 'mensaje' => $r['datos']['message'] ?? "GitHub respondió {$r['codigo']}."]);
    }
    responder(200, ['ok' => true]);
}


/* ------------------------------------------------------------- autores */

/** Un identificador de autor: minúsculas, números y guiones. Nada más. */
function autor_valido(string $id): bool {
    return (bool) preg_match('/^[a-z0-9]+(-[a-z0-9]+)*$/', $id) && strlen($id) <= 80;
}

if ($accion === 'listar-autores') {
    $r = github($config, 'contents/' . rawurlencode(RUTA_AUTORES) . '?ref=' . rawurlencode($rama));
    if ($r['codigo'] === 404) {
        responder(200, ['ok' => true, 'autores' => [],
            'vacio_en' => RUTA_AUTORES . ' @ ' . $config['repo'] . ':' . $rama]);
    }
    if ($r['codigo'] >= 400) {
        responder(502, ['ok' => false, 'error' => 'github', 'mensaje' => $r['datos']['message'] ?? "GitHub respondió {$r['codigo']}."]);
    }
    $salida = [];
    foreach ($r['datos'] as $e) {
        if (($e['type'] ?? '') !== 'file' || !str_ends_with((string) $e['name'], '.json')) continue;
        $f = github($config, 'contents/' . rawurlencode(RUTA_AUTORES . '/' . $e['name']) . '?ref=' . rawurlencode($rama));
        if ($f['codigo'] >= 400) continue;
        $salida[] = [
            'archivo' => $e['name'],
            'sha'     => $f['datos']['sha'] ?? null,
            'ficha'   => json_decode((string) base64_decode(str_replace("\n", '', (string) $f['datos']['content']), true), true),
        ];
    }
    responder(200, ['ok' => true, 'autores' => $salida]);
}

if ($accion === 'guardar-autor') {
    $ficha = $cuerpo['ficha'] ?? null;
    $id    = is_array($ficha) ? (string) ($ficha['id'] ?? '') : '';
    if (!is_array($ficha) || !autor_valido($id) || empty($ficha['nombre'])) {
        responder(400, ['ok' => false, 'error' => 'datos', 'mensaje' => 'La ficha necesita un identificador válido y un nombre.']);
    }
    $r = github($config, 'contents/' . rawurlencode(RUTA_AUTORES . '/' . $id . '.json'), 'PUT', [
        'message' => sprintf('Ficha de autor: %s (desde el panel, por %s)', $ficha['nombre'], $nombre),
        'content' => base64_encode(json_encode($ficha, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n"),
        'branch'  => $rama,
        ...(!empty($cuerpo['sha']) ? ['sha' => (string) $cuerpo['sha']] : []),
    ]);
    if ($r['codigo'] === 409 || $r['codigo'] === 422) {
        responder(409, ['ok' => false, 'error' => 'conflicto', 'mensaje' => 'Alguien modificó esta ficha mientras la editabas. Recárgala y repite el cambio.']);
    }
    if ($r['codigo'] >= 400) {
        responder(502, ['ok' => false, 'error' => 'github', 'mensaje' => $r['datos']['message'] ?? "GitHub respondió {$r['codigo']}."]);
    }
    /* «Firma los artículos automáticos» solo puede estar en una ficha. Se
       aplica aquí y no en el navegador porque el navegador solo ve la ficha
       abierta: marcarla en dos pestañas distintas dejaría dos marcadas, y el
       trabajo diario acabaría firmando con la que saliera primero al leer el
       directorio. Que es una forma silenciosa de firmar con quien no toca. */
    if (!empty($ficha['predeterminado'])) {
        $otros = github($config, 'contents/' . rawurlencode(RUTA_AUTORES) . '?ref=' . rawurlencode($rama));
        foreach (($otros['codigo'] < 400 ? $otros['datos'] : []) as $e) {
            $arch = (string) ($e['name'] ?? '');
            if (($e['type'] ?? '') !== 'file' || $arch === $id . '.json' || !str_ends_with($arch, '.json')) continue;

            $f = github($config, 'contents/' . rawurlencode(RUTA_AUTORES . '/' . $arch) . '?ref=' . rawurlencode($rama));
            if ($f['codigo'] >= 400) continue;
            $otra = json_decode((string) base64_decode(str_replace("\n", '', (string) $f['datos']['content']), true), true);
            if (!is_array($otra) || empty($otra['predeterminado'])) continue;

            $otra['predeterminado'] = false;
            github($config, 'contents/' . rawurlencode(RUTA_AUTORES . '/' . $arch), 'PUT', [
                'message' => sprintf('%s deja de firmar los artículos automáticos (desde el panel, por %s)', $otra['nombre'] ?? $arch, $nombre),
                'content' => base64_encode(json_encode($otra, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n"),
                'branch'  => $rama,
                'sha'     => $f['datos']['sha'],
            ]);
        }
    }

    responder(200, ['ok' => true, 'sha' => $r['datos']['content']['sha'] ?? null]);
}

if ($accion === 'subir-foto') {
    $id   = (string) ($cuerpo['id'] ?? '');
    $dato = (string) ($cuerpo['datos'] ?? '');
    if (!autor_valido($id)) responder(400, ['ok' => false, 'error' => 'datos', 'mensaje' => 'Identificador de autor no válido.']);

    /* Llega como data URL desde el navegador. Se separa la cabecera y se
       decodifica en estricto: un base64 con basura dentro no se acepta a
       medias, se rechaza. */
    $bruto = base64_decode(preg_replace('#^data:[^;]+;base64,#', '', $dato), true);
    if ($bruto === false || $bruto === '') {
        responder(400, ['ok' => false, 'error' => 'datos', 'mensaje' => 'La imagen no se pudo leer.']);
    }
    if (strlen($bruto) > FOTO_MAX_BYTES) {
        responder(413, ['ok' => false, 'error' => 'grande', 'mensaje' => 'La foto pesa más de 3 MB. Redúcela y vuelve a intentarlo.']);
    }

    /* La comprobación que importa: que el archivo SEA una imagen, no que se
       llame como una. Fiarse de la extensión o del tipo que declara el
       navegador es fiarse de quien envía; getimagesizefromstring lee los bytes
       y devuelve false para cualquier cosa que no sea una imagen de verdad. */
    $info = @getimagesizefromstring($bruto);
    $EXT = [IMAGETYPE_WEBP => 'webp', IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png'];
    if ($info === false || !isset($EXT[$info[2]])) {
        responder(400, ['ok' => false, 'error' => 'formato', 'mensaje' => 'Solo se aceptan imágenes WebP, JPEG o PNG.']);
    }
    if ($info[0] < 200 || $info[1] < 200) {
        responder(400, ['ok' => false, 'error' => 'pequena', 'mensaje' => "La foto es de {$info[0]}x{$info[1]} y se ve borrosa. Mínimo 200x200."]);
    }

    /* `variante` distingue el recorte que se publica del original que se
       guarda para poder reencuadrar más tarde. Sin el original, «Recolocar»
       trabaja sobre un cuadrado de 400 px: no hay margen que mover, así que
       los deslizadores se mueven y no cambian nada. Un control que parece
       funcionar y no hace nada es peor que no tenerlo. */
    $variante = ($cuerpo['variante'] ?? 'recorte') === 'original' ? '-original' : '';
    $archivo = $id . $variante . '.' . $EXT[$info[2]];
    $camino  = RUTA_FOTOS . '/' . $archivo;

    /* Si ya había una foto con este nombre hay que mandar su sha, o GitHub
       rechaza la escritura por conflicto. */
    $previo = github($config, 'contents/' . rawurlencode($camino) . '?ref=' . rawurlencode($rama));
    $sha    = $previo['codigo'] === 200 ? ($previo['datos']['sha'] ?? null) : null;

    $r = github($config, 'contents/' . rawurlencode($camino), 'PUT', [
        'message' => sprintf('Foto de %s%s (desde el panel, por %s)', $id, $variante ? ' (original)' : '', $nombre),
        'content' => base64_encode($bruto),
        'branch'  => $rama,
        ...($sha ? ['sha' => $sha] : []),
    ]);
    if ($r['codigo'] >= 400) {
        responder(502, ['ok' => false, 'error' => 'github', 'mensaje' => $r['datos']['message'] ?? "GitHub respondió {$r['codigo']}."]);
    }
    /* La ruta pública, que es distinta de dónde vive el archivo: assets/ es la
       raíz del sitio publicado. */
    /* La ruta pública, que es distinta de dónde vive el archivo: assets/ es la
       raíz del sitio publicado.

       Y lleva una marca de versión. El nombre del archivo no cambia al cambiar
       la foto, y las imágenes se sirven con caché de treinta días: sin esta
       marca, quien cambia su foto sigue viendo la anterior en el panel y en la
       web, y concluye que el cambio no se guardó. */
    responder(200, [
        'ok'     => true,
        'foto'   => '/images/autores/' . $archivo . '?v=' . substr((string) ($r['datos']['content']['sha'] ?? time()), 0, 8),
        'ancho'  => $info[0],
        'alto'   => $info[1],
    ]);
}

/* ----------------------------------------------------------- suscriptores */

/**
 * La lista de correo, solo para mirarla.
 *
 * Existe porque la pregunta «¿se grabó?» no tenía respuesta desde el panel: la
 * única forma de saberlo era abrir phpMyAdmin, y eso convierte una comprobación
 * de cinco segundos en una excursión por el hosting.
 *
 * Solo lectura, a propósito. Dar de baja a alguien desde aquí sería cómodo y
 * también sería la vía más rápida a borrar una dirección por error sin que
 * quede rastro de quién ni por qué. La baja la hace cada persona con su enlace.
 */
if ($accion === 'suscriptores') {
    $datos = @include __DIR__ . '/config-datos.php';
    if (!is_array($datos) || empty($datos['base'])) {
        responder(200, ['ok' => true, 'configurado' => false, 'totales' => [], 'ultimos' => []]);
    }
    try {
        $pdo = new PDO(
            sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $datos['host'] ?? 'localhost', $datos['base']),
            $datos['usuario'], $datos['clave'],
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false]
        );
    } catch (PDOException $e) {
        /* El motivo va tal cual: aquí solo llega quien ya entró al panel, y sin
           el motivo real este error es media hora de adivinar cuál de las
           cuatro credenciales está mal. */
        responder(200, ['ok' => true, 'configurado' => false, 'error' => $e->getMessage(), 'totales' => [], 'ultimos' => []]);
    }

    $totales = [];
    foreach ($pdo->query('SELECT estado, COUNT(*) n FROM suscriptores GROUP BY estado') as $f) {
        $totales[$f['estado']] = (int) $f['n'];
    }
    $ultimos = $pdo->query(
        'SELECT email, estado, idioma, origen, alta_en, confirmado_en
         FROM suscriptores ORDER BY alta_en DESC LIMIT 50'
    )->fetchAll(PDO::FETCH_ASSOC);

    /* Los fallos de envío, que es lo que responde a la pregunta de verdad:
       «se grabó pero no llegó el correo, ¿por qué?». Ese registro está fuera
       del alcance de la web —lo bloquea .htaccess— y hasta ahora solo se podía
       leer entrando por el gestor de archivos del hosting.

       Un registro vacío también dice algo, y algo distinto: significa que el
       servidor de correo aceptó el mensaje, así que no se perdió aquí. Ahí la
       respuesta es la carpeta de spam, no el código. */
    $fallos = [];
    $log = __DIR__ . '/suscripcion.log';
    if (is_readable($log)) {
        $lineas = @file($log, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
        $fallos = array_slice($lineas, -15);
    }

    responder(200, ['ok' => true, 'configurado' => true, 'totales' => $totales, 'ultimos' => $ultimos, 'fallos' => $fallos]);
}

/* ------------------------------------------------- diagnóstico de entrega */

/**
 * Por qué el correo del sitio acaba en spam, respondido desde el servidor.
 *
 * ---- Por qué existe esta pantalla ----
 *
 * Un correo bien escrito, con su Message-ID, su Date, su parte en texto plano y
 * su enlace de baja, sigue yendo a spam si el DOMINIO no está autenticado. Y
 * eso no se ve desde el navegador ni desde el código: son tres registros TXT en
 * el DNS. Sin ellos, Gmail no puede comprobar que el mensaje sale de donde dice
 * salir, y lo que no puede comprobar lo trata como sospechoso.
 *
 * Averiguarlo a mano exige herramientas de línea de comandos que nadie tiene a
 * mano justo cuando hace falta. El servidor sí puede consultarlo, así que lo
 * consulta y lo dice en castellano.
 *
 * ---- Qué comprueba y por qué esos tres ----
 *
 * SPF   dice qué servidores pueden enviar en nombre del dominio.
 * DKIM  firma cada mensaje para que se pueda comprobar que no lo han tocado.
 * DMARC dice qué hacer cuando alguno de los dos falla, y sin él Gmail y Yahoo
 *       rechazan el correo masivo desde 2024.
 *
 * Los tres son necesarios. Con dos de tres, sigue yendo a spam.
 */
if ($accion === 'diagnostico-correo') {
    $dominio = 'meetbecome.com';
    $correoCfg = @include __DIR__ . '/config-correo.php';
    if (is_array($correoCfg) && !empty($correoCfg['user']) && strpos($correoCfg['user'], '@') !== false) {
        $dominio = substr(strrchr($correoCfg['user'], '@'), 1);
    }

    /* dns_get_record puede estar desactivado en hosting compartido. Si lo está,
       se dice, en vez de devolver «no hay registros» —que es la respuesta
       equivocada y la que haría perder una tarde buscando en el sitio que no
       es—. */
    if (!function_exists('dns_get_record')) {
        responder(200, ['ok' => true, 'disponible' => false, 'dominio' => $dominio]);
    }

    $txt = static function (string $nombre): array {
        $r = @dns_get_record($nombre, DNS_TXT);
        if (!is_array($r)) return [];
        $fuera = [];
        foreach ($r as $x) {
            $v = $x['txt'] ?? (isset($x['entries']) ? implode('', $x['entries']) : '');
            if ($v !== '') $fuera[] = $v;
        }
        return $fuera;
    };

    $raiz  = $txt($dominio);
    $dmarc = $txt('_dmarc.' . $dominio);

    $spf = null;
    foreach ($raiz as $v) {
        if (stripos($v, 'v=spf1') === 0) { $spf = $v; break; }
    }

    /* Los selectores que usan de verdad los proveedores de este sitio. No se
       adivina: se prueban los conocidos y se dice cuál respondió. Un DKIM
       existe siempre bajo un selector concreto, así que preguntar «¿hay DKIM?»
       sin selector no tiene respuesta.

       Y se mira TXT **y CNAME**. Hostinger no publica la clave en un TXT: pone
       un CNAME que apunta a un host suyo, y allí vive la clave. Buscando solo
       TXT, esta pantalla habría dicho «falta DKIM» con el DKIM perfectamente
       puesto —que es la peor respuesta posible: manda a arreglar algo que ya
       está bien y deja el problema real sin buscar—. */
    $selectores = ['hostingermail-a', 'hostingermail-b', 'hostingermail-c', 'default', 'mail', 'dkim', 'google', 'selector1', 'selector2', 's1', 's2', 'k1'];
    $dkim = [];
    foreach ($selectores as $sel) {
        $nombre = $sel . '._domainkey.' . $dominio;

        foreach ($txt($nombre) as $x) {
            if (stripos($x, 'v=DKIM1') !== false || stripos($x, 'p=') !== false) {
                $dkim[] = ['selector' => $sel, 'tipo' => 'TXT', 'valor' => substr($x, 0, 56) . '…'];
                continue 2;
            }
        }

        $cn = @dns_get_record($nombre, DNS_CNAME);
        if (is_array($cn)) {
            foreach ($cn as $x) {
                if (!empty($x['target'])) {
                    $dkim[] = ['selector' => $sel, 'tipo' => 'CNAME', 'valor' => $x['target']];
                    continue 2;
                }
            }
        }
    }

    $politicaDmarc = null;
    foreach ($dmarc as $v) {
        if (stripos($v, 'v=DMARC1') === 0) { $politicaDmarc = $v; break; }
    }
    /* Un DMARC sin `rua` es válido, pero es un DMARC ciego: la política se
       aplica y los informes que dirían si algo está fallando no llegan a
       ninguna parte. Se avisa aparte, sin marcarlo como que falta. */
    $dmarcSinInformes = $politicaDmarc !== null && stripos($politicaDmarc, 'rua=') === false;

    $mx = @dns_get_record($dominio, DNS_MX) ?: [];
    usort($mx, static fn($a, $b) => ($a['pri'] ?? 0) <=> ($b['pri'] ?? 0));

    responder(200, [
        'ok' => true,
        'disponible' => true,
        'dominio' => $dominio,
        'remitente' => is_array($correoCfg) ? ($correoCfg['user'] ?? null) : null,
        'spf' => $spf,
        'dkim' => $dkim,
        'dmarc' => $politicaDmarc,
        'dmarcSinInformes' => $dmarcSinInformes,
        'mx' => array_map(static fn($x) => ($x['target'] ?? '') . ' (' . ($x['pri'] ?? '?') . ')', $mx),
        'selectoresProbados' => $selectores,
    ]);
}

responder(400, ['ok' => false, 'error' => 'accion_desconocida']);
