// Use ES module import
import { v2 as cloudinary } from 'cloudinary';

// Check if Cloudinary credentials are available
const hasCloudinaryCredentials = (
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET
);

// Configure Cloudinary if credentials are available
if (hasCloudinaryCredentials) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
} else {
  console.warn('Cloudinary credentials are missing. Image upload and deletion features will not work.');
}

/**
 * Upload a file to Cloudinary
 * @param {File|Object} file - The file to upload (can be Next.js File API or Multer file)
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Cloudinary upload result
 */
export async function uploadToCloudinary(file, options = {}) {
  // Check if Cloudinary is configured
  if (!hasCloudinaryCredentials) {
    console.warn('Cloudinary upload attempted but credentials are missing');
    // Return a mock result with a placeholder image URL
    return {
      secure_url: 'https://via.placeholder.com/500x500.png?text=Image+Placeholder',
      public_id: 'placeholder',
      url: 'https://via.placeholder.com/500x500.png?text=Image+Placeholder'
    };
  }
  
  try {
    // Set default options
    const defaultOptions = {
      folder: 'BuyResearchChems',
      resource_type: 'auto'
    };
    
    let uploadResult;
    
    // Handle different file types (Next.js File API vs Multer)
    if (file.path) {
      // This is a Multer file with a path
      uploadResult = await cloudinary.uploader.upload(
        file.path,
        { ...defaultOptions, ...options }
      );
    } else if (file.arrayBuffer) {
      // This is a Next.js File API file
      // Convert file to base64 string
      const fileBuffer = await file.arrayBuffer();
      const base64String = Buffer.from(fileBuffer).toString('base64');
      const dataURI = `data:${file.type};base64,${base64String}`;
      
      uploadResult = await cloudinary.uploader.upload(
        dataURI,
        { ...defaultOptions, ...options }
      );
    } else if (Buffer.isBuffer(file)) {
      // This is a raw buffer
      const base64String = file.toString('base64');
      const mimeType = options.mimeType || 'image/jpeg'; // Default to JPEG if not specified
      const dataURI = `data:${mimeType};base64,${base64String}`;
      
      uploadResult = await cloudinary.uploader.upload(
        dataURI,
        { ...defaultOptions, ...options }
      );
    } else {
      throw new Error('Unsupported file format for Cloudinary upload');
    }
    
    return uploadResult;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    // Return a placeholder instead of throwing
    return {
      secure_url: 'https://via.placeholder.com/500x500.png?text=Upload+Failed',
      public_id: 'upload_failed',
      url: 'https://via.placeholder.com/500x500.png?text=Upload+Failed',
      error: error.message
    };
  }
}

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - The public ID of the file to delete
 * @returns {Promise<Object>} - Cloudinary deletion result
 */
export async function deleteFromCloudinary(publicId) {
  // Check if Cloudinary is configured
  if (!hasCloudinaryCredentials) {
    console.warn(`Cloudinary deletion attempted for ${publicId} but credentials are missing`);
    // Return a mock successful result
    return { result: 'ok' };
  }
  
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    // Return a partial success rather than throwing
    return { result: 'warning', error: error.message };
  }
}

/**
 * Get a signed URL for a Cloudinary resource
 * @param {string} publicId - The public ID of the resource
 * @param {Object} options - Transformation options
 * @returns {string} - Signed URL
 */
export function getSignedUrl(publicId, options = {}) {
  return cloudinary.url(publicId, {
    secure: true,
    sign_url: true,
    ...options
  });
}
