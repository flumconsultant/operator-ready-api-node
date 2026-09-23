// Pruebas del middleware Workvivo -> Validator. Sin dependencias (Node 18+).
//
//   node probar-webhook.mjs claves              genera un par RSA SOLO DE PRUEBA en ./claves-prueba
//   WEBHOOK_URL=https://.../webhook/workvivo/validator node probar-webhook.mjs <caso>
//
// Casos: valido | invalido | alg-none | expirado | sin-jwt | duplicado | vacio | bucle | ratelimit
// Variables opcionales: TEST_ISS, TEST_AUD, TEST_APP_CLAIM, TEST_APP_ID, TEST_BOT_ID, TEST_CHANNEL
// Usar SOLO contra una instancia de desarrollo cuya credencial JWT tenga la clave pública de prueba.
import { generateKeyPairSync, createSign, randomUUID } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';

const DIR = './claves-prueba';
const caso = process.argv[2];

if (caso === 'claves') {
  const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  mkdirSync(DIR, { recursive: true });
  writeFileSync(`${DIR}/privada.pem`, privateKey.export({ type: 'pkcs8', format: 'pem' }), { mode: 0o600 });
  writeFileSync(`${DIR}/publica.pem`, publicKey.export({ type: 'spki', format: 'pem' }));
  console.log(`Claves de prueba en ${DIR}. Pega publica.pem en la credencial JWT del entorno de DESARROLLO.`);
  process.exit(0);
}

const url = process.env.WEBHOOK_URL;
if (!url || !url.startsWith('https://')) { console.error('Define WEBHOOK_URL (https).'); process.exit(1); }
if (!existsSync(`${DIR}/privada.pem`)) { console.error('Primero: node probar-webhook.mjs claves'); process.exit(1); }

const b64u = (o) => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o)).toString('base64url');
const firmar = (claims, key = readFileSync(`${DIR}/privada.pem`)) => {
  const h = b64u({ alg: 'RS256', typ: 'JWT' });
  const p = b64u(claims);
  return `${h}.${p}.${createSign('RSA-SHA256').update(`${h}.${p}`).sign(key).toString('base64url')}`;
};
const now = Math.floor(Date.now() / 1000);
const claims = (extra = {}) => {
  const c = { iat: now, nbf: now - 5, exp: now + 120, jti: randomUUID(), ...extra };
  if (process.env.TEST_ISS) c.iss = process.env.TEST_ISS;
  if (process.env.TEST_AUD) c.aud = process.env.TEST_AUD;
  if (process.env.TEST_APP_CLAIM) c[process.env.TEST_APP_CLAIM] = process.env.TEST_APP_ID;
  return c;
};
// Payload ficticio con la forma del ejemplo de referencia de Workvivo. Sin datos reales.
const payload = (text = 'Revisa este titular: "Nueva intranet disponible desde el lunes"', extra = {}) => ({
  category: 'bot_message_notification',
  bot: { bot_userid: process.env.TEST_BOT_ID || 'bot-prueba-001' },
  channel: { channel_url: process.env.TEST_CHANNEL || 'canal-prueba-001' },
  message: { text },
  ...extra,
});
const enviar = async (etiqueta, jwt, body) => {
  const headers = { 'Content-Type': 'application/json' };
  if (jwt) headers['x-workvivo-jwt'] = jwt;
  const r = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
  console.log(`${etiqueta}: HTTP ${r.status} ${await r.text()}`);
};

const otraClave = generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey;
switch (caso) {
  case 'valido':   await enviar('JWT válido (esperado 200)', firmar(claims()), payload()); break;
  case 'invalido': await enviar('Firma de otra clave (esperado 401)', firmar(claims(), otraClave), payload()); break;
  case 'alg-none': await enviar('alg none (esperado 401)', `${b64u({ alg: 'none', typ: 'JWT' })}.${b64u(claims())}.`, payload()); break;
  case 'expirado': await enviar('Expirado (esperado 401)', firmar(claims({ iat: now - 900, nbf: now - 900, exp: now - 600 })), payload()); break;
  case 'sin-jwt':  await enviar('Sin JWT (esperado 401)', null, payload()); break;
  case 'duplicado': { const t = firmar(claims()); await enviar('1er envío (200)', t, payload()); await enviar('Reenvío mismo jti (200, sin llamar a Validator)', t, payload()); break; }
  case 'vacio':    await enviar('Mensaje vacío (200; Validator recibe input vacío)', firmar(claims()), payload('')); break;
  case 'bucle':    await enviar('Evento del propio bot (200 ignorado)', firmar(claims()), { action: 'chat_bot_message_sent', bot: { bot_userid: 'bot-prueba-001' } }); break;
  case 'ratelimit': for (let i = 1; i <= 12; i++) await enviar(`Envío ${i} (429 a partir del 11)`, firmar(claims()), payload(`mensaje ${i}`)); break;
  default: console.error('Caso desconocido.'); process.exit(1);
}
