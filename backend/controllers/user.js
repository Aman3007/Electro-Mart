const User = require('../models/User');
const Listing = require('../models/Listing');
const { cloudinary } = require('../config/cloudinary');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -refreshToken');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const listings = await Listing.find({ seller: user._id, status: 'available' })
      .sort({ createdAt: -1 })
      .limit(12)
      .lean();

    res.json({ user, listings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, bio, phone, location, role } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (phone !== undefined) updateData.phone = phone;
    if (location !== undefined) updateData.location = location;
    if (role) updateData.role = role;

    if (req.file) {
      // Delete old avatar
      if (req.user.avatar) {
        const publicId = req.user.avatar.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`electromart/${publicId}`).catch(() => {});
      }
      updateData.avatar = req.file.path;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true });
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getProfile, updateProfile, changePassword };