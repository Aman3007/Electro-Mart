const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title must not exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [2000, 'Description must not exceed 2000 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  condition: {
    type: String,
    required: [true, 'Condition is required'],
    enum: ['new', 'like-new', 'good', 'fair', 'poor'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['smartphones', 'laptops', 'tablets', 'cameras', 'audio', 'gaming', 'wearables', 'accessories', 'other'],
  },
  images: [{
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'pending'],
    default: 'available',
  },
  views: {
    type: Number,
    default: 0,
  },
  location: {
    type: String,
    default: '',
  },
}, { timestamps: true });

// Text index for search
listingSchema.index({ title: 'text', description: 'text', category: 'text' });
// Performance indexes
listingSchema.index({ seller: 1 });
listingSchema.index({ status: 1 });
listingSchema.index({ category: 1 });
listingSchema.index({ price: 1 });
listingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Listing', listingSchema);