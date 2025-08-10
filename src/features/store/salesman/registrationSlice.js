// src/features/registration/registrationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchManagers = createAsyncThunk(
  'salesmanRegister/fetchManagers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/manager/managers`);
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch managers');
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerSalesman = createAsyncThunk(
  'salesmanRegister/registerSalesman',
  async (formData, { rejectWithValue }) => {
    try {
      const { confirmPassword, ...dataToSend } = formData;
      
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/salesman/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Registration failed');
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  managers: [],
  loadingManagers: false,
  isSubmitting: false,
  successMessage: '',
  errors: {},
  managerError: null,
};

const salesmanRegisterSlice = createSlice({
  name: 'salesmanRegister',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.errors = {};
      state.managerError = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Managers
      .addCase(fetchManagers.pending, (state) => {
        state.loadingManagers = true;
        state.managerError = null;
      })
      .addCase(fetchManagers.fulfilled, (state, action) => {
        state.loadingManagers = false;
        state.managers = action.payload;
      })
      .addCase(fetchManagers.rejected, (state, action) => {
        state.loadingManagers = false;
        state.managerError = action.payload;
      })
      // Register Salesman
      .addCase(registerSalesman.pending, (state) => {
        state.isSubmitting = true;
        state.errors = {};
      })
      .addCase(registerSalesman.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.successMessage = 'Registration successful! Awaiting admin approval.';
        state.errors = {};
      })
      .addCase(registerSalesman.rejected, (state, action) => {
        state.isSubmitting = false;
        state.errors = { submit: action.payload };
      });
  },
});

export const { clearErrors, clearSuccessMessage } = salesmanRegisterSlice.actions;
export default salesmanRegisterSlice.reducer;
