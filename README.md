# GAGI MONT — sajt

Jednostranični (one-page) sajt za firmu **GAGI MONT** — montaža tendi, roletni,
zavesa i komarnika, Niš.

Čist **HTML + CSS + JavaScript**, bez frameworka i bez build koraka. Foldere
možeš prosto prekopirati na bilo koji shared hosting (cPanel, Plesk…), ili
prevući na Netlify / Vercel.

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
├─ index.html                 ← ceo sajt (sve sekcije)
├─ server.mjs                 ← mini server za lokalni pregled
├─ optimize-images.mjs        ← skripta koja priprema slike (vidi tačku 3)
├─ robots.txt, sitemap.xml, netlify.toml
└─ assets/
   ├─ css/style.css           ← kompletan dizajn
   ├─ js/main.js              ← meni, galerija, filter, animacije, WhatsApp/Viber upit
   ├─ fonts/                  ← Archivo + Manrope (self-hostovani .woff2)
   ├─ favicon.svg, favicon.png, apple-touch-icon.png
   └─ images/                 ← sve fotografije (.webp) + og slika (.jpg)
```

---

## 3. Kako da zameniš ili dodaš slike

Originali iz foldera `Desktop\gagi mont` su **već obrađeni**: iseckani (uklonjen
je „Activate Windows" vodeni žig i strelice sa slajdera), smanjeni i prebačeni u
WebP. Ukupno su pali sa **~23 MB na ~900 KB**, pa se sajt učitava brzo.

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

### C) Dodavanje slike u galeriju

U `index.html`, u sekciji `<div class="gallery">`, kopiraj jedan `<figure class="shot">`
blok i zameni `src`, `alt`, `width`, `height` i tekst u `<figcaption>`.
Lightbox (uvećanje na klik) radi automatski — ne treba ništa u JS-u.

### D) Šta još nedostaje

U kodu su na tim mestima ostavljeni `TODO` komentari:

* **Nema fotografija** za: venecijanere, okapnice i rasvetu/lustere/plafonjere.
* **Logo:** originalni logo je sačuvan kao `assets/images/gagi-mont-logo-original.webp`.
  U headeru se koristi SVG verzija (crta se kodom) da bi bila oštra na svakom
  ekranu i da radi i na tamnoj i na svetloj pozadini.

---

## 4. Upit — WhatsApp i Viber

Nema forme ni servisa za slanje mejla. Posetilac napiše poruku u polje i bira
aplikaciju:

- **WhatsApp** — poruka se prosleđuje kroz sam link (`wa.me/381655522684?text=...`),
  pa stiže već napisana. Radi i na telefonu i na računaru (WhatsApp Web).
- **Viber** — `viber://chat?number=+381655522684` otvara razgovor sa brojem, ali
  Viber **ne prima unapred upisan tekst** na taj način. Zato sajt poruku stavi u
  ostavu (clipboard) i javi korisniku da je nalepi. Viber link radi samo ako je
  aplikacija instalirana.

Broj je upisan na jednom mestu u `assets/js/main.js` (`var BROJ`) i u `href`
atributima oba dugmeta u `index.html`. Ako se broj menja, promeni ga na sva tri.

**Uslov:** broj 065/55-22-684 mora biti registrovan na WhatsApp-u, odnosno na
Viberu. Ako nije, dugme otvori aplikaciju i javi da broj nije dostupan.

Ispod dugmadi stoji i telefon, pa upit ne propada ni ako korisnik nema nijednu
od te dve aplikacije.

---

## 5. Pre nego što ide uživo (checklist)

* [ ] Zameni `https://www.gagimont.rs/` stvarnim domenom — u `index.html`
      (canonical, Open Graph, JSON-LD), u `robots.txt` i u `sitemap.xml`.
* [ ] Aktiviraj kontakt formu (tačka 4).
* [ ] Ako firma koristi WhatsApp ili Viber, otkomentariši plutajuće dugme na dnu
      `index.html` (traži `TODO (opciono): WhatsApp`).
* [ ] Prijavi sajt na **Google Search Console** i **Google Business Profile** —
      za lokalne pretrage („montaža tendi Niš") to vredi više od svega ostalog.

---

## 6. Deploy

**Shared hosting:** prekopiraj ceo sadržaj foldera u `public_html/`. Ništa se ne
kompajlira.

**Netlify:** prevuci folder na [app.netlify.com/drop](https://app.netlify.com/drop).
`netlify.toml` već podešava keširanje slika i fontova.

**Vercel:** iz foldera projekta `npx vercel --prod`.

---

## 7. Tehnički detalji

* Fontovi (Archivo + Manrope) su **self-hostovani** — nema poziva ka Google
  Fonts, pa nema ni čekanja ni problema sa GDPR-om.
* Slike su WebP; svaka ima `width`/`height` i `loading="lazy"` (osim hero slike,
  koja se preučitava) — nema „poskakivanja" rasporeda dok se sajt učitava.
* SEO: semantički HTML5, meta opis, Open Graph, i `schema.org`
  `HomeAndConstructionBusiness` sa adresom, koordinatama i radnim vremenom.
* Pristupačnost: „preskoči na sadržaj" link, `aria` oznake, fokus se vidi,
  galerija se otvara i zatvara tastaturom, poštuje se `prefers-reduced-motion`.
* Google mapa se ne prikazuje u nekim izolovanim pregledima (npr. u editoru) —
  u pravom browseru radi normalno.
