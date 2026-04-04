import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchListing } from '../store/slices/listingSlice';
import { getOrCreateConversation } from '../store/slices/chatSlice';
import { SkeletonDetail } from '../components/common/Skeleton';
import {
  formatPrice, formatDate, conditionLabels, getConditionColor,
  categoryLabels, getAvatarUrl, formatLastSeen
} from '../utils/helpers';

const ListingDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentListing, loading } = useSelector(state => state.listings);
  const { user } = useSelector(state => state.auth);
  const [activeImage, setActiveImage] = useState(0);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchListing(id));
  }, [id, dispatch]);

  const handleContactSeller = async () => {
    if (!user) {
      toast.error('Please login to contact the seller');
      navigate('/login');
      return;
    }

    if (user._id === currentListing.seller._id) {
      toast('This is your own listing', { icon: '💡' });
      return;
    }

    setChatLoading(true);
    const result = await dispatch(getOrCreateConversation({
      userId: currentListing.seller._id,
      listingId: id,
    }));
    setChatLoading(false);

    if (getOrCreateConversation.fulfilled.match(result)) {
      navigate(`/chat/${result.payload._id}`);
    } else {
      toast.error(result.payload || 'Failed to start chat');
    }
  };

  if (loading || !currentListing) return <SkeletonDetail />;

  const { title, description, price, condition, category, images, seller, status, createdAt, views, location } = currentListing;
  const isOwner = user?._id === seller?._id;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-dark-400 mb-6">
        <Link to="/" className="hover:text-white">Home</Link>
        <span>/</span>
        <span className="hover:text-white cursor-pointer">{categoryLabels[category]}</span>
        <span>/</span>
        <span className="text-dark-200 truncate max-w-48">{title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-dark-800">
            {images?.[activeImage]?.url ? (
              <img
                src={images[activeImage].url}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl text-dark-600">📷</div>
            )}
            {status === 'sold' && (
              <div className="absolute inset-0 bg-dark-950/60 flex items-center justify-center">
                <span className="text-2xl font-bold font-display text-danger border-2 border-danger px-6 py-2 rounded-lg rotate-[-12deg]">SOLD</span>
              </div>
            )}
          </div>

          {images?.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square rounded-lg overflow-hidden bg-dark-800 transition-all ${activeImage === idx ? 'ring-2 ring-primary-500' : 'opacity-60 hover:opacity-100'}`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-3">
              <span className={`badge bg-dark-800 ${getConditionColor(condition)}`}>
                {conditionLabels[condition]}
              </span>
              <span className="badge bg-dark-800 text-dark-300">{categoryLabels[category]}</span>
              {status === 'available' ? (
                <span className="badge-available">● Available</span>
              ) : (
                <span className="badge-sold">● Sold</span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-display text-white leading-tight">{title}</h1>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-3xl font-bold font-display text-primary-400">{formatPrice(price)}</span>
            </div>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { icon: '👁️', value: views, label: 'Views' },
              { icon: '📅', value: formatDate(createdAt), label: 'Listed' },
              { icon: '📍', value: location || 'N/A', label: 'Location' },
            ].map(m => (
              <div key={m.label} className="glass-card p-3">
                <div className="text-lg">{m.icon}</div>
                <div className="text-sm font-semibold text-white truncate">{m.value}</div>
                <div className="text-xs text-dark-400">{m.label}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-2">Description</h3>
            <p className="text-dark-200 leading-relaxed text-sm whitespace-pre-line">{description}</p>
          </div>

          {/* Seller */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-3">Seller</h3>
            <div className="flex items-center gap-3">
              <Link to={`/profile/${seller?._id}`}>
                <img src={getAvatarUrl(seller?.avatar, seller?.name)} alt={seller?.name} className="w-12 h-12 rounded-xl border border-dark-600" />
              </Link>
              <div className="flex-1">
                <Link to={`/profile/${seller?._id}`} className="font-semibold text-white hover:text-primary-400 transition-colors">
                  {seller?.name}
                </Link>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {seller?.isOnline ? (
                    <span className="flex items-center gap-1 text-xs text-success">
                      <span className="w-1.5 h-1.5 bg-success rounded-full" />
                      Online now
                    </span>
                  ) : (
                    <span className="text-xs text-dark-400">{formatLastSeen(seller?.lastSeen)}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          {isOwner ? (
            <div className="grid grid-cols-2 gap-3">
              <Link to={`/edit-listing/${id}`} className="btn-secondary justify-center">✏️ Edit Listing</Link>
              <Link to="/dashboard" className="btn-outline justify-center">📊 Dashboard</Link>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handleContactSeller}
                disabled={chatLoading || status === 'sold'}
                className={`btn-primary w-full py-3 text-base ${status === 'sold' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {chatLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Opening Chat...
                  </span>
                ) : status === 'sold' ? '❌ Item Sold' : '💬 Chat with Seller'}
              </button>
              {!user && (
                <p className="text-center text-sm text-dark-400">
                  <Link to="/login" className="link-hover">Login</Link> or <Link to="/register" className="link-hover">Register</Link> to contact seller
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;