'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaUpload, FaTimes, FaSave, FaArrowLeft } from 'react-icons/fa';

export default function ProductForm({ product = null }) {
  const router = useRouter();
  const isEditing = !!product;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    countInStock: '',
    featured: false,
    images: []
  });
  
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Categories available in the store
  const categories = ['cannabinoids', 'opioids', 'nitazenes', 'etomidate', 'research chemicals'];
  
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        category: product.category || '',
        countInStock: product.countInStock?.toString() || '',
        featured: product.featured || false,
        images: product.images || []
      });
      setImagePreviewUrls(product.images || []);
    }
  }, [product]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleImageChange = (e) => {
    e.preventDefault();
    
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Preview images
    const newImageFiles = [...imageFiles, ...files];
    setImageFiles(newImageFiles);
    
    const newImagePreviewUrls = [...imagePreviewUrls];
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImagePreviewUrls.push(reader.result);
        setImagePreviewUrls([...newImagePreviewUrls]);
      };
      reader.readAsDataURL(file);
    });
  };
  
  const removeImage = (index) => {
    // If editing and removing an existing image
    if (isEditing && index < formData.images.length) {
      const newImages = [...formData.images];
      newImages.splice(index, 1);
      setFormData({ ...formData, images: newImages });
      setImagePreviewUrls(imagePreviewUrls.filter((_, i) => i !== index));
      return;
    }
    
    // If removing a newly added image
    const adjustedIndex = isEditing ? index - formData.images.length : index;
    const newImageFiles = [...imageFiles];
    newImageFiles.splice(adjustedIndex, 1);
    setImageFiles(newImageFiles);
    
    const newImagePreviewUrls = [...imagePreviewUrls];
    newImagePreviewUrls.splice(index, 1);
    setImagePreviewUrls(newImagePreviewUrls);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Create FormData object for file uploads
      const submitData = new FormData();
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        if (key !== 'images') {
          submitData.append(key, formData[key]);
        }
      });
      
      // Add existing images if editing
      if (isEditing) {
        submitData.append('existingImages', JSON.stringify(formData.images));
      }
      
      // Add new image files
      imageFiles.forEach(file => {
        submitData.append('images', file);
      });
      
      // Send request
      const url = isEditing 
        ? `/api/admin/products/${product._id}` 
        : '/api/admin/products';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        body: submitData
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to save product');
      }
      
      const savedProduct = await res.json();
      
      setSuccess(isEditing ? 'Product updated successfully!' : 'Product created successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);
      
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.message || 'An error occurred while saving the product');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push('/admin/products')}
          className="mr-4 text-gray-400 hover:text-white"
        >
          <FaArrowLeft />
        </button>
        <h2 className="text-2xl font-bold">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h2>
      </div>
      
      {error && (
        <div className="bg-sky-500/20 border border-sky-500 text-sky-400 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-6">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-400 mb-2" htmlFor="name">
              Product Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2" htmlFor="category">
              Category*
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2" htmlFor="price">
              Price (€)*
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2" htmlFor="countInStock">
              Stock Quantity*
            </label>
            <input
              type="number"
              id="countInStock"
              name="countInStock"
              value={formData.countInStock}
              onChange={handleChange}
              min="0"
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-gray-400 mb-2" htmlFor="description">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            ></textarea>
          </div>
          
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-sky-500 focus:ring-sky-500 border-gray-500 rounded"
              />
              <label htmlFor="featured" className="text-gray-300">
                Feature this product on the homepage
              </label>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-gray-400 mb-2">
              Product Images
            </label>
            
            <div className="mb-4">
              <label className="flex flex-col items-center px-4 py-6 bg-gray-700 text-white rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
                <FaUpload className="mb-2 text-xl" />
                <span className="text-sm">Upload Images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            
            {imagePreviewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {imagePreviewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="relative h-32 w-full rounded-lg overflow-hidden">
                      <Image 
                        src={url} 
                        alt={`Product image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-sky-500 text-white p-1 rounded-full hover:bg-sky-500 transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 mr-2"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-sky-500 hover:bg-sky-500 text-white rounded-xl flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
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
