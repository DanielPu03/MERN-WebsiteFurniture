import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartAPI from './cartAPI';

// Async thunks
export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.getCart();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.addToCart(productId, quantity);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.updateCartItem(productId, quantity);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart item');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await cartAPI.removeFromCart(productId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartAPI.clearCart();
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

// Initial state
const initialState = {
  cart: null,
  items: [],
  totalAmount: 0,
  itemCount: 0,
  isLoading: false,
  isUpdating: false,
  error: null,
};

// Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Optimistic updates
    updateQuantityOptimistic: (state, action) => {
      const { productId, quantity } = action.payload;
      const itemIndex = state.items.findIndex(item => item.sanPhamId === productId);
      
      if (itemIndex !== -1) {
        if (quantity <= 0) {
          state.items.splice(itemIndex, 1);
        } else {
          state.items[itemIndex].soLuong = quantity;
        }
        // Recalculate totals
        state.totalAmount = state.items.reduce((total, item) => total + (item.gia * item.soLuong), 0);
        state.itemCount = state.items.reduce((count, item) => count + item.soLuong, 0);
      }
    },
    removeFromCartOptimistic: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.sanPhamId !== productId);
      state.totalAmount = state.items.reduce((total, item) => total + (item.gia * item.soLuong), 0);
      state.itemCount = state.items.reduce((count, item) => count + item.soLuong, 0);
    },
    clearCartOptimistic: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.itemCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Cart
      .addCase(getCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload.cart;
        state.items = action.payload.cart.danhSachSanPham || [];
        state.totalAmount = state.items.reduce((total, item) => total + (item.gia * item.soLuong), 0);
        state.itemCount = state.items.reduce((count, item) => count + item.soLuong, 0);
        state.error = null;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.cart = action.payload.cart;
        state.items = action.payload.cart.danhSachSanPham || [];
        state.totalAmount = state.items.reduce((total, item) => total + (item.gia * item.soLuong), 0);
        state.itemCount = state.items.reduce((count, item) => count + item.soLuong, 0);
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.cart = action.payload.cart;
        state.items = action.payload.cart.danhSachSanPham || [];
        state.totalAmount = state.items.reduce((total, item) => total + (item.gia * item.soLuong), 0);
        state.itemCount = state.items.reduce((count, item) => count + item.soLuong, 0);
        state.error = null;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.cart = action.payload.cart;
        state.items = action.payload.cart.danhSachSanPham || [];
        state.totalAmount = state.items.reduce((total, item) => total + (item.gia * item.soLuong), 0);
        state.itemCount = state.items.reduce((count, item) => count + item.soLuong, 0);
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isUpdating = false;
        state.cart = null;
        state.items = [];
        state.totalAmount = 0;
        state.itemCount = 0;
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  updateQuantityOptimistic, 
  removeFromCartOptimistic, 
  clearCartOptimistic 
} = cartSlice.actions;

export default cartSlice.reducer;
