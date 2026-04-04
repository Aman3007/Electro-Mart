const express = require('express');
const { body } = require('express-validator');
const {
  getListings, getListing, createListing, updateListing, deleteListing, getMyListings
} = require('../controllers/listing');
const { protect, optionalAuth } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

const router = express.Router();

const listingValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ min: 10, max: 2000 }).withMessage('Description must be 10-2000 characters'),
  body('price').isNumeric().withMessage('Price must be a number').custom(v => v >= 0).withMessage('Price cannot be negative'),
  body('condition').isIn(['new', 'like-new', 'good', 'fair', 'poor']).withMessage('Invalid condition'),
  body('category').isIn(['smartphones', 'laptops', 'tablets', 'cameras', 'audio', 'gaming', 'wearables', 'accessories', 'other']).withMessage('Invalid category'),
];

router.get('/', optionalAuth, getListings);
router.get('/my', protect, getMyListings);
router.get('/:id', optionalAuth, getListing);

// validation only for creating listing
router.post('/', protect, upload.array('images', 5), listingValidation, createListing);

// update should allow partial updates
router.put('/:id', protect, upload.array('images', 5), updateListing);

router.delete('/:id', protect, deleteListing);

module.exports = router;