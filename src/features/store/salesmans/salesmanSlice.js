import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all salesmen
export const fetchSalesmen = createAsyncThunk(
  "salesman/fetchSalesmen",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/salesman`, // 👈 adjust if different
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch salesmen");

      return data.data || []; // assuming API response has { data: [...] }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Delete salesman
export const deleteSalesman = createAsyncThunk(
  "salesman/deleteSalesman",
  async (salesmanId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/salesmen/${salesmanId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete salesman");

      return salesmanId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const salesmanSlice = createSlice({
  name: "salesman",
  initialState: {
    salesmen: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch salesmen
      .addCase(fetchSalesmen.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesmen.fulfilled, (state, action) => {
        state.loading = false;
        state.salesmen = action.payload;
      })
      .addCase(fetchSalesmen.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete salesman
      .addCase(deleteSalesman.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSalesman.fulfilled, (state, action) => {
        state.loading = false;
        state.salesmen = state.salesmen.filter((s) => s._id !== action.payload);
      })
      .addCase(deleteSalesman.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default salesmanSlice.reducer;
