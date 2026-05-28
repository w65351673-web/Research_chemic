import dbConnect from '../utils/db';
import Product from '@/models/Product';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

/**
 * Seed the database with initial data
 * Run this script with: node -r esm src/lib/seed/seed-db.js
 */
async function seedDatabase() {
  try {
    // Connect to the database
    await dbConnect();
    console.log('Connected to the database');

    // Clear existing data
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Create admin user if it doesn't exist
    const adminExists = await User.findOne({ email: 'admin@buyresearchchems.com' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await User.create({
        name: 'Admin User',
        email: 'admin@buyresearchchems.com',
        password: hashedPassword,
        isAdmin: true,
      });
      console.log('Admin user created');
    }

    // Sample products data
    const productsData = [
      // Cannabinoids
      {
        name: 'CBD Isolate',
        slug: 'cbd-isolate',
        category: 'Cannabinoids',
        images: ['/images/products/cbd-isolate.jpg'],
        description: 'Pure CBD isolate powder, 99.9% purity. Perfect for research and development purposes.\n\nThis high-quality CBD isolate is extracted using CO2 methods and thoroughly tested for purity and potency.',
        priceVariants: [
          { quantity: 1, price: 29.99 },
          { quantity: 5, price: 129.99 },
          { quantity: 10, price: 249.99 },
        ],
        countInStock: 50,
        rating: 4.8,
        numReviews: 24,
        featured: true,
      },
      {
        name: 'Delta-8 THC',
        slug: 'delta-8-thc',
        category: 'Cannabinoids',
        images: ['/images/products/delta-8.jpg'],
        description: 'Delta-8 THC research compound, 95% purity. For laboratory research only.\n\nThis compound is ideal for comparative studies and analytical testing.',
        priceVariants: [
          { quantity: 1, price: 39.99 },
          { quantity: 5, price: 179.99 },
          { quantity: 10, price: 329.99 },
        ],
        countInStock: 35,
        rating: 4.5,
        numReviews: 18,
        featured: false,
      },
      {
        name: 'CBG Crystals',
        slug: 'cbg-crystals',
        category: 'Cannabinoids',
        images: ['/images/products/cbg-crystals.jpg'],
        description: 'Cannabigerol (CBG) crystalline powder, 98%+ purity.\n\nCBG is often called the "mother cannabinoid" as it is the precursor to many other cannabinoids.',
        priceVariants: [
          { quantity: 1, price: 49.99 },
          { quantity: 5, price: 219.99 },
          { quantity: 10, price: 399.99 },
        ],
        countInStock: 20,
        rating: 4.7,
        numReviews: 12,
        featured: true,
      },
      
      // Research Chemicals
      {
        name: '3-MMC',
        slug: '3-mmc',
        category: 'Research Chemicals',
        images: ['/images/products/3-mmc.jpg'],
        description: '3-MMC (3-Methylmethcathinone) research compound, 99% purity. For analytical chemistry only.\n\nThis compound is provided for laboratory research and analytical purposes.',
        priceVariants: [
          { quantity: 1, price: 59.99 },
          { quantity: 5, price: 269.99 },
          { quantity: 10, price: 499.99 },
        ],
        countInStock: 15,
        rating: 4.3,
        numReviews: 9,
        featured: false,
      },
      {
        name: '4-AcO-DMT',
        slug: '4-aco-dmt',
        category: 'Research Chemicals',
        images: ['/images/products/4-aco-dmt.jpg'],
        description: '4-AcO-DMT (O-Acetylpsilocin) research compound, 99.5% purity. For laboratory use only.\n\nThis tryptamine compound is ideal for comparative analysis and scientific research.',
        priceVariants: [
          { quantity: 1, price: 79.99 },
          { quantity: 5, price: 349.99 },
          { quantity: 10, price: 649.99 },
        ],
        countInStock: 10,
        rating: 4.9,
        numReviews: 15,
        featured: true,
      },
      {
        name: '2-FDCK',
        slug: '2-fdck',
        category: 'Research Chemicals',
        images: ['/images/products/2-fdck.jpg'],
        description: '2-FDCK (2-Fluorodeschloroketamine) research compound, 99% purity. For analytical purposes only.\n\nThis arylcyclohexylamine compound is provided for laboratory research.',
        priceVariants: [
          { quantity: 1, price: 69.99 },
          { quantity: 5, price: 299.99 },
          { quantity: 10, price: 549.99 },
        ],
        countInStock: 25,
        rating: 4.6,
        numReviews: 11,
        featured: false,
      },
      
      // Opioids
      {
        name: 'Opioid Research Compound A',
        slug: 'opioid-research-compound-a',
        category: 'opioids',
        images: [],
        description: 'High-purity opioid research compound for laboratory analysis. 99%+ purity. For scientific research only.',
        priceVariants: [
          { quantity: 1, price: 49.99 },
          { quantity: 5, price: 219.99 },
          { quantity: 10, price: 399.99 },
        ],
        countInStock: 25,
        rating: 4.7,
        numReviews: 0,
        featured: true,
      },

      // Nitazenes
      {
        name: 'Nitazene Research Compound A',
        slug: 'nitazene-research-compound-a',
        category: 'nitazenes',
        images: [],
        description: 'High-purity nitazene research compound for analytical chemistry and scientific research. 99%+ purity.',
        priceVariants: [
          { quantity: 1, price: 69.99 },
          { quantity: 5, price: 299.99 },
          { quantity: 10, price: 549.99 },
        ],
        countInStock: 20,
        rating: 4.6,
        numReviews: 0,
        featured: true,
      },

      // Etomidate
      {
        name: 'Etomidate Research Grade',
        slug: 'etomidate-research-grade',
        category: 'etomidate',
        images: [],
        description: 'Laboratory-grade etomidate compound for research and analytical purposes. 99%+ purity.',
        priceVariants: [
          { quantity: 1, price: 74.99 },
          { quantity: 5, price: 329.99 },
          { quantity: 10, price: 599.99 },
        ],
        countInStock: 15,
        rating: 4.8,
        numReviews: 0,
        featured: true,
      },
    ];

    // Insert products
    await Product.insertMany(productsData);
    console.log(`${productsData.length} products inserted`);

    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeder
seedDatabase();
