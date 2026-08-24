<?php
/**
 * Altas, confirmaciones y bajas de la lista de correo.
 *
 * ---- Doble confirmación, y no es opcional ----
 *
 * Un alta no da de alta a nadie: crea un registro «pendiente» y manda un correo
 * con un enlace. Hasta que ese enlace se pulsa, esa dirección no recibe nada.
 *
 * Cuesta una conversión y compra tres cosas. Primero, que cualquiera pueda
 * escribir la dirección de otro y suscribirlo sin su permiso deja de ser
 * posible. Segundo, las direcciones con una errata mueren en pendiente en vez
 * de acumular rebotes, y el porcentaje de rebotes es lo que decide si los
 * envíos futuros llegan a la bandeja o al spam. Y tercero, es lo que exige el
 * RGPD y lo que pide el habeas data colombiano: consentimiento demostrable.
 *
 * ---- Dónde viven los datos ----
 *
 * En MySQL, no en un archivo del repositorio. El repositorio es público: una
 * lista de direcciones de correo ahí dentro es una filtración, y una que no se
 * arregla borrando el archivo porque el historial de git la conserva.
 */

declare(strict_types=1);

require __DIR__ . '/correo.php';

const LIMITE_ALTAS   = 5;     // altas por IP...
const LIMITE_SEGS    = 3600;  // ...y hora

function salir(int $code, array $datos): never {
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: no-store');
    http_response_code($code);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

/** Manda a una página del sitio en vez de enseñar un JSON a una persona. */
function irA(string $ruta): never {
    header('Location: ' . $ruta, true, 302);
    exit;
}

function registrar(string $linea): void {
    @file_put_contents(__DIR__ . '/suscripcion.log',
        sprintf("[%s] %s\n", gmdate('Y-m-d H:i:s'), $linea), FILE_APPEND | LOCK_EX);
}

$correoCfg = @include __DIR__ . '/config.php';
$datosCfg  = @include __DIR__ . '/config-datos.php';
if (!is_array($datosCfg) || empty($datosCfg['base'])) {
    salir(500, ['ok' => false, 'error' => 'sin_config',
        'mensaje' => 'La lista de correo no está configurada todavía.']);
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
    /* La tabla se crea sola la primera vez. Un paso manual menos que puede
       salir mal, y es idempotente. */
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS suscriptores (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            idioma CHAR(2) NOT NULL DEFAULT "es",
            estado ENUM("pendiente","confirmado","baja") NOT NULL DEFAULT "pendiente",
            token CHAR(64) NOT NULL,
            origen VARCHAR(60) DEFAULT NULL,
            alta_en DATETIME NOT NULL,
            confirmado_en DATETIME DEFAULT NULL,
            baja_en DATETIME DEFAULT NULL,
            UNIQUE KEY email_unico (email),
            KEY por_estado (estado)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );
    return $pdo;
}

/* ------------------------------------------------------------------ textos */

$T = [
  'es' => [
    'asunto'  => 'Confirma tu suscripción a BECOME Insights',
    'saludo'  => 'Has pedido recibir los artículos de BECOME Insights.',
    'pulsa'   => 'Confirma que eres tú:',
    'boton'   => 'Confirmar suscripción',
    'ignora'  => 'Si no has sido tú, ignora este correo. Sin confirmar, esta dirección no recibirá nada.',
  ],
  'en' => [
    'asunto'  => 'Confirm your BECOME Insights subscription',
    'saludo'  => 'You asked to receive BECOME Insights articles.',
    'pulsa'   => 'Confirm it is you:',
    'boton'   => 'Confirm subscription',
    'ignora'  => 'If this was not you, ignore this email. Without confirming, this address receives nothing.',
  ],
];

$SITIO = 'https://meetbecome.com';

/* --------------------------------------------------------------- peticiones */

$accion = (string) ($_GET['accion'] ?? '');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $cuerpo = json_decode((string) file_get_contents('php://input'), true) ?: [];
    $accion = (string) ($cuerpo['accion'] ?? 'alta');
}

/* ------------------------------------------------------------------- alta */

if ($accion === 'alta') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') salir(405, ['ok' => false, 'error' => 'metodo']);

    $ip = (string) ($_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
    $marca = sys_get_temp_dir() . '/becomesus_' . hash('sha256', $ip);
    $previos = array_filter(json_decode((string) @file_get_contents($marca), true) ?: [],
        static fn($t) => is_int($t) && $t > time() - LIMITE_SEGS);
    if (count($previos) >= LIMITE_ALTAS) {
        salir(429, ['ok' => false, 'error' => 'limite',
            'mensaje' => 'Demasiadas peticiones desde esta conexión. Prueba dentro de un rato.']);
    }

    $email  = strtolower(trim((string) ($cuerpo['email'] ?? '')));
    $idioma = ($cuerpo['idioma'] ?? 'es') === 'en' ? 'en' : 'es';
    $origen = substr(preg_replace('/[^a-z0-9\-\/]/i', '', (string) ($cuerpo['origen'] ?? '')), 0, 60);

    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 255) {
        salir(400, ['ok' => false, 'error' => 'email',
            'mensaje' => $idioma === 'en' ? 'That email address does not look right.' : 'Esa dirección de correo no parece válida.']);
    }

    /* Trampa para robots: un campo que una persona no ve y por tanto no
       rellena. Se responde que todo ha ido bien y no se hace nada, para que
       quien lo rellenó no aprenda que fue detectado. */
    if (!empty($cuerpo['empresa'])) salir(200, ['ok' => true, 'estado' => 'pendiente']);

    $pdo = bd($datosCfg);
    $fila = $pdo->prepare('SELECT id, estado FROM suscriptores WHERE email = ?');
    $fila->execute([$email]);
    $existe = $fila->fetch(PDO::FETCH_ASSOC);

    if ($existe && $existe['estado'] === 'confirmado') {
        /* Ya está dentro. No se dice «ya estabas suscrito» porque eso permite
           a cualquiera comprobar si una dirección concreta está en la lista. */
        salir(200, ['ok' => true, 'estado' => 'pendiente']);
    }

    $token = bin2hex(random_bytes(32));
    if ($existe) {
        $pdo->prepare('UPDATE suscriptores SET token = ?, idioma = ?, estado = "pendiente", alta_en = NOW() WHERE id = ?')
            ->execute([$token, $idioma, $existe['id']]);
    } else {
        $pdo->prepare('INSERT INTO suscriptores (email, idioma, estado, token, origen, alta_en) VALUES (?, ?, "pendiente", ?, ?, NOW())')
            ->execute([$email, $idioma, $token, $origen ?: null]);
    }

    $previos[] = time();
    @file_put_contents($marca, json_encode(array_values($previos)), LOCK_EX);

    $t = $T[$idioma];
    $enlace = "$SITIO/api/suscripcion.php?accion=confirmar&t=$token";
    try {
        $cfg = $correoCfg + ['sitio' => $SITIO, 'token_baja' => $token];
        $fp = correo_abrir($cfg);
        correo_enviar($fp, $cfg, $email, $t['asunto'],
            "{$t['saludo']}\n\n{$t['pulsa']}\n$enlace\n\n{$t['ignora']}",
            '<div style="font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:#1a1f2e;max-width:520px">'
            . '<p>' . htmlspecialchars($t['saludo']) . '</p>'
            . '<p>' . htmlspecialchars($t['pulsa']) . '</p>'
            . '<p><a href="' . htmlspecialchars($enlace) . '" style="display:inline-block;background:#00ff88;color:#05070f;'
            . 'padding:14px 22px;border-radius:2px;text-decoration:none;font-weight:600">'
            . htmlspecialchars($t['boton']) . '</a></p>'
            . '<p style="color:#5b6478;font-size:14px">' . htmlspecialchars($t['ignora']) . '</p></div>');
        correo_cerrar($fp);
        /* Se registra también el envío que sale bien. Sin esta línea, un
           registro vacío no distingue «se envió sin problema» de «no se
           intentó siquiera», y son dos averías completamente distintas. */
        registrar('alta ' . $email . ': correo de confirmación aceptado por el servidor');
    } catch (ErrorDeCorreo $e) {
        registrar('alta ' . $email . ': ' . $e->getMessage());
        salir(500, ['ok' => false, 'error' => 'correo',
            'mensaje' => $idioma === 'en' ? 'We could not send the confirmation email. Try again shortly.' : 'No pudimos enviar el correo de confirmación. Inténtalo en un momento.']);
    }

    salir(200, ['ok' => true, 'estado' => 'pendiente']);
}

/* ------------------------------------------------------- confirmar y baja */

if ($accion === 'confirmar' || $accion === 'baja') {
    $token = (string) ($_GET['t'] ?? $_POST['t'] ?? '');
    if (!preg_match('/^[a-f0-9]{64}$/', $token)) irA('/es');

    $pdo = bd($datosCfg);
    $fila = $pdo->prepare('SELECT id, idioma FROM suscriptores WHERE token = ?');
    $fila->execute([$token]);
    $s = $fila->fetch(PDO::FETCH_ASSOC);
    if (!$s) irA('/es');

    $lang = $s['idioma'] === 'en' ? 'en' : 'es';

    if ($accion === 'confirmar') {
        $pdo->prepare('UPDATE suscriptores SET estado = "confirmado", confirmado_en = NOW() WHERE id = ?')->execute([$s['id']]);
        irA("/$lang/insights?suscripcion=confirmada");
    }

    /* La baja SOLO por POST.
       Gmail, Outlook y los antivirus de correo abren los enlaces de un mensaje
       por su cuenta para comprobar que no llevan a nada peligroso. Si un GET
       diera de baja, esas visitas automáticas irían borrando suscriptores sin
       que nadie hubiera pulsado nada, y el efecto sería el contrario del que
       se busca: la lista encogiendo sola y sin explicación.
       Por eso el enlace del correo lleva a una página con un botón, y ese
       botón es el que hace el POST. El un-clic del cliente de correo ya llega
       por POST —lo exige List-Unsubscribe-Post— así que ese camino no cambia. */
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        irA("/$lang/insights?suscripcion=confirmar-baja&t=" . rawurlencode($token));
    }

    $pdo->prepare('UPDATE suscriptores SET estado = "baja", baja_en = NOW() WHERE id = ?')->execute([$s['id']]);
    /* El un-clic del cliente de correo no espera una página: espera un 200 seco. */
    if (!empty($_POST['desde_web'])) irA("/$lang/insights?suscripcion=baja");
    salir(200, ['ok' => true]);
}

/* --------------------------------------------------------------- difusión */

/**
 * Envía un artículo a quien lo ha confirmado. Lo llama el trabajo diario
 * después de publicar, con el testigo que genera el despliegue.
 *
 * Va en tandas y con una pausa entre envíos a propósito: un hosting compartido
 * corta la conexión SMTP si se le lanzan doscientos mensajes seguidos, y lo
 * hace a la mitad, dejando media lista enviada sin decir cuál. Es más lento y
 * termina.
 */
