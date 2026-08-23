// Revisa la interfaz contra lo que se puede comprobar sin criterio.
//
//   cd pulse/web && npm run revisar:interfaz
//
// Comprueba cuatro cosas en las cinco pantallas principales: contraste de todo
// el texto visible (AA), tamaño de las áreas pulsables, saltos en la jerarquía
// de encabezados y que todo lo que recibe el foco con el tabulador lo enseñe.
//
// Necesita la aplicación levantada y la semilla cargada, porque entra con la
// cuenta de demostración. Es lo que se ejecutó al construir el feed social, y
// está aquí para poder repetirlo antes de cada cambio grande de interfaz en vez
// de mirarlo a ojo.
//
// Lo que NO comprueba, y hay que seguir mirando a mano: si el orden de lectura
// tiene sentido, si los textos alternativos describen algo útil, y si la página
// se entiende con un lector de pantalla de verdad.

import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3000";
const CUENTA = { email: "carlos@demo.pe", password: "pulse-demo-2026" };
const RUTAS = ["/feed", "/notificaciones", "/perfil", "/admin", "/panel"];

function luminancia([r, g, b]) {
  const f = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contraste(a, b) {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const aRgb = (s) => (s.match(/\d+(\.\d+)?/g) ?? []).slice(0, 3).map(Number);

// En un entorno donde Playwright ya trae su Chromium, esto basta. Si el
// navegador vive en otro sitio —un runner de CI con la imagen preinstalada—,
// se indica con CHROMIUM_PATH en vez de volver a descargar 150 MB.
const navegador = await chromium.launch(
  process.env.CHROMIUM_PATH
    ? { executablePath: process.env.CHROMIUM_PATH, args: ["--no-sandbox"] }
    : {},
);
const contexto = await navegador.newContext({
  viewport: { width: 1440, height: 980 },
  locale: "es-PE",
});
const pagina = await contexto.newPage();

await pagina.goto(`${BASE}/acceder`, { waitUntil: "networkidle" });
await pagina.fill("#email", CUENTA.email);
await pagina.fill("#password", CUENTA.password);
await Promise.all([
  pagina.waitForURL("**/feed", { timeout: 20000 }),
  pagina.click('button[type="submit"]'),
]);

let problemas = 0;

for (const ruta of RUTAS) {
  await pagina.goto(`${BASE}${ruta}`, { waitUntil: "networkidle" });
  await pagina.waitForTimeout(400);

  const datos = await pagina.evaluate(() => {
    // Compone las capas translúcidas de arriba abajo. Sin esto, un texto blanco
    // sobre un tinte verde al 12% encima de navy se mide contra el verde puro y
    // sale un 1.34 que no existe en pantalla — pasó exactamente así la primera
    // vez que se ejecutó esto.
    const fondoDe = (el) => {
      const capas = [];
      let n = el;
      while (n && n !== document.documentElement) {
        const m = (getComputedStyle(n).backgroundColor || "").match(/[\d.]+/g);
        if (m) {
          const [r, g, b, a = 1] = m.map(Number);
          if (a > 0) {
            capas.push([r, g, b, a]);
            if (a >= 1) break;
          }
        }
        n = n.parentElement;
      }
      if (!capas.length || capas.at(-1)[3] < 1) capas.push([255, 255, 255, 1]);
      let acc = capas.pop().slice(0, 3);
      while (capas.length) {
        const [r, g, b, a] = capas.pop();
        acc = [0, 1, 2].map((i) => Math.round([r, g, b][i] * a + acc[i] * (1 - a)));
      }
      return `rgb(${acc.join(", ")})`;
    };

    const textos = [];
    for (const el of document.querySelectorAll("body *")) {
      if (el.children.length > 0) continue;
      const t = (el.textContent ?? "").trim();
      if (!t) continue;
      const e = getComputedStyle(el);
      if (e.display === "none" || e.visibility === "hidden" || e.opacity === "0") continue;
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;
      textos.push({
        texto: t.slice(0, 40),
        color: e.color,
        fondo: fondoDe(el),
        px: parseFloat(e.fontSize),
        peso: parseInt(e.fontWeight) || 400,
      });
    }

    const pequenos = [];
    for (const el of document.querySelectorAll("button, [role=menuitemradio], select, textarea")) {
      // Los enlaces de texto dentro de una frase y los campos ocultos detrás de
      // una etiqueta quedan fuera: WCAG 2.2 exceptúa explícitamente los
      // objetivos en línea, y el campo de archivo se pulsa por su etiqueta.
      const e = getComputedStyle(el);
      if (e.display === "none" || e.visibility === "hidden") continue;
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;
      if (r.width < 24 || r.height < 24) {
        pequenos.push({
          que: (el.textContent || el.getAttribute("aria-label") || el.tagName).trim().slice(0, 30),
          w: Math.round(r.width),
          h: Math.round(r.height),
        });
      }
    }

    const encabezados = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => +h.tagName[1]);
    return { textos, pequenos, encabezados };
  });

  const bajos = new Set();
  for (const t of datos.textos) {
    const grande = t.px >= 24 || (t.px >= 18.66 && t.peso >= 700);
    const minimo = grande ? 3 : 4.5;
    const r = contraste(aRgb(t.color), aRgb(t.fondo));
    if (r < minimo) {
      bajos.add(`${r.toFixed(2)} (mín ${minimo}) — «${t.texto}» ${t.color} sobre ${t.fondo}`);
    }
  }

  const saltos = [];
  for (let i = 1; i < datos.encabezados.length; i++) {
    if (datos.encabezados[i] - datos.encabezados[i - 1] > 1) {
      saltos.push(`h${datos.encabezados[i - 1]} → h${datos.encabezados[i]}`);
    }
  }

  problemas += bajos.size + datos.pequenos.length + saltos.length;

  console.log(`\n=== ${ruta} ===`);
  console.log(bajos.size ? `contraste:\n  ${[...bajos].join("\n  ")}` : "contraste: todo pasa AA");
  console.log(`áreas pulsables por debajo de 24px: ${datos.pequenos.length ? JSON.stringify(datos.pequenos) : "ninguna"}`);
  console.log(`saltos de encabezado: ${saltos.length ? saltos.join(", ") : "ninguno"}`);
}

// El foco tiene que verse en todo lo que lo recibe.
await pagina.goto(`${BASE}/feed`, { waitUntil: "networkidle" });
await pagina.waitForTimeout(300);

let sinAnillo = 0;
let recorridos = 0;
for (let i = 0; i < 40; i++) {
  await pagina.keyboard.press("Tab");
  const r = await pagina.evaluate(() => {
    const a = document.activeElement;
    if (!a || a === document.body) return null;
    const e = getComputedStyle(a);
    return {
      visible: e.boxShadow !== "none" || e.outlineStyle !== "none",
      que: (a.textContent || a.getAttribute("aria-label") || a.tagName).trim().slice(0, 30),
    };
  });
  if (!r) continue;
  recorridos++;
  if (!r.visible) {
    sinAnillo++;
    problemas++;
    console.log(`  sin indicador de foco: ${r.que}`);
  }
}

console.log(`\n=== teclado ===`);
console.log(`${recorridos} elementos recorridos, ${sinAnillo} sin indicador de foco`);

await navegador.close();

console.log(`\n${problemas === 0 ? "Sin problemas." : `${problemas} problema(s).`}`);
process.exit(problemas === 0 ? 0 : 1);
