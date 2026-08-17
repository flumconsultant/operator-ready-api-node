/**
 * Migración de los artboards Durable (.dc.html) a componentes React.
 *
 * Es una herramienta de un solo uso: lee templates/website-es/*.dc.html y
 * escribe src/pages y src/components. La salida es el código fuente real de la
 * app — esto no corre en runtime. Se conserva en el repo para poder repetir la
 * migración si la maqueta cambia antes de que se retire.
 *
 *   node scripts/dc-to-jsx.mjs
 */
import { parse } from 'parse5';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const SRC = 'templates/website-es';
const OUT_PAGES = 'src/pages';
const OUT_COMPONENTS = 'src/components';

/* Artboard -> componente React + ruta del router. */
const PAGES = {
  'WebsiteEs': { comp: 'Home', route: '/' },
  'PaginaFramework': { comp: 'Framework', route: '/como-trabajamos' },
  'PaginaDiscovery': { comp: 'Discovery', route: '/discovery' },
  'PaginaBuildEmbed': { comp: 'BuildEmbed', route: '/build-embed' },
  'PaginaTrabajo': { comp: 'Trabajo', route: '/casos' },
  'PaginaThinking': { comp: 'Thinking', route: '/insights' },
  'PaginaNosotros': { comp: 'Nosotros', route: '/nosotros' },
  'PaginaContacto': { comp: 'Contacto', route: '/contacto' },
};
const COMPONENTS = { 'SiteHeaderEs': 'SiteHeader', 'SiteFooterEs': 'SiteFooter' };

/* Atributos HTML que en JSX cambian de nombre. */
const ATTR_MAP = {
  'class': 'className', 'for': 'htmlFor', 'fetchpriority': 'fetchPriority',
  'stroke-width': 'strokeWidth', 'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin', 'vector-effect': 'vectorEffect',
  'stroke-dasharray': 'strokeDasharray', 'fill-rule': 'fillRule',
  'clip-rule': 'clipRule', 'stop-color': 'stopColor', 'tabindex': 'tabIndex',
  'maxlength': 'maxLength', 'readonly': 'readOnly', 'colspan': 'colSpan',
  'autocomplete': 'autoComplete', 'onclick': 'onClick', 'onsubmit': 'onSubmit',
  'onchange': 'onChange', 'oninput': 'onInput', 'preserveaspectratio': 'preserveAspectRatio',
  'viewbox': 'viewBox', 'crossorigin': 'crossOrigin', 'srcset': 'srcSet',
};

/* Solo estos van sin valor en JSX; el resto conserva su cadena (alt="" incluido). */
const BOOLEAN_ATTRS = new Set(['required', 'disabled', 'checked', 'readOnly', 'autoFocus', 'multiple', 'hidden', 'open', 'selected', 'controls', 'loop', 'muted', 'playsInline', 'noValidate', 'defaultChecked']);
const VOID = new Set(['img', 'input', 'br', 'hr', 'meta', 'link', 'source', 'path', 'circle', 'rect', 'line', 'use', 'stop', 'polygon', 'polyline', 'ellipse']);

/* Los estilos :hover se recogen aquí y se emiten como una hoja generada. */
const hoverRules = new Map();
function hoverClass(decls) {
  const key = decls.trim().replace(/;$/, '');
  if (!hoverRules.has(key)) {
    hoverRules.set(key, 'hv-' + crypto.createHash('sha1').update(key).digest('hex').slice(0, 7));
  }
  return hoverRules.get(key);
}

/* "a:b;c:d" -> objeto de estilo JSX. Las custom properties van tal cual. */
function styleToObject(css) {
  const out = [];
  let depth = 0, buf = '';
  for (const ch of css) {          // no partir por ";" dentro de url(...) o gradientes
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ';' && depth === 0) { out.push(buf); buf = ''; } else buf += ch;
  }
  out.push(buf);
  const pairs = [];
  for (const decl of out) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    const val = decl.slice(i + 1).trim();
    if (!prop || !val) continue;
    const key = prop.startsWith('--') ? `'${prop}'` : prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    pairs.push(`${key}: ${JSON.stringify(val)}`);
  }
  return pairs.length ? `{ ${pairs.join(', ')} }` : null;
}

