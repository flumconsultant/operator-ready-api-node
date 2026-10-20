/* Indicador visual de solicitudes; conserva los contratos de fetch y XHR. */
(function () {
  'use strict';
  var el = document.createElement('div');
  el.id = 'bcpLoader';
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.setAttribute('aria-atomic', 'true');
  el.innerHTML = '<div class="bar" aria-hidden="true"></div><div class="pill"><span class="sp" aria-hidden="true"></span><span class="message"></span></div>';
  var message = el.querySelector('.message');
  function mount() { if (!el.parentNode) document.body.appendChild(el); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();

  var pending = 0, timer = null;
  function start() {
    pending++;
    if (timer === null && !el.classList.contains('on')) {
      timer = setTimeout(function () {
        timer = null;
        if (pending) { el.classList.add('on'); message.textContent = 'Actualizando datos…'; }
      }, 600);
    }
  }
  function stop() {
    pending = Math.max(0, pending - 1);
    if (!pending) {
      clearTimeout(timer); timer = null;
      el.classList.remove('on'); message.textContent = '';
    }
  }
  var originalFetch = window.fetch;
  if (originalFetch) window.fetch = function () {
    start();
    try { return originalFetch.apply(this, arguments).finally(stop); }
    catch (error) { stop(); throw error; }
  };
  if (typeof XMLHttpRequest !== 'undefined') {
    var originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
      var request = this, finished = false;
      function done() {
        if (finished) return;
        finished = true; request.removeEventListener('loadend', done); stop();
      }
      start(); request.addEventListener('loadend', done);
      try { return originalSend.apply(request, arguments); }
      catch (error) { done(); throw error; }
    };
  }
  window.bcpLoader = { show: start, hide: stop };
})();
