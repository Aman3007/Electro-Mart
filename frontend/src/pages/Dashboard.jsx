import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { deleteListing, updateListing } from '../store/slices/listingSlice';
import { formatPrice, timeAgo, getAvatarUrl } from '../utils/helpers';

const StatusBadge = ({ status }) => {
  const styles = {
    available: 'badge-available',
    sold: 'badge-sold',
    pending: 'bg-warning/20 text-warning badge',
  };

  return <span className={styles[status] || 'badge'}>{status}</span>;
};

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetchMyListings = async (page = 1) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page,
        limit: 10,
      });

      if (statusFilter) params.append('status', statusFilter);

      const res = await api.get(`/listings/my?${params}`);

      setListings(res.data.listings);
      setPagination(res.data.pagination);

    } catch (err) {
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, [statusFilter]);

  // ✅ DELETE LISTING
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    setDeleting(id);

    try {
      const result = await dispatch(deleteListing(id));

      if (deleteListing.fulfilled.match(result)) {
        toast.success('Listing deleted');
        fetchMyListings();
      } else {
        toast.error(result.payload || 'Failed to delete');
      }

    } finally {
      setDeleting(null);
    }
  };

  // ✅ FIXED STATUS UPDATE
  const handleStatusChange = async (id, newStatus) => {
    try {

      const formData = new FormData();
      formData.append('status', newStatus);

      const result = await dispatch(updateListing({ id, formData }));

      if (updateListing.fulfilled.match(result)) {

        toast.success(`Marked as ${newStatus}`);

        // update UI instantly
        setListings(prev =>
          prev.map(l =>
            l._id === id ? { ...l, status: newStatus } : l
          )
        );

      } else {
        toast.error(result.payload || 'Failed to update status');
      }

    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">

        <div className="flex items-center gap-4">
          <img
            src={getAvatarUrl(user.avatar, user.name)}
            alt={user.name}
            className="w-12 h-12 rounded-xl border border-dark-600"
          />

          <div>
            <h1 className="text-2xl font-bold text-white">
              My Dashboard
            </h1>

            <p className="text-dark-400 text-sm">
              Welcome back, {user.name}
            </p>
          </div>
        </div>

        <Link
          to="/create-listing"
          className="btn-primary"
        >
          + Create New Listing
        </Link>

      </div>


      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        <div className="glass-card p-5">
          <div className="text-2xl mb-2">📦</div>
          <div className="text-2xl font-bold text-primary-400">
            {pagination.total}
          </div>
          <div className="text-sm text-dark-400">
            Total Listings
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="text-2xl mb-2">✅</div>
          <div className="text-2xl font-bold text-success">
            {listings.filter(l => l.status === 'available').length}
          </div>
          <div className="text-sm text-dark-400">
            Available
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="text-2xl mb-2">🎉</div>
          <div className="text-2xl font-bold text-warning">
            {listings.filter(l => l.status === 'sold').length}
          </div>
          <div className="text-sm text-dark-400">
            Sold
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="text-2xl mb-2">📅</div>
          <div className="text-2xl font-bold text-accent">
            {new Date(user.createdAt).getFullYear()}
          </div>
          <div className="text-sm text-dark-400">
            Member Since
          </div>
        </div>

      </div>


      {/* LISTINGS */}
      <div className="glass-card overflow-hidden">

        <div className="p-5 border-b border-dark-700 flex justify-between">

          <h2 className="text-lg font-semibold text-white">
            My Listings
          </h2>

          <div className="flex gap-2">

            {['', 'available', 'sold'].map(status => (

              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded text-xs
                ${statusFilter === status
                    ? 'bg-primary-500 text-black'
                    : 'text-dark-300'
                  }`}
              >
                {status === '' ? 'All' : status}
              </button>

            ))}

          </div>

        </div>


        {loading ? (

          <div className="py-12 text-center">
            Loading...
          </div>

        ) : listings.length === 0 ? (

          <div className="text-center py-12">
            No listings yet
          </div>

        ) : (

          <div>

            {listings.map(listing => (

              <div
                key={listing._id}
                className="p-4 flex gap-4 items-center border-b border-dark-800"
              >

                <div className="w-16 h-16 bg-dark-800 rounded overflow-hidden">

                  {listing.images?.[0]?.url ? (

                    <img
                      src={listing.images[0].url}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />

                  ) : (
                    <div className="flex items-center justify-center h-full">
                      📷
                    </div>
                  )}

                </div>


                <div className="flex-1">

                  <Link
                    to={`/listing/${listing._id}`}
                    className="text-white font-medium"
                  >
                    {listing.title}
                  </Link>

                  <div className="text-xs text-dark-400 mt-1">
                    {formatPrice(listing.price)} • {listing.views} views • {timeAgo(listing.createdAt)}
                  </div>

                </div>


                <StatusBadge status={listing.status} />


                {/* STATUS SELECT */}
                <select
                  value={listing.status}
                  onChange={(e) =>
                    handleStatusChange(listing._id, e.target.value)
                  }
                  className="bg-dark-800 border border-dark-600 text-white text-xs px-2 py-1 rounded"
                >
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                  <option value="pending">Pending</option>
                </select>


                {/* EDIT */}
                <Link
                  to={`/edit-listing/${listing._id}`}
                  className="px-2"
                >
                  ✏️
                </Link>


                {/* DELETE */}
                <button
                  onClick={() => handleDelete(listing._id)}
                  disabled={deleting === listing._id}
                  className="px-2"
                >
                  🗑️
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default Dashboard;