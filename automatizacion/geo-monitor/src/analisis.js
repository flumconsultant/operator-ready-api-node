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
        const linea = [b.title, b.snippet].filter(Boolean).join(' ');
        if (linea) partes.push(linea);
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
  return Object.keys(crudas).map(motor => {
    const e = extraerRespuesta(motor, crudas[motor]);
    const fuentes = [];
    for (const f of e.fuentes) {
      const d = dominioDe(f);
      if (d && !fuentes.includes(d)) fuentes.push(d);
    }
    return {
      run_id: prompt.run_id, fecha: prompt.fecha, timestamp: prompt.timestamp,
      prompt_id: prompt.id, proyecto: prompt.proyecto, categoria: prompt.categoria, prompt: prompt.prompt,
      motor,
      // ok: respondió. sin_overview: Google no mostró AI Overview. error: falló la llamada.
      estado: e.error ? 'error' : e.disponible ? 'ok' : 'sin_overview',
      texto: e.texto,
      fuentes,
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
    n_menciones_bancos: r.estado === 'ok' ? entero(a.n_menciones_bancos) : 0
  };
}
