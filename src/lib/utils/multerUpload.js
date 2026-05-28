import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// Define storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set the destination folder for uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
    
    // Ensure the directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename to prevent collisions
    const uniqueSuffix = crypto.randomBytes(8).toString('hex');
    const extension = path.extname(file.originalname);
    cb(null, `${Date.now()}-${uniqueSuffix}${extension}`);
  }
});

// File filter to only allow certain file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and GIF files are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter: fileFilter
});

// Helper function to handle file uploads in Next.js API routes
export async function handleFileUpload(request) {
  try {
    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return {
        success: false,
        error: 'No file provided',
        status: 400
      };
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Only JPEG, PNG, WEBP, and GIF files are allowed.',
        status: 400
      };
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: 'File size exceeds the 5MB limit.',
        status: 400
      };
    }
    
    // Generate a unique filename
    const uniqueSuffix = crypto.randomBytes(8).toString('hex');
    const extension = path.extname(file.name);
    const filename = `${Date.now()}-${uniqueSuffix}${extension}`;
    
    // Set the destination folder
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
    
    // Ensure the directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Save the file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filepath = path.join(uploadDir, filename);
    
    fs.writeFileSync(filepath, buffer);
    
    // Return the file information
    const fileUrl = `/uploads/products/${filename}`;
    
    return {
      success: true,
      url: fileUrl,
      filename: filename,
      originalName: file.name,
      size: file.size,
      type: file.type
    };
  } catch (error) {
    console.error('Error handling file upload:', error);
    return {
      success: false,
      error: 'Error processing file upload',
      status: 500
    };
  }
}

// Helper function to delete a file
export function deleteFile(filePath) {
  try {
    const fullPath = path.join(process.cwd(), 'public', filePath);
    
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return { success: true };
    } else {
      return { 
        success: false, 
        error: 'File not found' 
      };
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    return { 
      success: false, 
      error: 'Error deleting file' 
    };
  }
}
