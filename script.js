/* ===================================================================
   Bridgeway Developers — vanilla JS (no build, no dependencies)
   =================================================================== */
(function () {
  'use strict';

  /* ---------- Intro loader (plays once per browser session) ---------- */
  var loader = document.getElementById('loader');
  if (loader) {
    var seen = false;
    try { seen = !!sessionStorage.getItem('bwLoaded'); } catch (e) {}
    if (seen) {
      loader.remove();
    } else {
      try { sessionStorage.setItem('bwLoaded', '1'); } catch (e) {}
      document.body.style.overflow = 'hidden';
      setTimeout(function () { document.body.style.overflow = ''; }, 3400);
      // remove from the DOM after it has faded out
      setTimeout(function () { if (loader && loader.parentNode) loader.parentNode.removeChild(loader); }, 4200);
    }
  }

  /* ---------- Navbar shadow + back-to-top on scroll ---------- */
  var navbar = document.getElementById('navbar');
  var backTop = document.getElementById('backToTop');
  function onScroll() {
    if (window.scrollY > 10) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
    if (window.scrollY > 600) backTop.classList.add('show');
    else backTop.classList.remove('show');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Animated stat counters ---------- */
  var stats = document.querySelectorAll('.istat-num');
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1800, start = null;
    function step(now) {
      if (!start) start = now;
      var p = Math.min((now - start) / duration, 1);
      var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = Math.round(eased * target).toLocaleString() + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && stats.length) {
    var statObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCount(entry.target); statObs.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    stats.forEach(function (el) { statObs.observe(el); });
  } else {
    stats.forEach(function (el) {
      el.textContent = parseInt(el.getAttribute('data-target'), 10).toLocaleString() + (el.getAttribute('data-suffix') || '');
    });
  }

  /* ---------- Projects carousel ---------- */
  var carousel = document.getElementById('projCarousel');
  var prev = document.getElementById('prevProj');
  var next = document.getElementById('nextProj');
  if (carousel && prev && next) {
    function scrollAmount() {
      var slide = carousel.querySelector('.slide');
      return slide ? slide.getBoundingClientRect().width + 24 : 360;
    }
    function updateArrows() {
      prev.disabled = carousel.scrollLeft <= 4;
      next.disabled = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 4;
    }
    prev.addEventListener('click', function () { carousel.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }); });
    next.addEventListener('click', function () { carousel.scrollBy({ left: scrollAmount(), behavior: 'smooth' }); });
    carousel.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    updateArrows();
  }

  /* ---------- Hero mute toggle ---------- */
  var video = document.getElementById('heroVideo');
  var muteBtn = document.getElementById('heroMute');
  if (video && muteBtn) {
    muteBtn.addEventListener('click', function () {
      video.muted = !video.muted;
      if (!video.muted) { video.volume = 1; video.play().catch(function () {}); }
      muteBtn.classList.toggle('unmuted', !video.muted);
      muteBtn.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
    });
  }

  /* ---------- Hero search bar (no backend → jump to projects) ---------- */
  var searchBar = document.getElementById('searchBar');
  if (searchBar) {
    searchBar.addEventListener('submit', function (e) {
      e.preventDefault();
      var target = document.getElementById('projects');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ---------- Contact form (no backend — client-side success) ---------- */
  var form = document.getElementById('contactForm');
  var success = document.getElementById('formSuccess');
  var resetBtn = document.getElementById('resetForm');
  function setError(field, msg) {
    var wrap = field.closest('.field');
    wrap.classList.toggle('invalid', !!msg);
    wrap.querySelector('.err').textContent = msg || '';
  }
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name, phone = form.phone, email = form.email, message = form.message, ok = true;
      if (!name.value.trim()) { setError(name, 'Please enter your name'); ok = false; } else setError(name, '');
      if (!phone.value.trim()) { setError(phone, 'Please enter your phone number'); ok = false; } else setError(phone, '');
      if (!email.value.trim()) { setError(email, 'Please enter your email'); ok = false; }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { setError(email, 'Please enter a valid email'); ok = false; }
      else setError(email, '');
      if (!message.value.trim()) { setError(message, 'Please tell us about your project'); ok = false; } else setError(message, '');
      if (!ok) return;
      form.reset();
      form.hidden = true;
      success.hidden = false;
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', function () { success.hidden = true; form.hidden = false; });
  }

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
