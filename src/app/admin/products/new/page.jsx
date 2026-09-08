'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaSave, FaUpload, FaTrash } from 'react-icons/fa';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUploading, setImageUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'cannabinoids',
    description: '',
    price: '',
    countInStock: '',
    rating: 5,
    numReviews: 0,
    featured: false
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...newFiles]);
      
      // Create preview URLs
      const newImageUrls = newFiles.map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImageUrls]);
    }
  };
  
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const uploadImages = async () => {
    if (imageFiles.length === 0) return [];
    
    setImageUploading(true);
    const uploadedUrls = [];
    
    try {
      for (const file of imageFiles) {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error('Image upload failed');
        }
        
        const data = await response.json();
        uploadedUrls.push(data.url);
      }
      
      return uploadedUrls;
    } catch (error) {
      console.error('Error uploading images:', error);
      setError('Failed to upload images. Please try again.');
      return [];
    } finally {
      setImageUploading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validate form
      if (!formData.name || !formData.slug || !formData.description || !formData.price) {
        throw new Error('Please fill in all required fields');
      }
      
      // Upload images first (if any)
      let imageUrls = [];
      if (imageFiles.length > 0) {
        imageUrls = await uploadImages();
        // If image upload failed, don't proceed
        if (imageFiles.length > 0 && imageUrls.length === 0) {
          throw new Error('Image upload failed. Please try again or save without images.');
        }
      }
      
      // Create product
      const productData = {
        ...formData,
        // Map 'research chemicals' to 'other' for API compatibility
        category: formData.category === 'research chemicals' ? 'other' : formData.category,
        price: parseFloat(formData.price),
        countInStock: parseInt(formData.countInStock, 10),
        rating: parseFloat(formData.rating),
        numReviews: parseInt(formData.numReviews, 10),
        images: imageUrls // Can be empty array
      };
      
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create product');
      }
      
      setSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/products');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Add New Product</h1>
        <Link 
          href="/admin/products" 
          className="flex items-center text-gray-400 hover:text-white"
        >
          <FaArrowLeft className="mr-2" /> Back to Products
        </Link>
      </div>
      
      {success && (
        <div className="bg-green-500/20 border border-green-500 text-green-400 p-4 rounded-lg">
          Product created successfully! Redirecting...
        </div>
      )}
      
      {error && (
        <div className="bg-sky-500/20 border border-sky-500 text-sky-400 p-4 rounded-lg">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-300 mb-2">
                Product Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white p-3 rounded-lg"
                placeholder="Enter product name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="slug" className="block text-gray-300 mb-2">
                Slug * (auto-generated)
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                value={formData.slug}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white p-3 rounded-lg"
                placeholder="product-slug"
                required
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-gray-300 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white p-3 rounded-lg"
                required
              >
                <option value="cannabinoids">Cannabinoids</option>
                <option value="opioids">Opioids</option>
                <option value="nitazenes">Nitazenes</option>
                <option value="research chemicals">Research Chemicals</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="price" className="block text-gray-300 mb-2">
                Price ($) *
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white p-3 rounded-lg"
                placeholder="0.00"
                required
              />
            </div>
            
            <div>
              <label htmlFor="countInStock" className="block text-gray-300 mb-2">
                Stock Quantity *
              </label>
              <input
                id="countInStock"
                name="countInStock"
                type="number"
                min="0"
                value={formData.countInStock}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white p-3 rounded-lg"
                placeholder="0"
                required
              />
            </div>
            
            <div>
              <label htmlFor="rating" className="block text-gray-300 mb-2">
                Product Rating (1-5) *
              </label>
              <div className="flex items-center">
                <input
                  id="rating"
                  name="rating"
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full bg-gray-700 text-white rounded-lg accent-sky-500"
                  required
                />
                <span className="ml-3 text-white font-medium">{formData.rating}</span>
              </div>
              <div className="flex mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg 
                    key={star} 
                    className={`w-5 h-5 ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-500'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="numReviews" className="block text-gray-300 mb-2">
                Number of Reviews
              </label>
              <input
                id="numReviews"
                name="numReviews"
                type="number"
                min="0"
                value={formData.numReviews}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white p-3 rounded-lg"
                placeholder="0"
              />
              <p className="text-gray-500 text-sm mt-1">Set the number of reviews manually</p>
            </div>

            <div className="flex items-center">
              <input
                id="featured"
                name="featured"
                type="checkbox"
                checked={formData.featured}
                onChange={handleChange}
                className="h-5 w-5 text-sky-500 rounded"
              />
              <label htmlFor="featured" className="ml-2 text-gray-300">
                Featured Product
              </label>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <label htmlFor="description" className="block text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white p-3 rounded-lg h-32"
                placeholder="Enter product description"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">
                Product Images
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                <input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="images"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <FaUpload className="text-gray-400 text-2xl mb-2" />
                  <span className="text-gray-400">Click to upload images</span>
                </label>
              </div>
            </div>
            
            {/* Image Previews */}
            {images.length > 0 && (
              <div>
                <h3 className="text-gray-300 mb-2">Image Previews</h3>
                <div className="grid grid-cols-3 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-sky-500 text-white p-1 rounded-full"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg mr-4"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-sky-500 hover:bg-sky-500 text-white px-6 py-2 rounded-xl flex items-center"
            disabled={loading || imageUploading}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <FaSave className="mr-2" />
                Save Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
