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
      const id = decoded?.id;

      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/salesman/details/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch salesman data');
      }

      const data = await response.json();
      return data.salesman;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating salesman data
export const updateSalesmanData = createAsyncThunk(
  'salesman/updateData',
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('salesmanToken');
      const decoded = jwtDecode(token);
      const id = decoded?.id;

      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/salesman/details/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      return data.salesman;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null,
  isEditing: false,
};

const salesmanSlice = createSlice({
  name: 'salesman',
  initialState,
  reducers: {
    setEditing: (state, action) => {
      state.isEditing = action.payload;
    },
    updateFormData: (state, action) => {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
      }
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch salesman data cases
      .addCase(fetchSalesmanData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesmanData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSalesmanData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update salesman data cases
      .addCase(updateSalesmanData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSalesmanData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.isEditing = false;
      })
      .addCase(updateSalesmanData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setEditing, updateFormData, resetError } = salesmanSlice.actions;
export default salesmanSlice.reducer;