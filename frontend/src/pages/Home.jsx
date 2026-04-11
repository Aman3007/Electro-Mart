import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchListings } from '../store/slices/listingSlice';
import ListingCard from '../components/listings/ListingCard';
import SearchFilter from '../components/listings/SearchFilter';
import Pagination from '../components/common/Pagination';
import { SkeletonGrid } from '../components/common/Skeleton';
import { categoryLabels } from '../utils/helpers';
import heroImage from '../assets/hero_electronics.png';

const Home = () => {
  const dispatch = useDispatch();

  const {
    items = [],
    pagination = { total: 0, page: 1, pages: 1, limit: 12 },
    loading = false,
    filters = {}
  } = useSelector((state) => state.listings);

  // Fetch listings on mount & filters change
  useEffect(() => {
    dispatch(fetchListings({ ...filters, page: pagination?.page || 1 }));
  }, [dispatch, filters]);

  const handlePageChange = (page) => {
    dispatch(fetchListings({ ...filters, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-hero-gradient overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-72 h-72 bg-primary-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-dark-500 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1 text-center md:text-left z-10 w-full">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 !text-[#ffffff]">
              Buy & Sell <span className="text-gradient">Electronics</span>
            </h1>

            <p className="!text-[#cbd5e1] text-lg max-w-2xl mx-auto md:mx-0 mb-8">
              Discover amazing deals on pre-owned gadgets with real-time chat and secure listings.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link to="/register" className="btn-primary px-8 py-3 !text-[#ffffff]">
                Start Selling 🚀
              </Link>
              <a href="#listings" className="btn-secondary px-8 py-3">
                Browse Listings
              </a>
            </div>
          </div>
          
          <div className="flex-1 relative z-0 flex justify-center w-full">
             <div className="relative w-full max-w-[400px] md:max-w-[500px]">
               <img 
                 src={heroImage} 
                 alt="Electronics Gadgets" 
                 className="relative w-full h-auto object-contain animate-float"
                 style={{ mixBlendMode: 'screen' }}
               />
             </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="section-title mb-6">Browse by Category</h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-3">
          <button
            onClick={() => {
              dispatch(fetchListings({ ...filters, category: '' }));
              window.scrollTo({ top: 500, behavior: 'smooth' });
            }}
            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-dark-900 border border-dark-700 hover:border-primary-500 transition"
          >
            <span className="text-2xl">⚡</span>
            <span className="text-xs text-dark-300 text-center">
              All
            </span>
          </button>
          
          {Object.entries(categoryLabels).map(([key, label]) => {
            const [emoji, ...rest] = label.split(' ');
            const name = rest.join(' ');

            return (
              <button
                key={key}
                onClick={() => {
                  dispatch(fetchListings({ ...filters, category: key }));
                  window.scrollTo({ top: 500, behavior: 'smooth' });
                }}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-dark-900 border border-dark-700 hover:border-primary-500 transition"
              >
                <span className="text-2xl">{emoji}</span>
                <span className="text-xs text-dark-300 text-center">
                  {name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Listings Section */}
      <section id="listings" className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">
            {filters?.search
              ? `Results for "${filters.search}"`
              : filters?.category
                ? categoryLabels[filters.category]
                : 'All Listings'}
          </h2>

          {pagination?.total > 0 && (
            <span className="text-dark-400 text-sm">
              {pagination.total} items found
            </span>
          )}
        </div>

        {/* Search & Filter */}
        <div className="mb-8">
          <SearchFilter />
        </div>

        {/* Listings Grid */}
        {loading ? (
          <SkeletonGrid />
        ) : items?.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>

            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">
              No listings found
            </h3>
            <p className="text-dark-300 mb-6">
              Try adjusting your search or filters.
            </p>
            <Link to="/create-listing" className="btn-primary">
              Be the first to sell!
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;