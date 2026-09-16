'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaStar, FaArrowLeft, FaShoppingCart, FaCheckCircle } from 'react-icons/fa';
import { useCart } from '@/components/cart/CartProvider';
import ProtectedImage from '@/components/common/ProtectedImage';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const pricingTiers = [
    { quantity: 25, price: 250 },
    { quantity: 50, price: 400 },
    { quantity: 100, price: 650 },
    { quantity: 500, price: 1200 },
    { quantity: 1000, price: 2100 },
  ];
  const [selectedGrams, setSelectedGrams] = useState(25);
  const [selectedTier, setSelectedTier] = useState(pricingTiers[0]);

  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();


  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // Try to determine if the slug is actually a MongoDB ID
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(slug);
        
        // Choose the appropriate API endpoint based on the slug format
        const endpoint = isMongoId ? `/api/products/id/${slug}` : `/api/products/${slug}`;
        
        const { data } = await axios.get(endpoint);
        setProduct(data);
        
        // priceVariants not used on detail page â€” fixed tiers are used instead
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.response?.data?.message || 'Failed to load product');
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      const gramsVariant = {
        grams: selectedTier.quantity,
        price: selectedTier.price,
      };
      addToCart({ ...product }, quantity, gramsVariant);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white pt-24">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Product Not Found</h1>
          <p className="text-gray-900 mb-6 text-sm">{error || 'The product you are looking for does not exist.'}</p>
          <Link href="/products" className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 text-sm">
            <FaArrowLeft className="text-xs" /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-6xl py-8">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-900">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-gray-900">Products</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-gray-900">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product Images */}
          <div>
            <div className="relative h-80 md:h-[420px] w-full rounded-2xl overflow-hidden mb-3 bg-gray-50 border border-gray-200">
              {product.images && product.images.length > 0 ? (
                <ProtectedImage
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-900">
                  No image
                </div>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-16 w-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      selectedImage === index ? 'border-sky-500' : 'border-gray-200 hover:border-sky-300'
                    }`}
                  >
                    <ProtectedImage src={image} alt={`${product.name} ${index + 1}`} fill sizes="64px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-sky-50 border border-sky-200 text-sky-600 text-xs px-3 py-1 rounded-full font-bold">
                {product.category}
              </span>
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                product.countInStock > 0
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-600'
                  : 'bg-red-50 border border-red-200 text-red-600'
              }`}>
                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">{product.name}</h1>
              {product.category?.toLowerCase() === 'opioids' && (
                <span className="text-xs font-bold bg-cyan-700/60 text-cyan-300 px-2.5 py-1 rounded-full">Powder</span>
              )}
            </div>

            {/* Stars */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-700'}`} />
                ))}
              </div>
            </div>

            {/* Gram selector â€” fixed pricing tiers */}
            <div className="mb-5">
              <p className="text-sm font-medium text-gray-900 mb-2">Select quantity</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {pricingTiers.map(tier => (
                  <button
                    key={tier.quantity}
                    onClick={() => { setSelectedTier(tier); setSelectedGrams(tier.quantity); }}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                      selectedGrams === tier.quantity
                        ? 'bg-sky-500 border-sky-500 text-white shadow-md shadow-sky-500/20'
                        : 'bg-white border-gray-200 text-gray-900 hover:border-sky-300'
                    }`}
                  >
                    {tier.quantity}g
                  </button>
                ))}
              </div>
              <div className="text-2xl font-extrabold text-gray-900">
                &euro;{Number(selectedTier.price).toFixed(2)}
                <span className="ml-2 text-sm text-gray-900 font-normal">for {selectedGrams}g</span>
              </div>
            </div>

            {/* Qty + Add to cart */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-11 flex items-center justify-center text-gray-900 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                >âˆ’</button>
                <input
                  type="number" min="1" value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 bg-transparent text-gray-900 text-center text-sm border-0 focus:outline-none h-11"
                />
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-10 h-11 flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors"
                >+</button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.countInStock <= 0}
                className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
                  product.countInStock > 0
                    ? 'bg-sky-500 hover:bg-sky-600 text-white hover:-translate-y-0.5 shadow-lg shadow-sky-500/20'
                    : 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <FaShoppingCart className="text-sm" />
                {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>

          </div>
        </div>

        {/* Description */}
        <div className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Description</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <div className="text-gray-900 text-base leading-loose space-y-4">
              {product.description.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewForm({ slug, onReviewAdded }) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !rating || !comment) {
      toast.error('Please fill in all fields and select a rating.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${slug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit review');
      toast.success('Review submitted!');
      setSuccess(true);
      onReviewAdded({ name, rating, comment, createdAt: new Date().toISOString() });
      setName('');
      setRating(0);
      setComment('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-400 placeholder-gray-400"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <FaStar className={`w-6 h-6 ${star <= (hoverRating || rating) ? 'text-amber-400' : 'text-gray-200'} transition-colors`} />
              </button>
            ))}
            {rating > 0 && <span className="text-sm text-gray-900 ml-2 self-center font-medium">{rating}/5</span>}
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">Your Review</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Share your experience with this product..."
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-400 placeholder-gray-400 resize-none"
          />
        </div>
        {success ? (
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
            <FaCheckCircle /> Review submitted successfully!
          </div>
        ) : (
          <button
            type="submit"
            disabled={submitting}
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        )}
      </form>
    </div>
  );
}
