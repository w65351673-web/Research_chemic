import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

const productSchema = new mongoose.Schema({
  name: String, slug: String, category: String,
  images: [String], description: String,
  priceVariants: [{ quantity: Number, price: Number }],
  countInStock: Number, rating: Number, numReviews: Number, featured: Boolean,
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const opioids = [
  {
    name: 'Morphine Sulfate',
    slug: 'morphine-sulfate',
    category: 'opioids',
    images: [],
    description: 'Pharmaceutical-grade morphine sulfate for research and analytical purposes. 99%+ purity. Certificate of analysis provided. For scientific research only.',
    priceVariants: [
      { quantity: 25, price: 400 },
      { quantity: 50, price: 550 },
      { quantity: 100, price: 700 },
      { quantity: 500, price: 1200 },
      { quantity: 1000, price: 2100 },
    ],
    countInStock: 30,
    rating: 4.8,
    numReviews: 14,
    featured: true,
  },
  {
    name: 'Heroin (Diacetylmorphine)',
    slug: 'heroin-diacetylmorphine',
    category: 'opioids',
    images: [],
    description: 'High-purity diacetylmorphine research compound. 99%+ purity verified by HPLC analysis. Certificate of analysis included. For laboratory research only.',
    priceVariants: [
      { quantity: 25, price: 450 },
      { quantity: 50, price: 600 },
      { quantity: 100, price: 800 },
      { quantity: 500, price: 1400 },
      { quantity: 1000, price: 2400 },
    ],
    countInStock: 25,
    rating: 4.7,
    numReviews: 9,
    featured: true,
  },
  {
    name: 'Codeine Phosphate',
    slug: 'codeine-phosphate',
    category: 'opioids',
    images: [],
    description: 'Research-grade codeine phosphate for analytical chemistry and pharmacological studies. 99%+ purity. Fully documented with CoA. For scientific research only.',
    priceVariants: [
      { quantity: 25, price: 350 },
      { quantity: 50, price: 480 },
      { quantity: 100, price: 620 },
      { quantity: 500, price: 1050 },
      { quantity: 1000, price: 1800 },
    ],
    countInStock: 40,
    rating: 4.7,
    numReviews: 18,
    featured: false,
  },
  {
    name: 'Oxycodone HCl',
    slug: 'oxycodone-hcl',
    category: 'opioids',
    images: [],
    description: 'Pharmaceutical-grade oxycodone hydrochloride for research applications. 99%+ purity by HPLC. Certificate of analysis provided. For laboratory use only.',
    priceVariants: [
      { quantity: 25, price: 420 },
      { quantity: 50, price: 570 },
      { quantity: 100, price: 750 },
      { quantity: 500, price: 1300 },
      { quantity: 1000, price: 2200 },
    ],
    countInStock: 28,
    rating: 4.8,
    numReviews: 21,
    featured: true,
  },
  {
    name: 'Hydrocodone Bitartrate',
    slug: 'hydrocodone-bitartrate',
    category: 'opioids',
    images: [],
    description: 'High-purity hydrocodone bitartrate research compound. 99%+ purity verified by mass spectrometry. Certificate of analysis included. For scientific research only.',
    priceVariants: [
      { quantity: 25, price: 410 },
      { quantity: 50, price: 560 },
      { quantity: 100, price: 730 },
      { quantity: 500, price: 1250 },
      { quantity: 1000, price: 2150 },
    ],
    countInStock: 22,
    rating: 4.6,
    numReviews: 12,
    featured: false,
  },
  {
    name: 'Fentanyl Citrate',
    slug: 'fentanyl-citrate',
    category: 'opioids',
    images: [],
    description: 'Research-grade fentanyl citrate for pharmacological studies and analytical chemistry. 99%+ purity. Full documentation and CoA provided. For laboratory research only.',
    priceVariants: [
      { quantity: 25, price: 500 },
      { quantity: 50, price: 700 },
      { quantity: 100, price: 950 },
      { quantity: 500, price: 1700 },
      { quantity: 1000, price: 2900 },
    ],
    countInStock: 20,
    rating: 4.9,
    numReviews: 27,
    featured: true,
  },
  {
    name: 'Methadone HCl',
    slug: 'methadone-hcl',
    category: 'opioids',
    images: [],
    description: 'Pharmaceutical-grade methadone hydrochloride for research purposes. 99%+ purity verified by HPLC and NMR. Certificate of analysis provided. For scientific research only.',
    priceVariants: [
      { quantity: 25, price: 380 },
      { quantity: 50, price: 520 },
      { quantity: 100, price: 680 },
      { quantity: 500, price: 1150 },
      { quantity: 1000, price: 1950 },
    ],
    countInStock: 35,
    rating: 4.7,
    numReviews: 16,
    featured: false,
  },
  {
    name: 'Tramadol HCl',
    slug: 'tramadol-hcl',
    category: 'opioids',
    images: [],
    description: 'High-purity tramadol hydrochloride for analytical and pharmacological research. 99%+ purity. Certificate of analysis included. For laboratory use only.',
    priceVariants: [
      { quantity: 25, price: 320 },
      { quantity: 50, price: 440 },
      { quantity: 100, price: 580 },
      { quantity: 500, price: 980 },
      { quantity: 1000, price: 1700 },
    ],
    countInStock: 45,
    rating: 4.6,
    numReviews: 22,
    featured: false,
  },
];

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  let added = 0, skipped = 0;
  for (const p of opioids) {
    const exists = await Product.findOne({ slug: p.slug });
    if (exists) { console.log(`SKIP (exists): ${p.name}`); skipped++; continue; }
    await Product.create(p);
    console.log(`ADDED: ${p.name}`);
    added++;
  }

  console.log(`\nDone — ${added} added, ${skipped} skipped.`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
