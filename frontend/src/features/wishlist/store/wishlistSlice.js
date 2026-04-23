import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE = 'http://localhost:5000/api/wishlist';

// Async thunks
export const getWishlist = createAsyncThunk(
  'wishlist/getWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_BASE, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        return data.data.wishlist;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (sanPhamId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sanPhamId })
      });
      const data = await response.json();
      if (data.success) {
        return data.data.wishlist;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (sanPhamId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/${sanPhamId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        return data.data.wishlist;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkProductInWishlist = createAsyncThunk(
  'wishlist/checkProductInWishlist',
  async (sanPhamId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/check/${sanPhamId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        return { sanPhamId, inWishlist: data.data.inWishlist };
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  wishlist: null,
  wishlistProductIds: [],
  isLoading: false,
  error: null
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearWishlist: (state) => {
      state.wishlist = [];
      state.wishlistProductIds = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Wishlist
      .addCase(getWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishlist = action.payload;
        state.wishlistProductIds = (action.payload?.danhSachSanPham || []).map(item => item.sanPhamId?._id);
        state.error = null;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add to Wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishlist = action.payload;
        state.wishlistProductIds = (action.payload?.danhSachSanPham || []).map(item => item.sanPhamId?._id);
        state.error = null;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Remove from Wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishlist = action.payload;
        state.wishlistProductIds = (action.payload?.danhSachSanPham || []).map(item => item.sanPhamId?._id);
        state.error = null;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Check Product in Wishlist
      .addCase(checkProductInWishlist.fulfilled, (state, action) => {
        const { sanPhamId, inWishlist } = action.payload;
        if (inWishlist && !state.wishlistProductIds.includes(sanPhamId)) {
          state.wishlistProductIds.push(sanPhamId);
        } else if (!inWishlist) {
          state.wishlistProductIds = state.wishlistProductIds.filter(id => id !== sanPhamId);
        }
      });
  }
});

export const { clearError, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
