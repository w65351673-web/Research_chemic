import { Suspense } from 'react';
import ProductList from '@/components/product/ProductList';
import dbConnect from '@/lib/utils/db';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

// Dynamic Metadata for SEO - handles query parameters
export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const category = params?.category || '';
  
  // Always use /products as canonical to avoid duplicate content from query params
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://buyresearchchems.com';
  
  return {
    metadataBase: new URL(baseUrl),
    title: category 
      ? `${category} | Research Chemicals | BuyResearchChems`
      : 'Research Chemicals | 5cl-adba, jwh-018, adb-butinaca | BuyResearchChems',
    description: category
      ? `Browse premium ${category.toLowerCase()}: 5cl-adba, 5cladba, 5fadb, jwh-018, adb-butinaca and more.`
      : 'Browse premium research chemicals: 5cl-adba, 5cladba, 5fadb, jwh-018, adb-butinaca, ab-pinaca, 5F-EDMB-PINACA, ADB-FUBINACA, 4FADB, AMB-FUBINACA, MDMB-4en-PINACA. High-quality synthetic cannabinoids, opioids and nitazenes for laboratory research.',
    keywords: '5cl-adba, 5cladba, 5fadb, jwh-018, adb-butinaca, ab-pinaca, 5F-EDMB-PINACA, ADB-FUBINACA, 4FADB, AMB-FUBINACA, MDMB-4en-PINACA, buy research chemicals, synthetic cannabinoids, opioids, nitazenes',
    alternates: {
      canonical: '/products', // Always point to /products to avoid duplicate content from query params
    },
    openGraph: {
      title: category 
        ? `${category} | Research Chemicals | BuyResearchChems`
        : 'Research Chemicals | 5cl-adba, jwh-018, adb-butinaca | BuyResearchChems',
      description: category
        ? `Browse premium ${category.toLowerCase()}: 5cl-adba, 5cladba, 5fadb, jwh-018, adb-butinaca and more.`
        : 'Browse premium research chemicals: 5cl-adba, 5cladba, 5fadb, jwh-018, adb-butinaca and more.',
      url: '/products',
      type: 'website',
    },
  };
}

// Helper function to convert MongoDB documents to plain objects
function convertToPlainObject(doc) {
  // Convert _id to string
  const plainObject = { ...doc };
  if (plainObject._id) {
    plainObject._id = plainObject._id.toString();
  }
  
  // Handle nested objects and arrays
  Object.keys(plainObject).forEach(key => {
    if (plainObject[key] && typeof plainObject[key] === 'object') {
      if (Array.isArray(plainObject[key])) {
        plainObject[key] = plainObject[key].map(item => {
          if (item && typeof item === 'object' && item._id) {
            return convertToPlainObject(item);
          }
          return item;
        });
      } else if (plainObject[key]._id) {
        plainObject[key] = convertToPlainObject(plainObject[key]);
      }
    }
  });
  
  return plainObject;
}

// This function fetches products on the server
async function getProducts(searchParams) {
  await dbConnect();
  
  // First await the entire searchParams object
  const params = await searchParams;
  
  // Now safely extract values
  const category = params?.category || null;
  const search = params?.search || null;
  const sort = params?.sort || 'createdAt';
  const order = params?.order || 'desc';
  
  // Build query based on parameters
  let query = {};
  
  if (category) {
    console.log('Filtering by category:', category);
    
    // Handle 'research chemicals' category with multiple approaches to ensure it works
    if (category.toLowerCase() === 'research chemicals') {
      // Try multiple approaches to match research chemicals
      query.$or = [
        // Exact match (case-sensitive)
        { category: 'research chemicals' },
        // Exact match (case-insensitive regex)
        { category: { $regex: /^research chemicals$/i } },
        // Partial match (case-insensitive)
        { category: { $regex: /research chemicals/i } }
      ];
      console.log('Using enhanced research chemicals filter with multiple matching strategies');
    } else {
      // Make category filtering case-insensitive for other categories
      query.category = { $regex: new RegExp('^' + category + '$', 'i') };
    }
  }
  
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }
  
  // Execute query with sorting
  const sortField = sort;
  const sortOrder = order === 'asc' ? 1 : -1;
  
  const sortOptions = {};
  sortOptions[sortField] = sortOrder;
  
  // Fetch products
  try {
    const products = await Product.find(query)
      .sort(sortOptions)
      .select('-reviews') // Exclude reviews for performance
      .lean();
    
    // Convert MongoDB documents to plain objects
    return products.map(product => convertToPlainObject(product));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Loading component
function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-sky-500" />
      </div>
    </div>
  );
}

const categoryMeta = {
  cannabinoids: {
    label: 'Cannabinoids',
    desc: 'High-purity synthetic cannabinoids including 5cl-adba, 5cladba, 5fadb, jwh-018, adb-butinaca and more. Lab-verified for research use.',
  },
  opioids: {
    label: 'Opioids',
    desc: 'Premium-grade opioid research compounds for laboratory analysis and scientific research.',
  },
  nitazenes: {
    label: 'Nitazenes',
    desc: 'High-purity nitazene compounds for analytical chemistry and scientific research.',
  },
  'research chemicals': {
    label: 'Research Chemicals',
    desc: 'Curated selection of research-grade compounds: ab-pinaca, ADB-FUBINACA, 4FADB, AMB-FUBINACA, MDMB-4en-PINACA and more.',
  },
};

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const products = await getProducts(searchParams);
  const selectedCategory = params?.category || '';

  const catKey = selectedCategory.toLowerCase();
  const catInfo = categoryMeta[catKey] || null;
  const displayLabel = catInfo?.label || selectedCategory || 'All Products';
  const displayDesc = catInfo?.desc ||
    'Browse our full catalog of high-purity research chemicals, cannabinoids, opioids and nitazenes — each compound verified for lab-grade quality.';

  return (
    <div className="min-h-screen bg-white">

      {/* Page hero */}
      <div className="relative border-b border-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50/80 to-white pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 pt-28 pb-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-gray-900 mb-6" aria-label="Breadcrumb">
            <a href="/" className="hover:text-sky-500 transition-colors">Home</a>
            <span className="text-gray-900">/</span>
            <span className="text-gray-900">Products</span>
            {selectedCategory && (
              <>
                <span className="text-gray-900">/</span>
                <span className="text-sky-500 capitalize">{displayLabel}</span>
              </>
            )}
          </nav>

          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">
            {displayLabel}
          </h1>
          <p className="text-gray-900 max-w-2xl text-sm leading-relaxed">
            {displayDesc}
          </p>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mt-7">
            {[
              { href: '/products', label: 'All' },
              { href: '/products?category=cannabinoids', label: 'Cannabinoids' },
              { href: '/products?category=opioids', label: 'Opioids' },
              { href: '/products?category=nitazenes', label: 'Nitazenes' },
              { href: '/products?category=research%20chemicals', label: 'Research Chemicals' },
            ].map(({ href, label }) => {
              const active = label === 'All' ? !selectedCategory : catKey === label.toLowerCase();
              return (
                <a
                  key={label}
                  href={href}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                      : 'bg-white border border-gray-200 text-gray-900 hover:border-sky-300 hover:text-sky-600'
                  }`}
                >
                  {label}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="container mx-auto px-6 py-8">
        <Suspense fallback={<ProductsLoading />}>
          <ProductList initialProducts={products} selectedCategory={selectedCategory} />
        </Suspense>
      </div>
    </div>
  );
}
