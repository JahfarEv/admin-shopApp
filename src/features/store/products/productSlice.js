import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProductsByShopId = createAsyncThunk(
  "products/fetchByShopId",
  async (shopId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${
          import.meta.env.VITE_APP_BACKEND_URL
        }/adminDashboard/get-product-by-shopId/${shopId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      return data.products || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (productId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${
          import.meta.env.VITE_APP_BACKEND_URL
        }/adminDashboard/delete-product/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete product");
      return productId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle",
    error: null,
      message: null, // 👈 added

  },
  reducers: {
    // You can add other synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByShopId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsByShopId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        if (action.payload.length === 0) {
          state.message = "No products available for this shop.";
        } else {
          state.message = null;
        }
      })

      .addCase(fetchProductsByShopId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (product) => product._id !== action.payload
        );
      });
  },
});

export default productsSlice.reducer;
