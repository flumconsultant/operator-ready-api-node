<?php
/**
 * Cliente SMTP para los correos de suscripción.
 *
 * ---- Por qué esto es casi igual que lo que hay dentro de contacto.php ----
 *
 * Porque lo es, y la duplicación es deliberada. contacto.php es el formulario
 * que trae clientes; lleva meses funcionando y no se puede probar de verdad sin
 * enviar correo real desde el hosting. Refactorizarlo para compartir estas
 * setenta líneas habría metido un cambio no verificable en lo único del sitio
 * cuyo fallo se mide en oportunidades perdidas.
 *
 * La diferencia que sí importa: allí un fallo responde un JSON al navegador de
 * quien rellenó el formulario; aquí se lanza una excepción, porque quien llama
 * puede estar enviando a doscientas personas y necesita seguir con las demás.
 *
 * Si algún día hay que tocar el protocolo, se tocan los dos. Está anotado en
 * los dos sitios a propósito.
 */

declare(strict_types=1);

final class ErrorDeCorreo extends RuntimeException {}

function correo_leer($fp): string {
    $todo = '';
    while (($linea = fgets($fp, 1024)) !== false) {
        $todo .= $linea;
        if (strlen($linea) < 4 || $linea[3] !== '-') break;
    }
    return $todo;
}

function correo_orden($fp, ?string $orden, array $esperado, string $etiqueta): string {
    if ($orden !== null) @fwrite($fp, $orden . "\r\n");
    $r = correo_leer($fp);
    $codigo = (int) substr($r, 0, 3);
    if (!in_array($codigo, $esperado, true)) {
        throw new ErrorDeCorreo("$etiqueta: el servidor respondió " . trim($r));
    }
    return $r;
}

/** Abre una sesión SMTP autenticada. Quien la abre la cierra. */
function correo_abrir(array $config) {
    $contexto = stream_context_create(['ssl' => [
        'verify_peer' => true, 'verify_peer_name' => true,
        'allow_self_signed' => false, 'SNI_enabled' => true,
    ]]);
    $fp = @stream_socket_client(
        sprintf('ssl://%s:%d', $config['host'], (int) $config['port']),
        $errno, $errstr, 20, STREAM_CLIENT_CONNECT, $contexto
    );
    if (!$fp) throw new ErrorDeCorreo("conexión a {$config['host']}:{$config['port']} — $errstr ($errno)");
    stream_set_timeout($fp, 20);

    $dominio = substr(strrchr((string) $config['user'], '@') ?: '@localhost', 1);
    correo_orden($fp, null, [220], 'saludo');
    correo_orden($fp, 'EHLO ' . $dominio, [250], 'ehlo');
    correo_orden($fp, 'AUTH LOGIN', [334], 'auth');
    correo_orden($fp, base64_encode((string) $config['user']), [334], 'auth-usuario');
    correo_orden($fp, base64_encode((string) $config['password']), [235], 'auth-clave');
    return $fp;
}

function correo_cerrar($fp): void {
    @fwrite($fp, "QUIT\r\n");
    @fclose($fp);
}

/**
 * Compone y envía un mensaje por una sesión ya abierta.
 *
 * El cuerpo va en quoted-printable y no en base64: un correo enteramente
 * codificado en base64 puntúa peor en los filtros de spam, y aquí el texto es
 * casi todo ASCII con algún acento suelto.
 */
function correo_enviar($fp, array $config, string $para, string $asunto, string $textoPlano, string $html): void {
    $de = (string) $config['user'];
    $qp = static fn(string $s) => quoted_printable_encode(str_replace("\r\n", "\n", $s));
    $frontera = 'lim' . bin2hex(random_bytes(12));

    $cabeceras = [
        'From: BECOME <' . $de . '>',
        'To: <' . $para . '>',
        'Subject: =?UTF-8?B?' . base64_encode($asunto) . '?=',
        'MIME-Version: 1.0',
        'Date: ' . gmdate('D, d M Y H:i:s') . ' +0000',
        'Message-ID: <' . bin2hex(random_bytes(16)) . '@' . substr(strrchr($de, '@') ?: '@localhost', 1) . '>',
        /* Sin esto, Gmail y Outlook esconden el enlace de baja o directamente
           marcan el envío como sospechoso. Y con esto, quien no quiera seguir
           se da de baja en un clic desde el propio cliente de correo, que es
           mejor para todos que marcar el mensaje como spam. */
        'List-Unsubscribe: <' . $config['sitio'] . '/api/suscripcion.php?accion=baja&t=' . $config['token_baja'] . '>',
        'List-Unsubscribe-Post: List-Unsubscribe=One-Click',
        'Content-Type: multipart/alternative; boundary="' . $frontera . '"',
    ];

    $cuerpo = "--$frontera\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\n"
        . $qp($textoPlano) . "\r\n"
        . "--$frontera\r\n"
        . "Content-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\n"
        . $qp($html) . "\r\n"
        . "--$frontera--";

    correo_orden($fp, 'MAIL FROM:<' . $de . '>', [250], 'remitente');
    correo_orden($fp, 'RCPT TO:<' . $para . '>', [250, 251], 'destinatario');
    correo_orden($fp, 'DATA', [354], 'datos');
    /* Un punto solo al principio de una línea termina el mensaje: hay que
       doblarlo o el correo se corta ahí sin avisar. */
    $mensaje = implode("\r\n", $cabeceras) . "\r\n\r\n" . preg_replace('/^\./m', '..', $cuerpo);
    correo_orden($fp, $mensaje . "\r\n.", [250], 'cuerpo');
}
