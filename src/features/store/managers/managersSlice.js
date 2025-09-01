import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all managers
export const fetchManagers = createAsyncThunk(
  "manager/fetchManagers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/managers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch managers");

      return data.data || []; // 👈 fix: return `data.data`
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


// Delete manager
export const deleteManager = createAsyncThunk(
  "manager/deleteManager",
  async (managerId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/managers/${managerId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete manager");

      return managerId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const managerSlice = createSlice({
  name: "manager",
  initialState: {
    managers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch managers
      .addCase(fetchManagers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchManagers.fulfilled, (state, action) => {
        state.loading = false;
        state.managers = action.payload;
      })
      .addCase(fetchManagers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete manager
      .addCase(deleteManager.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteManager.fulfilled, (state, action) => {
        state.loading = false;
        state.managers = state.managers.filter(m => m._id !== action.payload);
      })
      .addCase(deleteManager.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default managerSlice.reducer;
