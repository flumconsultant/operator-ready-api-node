<?php
/**
 * Registro del observatorio de reputación (BCP): guarda lo que capturan Apify
 * y las consultas GEO ya clasificadas por Claude, y responde el resumen que
 * arma el correo diario. Lo llama n8n, nunca un navegador.
 *
 * ---- Por qué un endpoint HTTP y no una conexión MySQL directa desde n8n ----
 *
 * El resto del sitio ya resuelve esto así (suscripcion.php, panel.php):
 * el hosting compartido no promete que un MySQL remoto acepte conexiones
 * desde fuera, y n8n vive fuera. Este archivo corre en el mismo servidor que
 * la base de datos y expone solo las dos acciones que n8n necesita, con el
 * mismo patrón de testigo que ya usa «difundir» en suscripcion.php.
 *
 * ---- Por qué la tabla se crea sola ----
 *
 * Igual que en suscripcion.php: un paso manual menos que puede salir mal, y
 * es idempotente.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function salir(int $code, array $datos): never {
    http_response_code($code);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

$datosCfg = @include __DIR__ . '/config-datos.php';
if (!is_array($datosCfg) || empty($datosCfg['base'])) {
    salir(500, ['ok' => false, 'error' => 'sin_config',
        'mensaje' => 'El servidor no tiene configurada la base de datos todavía.']);
}
if (empty($datosCfg['monitoreo'])) {
    salir(500, ['ok' => false, 'error' => 'sin_testigo',
        'mensaje' => 'Falta desplegar con el secreto MONITOREO_TOKEN.']);
}

/* ------------------------------------------------------------ base de datos */

function bd(array $c): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;
    $pdo = new PDO(
        sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $c['host'], $c['base']),
        $c['usuario'], $c['clave'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false]
    );
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS monitoreo_menciones (
            id INT AUTO_INCREMENT PRIMARY KEY,
            fuente ENUM("social","prensa","resena","geo") NOT NULL,
            plataforma VARCHAR(60) NOT NULL,
            marca VARCHAR(120) NOT NULL,
            tipo VARCHAR(30) NOT NULL DEFAULT "mencion",
            texto MEDIUMTEXT NOT NULL,
            url VARCHAR(500) DEFAULT NULL,
            autor VARCHAR(160) DEFAULT NULL,
            prompt TEXT DEFAULT NULL,
            sentimiento ENUM("positivo","neutro","negativo","negativo_critico") NOT NULL DEFAULT "neutro",
            categoria VARCHAR(80) DEFAULT NULL,
            score DECIMAL(4,2) DEFAULT NULL,
            menciona_marca TINYINT(1) DEFAULT NULL,
            alerta_urgente TINYINT(1) NOT NULL DEFAULT 0,
            motivo_alerta VARCHAR(160) DEFAULT NULL,
            detalle_geo JSON DEFAULT NULL,
            dedupe_hash CHAR(64) NOT NULL,
            capturado_en DATETIME NOT NULL,
            UNIQUE KEY dedupe (dedupe_hash),
            KEY por_fecha (capturado_en),
            KEY por_sentimiento (sentimiento),
            KEY por_alerta (alerta_urgente, capturado_en),
            KEY por_prompt_geo (fuente, plataforma, prompt(191))
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );
    return $pdo;
}

/* --------------------------------------------------------------- peticiones */

$metodo = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$cuerpo = [];
if ($metodo === 'POST') {
    $crudo = file_get_contents('php://input') ?: '';
    if (strlen($crudo) > 5_000_000) salir(413, ['ok' => false, 'error' => 'demasiado_grande']);
    $cuerpo = json_decode($crudo, true) ?: [];
}
$accion = (string) ($cuerpo['accion'] ?? $_GET['accion'] ?? '');
/* n8n manda el testigo por cabecera, con una credencial HTTP Header Auth: así
   no queda en texto plano dentro del cuerpo o la URL de cada nodo del
   workflow. El body/query siguen aceptados para probar el endpoint a mano. */
$token = (string) ($_SERVER['HTTP_X_MONITOREO_TOKEN'] ?? $cuerpo['token'] ?? $_GET['token'] ?? '');

