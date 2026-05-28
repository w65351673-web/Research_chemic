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

const products = [
  {
    name: 'Etodesnitazene',
    slug: 'etodesnitazene',
    category: 'nitazenes',
    images: [],
    description: 'High-purity etodesnitazene research compound for pharmacological and analytical studies. 99%+ purity verified by HPLC and NMR. Certificate of analysis provided. For scientific research only.',
    priceVariants: [
      { quantity: 25, price: 490 },
      { quantity: 50, price: 680 },
      { quantity: 100, price: 920 },
      { quantity: 500, price: 1650 },
      { quantity: 1000, price: 2800 },
    ],
    countInStock: 20,
    rating: 4.7,
    numReviews: 9,
    featured: false,
  },
  {
    name: 'N-Pyrrolidino Etonitazene',
    slug: 'n-pyrrolidino-etonitazene',
    category: 'nitazenes',
    images: [],
    description: 'Research-grade N-pyrrolidino etonitazene for receptor binding studies and analytical chemistry. 99%+ purity verified by mass spectrometry. Certificate of analysis included. For laboratory research only.',
    priceVariants: [
      { quantity: 25, price: 520 },
      { quantity: 50, price: 730 },
      { quantity: 100, price: 990 },
      { quantity: 500, price: 1780 },
      { quantity: 1000, price: 3050 },
    ],
    countInStock: 15,
    rating: 4.8,
    numReviews: 7,
    featured: true,
  },
  {
    name: 'Bromazolam',
    slug: 'bromazolam',
    category: 'nitazenes',
    images: [],
    description: 'High-purity bromazolam research compound for pharmacological studies. 99%+ purity verified by HPLC. Certificate of analysis provided. For scientific research only.',
    priceVariants: [
      { quantity: 25, price: 460 },
      { quantity: 50, price: 640 },
      { quantity: 100, price: 860 },
      { quantity: 500, price: 1550 },
      { quantity: 1000, price: 2650 },
    ],
    countInStock: 25,
    rating: 4.6,
    numReviews: 11,
    featured: false,
  },
];

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  let added = 0, skipped = 0;
  for (const p of products) {
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
