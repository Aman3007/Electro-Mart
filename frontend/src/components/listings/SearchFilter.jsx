import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from '../../hooks/useDebounce';
import { setFilters, fetchListings } from '../../store/slices/listingSlice';
import { categoryLabels, conditionLabels } from '../../utils/helpers';

const SearchFilter = () => {
  const dispatch = useDispatch();
  const filters = useSelector(state => state.listings.filters);
  const [searchInput, setSearchInput] = useState(filters.search);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    dispatch(setFilters({ search: debouncedSearch }));
  }, [debouncedSearch, dispatch]);

  useEffect(() => {
    dispatch(fetchListings({ ...filters, page: 1 }));
  }, [filters, dispatch]);

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleClearFilters = () => {
    setSearchInput('');
    dispatch(setFilters({ search: '', category: '', condition: '', minPrice: '', maxPrice: '', sort: 'createdAt_desc' }));
  };

  const hasActiveFilters = filters.category || filters.condition || filters.minPrice || filters.maxPrice;

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search electronics..."
            className="input-field pl-10"
          />
          {searchInput && (
            <button onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white">
              ✕
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary relative ${hasActiveFilters ? 'border-primary-500 text-primary-400' : ''}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full" />
          )}
        </button>

        <select
          value={filters.sort}
          onChange={e => handleFilterChange('sort', e.target.value)}
          className="input-field w-auto min-w-[160px] cursor-pointer"
        >
          <option value="createdAt_desc">Newest First</option>
          <option value="createdAt_asc">Oldest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="glass-card p-4 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Category</label>
              <select
                value={filters.category}
                onChange={e => handleFilterChange('category', e.target.value)}
                className="input-field text-sm py-2"
              >
                <option value="">All Categories</option>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Condition</label>
              <select
                value={filters.condition}
                onChange={e => handleFilterChange('condition', e.target.value)}
                className="input-field text-sm py-2"
              >
                <option value="">Any Condition</option>
                {Object.entries(conditionLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Min Price (₹)</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={e => handleFilterChange('minPrice', e.target.value)}
                placeholder="0"
                min="0"
                className="input-field text-sm py-2"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Max Price (₹)</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={e => handleFilterChange('maxPrice', e.target.value)}
                placeholder="Any"
                min="0"
                className="input-field text-sm py-2"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-3 pt-3 border-t border-dark-700">
              <button onClick={handleClearFilters} className="text-sm text-danger hover:text-red-400 transition-colors">
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;