if (!hash_equals((string) $datosCfg['monitoreo'], $token)) {
    salir(403, ['ok' => false, 'error' => 'testigo']);
}

/* ------------------------------------------------------------------ guardar */

/**
 * Un lote de menciones u observaciones GEO, ya clasificadas. Cada fila trae
 * su sentimiento y su categoría puestos por Claude; este endpoint solo
 * guarda y deduplica, no interpreta nada.
 */
if ($accion === 'guardar') {
    if ($metodo !== 'POST') salir(405, ['ok' => false, 'error' => 'metodo']);

    $items = $cuerpo['items'] ?? null;
    if (!is_array($items) || count($items) === 0) {
        salir(400, ['ok' => false, 'error' => 'sin_items']);
    }

    $pdo = bd($datosCfg);
    $ins = $pdo->prepare(
        'INSERT IGNORE INTO monitoreo_menciones
            (fuente, plataforma, marca, tipo, texto, url, autor, prompt,
             sentimiento, categoria, score, menciona_marca, alerta_urgente,
             motivo_alerta, detalle_geo, dedupe_hash, capturado_en)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())'
    );

    $insertados = 0;
    $vistos = 0;
    foreach ($items as $it) {
        if (!is_array($it)) continue;
        $vistos++;

        $fuente = (string) ($it['fuente'] ?? '');
        if (!in_array($fuente, ['social', 'prensa', 'resena', 'geo'], true)) continue;
        $plataforma = substr((string) ($it['plataforma'] ?? ''), 0, 60);
        $marca      = substr((string) ($it['marca'] ?? ''), 0, 120);
        $texto      = (string) ($it['texto'] ?? '');
        if ($plataforma === '' || $marca === '' || $texto === '') continue;

        $url         = $it['url']    !== null && $it['url']    !== '' ? substr((string) $it['url'], 0, 500) : null;
        $autor       = $it['autor']  !== null && $it['autor']  !== '' ? substr((string) $it['autor'], 0, 160) : null;
        $prompt      = $it['prompt'] !== null && $it['prompt'] !== '' ? (string) $it['prompt'] : null;
        $sentimiento = in_array($it['sentimiento'] ?? '', ['positivo', 'neutro', 'negativo', 'negativo_critico'], true)
            ? $it['sentimiento'] : 'neutro';
        $categoria   = $it['categoria'] !== null && $it['categoria'] !== '' ? substr((string) $it['categoria'], 0, 80) : null;
        $score       = is_numeric($it['score'] ?? null) ? round((float) $it['score'], 2) : null;
        $mencionaMarca = array_key_exists('menciona_marca', $it) ? (int) (bool) $it['menciona_marca'] : null;
        $alertaUrgente = !empty($it['alerta_urgente']) ? 1 : 0;
        $motivoAlerta  = $it['motivo_alerta'] !== null && $it['motivo_alerta'] !== '' ? substr((string) $it['motivo_alerta'], 0, 160) : null;
        $tipo = in_array($it['tipo'] ?? '', ['mencion', 'geo-prompt'], true) ? $it['tipo'] : ($fuente === 'geo' ? 'geo-prompt' : 'mencion');
        /* Solo lo llena el agente GEO: postura frente a la marca, competidores
           que salieron en la misma respuesta, si el asistente dijo algo
           factualmente incorrecto. El agente de menciones no lo usa. */
        $detalleGeo = null;
        if (isset($it['detalle_geo']) && is_array($it['detalle_geo'])) {
            $detalleGeo = json_encode($it['detalle_geo'], JSON_UNESCAPED_UNICODE);
        }

        /* Misma fuente + misma plataforma + misma URL (o, si no hay URL, el
           mismo texto) es la misma observación, aunque Apify o el GEO la
           traigan de nuevo en la corrida siguiente. */
        $hash = hash('sha256', $fuente . '|' . $plataforma . '|' . ($url ?? substr($texto, 0, 500)));

        $ok = $ins->execute([
            $fuente, $plataforma, $marca, $tipo, $texto, $url, $autor, $prompt,
            $sentimiento, $categoria, $score, $mencionaMarca, $alertaUrgente,
            $motivoAlerta, $detalleGeo, $hash,
        ]);
        if ($ok && $ins->rowCount() > 0) $insertados++;
    }

    salir(200, ['ok' => true, 'recibidos' => $vistos, 'insertados' => $insertados, 'duplicados' => $vistos - $insertados]);
}

