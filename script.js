/* =========================================
   Gold Edge Business Solution
   script.js — small, clean, no frameworks
   ========================================= */

(function () {
  'use strict';

  /* ---------- Team avatar photo upload ---------- */
  window.handleAvatarUpload = function (event, photoId, initialsId) {
    var file = event.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (e) {
      var photo    = document.getElementById(photoId);
      var initials = document.getElementById(initialsId);
      if (photo) {
        photo.src = e.target.result;
        photo.classList.add('has-photo');
      }
      if (initials) initials.style.display = 'none';
    };
    reader.readAsDataURL(file);
  };

  /* ---------- Year in footer ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // close on link click (mobile)
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Sticky navbar shadow on scroll ---------- */
  var navbar = document.getElementById('navbar');
  var onScroll = function () {
    if (!navbar) return;
    if (window.scrollY > 12) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Theme toggle (dark / light) ---------- */
  var themeToggle = document.getElementById('themeToggle');
  var saved = null;
  try { saved = localStorage.getItem('ge-theme'); } catch (e) {}

  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var initial = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(initial);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') || 'light';
      var next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('ge-theme', next); } catch (e) {}
    });
  }

  function applyTheme(mode) {
    if (mode === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
  }

  /* ---------- Reveal on scroll (IntersectionObserver) ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el, i) {
      // small natural-feeling stagger
      el.style.transitionDelay = (Math.min(i, 6) * 60) + 'ms';
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Smooth scroll fallback (for old browsers) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id.length <= 1) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ---------- Contact form (demo, no backend) ---------- */
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = (data.get('name') || '').toString().trim();
      var phone = (data.get('phone') || '').toString().trim();

      if (!name || !phone) {
        if (note) { note.style.color = '#e74c3c'; note.textContent = 'Please fill in your name and phone.'; }
        return;
      }

      // Open WhatsApp with prefilled message
      var plan = (data.get('plan') || '').toString();
      var msg  = (data.get('message') || '').toString();
      var text = 'Hi Gold Edge, I am ' + name + '. Phone: ' + phone +
                 '. Interested in: ' + plan + '. ' + (msg ? 'Note: ' + msg : '');
      var waUrl = 'https://wa.me/916295470093?text=' + encodeURIComponent(text);

      if (note) {
        note.style.color = '';
        note.textContent = '✓ Thanks ' + name + '! Opening WhatsApp to send your enquiry...';
      }
      
      // Fixed: Replaced setTimeout with window.location to bypass popup blockers on mobile/Safari
      window.location.href = waUrl; 
      form.reset();
    });
  }

})();