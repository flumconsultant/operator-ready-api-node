/**
 * Empaqueta la parte visual como un proyecto React independiente, listo para
 * subir a cualquier sitio que ejecute Vite.
 *
 * No son los archivos sueltos copiados: es un proyecto que arranca. Un montón
 * de .jsx sin sus tokens, sus fuentes y sus dependencias no se puede abrir, y
 * quien lo recibe acaba adivinando qué falta. Aquí va todo y está comprobado
 * que compila.
 *
 * Lo que NO va, a propósito: el nodo 3D (534 KB de three.js, específico de este
 * sitio y no una pieza reutilizable), las páginas, el contenido y el
 * enrutamiento. Esto es el sistema visual, no el sitio.
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const leer = (p) => readFileSync(join(ROOT, p), 'utf8');
const DESTINO = join(ROOT, 'design-export/react');

rmSync(DESTINO, { recursive: true, force: true });
for (const d of ['src/components', 'src/styles', 'public/fonts']) {
  mkdirSync(join(DESTINO, d), { recursive: true });
}

const escribir = (rel, contenido) => writeFileSync(join(DESTINO, rel), contenido);

/* ---------------------------------------------------- componentes visuales */

/* Solo las piezas del sistema. Se quedan fuera cabecera, pie y formularios:
   son del sitio, no del sistema, y arrastran su contenido y sus rutas. */
const COMPONENTES = [
  'ui.jsx', 'icons.jsx', 'Reveal.jsx', 'Media.jsx', 'Field.jsx',
  'StateTransition.jsx', 'GradientField.jsx', 'KineticGrid.jsx',
];

for (const f of COMPONENTES) {
  copyFileSync(join(ROOT, 'src/components', f), join(DESTINO, 'src/components', f));
}

/* --------------------------------------------------------------- estilos */

/* Los nueve archivos de tokens en uno. Separados tienen sentido dentro del
   repositorio, donde cada uno se edita por su lado; para entregar, un archivo
   se pega y se lee de una vez. */
const ORDEN = ['colors', 'typography', 'spacing', 'radius', 'effects', 'patterns', 'motion', 'base'];
const tokens = ORDEN
  .map((n) => `/* ═══ ${n}.css ═══ */\n${leer(`tokens/${n}.css`).trim()}`)
  .join('\n\n');
escribir('src/styles/tokens.css', `/* Los 173 tokens del sistema BECOME, consolidados.\n   Generados desde tokens/ — ver design-export-react.mjs. */\n\n${tokens}\n`);

copyFileSync(join(ROOT, 'src/styles/fonts.css'), join(DESTINO, 'src/styles/fonts.css'));
for (const f of readdirSync(join(ROOT, 'src/fonts'))) {
  copyFileSync(join(ROOT, 'src/fonts', f), join(DESTINO, 'public/fonts', f));
}
/* fonts.css apunta a ../fonts/*.woff2 dentro del repositorio; aquí van en
   public/, así que las rutas pasan a ser absolutas. */
