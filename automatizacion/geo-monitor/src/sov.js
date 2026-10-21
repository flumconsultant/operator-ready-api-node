// Share of Voice, como lo define la Estrategia SEO/GEO de BCP: «visibilidad de
// la marca vs la competencia, con un score que pondera el peso de la posición,
// la prominencia y el contexto (positivo/neutral)». Sin dependencias: build.mjs
// lo pega en «Armar fila» y en «Datos del monitor».
//
// Score de cada banco en una respuesta:
//   posición     1 / posición               (1.º = 1, 2.º = 0,5, 3.º = 0,33…)
//   prominencia  sus menciones ÷ menciones de todos los bancos
//   contexto     positivo 1 · neutral 0,75 · negativo 0,25
//   score = (posición + prominencia) / 2 × contexto
// SoV de un banco = su score ÷ la suma de los scores de todos los bancos × 100.

function pesoContexto(sentimiento) {
  const s = Number(sentimiento);
  if (!isFinite(s)) return 0.75;
  return s > 0.2 ? 1 : s < -0.2 ? 0.25 : 0.75;
}

// detalle: [{marca, posicion, menciones, sentimiento}] → {marca: SoV 0-100}
function sovPorMarca(detalle) {
  const lista = (detalle || []).filter(d => d && d.marca);
  const totalMenciones = lista.reduce((n, d) => n + Math.max(0, Number(d.menciones) || 0), 0);
  const scores = {};
  for (const d of lista) {
    const pos = Number(d.posicion) > 0 ? 1 / Number(d.posicion) : 0;
    const prom = totalMenciones > 0 ? Math.max(0, Number(d.menciones) || 0) / totalMenciones : 0;
    scores[d.marca] = (scores[d.marca] || 0) + ((pos + prom) / 2) * pesoContexto(d.sentimiento);
  }
  const total = Object.values(scores).reduce((n, v) => n + v, 0);
  const sov = {};
  for (const m of Object.keys(scores)) sov[m] = total > 0 ? Math.round((scores[m] / total) * 1000) / 10 : 0;
  return sov;
}

// Detalle aproximado para filas sin desglose por banco: el orden de
// marcas_mencionadas da la posición, una mención cada uno y contexto neutral
// salvo BCP, que usa su sentimiento.
function detalleDesdeRanking(marcas, marcaPropia, sentimientoPropio, mencionesPropias) {
  return (marcas || []).map((m, i) => ({
    marca: m,
    posicion: i + 1,
    menciones: m === marcaPropia && mencionesPropias > 0 ? mencionesPropias : 1,
    // Sin desglose no hay sentimiento de los competidores: null (desconocido), no 0.
    sentimiento: m === marcaPropia ? sentimientoPropio : null
  }));
}

// El Analista devuelve el detalle como texto JSON. Se acepta con o sin
// ```json, y si no se puede leer se devuelve [].
function leerDetalle(texto) {
  if (Array.isArray(texto)) return texto;
  const s = String(texto || '').replace(/```(json)?/gi, '').trim();
  if (!s) return [];
  try {
    const v = JSON.parse(s.slice(s.indexOf('['), s.lastIndexOf(']') + 1));
    return Array.isArray(v) ? v : [];
  } catch (e) {
    return [];
  }
}
