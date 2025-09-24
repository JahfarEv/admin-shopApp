import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

// Async thunk for fetching salesman data
export const fetchSalesmanData = createAsyncThunk(
  'salesman/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('salesmanToken');
      if (!token) {
        throw new Error('No token found');
      }

      const decoded = jwtDecode(token);
      const salesmanId = decoded.id || decoded._id;
      if (!salesmanId) {
        throw new Error('Unable to get salesman ID from token');
      }

      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/salesman/details/${salesmanId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch salesman details');
      }
      
      const data = await response.json();
console.log(data, 'rers');
return data.salesman;   // return whole object

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  data: null,
  totalShops: 0,
  totalAmount: 0,
  totalCommission: 0,
  loading: false,
  error: null,
  isSidebarOpen: false,
};

const salesmanSlice = createSlice({
  name: 'salesman',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    resetError: (state) => {
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
        state.data = action.payload;
        
        if (action.payload.shopsAddedBySalesman) {
          const shops = action.payload.shopsAddedBySalesman;
          state.totalShops = shops.length;
          state.totalAmount = shops.reduce(
            (sum, shop) => sum + (shop.totalSales || 0),
            0
          );
        }
        
        state.totalCommission = action.payload?.salesCommissionEarned?.[0]?.amount || 0;
      })
      .addCase(fetchSalesmanData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { toggleSidebar, resetError } = salesmanSlice.actions;
export default salesmanSlice.reducer;