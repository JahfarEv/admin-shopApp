// src/features/shop/shopSlice.js (new path)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

export const fetchSalesmanData = createAsyncThunk(
  'shop/fetchSalesmanData',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('salesmanToken');
    if (!token) {
      window.location.href = '/salesman/login';
      return rejectWithValue('No token found');
    }

    try {
      const decoded = jwtDecode(token);
      const id = decoded?.id;
      
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/salesman/details/${id}`
      );
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch salesman data');
      }
      
      return data.salesman;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  salesman: null,
  loading: false,
  error: null,
};

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    clearSalesmanData: (state) => {
      state.salesman = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesmanData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesmanData.fulfilled, (state, action) => {
        state.loading = false;
        state.salesman = action.payload;
      })
      .addCase(fetchSalesmanData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSalesmanData } = shopSlice.actions;
export default shopSlice.reducer;