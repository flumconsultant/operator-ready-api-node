import { createServer } from 'node:http';
import { spawnSync } from 'node:child_process';
/* Se espera a que el servidor escuche de verdad antes de lanzar el centinela.
   Sin esperar, el primer caso corría contra un puerto todavía cerrado y el
   banco de pruebas acusaba al centinela de un fallo suyo. */
const arrancar = (c, puerto) => new Promise((ok) => {
  const srv = createServer((q, r) => {
    const u = q.url.split('?')[0];
    const k = u.includes('contacto') ? 'contacto' : u.includes('suscripcion') ? 'suscripcion' : u.includes('panel') ? 'panel' : 'clave';
    const [estado, tipo] = c[k];
    r.writeHead(estado, { 'content-type': tipo === 'json' ? 'application/json' : tipo === 'html' ? 'text/html' : 'text/plain', connection: 'close' });
    r.end(tipo === 'json' ? '{"ok":false}' : tipo === 'html' ? '<b>Fatal error</b>' : '2f6a4e8c60f1962a409352f15ab7fc1b');
  });
  srv.listen(puerto, () => ok(srv));
});
const CASOS = {
  'todo bien':                { contacto:[400,'json'], suscripcion:[400,'json'], panel:[401,'json'], clave:[200,'txt'] },
  'un PHP reventado':         { contacto:[200,'html'], suscripcion:[400,'json'], panel:[401,'json'], clave:[200,'txt'] },
  'el panel deja entrar':     { contacto:[400,'json'], suscripcion:[400,'json'], panel:[200,'json'], clave:[200,'txt'] },
  'la clave desaparece':      { contacto:[400,'json'], suscripcion:[400,'json'], panel:[401,'json'], clave:[404,'txt'] },
  'el formulario acepta vacío':{ contacto:[201,'json'], suscripcion:[400,'json'], panel:[401,'json'], clave:[200,'txt'] },
};
let i = 0, mal = 0;
for (const [nombre, c] of Object.entries(CASOS)) {
  const puerto = 4910 + i++;
  const srv = await arrancar(c, puerto);
  const res = spawnSync('node', ['scripts/centinela-api.mjs'], { env: { ...process.env, SITIO: `http://localhost:${puerto}` }, encoding: 'utf8' });
  await new Promise((ok) => srv.close(ok));
  const detiene = res.status !== 0;
  const debeDetener = nombre !== 'todo bien';
  if (detiene !== debeDetener) mal++;
  console.log(`${detiene === debeDetener ? 'ok ' : '✗  '} ${nombre.padEnd(28)} ${detiene ? 'lo detiene' : 'pasa'}`);
}
console.log(mal ? `\n${mal} sabotajes sin detectar` : '\nLos cuatro sabotajes detectados y el caso bueno pasa.');
process.exit(mal ? 1 : 0);
