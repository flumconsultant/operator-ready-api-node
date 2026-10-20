/* Carga los datos reales del GEO Tracker (n8n) antes de arrancar el monitor.
   app.js y monitor.js leen DATA al cargarse, así que van después de este archivo.
   Si n8n no responde o todavía no hay corridas, el sitio sigue con los datos de
   demostración de data.js y lo dice en la cabecera. */
(function () {
  'use strict';
  var API_URL = 'https://n8n.srv836595.hstgr.cloud/webhook/geo-monitor-data';
  var ESPERA_MS = 15000;

  function cargarScript(src) {
    return new Promise(function (ok, mal) {
      var s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = ok;
      s.onerror = function () { mal(new Error('No se pudo cargar ' + src)); };
      document.body.appendChild(s);
    });
  }

  function pedirDatos() {
    var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    var reloj = setTimeout(function () { if (ctrl) ctrl.abort(); }, ESPERA_MS);
    return fetch(API_URL, { signal: ctrl ? ctrl.signal : undefined, cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .finally(function () { clearTimeout(reloj); });
  }

  // Sustituye las observaciones simuladas por las reales. Los modelos, las
  // recomendaciones y la serie histórica original se quedan como en data.js.
  function aplicar(d) {
    var obs = d && d.monitor && d.monitor.observations;
    if (!Array.isArray(obs) || !obs.length) return 'sin_corridas';
    var M = DATA.monitor;
    M.projects = d.monitor.projects;
    M.observations = obs;
    M.referenceDate = d.monitor.referenceDate;
    M.dates = d.monitor.dates;
    if (d.monitor.domains && d.monitor.domains.length) M.domains = d.monitor.domains;
    M.metricDefinitions.som = 'Promedio del SOV de cada respuesta válida: veces que se nombra a BCP ÷ veces que se nombra a cualquier banco × 100.';
    var ids = {};
    DATA.prompts.forEach(function (p) { ids[p.id] = true; });
    (d.prompts || []).forEach(function (p) { if (!ids[p.id]) DATA.prompts.push(p); });
    DATA.meta.live = { generado: d.generado, respuestas: obs.length };
    return 'ok';
  }

  function avisoPie(estado) {
    var nota = document.querySelector('#detailView .footer-note');
    if (!nota) return;
    nota.textContent = estado === 'ok'
      ? 'Datos en vivo · GEO Tracker (n8n)'
      : estado === 'sin_corridas'
        ? 'Sin corridas todavía · se muestran datos de demostración'
        : 'Sin conexión con n8n · se muestran datos de demostración';
  }

  var estado = 'error';
  pedirDatos()
    .then(function (d) { estado = aplicar(d); })
    .catch(function (e) { console.warn('[GEO] No se pudieron cargar los datos de n8n:', e); })
    .then(function () {
      DATA.meta.liveStatus = estado;
      avisoPie(estado);
      return cargarScript('app.js');
    })
    .then(function () { return cargarScript('monitor.js'); })
    .catch(function (e) { console.error('[GEO]', e); });
})();
