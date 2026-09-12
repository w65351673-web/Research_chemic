'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaShoppingCart, FaEye } from 'react-icons/fa';

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  
  if (!product) {
    console.error('ProductCard received undefined product');
    return null;
  }
  
  const displayPrice = product.price && product.price > 0
    ? product.price
    : product.priceVariants && product.priceVariants.length > 0
      ? product.priceVariants.reduce((min, v) => v.price < min ? v.price : min, product.priceVariants[0]?.price || 0)
      : 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-sky-300 hover:shadow-lg hover:shadow-sky-50 transition-all duration-300 flex flex-col h-full"
    >
      {/* Image */}
      <Link
        href={`/products/${product.slug || product._id}`}
        className="relative h-52 w-full overflow-hidden block bg-gray-50"
        aria-label={`View ${product.name}`}
      >
        {product.images && product.images.length > 0 ? (
          <motion.div
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full"
          >
            <Image
              src={product.images[0]}
              alt={product.name || 'Product image'}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              loading="lazy"
              quality={85}
              onError={(e) => { e.target.onerror = null; e.target.src = '/images/Laboratory-Science.jpg'; }}
            />
          </motion.div>
        ) : (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <span className="text-gray-900 text-sm">No image</span>
          </div>
        )}

        {/* Category badge */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-sky-600 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-lg border border-sky-100 shadow-sm">
          {product.category}
        </span>

        {/* Out of stock */}
        {product.countInStock <= 0 && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-gray-900 text-white text-xs font-bold px-4 py-1.5 rounded-full">Sold Out</span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/products/${product.slug || product._id}`}>
          <h3 className="text-gray-900 font-bold text-sm leading-snug hover:text-sky-500 transition-colors line-clamp-1 mb-1">
            {product.name || 'Unnamed Product'}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`w-3 h-3 ${i < Math.round(product.rating) ? 'text-amber-400' : 'text-gray-200'}`}
              />
            ))}
          </div>
          <span className="text-gray-900 text-xs">({product.numReviews})</span>
        </div>

        {/* Price + button */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <div>
            <span className="text-gray-900 font-black text-lg">&euro;{displayPrice.toFixed(2)}</span>
            {product.priceVariants && product.priceVariants.length > 1 && (
              <span className="text-gray-900 text-xs ml-1">+</span>
            )}
          </div>
          <Link
            href={`/products/${product.slug || product._id}`}
            className="bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
          >
            View <span className="text-[10px]">â†’</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
