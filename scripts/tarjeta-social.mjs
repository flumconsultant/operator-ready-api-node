/**
 * Genera la tarjeta que se ve al compartir un artículo.
 *
 *   node scripts/tarjeta-social.mjs [archivo.json ...]
 *
 * ---- Por qué existe ----
 *
 * Un artículo compartido en LinkedIn o WhatsApp sin imagen aparece como un
 * enlace desnudo, y un enlace desnudo se pulsa mucho menos. Esa es la única
 * razón de peso para que un artículo tenga imagen: no ayuda a posicionar, y una
 * foto de archivo genérica encima resta, porque quien la ve deduce que el texto
 * también es de archivo.
 *
 * La tarjeta que se genera aquí no es decorativa: dice el titular del artículo.
 * Nunca es aleatoria, nunca es una foto que no significa nada, y sale igual en
 * los cien artículos siguientes sin que nadie elija una imagen cada mañana.
 *
 * ---- Por qué con navegador y no dibujando la imagen a mano ----
 *
 * Porque la tipografía es la marca. Un PNG dibujado píxel a píxel obligaría a
 * reimplementar el corte de líneas, el interletraje y la fuente variable, y el
 * resultado se parecería al sitio en vez de ser el sitio. Playwright ya está en
 * el proyecto para las comprobaciones, así que no añade ninguna dependencia.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR_ARTICULOS = join(RAIZ, 'src/content/insights');
const DIR_TARJETAS = join(RAIZ, 'assets/images/tarjetas');

const { PILARES, FORMATOS } = await import('../src/content/taxonomia.js');

const b64 = (p) => readFileSync(join(RAIZ, p)).toString('base64');
const escapa = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* 1200x630 es la medida que piden LinkedIn, X y WhatsApp. Cualquier otra la
   recortan ellos, y recortan por donde les conviene, no por donde conviene. */
const ANCHO = 1200;
const ALTO = 630;

function pagina(art, lang) {
  const t = art[lang];
  const etiqueta = [PILARES[art.pilar]?.[lang], FORMATOS[art.formato]?.[lang]]
    .filter(Boolean).join(' · ');

  /* El titular manda en el tamaño: uno de doce palabras a 76px se sale de la
     tarjeta, y uno de tres a 44px deja media tarjeta vacía. */
  const n = t.titulo.length;
  const tamano = n < 34 ? 76 : n < 52 ? 64 : n < 72 ? 54 : 46;

  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face {
    font-family: 'Inter'; font-weight: 100 900; font-style: normal;
    src: url(data:font/woff2;base64,${b64('src/fonts/inter-variable-latin.woff2')}) format('woff2');
  }
  @font-face {
    font-family: 'JetBrains Mono'; font-weight: 100 800; font-style: normal;
    src: url(data:font/woff2;base64,${b64('src/fonts/jetbrains-mono-variable-latin.woff2')}) format('woff2');
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${ANCHO}px; height: ${ALTO}px; position: relative; overflow: hidden;
    background: #05070f; color: #fff;
    font-family: Inter, sans-serif; -webkit-font-smoothing: antialiased;
  }
  /* La misma retícula del sitio, al mismo paso. Es lo que hace que la tarjeta
     se reconozca como de BECOME antes de leer el nombre. */
  .malla {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px);
    background-size: 56px 56px;
  }
  .brillo {
    position: absolute; width: 780px; height: 780px; right: -240px; top: -300px;
    background: radial-gradient(circle, rgba(0,255,136,.20) 0%, rgba(0,255,136,0) 62%);
  }
  .marco { position: relative; height: 100%; padding: 68px 76px; display: flex; flex-direction: column; }
  .kicker {
    font-family: 'JetBrains Mono', monospace; font-size: 20px; letter-spacing: .16em;
    text-transform: uppercase; color: #0f8;
  }
  h1 {
    margin-top: auto; font-size: ${tamano}px; font-weight: 600; line-height: 1.14;
    letter-spacing: -.02em; max-width: 20ch; text-wrap: balance;
  }
  .pie {
    margin-top: auto; padding-top: 34px; display: flex; align-items: baseline;
    justify-content: space-between; border-top: 1px solid rgba(255,255,255,.14);
  }
  .marca { font-size: 26px; font-weight: 700; letter-spacing: .22em; }
  .marca em { font-style: normal; color: #0f8; }
  .sitio { font-family: 'JetBrains Mono', monospace; font-size: 18px; color: rgba(255,255,255,.5); }
  </style></head><body>
    <div class="malla"></div><div class="brillo"></div>
    <div class="marco">
      <div class="kicker">${escapa(etiqueta)}</div>
      <h1>${escapa(t.titulo)}</h1>
      <div class="pie">
        <div class="marca">BEC<em>O</em>ME</div>
        <div class="sitio">meetbecome.com</div>
      </div>
    </div>
  </body></html>`;
}

/* ---------------------------------------------------------------------- */

const pedidos = process.argv.slice(2);
const archivos = pedidos.length
  ? pedidos
  : readdirSync(DIR_ARTICULOS).filter((f) => f.endsWith('.json')).map((f) => join(DIR_ARTICULOS, f));

mkdirSync(DIR_TARJETAS, { recursive: true });

const navegador = await chromium.launch({
  executablePath: existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined,
});
const pagina1 = await navegador.newPage({ viewport: { width: ANCHO, height: ALTO } });

let hechas = 0;
for (const archivo of archivos) {
  const art = JSON.parse(readFileSync(archivo, 'utf8'));
  for (const lang of ['es', 'en']) {
    if (!art[lang]?.slug || !art[lang]?.titulo) continue;
    await pagina1.setContent(pagina(art, lang), { waitUntil: 'load' });
    /* Las fuentes van incrustadas, pero incrustadas no es lo mismo que
       aplicadas: sin esperarlas, la captura sale con la tipografía del sistema
       y la tarjeta deja de parecerse a la marca. */
    await pagina1.evaluate(() => document.fonts.ready);
    /* JPEG y no PNG. La tarjeta es un degradado y texto, así que el PNG pesa
       cuatro veces más sin verse mejor, y aquí el peso importa: a un artículo
       diario en dos idiomas son setecientas tarjetas al año dentro del
       repositorio. LinkedIn, X y WhatsApp aceptan JPEG sin distinción. */
    const destino = join(DIR_TARJETAS, `${art[lang].slug}.jpg`);
    await pagina1.screenshot({ path: destino, type: 'jpeg', quality: 82 });
    console.log(`tarjeta: ${basename(destino)}`);
    hechas++;
  }
}

await navegador.close();
console.log(`${hechas} tarjeta(s) en assets/images/tarjetas/`);
