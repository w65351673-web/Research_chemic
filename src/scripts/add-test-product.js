// Script to add a test research chemical product and diagnose category issues
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable');
  process.exit(1);
}

// Define Product Schema with validation
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    required: true,
    // Allow only specific categories
    validate: {
      validator: function(v) {
        return ['cannabinoids', 'benzos', 'research chemicals'].includes(v.toLowerCase());
      },
      message: props => `${props.value} is not a valid category`
    }
  },
  images: [{ type: String }],
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  countInStock: { type: Number, required: true, default: 0 },
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

// Diagnose and fix research chemicals category issues
async function diagnoseAndFixResearchChemicals() {
  try {
    // Define the Product model
    const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
    
    // Get all products
    const allProducts = await Product.find({});
    console.log(`Total products in database: ${allProducts.length}`);
    
    // Check categories of all products
    const categories = {};
    allProducts.forEach(product => {
      const category = product.category ? product.category.toLowerCase() : 'undefined';
      categories[category] = (categories[category] || 0) + 1;
    });
    
    console.log('\nCategory distribution:');
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`- ${category}: ${count} products`);
    });
    
    // Check specifically for research chemicals
    const researchChemicals = allProducts.filter(p => 
      p.category && p.category.toLowerCase() === 'research chemicals'
    );
    
    console.log(`\nResearch chemicals products: ${researchChemicals.length}`);
    if (researchChemicals.length > 0) {
      console.log('Existing research chemicals products:');
      researchChemicals.forEach(p => {
        console.log(`- ${p.name} (${p.category}) - ID: ${p._id}`);
      });
    } else {
      console.log('No research chemicals products found. Creating a test product...');
      
      // Create test research chemicals products
      const testProducts = [
        {
          name: 'Research Chemical Alpha',
          slug: 'research-chemical-alpha',
          category: 'research chemicals',
          description: 'A high-quality research chemical for laboratory use only.',
          price: 89.99,
          countInStock: 15,
          featured: true,
          images: ['https://via.placeholder.com/500x500.png?text=Research+Chemical+Alpha']
        },
        {
          name: 'Research Chemical Beta',
          slug: 'research-chemical-beta',
          category: 'research chemicals',
          description: 'Premium research chemical with high purity levels.',
          price: 129.99,
          countInStock: 8,
          featured: false,
          images: ['https://via.placeholder.com/500x500.png?text=Research+Chemical+Beta']
        }
      ];
      
      // Save the test products
      for (const productData of testProducts) {
        const testProduct = new Product(productData);
        await testProduct.save();
        console.log(`Created test product: ${testProduct.name}`);
      }
      
      console.log('Test research chemicals products created successfully!');
    }
    
    // Test the query that's used in the products page
    console.log('\nTesting query for research chemicals:');
    const testQuery = { category: { $regex: /^research chemicals$/i } };
    console.log('Query:', JSON.stringify(testQuery));
    
    const queryResults = await Product.find(testQuery);
    console.log(`Query returned ${queryResults.length} results`);
    if (queryResults.length > 0) {
      console.log('Query results:');
      queryResults.forEach(p => {
        console.log(`- ${p.name} (${p.category})`);
      });
    } else {
      console.log('Query returned no results! This is the issue.');
    }
    
  } catch (error) {
    console.error('Error diagnosing research chemicals:', error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the script
connectToDatabase()
  .then(() => diagnoseAndFixResearchChemicals())
  .catch(console.error);