/* ------------------------------------------------------------------ resumen */

/**
 * Lo que arma el correo diario y, si hace falta, la alerta urgente: conteos
 * de la ventana pedida y la lista de lo marcado como urgente sin resolver.
 */
if ($accion === 'resumen') {
    $dias = max(1, min(30, (int) ($cuerpo['dias'] ?? $_GET['dias'] ?? 1)));
    $pdo = bd($datosCfg);

    $total = $pdo->prepare('SELECT COUNT(*) FROM monitoreo_menciones WHERE capturado_en >= NOW() - INTERVAL ? DAY');
    $total->execute([$dias]);

    $porSentimiento = $pdo->prepare(
        'SELECT sentimiento, COUNT(*) AS n FROM monitoreo_menciones
         WHERE capturado_en >= NOW() - INTERVAL ? DAY GROUP BY sentimiento'
    );
    $porSentimiento->execute([$dias]);

    $porFuente = $pdo->prepare(
        'SELECT fuente, COUNT(*) AS n FROM monitoreo_menciones
         WHERE capturado_en >= NOW() - INTERVAL ? DAY GROUP BY fuente'
    );
    $porFuente->execute([$dias]);

    $porCategoria = $pdo->prepare(
        'SELECT categoria, COUNT(*) AS n FROM monitoreo_menciones
         WHERE capturado_en >= NOW() - INTERVAL ? DAY AND categoria IS NOT NULL
         GROUP BY categoria ORDER BY n DESC LIMIT 8'
    );
    $porCategoria->execute([$dias]);

    $urgentes = $pdo->prepare(
        'SELECT fuente, plataforma, marca, texto, url, categoria, motivo_alerta, capturado_en
         FROM monitoreo_menciones
         WHERE alerta_urgente = 1 AND capturado_en >= NOW() - INTERVAL ? DAY
         ORDER BY capturado_en DESC LIMIT 50'
    );
    $urgentes->execute([$dias]);

    salir(200, [
        'ok' => true,
        'dias' => $dias,
        'total' => (int) $total->fetchColumn(),
        'por_sentimiento' => $porSentimiento->fetchAll(PDO::FETCH_KEY_PAIR),
        'por_fuente' => $porFuente->fetchAll(PDO::FETCH_KEY_PAIR),
        'por_categoria' => $porCategoria->fetchAll(PDO::FETCH_ASSOC),
        'urgentes' => $urgentes->fetchAll(PDO::FETCH_ASSOC),
    ]);
}

/* ---------------------------------------------------------------- ultimo_geo */

/**
 * La última respuesta guardada para este mismo motor+prompt de GEO, antes de
 * la corrida de hoy. Es lo que usa el Agente GEO para notar si un asistente
 * cambió de opinión sobre la marca de una corrida a la siguiente.
 */
if ($accion === 'ultimo_geo') {
    $motor  = substr((string) ($cuerpo['motor']  ?? $_GET['motor']  ?? ''), 0, 60);
    $prompt = (string) ($cuerpo['prompt'] ?? $_GET['prompt'] ?? '');
    if ($motor === '' || $prompt === '') {
        salir(400, ['ok' => false, 'error' => 'faltan_datos']);
    }

    $pdo = bd($datosCfg);
    $fila = $pdo->prepare(
        'SELECT texto, sentimiento, menciona_marca, detalle_geo, capturado_en
         FROM monitoreo_menciones
         WHERE fuente = "geo" AND plataforma = ? AND prompt = ?
         ORDER BY capturado_en DESC LIMIT 1'
    );
    $fila->execute([$motor, $prompt]);
    $anterior = $fila->fetch(PDO::FETCH_ASSOC);

    salir(200, ['ok' => true, 'hay_anterior' => (bool) $anterior, 'anterior' => $anterior ?: null]);
}

salir(404, ['ok' => false, 'error' => 'accion_desconocida']);
