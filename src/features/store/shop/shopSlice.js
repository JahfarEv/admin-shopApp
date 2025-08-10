// src/store/shopSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchShops = createAsyncThunk(
  'shops/fetchShops',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/getallshops`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch shops');
      }
      
      const data = await response.json();
      return data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchShops = createAsyncThunk(
  'shops/searchShops',
  async (keyword, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/search-shop/${keyword}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      return data.shops || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleShopBan = createAsyncThunk(
  'shops/toggleBan',
  async (shopId, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/change-shop-ban-status/${shopId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to toggle ban status');
      }
      
      // Refetch shops to get updated data
      dispatch(fetchShops());
      return shopId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteShop = createAsyncThunk(
  'shops/deleteShop',
  async (shopId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/delete-shopById/${shopId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to delete shop');
      }
      
      return shopId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const shopSlice = createSlice({
  name: 'shops',
  initialState: {
    shops: [],
    loading: false,
    error: null,
    searchKeyword: '',
  },
  reducers: {
    setSearchKeyword: (state, action) => {
      state.searchKeyword = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // First handle all specific cases with addCase
    builder
      .addCase(fetchShops.fulfilled, (state, action) => {
        state.loading = false;
        state.shops = action.payload;
      })
      .addCase(searchShops.fulfilled, (state, action) => {
        state.loading = false;
        state.shops = action.payload;
      })
      .addCase(deleteShop.fulfilled, (state, action) => {
        state.loading = false;
        state.shops = state.shops.filter(shop => shop._id !== action.payload);
      });

    // Then handle the matchers for pending/rejected states
    builder
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { setSearchKeyword, clearError } = shopSlice.actions;
export default shopSlice.reducer;