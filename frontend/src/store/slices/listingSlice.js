import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchListings = createAsyncThunk(
  'listings/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const res = await api.get(`/listings?${queryString}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch listings');
    }
  }
);

export const fetchListing = createAsyncThunk(
  'listings/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/listings/${id}`);
      return res.data.listing;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch listing');
    }
  }
);

export const createListing = createAsyncThunk(
  'listings/create',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post('/listings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.listing;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to create listing');
    }
  }
);

export const updateListing = createAsyncThunk(
  'listings/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/listings/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.listing;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update listing');
    }
  }
);

export const deleteListing = createAsyncThunk(
  'listings/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/listings/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to delete listing');
    }
  }
);

const listingSlice = createSlice({
  name: 'listings',
  initialState: {
    items: [],
    currentListing: null,
    pagination: {
      page: 1,
      limit: 12,
      total: 0,
      pages: 1,
    },
    loading: false,
    error: null,
    filters: {
      search: '',
      category: '',
      condition: '',
      minPrice: '',
      maxPrice: '',
      sort: 'createdAt_desc',
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        category: '',
        condition: '',
        minPrice: '',
        maxPrice: '',
        sort: 'createdAt_desc',
      };
    },
    clearCurrentListing: (state) => {
      state.currentListing = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.items = action.payload?.listings || [];

        state.pagination = action.payload?.pagination || {
          page: 1,
          limit: 12,
          total: 0,
          pages: 1,
        };

        state.loading = false;
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchListing.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchListing.fulfilled, (state, action) => {
        state.currentListing = action.payload;
        state.loading = false;
      })
      .addCase(fetchListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateListing.fulfilled, (state, action) => {
        const idx = state.items.findIndex(i => i._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;

        if (state.currentListing?._id === action.payload._id) {
          state.currentListing = action.payload;
        }
      })
      .addCase(deleteListing.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i._id !== action.payload);
      });
  },
});

export const { setFilters, clearFilters, clearCurrentListing } = listingSlice.actions;
export default listingSlice.reducer;