if ($accion === 'difundir') {
    /* Un testigo estable y propio, no el del correo: aquel se regenera en cada
       despliegue y solo lo conoce el despliegue que lo generó. */
    if (empty($datosCfg['difusion']) || !hash_equals((string) $datosCfg['difusion'], (string) ($cuerpo['token'] ?? ''))) {
        salir(403, ['ok' => false, 'error' => 'testigo']);
    }
    $idioma  = ($cuerpo['idioma'] ?? 'es') === 'en' ? 'en' : 'es';
    $titulo  = trim((string) ($cuerpo['titulo'] ?? ''));
    $entrada = trim((string) ($cuerpo['entradilla'] ?? ''));
    $ruta    = (string) ($cuerpo['ruta'] ?? '');
    if ($titulo === '' || !preg_match('#^/(es|en)/insights/[a-z0-9-]+$#', $ruta)) {
        salir(400, ['ok' => false, 'error' => 'datos', 'mensaje' => 'Falta el título o la ruta del artículo.']);
    }

    $pdo = bd($datosCfg);
    $q = $pdo->prepare('SELECT email, token FROM suscriptores WHERE estado = "confirmado" AND idioma = ?');
    $q->execute([$idioma]);
    $lista = $q->fetchAll(PDO::FETCH_ASSOC);
    if (!$lista) salir(200, ['ok' => true, 'enviados' => 0, 'fallos' => 0]);

    $leer = $idioma === 'en' ? 'Read the article' : 'Leer el artículo';
    $baja = $idioma === 'en' ? 'Unsubscribe' : 'Darse de baja';
    /* El pie de identidad. No es letra pequeña legal: es una señal de
       legitimidad que los filtros de correo miran.
     *
       Un boletín que no dice quién lo manda ni por qué te llega se parece,
       byte a byte, a uno que compró la dirección. Decirlo —quién es la
       empresa, dónde está, y que esta dirección se dio de alta en el sitio—
       es de las pocas cosas del contenido que mueven la aguja en un dominio
       joven, y además es lo que exige cualquier ley de correo comercial. */
    $porQue = $idioma === 'en'
        ? 'You are receiving this because you subscribed at meetbecome.com.'
        : 'Recibes este correo porque te suscribiste en meetbecome.com.';
    $quien = 'FLUM E.I.R.L. · RUC 20616001711 · Av. José Gálvez Barrenechea 200, La Victoria, Lima, Perú';
    $enviados = 0; $fallos = 0; $fp = null;

    foreach ($lista as $s) {
        $urlArt  = $SITIO . $ruta;
        $urlBaja = "$SITIO/api/suscripcion.php?accion=baja&t={$s['token']}";
        $cfg = $correoCfg + ['sitio' => $SITIO, 'token_baja' => $s['token']];
        try {
            /* Una sola sesión para toda la tanda: abrir y autenticar por cada
               mensaje multiplica por cinco el tiempo y las probabilidades de
               que el servidor de correo corte por exceso de conexiones. */
            if ($fp === null) $fp = correo_abrir($cfg);
            correo_enviar($fp, $cfg, $s['email'], $titulo,
                "$titulo\n\n$entrada\n\n$leer: $urlArt\n\n$porQue\n$quien\n\n$baja: $urlBaja",
                '<div style="font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:#1a1f2e;max-width:520px">'
                . '<h1 style="font-size:24px;line-height:1.3;margin:0 0 12px">' . htmlspecialchars($titulo) . '</h1>'
                . '<p style="color:#3d4557">' . htmlspecialchars($entrada) . '</p>'
                . '<p><a href="' . htmlspecialchars($urlArt) . '" style="display:inline-block;background:#00ff88;color:#05070f;'
                . 'padding:14px 22px;border-radius:2px;text-decoration:none;font-weight:600">' . $leer . '</a></p>'
                . '<p style="color:#8b93a7;font-size:13px;border-top:1px solid #e6e8ee;padding-top:14px;margin-top:28px">'
                . htmlspecialchars($porQue) . '<br>' . htmlspecialchars($quien) . '<br>'
                . '<a href="' . htmlspecialchars($urlBaja) . '" style="color:#8b93a7">' . $baja . '</a></p></div>');
            $enviados++;
            usleep(250000);
        } catch (ErrorDeCorreo $e) {
            $fallos++;
            registrar('difundir ' . $s['email'] . ': ' . $e->getMessage());
            /* La sesión puede haber quedado inservible: se cierra y la
               siguiente vuelta abre otra en vez de arrastrar el fallo. */
            if ($fp) { @fclose($fp); $fp = null; }
        }
    }
    if ($fp) correo_cerrar($fp);

    registrar("difundir $ruta: $enviados enviados, $fallos fallos");
    salir(200, ['ok' => true, 'enviados' => $enviados, 'fallos' => $fallos]);
}

salir(400, ['ok' => false, 'error' => 'accion_desconocida']);
