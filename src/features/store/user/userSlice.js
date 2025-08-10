import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(
        'https://shop-app-backend-k0a2.onrender.com/adminDashboard/getalluser',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const searchUsers = createAsyncThunk(
  'users/searchUsers',
  async (keyword, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/search-users/${keyword}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      return data.users || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/deleteuser/${userId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error('Failed to delete user');
      return userId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    filteredUsers: [],
    loading: false,
    error: null,
    filter: 'all',
    searchKeyword: '',
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
      state.filteredUsers = filterUsers(state.users, action.payload);
    },
    setSearchKeyword: (state, action) => {
      state.searchKeyword = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.filteredUsers = filterUsers(action.payload, state.filter);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search Users
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.filteredUsers = action.payload;
        state.filter = 'all';
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user._id !== action.payload);
        state.filteredUsers = state.filteredUsers.filter(user => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Helper function to filter users
const filterUsers = (users, filter) => {
  if (filter === 'subscribed') return users.filter(user => Boolean(user.subscriptionId));
  if (filter === 'non') return users.filter(user => !user.subscriptionId);
  return users;
};

export const { setFilter, setSearchKeyword } = userSlice.actions;
export default userSlice.reducer;