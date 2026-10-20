// Análisis de una respuesta de un motor de IA. Sin dependencias: build.mjs pega
// este archivo tal cual dentro del nodo Code «Analizar respuesta» de n8n, y
// test.mjs lo carga igual para probarlo con respuestas de ejemplo.

function normalizarTexto(s) {
  return String(s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

function escaparRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Posiciones (en el texto normalizado) donde aparece cualquiera de los alias.
// Límite de palabra hecho a mano porque \b no entiende de letras con tilde.
function buscarAlias(textoNorm, alias) {
  const posiciones = [];
  for (const a of alias) {
    const re = new RegExp('(^|[^a-z0-9])(' + escaparRegex(normalizarTexto(a)) + ')(?=$|[^a-z0-9])', 'g');
    let m;
    while ((m = re.exec(textoNorm))) {
      posiciones.push({ inicio: m.index + m[1].length, fin: m.index + m[1].length + m[2].length });
      re.lastIndex = m.index + m[0].length;
    }
  }
  return posiciones.sort((x, y) => x.inicio - y.inicio);
}

function dominioDe(url) {
  const s = String(url || '').trim();
  if (!s) return '';
  try {
    const u = new URL(/^https?:\/\//i.test(s) ? s : 'https://' + s);
    return u.hostname.toLowerCase().replace(/^www\./, '');
  } catch (e) {
    return '';
  }
}

function esDominioPropio(dominio, dominios) {
  return dominios.some(d => dominio === d || dominio.endsWith('.' + d));
}

const PALABRAS_POSITIVAS = [
  'mejor', 'mejores', 'lider', 'lideres', 'liderazgo', 'confiable', 'confiables', 'confianza',
  'seguro', 'segura', 'seguridad', 'solido', 'solida', 'solidez', 'recomendado', 'recomendable',
  'recomiendo', 'destaca', 'destacado', 'destacan', 'excelente', 'buena', 'bueno', 'buenas',
  'buenos', 'facil', 'faciles', 'rapido', 'rapida', 'agil', 'innovador', 'innovadora',
  'innovacion', 'popular', 'preferido', 'ventaja', 'ventajas', 'beneficio', 'beneficios',
  'amplia', 'amplio', 'completo', 'completa', 'conveniente', 'competitivo', 'competitivas',
  'atractivo', 'atractivas', 'eficiente', 'premiado', 'reconocido', 'robusto', 'comodo',
  'gratis', 'gratuito', 'gratuita', 'favorito', 'satisfaccion', 'moderno', 'moderna'
];

const PALABRAS_NEGATIVAS = [
  'peor', 'malo', 'mala', 'malos', 'malas', 'problema', 'problemas', 'queja', 'quejas',
  'reclamo', 'reclamos', 'caro', 'cara', 'caros', 'costoso', 'costosa', 'costosas',
  'lento', 'lenta', 'fraude', 'fraudes', 'estafa', 'estafas', 'falla', 'fallas', 'caida',
  'caidas', 'inseguro', 'deficiente', 'critica', 'criticas', 'criticado', 'denuncia',
  'denuncias', 'multa', 'multas', 'sancion', 'sancionado', 'riesgo', 'complicado',
  'complicada', 'dificil', 'demora', 'demoras', 'cobros', 'comisiones', 'insatisfaccion',
  'desventaja', 'desventajas', 'limitado', 'limitada', 'engorroso', 'burocratico'
];

const NEGADORES = ['no', 'nunca', 'sin', 'tampoco', 'ni'];

// Ventana de palabras alrededor de cada mención. Un negador en las dos palabras
// previas le da la vuelta («sin comisiones» suma, «no es seguro» resta). Cada
// palabra cuenta una vez aunque caiga en la ventana de dos menciones.
function sentimientoAlrededor(textoNorm, menciones, ventana) {
  if (!menciones.length) return null;
  const pos = new Set(PALABRAS_POSITIVAS);
  const neg = new Set(PALABRAS_NEGATIVAS);
  const tokens = [];
  const re = /[a-z0-9ñ]+/g;
  let t;
  while ((t = re.exec(textoNorm))) tokens.push({ w: t[0], inicio: t.index });
  const contadas = new Set();
  let p = 0, n = 0;
  for (const m of menciones) {
    let i0 = tokens.findIndex(x => x.inicio >= m.inicio);
    if (i0 < 0) i0 = tokens.length;
    let i1 = i0;
    while (i1 < tokens.length && tokens[i1].inicio < m.fin) i1++;
    for (let j = Math.max(0, i0 - ventana); j < Math.min(tokens.length, i1 + ventana); j++) {
      if (j >= i0 && j < i1) continue;
      if (contadas.has(j)) continue;
      let signo = pos.has(tokens[j].w) ? 1 : neg.has(tokens[j].w) ? -1 : 0;
      if (!signo) continue;
      contadas.add(j);
      const previas = [tokens[j - 1], tokens[j - 2]].filter(Boolean).map(x => x.w);
      if (previas.some(x => NEGADORES.includes(x))) signo = -signo;
      if (signo > 0) p++; else n++;
    }
  }
  if (p + n === 0) return 0;
  return Math.round(((p - n) / (p + n)) * 100) / 100;
}

// config: { marca: {nombre, alias, dominios}, competidores: [{nombre, alias, dominios}], ventana_sentimiento }
// entrada: { texto, fuentes: [url|dominio] }
function analizarRespuesta(entrada, config) {
  const texto = String(entrada.texto || '');
  const norm = normalizarTexto(texto);
  const marcas = [config.marca].concat(config.competidores || []);

  const encontradas = [];
  for (const m of marcas) {
    const pos = buscarAlias(norm, m.alias && m.alias.length ? m.alias : [m.nombre]);
    if (pos.length) encontradas.push({ nombre: m.nombre, primera: pos[0].inicio, menciones: pos });
  }
  encontradas.sort((a, b) => a.primera - b.primera);

  const propia = encontradas.find(e => e.nombre === config.marca.nombre);
  const fuentes = [];
  for (const f of entrada.fuentes || []) {
    const d = dominioDe(f);
    if (d && !fuentes.includes(d)) fuentes.push(d);
  }
  const dominiosPropios = (config.marca.dominios || []).map(d => d.toLowerCase());

  return {
    menciona: Boolean(propia),
    posicion: propia ? encontradas.indexOf(propia) + 1 : '',
    sentimiento: propia ? sentimientoAlrededor(norm, propia.menciones, config.ventana_sentimiento || 12) : '',
    citado: fuentes.some(d => esDominioPropio(d, dominiosPropios)),
    marcas: encontradas.map(e => e.nombre),
    fuentes
  };
}

// Saca el texto y las fuentes de lo que devuelve cada API. Si la llamada falló
// (el nodo HTTP sigue con {error}), lo deja anotado en vez de parar la corrida.
function extraerRespuesta(motor, r) {
  r = r || {};
  if (r.error) {
    const e = r.error;
    const msg = typeof e === 'string' ? e : (e.message || (e.error && e.error.message) || JSON.stringify(e));
    return { disponible: false, texto: '', fuentes: [], error: String(msg).slice(0, 500) };
  }
  if (motor === 'chatgpt') {
    const msg = (r.choices && r.choices[0] && r.choices[0].message) || {};
    const fuentes = (msg.annotations || [])
      .filter(a => a.type === 'url_citation' && a.url_citation)
      .map(a => a.url_citation.url);
    return { disponible: true, texto: msg.content || '', fuentes, error: '' };
  }
  if (motor === 'claude') {
    const texto = (r.content || []).filter(c => c.type === 'text').map(c => c.text).join('\n');
    const fuentes = [];
    for (const c of r.content || []) for (const cit of c.citations || []) if (cit.url) fuentes.push(cit.url);
    return { disponible: true, texto, fuentes, error: '' };
  }
  if (motor === 'gemini') {
    const cand = (r.candidates && r.candidates[0]) || {};
    const texto = ((cand.content && cand.content.parts) || []).map(p => p.text || '').join('');
    // Gemini devuelve enlaces de redirección (vertexaisearch…); el dominio real viene en title.
    const chunks = (cand.groundingMetadata && cand.groundingMetadata.groundingChunks) || [];
    const fuentes = chunks.map(c => c.web && (/\./.test(c.web.title || '') ? c.web.title : c.web.uri)).filter(Boolean);
    return { disponible: true, texto, fuentes, error: '' };
  }
  if (motor === 'perplexity') {
    const msg = (r.choices && r.choices[0] && r.choices[0].message) || {};
    const fuentes = (r.search_results || []).map(s => s.url).concat(r.citations || []);
    return { disponible: true, texto: msg.content || '', fuentes, error: '' };
  }
  if (motor === 'ai_overview') {
    const aio = r.ai_overview;
    if (!aio || aio.error || !(aio.text_blocks || []).length) {
      return { disponible: false, texto: '', fuentes: [], error: '' };
    }
    const partes = [];
    const recorrer = bloques => {
      for (const b of bloques || []) {
        if (b.title) partes.push(b.title);
        if (b.snippet) partes.push(b.snippet);
        if (b.list) recorrer(b.list);
        if (b.text_blocks) recorrer(b.text_blocks);
      }
    };
    recorrer(aio.text_blocks);
    const fuentes = (aio.references || []).map(x => x.link || x.source).filter(Boolean);
    return { disponible: true, texto: partes.join('\n'), fuentes, error: '' };
  }
  return { disponible: false, texto: '', fuentes: [], error: 'Motor desconocido: ' + motor };
}

// La fila que se escribe en la hoja Resultados para un prompt y un motor.
function filaResultado(motor, respuestaApi, prompt, config) {
  const e = extraerRespuesta(motor, respuestaApi);
  const a = e.disponible
    ? analizarRespuesta(e, config)
    : { menciona: false, posicion: '', sentimiento: '', citado: false, marcas: [], fuentes: [] };
  return {
    run_id: prompt.run_id,
    fecha: prompt.fecha,
    timestamp: prompt.timestamp,
    prompt_id: prompt.id,
    proyecto: prompt.proyecto,
    prompt: prompt.prompt,
    categoria: prompt.categoria,
    motor,
    disponible: e.disponible,
    menciona: a.menciona,
    posicion: a.posicion,
    sentimiento: a.sentimiento === null ? '' : a.sentimiento,
    citado: a.citado,
    marcas: a.marcas.join(', '),
    fuentes: a.fuentes.join(', '),
    // Google Sheets no admite más de 50.000 caracteres por celda.
    respuesta: e.texto.slice(0, 20000),
    error: e.error
  };
}
