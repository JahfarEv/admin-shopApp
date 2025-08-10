import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const registerManager = createAsyncThunk(
  'managerRegistration/registerManager',
  async (managerData, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/manager/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(managerData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const managerRegistrationSlice = createSlice({
  name: 'managerRegistration',
  initialState: {
    token: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    clearRegistrationError: (state) => {
      state.error = null;
    },
    resetRegistrationState: (state) => {
      state.token = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerManager.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerManager.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
      })
      .addCase(registerManager.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearRegistrationError, resetRegistrationState } = managerRegistrationSlice.actions;
export default managerRegistrationSlice.reducer;