import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC = 'C:/Users/Sreten/Desktop/gagi mont';
const OUT = 'C:/Users/Sreten/Desktop/gagi-mont-sajt/assets/images';

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

// Landscape frames are screenshots from a slider: they carry a "Activate Windows"
// watermark bottom-right and carousel arrows on the sides. Trim those away.
const LANDSCAPE_CROP = { left: 0.05, right: 0.05, top: 0.0, bottom: 0.13 };
const NO_CROP = { left: 0, right: 0, top: 0, bottom: 0 };

const jobs = [
  { src: '1.png',  out: 'zebra-zavese-enterijer',      w: 900,  crop: NO_CROP },
  { src: '2.png',  out: 'spoljne-roletne-komarnik',    w: 900,  crop: NO_CROP },
  { src: '3.png',  out: 'komarnik-plise-vrata',        w: 900,  crop: NO_CROP },
  { src: '4.png',  out: 'tende-balkoni-zgrada',        w: 900,  crop: NO_CROP },
  { src: '5.png',  out: 'zatvaranje-terase-trakaste',  w: 1000, crop: NO_CROP },
  { src: '6.png',  out: 'tende-porodicna-kuca',        w: 1100, crop: NO_CROP },
  { src: '7.png',  out: 'tende-restoran-terasa',       w: 900,  crop: NO_CROP },
  { src: '8.png',  out: 'tende-kafic-basta',           w: 900,  crop: NO_CROP },
  { src: '10.png', out: 'roletne-komarnici-kuca',      w: 1600, crop: LANDSCAPE_CROP },
  { src: '11.png', out: 'roletne-komarnici-detalj',    w: 1600, crop: LANDSCAPE_CROP },
  { src: '13.png', out: 'tenda-nosaci-detalj',         w: 1600, crop: LANDSCAPE_CROP },
  { src: '14.png', out: 'tenda-terasa-pergola',        w: 1600, crop: LANDSCAPE_CROP },
  { src: '15.png', out: 'tenda-rasklopljena',          w: 1600, crop: LANDSCAPE_CROP },
  { src: '16.png', out: 'pergola-konstrukcija',        w: 1600, crop: LANDSCAPE_CROP },
  { src: '17.png', out: 'montaza-tende-majstor',       w: 1600, crop: LANDSCAPE_CROP },

  // Trakaste zavese — fotografije sa terena, bez slajder-zjga pa ne treba crop.
  { src: 'trakaste-salon.jpg',       out: 'trakaste-zavese-salon',       w: 1400, crop: NO_CROP },
  { src: 'trakaste-kancelarija.jpg', out: 'trakaste-zavese-kancelarija', w: 1100, crop: NO_CROP },
  { src: 'trakaste-ugao.jpg',        out: 'trakaste-zavese-ugao',        w: 1100, crop: NO_CROP },
  { src: 'trakaste-poslovni.jpg',    out: 'trakaste-zavese-poslovni',    w: 1100, crop: NO_CROP },

  // Rolo zavese u crnim kasetama sa vodjicama — poslovni prostor.
  { src: 'rolo-ulaz.jpg',        out: 'rolo-zavese-ulaz',        w: 1100, crop: NO_CROP },
  { src: 'rolo-kaseta.jpg',      out: 'rolo-zavese-kaseta',      w: 1100, crop: NO_CROP },
  { src: 'rolo-prozor.jpg',      out: 'rolo-zavese-prozor',      w: 1100, crop: NO_CROP },
  { src: 'rolo-tekstura.jpg',    out: 'rolo-zavese-tekstura',    w: 1100, crop: NO_CROP },
  { src: 'rolo-kancelarija.jpg', out: 'rolo-zavese-kancelarija', w: 1100, crop: NO_CROP },
];

function region(meta, crop) {
  const left = Math.round(meta.width * crop.left);
  const top = Math.round(meta.height * crop.top);
  return {
    left,
    top,
    width: meta.width - left - Math.round(meta.width * crop.right),
    height: meta.height - top - Math.round(meta.height * crop.bottom),
  };
}

let total = 0;
for (const job of jobs) {
  const img = sharp(path.join(SRC, job.src), { autoOrient: true });
  const meta = await img.metadata();
  const base = sharp(path.join(SRC, job.src), { autoOrient: true })
    .extract(region(meta, job.crop))
    .resize({ width: job.w, withoutEnlargement: true });

  const file = path.join(OUT, `${job.out}.webp`);
  await base.clone().webp({ quality: 76, effort: 6 }).toFile(file);
  total += fs.statSync(file).size;
}

// Hero: same frame, wider, plus a low-res blurred placeholder is unnecessary —
// the hero is preloaded instead.
{
  const meta = await sharp(path.join(SRC, '15.png'), { autoOrient: true }).metadata();
  await sharp(path.join(SRC, '15.png'), { autoOrient: true })
    .extract(region(meta, LANDSCAPE_CROP))
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(path.join(OUT, 'hero-tenda.webp'));

  // Open Graph / social preview needs a raster JPEG at 1200x630.
  await sharp(path.join(SRC, '15.png'), { autoOrient: true })
    .extract(region(meta, LANDSCAPE_CROP))
    .resize({ width: 1200, height: 630, fit: 'cover', position: 'centre' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(OUT, 'og-gagi-mont.jpg'));
}

// Original logo artwork, trimmed of its outer frame.
{
  const meta = await sharp(path.join(SRC, '18.png'), { autoOrient: true }).metadata();
  await sharp(path.join(SRC, '18.png'), { autoOrient: true })
    .extract({ left: 30, top: 30, width: meta.width - 60, height: meta.height - 60 })
    .resize({ width: 700 })
    .webp({ quality: 88 })
    .toFile(path.join(OUT, 'gagi-mont-logo-original.webp'));
}

for (const f of fs.readdirSync(OUT).sort()) {
  console.log(f.padEnd(38), (fs.statSync(path.join(OUT, f)).size / 1024).toFixed(0) + ' KB');
}
