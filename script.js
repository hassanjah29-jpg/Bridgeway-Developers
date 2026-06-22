/* ===================================================================
   Bridgeway Developers — vanilla JS (no build, no dependencies)
   =================================================================== */
(function () {
  'use strict';

  /* ---------- Sticky navbar background on scroll ---------- */
  var navbar = document.getElementById('navbar');
  function onScroll() {
    if (window.scrollY > 24) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    var btt = document.getElementById('backToTop');
    if (window.scrollY > 600) btt.classList.add('show');
    else btt.classList.remove('show');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  // close menu when a link is tapped
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Back to top ---------- */
  document.getElementById('backToTop').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Animated stat counters ---------- */
  var stats = document.querySelectorAll('.stat-num');
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1800;
    var start = null;
    function step(now) {
      if (!start) start = now;
      var p = Math.min((now - start) / duration, 1);
      var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p); // easeOutExpo
      var val = Math.round(eased * target);
      el.textContent = val.toLocaleString() + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(step);
      else el.innerHTML = val.toLocaleString() + '<span>' + suffix + '</span>';
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && stats.length) {
    var statObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    stats.forEach(function (el) { statObserver.observe(el); });
  } else {
    stats.forEach(function (el) {
      el.innerHTML = parseInt(el.getAttribute('data-target'), 10).toLocaleString() +
        '<span>' + (el.getAttribute('data-suffix') || '') + '</span>';
    });
  }

  /* ---------- Project filters ---------- */
  var filterBtns = document.querySelectorAll('.filter');
  var projects = document.querySelectorAll('.project');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.getAttribute('data-filter');
      projects.forEach(function (p) {
        var match = f === 'all' || p.getAttribute('data-category') === f;
        p.style.display = match ? '' : 'none';
      });
    });
  });

  /* ---------- Contact form (no backend — client-side success) ---------- */
  var form = document.getElementById('contactForm');
  var success = document.getElementById('formSuccess');
  var resetBtn = document.getElementById('resetForm');

  function setError(field, msg) {
    var wrap = field.closest('.field');
    wrap.classList.toggle('invalid', !!msg);
    wrap.querySelector('.err').textContent = msg || '';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.name, phone = form.phone, email = form.email, message = form.message;
    var ok = true;

    if (!name.value.trim()) { setError(name, 'Please enter your name'); ok = false; } else setError(name, '');
    if (!phone.value.trim()) { setError(phone, 'Please enter your phone number'); ok = false; } else setError(phone, '');
    if (!email.value.trim()) { setError(email, 'Please enter your email'); ok = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { setError(email, 'Please enter a valid email'); ok = false; }
    else setError(email, '');
    if (!message.value.trim()) { setError(message, 'Please tell us about your project'); ok = false; } else setError(message, '');

    if (!ok) return;

    // No backend: show the success state. Wire to an email service/API when ready.
    form.reset();
    form.hidden = true;
    success.hidden = false;
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      success.hidden = true;
      form.hidden = false;
    });
  }

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
