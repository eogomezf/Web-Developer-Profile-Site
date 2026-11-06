/* ==========================================================================
   Elvis Gómez Floegel — Portafolio
   main.js — sin dependencias externas
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;

  /* ------------------------------------------------------------------
     1. Selector de perfil (tabs)
     Sin JavaScript se muestran ambos paneles; con JS se controla por tabs.
     ------------------------------------------------------------------ */
  var tablist = doc.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(doc.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(doc.querySelectorAll('[data-panel]'));

  function activateTab(name, focus) {
    tabs.forEach(function (tab) {
      var selected = tab.dataset.tab === name;
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focus) { tab.focus(); }
    });

    panels.forEach(function (panel) {
      panel.hidden = panel.dataset.panel !== name;
    });

    try {
      history.replaceState(null, '', '#perfil-' + name);
    } catch (e) { /* file:// o navegador antiguo */ }
  }

  if (tablist && tabs.length && panels.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        activateTab(tab.dataset.tab, false);
      });
    });

    tablist.addEventListener('keydown', function (event) {
      var index = tabs.indexOf(doc.activeElement);
      if (index === -1) { return; }

      var next = null;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        next = (index + 1) % tabs.length;
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        next = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === 'Home') {
        next = 0;
      } else if (event.key === 'End') {
        next = tabs.length - 1;
      }

      if (next !== null) {
        event.preventDefault();
        activateTab(tabs[next].dataset.tab, true);
      }
    });

    // Perfil inicial según el hash de la URL (#perfil-dev / #perfil-ti)
    var hash = (window.location.hash || '').toLowerCase();
    var initial = hash.indexOf('perfil-dev') !== -1 ? 'dev' : 'ti';
    activateTab(initial, false);
  }

  /* ------------------------------------------------------------------
     2. Menú de navegación en móvil
     ------------------------------------------------------------------ */
  var header = doc.querySelector('.site-header');
  var navToggle = doc.querySelector('.nav-toggle');

  if (header && navToggle) {
    navToggle.addEventListener('click', function () {
      var open = header.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    });

    // Cerrar el menú al navegar
    header.querySelectorAll('.main-nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        header.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Cerrar al hacer clic fuera
    doc.addEventListener('click', function (event) {
      if (!header.classList.contains('nav-open')) { return; }
      if (!header.contains(event.target)) {
        header.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ------------------------------------------------------------------
     3. Botón "volver arriba"
     ------------------------------------------------------------------ */
  var toTop = doc.querySelector('[data-to-top]');

  if (toTop) {
    var updateToTop = function () {
      toTop.classList.toggle('is-visible', window.scrollY > 420);
    };
    window.addEventListener('scroll', updateToTop, { passive: true });
    updateToTop();

    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------
     4. Año del pie de página
     ------------------------------------------------------------------ */
  doc.querySelectorAll('[data-year]').forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  /* ------------------------------------------------------------------
     5. Formulario de contacto (Netlify Forms)
     Envío por AJAX con fallback al envío nativo.
     ------------------------------------------------------------------ */
  var form = doc.querySelector('.contact-form');
  var status = doc.querySelector('[data-form-status]');

  if (form && status) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var data = new FormData(form);
      var button = form.querySelector('button[type="submit"]');
      var originalText = button ? button.textContent : '';

      status.className = 'form-status is-visible';
      status.textContent = 'Enviando mensaje…';
      if (button) {
        button.disabled = true;
        button.textContent = 'Enviando…';
      }

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString()
      })
        .then(function (response) {
          if (!response.ok) { throw new Error('HTTP ' + response.status); }
          form.reset();
          status.className = 'form-status is-visible is-ok';
          status.textContent = '¡Gracias! Tu mensaje fue enviado. Te responderé en menos de 24 horas hábiles.';
        })
        .catch(function () {
          status.className = 'form-status is-visible is-error';
          status.textContent = 'Hubo un problema al enviar el mensaje. Escríbeme directo a elvis.gomez.f@hotmail.com o al +505 5723 2389.';
        })
        .finally(function () {
          if (button) {
            button.disabled = false;
            button.textContent = originalText;
          }
        });
    });
  }
})();
