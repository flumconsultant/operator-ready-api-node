// Lo que hace la corrida con las respuestas de los motores. Sin dependencias:
// build.mjs pega este archivo en los nodos Code «Juntar respuestas» y «Armar
// fila», y test.mjs lo carga igual para probarlo.
//
// Mencion, posicion, sentimiento y marcas los decide el nodo «Analista IA»
// (Information Extractor). Aqui solo se saca el texto y las fuentes de cada
// API, y se calcula citado_bcp, que sale de los dominios y no necesita IA.

// Sin `new URL`: el sandbox de los nodos Code de n8n no siempre lo trae.
function dominioDe(url) {
  const m = String(url || '').trim().toLowerCase().match(/^(?:[a-z][a-z0-9+.-]*:\/\/)?(?:[^@\/?#]*@)?([^\/?#:]+)/);
  const host = m ? m[1].replace(/^www\./, '').replace(/\.$/, '') : '';
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(host) ? host : '';
}

function esDominioPropio(dominio, dominios) {
  return dominios.some(d => dominio === d || dominio.endsWith('.' + d));
}

// Saca el texto, las fuentes ({url, title}) y las consultas de búsqueda que hizo
// el motor (fan-out) de lo que devuelve cada API. Si la llamada falló (el nodo
// HTTP sigue con {error}), lo deja anotado en vez de parar la corrida.
function extraerRespuesta(motor, r) {
  r = r || {};
  const vacia = { disponible: false, texto: '', fuentes: [], consultas: [], error: '' };
  if (r.error) {
    const e = r.error;
    const msg = typeof e === 'string' ? e : (e.message || (e.error && e.error.message) || JSON.stringify(e));
    return Object.assign(vacia, { error: String(msg).slice(0, 500) });
  }
  const f = (url, title) => ({ url: String(url || ''), title: String(title || '') });
  if (motor === 'chatgpt') {
    const msg = (r.choices && r.choices[0] && r.choices[0].message) || {};
    const fuentes = (msg.annotations || [])
      .filter(a => a.type === 'url_citation' && a.url_citation)
      .map(a => f(a.url_citation.url, a.url_citation.title));
    return { disponible: true, texto: msg.content || '', fuentes, consultas: [], error: '' };
  }
  if (motor === 'claude') {
    // Con búsqueda web, el texto llega partido en bloques (uno por cita): se
    // une sin separador para no cortar frases.
    const texto = (r.content || []).filter(c => c.type === 'text').map(c => c.text).join('');
    const fuentes = [];
    for (const c of r.content || []) for (const cit of c.citations || []) if (cit.url) fuentes.push(f(cit.url, cit.title));
    // Si no citó nada pero sí buscó, cuentan las páginas que consultó.
    if (!fuentes.length) {
      for (const c of r.content || []) {
        if (c.type === 'web_search_tool_result' && Array.isArray(c.content)) for (const w of c.content) if (w.url) fuentes.push(f(w.url, w.title));
      }
    }
    const consultas = (r.content || [])
      .filter(c => c.type === 'server_tool_use' && c.name === 'web_search' && c.input && c.input.query)
      .map(c => String(c.input.query));
    return { disponible: true, texto, fuentes, consultas, error: '' };
  }
  if (motor === 'gemini') {
    const cand = (r.candidates && r.candidates[0]) || {};
    const texto = ((cand.content && cand.content.parts) || []).map(p => p.text || '').join('');
    // Gemini devuelve enlaces de redirección (vertexaisearch…); el dominio real viene en title.
    const meta = cand.groundingMetadata || {};
    const fuentes = (meta.groundingChunks || []).filter(c => c.web).map(c => {
      const titulo = c.web.title || '';
      return /\./.test(titulo) && !/\s/.test(titulo) ? f('https://' + titulo + '/', titulo) : f(c.web.uri, titulo);
    });
    return { disponible: true, texto, fuentes, consultas: (meta.webSearchQueries || []).map(String), error: '' };
  }
  if (motor === 'perplexity') {
    const msg = (r.choices && r.choices[0] && r.choices[0].message) || {};
    const fuentes = (r.search_results || []).map(s => f(s.url, s.title)).concat((r.citations || []).map(u => f(u, '')));
    return { disponible: true, texto: msg.content || '', fuentes, consultas: [], error: '' };
  }
  if (motor === 'ai_overview') {
    const aio = r.ai_overview;
    if (!aio || aio.error || !(aio.text_blocks || []).length) return vacia;
    const partes = [];
    const recorrer = bloques => {
      for (const b of bloques || []) {
        const linea = [b.title, b.snippet].filter(Boolean).join(' ');
        if (linea) partes.push(linea);
        if (b.list) recorrer(b.list);
        if (b.text_blocks) recorrer(b.text_blocks);
      }
    };
    recorrer(aio.text_blocks);
    const fuentes = (aio.references || []).map(x => f(x.link || x.source, x.title)).filter(x => x.url);
    return { disponible: true, texto: partes.join('\n'), fuentes, consultas: [], error: '' };
  }
  return Object.assign(vacia, { error: 'Motor desconocido: ' + motor });
}

// Las cinco respuestas de un prompt, una por motor. `apis` trae lo que devolvió
// cada nodo HTTP para ese prompt: {chatgpt, claude, gemini, perplexity,
// google, ai_overview_pagina}.
function juntarRespuestas(prompt, apis) {
  const pagina = apis.ai_overview_pagina;
  // Si hubo segunda llamada, el AI Overview viene ahí; si no, en la búsqueda.
  const aio = pagina && pagina.ai_overview ? pagina : apis.google;
  const crudas = {
    chatgpt: apis.chatgpt, claude: apis.claude, gemini: apis.gemini,
    perplexity: apis.perplexity, ai_overview: aio
  };
  // Un motor apagado (por ejemplo SerpAPI) no viene en `apis`: no genera fila.
  return Object.keys(crudas).filter(motor => crudas[motor] !== undefined).map(motor => {
    const e = extraerRespuesta(motor, crudas[motor]);
    // fuentes: dominios únicos (para citado_bcp y la columna fuentes).
    // citas: cada URL citada una vez, con título y lugar en la respuesta.
    const fuentes = [];
    const citas = [];
    for (const x of e.fuentes) {
      const url = typeof x === 'string' ? x : x.url;
      const d = dominioDe(url);
      if (!d) continue;
      if (!fuentes.includes(d)) fuentes.push(d);
      const limpia = /^https?:\/\//i.test(url) ? url : 'https://' + url;
      if (!citas.some(c => c.url === limpia)) {
        citas.push({ url: limpia.slice(0, 500), title: String((x && x.title) || '').slice(0, 160), domain: d, position: citas.length + 1 });
      }
    }
    return {
      run_id: prompt.run_id, fecha: prompt.fecha, timestamp: prompt.timestamp,
      prompt_id: prompt.id, proyecto: prompt.proyecto, categoria: prompt.categoria, prompt: prompt.prompt,
      motor,
      // ok: respondió. sin_overview: Google no mostró AI Overview. error: falló la llamada.
      estado: e.error ? 'error' : e.disponible ? 'ok' : 'sin_overview',
      texto: e.texto,
      fuentes,
      citas,
      consultas: (e.consultas || []).slice(0, 10),
      error: e.error
    };
  });
}

// «Banco Pichincha» → «Pichincha»: los nombres que devuelve el Analista pasan a
// los canónicos de config.js. Los bancos que no están en la lista quedan igual.
function marcasCanonicas(texto, config) {
  const clave = x => String(x || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const marcas = [config.marca].concat(config.competidores || []);
  const salida = [];
  for (const nombre of String(texto || '').split(',').map(x => x.trim()).filter(Boolean)) {
    const m = marcas.find(b => [b.nombre].concat(b.alias || []).some(a => clave(a) === clave(nombre)));
    const final = m ? m.nombre : nombre;
    if (!salida.includes(final)) salida.push(final);
  }
  return salida.join(', ');
}

function entero(v) {
  const n = Math.round(Number(v));
  return isFinite(n) && n > 0 ? n : 0;
}

// La fila de la hoja resultados: la respuesta más lo que dijo el Analista IA.
// Si el motor no respondió, no hay nada que analizar y la fila va sin mención.
function armarFila(r, analisis, config) {
  // Si el motor respondió pero el Analista falló, la fila no se puede contar:
  // va como error, no como «no menciona a BCP».
  if (r.estado === 'ok' && !analisis) {
    r = Object.assign({}, r, { estado: 'error', error: 'El Analista IA no devolvió resultado' });
  }
  const a = (r.estado === 'ok' && analisis) || {};
  const menciona = r.estado === 'ok' && (a.menciona_bcp === true || String(a.menciona_bcp).toLowerCase() === 'true');
  const posicion = Number(a.posicion_bcp);
  const sentimiento = Number(a.sentimiento);
  const dominios = (config.marca.dominios || []).map(d => d.toLowerCase());
  const detalle = r.estado === 'ok' ? detalleCanonico(a.detalle_marcas, config) : [];
  const sov = sovPorMarca(detalle);
  return {
    run_id: r.run_id, fecha: r.fecha, timestamp: r.timestamp, prompt_id: r.prompt_id,
    proyecto: r.proyecto, categoria: r.categoria, prompt: r.prompt, motor: r.motor,
    estado: r.estado,
    menciona_bcp: menciona,
    posicion_bcp: menciona && posicion > 0 ? posicion : '',
    sentimiento: menciona && isFinite(sentimiento) ? Math.max(-1, Math.min(1, Math.round(sentimiento * 100) / 100)) : '',
    marcas_mencionadas: r.estado === 'ok' ? marcasCanonicas(a.marcas_mencionadas, config) : '',
    fuentes: r.fuentes.join(', '),
    citado_bcp: r.fuentes.some(d => esDominioPropio(d, dominios)),
    error: r.error || '',
    // Google Sheets no admite más de 50.000 caracteres por celda.
    respuesta: String(r.texto || '').slice(0, 20000),
    // Para el SOV por respuesta: veces que se nombra a BCP ÷ veces que se nombra a cualquier banco.
    n_menciones_bcp: menciona ? entero(a.n_menciones_bcp) : 0,
    n_menciones_bancos: r.estado === 'ok' ? entero(a.n_menciones_bancos) : 0,
    // Desglose por banco del Analista (nombres canónicos) y el Share of Voice de BCP.
    detalle_marcas: detalle.length ? JSON.stringify(detalle) : '',
    sov_bcp: r.estado !== 'ok' ? '' : menciona ? (sov[config.marca.nombre] || 0) : 0,
    // Cada URL citada (con título y lugar) y las consultas que hizo el motor al buscar.
    fuentes_detalle: (r.citas || []).length ? JSON.stringify(r.citas.slice(0, 40)) : '',
    consultas_busqueda: (r.consultas || []).length ? JSON.stringify(r.consultas) : ''
  };
}

// El detalle por banco del Analista, con nombres canónicos y un banco por fila
// (si la IA repite un banco con dos nombres, se suman sus menciones).
function detalleCanonico(texto, config) {
  const porMarca = new Map();
  for (const d of leerDetalle(texto)) {
    const marca = marcasCanonicas(d && d.marca, config);
    if (!marca) continue;
    const pos = Math.round(Number(d.posicion));
    const s = Number(d.sentimiento);
    const actual = porMarca.get(marca) || { marca, posicion: 0, menciones: 0, sentimiento: 0, recomendada: false, atributos: [] };
    if (pos > 0 && (!actual.posicion || pos < actual.posicion)) actual.posicion = pos;
    actual.menciones += Math.max(1, entero(d.menciones));
    if (isFinite(s)) actual.sentimiento = Math.max(-1, Math.min(1, Math.round(s * 100) / 100));
    // recomendada: la respuesta la propone como opción a elegir (probabilidad de compra).
    if (d.recomendada === true || String(d.recomendada).toLowerCase() === 'true') actual.recomendada = true;
    // atributos: solo los del vocabulario de config.js (perfil de marca).
    const vocab = (config.atributos || []).map(a => a.toLowerCase());
    for (const at of Array.isArray(d.atributos) ? d.atributos : []) {
      const k = String(at || '').toLowerCase().trim();
      if (vocab.includes(k) && !actual.atributos.includes(k)) actual.atributos.push(k);
    }
    porMarca.set(marca, actual);
  }
  // Posiciones 1..n en el orden que dio la IA, sin huecos.
  return [...porMarca.values()]
    .sort((x, y) => (x.posicion || 99) - (y.posicion || 99))
    .map((d, i) => Object.assign(d, { posicion: i + 1 }));
}