/* ./PaginaX.dc.html[#hash] -> ruta del router. Devuelve null si es externo. */
function toRoute(href) {
  const m = /^\.\/([A-Za-z]+)\.dc\.html(#.*)?$/.exec(href || '');
  if (!m) return null;
  const page = PAGES[m[1]];
  if (!page) return null;
  return page.route + (m[2] || '');
}

const esc = (s) => s.replace(/([{}])/g, '{"$1"}');

function serialize(node, ctx, indent) {
  const pad = '  '.repeat(indent);

  if (node.nodeName === '#text') {
    const t = node.value;
    if (!t.trim()) return t.includes('\n') ? '' : (t ? `${pad}{' '}\n` : '');
    return pad + esc(t.trim()) + '\n';
  }
  if (node.nodeName === '#comment') return '';

  const tag = node.nodeName;
  const attrs = Object.fromEntries((node.attrs || []).map((a) => [a.name, a.value]));
  const kids = (node.childNodes || []).filter(
    (c) => !(c.nodeName === '#text' && !c.value.trim()) || (c.value || '').includes(' ')
  );
  const body = () => (node.childNodes || []).map((c) => serialize(c, ctx, indent + 1)).join('');

  /* --- Elementos propios del formato Durable --- */
  if (tag === 'x-dc') return body();
  if (tag === 'helmet' || tag === 'script' || tag === 'style') return '';

  if (tag === 'dc-import') {
    const name = COMPONENTS[attrs.name];
    if (!name) return '';
    ctx.imports.add(name);
    return `${pad}<${name} />\n`;
  }

  if (tag === 'sc-if') {
    const expr = (/{{\s*(.*?)\s*}}/.exec(attrs.value) || [, 'false'])[1];
    ctx.vals.add(expr);
    return `${pad}{${expr} && (\n${pad}  <>\n${body()}${pad}  </>\n${pad})}\n`;
  }

  /* --- Elemento normal --- */
  const props = [];
  let isReveal = false;
  let name = tag;

  /* data-reveal -> componente Reveal (framer-motion), conservando la etiqueta. */
  if ('data-reveal' in attrs) {
    isReveal = true;
    ctx.imports.add('Reveal');
    name = 'Reveal';
    props.push(`as="${tag}"`);
  }

  /* href interno -> <Link to>. Sobre <Reveal as="a"> se pasa as={Link}. */
  let linkTo = null;
  if (tag === 'a' && attrs.href) {
    linkTo = toRoute(attrs.href);
    if (linkTo) {
      ctx.needsLink = true;
      if (isReveal) props[0] = 'as={Link}';
      else name = 'Link';
    }
  }

  const classes = [];
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'data-reveal') continue;
    if (k === 'hint-size' || k === 'hint-placeholder-val' || k === 'data-props') continue;
    if (k === 'style-hover') { classes.push(hoverClass(v)); continue; }
    if (k === 'class') { classes.push(v); continue; }

    if (k === 'style') {
      const obj = styleToObject(v);
      if (obj) props.push(`style={${obj}}`);
      continue;
    }
    if (k === 'href' && linkTo) { props.push(`to=${JSON.stringify(linkTo)}`); continue; }

    const jsxName = ATTR_MAP[k] || k;

    /* onClick="{{ toggle }}" -> onClick={toggle} */
    const bind = /^{{\s*(.*?)\s*}}$/.exec(v);
    if (/^on[A-Z]/.test(jsxName) && bind) {
      ctx.vals.add(bind[1]);
      props.push(`${jsxName}={${bind[1]}}`);
      continue;
    }

    props.push(v === '' && BOOLEAN_ATTRS.has(jsxName) ? jsxName : `${jsxName}=${JSON.stringify(v)}`);
  }
  if (classes.length) props.push(`className=${JSON.stringify(classes.join(' '))}`);

  const head = `<${name}${props.length ? ' ' + props.join(' ') : ''}`;
  if (VOID.has(tag) && !isReveal) return `${pad}${head} />\n`;
  if (!kids.length) return `${pad}${head} />\n`;
  return `${pad}${head}>\n${body()}${pad}</${name}>\n`;
}

