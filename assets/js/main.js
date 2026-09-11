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

  /* ------------------------------- 8. Forma ------------------------------ */

  var form   = $('#kontaktForma');
  var status = $('#formStatus');
  var submit = $('#submitBtn');

  function setError(input, message) {
    var field = input.closest('.field');
    field.classList.add('has-error');
    input.setAttribute('aria-invalid', 'true');
    if (!$('.err', field)) {
      var p = document.createElement('span');
      p.className = 'err';
      p.textContent = message;
      field.appendChild(p);
    }
  }

  function clearError(input) {
    var field = input.closest('.field');
    field.classList.remove('has-error');
    input.removeAttribute('aria-invalid');
    var err = $('.err', field);
    if (err) err.remove();
  }

  function validate() {
    var ok = true;
    var first = null;

    [
      { el: $('#ime'),     msg: 'Upišite ime i prezime.',   test: function (v) { return v.length >= 2; } },
      { el: $('#telefon'), msg: 'Upišite broj telefona.',   test: function (v) { return v.replace(/[^\d]/g, '').length >= 6; } },
      { el: $('#poruka'),  msg: 'Napišite šta vam treba.',  test: function (v) { return v.length >= 5; } }
    ].forEach(function (rule) {
      clearError(rule.el);
      if (!rule.test(rule.el.value.trim())) {
        setError(rule.el, rule.msg);
        ok = false;
        if (!first) first = rule.el;
      }
    });

    var mail = $('#email');
    clearError(mail);
    if (mail.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail.value.trim())) {
      setError(mail, 'Proverite e-mail adresu.');
      ok = false;
      if (!first) first = mail;
    }

    if (first) first.focus();
    return ok;
  }

  $$('#kontaktForma input, #kontaktForma textarea').forEach(function (el) {
    el.addEventListener('input', function () {
      if (el.closest('.field') && el.closest('.field').classList.contains('has-error')) clearError(el);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.textContent = '';
    status.className = 'form-status';

    if (!validate()) return;

    var data = {};
    new FormData(form).forEach(function (value, key) { data[key] = value; });

    submit.disabled = true;
    var label = submit.innerHTML;
    submit.textContent = 'Šaljem…';

    fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (res) { return res.ok ? res.json() : Promise.reject(res); })
      .then(function () {
        form.reset();
        status.className = 'form-status ok';
        status.textContent = 'Hvala! Upit je poslat — javljamo se u najkraćem roku.';
      })
      .catch(function () {
        // Ako servis nije dostupan (ili forma još nije aktivirana),
        // korisnika ne ostavljamo bez izlaza — otvaramo mejl klijent.
        status.className = 'form-status bad';
        status.innerHTML = 'Slanje trenutno nije uspelo. Pozovite nas na ' +
          '<a href="tel:+381655522684">065/55-22-684</a> ili nam ' +
          '<a href="' + mailtoFallback(data) + '">pošaljite e-mail</a>.';
      })
      .finally(function () {
        submit.disabled = false;
        submit.innerHTML = label;
      });
  });

  function mailtoFallback(data) {
    var body = 'Ime: ' + (data.Ime || '') +
      '\nTelefon: ' + (data.Telefon || '') +
      '\nE-mail: ' + (data.Email || '') +
      '\n\n' + (data.Poruka || '');
    return 'mailto:firma.co.rs@gmail.com?subject=' +
      encodeURIComponent('Upit sa sajta GAGI MONT') +
      '&body=' + encodeURIComponent(body);
  }

})();
