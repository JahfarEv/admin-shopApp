import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCommissionSettings = createAsyncThunk(
  'commission/fetchSettings',
  async (role, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/get-commission/${role}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch settings');
      
      return {
        role,
        settings: data.settings
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCommissionSettings = createAsyncThunk(
  'commission/updateSettings',
  async ({ role, settings }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication required');

      const requestBody = {};
      if (settings.salesCommission) requestBody.amount = parseFloat(settings.salesCommission.replace(/[^0-9.]/g, ''));
      if (settings.salesTarget) requestBody.salesTarget = parseFloat(settings.salesTarget.replace(/[^0-9.]/g, ''));
      if (settings.subscriptionCommission) requestBody.subscriptionCommission = parseFloat(settings.subscriptionCommission.replace(/[^0-9.]/g, ''));

      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/commission/${role}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update settings');

      return {
        role,
        settings: requestBody
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  salesman: {
    settings: null,
    status: 'idle',
    error: null
  },
  manager: {
    settings: null,
    status: 'idle',
    error: null
  },
  updateStatus: 'idle',
  updateError: null,
  message: '',
  messageType: ''
};

const commissionSlice = createSlice({
  name: 'commission',
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload.message;
      state.messageType = action.payload.type;
    },
    clearMessage: (state) => {
      state.message = '';
      state.messageType = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch settings
      .addCase(fetchCommissionSettings.pending, (state, action) => {
        const role = action.meta.arg;
        state[role].status = 'loading';
        state[role].error = null;
      })
      .addCase(fetchCommissionSettings.fulfilled, (state, action) => {
        const { role, settings } = action.payload;
        state[role].settings = settings;
        state[role].status = 'succeeded';
        state[role].error = null;
      })
      .addCase(fetchCommissionSettings.rejected, (state, action) => {
        const role = action.meta.arg;
        state[role].status = 'failed';
        state[role].error = action.payload;
      })
      
      // Update settings
      .addCase(updateCommissionSettings.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateCommissionSettings.fulfilled, (state, action) => {
        const { role, settings } = action.payload;
        state[role].settings = {
          ...state[role].settings,
          ...settings
        };
        state.updateStatus = 'succeeded';
        state.updateError = null;
        state.message = `${role === 'salesman' ? 'Salesman' : 'Manager'} settings updated successfully!`;
        state.messageType = 'success';
      })
      .addCase(updateCommissionSettings.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload;
        state.message = action.payload;
        state.messageType = 'error';
      });
  }
});

export const { setMessage, clearMessage } = commissionSlice.actions;
export default commissionSlice.reducer;