/* =========================================================================
   GAGI MONT — assets/js/main.js
   Bez zavisnosti. Sve je progresivno: ako JS ne radi, sajt i dalje radi.
   ========================================================================= */
(function () {
  'use strict';

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------- 1. Sticky header --------------------------- */

  var header = $('#siteHeader');
  var fab    = $('.fab');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle('is-stuck', y > 40);
    if (fab) fab.classList.toggle('is-on', y > 420);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --------------------------- 2. Mobilni meni --------------------------- */

  var burger = $('#burger');
  var nav    = $('#nav');

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Zatvori meni' : 'Otvori meni');
  }

  burger.addEventListener('click', function () {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });

  document.addEventListener('click', function (e) {
    if (nav.classList.contains('is-open') &&
        !e.target.closest('#nav') && !e.target.closest('#burger')) {
      setMenu(false);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setMenu(false);
      burger.focus();
    }
  });

  /* --------------------- 3. Aktivna stavka u meniju ---------------------- */

  var navLinks = $$('#nav > ul a[href^="#"]');
  var sections = navLinks
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ------------------------ 4. Otkrivanje pri skrolu --------------------- */

  var revealables = $$('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach(function (el) { revealer.observe(el); });
  }

  /* ------------------------------ 5. Lightbox ---------------------------- */

  var lb        = $('#lightbox');
  var lbImg     = $('#lbImg');
  var lbCaption = $('#lbCaption');
  var shots     = $$('#gallery .shot');
  var vidljive  = shots.slice();   // podskup koji filter trenutno prikazuje
  var current   = 0;
  var lastFocus = null;

  function osveziVidljive() {
    vidljive = shots.filter(function (fig) { return !fig.hidden; });
  }

  function show(index) {
    if (!vidljive.length) return;
    current = (index + vidljive.length) % vidljive.length;
    var fig = vidljive[current];
    var img = $('img', fig);
    var cap = $('figcaption', fig);

    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = cap ? cap.textContent : '';
  }

  function openLightbox(index) {
    lastFocus = document.activeElement;
    show(index);
    lb.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function () { lb.classList.add('is-open'); });
    $('#lbClose').focus();
  }

  function closeLightbox() {
    lb.classList.remove('is-open');
    document.documentElement.style.overflow = '';
    window.setTimeout(function () {
      lb.hidden = true;
      lbImg.removeAttribute('src');
    }, reduceMotion ? 0 : 250);
    if (lastFocus) lastFocus.focus();
  }

  shots.forEach(function (fig) {
    $('.shot-btn', fig).addEventListener('click', function () {
      osveziVidljive();
      openLightbox(vidljive.indexOf(fig));
    });
  });

  /* --------------------- 5b. Filter galerije po usluzi -------------------- */

  var filterBtns = $$('.filter-btn');
  var galPrazno  = $('#galPrazno');

  function kategorijeOd(fig) {
    return (fig.getAttribute('data-kat') || '').split(' ');
  }

  // Brojevi pored naziva se racunaju iz same galerije, da ne zastare.
  filterBtns.forEach(function (btn) {
    var kat = btn.getAttribute('data-kat');
    var n = kat === 'sve'
      ? shots.length
      : shots.filter(function (fig) { return kategorijeOd(fig).indexOf(kat) !== -1; }).length;
    $('.filter-n', btn).textContent = n;
    btn.hidden = n === 0;
  });

  function primeniFilter(kat, pomeriUrl) {
    if (!filterBtns.some(function (b) { return b.getAttribute('data-kat') === kat; })) kat = 'sve';

    shots.forEach(function (fig) {
      var prikazi = kat === 'sve' || kategorijeOd(fig).indexOf(kat) !== -1;
      fig.hidden = !prikazi;
      // Slike koje observer nije stigao da otkrije ostale bi providne.
      if (prikazi) fig.classList.add('is-in');
    });

    filterBtns.forEach(function (btn) {
      var on = btn.getAttribute('data-kat') === kat;
      btn.classList.toggle('is-on', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    osveziVidljive();
    galPrazno.hidden = vidljive.length > 0;

    if (pomeriUrl && window.history && history.replaceState) {
      history.replaceState(null, '',
        location.pathname + (kat === 'sve' ? '' : '?usluga=' + kat) + '#galerija');
    }
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      primeniFilter(btn.getAttribute('data-kat'), true);
    });
  });

  // Kartice u "O nama" vode na galeriju vec filtriranu na tu uslugu.
  $$('.about-item[data-kat]').forEach(function (kartica) {
    kartica.addEventListener('click', function () {
      primeniFilter(kartica.getAttribute('data-kat'), true);
    });
  });

  // Deljiv link oblika ...?usluga=zavese#galerija
  var izUrl = /[?&]usluga=([a-z]+)/.exec(location.search);
  if (izUrl) primeniFilter(izUrl[1], false);

  $('#lbClose').addEventListener('click', closeLightbox);
  $('#lbPrev').addEventListener('click', function () { show(current - 1); });
  $('#lbNext').addEventListener('click', function () { show(current + 1); });

  lb.addEventListener('click', function (e) {
    // Klik na pozadinu (a ne na sliku ili dugmad) zatvara.
    if (e.target === lb || e.target.classList.contains('lb-figure')) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape')     { closeLightbox(); }
    if (e.key === 'ArrowLeft')  { show(current - 1); }
    if (e.key === 'ArrowRight') { show(current + 1); }
    if (e.key === 'Tab') {
      // Fokus ostaje u dijalogu.
      var focusables = $$('button', lb);
      var first = focusables[0];
      var last  = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ------------------- 6. "Danas" u tabeli radnog vremena ---------------- */

  var today = new Date().getDay(); // 0 = nedelja
  $$('#hours tr').forEach(function (tr) {
    var days = (tr.getAttribute('data-day') || '').split(' ');
    if (days.indexOf(String(today)) !== -1) tr.classList.add('is-today');
  });

  /* ---------------------------- 7. Godina u futeru ----------------------- */

  var yearEl = $('#godina');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------- 8. Upit preko WhatsApp-a i Vibera ------------------ */

  var poruka   = $('#poruka');
  var waBtn    = $('#waBtn');
  var viberBtn = $('#viberBtn');
  var status   = $('#formStatus');

  var BROJ  = '381655522684';
  var VIBER = 'viber://chat?number=%2B' + BROJ;

  function tekstPoruke() {
    var v = poruka.value.trim();
    return v ? 'Upit sa sajta GAGI MONT:\n\n' + v : '';
  }

  function javi(vrsta, tekst) {
    status.className = 'form-status' + (vrsta ? ' ' + vrsta : '');
    status.textContent = tekst;
  }

  // WhatsApp prima tekst kroz sam link, pa ga sastavljamo na klik.
  waBtn.addEventListener('click', function (e) {
    e.preventDefault();
    var t = tekstPoruke();
    javi('', '');
    window.open('https://wa.me/' + BROJ + (t ? '?text=' + encodeURIComponent(t) : ''),
                '_blank', 'noopener');
  });

  // Viber ne ume da unapred popuni poruku kad otvara razgovor sa brojem,
  // pa tekst stavljamo u ostavu da korisnik samo nalepi.
  viberBtn.addEventListener('click', function (e) {
    e.preventDefault();
    var v = poruka.value.trim();
    if (!v) { window.location.href = VIBER; return; }

    uOstavu(v).then(function (uspelo) {
      javi('ok', uspelo
        ? 'Poruka je kopirana — samo je nalepite u Viber.'
        : 'Otvaramo Viber — poruku prekopirajte iz polja iznad.');
      window.setTimeout(function () { window.location.href = VIBER; }, 400);
    });
  });

  function uOstavu(tekst) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(tekst).then(
        function () { return true; },
        function () { return false; }
      );
    }
    try {
      poruka.select();
      var ok = document.execCommand('copy');
      poruka.setSelectionRange(poruka.value.length, poruka.value.length);
      return Promise.resolve(ok);
    } catch (greska) {
      return Promise.resolve(false);
    }
  }

  /* ----------------- 9. E-mail: klik uvek negde odvede ------------------- */

  // Na telefonu mailto: uredno otvori aplikaciju za postu. Na racunaru bez
  // podesenog programa klik ne uradi bukvalno nista, pa tamo otvaramo Gmail
  // sa vec upisanim primaocem i naslovom.

  var MAIL   = 'gaggimont@gmail.com';
  var NASLOV = 'Upit sa sajta GAGI MONT';

  function imaDodir() {
    return window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  }

  $$('.js-mail').forEach(function (veza) {
    veza.addEventListener('click', function (e) {
      if (imaDodir()) return;   // pusti mailto: da odradi svoje
      e.preventDefault();
      window.open(
        'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(MAIL) +
        '&su=' + encodeURIComponent(NASLOV),
        '_blank', 'noopener'
      );
    });
  });

})();
