/* Movimiento funcional: transiciones breves, cifras estables y foco conservado. */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var menuFocus = null;
  function closeMenu() {
    document.body.classList.remove('ux-menu-open');
    var toggle=document.getElementById('uxMenuToggle');
    if(toggle)toggle.setAttribute('aria-expanded','false');
  }
  function start() {
    var scrim=document.createElement('button');scrim.className='ux-menu-scrim';scrim.type='button';scrim.setAttribute('aria-label','Cerrar menú');scrim.tabIndex=-1;document.body.appendChild(scrim);scrim.addEventListener('click',closeMenu);
    document.addEventListener('click',function(e){
      var toggle=e.target.closest('#uxMenuToggle');
      if(toggle){var open=!document.body.classList.contains('ux-menu-open');document.body.classList.toggle('ux-menu-open',open);toggle.setAttribute('aria-expanded',String(open));if(open){menuFocus=toggle;document.querySelector('#sidebar .side-link')?.focus()}return;}
      if(e.target.closest('[data-nav]'))closeMenu();
      var account=document.querySelector('.ux-account');if(account&&!e.target.closest('.ux-account'))account.open=false;
    });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'){if(document.body.classList.contains('ux-menu-open')){closeMenu();menuFocus?.focus()}var account=document.querySelector('.ux-account');if(account&&account.open){account.open=false;account.querySelector('summary')?.focus()}}
      if(e.key==='Tab'&&document.body.classList.contains('ux-menu-open')){
        var items=[...document.querySelectorAll('#sidebar button:not([disabled]),#sidebar summary,#sidebar a[href]')].filter(n=>n.getClientRects().length);
        var first=items[0],last=items[items.length-1];if(!first)return;
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
      }
    });
    var roots=['generalView','view'];
    roots.forEach(function(id){var root=document.getElementById(id);if(!root)return;
      new MutationObserver(function(records){if(reduced.matches)return;
        var added=records.flatMap(r=>[...r.addedNodes]).filter(n=>n.nodeType===1);
        added.slice(0,6).forEach(function(n,i){if(!n.animate)return;n.animate([{opacity:.55,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:220,delay:Math.min(i*18,72),easing:'cubic-bezier(.2,.75,.25,1)'})});
      }).observe(root,{childList:true});
    });
    window.addEventListener('resize',function(){if(innerWidth>=768)closeMenu()});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
