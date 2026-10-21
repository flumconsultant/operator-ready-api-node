/* Inicializa el monitor con el endpoint de lectura incluido en el ZIP.
   La actualización de DATA es atómica: si la respuesta falla o es inválida,
   se conserva íntegro el dataset de demostración. */
(function () {
  'use strict';
  var API_URL = 'https://n8n.srv836595.hstgr.cloud/webhook/geo-monitor-data';
  var ESPERA_MS = 15000;
  function cargarScript(src) {
    return new Promise(function (ok, mal) {
      var s = document.createElement('script');
      s.src = src; s.async = false; s.onload = ok;
      s.onerror = function () { mal(new Error('No se pudo cargar ' + src)); };
      document.body.appendChild(s);
    });
  }
  async function pedirDatos() {
    var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    var reloj;
    var limite = new Promise(function (_, rechazar) {
      reloj = setTimeout(function () {
        if (ctrl) ctrl.abort();
        rechazar(new Error('Tiempo de espera agotado'));
      }, ESPERA_MS);
    });
    try {
      return await Promise.race([(async function () {
        var r = await fetch(API_URL, { signal: ctrl ? ctrl.signal : undefined, cache: 'no-store' });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return await r.json();
      })(), limite]);
    } finally { clearTimeout(reloj); }
  }
  function aplicar(d) {
    var monitor = d && d.monitor;
    if (!d || d.ok === false || !monitor || !Array.isArray(monitor.observations)) throw new Error('Respuesta de datos inválida');
    var obs = monitor.observations;
    if (!obs.length) return 'sin_corridas';
    if (!Array.isArray(monitor.projects) || !monitor.projects.length || !Array.isArray(d.prompts) || !/^\d{4}-\d{2}-\d{2}$/.test(monitor.referenceDate)) throw new Error('Catálogo de proyectos o fecha inválidos');
    var modelos = new Set(DATA.monitor.models.map(function (m) { return m.id; }));
    var proyectos = new Set(monitor.projects.map(function (p) { return p.id; }));
    var prompts = new Map(DATA.prompts.map(function (p) { return [p.id, p]; }));
    d.prompts.forEach(function (p) {
      if (!p || typeof p.id !== 'string' || typeof p.text !== 'string') throw new Error('Prompt inválido');
      prompts.set(p.id, Object.assign({}, prompts.get(p.id) || {}, p));
    });
    monitor.projects.forEach(function (p) {
      if (!p || typeof p.id !== 'string' || typeof p.name !== 'string' || !Array.isArray(p.promptIds) || p.promptIds.some(function (id) { return !prompts.has(id); })) throw new Error('Proyecto inválido');
    });
    var vistos = new Set();
    obs.forEach(function (o) {
      if (!o || typeof o.id !== 'string' || vistos.has(o.id) || !modelos.has(o.modelId) || !proyectos.has(o.projectId) || !prompts.has(o.promptId) || !/^\d{4}-\d{2}-\d{2}$/.test(o.date) || !['ok','error','not_mentioned'].includes(o.status) || !Array.isArray(o.ranking) || !Array.isArray(o.sources)) throw new Error('Observación inválida');
      ['som','position','linkPosition','mentions','citations','sentiment'].forEach(function (k) { if (o[k] !== null && (typeof o[k] !== 'number' || !Number.isFinite(o[k]))) throw new Error('Métrica inválida: ' + k); });
      vistos.add(o.id);
    });
    DATA.monitor.projects = monitor.projects;
    DATA.monitor.observations = obs;
    DATA.monitor.referenceDate = monitor.referenceDate;
    DATA.monitor.dates = Array.from(new Set(obs.map(function (o) { return o.date; }))).sort();
    if (Array.isArray(monitor.domains)) DATA.monitor.domains = monitor.domains;
    // SPEC v2: marcas, categorías de dominio, atributos, estados de recomendaciones y auditorías.
    ['brands', 'attributes', 'audits'].forEach(function (k) { if (Array.isArray(monitor[k])) DATA.monitor[k] = monitor[k]; });
    ['domainCategories', 'recStates'].forEach(function (k) { if (monitor[k] && typeof monitor[k] === 'object') DATA.monitor[k] = monitor[k]; });
    DATA.monitor.metricDefinitions.som = 'Promedio del SOV de cada respuesta válida: veces que se nombra a BCP ÷ veces que se nombra a cualquier banco × 100.';
    DATA.prompts = Array.from(prompts.values());
    // Lo que se edita en Configuración (pestaña _config del Sheet).
    if (d.ajustes && typeof d.ajustes === 'object') DATA.meta.ajustes = d.ajustes;
    DATA.meta.live = { generado: d.generado, respuestas: obs.length, validas: obs.filter(function (o) { return o.status !== 'error'; }).length };
    return 'ok';
  }
  function avisoPie(estado) {
    var nota = document.querySelector('#detailView .footer-note');
    if (nota) nota.textContent = estado === 'ok' ? 'Datos de n8n · Última consulta al abrir el monitor' : estado === 'sin_corridas' ? 'Sin corridas todavía · se muestran datos de demostración' : 'Sin conexión con n8n · se muestran datos de demostración';
  }
  var estado = 'error';
  pedirDatos().then(function (d) { estado = aplicar(d); })
    .catch(function (e) { console.warn('[GEO] Se conservan datos de demostración:', e.message); })
    .then(function () {
      DATA.meta.liveStatus = estado; avisoPie(estado);
      return cargarScript('app.js?v=bcp-20261020-4');
    })
    .then(function () { return cargarScript('monitor.js?v=v13'); })
    .then(function () { return cargarScript('prompts-admin.js?v=prompts-admin-1'); })
    .then(function () { return cargarScript('geo-metrics.js?v=v15'); })
    .then(function () { return cargarScript('geo-v2.js?v=v15'); })
    .catch(function (e) {
      console.error('[GEO]', e);
      var vista = document.querySelector('#generalView');
      if (!vista) return;
      vista.innerHTML = '<section class="card monitor-empty"><h1>No se pudo abrir el monitor</h1><p>Vuelve a cargar la página para intentarlo nuevamente.</p><button class="button primary" id="retryStartup">Reintentar</button></section>';
      document.querySelector('#retryStartup').addEventListener('click', function () { window.location.reload(); });
    });
})();
