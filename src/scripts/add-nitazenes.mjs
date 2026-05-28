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

const nitazenes = [
  {
    name: 'Isotonitazene',
    slug: 'isotonitazene',
    category: 'nitazenes',
    images: [],
    description: 'High-purity isotonitazene research compound for pharmacological studies and analytical chemistry. 99%+ purity verified by HPLC and NMR. Certificate of analysis provided. For scientific research only.',
    priceVariants: [
      { quantity: 25, price: 500 },
      { quantity: 50, price: 700 },
      { quantity: 100, price: 950 },
      { quantity: 500, price: 1700 },
      { quantity: 1000, price: 2900 },
    ],
    countInStock: 25,
    rating: 4.8,
    numReviews: 17,
    featured: true,
  },
  {
    name: 'Metonitazene',
    slug: 'metonitazene',
    category: 'nitazenes',
    images: [],
    description: 'Research-grade metonitazene for analytical chemistry and receptor binding studies. 99%+ purity. Full CoA documentation included. For laboratory research only.',
    priceVariants: [
      { quantity: 25, price: 480 },
      { quantity: 50, price: 670 },
      { quantity: 100, price: 900 },
      { quantity: 500, price: 1600 },
      { quantity: 1000, price: 2750 },
    ],
    countInStock: 20,
    rating: 4.7,
    numReviews: 11,
    featured: true,
  },
  {
    name: 'Protonitazene',
    slug: 'protonitazene',
    category: 'nitazenes',
    images: [],
    description: 'High-purity protonitazene compound for pharmacological and biochemical research. 99%+ purity by mass spectrometry. Certificate of analysis provided. For scientific research only.',
    priceVariants: [
      { quantity: 25, price: 490 },
      { quantity: 50, price: 680 },
      { quantity: 100, price: 920 },
      { quantity: 500, price: 1650 },
      { quantity: 1000, price: 2800 },
    ],
    countInStock: 18,
    rating: 4.7,
    numReviews: 8,
    featured: false,
  },
  {
    name: 'Butonitazene',
    slug: 'butonitazene',
    category: 'nitazenes',
    images: [],
    description: 'Laboratory-grade butonitazene for analytical and pharmacological research. 99%+ purity verified by HPLC. Certificate of analysis included. For scientific research only.',
    priceVariants: [
      { quantity: 25, price: 470 },
      { quantity: 50, price: 650 },
      { quantity: 100, price: 880 },
      { quantity: 500, price: 1580 },
      { quantity: 1000, price: 2700 },
    ],
    countInStock: 22,
    rating: 4.6,
    numReviews: 6,
    featured: false,
  },
  {
    name: 'Etonitazene',
    slug: 'etonitazene',
    category: 'nitazenes',
    images: [],
    description: 'Research-grade etonitazene compound for pharmacological studies and analytical chemistry. 99%+ purity verified by NMR and HPLC. Certificate of analysis provided. For laboratory use only.',
    priceVariants: [
      { quantity: 25, price: 510 },
      { quantity: 50, price: 720 },
      { quantity: 100, price: 980 },
      { quantity: 500, price: 1750 },
      { quantity: 1000, price: 3000 },
    ],
    countInStock: 15,
    rating: 4.9,
    numReviews: 13,
    featured: true,
  },
];

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  let added = 0, skipped = 0;
  for (const p of nitazenes) {
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
