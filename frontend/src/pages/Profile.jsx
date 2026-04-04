import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { setUser } from '../store/slices/authSlice';
import ListingCard from '../components/listings/ListingCard';
import { getAvatarUrl, formatDate } from '../utils/helpers';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector(state => state.auth);
  const [profileData, setProfileData] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const isOwn = currentUser?._id === id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/users/${id}`);
        setProfileData(res.data.user);
        setListings(res.data.listings);
        reset({
          name: res.data.user.name,
          bio: res.data.user.bio,
          phone: res.data.user.phone,
          location: res.data.user.location,
        });
      } catch (err) {
        toast.error('User not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleUpdateProfile = async (data) => {
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => v && formData.append(k, v));
      const res = await api.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfileData(res.data.user);
      dispatch(setUser(res.data.user));
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!profileData) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Profile header */}
      <div className="glass-card p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex-shrink-0">
            <img
              src={getAvatarUrl(profileData.avatar, profileData.name)}
              alt={profileData.name}
              className="w-24 h-24 rounded-2xl border-2 border-dark-600"
            />
            {profileData.isOnline && (
              <div className="flex items-center gap-1 mt-2 justify-center">
                <span className="w-2 h-2 bg-success rounded-full" />
                <span className="text-xs text-success">Online</span>
              </div>
            )}
          </div>

          {!editing ? (
            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-2xl font-bold font-display text-white">{profileData.name}</h1>
                  <p className="text-dark-400 text-sm">Member since {formatDate(profileData.createdAt)}</p>
                </div>
                {isOwn && (
                  <button onClick={() => setEditing(true)} className="btn-secondary text-sm py-2">
                    ✏️ Edit Profile
                  </button>
                )}
              </div>

              {profileData.bio && (
                <p className="mt-3 text-dark-200 leading-relaxed">{profileData.bio}</p>
              )}

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-dark-400">
                {profileData.location && <span>📍 {profileData.location}</span>}
                {profileData.phone && isOwn && <span>📞 {profileData.phone}</span>}
                <span>🏷️ Role: {profileData.role}</span>
                <span>📦 {listings.length} listings</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(handleUpdateProfile)} className="flex-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-dark-400 mb-1">Name</label>
                  <input {...register('name')} className="input-field text-sm py-2" />
                </div>
                <div>
                  <label className="block text-xs text-dark-400 mb-1">Location</label>
                  <input {...register('location')} className="input-field text-sm py-2" placeholder="City, State" />
                </div>
                <div>
                  <label className="block text-xs text-dark-400 mb-1">Phone</label>
                  <input {...register('phone')} className="input-field text-sm py-2" placeholder="+91 XXXXX XXXXX" />
                </div>
                <div>
                  <label className="block text-xs text-dark-400 mb-1">Role</label>
                  <select {...register('role')} className="input-field text-sm py-2">
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-dark-400 mb-1">Bio</label>
                <textarea {...register('bio')} className="input-field text-sm py-2 resize-none" rows={3} placeholder="Tell buyers about yourself..." />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setEditing(false)} className="btn-secondary text-sm py-2 px-4">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary text-sm py-2 px-6">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Listings */}
      <div>
        <h2 className="section-title mb-6">
          {isOwn ? 'My Listings' : `${profileData.name}'s Listings`}
          <span className="ml-2 text-lg text-dark-400">({listings.length})</span>
        </h2>

        {listings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-dark-300">
              {isOwn ? "You haven't listed any items yet" : "No listings yet"}
            </p>
            {isOwn && (
              <Link to="/create-listing" className="btn-primary mt-4 inline-flex">
                Create Your First Listing
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {listings.map(listing => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;