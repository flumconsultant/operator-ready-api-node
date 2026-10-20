/* Gestión de prompts. Módulo independiente; no sustituye los datos del monitor. */
(function () {
  'use strict';
  const API_BASE = 'https://n8n.srv836595.hstgr.cloud/webhook';
  const ROUTE = 'gestion-prompts', PAGE_SIZE = 25;
  const A = { items: [], projects: [], categories: [], intentions: [], total: 0, active: 0, loaded: false, loading: false, error: '', notice: '', selected: new Set(), page: 1, mutation: false, busyId: null, afterRun: false, editor: null, dialogKind: null, filters: { proyecto: '', categoria: '', intencion: '', estado: '', search: '' } };
  const original = { shell: renderShell, route: renderRoute, go, read: readRoute };
  const byId = id => document.getElementById(id);
  const html = value => esc(value);
  const isAdmin = () => M.route === ROUTE;
  const changedValues = (base, next) => Object.fromEntries(Object.entries(next).filter(([key, value]) => base[key] !== value));
  const normalizeText = value => String(value || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  function matches(p) {
    const f = A.filters;
    return (!f.proyecto || p.proyecto === f.proyecto) && (!f.categoria || p.categoria === f.categoria) && (!f.intencion || p.intencion === f.intencion) && (!f.estado || p.activo === (f.estado === 'activo')) && (!f.search || normalizeText(p.prompt).includes(normalizeText(f.search)));
  }
  const filtered = () => A.items.filter(matches);
  const blocked = () => !A.loaded || A.loading || !!A.error || A.mutation;
  const options = (values, selected, first) => `<option value="">${first}</option>${values.map(value => `<option value="${html(value)}" ${value === selected ? 'selected' : ''}>${html(value)}</option>`).join('')}`;
  function humanDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}/.test(value || '')) return '—';
    return new Date(value.slice(0, 10) + 'T12:00:00').toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }).replaceAll('.', '');
  }
  function estimate(count) {
    const seconds = count * 10;
    if (seconds < 60) return `${Math.max(10, Math.floor(seconds / 10) * 10)}–${Math.ceil(seconds * 1.6 / 10) * 10} segundos`;
    return `${Math.ceil(seconds * 1.2 / 60)}–${Math.ceil(seconds * 1.6 / 60)} minutos`;
  }
  async function request(path, body) {
    const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 30000);
    try {
      const r = await fetch(API_BASE + path, { method: body === undefined ? 'GET' : 'POST', credentials: 'omit', cache: 'no-store', signal: controller.signal, headers: body === undefined ? { Accept: 'application/json' } : { Accept: 'application/json', 'Content-Type': 'application/json' }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
      let data;
      try { data = await r.json(); } catch (_) { throw new Error('El servidor no devolvió una respuesta JSON válida.'); }
      if (!r.ok || data?.ok === false) throw new Error(data?.error || `No se pudo completar la solicitud (HTTP ${r.status}).`);
      return data;
    } catch (error) {
      if (error.name === 'AbortError') throw new Error('n8n no respondió a tiempo. Vuelve a intentarlo.');
      if (error instanceof TypeError) throw new Error('No se pudo conectar con n8n. Comprueba tu conexión y vuelve a intentarlo.');
      throw error;
    } finally { clearTimeout(timer); }
  }
  function acceptList(data) {
    if (!Array.isArray(data?.prompts)) throw new Error('El servidor no devolvió una lista válida de prompts.');
    const ids = new Set();
    const items = data.prompts.map(p => {
      if (!p || typeof p.id !== 'string' || typeof p.prompt !== 'string' || ids.has(p.id)) throw new Error('La lista contiene un prompt inválido o un identificador repetido.');
      ids.add(p.id);
      return { id: p.id, proyecto: String(p.proyecto || ''), prompt: p.prompt, categoria: String(p.categoria || ''), intencion: String(p.intencion || ''), activo: p.activo === true || p.activo === 'true', fecha_creacion: p.fecha_creacion || '' };
    });
    const catalog = (name, field) => [...new Set([...(Array.isArray(data[name]) ? data[name].filter(x => typeof x === 'string') : []), ...items.map(p => p[field]).filter(Boolean)])].sort((a, b) => a.localeCompare(b, 'es'));
    A.items = items; A.projects = catalog('proyectos', 'proyecto'); A.categories = catalog('categorias', 'categoria'); A.intentions = catalog('intenciones', 'intencion');
    A.total = items.length; A.active = items.filter(p => p.activo).length; A.loaded = true;
    A.selected = new Set([...A.selected].filter(id => ids.has(id)));
  }
  async function loadList() {
    if (A.loading) return false;
    A.loading = true; A.error = ''; renderAdmin();
    try { acceptList(await request('/geo-prompts')); return true; }
    catch (error) { A.error = error.message; return false; }
    finally { A.loading = false; renderAdmin(); }
  }
  function activateNav() {
    const anchor = document.querySelector('.side-link[data-nav="prompts"]');
    if (anchor && !document.querySelector('[data-nav="gestion-prompts"]')) anchor.insertAdjacentHTML('afterend', `<button type="button" class="side-link ${isAdmin() ? 'active' : ''}" data-nav="gestion-prompts" ${isAdmin() ? 'aria-current="page"' : ''}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4H4v16h16V10M13 7l4-4 4 4-4 4-5 2 1-6Z"/></svg>Gestión de prompts</button>`);
    const globalFilters = byId('globalFilters');
    if (globalFilters) globalFilters.hidden = isAdmin();
    if (isAdmin()) {
      const crumb = document.querySelector('.breadcrumb');
      if (crumb) crumb.innerHTML = '<button type="button" data-nav="dashboard">Dashboard</button><span>›</span><span>Gestión de prompts</span>';
    }
  }
  renderShell = function () { original.shell(); activateNav(); };
  renderRoute = function () { if (isAdmin()) renderAdmin(); else original.route(); };
  go = function (route, project) {
    original.go(route, project);
    if (route === ROUTE && !A.loaded && !A.loading && !A.error) void loadList();
  };
  readRoute = function () {
    if (location.hash === '#' + ROUTE) {
      M.route = ROUTE; renderShell(); renderRoute();
      if (!A.loaded && !A.loading && !A.error) void loadList();
    } else original.read();
  };
  window.removeEventListener('popstate', original.read);
  window.addEventListener('popstate', readRoute);
  window.addEventListener('hashchange', () => { if (location.hash === '#' + ROUTE || isAdmin()) readRoute(); });
  function renderAdmin() {
    if (!isAdmin()) return;
    byId('detailView').hidden = true; byId('generalView').hidden = false;
    const noWrite = blocked();
    byId('generalView').innerHTML = `<div class="page-intro pa-intro"><div><div class="orange-label">Administración del monitor</div><h1>Gestión de prompts</h1><p id="pa-counter">${A.loaded ? `${A.total} prompts · ${A.active} activos` : 'Cargando catálogo de prompts…'}</p></div><div class="pa-header-actions"><button type="button" class="button primary" data-pa-action="new" ${noWrite ? 'disabled' : ''}>＋ Nuevo prompt</button><button type="button" class="button pa-run" data-pa-action="run-all" ${noWrite || !A.active ? 'disabled' : ''}>${icon('chart')} Medir todos</button></div></div><div class="pa-schedule">${icon('clock')}<span>Medición automática diaria · 7:00 a.m. (Lima)</span>${A.afterRun ? '<button type="button" class="text-button" data-pa-action="refresh-data">Actualizar datos</button>' : ''}</div><div class="card pa-filters"><label>Proyecto<select data-pa-filter="proyecto" ${!A.loaded ? 'disabled' : ''}>${options(A.projects, A.filters.proyecto, 'Todos los proyectos')}</select></label><label>Categoría<select data-pa-filter="categoria" ${!A.loaded ? 'disabled' : ''}>${options(A.categories, A.filters.categoria, 'Todas las categorías')}</select></label><label>Intención<select data-pa-filter="intencion" ${!A.loaded ? 'disabled' : ''}>${options(A.intentions, A.filters.intencion, 'Todas las intenciones')}</select></label><label>Estado<select data-pa-filter="estado"><option value="">Todos</option><option value="activo" ${A.filters.estado === 'activo' ? 'selected' : ''}>Activos</option><option value="inactivo" ${A.filters.estado === 'inactivo' ? 'selected' : ''}>Inactivos</option></select></label><label class="pa-search-label">Buscar prompt<input type="search" id="pa-search" data-pa-filter="search" placeholder="Buscar por texto…" value="${html(A.filters.search)}"></label></div><div id="pa-alerts">${A.error ? `<div class="alert pa-alert" role="alert"><span>${html(A.error)}</span><button type="button" class="button" data-pa-action="retry" ${A.loading || A.mutation ? 'disabled' : ''}>Reintentar</button></div>` : ''}${A.notice ? `<div class="sample-banner pa-notice" role="status">${html(A.notice)}</div>` : ''}</div><div class="pa-table-toolbar"><span id="pa-results-count"></span><div><button type="button" class="text-button" data-pa-action="clear-filters">Limpiar filtros</button><button type="button" class="text-button" data-pa-action="reload" ${A.loading || A.mutation ? 'disabled' : ''}>↻ Actualizar lista</button></div></div><div id="pa-selection"></div><div id="pa-table-region" aria-live="polite"></div>`;
    renderTable();
  }
  function renderTable() {
    if (!isAdmin() || !byId('pa-table-region')) return;
    const list = filtered(), pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    A.page = Math.max(1, Math.min(A.page, pages));
    const start = (A.page - 1) * PAGE_SIZE, page = list.slice(start, start + PAGE_SIZE);
    byId('pa-results-count').textContent = `${list.length} de ${A.total} prompts`;
    byId('pa-selection').innerHTML = A.selected.size ? `<div class="pa-selection"><b>${A.selected.size} prompts seleccionados</b><button type="button" class="button primary" data-pa-action="run-selected" ${blocked() ? 'disabled' : ''}>Medir seleccionados</button><button type="button" class="text-button" data-pa-action="clear-selection" ${A.mutation ? 'disabled' : ''}>Quitar selección</button></div>` : '';
    if (A.loading) { byId('pa-table-region').innerHTML = '<div class="card pa-loading" role="status" aria-label="Cargando prompts"><span class="pa-sr-only">Cargando prompts…</span>' + Array.from({ length: 6 }, () => '<div class="skeleton pa-skeleton-row"></div>').join('') + '</div>'; return; }
    if (!A.loaded && A.error) { byId('pa-table-region').innerHTML = '<div class="card monitor-empty"><h3>Catálogo no disponible</h3><p>Reintenta la conexión para gestionar los prompts.</p></div>'; return; }
    if (!list.length) {
      byId('pa-table-region').innerHTML = `<div class="card monitor-empty"><h3>${A.items.length ? 'No hay prompts con estos filtros' : 'Todavía no hay prompts'}</h3><p>${A.items.length ? 'Prueba con otra búsqueda o limpia los filtros.' : 'Crea el primer prompt para empezar a monitorearlo.'}</p>${A.items.length ? '<button type="button" class="button" data-pa-action="clear-filters">Limpiar filtros</button>' : `<button type="button" class="button primary" data-pa-action="new" ${blocked() ? 'disabled' : ''}>Nuevo prompt</button>`}</div>`;
      return;
    }
    const count = page.filter(p => A.selected.has(p.id)).length;
    byId('pa-table-region').innerHTML = `<div class="card"><div class="table-scroll"><table class="pa-table"><thead><tr><th><input type="checkbox" id="pa-select-page" aria-label="Seleccionar los ${page.length} prompts de esta página" ${count === page.length ? 'checked' : ''} ${A.mutation ? 'disabled' : ''}></th><th>Prompt</th><th>Proyecto</th><th>Categoría</th><th>Intención</th><th>Activo</th><th>Fecha de creación</th><th>Acciones</th></tr></thead><tbody>${page.map(p => `<tr><td><input type="checkbox" data-pa-select="${html(p.id)}" aria-label="Seleccionar: ${html(p.prompt)}" ${A.selected.has(p.id) ? 'checked' : ''} ${A.mutation ? 'disabled' : ''}></td><td><div class="pa-prompt-text" title="${html(p.prompt)}">${html(p.prompt)}</div><small class="pa-id">${html(p.id)}</small></td><td>${html(p.proyecto)}</td><td>${html(p.categoria) || '—'}</td><td>${html(p.intencion) || '—'}</td><td><label class="pa-toggle"><input type="checkbox" role="switch" data-pa-toggle="${html(p.id)}" aria-label="Activo: ${html(p.prompt)}" ${p.activo ? 'checked' : ''} ${blocked() ? 'disabled' : ''}><span aria-hidden="true"></span></label>${A.busyId === p.id ? '<span class="pa-saving">Guardando…</span>' : ''}</td><td class="pa-date">${humanDate(p.fecha_creacion)}</td><td><div class="pa-row-actions"><button type="button" class="text-button" data-pa-edit="${html(p.id)}" ${blocked() ? 'disabled' : ''}>Editar</button><button type="button" class="text-button pa-delete" data-pa-delete="${html(p.id)}" ${blocked() ? 'disabled' : ''}>Eliminar</button></div></td></tr>`).join('')}</tbody></table></div><div class="pagination"><span>Mostrando ${start + 1} a ${Math.min(start + PAGE_SIZE, list.length)} de ${list.length} prompts</span><div class="pages"><button type="button" class="page-btn" data-pa-page="-1" ${A.page === 1 ? 'disabled' : ''} aria-label="Página anterior">‹</button><span>${A.page} / ${pages}</span><button type="button" class="page-btn" data-pa-page="1" ${A.page === pages ? 'disabled' : ''} aria-label="Página siguiente">›</button></div></div></div>`;
    byId('pa-select-page').indeterminate = count > 0 && count < page.length;
  }
  const dialog = document.createElement('dialog');
  dialog.id = 'prompts-admin-dialog'; dialog.className = 'pa-dialog'; document.body.appendChild(dialog);
  let returnFocus = null;
  function openDialog(kind, title, body, footer) {
    if (dialog.open || A.mutation) return;
    A.dialogKind = kind; returnFocus = document.activeElement;
    dialog.innerHTML = `<div class="modal-head"><h2 id="pa-dialog-title">${title}</h2><button type="button" class="close-x" data-pa-action="close-dialog" aria-label="Cerrar">×</button></div>${body}<div class="modal-footer pa-modal-footer">${footer}</div>`;
    dialog.setAttribute('aria-labelledby', 'pa-dialog-title'); dialog.showModal();
    (byId('pa-prompt') || dialog.querySelector('[data-pa-action="close-dialog"]'))?.focus();
  }
  function closeDialog(force = false) { if (!A.mutation || force) { dialog.close(); A.dialogKind = null; A.editor = null; } }
  dialog.addEventListener('cancel', e => { if (A.mutation) e.preventDefault(); });
  dialog.addEventListener('close', () => { if (!A.mutation) { A.dialogKind = null; A.editor = null; } returnFocus?.focus(); });
  function dialogError(message) { const target = byId('pa-form-error'); if (target) { target.textContent = message; target.hidden = !message; } }
  function setDialogBusy(busy) { dialog.querySelectorAll('button,input,select,textarea').forEach(el => { el.disabled = busy; }); }
  function openEditor(id) {
    if (blocked()) return;
    const item = id ? A.items.find(p => p.id === id) : null;
    if (id && !item) return;
    const base = item ? { ...item } : { proyecto: A.filters.proyecto, prompt: '', categoria: '', intencion: A.intentions.includes('Informacional') ? 'Informacional' : A.intentions[0] || '', activo: true };
    const body = `<form id="pa-editor-form"><div class="modal-body pa-form"><label for="pa-prompt">Prompt <span class="pa-required">*</span></label><textarea id="pa-prompt" name="prompt" required maxlength="2000" rows="5" placeholder="Escribe la consulta que quieres medir…">${html(base.prompt)}</textarea><span id="pa-char-count" class="pa-character-count">${base.prompt.length} / 2.000 caracteres</span><div class="pa-form-grid"><div><label for="pa-project">Proyecto <span class="pa-required">*</span></label><select id="pa-project" name="proyecto" required>${options(A.projects, base.proyecto, 'Selecciona un proyecto')}<option value="__pa_new_project__">＋ Crear proyecto nuevo</option></select></div><div id="pa-new-project-wrap" hidden><label for="pa-new-project">Nombre del proyecto <span class="pa-required">*</span></label><input id="pa-new-project" name="new_project" placeholder="Nombre del proyecto nuevo" disabled></div><div><label for="pa-category">Categoría</label><input id="pa-category" name="categoria" list="pa-categories" value="${html(base.categoria)}" placeholder="Elige o escribe una categoría"><datalist id="pa-categories">${A.categories.map(v => `<option value="${html(v)}"></option>`).join('')}</datalist></div><div><label for="pa-intention">Intención</label><select id="pa-intention" name="intencion">${options(A.intentions, base.intencion, 'Selecciona una intención')}</select></div></div><label class="pa-form-active"><span class="pa-toggle"><input id="pa-active" name="activo" type="checkbox" role="switch" ${base.activo ? 'checked' : ''}><span aria-hidden="true"></span></span><span>Activo</span></label><p class="pa-form-help">Los proyectos nuevos se incorporan cuando guardas un prompt que los utiliza.</p><div id="pa-form-error" class="pa-form-error" role="alert" hidden></div></div></form>`;
    openDialog('editor', id ? 'Editar prompt' : 'Nuevo prompt', body, '<button type="button" class="button" data-pa-action="close-dialog">Cancelar</button><button type="submit" class="button primary" form="pa-editor-form" id="pa-save">Guardar prompt</button>');
    A.editor = { id: id || null, base };
  }
  function valuesFromForm(form) {
    const get = name => form.elements.namedItem(name);
    const proyecto = get('proyecto').value === '__pa_new_project__' ? get('new_project').value.trim() : get('proyecto').value;
    return { proyecto, prompt: get('prompt').value.trim(), categoria: get('categoria').value.trim(), intencion: get('intencion').value, activo: get('activo').checked };
  }
  async function saveEditor(form) {
    if (A.mutation || !A.editor || A.error || A.loading) return;
    const next = valuesFromForm(form);
    if (!next.prompt) { dialogError('El prompt no puede estar vacío.'); byId('pa-prompt').focus(); return; }
    if (next.prompt.length > 2000) { dialogError('El prompt no puede superar los 2.000 caracteres.'); return; }
    if (!next.proyecto) { dialogError('Selecciona o escribe un proyecto.'); return; }
    const current = A.editor;
    const diff = current.id ? changedValues(current.base, next) : next;
    if (current.id && !Object.keys(diff).length) { closeDialog(); toast('No hay cambios para guardar.'); return; }
    A.mutation = true; dialogError(''); setDialogBusy(true); renderAdmin();
    let saved = false;
    try {
      const result = await request('/geo-prompts-save', current.id ? { id: current.id, ...diff } : next);
      if (result?.ok !== true || !result.prompt?.id) throw new Error('El servidor no confirmó el guardado del prompt.');
      saved = true; closeDialog(true);
      const refreshed = await loadList();
      const record = A.items.find(p => p.id === result.prompt.id);
      if (refreshed && record) {
        if (!matches(record)) A.filters = { proyecto: record.proyecto, categoria: '', intencion: '', estado: '', search: '' };
        A.page = Math.floor(filtered().findIndex(p => p.id === record.id) / PAGE_SIZE) + 1;
      }
      A.notice = refreshed ? '' : 'El prompt se guardó, pero no se pudo actualizar la lista. Usa Reintentar para consultarla.';
      toast(refreshed ? (current.id ? 'Prompt actualizado.' : 'Prompt creado.') : A.notice);
    } catch (error) { if (!saved) { dialogError(error.message); toast(error.message); } }
    finally { A.mutation = false; setDialogBusy(false); renderAdmin(); }
  }
  async function toggleActive(id, active) {
    if (blocked()) return;
    const item = A.items.find(p => p.id === id); if (!item) return;
    const previous = item.activo; item.activo = active;
    A.mutation = true; A.busyId = id; A.notice = ''; renderAdmin();
    let committed = false;
    try {
      const result = await request('/geo-prompts-save', { id, activo: active });
      if (result?.ok !== true) throw new Error('El servidor no confirmó el cambio de estado.');
      committed = true;
      const refreshed = await loadList();
      if (!refreshed) A.notice = 'El estado se guardó, pero no se pudo actualizar la lista. Usa Reintentar.';
      toast(refreshed ? (active ? 'Prompt activado.' : 'Prompt desactivado.') : A.notice);
    } catch (error) { if (!committed) item.activo = previous; A.notice = error.message; toast(error.message); }
    finally { A.mutation = false; A.busyId = null; renderAdmin(); }
  }
  function confirmDelete(id) {
    if (blocked()) return;
    const p = A.items.find(item => item.id === id); if (!p) return;
    openDialog('delete', 'Eliminar prompt', `<div class="modal-body"><p class="pa-confirm-text">Se borrará del Google Sheet. Las mediciones anteriores se conservan.</p><blockquote class="pa-confirm-prompt">${html(p.prompt)}</blockquote><p class="small muted">Proyecto: ${html(p.proyecto)}</p><div id="pa-form-error" class="pa-form-error" role="alert" hidden></div></div>`, `<button type="button" class="button" data-pa-action="close-dialog">Cancelar</button><button type="button" class="button pa-danger" data-pa-confirm-delete="${html(id)}">Eliminar prompt</button>`);
  }
  async function deletePrompt(id) {
    if (blocked() || A.dialogKind !== 'delete') return;
    A.mutation = true; dialogError(''); setDialogBusy(true); renderAdmin();
    try {
      const result = await request('/geo-prompts-save', { id, accion: 'eliminar' });
      if (result?.ok !== true || result.accion !== 'eliminar' || result.id !== id) throw new Error('El servidor no confirmó la eliminación.');
      A.selected.delete(id); closeDialog(true);
      const refreshed = await loadList();
      A.notice = refreshed ? '' : 'El prompt se eliminó, pero no se pudo actualizar la lista. Usa Reintentar.';
      toast(refreshed ? 'Prompt eliminado. Las mediciones anteriores se conservan.' : A.notice);
    } catch (error) { dialogError(error.message); toast(error.message); }
    finally { A.mutation = false; setDialogBusy(false); renderAdmin(); }
  }
  let pendingRun = null;
  function confirmRun(selectedOnly) {
    if (blocked()) return;
    const ids = [...A.selected].filter(id => A.items.some(p => p.id === id));
    const count = selectedOnly ? ids.length : A.active;
    if (!count) return;
    pendingRun = { body: selectedOnly ? { prompt_ids: ids } : {}, count };
    openDialog('run', 'Confirmar medición', `<div class="modal-body"><p class="pa-confirm-text">Se medirán <b>${count} prompts ${selectedOnly ? 'seleccionados' : 'activos del catálogo completo'}</b>.</p><div class="pa-run-estimate"><span>Tiempo estimado</span><b>${estimate(count)}</b></div><p class="pa-cost-notice">Esta acción consume créditos de las APIs de los motores. La duración puede variar según su disponibilidad.</p>${!selectedOnly ? '<p class="small muted">Se incluyen todos los prompts activos, independientemente de los filtros de esta pantalla.</p>' : ''}<div id="pa-form-error" class="pa-form-error" role="alert" hidden></div></div>`, '<button type="button" class="button" data-pa-action="close-dialog">Cancelar</button><button type="button" class="button primary" data-pa-action="confirm-run">Confirmar e iniciar</button>');
  }
  async function startRun() {
    if (blocked() || A.dialogKind !== 'run' || !pendingRun) return;
    const body = pendingRun.body;
    A.mutation = true; dialogError(''); setDialogBusy(true); renderAdmin();
    try {
      const result = await request('/geo-run', body);
      if (typeof result?.message !== 'string' || !result.message.trim()) throw new Error('El servidor no confirmó el inicio de la medición.');
      A.afterRun = true; pendingRun = null; closeDialog(true);
      A.notice = 'Medición iniciada; los resultados aparecerán en unos minutos. Usa Actualizar datos cuando termine.';
      toast('Medición iniciada; los resultados aparecerán en unos minutos');
    } catch (error) { dialogError(error.message + ' Antes de repetir, comprueba las ejecuciones en n8n para evitar mediciones duplicadas.'); }
    finally { A.mutation = false; setDialogBusy(false); renderAdmin(); }
  }
  document.addEventListener('submit', e => { if (e.target.id === 'pa-editor-form') { e.preventDefault(); void saveEditor(e.target); } });
  document.addEventListener('input', e => {
    if (e.target.dataset.paFilter === 'search') { A.filters.search = e.target.value; A.page = 1; renderTable(); }
    if (e.target.id === 'pa-prompt' && byId('pa-char-count')) byId('pa-char-count').textContent = `${e.target.value.length} / 2.000 caracteres`;
  });
  document.addEventListener('change', e => {
    const el = e.target;
    if (el.dataset.paFilter && el.dataset.paFilter !== 'search') { A.filters[el.dataset.paFilter] = el.value; A.page = 1; renderTable(); }
    if (el.dataset.paSelect) { el.checked ? A.selected.add(el.dataset.paSelect) : A.selected.delete(el.dataset.paSelect); renderTable(); }
    if (el.id === 'pa-select-page') { filtered().slice((A.page - 1) * PAGE_SIZE, A.page * PAGE_SIZE).forEach(p => el.checked ? A.selected.add(p.id) : A.selected.delete(p.id)); renderTable(); }
    if (el.dataset.paToggle) void toggleActive(el.dataset.paToggle, el.checked);
    if (el.id === 'pa-project') {
      const isNew = el.value === '__pa_new_project__', input = byId('pa-new-project');
      byId('pa-new-project-wrap').hidden = !isNew; input.disabled = !isNew; input.required = isNew;
      if (isNew) input.focus();
    }
  });
  document.addEventListener('click', e => {
    const el = e.target.closest('button'); if (!el || el.disabled) return;
    if (el.dataset.paPage) { A.page += Number(el.dataset.paPage); renderTable(); return; }
    if (el.dataset.paEdit) { openEditor(el.dataset.paEdit); return; }
    if (el.dataset.paDelete) { confirmDelete(el.dataset.paDelete); return; }
    if (el.dataset.paConfirmDelete) { void deletePrompt(el.dataset.paConfirmDelete); return; }
    switch (el.dataset.paAction) {
      case 'new': openEditor(); break;
      case 'retry': case 'reload': if (!A.mutation) void loadList(); break;
      case 'close-dialog': closeDialog(); break;
      case 'clear-filters': A.filters = { proyecto: '', categoria: '', intencion: '', estado: '', search: '' }; A.page = 1; renderAdmin(); break;
      case 'clear-selection': A.selected.clear(); renderTable(); break;
      case 'run-all': confirmRun(false); break;
      case 'run-selected': confirmRun(true); break;
      case 'confirm-run': void startRun(); break;
      case 'refresh-data': window.location.reload(); break;
    }
  });
  const style = document.createElement('link'); style.rel = 'stylesheet'; style.href = 'prompts-admin.css?v=prompts-admin-1'; document.head.appendChild(style);
  // El HTML conserva solo data.js y loader.js; el indicador de UX se incorpora
  // después del arranque del monitor. La carga inicial mantiene su skeleton.
  if (!window.bcpLoader) {
    const indicator = document.createElement('script');
    indicator.src = 'bcp-loader.js?v=bcp-ux-8';
    document.head.appendChild(indicator);
  }
  renderShell();
  if (location.hash === '#' + ROUTE) readRoute();
})();
