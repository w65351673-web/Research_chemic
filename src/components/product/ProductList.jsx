'use client';

import { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { FaFilter, FaTimes, FaSearch } from 'react-icons/fa';

export default function ProductList({ initialProducts, selectedCategory }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const productListRef = useRef(null);
  // Make sure products are visible by default
  const isInView = useInView(productListRef, { once: true, amount: 0.1, initialInView: true });
  
  // Initialize products from props
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
      setFilteredProducts(initialProducts);
    }
  }, [initialProducts]);
  
  // Check for touch device on client-side only
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window);
  }, []);
  
  const [filters, setFilters] = useState({
    category: selectedCategory || '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    sortBy: 'newest',
  });
  
  // Update filters when selectedCategory changes
  useEffect(() => {
    if (selectedCategory !== filters.category) {
      setFilters(prev => ({
        ...prev,
        category: selectedCategory || ''
      }));
    }
  }, [selectedCategory]);
  

  // Apply filters whenever they change
  useEffect(() => {
    if (!products || products.length === 0) return;
    
    let result = [...products];
    console.log('Starting filtering with', result.length, 'products');
    console.log('Current filters:', filters);
    
    // Filter by category (case-insensitive)
    if (filters.category && filters.category !== '') {
      console.log('Filtering by category:', filters.category);
      result = result.filter(product => {
        if (!product.category) {
          console.log(`Product ${product.name} has no category, excluding`);
          return false;
        }
        
        const productCategory = product.category.toLowerCase();
        const filterCategory = filters.category.toLowerCase();
        
        // Special handling for research chemicals
        if (filterCategory === 'research chemicals') {
          const matches = productCategory === 'research chemicals';
          console.log(`Research chemicals filter: ${product.name} (${productCategory}) matches? ${matches}`);
          return matches;
        }
        
        // Direct match for all other categories
        const matches = productCategory === filterCategory;
        console.log(`Category filter: ${product.name} (${productCategory}) matches ${filterCategory}? ${matches}`);
        return matches;
      });
    } else {
      console.log('No category filter applied, showing all products');
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(product => 
        (product.name && product.name.toLowerCase().includes(query)) ||
        (product.description && product.description.toLowerCase().includes(query)) ||
        (product.category && product.category.toLowerCase().includes(query))
      );
    }

    // Filter by price range
    if (filters.minPrice !== '') {
      result = result.filter(product => {
        // Use product.price if priceVariants doesn't exist
        if (!product.priceVariants) {
          return product.price >= Number(filters.minPrice);
        }
        
        const lowestPrice = product.priceVariants.reduce(
          (min, variant) => (variant.price < min ? variant.price : min),
          product.priceVariants[0]?.price || 0
        );
        return lowestPrice >= Number(filters.minPrice);
      });
    }

    if (filters.maxPrice !== '') {
      result = result.filter(product => {
        // Use product.price if priceVariants doesn't exist
        if (!product.priceVariants) {
          return product.price <= Number(filters.maxPrice);
        }
        
        const lowestPrice = product.priceVariants.reduce(
          (min, variant) => (variant.price < min ? variant.price : min),
          product.priceVariants[0]?.price || 0
        );
        return lowestPrice <= Number(filters.maxPrice);
      });
    }

    // Filter by stock
    if (filters.inStock) {
      result = result.filter(product => product.countInStock > 0);
    }

    // Sort products
    switch (filters.sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'price-low-high':
        result.sort((a, b) => {
          // Use product.price if priceVariants doesn't exist
          const aPrice = a.priceVariants ? a.priceVariants.reduce(
            (min, variant) => (variant.price < min ? variant.price : min),
            a.priceVariants[0]?.price || 0
          ) : (a.price || 0);
          
          const bPrice = b.priceVariants ? b.priceVariants.reduce(
            (min, variant) => (variant.price < min ? variant.price : min),
            b.priceVariants[0]?.price || 0
          ) : (b.price || 0);
          
          return aPrice - bPrice;
        });
        break;
      case 'price-high-low':
        result.sort((a, b) => {
          // Use product.price if priceVariants doesn't exist
          const aPrice = a.priceVariants ? a.priceVariants.reduce(
            (min, variant) => (variant.price < min ? variant.price : min),
            a.priceVariants[0]?.price || 0
          ) : (a.price || 0);
          
          const bPrice = b.priceVariants ? b.priceVariants.reduce(
            (min, variant) => (variant.price < min ? variant.price : min),
            b.priceVariants[0]?.price || 0
          ) : (b.price || 0);
          
          return bPrice - aPrice;
        });
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [filters, products, searchQuery]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Log the filter change for debugging
    console.log(`Filter changed: ${name} = ${value}`);
    
    // Special handling for category changes
    if (name === 'category') {
      // When selecting All Categories, reset to empty string
      const categoryValue = value === '' ? '' : value;
      
      // Update URL with the new category if possible
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        if (categoryValue) {
          url.searchParams.set('category', categoryValue);
        } else {
          url.searchParams.delete('category');
        }
        
        // Reload the page to get fresh products from the server
        // This ensures we get all products when All Categories is selected
        window.location.href = url.toString();
        return; // Stop here since we're reloading the page
      }
      
      setFilters({
        ...filters,
        category: categoryValue
      });
    } else {
      // Handle other filter changes normally
      setFilters({
        ...filters,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const clearFilters = () => {
    // Reset filters to default values
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      sortBy: 'newest',
    });
    
    // Reset URL parameters and reload page to get all products
    if (typeof window !== 'undefined') {
      // Create a new URL without any search parameters
      const url = new URL(window.location.pathname, window.location.origin);
      window.location.href = url.toString();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: (i) => ({
      y: 50,
      opacity: 0,
      scale: 0.9,
      rotateX: -10
    }),
    visible: (i) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        delay: i * 0.05
      }
    })
  };

  return (
    <div ref={productListRef} className="relative">
      {/* Search + controls bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-900 text-xs" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-400 placeholder-gray-400 transition-all"
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-900 hover:text-gray-900"
              onClick={() => setSearchQuery('')}
            >
              <FaTimes className="text-xs" />
            </button>
          )}
        </div>

        <select
          name="sortBy"
          value={filters.sortBy}
          onChange={handleFilterChange}
          className="bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
        >
          <option value="newest">Newest</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="md:hidden flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:border-sky-300 transition-all"
        >
          {isFilterOpen ? <><FaTimes className="text-xs" /> Close</> : <><FaFilter className="text-xs" /> Filters</>}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar */}
        <AnimatePresence>
          {(isFilterOpen || !isTouchDevice) && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="md:w-56 bg-white border border-gray-200 rounded-2xl p-5 overflow-hidden flex-shrink-0 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Filters</h2>
                <button onClick={clearFilters} className="text-xs text-gray-900 hover:text-sky-500 transition-colors">
                  Clear all
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-900 mb-1.5">Category</label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="">All Categories</option>
                    <option value="cannabinoids">Cannabinoids</option>
                    <option value="opioids">Opioids</option>
                    <option value="nitazenes">Nitazenes</option>
                    <option value="etomidate">Etomidate</option>
                    <option value="research chemicals">Research Chemicals</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-900 mb-1.5">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="minPrice"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      className="w-1/2 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      className="w-1/2 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-900 cursor-pointer">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={filters.inStock}
                    onChange={handleFilterChange}
                    className="rounded text-sky-500 focus:ring-sky-500 bg-gray-50 border-gray-300"
                  />
                  In Stock Only
                </label>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Product grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-900">
              <span className="text-gray-900 font-semibold">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'product' : 'products'}
              {searchQuery && <span className="ml-1">for &ldquo;{searchQuery}&rdquo;</span>}
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id || index}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center">
              <p className="text-gray-900 font-semibold mb-2">No products found</p>
              <p className="text-gray-900 text-sm mb-5">Try adjusting your filters or search term.</p>
              <button
                onClick={clearFilters}
                className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 shadow-lg shadow-sky-500/20"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
