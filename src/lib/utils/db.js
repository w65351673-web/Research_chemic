import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// Handle missing MongoDB URI more gracefully for Vercel deployment
if (!MONGODB_URI) {
  console.warn('MONGODB_URI environment variable is not defined. Some features may not work properly.');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  // Return early if no MongoDB URI is defined
  if (!MONGODB_URI) {
    console.warn('Attempted to connect to MongoDB without a URI');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds instead of 30
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      retryWrites: true,
    };

    try {
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log('Connected to MongoDB');
        return mongoose;
      });
    } catch (error) {
      console.error('MongoDB connection error:', error);
      cached.promise = null;
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('Failed to resolve MongoDB connection promise:', error);
    cached.promise = null;
    return null;
  }
}

export default connectToDatabase;
