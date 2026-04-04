import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { createListing } from '../store/slices/listingSlice';
import { categoryLabels, conditionLabels } from '../utils/helpers';

const CreateListing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const validFiles = files.filter(f => f.size <= 5 * 1024 * 1024);
    if (validFiles.length < files.length) {
      toast.error('Some files exceed 5MB limit');
    }

    setImages(prev => [...prev, ...validFiles]);
    const newPreviews = validFiles.map(f => URL.createObjectURL(f));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (idx) => {
    URL.revokeObjectURL(previews[idx]);
    setImages(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const onSubmit = async (data) => {
    if (images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => formData.append(key, val));
    images.forEach(img => formData.append('images', img));

    const result = await dispatch(createListing(formData));
    setLoading(false);

    if (createListing.fulfilled.match(result)) {
      toast.success('Listing created successfully!');
      navigate(`/listing/${result.payload._id}`);
    } else {
      toast.error(result.payload || 'Failed to create listing');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-white mb-2">Create Listing</h1>
        <p className="text-dark-300">List your electronic item and connect with buyers</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Image upload */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold font-display text-white mb-4">📷 Product Photos</h2>
          <p className="text-sm text-dark-400 mb-4">Upload up to 5 photos. First photo will be the cover image.</p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {previews.map((url, idx) => (
              <div key={idx} className="relative group aspect-square">
                <img src={url} alt="" className="w-full h-full object-cover rounded-lg" />
                {idx === 0 && (
                  <span className="absolute top-1 left-1 text-xs bg-primary-500 text-dark-950 px-1.5 py-0.5 rounded font-medium">Cover</span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 w-6 h-6 bg-danger text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ))}

            {previews.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="aspect-square border-2 border-dashed border-dark-600 hover:border-primary-500 rounded-lg flex flex-col items-center justify-center gap-1 text-dark-400 hover:text-primary-400 transition-all"
              >
                <span className="text-2xl">+</span>
                <span className="text-xs">Add Photo</span>
              </button>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            multiple
            className="hidden"
          />
        </div>

        {/* Details */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold font-display text-white mb-4">📝 Item Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1.5">Title *</label>
              <input
                {...register('title', { required: 'Title is required', minLength: { value: 3, message: 'Min 3 characters' } })}
                className="input-field"
                placeholder="e.g. Apple iPhone 13 Pro 256GB"
              />
              {errors.title && <p className="mt-1 text-xs text-danger">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1.5">Description *</label>
              <textarea
                {...register('description', { required: 'Description is required', minLength: { value: 10, message: 'Min 10 characters' } })}
                className="input-field min-h-[120px] resize-y"
                placeholder="Describe your item's condition, features, what's included..."
              />
              {errors.description && <p className="mt-1 text-xs text-danger">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-1.5">Category *</label>
                <select {...register('category', { required: 'Category is required' })} className="input-field">
                  <option value="">Select category</option>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-xs text-danger">{errors.category.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-200 mb-1.5">Condition *</label>
                <select {...register('condition', { required: 'Condition is required' })} className="input-field">
                  <option value="">Select condition</option>
                  {Object.entries(conditionLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                {errors.condition && <p className="mt-1 text-xs text-danger">{errors.condition.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-1.5">Price (₹) *</label>
                <input
                  type="number"
                  {...register('price', { required: 'Price is required', min: { value: 0, message: 'Price cannot be negative' } })}
                  className="input-field"
                  placeholder="e.g. 15000"
                  min="0"
                />
                {errors.price && <p className="mt-1 text-xs text-danger">{errors.price.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-200 mb-1.5">Location</label>
                <input
                  {...register('location')}
                  className="input-field"
                  placeholder="e.g. Mumbai, Maharashtra"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary flex-1 sm:flex-none sm:w-32"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Uploading & Creating...
              </span>
            ) : 'Publish Listing 🚀'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListing;