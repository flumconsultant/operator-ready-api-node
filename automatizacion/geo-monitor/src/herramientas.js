// Herramientas GEO (SPEC v2 · V7 y V8): auditoría de crawlability y de
// contenido, query fan-out e investigación de prompts. Sin dependencias:
// build.mjs lo pega en los nodos Code del workflow «Herramientas».

// Los 21 user-agents de la auditoría de crawlability. `token` es el nombre que
// se busca en robots.txt; `ua`, la cabecera User-Agent que se envía.
const BOTS_IA = [
  ['GPTBot', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)'],
  ['OAI-SearchBot', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot)'],
  ['ChatGPT-User', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ChatGPT-User/1.0; +https://openai.com/bot)'],
  ['Google-Extended', 'Mozilla/5.0 (compatible; Google-Extended)'],
  ['GoogleOther', 'Mozilla/5.0 (compatible; GoogleOther)'],
  ['ClaudeBot', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)'],
  ['Claude-User', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Claude-User/1.0; +Claude-User@anthropic.com)'],
  ['Claude-SearchBot', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Claude-SearchBot/1.0; +searchbot@anthropic.com)'],
  ['anthropic-ai', 'Mozilla/5.0 (compatible; anthropic-ai)'],
  ['PerplexityBot', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)'],
  ['Meta-ExternalAgent', 'meta-externalagent/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler)'],
  ['Meta-ExternalFetcher', 'meta-externalfetcher/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler)'],
  ['FacebookBot', 'Mozilla/5.0 (compatible; FacebookBot/1.0; +https://developers.facebook.com/docs/sharing/webmasters/facebookbot/)'],
  ['Applebot-Extended', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15 (Applebot-Extended/0.1)'],
  ['GrokBot', 'Mozilla/5.0 (compatible; GrokBot/1.0; +https://x.ai)'],
  ['Bytespider', 'Mozilla/5.0 (Linux; Android 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; Bytespider; spider-feedback@bytedance.com)'],
  ['CCBot', 'CCBot/2.0 (https://commoncrawl.org/faq/)'],
  ['cohere-ai', 'Mozilla/5.0 (compatible; cohere-ai)'],
  ['Diffbot', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko; compatible; Diffbot/0.1; +http://www.diffbot.com)'],
  ['ImagesiftBot', 'Mozilla/5.0 (compatible; ImagesiftBot; +imagesift.com)'],
  ['Omgilibot', 'Mozilla/5.0 (compatible; Omgilibot/0.4; +https://omgili.com/bot.html)']
].map(([token, ua]) => ({ token, ua }));

function urlValida(u) {
  const s = String(u || '').trim();
  const conEsquema = /^https?:\/\//i.test(s) ? s : 'https://' + s;
  const m = conEsquema.match(/^(https?:\/\/[^/?#\s]+)([^#\s]*)$/i);
  if (!m || !/\.[a-z]{2,}(:\d+)?$/i.test(m[1])) return null;
  return { url: m[1] + (m[2] || '/'), origen: m[1], ruta: (m[2] || '/').split('?')[0] || '/' };
}

// Pedidos HTTP de una auditoría: crawl = 21 bots + robots.txt; contenido = 1.
function pedidosAuditoria(body) {
  const tipo = body && body.tipo === 'contenido' ? 'contenido' : 'crawl';
  const u = urlValida(body && body.url);
  if (!u) return { error: 'URL no válida.' };
  if (tipo === 'contenido') {
    const agente = BOTS_IA.find(b => b.token === body.agente) || BOTS_IA.find(b => b.token === 'ChatGPT-User');
    const headers = { 'User-Agent': agente.ua };
    if (body.cabecera) headers['X-Crawler-Identity'] = String(body.cabecera).slice(0, 80);
    return { tipo, url: u.url, pedidos: [{ rol: 'pagina', agente: agente.token, url: u.url, headers }] };
  }
  return {
    tipo, url: u.url,
    pedidos: BOTS_IA.map(b => ({ rol: 'bot', agente: b.token, url: u.url, headers: { 'User-Agent': b.ua } }))
      .concat([{ rol: 'robots', agente: '', url: u.origen + '/robots.txt', headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BCP-GEO-Audit/1.0)' } }])
  };
}

// Lo que devuelve el nodo HTTP (respuesta completa, sin cortar en error):
// {statusCode, body|data} o {error}.
function respuestaHttp(j) {
  j = j || {};
  if (j.error) return { status: null, cuerpo: '', error: String((j.error && (j.error.code || j.error.message)) || j.error).slice(0, 120) };
  const status = Number(j.statusCode || j.status || (j.headers ? 200 : 0)) || null;
  let cuerpo = j.body !== undefined ? j.body : j.data !== undefined ? j.data : '';
  if (typeof cuerpo !== 'string') cuerpo = JSON.stringify(cuerpo);
  return { status, cuerpo, error: '' };
}

// robots.txt → para un token y una ruta: 'allowed' | 'disallowed' | 'na'.
function reglaRobots(texto, token, ruta) {
  if (!texto) return 'na';
  const grupos = [];
  let actual = null;
  let ultimaFueAgente = false;
  for (const linea of String(texto).split(/\r?\n/)) {
    const l = linea.replace(/#.*/, '').trim();
    const m = l.match(/^([a-z-]+)\s*:\s*(.*)$/i);
    if (!m) continue;
    const campo = m[1].toLowerCase();
    const valor = m[2].trim();
    if (campo === 'user-agent') {
      if (!ultimaFueAgente || !actual) { actual = { agentes: [], reglas: [] }; grupos.push(actual); }
      actual.agentes.push(valor.toLowerCase());
      ultimaFueAgente = true;
    } else {
      ultimaFueAgente = false;
      if (actual && (campo === 'allow' || campo === 'disallow')) actual.reglas.push({ permitir: campo === 'allow', ruta: valor });
    }
  }
  const propio = grupos.filter(g => g.agentes.includes(token.toLowerCase()));
  const aplica = propio.length ? propio : grupos.filter(g => g.agentes.includes('*'));
  if (!aplica.length) return 'allowed';
  let mejor = null;
  for (const r of aplica.flatMap(g => g.reglas)) {
    if (r.ruta === '' && !r.permitir) continue; // «Disallow:» vacío no bloquea nada
    const patron = new RegExp('^' + r.ruta.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\\\$$/, '$'));
    if (patron.test(ruta) && (!mejor || r.ruta.length > mejor.ruta.length || (r.ruta.length === mejor.ruta.length && r.permitir))) mejor = r;
  }
  return !mejor || mejor.permitir ? 'allowed' : 'disallowed';
}

// Resultado de la auditoría de crawlability (formato CrawlAudit del SPEC).
function resultadoCrawl(url, pedidos, respuestas) {
  const u = urlValida(url);
  const iRobots = pedidos.findIndex(p => p.rol === 'robots');
  const robots = iRobots >= 0 ? respuestaHttp(respuestas[iRobots]) : { status: null, cuerpo: '' };
  const robotsTxt = robots.status === 200 && !/<html/i.test(robots.cuerpo.slice(0, 500)) ? robots.cuerpo : '';
  const bots = pedidos.map((p, i) => ({ p, r: respuestaHttp(respuestas[i]) })).filter(x => x.p.rol === 'bot').map(({ p, r }) => ({
    agent: p.agente,
    serverAccess: r.status === null ? 'unreachable' : r.status >= 200 && r.status < 400 ? 'ok' : 'blocked',
    httpStatus: r.status,
    error: r.error || undefined,
    robots: robotsTxt ? reglaRobots(robotsTxt, p.agente, u ? u.ruta : '/') : 'na'
  }));
  const resumen = {
    ok: bots.filter(b => b.serverAccess === 'ok').length,
    blocked: bots.filter(b => b.serverAccess === 'blocked').length,
    unreachable: bots.filter(b => b.serverAccess === 'unreachable').length,
    robotsTxt: robotsTxt ? 'found' : 'na'
  };
  return { url, bots, resumen, critico: resumen.ok === 0 };
}

// Resultado de la auditoría de contenido (formato ContentAudit del SPEC).
function resultadoContenido(url, agente, respuesta) {
  const r = respuestaHttp(respuesta);
  const html = r.cuerpo || '';
  const sinCodigo = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ');
  const texto = sinCodigo.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
  const palabras = texto ? texto.split(' ').length : 0;
  const ratio = html.length ? Math.round((texto.length / html.length) * 1000) / 1000 : 0;
  const cuenta = tag => (html.match(new RegExp('<' + tag + '[\\s>]', 'gi')) || []).length;
  const tipos = [];
  const errores = [];
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const v = JSON.parse(m[1]);
      const recoger = x => {
        if (Array.isArray(x)) return x.forEach(recoger);
        if (x && typeof x === 'object') {
          const t = x['@type'];
          (Array.isArray(t) ? t : [t]).filter(Boolean).forEach(y => { if (!tipos.includes(y)) tipos.push(y); });
          if (x['@graph']) recoger(x['@graph']);
        }
      };
      recoger(v);
    } catch (e) { errores.push('JSON-LD inválido: ' + String(e.message).slice(0, 80)); }
  }
  const h1 = cuenta('h1'), h2 = cuenta('h2'), h3 = cuenta('h3');
  const faq = tipos.includes('FAQPage') || /preguntas frecuentes|frequently asked/i.test(texto) || cuenta('details') > 0;
  const issues = [];
  if (r.status === null) issues.push('La página no respondió (' + (r.error || 'sin respuesta') + ').');
  else if (r.status >= 400) issues.push('La página respondió HTTP ' + r.status + ' al crawler.');
  if (h1 === 0) issues.push('No tiene H1.');
  if (h1 > 1) issues.push('Tiene ' + h1 + ' H1; conviene uno.');
  if (h2 === 0) issues.push('No tiene subtítulos H2.');
  if (palabras < 300) issues.push('Poco texto sin ejecutar JavaScript (' + palabras + ' palabras).');
  if (!faq) issues.push('No hay sección de preguntas frecuentes.');
  if (!tipos.length) issues.push('No hay datos estructurados schema.org.');
  const veredicto = palabras >= 300 && ratio >= 0.05 ? 'ok' : palabras >= 80 ? 'warning' : 'fail';
  const score = Math.max(0, 100 - issues.length * 15 - (veredicto === 'fail' ? 25 : veredicto === 'warning' ? 10 : 0));
  return {
    url, crawlerIdentity: agente, httpStatus: r.status,
    staticVsDynamic: { staticTextRatio: ratio, words: palabras, verdict: veredicto },
    contentAnalysis: { score, issues, headings: { h1, h2, h3 }, faq, words: palabras },
    structuredData: { types: tipos, errors: errores }
  };
}

// ─── Investigación de prompts (V7) y fan-out (V8.3) con Claude ─────────────
function cuerpoInvestigacion(body, config) {
  const modo = ['keywords', 'url', 'marca'].includes(body && body.modo) ? body.modo : 'keywords';
  const idioma = String((body && body.idioma) || 'es');
  const pais = String((body && body.pais) || 'PE');
  const keywords = (Array.isArray(body && body.keywords) ? body.keywords : String((body && body.keywords) || '').split(/\n/))
    .map(k => String(k).trim()).filter(Boolean).slice(0, 20);
  const url = urlValida(body && body.url);
  if (modo === 'keywords' && !keywords.length) return { error: 'Escribe al menos una keyword.' };
  if (modo === 'url' && !url) return { error: 'URL no válida.' };
  const instruccion = 'Eres especialista en GEO (visibilidad en asistentes de IA) para ' + config.marca.nombre + ', banco de Perú. ' +
    'Propón entre 8 y 15 preguntas conversacionales que un usuario de ' + pais + ' le haría a ChatGPT, Gemini o Claude, en idioma «' + idioma + '». ' +
    'Deben incluir el contexto país cuando haga falta y NO deben nombrar a ' + config.marca.nombre + ' (para no sesgar la medición). ' +
    'Devuelve SOLO un JSON: [{"prompt": "...", "etapa": "tofu|mofu|bofu", "tag": "...", "volumen": 1-5, "razon": "..."}]. ' +
    'volumen es tu estimación de demanda (1 baja, 5 alta). tag: uno corto, por ejemplo Productos-Ahorro, Comparativos, Digital/App, Seguridad, Marca.';
  const contexto = modo === 'keywords' ? 'Keywords SEO:\n' + keywords.join('\n')
    : modo === 'url' ? 'Lee esta página y propone los prompts que debería capturar: ' + url.url
    : 'Marca: ' + config.marca.nombre + '. Competidores: ' + (config.competidores || []).map(c => c.nombre).join(', ') + '. Propón prompts de marca, productos y comparación.';
  return {
    modo,
    cuerpo: {
      model: modo === 'url' ? 'claude-sonnet-5-5' : 'claude-haiku-5-5',
      max_tokens: 4000,
      system: instruccion,
      messages: [{ role: 'user', content: contexto }],
      ...(modo === 'url' ? { output_config: { effort: 'low' }, tools: [{ type: 'web_fetch_20260209', name: 'web_fetch', max_uses: 1 }] } : {})
    }
  };
}

function cuerpoFanout(body) {
  const q = String((body && body.query) || '').trim();
  if (!q) return { error: 'Escribe un prompt.' };
  return {
    cuerpo: {
      model: 'claude-sonnet-5-5', max_tokens: 1500, output_config: { effort: 'low' },
      system: 'El usuario está en Lima, Perú. Busca en la web antes de responder.',
      tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 5, user_location: { type: 'approximate', timezone: 'America/Lima' } }],
      messages: [{ role: 'user', content: q.slice(0, 500) }]
    }
  };
}

// Texto de una respuesta de Claude → lista JSON de prompts candidatos.
function leerCandidatos(respuesta) {
  if (respuesta && respuesta.error) return { error: String(respuesta.error.message || respuesta.error).slice(0, 200), candidatos: [] };
  const texto = ((respuesta && respuesta.content) || []).filter(c => c.type === 'text').map(c => c.text).join('');
  const i = texto.indexOf('['), j = texto.lastIndexOf(']');
  let lista = [];
  try { lista = JSON.parse(texto.slice(i, j + 1)); } catch (e) { return { error: 'La IA no devolvió una lista válida.', candidatos: [] }; }
  const etapas = ['tofu', 'mofu', 'bofu'];
  return {
    candidatos: (Array.isArray(lista) ? lista : []).filter(x => x && x.prompt).slice(0, 20).map(x => ({
      prompt: String(x.prompt).trim().slice(0, 500),
      etapa: etapas.includes(String(x.etapa).toLowerCase()) ? String(x.etapa).toLowerCase() : 'tofu',
      tag: String(x.tag || '').trim().slice(0, 40),
      volumen: Math.max(1, Math.min(5, Math.round(Number(x.volumen)) || 1)),
      razon: String(x.razon || '').trim().slice(0, 300)
    }))
  };
}

// Respuesta de Claude con búsqueda web → las consultas que desplegó.
function leerFanout(respuesta) {
  if (respuesta && respuesta.error) return { error: String(respuesta.error.message || respuesta.error).slice(0, 200), consultas: [] };
  const consultas = ((respuesta && respuesta.content) || [])
    .filter(c => c.type === 'server_tool_use' && c.name === 'web_search' && c.input && c.input.query)
    .map(c => ({ engine: 'claude', subQuery: String(c.input.query) }));
  return { consultas };
}
