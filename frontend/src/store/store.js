import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import listingReducer from './slices/listingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    listings: listingReducer,
  },
});

export default store;