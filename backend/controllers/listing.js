const { validationResult } = require('express-validator');
const Listing = require('../models/Listing');
const { cloudinary } = require('../config/cloudinary');

const getListings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      condition,
      minPrice,
      maxPrice,
      sort = 'createdAt_desc',
      status = 'available',
    } = req.query;

    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (condition) query.condition = condition;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Sort options
    const sortOptions = {
      'createdAt_desc': { createdAt: -1 },
      'createdAt_asc': { createdAt: 1 },
      'price_asc': { price: 1 },
      'price_desc': { price: -1 },
    };
    const sortQuery = sortOptions[sort] || { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [listings, total] = await Promise.all([
      Listing.find(query)
        .populate('seller', 'name avatar location isOnline')
        .sort(sortQuery)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Listing.countDocuments(query),
    ]);

    res.json({
      listings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('seller', 'name avatar bio location isOnline lastSeen createdAt');

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found.' });
    }

    // Increment views
    listing.views += 1;
    await listing.save({ validateBeforeSave: false });

    res.json({ listing });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createListing = async (req, res) => {
  try {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Clean up uploaded images if validation fails
      if (req.files) {
        for (const file of req.files) {
          await cloudinary.uploader.destroy(file.filename);
        }
      }
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { title, description, price, condition, category, location } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'At least one image is required.' });
    }

    const images = req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
    }));

    const listing = await Listing.create({
      title,
      description,
      price: Number(price),
      condition,
      category,
      location: location || '',
      images,
      seller: req.user._id,
    });

    await listing.populate('seller', 'name avatar');
    res.status(201).json({ message: 'Listing created successfully', listing });
  } catch (err) {
    console.error('createListing error:', err);
    res.status(500).json({ error: err.message });
  }
};

const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found.' });
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to edit this listing.' });
    }

    const { title, description, price, condition, category, location, status } = req.body;

    // Update only provided fields
    if (title !== undefined) listing.title = title;
    if (description !== undefined) listing.description = description;
    if (price !== undefined) listing.price = Number(price);
    if (condition !== undefined) listing.condition = condition;
    if (category !== undefined) listing.category = category;
    if (location !== undefined) listing.location = location;
    if (status !== undefined) listing.status = status;

    // Handle new images
    if (req.files && req.files.length > 0) {

      for (const img of listing.images) {
        await cloudinary.uploader.destroy(img.publicId);
      }

      listing.images = req.files.map(file => ({
        url: file.path,
        publicId: file.filename,
      }));
    }

    await listing.save();

    await listing.populate('seller', 'name avatar');

    res.json({
      message: 'Listing updated successfully',
      listing
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found.' });
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this listing.' });
    }

    // Delete images from cloudinary
    for (const img of listing.images) {
      await cloudinary.uploader.destroy(img.publicId);
    }

    await listing.deleteOne();
    res.json({ message: 'Listing deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMyListings = async (req, res) => {
  try {
    const { page = 1, limit = 12, status } = req.query;
    const query = { seller: req.user._id };
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [listings, total] = await Promise.all([
      Listing.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Listing.countDocuments(query),
    ]);

    res.json({
      listings,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getListings, getListing, createListing, updateListing, deleteListing, getMyListings };