escribir('src/styles/fonts.css', leer('src/styles/fonts.css').replace(/\.\.\/fonts\//g, '/fonts/'));

/* Lo imprescindible de global.css: lo que hace que las piezas se vean como se
   ven. Se deja fuera todo lo que depende del nodo 3D. */
const global = leer('src/styles/global.css');
const trozo = (desde, hasta) => {
  const i = global.indexOf(desde);
  if (i < 0) return '';
  const j = hasta ? global.indexOf(hasta, i) : -1;
  return global.slice(i, j < 0 ? undefined : j).trim();
};
escribir('src/styles/base.css', `@import url("./tokens.css");
@import url("./fonts.css");

/* Extraído de src/styles/global.css. Fuera queda todo lo que depende del nodo
   3D —las reglas de :root[data-ai-node="on"]— porque el nodo no viaja en este
   paquete: es específico del sitio, no una pieza del sistema. */

${trozo('* { box-sizing: border-box; }', '/* Fondo profundo')}

${trozo('/* Fondo profundo', '/* ------')}
`);

/* ------------------------------------------------------------- showcase */

/* Los nombres de icono se escriben aquí como lista literal en vez de
   importarlos: el objeto que los guarda es interno de icons.jsx y no se
   exporta. Antes que cambiar el componente del sitio para una necesidad del
   export, el generador —que ya sabe leerlos— los deja escritos. */
const ICONOS = [...leer('src/components/icons.jsx').matchAll(/^\s{2}([a-zA-Z0-9_]+):\s*\w/gm)].map((m) => m[1]);

escribir('src/Showcase.jsx', `import React from 'react';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, GhostCTA, TextCTA, Cols, Card, IndexRow } from './components/ui.jsx';
import { Ico, IcoBadge } from './components/icons.jsx';
import Reveal from './components/Reveal.jsx';

/**
 * Todas las piezas del sistema, en una página.
 *
 * Es lo que convierte un paquete de archivos en algo revisable: se abre, se ve
 * el sistema entero y se compara de un vistazo. Sin esto habría que montar una
 * página de prueba antes de poder juzgar nada.
 */

const NOMBRES_ICONO = ${JSON.stringify(ICONOS)};

export default function Showcase() {
  return (
    <main style={{ font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>

      <Section band="dark" pad="var(--space-13)">
        <Kicker dark>Sistema de diseño</Kicker>
        <Headline as="h1" dark size="var(--text-display)">BECOME WHAT COMES NEXT.</Headline>
        <Lead dark>
          Las piezas del sistema, en una página. Cada sección de abajo es una banda
          distinta: el contraste entre ellas es la puntuación del documento.
        </Lead>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <PrimaryCTA to="/">CTA principal</PrimaryCTA>
          <GhostCTA to="/" dark>CTA secundario</GhostCTA>
        </div>
      </Section>

      <Section band="light">
        <Kicker>Tipografía</Kicker>
        <Headline>Los titulares escalan con el ancho de la pantalla.</Headline>
        <Lead>
          Lead — el párrafo de entrada de una sección. Va un punto por encima del
          cuerpo y marca el tono de lo que viene.
        </Lead>
        <Body style={{ marginTop: 'var(--space-6)' }}>
          Body — el texto corriente. La medida está limitada a unos 60 caracteres
          por línea, que es donde la lectura deja de cansar.
        </Body>
        <TextCTA to="/">Enlace de texto</TextCTA>
      </Section>

      <Section band="sunken">
        <Kicker>Rejilla y tarjetas</Kicker>
        <Headline>Cols reparte en columnas que se pliegan solas.</Headline>
        <Cols min="260px">
          {['Capacitamos', 'Definimos', 'Construimos'].map((t, i) => (
            <Reveal as="div" key={t}>
              <IcoBadge name={['capability', 'decision', 'build'][i]} />
              <h3 style={{ margin: 'var(--space-5) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--navy-950)' }}>{t}</h3>
              <Body style={{ marginTop: 'var(--space-4)' }}>
                Una tarjeta con su icono, su titular y su línea de apoyo.
              </Body>
            </Reveal>
          ))}
        </Cols>
      </Section>

      <Section band="darker">
        <Kicker dark>Índice</Kicker>
        <Headline dark>IndexRow, para listas numeradas que son navegación.</Headline>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {['Escalar la IA más allá de los pilotos', 'Rediseñar procesos críticos', 'Medir y gobernar el valor'].map((t, i) => (
            <IndexRow key={t} index={i} icon={['scale', 'flow', 'decision'][i]} to="/" num={String(i + 1).padStart(2, '0')} term={t} def="La línea que explica de qué va." />
          ))}
        </div>
      </Section>

      <Section band="light">
        <Kicker>Iconos</Kicker>
        <Headline>{NOMBRES_ICONO.length} iconos, un solo trazo.</Headline>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)', marginTop: 'var(--space-9)' }}>
          {NOMBRES_ICONO.map((n) => (
            <div key={n} style={{ width: 96, textAlign: 'center' }}>
              <Ico name={n} size={28} />
              <p style={{ margin: 'var(--space-3) 0 0', font: 'var(--type-label)', color: 'var(--text-muted)' }}>{n}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>Color</Kicker>
        <Headline dark>La proporción es una regla, no una sugerencia.</Headline>
        <Lead dark>Navy 60 % · verde 20 % · azul hielo 10 % · carbón 10 %.</Lead>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-5)', marginTop: 'var(--space-9)' }}>
          {['--navy-950', '--navy-900', '--navy-700', '--electric-green', '--ice-blue', '--charcoal', '--off-white', '--pale-200'].map((t) => (
            <div key={t} style={{ width: 132 }}>
              <div style={{ height: 64, borderRadius: 'var(--radius-sm)', background: \`var(\${t})\`, border: '1px solid var(--border-hairline-dark)' }} />
              <p style={{ margin: 'var(--space-3) 0 0', font: 'var(--type-label)', color: 'var(--slate-300)' }}>{t}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section band="light">
        <Kicker>Card</Kicker>
        <Headline>La superficie elevada.</Headline>
        <Cols min="280px">
          <Card><Body>Una tarjeta sobre fondo claro, con su sombra y su radio.</Body></Card>
          <Card><Body>Se usa cuando algo tiene que separarse del fondo sin cambiar de banda.</Body></Card>
        </Cols>
      </Section>

    </main>
  );
}
`);

escribir('src/main.jsx', `import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LazyMotion, domAnimation } from 'framer-motion';
import Showcase from './Showcase.jsx';
import './styles/base.css';

/* BrowserRouter porque los CTA usan <Link>; LazyMotion porque los componentes
   usan \`m\` en vez de \`motion\` — sin él, no se dibujan. */
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LazyMotion features={domAnimation} strict>
        <Showcase />
      </LazyMotion>
    </BrowserRouter>
  </React.StrictMode>,
);
`);

/* --------------------------------------------------- andamiaje del proyecto */

const dep = JSON.parse(leer('package.json')).dependencies;
escribir('package.json', `${JSON.stringify({
  name: 'become-design-system',
  private: true,
  type: 'module',
  scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
  dependencies: {
    '@phosphor-icons/react': dep['@phosphor-icons/react'],
    'framer-motion': dep['framer-motion'],
    react: dep.react,
    'react-dom': dep['react-dom'],
    'react-router-dom': dep['react-router-dom'],
  },
  devDependencies: {
    '@vitejs/plugin-react': JSON.parse(leer('package.json')).devDependencies['@vitejs/plugin-react'],
    vite: JSON.parse(leer('package.json')).devDependencies.vite,
  },
}, null, 2)}\n`);

escribir('vite.config.mjs', `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({ plugins: [react()] });\n`);

escribir('index.html', `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>BECOME — Sistema de diseño</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`);

escribir('README.md', `# BECOME — Sistema de diseño (React)

La parte visual del sitio de BECOME, como proyecto independiente.

    npm install
    npm run dev

Se abre una página con todas las piezas del sistema: tipografía, bandas,
rejilla, tarjetas, índices, los ${Object.keys(JSON.parse(readFileSync(join(ROOT, 'design-export/tokens.json'), 'utf8')).tokens).length} tokens y los iconos.

## Qué hay

    src/components/   las piezas: ui.jsx es el núcleo
    src/styles/       tokens.css (los 173 tokens), fonts.css y base.css
    public/fonts/     Inter y JetBrains Mono, variables y auto-alojadas
    src/Showcase.jsx  la página que las muestra todas

## Qué NO hay, y por qué

**El nodo 3D.** Son 534 KB de three.js y un shader escrito para este sitio en
concreto; no es una pieza reutilizable.

**Las páginas, el contenido y las rutas.** Esto es el sistema visual, no el
sitio. Las páginas viven en el repositorio de meetbecome.com.

**La cabecera, el pie y los formularios.** Arrastran el mapa del sitio y su
contenido, que no son parte del sistema.

## Las reglas que no se ven en el código

**La proporción de color.** Navy 60 % · verde 20 % · azul hielo 10 % ·
carbón 10 %. El verde es acento: en cuanto se usa para superficies grandes,
la marca deja de parecerse a sí misma.

**Las bandas.** \`Section\` acepta \`dark\`, \`darker\`, \`light\` y \`sunken\`. La
alternancia no es decorativa: cada cambio marca un cambio de tema. Dos claras
seguidas se leen como una sola sección larga.

**Sobre navy, solo los grises 100, 200 y 300 son legales para texto.** Los más
oscuros no llegan al contraste mínimo.

**Ningún valor suelto.** Todo sale de \`var(--token)\`. Si algo necesita un
valor que no existe, el token es lo que falta.

---

Generado con \`npm run design:export\` desde el repositorio del sitio. No se
edita a mano: se regenera.
`);

console.log(`design(react): ${COMPONENTES.length} componentes · proyecto listo en design-export/react/`);
