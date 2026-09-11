# GAGI MONT — sajt

Sajt za firmu **GAGI MONT** — montaža tendi, roletni, zavesa i komarnika, Niš.
Početna je jednostranična (one-page), uz nekoliko malih podstranica po usluzi
i blog indeks radi boljeg ranga na pretragama poput „montaža roletni Niš".

Čist **HTML + CSS + JavaScript**, bez frameworka. Jedini "build" korak je
mala Node skripta koja generiše podstranice (tačka 4) — sve ostalo je gotov
HTML koji možeš prosto prekopirati na bilo koji shared hosting (cPanel,
Plesk…), ili prevući na Netlify / Vercel.

---

## 1. Kako da pokreneš sajt lokalno

**Najlakše:** dupli klik na `index.html`. Sve radi osim Google mape (nekim
browserima smeta `file://` protokol) — za sve ostalo je sasvim dovoljno.

**Kako treba (preporučeno):** iz foldera projekta pokreni mini server koji dolazi
uz projekat (traži samo Node.js, bez ijedne instalacije):

```bash
node server.mjs
```

Pa otvori **http://localhost:5173**. Zaustavljaš ga sa `Ctrl + C`.

Alternativa, ako imaš Python:

```bash
python -m http.server 5173
```

---

## 2. Struktura foldera

```
gagi-mont-sajt/
├─ index.html                 ← početna (sve sekcije jedne strane)
├─ 404.html                   ← generisano, vidi tačku 4 — ne uređuj rucno
├─ usluge/
│  ├─ roletne/index.html      ← generisano
│  ├─ tende/index.html        ← generisano
│  ├─ komarnici/index.html    ← generisano
│  └─ zavese/index.html       ← generisano
├─ blog/index.html            ← generisano — spisak planiranih tekstova
├─ build-pages.mjs            ← skripta koja generiše sve gore navedeno
├─ server.mjs                 ← mini server za lokalni pregled
├─ optimize-images.mjs        ← skripta koja priprema slike (vidi tačku 3)
├─ robots.txt, sitemap.xml, netlify.toml, vercel.json
└─ assets/
   ├─ css/style.css           ← kompletan dizajn (zajednički za sve stranice)
   ├─ js/main.js              ← meni, galerija, filter, FAQ, WhatsApp/Viber upit
   ├─ fonts/                  ← Archivo + Manrope (self-hostovani .woff2)
   ├─ favicon.svg, favicon.png, apple-touch-icon.png
   └─ images/                 ← sve fotografije (.webp) + og slika (.jpg)
```

---

## 3. Kako da zameniš ili dodaš slike

Originali iz foldera `Desktop\gagi mont` su **već obrađeni**: iseckani (uklonjen
je „Activate Windows" vodeni žig i strelice sa slajdera, EXIF orijentacija
ispravljena), smanjeni i prebačeni u WebP.

### A) Brzo — zamena jedne slike

1. Novu sliku ubaci u `assets/images/`.
2. U `index.html` pronađi staru (Ctrl+F po imenu fajla) i upiši novo ime.
3. Obavezno prilagodi i `alt="..."` tekst — Google ga čita, a i čitači ekrana.

### B) Kako treba — ponovna obrada iz originala

Ako dobiješ nove fotografije, ubaci ih u `C:\Users\Sreten\Desktop\gagi mont` i
pokreni skriptu koja sve automatski isecka, smanji i konvertuje:

```bash
npm install sharp
node optimize-images.mjs
```

U skripti, u nizu `jobs`, svaki red je jedna slika:
`{ src: '15.png', out: 'tenda-rasklopljena', w: 1600, crop: LANDSCAPE_CROP }`

* `src` — ime originalnog fajla
* `out` — ime pod kojim se snima u `assets/images` (bez ekstenzije)
* `w` — širina u pikselima
* `crop` — `LANDSCAPE_CROP` seče ivice (žig sa slajdera), `NO_CROP` ne dira sliku

Fotografije sa telefona ponekad nose EXIF `orientation` (uspravna slika
zapisana "na boku"). Skripta to sama ispravlja (`autoOrient` + `orientedMeta()`)
— ne treba ništa ručno.

### C) Dodavanje slike u galeriju na početnoj

U `index.html`, u sekciji `<div class="gallery" id="gallery">`, kopiraj jedan
`<figure class="shot reveal" data-kat="...">` blok i zameni `src`, `alt`,
`width`, `height` i tekst u `<figcaption>`.

