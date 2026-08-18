<?php
/**
 * Recibe los envíos de los formularios del sitio y los manda por correo.
 *
 * Vive aquí, en el propio hosting, y no en un servicio de formularios de
 * terceros: los datos de quien escribe —nombre, empresa, qué necesita cambiar
 * en su negocio— no tienen por qué pasar por una empresa intermedia para
 * llegar a una bandeja de entrada que ya está en este mismo servidor.
 *
 * Se envía por SMTP autenticado con la propia cuenta del dominio, no con la
 * función mail() de PHP. mail() entrega al MTA local sin firmar, y el correo
 * acaba en spam con frecuencia; autenticándose contra el servidor de correo
 * del dominio, el mensaje sale firmado por DKIM y alineado con el SPF que ya
 * está publicado en el DNS, que es lo que decide si llega a la bandeja.
 *
 * El cliente SMTP está escrito a mano y a propósito: son cien líneas que se
 * leen enteras, frente a una dependencia que habría que instalar, fijar a una
 * versión y actualizar en un hosting compartido donde no hay composer.
 *
 * Las credenciales NO están aquí. Viven en config.php, que lo genera el
 * despliegue a partir de los secretos del repositorio y nunca se escribe en
 * el código fuente.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

const MAX_ANSWERS      = 40;
const MAX_VALUE_LEN    = 5000;
const MAX_PAYLOAD_LEN  = 60000;
const RATE_LIMIT_MAX   = 5;      // envíos...
const RATE_LIMIT_SECS  = 3600;   // ...por hora y por IP

/** Termina la petición con un JSON y un código. */
function responder(int $code, array $data): never {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Registra el fallo y responde sin contar de más.
 *
 * La distinción importa: al navegador solo va la etapa en la que se rompió
 * —'auth', 'conexion', 'config'—, que no dice nada de la infraestructura pero
 * señala el problema en un segundo. El motivo completo que devuelve el
 * servidor de correo se guarda en errores.log, que está fuera del alcance de
 * la web (lo bloquea .htaccess) y se abre desde el gestor de archivos.
 *
 * Sin este registro, un fallo de envío es un 500 mudo: el sitio queda
 * aparentemente bien y los mensajes desaparecen sin dejar rastro.
 */
function fallar(string $interno, string $etapa = 'smtp'): never {
    $linea = sprintf("[%s] %s: %s\n", gmdate('Y-m-d H:i:s'), $etapa, $interno);
    @file_put_contents(__DIR__ . '/errores.log', $linea, FILE_APPEND | LOCK_EX);
    error_log('[contacto] ' . $etapa . ': ' . $interno);
    responder(500, ['ok' => false, 'error' => 'send_failed', 'stage' => $etapa]);
}

/** Un valor que va en una cabecera no puede traer saltos de línea: ahí es
 *  donde se cuelan cabeceras falsas (header injection). */
function limpiar_cabecera(string $v): string {
    return trim(preg_replace('/[\r\n\t]+/', ' ', $v));
}

function asunto_mime(string $s): string {
    return mb_strlen($s) === strlen($s) && !preg_match('/[^\x20-\x7E]/', $s)
        ? $s
        : '=?UTF-8?B?' . base64_encode($s) . '?=';
}

/* ---------------------------------------------------------------- entrada */

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    responder(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

$crudo = file_get_contents('php://input');
if ($crudo === false || $crudo === '' || strlen($crudo) > MAX_PAYLOAD_LEN) {
    responder(400, ['ok' => false, 'error' => 'bad_request']);
}

$in = json_decode($crudo, true);
if (!is_array($in)) {
    responder(400, ['ok' => false, 'error' => 'bad_request']);
}

/* El señuelo: un campo que la persona no ve y por tanto deja vacío, y que un
   robot que rellena todo lo que encuentra sí completa. Se responde 200 a
   propósito — un 400 le enseña al robot que ha sido detectado. */
if (!empty($in['website'])) {
    responder(200, ['ok' => true]);
}

$respuestas = $in['answers'] ?? null;
if (!is_array($respuestas) || count($respuestas) === 0 || count($respuestas) > MAX_ANSWERS) {
    responder(400, ['ok' => false, 'error' => 'bad_request']);
}

$lang     = ($in['lang'] ?? 'es') === 'en' ? 'en' : 'es';
$formul   = is_string($in['form'] ?? null) ? substr($in['form'], 0, 40) : 'contacto';
$replyTo  = is_string($in['replyTo'] ?? null) ? trim($in['replyTo']) : '';
if ($replyTo !== '' && !filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
    $replyTo = '';
}

/* ------------------------------------------------------- límite de envíos */

$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$marca = sys_get_temp_dir() . '/becomeform_' . hash('sha256', $ip);
$previos = [];
if (is_readable($marca)) {
    $previos = array_filter(
        (array) json_decode((string) file_get_contents($marca), true),
        static fn($t) => is_int($t) && $t > time() - RATE_LIMIT_SECS
    );
}
if (count($previos) >= RATE_LIMIT_MAX) {
    responder(429, ['ok' => false, 'error' => 'too_many_requests']);
}

/* ---------------------------------------------------------- el mensaje */

$config = require __DIR__ . '/config.php';
foreach (['host', 'port', 'user', 'password', 'to'] as $k) {
    if (empty($config[$k])) {
        fallar("falta la clave '$k' en config.php", 'config');
    }
}

$lineas = [];
foreach ($respuestas as $r) {
    if (!is_array($r)) continue;
    $etiqueta = is_string($r['label'] ?? null) ? trim($r['label']) : '';
    $valor    = $r['value'] ?? '';
    if (is_array($valor)) $valor = implode(', ', array_map('strval', $valor));
    if (!is_string($valor)) $valor = (string) $valor;
    if ($etiqueta === '') continue;

    $etiqueta = mb_substr($etiqueta, 0, 200);
    $valor    = mb_substr(trim($valor), 0, MAX_VALUE_LEN);
    $lineas[] = $etiqueta . ":\n" . ($valor === '' ? '—' : $valor);
}
if (!$lineas) {
    responder(400, ['ok' => false, 'error' => 'bad_request']);
}

$origen  = $formul === 'become-now' ? 'BECOME NOW™' : ($lang === 'en' ? 'Contact' : 'Contacto');
$asunto  = ($lang === 'en' ? 'New enquiry' : 'Nueva consulta') . ' · ' . $origen;

$cuerpo  = implode("\n\n", $lineas);
$cuerpo .= "\n\n———\n";
$cuerpo .= ($lang === 'en' ? 'Form: ' : 'Formulario: ') . $formul . "\n";
$cuerpo .= ($lang === 'en' ? 'Language: ' : 'Idioma: ') . $lang . "\n";
$cuerpo .= ($lang === 'en' ? 'Sent: ' : 'Enviado: ') . gmdate('Y-m-d H:i:s') . " UTC\n";

$de   = limpiar_cabecera((string) $config['user']);
$para = limpiar_cabecera((string) $config['to']);

$cabeceras = [
    'From: BECOME <' . $de . '>',
    'To: <' . $para . '>',
    'Subject: ' . asunto_mime($asunto),
    'Date: ' . gmdate('D, d M Y H:i:s') . ' +0000',
    'Message-ID: <' . bin2hex(random_bytes(12)) . '@' . substr(strrchr($de, '@') ?: '@localhost', 1) . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
];
/* Responder al aviso escribe a quien rellenó el formulario, no a nosotros
   mismos: sin esto hay que copiar la dirección a mano en cada respuesta. */
if ($replyTo !== '') {
    $cabeceras[] = 'Reply-To: <' . limpiar_cabecera($replyTo) . '>';
}

/* El cuerpo va en base64: así ninguna línea supera los 76 caracteres que
   admite SMTP y ninguna empieza por un punto, que es la marca de fin de
   mensaje y habría que escapar aparte. */
$mensaje = implode("\r\n", $cabeceras) . "\r\n\r\n"
         . chunk_split(base64_encode($cuerpo), 76, "\r\n");

/* ------------------------------------------------------------------ SMTP */

/** Lee una respuesta completa, incluidas las de varias líneas (250-…). */
function smtp_leer($fp): string {
    $todo = '';
    while (($linea = fgets($fp, 1024)) !== false) {
        $todo .= $linea;
        if (strlen($linea) < 4 || $linea[3] !== '-') break;
    }
    return $todo;
}

/** Envía una orden y comprueba el código de respuesta. */
function smtp_orden($fp, ?string $orden, array $esperado, string $etiqueta): string {
    if ($orden !== null) {
        if (fwrite($fp, $orden . "\r\n") === false) {
            fallar("no se pudo escribir en el socket", $etiqueta);
        }
    }
    $res = smtp_leer($fp);
    $codigo = (int) substr($res, 0, 3);
    if (!in_array($codigo, $esperado, true)) {
        fallar('el servidor respondió: ' . trim($res), $etiqueta);
    }
    return $res;
}

$destino = sprintf('ssl://%s:%d', $config['host'], (int) $config['port']);

/* La verificación del certificado se deja escrita, aunque coincida con lo que
   PHP hace por defecto: es la línea que impide que alguien en medio se haga
   pasar por el servidor de correo y se quede con la contraseña del buzón.
   Escrita, se ve; heredada del valor por defecto, cambia sin que nadie lo
   note el día que cambie el valor por defecto o la versión de PHP. */
$contexto = stream_context_create(['ssl' => [
    'verify_peer'       => true,
    'verify_peer_name'  => true,
    'allow_self_signed' => false,
    'SNI_enabled'       => true,
]]);

$fp = @stream_socket_client(
    $destino, $errno, $errstr, 20, STREAM_CLIENT_CONNECT, $contexto
);
if (!$fp) {
    fallar("no se pudo conectar a {$config['host']}:{$config['port']} — $errstr ($errno)", 'conexion');
}
stream_set_timeout($fp, 20);

smtp_orden($fp, null, [220], 'saludo');
smtp_orden($fp, 'EHLO ' . (substr(strrchr($de, '@') ?: '@localhost', 1)), [250], 'ehlo');
smtp_orden($fp, 'AUTH LOGIN', [334], 'auth');
smtp_orden($fp, base64_encode((string) $config['user']), [334], 'auth-usuario');
smtp_orden($fp, base64_encode((string) $config['password']), [235], 'auth-clave');
smtp_orden($fp, 'MAIL FROM:<' . $de . '>', [250], 'remitente');
smtp_orden($fp, 'RCPT TO:<' . $para . '>', [250, 251], 'destinatario');
smtp_orden($fp, 'DATA', [354], 'datos');
smtp_orden($fp, $mensaje . "\r\n.", [250], 'cuerpo');
@fwrite($fp, "QUIT\r\n");
@fclose($fp);

/* Solo se cuenta lo que de verdad salió: si el envío falla, el intento no
   debe gastarle el cupo a quien vuelva a probar. */
$previos[] = time();
@file_put_contents($marca, json_encode(array_values($previos)), LOCK_EX);

responder(200, ['ok' => true]);
