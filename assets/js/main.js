/* =========================================================
   Jamin — Landing page
   Scroll reveal, parallax, nav, tilt y envío del formulario
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Configuración ---------------------------- */

  // El correo se arma en tiempo de ejecución para no dejarlo
  // escrito tal cual en el HTML (menos spam de bots).
  var MAIL_USER = 'jaminepb';
  var MAIL_HOST = 'gmail.com';
  var EMAIL = MAIL_USER + '@' + MAIL_HOST;

  // FormSubmit reenvía el formulario a ese correo sin backend.
  // Para ocultar el correo del código: activa el servicio una vez,
  // copia el alias que te mandan y reemplaza EMAIL por ese alias.
  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/' + EMAIL;

  var WHATSAPP = '18159084163';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Año del footer --------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Enlace de correo ------------------------- */
  var emailLink = document.getElementById('emailLink');
  var emailText = document.getElementById('emailText');
  if (emailLink) {
    emailLink.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Quiero mi página web');
    if (emailText) emailText.textContent = EMAIL;
  }

  /* ---------- Header: estado al hacer scroll ----------- */
  var header = document.querySelector('.site-header');
  var progressBar = document.querySelector('.scroll-progress i');
  var waFloat = document.querySelector('.wa-float');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;

    if (header) header.classList.toggle('is-stuck', y > 20);
    if (waFloat) waFloat.classList.toggle('is-visible', y > 420);

    if (progressBar) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? (y / max) * 100 : 0;
      progressBar.style.width = pct.toFixed(2) + '%';
    }

    if (!prefersReduced) {
      parallaxEls.forEach(function (el) {
        var speed = parseFloat(el.dataset.parallax) || 0;
        el.style.transform = 'translate3d(0,' + (y * speed).toFixed(1) + 'px,0)';
      });
    }

    highlightNav(y);
  }

  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ---------- Menú móvil ------------------------------- */
  var navToggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');

  function closeMenu() {
    if (!navToggle || !mobileNav) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
    mobileNav.hidden = true;
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      navToggle.setAttribute('aria-label', open ? 'Abrir menú' : 'Cerrar menú');
      mobileNav.hidden = open;
    });

    mobileNav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  /* ---------- Reveal al hacer scroll ------------------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

  revealEls.forEach(function (el) {
    if (el.dataset.delay) el.style.setProperty('--d', el.dataset.delay + 'ms');
  });

  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Sección activa en el nav ----------------- */
  var sections = Array.prototype.slice.call(
    document.querySelectorAll('main section[id]')
  );
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a'));

  function highlightNav(y) {
    if (!sections.length) return;
    var current = '';
    var offset = y + (window.innerHeight * 0.32);

    sections.forEach(function (sec) {
      if (sec.offsetTop <= offset) current = sec.id;
    });

    navLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + current);
    });
  }

  /* ---------- Tilt 3D de la laptop --------------------- */
  var tiltHost = document.querySelector('.hero-visual');
  var tiltEl = document.querySelector('[data-tilt]');

  if (tiltHost && tiltEl && !prefersReduced && window.matchMedia('(hover: hover)').matches) {
    tiltHost.addEventListener('mousemove', function (e) {
      var r = tiltHost.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      tiltEl.style.setProperty('--ry', (px * 14 - 6).toFixed(2) + 'deg');
      tiltEl.style.setProperty('--rx', (7 - py * 12).toFixed(2) + 'deg');
    });

    tiltHost.addEventListener('mouseleave', function () {
      tiltEl.style.setProperty('--ry', '-6deg');
      tiltEl.style.setProperty('--rx', '7deg');
    });
  }

  /* ---------- Formulario de contacto ------------------- */
  var form = document.getElementById('contactForm');
  var statusEl = document.getElementById('formStatus');
  var submitBtn = document.getElementById('submitBtn');

  function setError(name, msg) {
    var input = form.elements[name];
    var slot = form.querySelector('[data-error-for="' + name + '"]');
    if (input) input.classList.toggle('invalid', Boolean(msg));
    if (slot) slot.textContent = msg || '';
    return !msg;
  }

  function validate() {
    var ok = true;
    var nombre = form.elements.nombre.value.trim();
    var email = form.elements.email.value.trim();
    var mensaje = form.elements.mensaje.value.trim();

    ok = setError('nombre', nombre.length < 2 ? 'Escribe tu nombre.' : '') && ok;
    ok = setError('email', /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? '' : 'Escribe un correo válido.') && ok;
    ok = setError('mensaje', mensaje.length < 10 ? 'Cuéntame un poco más (mínimo 10 caracteres).' : '') && ok;

    return ok;
  }

  function showStatus(kind, html) {
    if (!statusEl) return;
    statusEl.className = 'form-status ' + kind;
    statusEl.innerHTML = html;
  }

  function whatsappFallbackLink() {
    var nombre = form.elements.nombre.value.trim();
    var mensaje = form.elements.mensaje.value.trim();
    var texto = 'Hola Jamin, soy ' + (nombre || '') + '. ' + mensaje;
    return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto);
  }

  if (form) {
    // Limpia el error en cuanto el usuario corrige
    ['nombre', 'email', 'mensaje'].forEach(function (name) {
      var input = form.elements[name];
      if (input) {
        input.addEventListener('input', function () {
          if (input.classList.contains('invalid')) setError(name, '');
        });
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot: si viene lleno, es un bot.
      if (form.elements._honey && form.elements._honey.value) return;

      if (!validate()) {
        showStatus('err', 'Revisa los campos marcados y vuelve a intentar.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.classList.add('is-loading');
      showStatus('', '');

      var payload = {
        nombre: form.elements.nombre.value.trim(),
        email: form.elements.email.value.trim(),
        telefono: form.elements.telefono.value.trim() || 'No proporcionado',
        servicio: form.elements.servicio.value,
        mensaje: form.elements.mensaje.value.trim(),
        _subject: 'Nuevo mensaje desde tu landing: ' + form.elements.servicio.value,
        _template: 'table',
        _captcha: 'false'
      };

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then(function (res) { return res.json().catch(function () { return {}; }); })
        .then(function (data) {
          if (data && (data.success === 'true' || data.success === true)) {
            form.reset();
            showStatus('ok', '¡Listo! Tu mensaje ya va en camino. Te respondo hoy mismo.');
          } else {
            throw new Error('respuesta inesperada');
          }
        })
        .catch(function () {
          showStatus(
            'err',
            'No pude enviar el mensaje. Escríbeme por <a href="' + whatsappFallbackLink() +
            '" target="_blank" rel="noopener">WhatsApp</a> o a <a href="mailto:' + EMAIL + '">' + EMAIL + '</a>.'
          );
        })
        .then(function () {
          submitBtn.disabled = false;
          submitBtn.classList.remove('is-loading');
        });
    });
  }

  /* ---------- Arranque --------------------------------- */
  onScroll();
})();