**Obavezno upiši `data-kat`** — bez toga se slika ne pojavljuje ni u jednom
filteru osim „Sve". Dozvoljene vrednosti (razdvojene razmakom ako slika
pripada u više kategorija): `roletne tende zavese komarnici harmonika garazna
terasa`. Puno uputstvo je i u samom `index.html`, kao komentar iznad galerije.

Lightbox (uvećanje na klik) i filter rade automatski — ne treba ništa u JS-u.

### D) Šta još nedostaje

* **Nema fotografija** za: venecijanere, okapnice i rasvetu/lustere/plafonjere.
* **Logo:** originalni logo je sačuvan kao `assets/images/gagi-mont-logo-original.webp`.
  U headeru se koristi SVG verzija (crta se kodom) da bi bila oštra na svakom
  ekranu i da radi i na tamnoj i na svetloj pozadini.

---

## 4. Podstranice usluga, blog i 404 — kako se generišu

`usluge/*/index.html`, `blog/index.html` i `404.html` se **ne uređuju ručno**.
Sajt nema build sistem, ali header, nav, footer i FAB se ponavljaju identično
na svakoj stranici — pa ih umesto ručnog kopiranja sastavlja skripta:

```bash
node build-pages.mjs
```

Sve što treba da promeniš je u samom `build-pages.mjs`:

* **Nav, footer, FAB, CTA traka** — menjaju se na jednom mestu (funkcije
  `header()`, `footer()`, `fab()`, `ctaBand()` na vrhu fajla) i primenjuju se
  na sve generisane stranice odjednom.
* **Sadržaj po usluzi** (naslov, opis, checklist, slike, meta) — niz `USLUGE`
  na sredini fajla. Dodavanje pete usluge znači dodavanje jednog objekta u taj niz.
* **Teme za blog** — niz `BLOG_TEME`. To su najavljeni naslovi, ne gotovi
  tekstovi — kad prvi tekst bude gotov, umesto teaser kartice treba napraviti
  pravu podstranicu (npr. `blog/kako-izabrati-roletne-za-terasu/index.html`,
  ista šema kao `usluge/*`) i tek onda joj dodati datum, autora i
  `BlogPosting` schema — ne pre nego što tekst zaista postoji.

Sprite ikonica se svaki put vadi direktno iz `index.html`, pa ne treba brinuti
da će nova ikonica dodata na početnoj nedostajati na podstranicama.

**Napomena o 404 stranici:** `404.html` mora da koristi **apsolutne** putanje
(`/assets/...`, `/index.html`) za sve — CSS, fontove, linkove. Browser na
pogrešnom URL-u (npr. `/usluge/nepostojeca/`) ostaje na toj adresi dok se
prikazuje sadržaj 404 stranice, pa bi relativne putanje (`../../assets/...`)
pucale u zavisnosti od dubine te (pogrešne) adrese. Vercel automatski servira
`404.html` sa korena sajta za svaku nepostojeću putanju; `server.mjs` radi
isto za lokalni pregled.

---

## 5. Upit — WhatsApp i Viber

Nema forme ni servisa za slanje mejla. Posetilac napiše poruku u polje i bira
aplikaciju:

- **WhatsApp** — poruka se prosleđuje kroz sam link (`wa.me/381655522684?text=...`),
  pa stiže već napisana. Radi i na telefonu i na računaru (WhatsApp Web).
- **Viber** — `viber://chat?number=+381655522684` otvara razgovor sa brojem, ali
  Viber **ne prima unapred upisan tekst** na taj način. Zato sajt poruku stavi u
  ostavu (clipboard) i javi korisniku da je nalepi. Viber link radi samo ako je
  aplikacija instalirana.

Broj je upisan na jednom mestu u `assets/js/main.js` (`var BROJ`) i u
`build-pages.mjs` (`TEL_HREF`/`TEL_PRIKAZ`) za podstranice. Ako se broj menja,
promeni ga na oba mesta pa ponovo pokreni `node build-pages.mjs`.

**Uslov:** broj 065/55-22-684 mora biti registrovan na WhatsApp-u, odnosno na
Viberu. Ako nije, dugme otvori aplikaciju i javi da broj nije dostupan.

Ispod dugmadi stoji i telefon, pa upit ne propada ni ako korisnik nema nijednu
od te dve aplikacije.

### E-mail link

Adresa u kontaktu i footeru ima klasu `js-mail`. Ponaša se različito po uređaju:

- **telefon / tablet** — pušta `mailto:` da otvori aplikaciju za poštu
- **računar** — otvara Gmail sastavljanje u novom tabu, sa upisanim primaocem
  i naslovom

