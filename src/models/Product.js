import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    required: true,
    // Allow only specific categories
    validate: {
      validator: function(v) {
        return ['cannabinoids', 'opioids', 'nitazenes', 'etomidate', 'research chemicals'].includes(v.toLowerCase());
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
  reviews: [reviewSchema],
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