function convert(file, compName, isPage) {
  const html = fs.readFileSync(path.join(SRC, file), 'utf8');
  const doc = parse(html);

  /* localizar <x-dc> */
  let xdc = null;
  (function walk(n) {
    if (n.nodeName === 'x-dc') { xdc = n; return; }
    (n.childNodes || []).forEach(walk);
  })(doc);
  if (!xdc) throw new Error('sin <x-dc>: ' + file);

  const ctx = { imports: new Set(), vals: new Set(), needsLink: false };
  let jsx = xdc.childNodes.map((c) => serialize(c, ctx, 3)).join('');

  /* Rutas de assets: la app sirve assets/ como publicDir, así que /images/... */
  jsx = jsx.replace(/\.\.\/\.\.\/assets\//g, '/');

  const imports = ["import React from 'react';"];
  if (ctx.needsLink) imports.push("import { Link } from 'react-router-dom';");
  for (const i of [...ctx.imports].sort()) {
    if (i === 'Reveal') imports.push(`import Reveal from '${isPage ? '../components' : '.'}/Reveal.jsx';`);
    else imports.push(`import ${i} from '${isPage ? '../components' : '.'}/${i}.jsx';`);
  }

  const logic = LOGIC[compName] || '';
  const out = `${imports.join('\n')}\n\n/* Migrado de ${SRC}/${file} por scripts/dc-to-jsx.mjs */\nexport default function ${compName}() {\n${logic}  return (\n    <>\n${jsx}    </>\n  );\n}\n`;

  const dir = isPage ? OUT_PAGES : OUT_COMPONENTS;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, compName + '.jsx'), out);
  return { compName, vals: [...ctx.vals] };
}

/* El estado que en Durable vivía en `class Component extends DCLogic`. */
const LOGIC = {
  SiteHeader: `  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen((o) => !o);
  const { pathname } = useLocation();
  React.useEffect(() => { setOpen(false); }, [pathname]);
  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

`,
  Contacto: `  const [sent, setSent] = React.useState(false);
  const pending = !sent;
  const submitted = sent;
  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

`,
};

/* ---- ejecutar ---- */
fs.mkdirSync(OUT_COMPONENTS, { recursive: true });
const done = [];
for (const [file, name] of Object.entries(COMPONENTS)) done.push(convert(file + '.dc.html', name, false));
for (const [file, { comp }] of Object.entries(PAGES)) done.push(convert(file + '.dc.html', comp, true));

/* SiteHeader usa useLocation para cerrar el menú al navegar. */
{
  const p = path.join(OUT_COMPONENTS, 'SiteHeader.jsx');
  let s = fs.readFileSync(p, 'utf8');
  s = s.replace("import { Link } from 'react-router-dom';", "import { Link, useLocation } from 'react-router-dom';");
  fs.writeFileSync(p, s);
}

/* Hoja de estilos generada con los :hover que venían en style-hover. */
const css = [...hoverRules.entries()]
  .map(([decls, cls]) => `.${cls}:hover{${decls.replace(/;$/, '')}}`)
  .join('\n');
fs.writeFileSync('src/styles/hover.generated.css', `/* Generado por scripts/dc-to-jsx.mjs desde los atributos style-hover. No editar a mano. */\n${css}\n`);

/* Rutas del router. */
const routes = Object.entries(PAGES).map(([, v]) => v);
/* Cada ruta en su propio chunk: la home no descarga las otras siete páginas. */
fs.writeFileSync('src/routes.generated.jsx',
  `/* Generado por scripts/dc-to-jsx.mjs. No editar a mano. */\nimport { lazy } from 'react';\n\n` +
  routes.map((r) => `const ${r.comp} = lazy(() => import('./pages/${r.comp}.jsx'));`).join('\n') +
  `\n\nexport const routes = [\n` +
  routes.map((r) => `  { path: '${r.route}', element: <${r.comp} /> },`).join('\n') +
  `\n];\n`);

console.log(`${done.length} componentes · ${hoverRules.size} reglas :hover · ${routes.length} rutas`);
