/**
 * Generator podstranica usluga, bloga i 404 — GAGI MONT
 * ------------------------------------------------------
 * Sajt nema build sistem (čist HTML/CSS/JS), ali header, nav, footer i FAB
 * se ponavljaju na svakoj novoj stranici identično. Umesto da se to ručno
 * kopira šest puta (i vremenom razmimoiđe), ovaj skript sastavlja stranice
 * iz zajedničkih delova i upisuje gotove .html fajlove.
 *
 * index.html OSTAJE ručno pisan — generišu se samo nove stranice:
 *   usluge/roletne/index.html
 *   usluge/tende/index.html
 *   usluge/komarnici/index.html
 *   usluge/zavese/index.html
 *   blog/index.html
 *   404.html
 *
 * Pokretanje:  node build-pages.mjs
 *
 * Ako menjaš navigaciju, footer ili FAB — menjaj OVDE (funkcije header/
 * footer/fab ispod), pa ponovo pokreni skript. Ručna izmena u generisanom
 * fajlu će biti pregažena sledećim pokretanjem.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const DOMEN = 'https://www.gagimont.rs'; // TODO: zameni stvarnim domenom (isto kao u index.html)
const TEL_PRIKAZ = '065/55-22-684';
const TEL_HREF   = '+381655522684';
const MAIL       = 'gaggimont@gmail.com';

// Sprite se svaki put vadi direktno iz index.html, ne iz posebnog fajla —
// tako ne moze da zastari ako se tamo doda nova ikonica.
const INDEX_HTML = readFileSync('index.html', 'utf8');
const SPRITE_MATCH = INDEX_HTML.match(/<svg class="sprite"[\s\S]*?<\/svg>/);
if (!SPRITE_MATCH) throw new Error('Sprite blok nije nadjen u index.html');
const SPRITE = SPRITE_MATCH[0];

// ---------------------------------------------------------------------------
// Zajednički delovi (header / footer / fab / cta-band / breadcrumb)
// ---------------------------------------------------------------------------

function header(rel, aktivno) {
  const stavka = (href, tekst, kljuc) =>
    `<li><a href="${href}"${kljuc === aktivno ? ' class="is-active"' : ''}>${tekst}</a></li>`;
  return `<header class="site-header" id="siteHeader">
  <div class="wrap header-inner">

    <a class="brand" href="${rel}index.html" aria-label="GAGI MONT — početna strana">
      <span class="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 48 48" fill="none">
          <rect x="2.6" y="2.6" width="42.8" height="42.8" rx="7" stroke="currentColor" stroke-width="2.4"/>
          <circle cx="36.5" cy="13" r="3.2" fill="currentColor"/>
          <path d="M9 25.5 14.5 17h19L38 25.5Z" fill="currentColor"/>
          <path d="M9 25.5h29" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>
          <path d="M12.5 25.5V37M34.5 25.5V37" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>
        </svg>
      </span>
      <span class="brand-text">
        <strong>GAGI MONT</strong>
        <small>Montaža tendi i roletni · Niš</small>
      </span>
    </a>

    <nav class="nav" id="nav" aria-label="Glavna navigacija">
      <ul>
        <li><a href="${rel}index.html">Početna</a></li>
        ${stavka(`${rel}index.html#usluge`, 'Usluge', 'usluge')}
        <li><a href="${rel}index.html#o-nama">O nama</a></li>
        <li><a href="${rel}index.html#galerija">Galerija</a></li>
        ${stavka(`${rel}blog/`, 'Blog', 'blog')}
        <li><a href="${rel}index.html#faq">Pitanja</a></li>
        <li><a href="${rel}index.html#kontakt">Kontakt</a></li>
      </ul>
      <a class="btn btn-accent nav-cta" href="tel:${TEL_HREF}">
        <svg class="ico" aria-hidden="true"><use href="#i-telefon"/></svg>
        ${TEL_PRIKAZ}
      </a>
    </nav>

    <button class="burger" id="burger" type="button"
            aria-label="Otvori meni" aria-expanded="false" aria-controls="nav">
      <span></span><span></span><span></span>
    </button>

  </div>
</header>`;
}

function footer(rel) {
  return `<footer class="site-footer">
  <div class="wrap footer-grid">

    <div class="footer-brand">
      <a class="brand brand-footer" href="${rel}index.html" aria-label="GAGI MONT — početna strana">
        <span class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none">
            <rect x="2.6" y="2.6" width="42.8" height="42.8" rx="7" stroke="currentColor" stroke-width="2.4"/>
            <circle cx="36.5" cy="13" r="3.2" fill="currentColor"/>
            <path d="M9 25.5 14.5 17h19L38 25.5Z" fill="currentColor"/>
            <path d="M9 25.5h29" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>
            <path d="M12.5 25.5V37M34.5 25.5V37" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>
          </svg>
        </span>
        <span class="brand-text"><strong>GAGI MONT</strong></span>
      </a>
      <p>
        Proizvodnja, ugradnja i servisiranje roletni, tendi, zavesa i komarnika.
        Niš i cela teritorija Republike Srbije.
      </p>
    </div>

    <nav class="footer-col" aria-label="Brzi linkovi">
      <h2>Brzi linkovi</h2>
      <ul>
        <li><a href="${rel}index.html#usluge">Usluge</a></li>
        <li><a href="${rel}index.html#o-nama">O nama</a></li>
        <li><a href="${rel}index.html#galerija">Galerija</a></li>
        <li><a href="${rel}index.html#faq">Pitanja</a></li>
        <li><a href="${rel}index.html#kontakt">Kontakt</a></li>
        <li><a href="${rel}usluge/roletne/">Montaža roletni</a></li>
        <li><a href="${rel}usluge/tende/">Montaža tendi</a></li>
        <li><a href="${rel}usluge/komarnici/">Montaža komarnika</a></li>
        <li><a href="${rel}usluge/zavese/">Zavese</a></li>
        <li><a href="${rel}blog/">Blog</a></li>
      </ul>
    </nav>

    <div class="footer-col">
      <h2>Kontakt</h2>
      <ul>
        <li><a href="tel:${TEL_HREF}">${TEL_PRIKAZ}</a></li>
        <li><a class="js-mail" href="mailto:${MAIL}?subject=Upit%20sa%20sajta%20GAGI%20MONT">${MAIL}</a></li>
        <li>Zelengorska 10a<br>18000 Niš, Srbija</li>
      </ul>
    </div>

    <div class="footer-col">
      <h2>Radno vreme</h2>
      <ul>
        <li>Pon – Pet: <span>08–16h</span></li>
        <li>Subota: <span>08–16h</span></li>
        <li>Nedelja: <span>ne radimo</span></li>
      </ul>
    </div>

  </div>

  <div class="wrap footer-bottom">
    <p>&copy; <span id="godina">2026</span> GAGI MONT — Montaža tendi i roletni Niš. Sva prava zadržana.</p>
    <p><a href="${rel}index.html#pocetna">Nazad na početnu</a></p>
  </div>
</footer>`;
}

function fab(rel) {
  return `<div class="fab" aria-label="Brzi kontakt">
  <a class="fab-btn fab-call" href="tel:${TEL_HREF}" aria-label="Pozovite GAGI MONT na 065 55 22 684">
    <svg class="ico" aria-hidden="true"><use href="#i-telefon"/></svg>
    <span>Pozovite</span>
  </a>
  <a class="fab-btn fab-quote" href="${rel}index.html#kontakt" aria-label="Pređi na formu za upit">
    <svg class="ico" aria-hidden="true"><use href="#i-mail"/></svg>
    <span>Upit</span>
  </a>
</div>`;
}

function ctaBand(rel, naslov, opis) {
  return `<section class="cta-band reveal" aria-label="Pozovite ili zatražite ponudu">
  <div class="wrap cta-band-inner">
    <div class="cta-band-text">
      <h2>${naslov}</h2>
      <p>${opis}</p>
    </div>
    <div class="cta-band-actions">
      <a class="btn btn-invert btn-lg" href="tel:${TEL_HREF}">
        <svg class="ico" aria-hidden="true"><use href="#i-telefon"/></svg>
        Pozovite: ${TEL_PRIKAZ}
      </a>
      <a class="btn btn-ghost btn-lg" href="${rel}index.html#kontakt">
        Zatražite ponudu
        <svg class="ico" aria-hidden="true"><use href="#i-strelica"/></svg>
      </a>
    </div>
  </div>
</section>`;
}

function breadcrumb(rel, trail) {
  // trail: [{ label, href? }] — poslednji element je trenutna stranica (bez href)
  const stavke = trail.map((t, i) => {
    if (t.href) return `<a href="${t.href}">${t.label}</a>`;
    return `<span aria-current="page">${t.label}</span>`;
  });
  return `<nav class="breadcrumb" aria-label="Putanja"><div class="wrap">${stavke.join(' <span aria-hidden="true">/</span> ')}</div></nav>`;
}

function breadcrumbSchema(trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.label,
      item: t.url,
    })),
  };
}

// ---------------------------------------------------------------------------
// Osnovni "shell" — <head> i skeleton oko sadržaja
// ---------------------------------------------------------------------------

function pageShell({ rel, lang = 'sr-Latn-RS', title, description, canonical, ogImageAlt, robots = 'index, follow', preloadImg, bodyMain, schemas = [] }) {
  const schemaTags = schemas
    .map((s) => `<script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n</script>`)
    .join('\n\n');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>${title}</title>
<meta name="description" content="${description}">
<meta name="author" content="GAGI MONT">
<meta name="robots" content="${robots}">
<meta name="theme-color" content="#22262A">
<!-- TODO: zameni ${DOMEN}/ stvarnim domenom sajta (isto kao u index.html). -->
<link rel="canonical" href="${canonical}">

<meta property="og:type" content="website">
<meta property="og:locale" content="sr_RS">
<meta property="og:site_name" content="GAGI MONT">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${DOMEN}/assets/images/og-gagi-mont.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${ogImageAlt}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${DOMEN}/assets/images/og-gagi-mont.jpg">

<link rel="icon" href="${rel}assets/favicon.svg" type="image/svg+xml">
<link rel="alternate icon" href="${rel}assets/favicon.png" sizes="64x64" type="image/png">
<link rel="apple-touch-icon" href="${rel}assets/apple-touch-icon.png">

<link rel="preload" href="${rel}assets/fonts/archivo-latin-ext.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${rel}assets/fonts/manrope-latin-ext.woff2" as="font" type="font/woff2" crossorigin>
${preloadImg ? `<link rel="preload" href="${rel}${preloadImg}" as="image" fetchpriority="high">\n` : ''}<link rel="stylesheet" href="${rel}assets/css/style.css">

${schemaTags}
</head>

<body>

<a class="skip-link" href="#glavni-sadrzaj">Preskoči na sadržaj</a>

${SPRITE}

${header(rel)}

<main id="glavni-sadrzaj">
${bodyMain}
</main>

${footer(rel)}

${fab(rel)}

<script src="${rel}assets/js/main.js" defer></script>
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// Mini-galerija — vodi na filtriranu galeriju na početnoj, ne dupliramo
// lightbox markup/JS na svakoj podstranici.
// ---------------------------------------------------------------------------

function miniGallery(rel, kat, slike) {
  const stavke = slike.map(([src, alt]) => `
      <a href="${rel}index.html?usluga=${kat}#galerija" aria-label="Uvećaj u galeriji: ${alt}">
        <img src="${rel}assets/images/${src}.webp" width="600" height="450" loading="lazy" decoding="async" alt="${alt}">
      </a>`).join('');
  return `<div class="mini-gallery reveal">${stavke}
    </div>
    <p class="mini-gallery-note">
      <a class="link-arrow" href="${rel}index.html?usluga=${kat}#galerija">Sve fotografije iz ove kategorije
        <svg class="ico" aria-hidden="true"><use href="#i-strelica"/></svg>
      </a>
    </p>`;
}

// ---------------------------------------------------------------------------
// Sadržaj podstranica usluga
// ---------------------------------------------------------------------------

const USLUGE = [
  {
    slug: 'roletne',
    naslov: 'Montaža roletni',
    eyebrow: 'Usluge · Roletne',
    title: 'Montaža roletni Niš — spoljne i unutrašnje, ručne i motorne | GAGI MONT',
    description: 'Ugradnja i servis aluminijumskih roletni u Nišu i širom Srbije — spoljne i unutrašnje, ručne i motorne. Dodatna izolacija, zaštita od buke i sigurnost. Pozovite za besplatnu procenu.',
    banner: ['roletne-komarnici-kuca', 'Spoljne aluminijumske roletne u antracit boji sa ugrađenim komarnicima na porodičnoj kući', 1600, 672],
    intro: `Roletne su naša osnovna delatnost — i ono na čemu je GAGI MONT izgradio ime u Nišu.
      Ugrađujemo <strong>unutrašnje i spoljašnje</strong> roletne, sa <strong>ručnim ili motornim</strong>
      mehanizmom i daljinskim upravljanjem. Spoljne aluminijumske roletne, pored zaštite od svetlosti,
      objektu donose i primetno bolju toplotnu i zvučnu izolaciju, a spuštene i zaključane predstavljaju
      dodatnu prepreku za nezvane goste.`,
    sta: [
      'Spoljne aluminijumske roletne', 'Unutrašnje roletne', 'Ručni i motorni (daljinski) mehanizam',
      'Servis postojećih roletni — gurtna, lamele, motor', 'Dodatna toplotna i zvučna izolacija',
      'Pojačana sigurnost objekta',
    ],
    kat: 'roletne',
    slike: [
      ['roletne-komarnici-kuca', 'Spoljne aluminijumske roletne u antracit boji na porodičnoj kući'],
      ['roletne-komarnici-detalj', 'Detalj spoljnih roletni u antracit boji sa plise komarnicima'],
      ['bele-roletne-niz-prozora', 'Bele roletne spuštene preko niza prozora na fasadi'],
      ['spoljne-roletne-komarnik', 'Roletna sa ugrađenim komarnikom na prozoru'],
    ],
    cta: ['Spremni za merenje?', 'Dolazak radi merenja je bez obaveze — pozovite ili pišite, dogovaramo termin.'],
  },
  {
    slug: 'tende',
    naslov: 'Montaža tendi',
    eyebrow: 'Usluge · Tende',
    title: 'Montaža tendi Niš — za terase, balkone i bašte ugostiteljskih objekata | GAGI MONT',
    description: 'Izrada i ugradnja tendi za terase, balkone, restorane i kafiće u Nišu i širom Srbije. Fiksni i pokretni modeli, zaštita od sunca i kiše. Pozovite za besplatnu procenu.',
    banner: ['tenda-terasa-pergola', 'Tenda sa aluminijumskom konstrukcijom iznad popločane terase porodične kuće', 1600, 714],
    intro: `Tenda pretvara terasu, balkon ili baštu ugostiteljskog objekta u prostor koji se koristi
      i po suncu i po kiši. Radimo <strong>fiksne i pokretne (uvlačive)</strong> modele, na aluminijumskoj
      konstrukciji koja izdrži vetar i godine, sa platnom otpornim na UV zračenje i vremenske uslove.
      Merimo na licu mesta, pa je svaka tenda rađena po meri konkretnog otvora ili terase — ne po katalogu.`,
    sta: [
      'Tende za terase i balkone', 'Tende za baštu restorana i kafića', 'Fiksni modeli',
      'Pokretni (uvlačivi) modeli', 'Aluminijumska konstrukcija i nosači', 'Servis i zamena platna',
    ],
    kat: 'tende',
    slike: [
      ['tenda-rasklopljena', 'Velika rasklopljena tenda sa bež prugama iznad terase'],
      ['tende-kafic-basta', 'Zeleno-bele tende iznad bašte kafića sa drvenim stolovima'],
      ['tende-balkoni-zgrada', 'Bele tende razapete iznad balkona stambene zgrade'],
      ['tende-restoran-terasa', 'Zeleno-bele tende iznad bašte restorana, pogled odozdo'],
    ],
    cta: ['Planirate tendu za sezonu?', 'Merenje i procena su bez obaveze — javite se pa dogovaramo termin izlaska.'],
  },
  {
    slug: 'komarnici',
    naslov: 'Montaža komarnika',
    eyebrow: 'Usluge · Komarnici',
    title: 'Montaža komarnika Niš — fiksni, klizni, rolo i plise | GAGI MONT',
    description: 'Ugradnja komarnika za prozore i vrata u Nišu — fiksni, klizni, rolo i plise (harmonika) tip, u boji stolarije. Pozovite za besplatnu procenu.',
    banner: ['roletne-komarnici-detalj', 'Detalj spoljnih roletni u antracit boji sa plise komarnicima na prozorima', 1600, 686],
    intro: `Komarnik koji se ne primećuje dok ne zatreba — to je cilj. Ugrađujemo <strong>fiksne, klizne,
      rolo i plise (harmonika)</strong> komarnike za prozore, balkonska i ulazna vrata, u boji koja se
      uklapa u stolariju. Mreža ne remeti pogled, a demontira se lako kad zatreba čišćenje ili zamena.`,
    sta: [
      'Fiksni komarnici', 'Klizni komarnici', 'Rolo komarnici', 'Plise (harmonika) komarnici za vrata',
      'Mreža u boji stolarije', 'Ugradnja na prozore i balkonska/ulazna vrata',
    ],
    kat: 'komarnici',
    slike: [
      ['komarnik-plise-vrata', 'Plise komarnik na ulaznim vratima i rolo komarnik na prozoru'],
      ['roletne-komarnici-fasada', 'Antracit roletne i plise komarnik na ulazu porodične kuće'],
      ['spoljne-roletne-komarnik', 'Roletna sa ugrađenim komarnikom na prozoru'],
      ['roletne-komarnici-detalj', 'Detalj spoljnih roletni sa plise komarnicima'],
    ],
    cta: ['Leto stiže brže nego što mislite', 'Naručite komarnike na vreme — pozovite ili pišite za procenu.'],
  },
  {
    slug: 'zavese',
    naslov: 'Zavese',
    eyebrow: 'Usluge · Zavese',
    title: 'Zavese Niš — zebra, rolo i trakaste zavese | GAGI MONT',
    description: 'Ugradnja zebra, rolo i trakastih (vertikalnih) zavesa u Nišu i širom Srbije — za stanove, kuće i poslovne prostore. Široka paleta boja. Pozovite za besplatnu procenu.',
    banner: ['trakaste-zavese-zelene', 'Zelene trakaste zavese preko celog prozorskog zida u praznoj prostoriji', 1300, 973],
    intro: `Od zebra zavesa za dnevni boravak do trakastih zavesa za ceo prozorski zid poslovnog prostora —
      radimo <strong>zebra (dan-noć), rolo i trakaste (vertikalne)</strong> zavese, u širokoj paleti boja
      i materijala. Ugrađujemo u stanovima, kućama i poslovnim prostorima — kancelarijama, salonima,
      ordinacijama.`,
    sta: [
      'Zebra (dan-noć) zavese', 'Rolo zavese', 'Trakaste (vertikalne) zavese',
      'Ugradnja u stanovima i kućama', 'Ugradnja u poslovnim prostorima', 'Široka paleta boja i tekstura',
    ],
    kat: 'zavese',
    slike: [
      ['zebra-zavese-enterijer', 'Bele zebra zavese na balkonskim vratima i prozoru u dnevnoj sobi'],
      ['trakaste-zavese-salon', 'Crne i terakota trakaste zavese u kozmetičkom salonu'],
      ['rolo-zavese-ulaz', 'Rolo zavese u crnim kasetama na staklenoj ulaznoj partiji'],
      ['zebra-zavese-balkonska-vrata', 'Zebra zavese na balkonskim vratima i prozoru'],
    ],
    cta: ['Birate zavese za novi stan?', 'Pošaljite meru i sliku otvora — javljamo se sa predlogom i cenom.'],
  },
];

mkdirSync('usluge', { recursive: true });

for (const u of USLUGE) {
  const rel = '../../';
  const canonical = `${DOMEN}/usluge/${u.slug}/`;
  const [bannerSrc, bannerAlt, bw, bh] = u.banner;

  const schemaService = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: u.naslov,
    serviceType: u.naslov,
    description: u.description,
    provider: { '@id': `${DOMEN}/#gagimont` },
    areaServed: [{ '@type': 'City', name: 'Niš' }, { '@type': 'Country', name: 'Srbija' }],
    url: canonical,
  };
  const trail = [
    { label: 'Početna', href: `${rel}index.html`, url: `${DOMEN}/` },
    { label: 'Usluge', href: `${rel}index.html#usluge`, url: `${DOMEN}/#usluge` },
    { label: u.naslov, url: canonical },
  ];

  const body = `
${breadcrumb(rel, trail)}

<section class="section page-hero">
  <div class="wrap">
    <header class="section-head reveal">
      <p class="eyebrow">${u.eyebrow}</p>
      <h1 class="section-title">${u.naslov}</h1>
      <p class="section-lead">${u.intro}</p>
    </header>

    <div class="page-banner reveal">
      <img src="${rel}assets/images/${bannerSrc}.webp" width="${bw}" height="${bh}" loading="lazy" decoding="async"
           alt="${bannerAlt}">
    </div>

    <h2 class="page-sub reveal">Šta sve radimo</h2>
    <ul class="extras reveal">
      ${u.sta.map((s) => `<li><svg class="ico" aria-hidden="true"><use href="#i-cek"/></svg>${s}</li>`).join('\n      ')}
    </ul>

    <h2 class="page-sub reveal">Sa terena</h2>
    ${miniGallery(rel, u.kat, u.slike)}
  </div>
</section>

${ctaBand(rel, u.cta[0], u.cta[1])}
`;

  const html = pageShell({
    rel,
    title: u.title,
    description: u.description,
    canonical,
    ogImageAlt: bannerAlt,
    preloadImg: `assets/images/${bannerSrc}.webp`,
    bodyMain: body,
    schemas: [schemaService, breadcrumbSchema(trail)],
  });

  mkdirSync(`usluge/${u.slug}`, { recursive: true });
  writeFileSync(`usluge/${u.slug}/index.html`, html);
  console.log(`usluge/${u.slug}/index.html`);
}

// ---------------------------------------------------------------------------
// Blog — indeks sa planiranim naslovima (jasno obeleženo kao "uskoro", bez
// izmišljenih datuma ili lažnih objava).
// ---------------------------------------------------------------------------

const BLOG_TEME = [
  {
    naslov: 'Kako izabrati roletne za terasu — spoljne vs. unutrašnje',
    opis: 'Razlike u izolaciji, ceni i održavanju, i kad se koja vrsta zaista isplati.',
  },
  {
    naslov: 'Zebra vs. rolo zavese — šta bolje odgovara kojoj prostoriji',
    opis: 'Kontrola svetlosti, izgled i cena — vodič za izbor između dve najtraženije vrste zavesa.',
  },
  {
    naslov: 'Koliko traje montaža tende i od čega zavisi rok izrade',
    opis: 'Šta utiče na termin — od mere i materijala do trenutne sezonske gužve.',
  },
  {
    naslov: 'Motorne ili ručne roletne — isplati li se daljinski upravljač',
    opis: 'Cena razlike, pouzdanost i šta raditi ako nestane struje.',
  },
  {
    naslov: 'Priprema stana za zimu — roletne, zavese i izolacija prozora',
    opis: 'Praktičan pregled šta montaža roletni i komarnika menja u računu za grejanje.',
  },
];

{
  const rel = '../';
  const canonical = `${DOMEN}/blog/`;
  const title = 'Blog — saveti o roletnama, tendama i zavesama | GAGI MONT';
  const description = 'Praktični tekstovi o izboru i održavanju roletni, tendi, komarnika i zavesa. Teme u pripremi — uskoro prvi tekstovi.';
  const trail = [
    { label: 'Početna', href: `${rel}index.html`, url: `${DOMEN}/` },
    { label: 'Blog', url: canonical },
  ];

  const body = `
${breadcrumb(rel, trail)}

<section class="section page-hero">
  <div class="wrap">
    <header class="section-head reveal">
      <p class="eyebrow">Blog</p>
      <h1 class="section-title">Saveti o roletnama, tendama i zavesama</h1>
      <p class="section-lead">
        Ovde ćemo pisati kratke, praktične tekstove iz iskustva sa terena — bez marketinškog naklapanja.
        Prvi tekstovi su u pripremi; ispod je spisak tema na kojima radimo. Ako vas nešto konkretno
        zanima pre nego što tekst bude gotov, samo pozovite.
      </p>
    </header>

    <div class="blog-grid reveal">
      ${BLOG_TEME.map((t) => `<article class="blog-card">
        <span class="blog-card-tag">Uskoro</span>
        <h2>${t.naslov}</h2>
        <p>${t.opis}</p>
      </article>`).join('\n      ')}
    </div>
  </div>
</section>

${ctaBand(rel, 'Ne možete da čekate tekst?', 'Pozovite — odgovorićemo na pitanje odmah, bez čekanja na blog.')}
`;

  const html = pageShell({
    rel,
    title,
    description,
    canonical,
    ogImageAlt: 'GAGI MONT — logo firme',
    bodyMain: body,
    schemas: [breadcrumbSchema(trail)],
  });

  mkdirSync('blog', { recursive: true });
  writeFileSync('blog/index.html', html);
  console.log('blog/index.html');
}

// ---------------------------------------------------------------------------
// 404
// ---------------------------------------------------------------------------

{
  // VAŽNO: 404.html se servira na bilo kom pogrešnom URL-u (npr.
  // /usluge/nepostojeca/), ali adresa u browseru ostaje ta pogrešna —
  // relativne putanje bi se računale od NJE, ne od stvarnog mesta fajla.
  // Zato ovde rel MORA biti apsolutno "/", za CSS, fontove i sve linkove.
  const rel = '/';
  const title = 'Stranica nije pronađena (404) | GAGI MONT';
  const description = 'Stranica koju tražite ne postoji ili je premeštena. Vratite se na početnu ili nas pozovite direktno.';

  const body = `
<section class="section page-hero notfound">
  <div class="wrap">
    <p class="eyebrow reveal">Greška 404</p>
    <h1 class="section-title reveal">Ova stranica se, izgleda, spustila kao roletna.</h1>
    <p class="section-lead reveal">
      Link koji ste otvorili ne postoji ili je premešten. Krenite ponovo od početne, ili pozovite —
      brže je nego tražiti po sajtu.
    </p>
    <div class="hero-cta reveal" style="margin-top:28px">
      <a class="btn btn-accent btn-lg" href="tel:${TEL_HREF}">
        <svg class="ico" aria-hidden="true"><use href="#i-telefon"/></svg>
        Pozovite: ${TEL_PRIKAZ}
      </a>
      <a class="btn btn-outline btn-lg" href="/index.html">
        Nazad na početnu
        <svg class="ico" aria-hidden="true"><use href="#i-strelica"/></svg>
      </a>
    </div>
    <ul class="extras reveal" style="margin-top:40px; max-width:640px">
      <li><svg class="ico" aria-hidden="true"><use href="#i-cek"/></svg><a href="/usluge/roletne/">Montaža roletni</a></li>
      <li><svg class="ico" aria-hidden="true"><use href="#i-cek"/></svg><a href="/usluge/tende/">Montaža tendi</a></li>
      <li><svg class="ico" aria-hidden="true"><use href="#i-cek"/></svg><a href="/usluge/komarnici/">Montaža komarnika</a></li>
      <li><svg class="ico" aria-hidden="true"><use href="#i-cek"/></svg><a href="/usluge/zavese/">Zavese</a></li>
    </ul>
  </div>
</section>
`;

  const html = pageShell({
    rel,
    title,
    description,
    canonical: `${DOMEN}/404.html`,
    ogImageAlt: 'GAGI MONT — logo firme',
    robots: 'noindex, follow',
    bodyMain: body,
    schemas: [],
  });

  writeFileSync('404.html', html);
  console.log('404.html');
}

console.log('\nGotovo.');
