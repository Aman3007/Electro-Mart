import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchListing, updateListing } from '../store/slices/listingSlice';
import { categoryLabels, conditionLabels } from '../utils/helpers';

const EditListing = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentListing, loading } = useSelector(state => state.listings);
  const { user } = useSelector(state => state.auth);
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    dispatch(fetchListing(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (currentListing) {
      if (currentListing.seller?._id?.toString() !== user?._id?.toString()) {
        toast.error('Not authorized');
        navigate('/dashboard');
        return;
      }
      reset({
        title: currentListing.title,
        description: currentListing.description,
        price: currentListing.price,
        condition: currentListing.condition,
        category: currentListing.category,
        location: currentListing.location,
        status: currentListing.status,
      });
    }
  }, [currentListing, reset, user, navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) { toast.error('Max 5 images'); return; }
    setNewImages(files);
    const previews = files.map(f => URL.createObjectURL(f));
    setNewPreviews(previews);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => formData.append(key, val));
    newImages.forEach(img => formData.append('images', img));

    const result = await dispatch(updateListing({ id, formData }));
    setSubmitting(false);

    if (updateListing.fulfilled.match(result)) {
      toast.success('Listing updated!');
      navigate(`/listing/${id}`);
    } else {
      toast.error(result.payload || 'Update failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-white mb-2">Edit Listing</h1>
        <p className="text-dark-300">Update your listing details</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Current images */}
        {currentListing?.images?.length > 0 && newPreviews.length === 0 && (
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold font-display text-white mb-3">Current Photos</h2>
            <div className="grid grid-cols-5 gap-2">
              {currentListing.images.map((img, idx) => (
                <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-dark-800">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <button type="button" onClick={() => fileInputRef.current.click()} className="mt-3 text-sm text-primary-400 hover:text-primary-300">
              Replace all photos
            </button>
          </div>
        )}

        {/* New image previews */}
        {newPreviews.length > 0 && (
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold font-display text-white mb-3">New Photos</h2>
            <div className="grid grid-cols-5 gap-2">
              {newPreviews.map((url, idx) => (
                <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-dark-800">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <button type="button" onClick={() => { setNewImages([]); setNewPreviews([]); }} className="mt-3 text-sm text-danger hover:text-red-400">
              Cancel photo change
            </button>
          </div>
        )}

        <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" multiple className="hidden" />

        {/* Form fields */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-semibold font-display text-white mb-2">Item Details</h2>

          <div>
            <label className="block text-sm font-medium text-dark-200 mb-1.5">Title *</label>
            <input {...register('title', { required: 'Title is required' })} className="input-field" />
            {errors.title && <p className="mt-1 text-xs text-danger">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-200 mb-1.5">Description *</label>
            <textarea {...register('description', { required: 'Description is required' })} className="input-field min-h-[100px] resize-y" />
            {errors.description && <p className="mt-1 text-xs text-danger">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1.5">Category *</label>
              <select {...register('category', { required: true })} className="input-field">
                {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1.5">Condition *</label>
              <select {...register('condition', { required: true })} className="input-field">
                {Object.entries(conditionLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1.5">Price (₹) *</label>
              <input type="number" {...register('price', { required: true, min: 0 })} className="input-field" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1.5">Status</label>
              <select {...register('status')} className="input-field">
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-200 mb-1.5">Location</label>
            <input {...register('location')} className="input-field" />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary w-32">Cancel</button>
          <button type="submit" disabled={submitting} className="btn-primary flex-1">
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditListing;