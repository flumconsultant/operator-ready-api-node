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
 * dentro de src/content/insights.
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

responder(400, ['ok' => false, 'error' => 'accion_desconocida']);