Razlog: na računaru bez podešenog programa za poštu `mailto:` klik ne uradi
ništa, pa posetilac pomisli da link ne radi. Ako se ikad pređe na drugu adresu
koja nije Gmail, obriši taj deo u `main.js` (odeljak 9) i ostaće čist `mailto:`.

---

## 6. Pre nego što ide uživo (checklist)

* [x] ~~Upiši stvarni domen~~ — urađeno 11.09.2026, sajt je na
      `https://www.gagi-mont.rs`. Domen je registrovan kod **unlimited.rs**, a
      nameserveri su prebačeni na `ns1.vercel-dns.com` / `ns2.vercel-dns.com`,
      pa DNS-om upravlja Vercel. Ako ikad zatreba mejl tipa `info@gagi-mont.rs`,
      MX zapisi se dodaju u Vercel DNS-u, ne kod unlimited-a.
      Ako se domen menja: `index.html` (canonical, Open Graph, JSON-LD),
      `build-pages.mjs` (konstanta `DOMEN`, pa `node build-pages.mjs`),
      `robots.txt` i `sitemap.xml`.
* [ ] **Potvrdi sa Draganom** dva odgovora u FAQ sekciji na početnoj
      (`index.html`, `id="faq"`) pre nego što ih posetioci pročitaju kao
      obećanje: da li je merenje na terenu zaista besplatno, i tačan rok
      izrade/ugradnje ako želi da ga navede konkretnije od „zavisi od zauzetosti".
* [ ] **Gradovi van Niša** — FAQ i `areaServed` u schema.org trenutno kažu
      generično „i druge gradove širom Srbije", bez imenovanja. Kad se dobije
      tačan spisak gradova koje firma redovno pokriva, upisati ih poimenično
      (jači lokalni SEO) — u `index.html` (JSON-LD `areaServed`, FAQ odgovor
      na pitanje „Radite li i van Niša?") i u `build-pages.mjs` (isti niz u
      `schemaService.areaServed` za svaku uslugu).
* [ ] **Recenzije** — sajt trenutno nema sekciju sa Google recenzijama.
      Kad budu dostupne (sa pravim imenima i ocenama, ne izmišljene), dodati
      novu sekciju + `Review`/`AggregateRating` schema.
* [ ] Ako firma koristi drugi broj za WhatsApp/Viber od telefona za pozive,
      razdvojiti `BROJ` u `main.js` i `TEL_HREF` u `build-pages.mjs`.
* [ ] Prijavi sajt na **Google Search Console** i **Google Business Profile** —
      za lokalne pretrage („montaža tendi Niš") to vredi više od svega ostalog.
      Posle prijave, proveri da se NAP podaci (naziv, adresa, telefon) na
      sajtu i na Google profilu slažu do zareza.

---

## 7. Deploy

**Shared hosting:** prekopiraj ceo sadržaj foldera u `public_html/` (uključujući
`usluge/`, `blog/` i `404.html`). Ništa se ne kompajlira.

**Netlify:** prevuci folder na [app.netlify.com/drop](https://app.netlify.com/drop).
`netlify.toml` već podešava keširanje slika i fontova.

**Vercel:** iz foldera projekta `npx vercel --prod`.

Ako menjaš sadržaj podstranica, prvo pokreni `node build-pages.mjs`, pa tek
onda deploy — inače ide stara (ili nikakva) verzija tih fajlova.

---

## 8. Tehnički detalji

* Fontovi (Archivo + Manrope) su **self-hostovani** — nema poziva ka Google
  Fonts, pa nema ni čekanja ni problema sa GDPR-om.
* Slike su WebP; svaka ima `width`/`height` i `loading="lazy"` (osim hero i
  banner slika, koje se preučitavaju) — nema „poskakivanja" rasporeda dok se
  sajt učitava.
* SEO: semantički HTML5, meta opisi, Open Graph, i schema.org —
  `HomeAndConstructionBusiness` (adresa, koordinate, radno vreme, kontakt
  osoba), `Service` po podstranici, `FAQPage`, `BreadcrumbList` na
  podstranicama i `ImageObject` za ključne fotografije. `sitemap.xml` pokriva
  početnu i sve podstranice; `404.html` ima `noindex`.
* Pristupačnost: „preskoči na sadržaj" link, `aria` oznake, fokus se vidi,
  galerija i FAQ akordeon rade tastaturom, poštuje se `prefers-reduced-motion`.
* Google mapa se ne prikazuje u nekim izolovanim pregledima (npr. u editoru) —
  u pravom browseru radi normalno.
