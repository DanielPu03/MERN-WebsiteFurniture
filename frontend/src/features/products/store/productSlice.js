import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productAPI from '../api/productAPI';

// Async thunks
export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (filters, { rejectWithValue }) => {
    try {
            const response = await productAPI.getProducts(filters);
            return response;
    } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const getProductById = createAsyncThunk(
  'products/getProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productAPI.getProductById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const getRelatedProducts = createAsyncThunk(
  'products/getRelatedProducts',
  async ({ categoryId, excludeId, limit = 4 }, { rejectWithValue }) => {
    try {
      const response = await productAPI.getProductsByCategory(categoryId, limit, excludeId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch related products');
    }
  }
);

export const getProductCollections = createAsyncThunk(
  'products/getProductCollections',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productAPI.getProductCollections();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch collections');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productAPI.createProduct(productData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await productAPI.updateProduct(id, productData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await productAPI.deleteProduct(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query, { rejectWithValue }) => {
    try {
      const response = await productAPI.searchProducts(query);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search products');
    }
  }
);

export const getFeaturedProducts = createAsyncThunk(
  'products/getFeaturedProducts',
  async (limit = 8, { rejectWithValue }) => {
    try {
      const response = await productAPI.getFeaturedProducts(limit);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured products');
    }
  }
);

export const getNewArrivals = createAsyncThunk(
  'products/getNewArrivals',
  async (limit = 8, { rejectWithValue }) => {
    try {
      const response = await productAPI.getNewArrivals(limit);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch new arrivals');
    }
  }
);

export const getBestSellers = createAsyncThunk(
  'products/getBestSellers',
  async (limit = 8, { rejectWithValue }) => {
    try {
      const response = await productAPI.getBestSellers(limit);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch best sellers');
    }
  }
);

export const getOnSaleProducts = createAsyncThunk(
  'products/getOnSaleProducts',
  async (limit = 8, { rejectWithValue }) => {
    try {
      const response = await productAPI.getOnSaleProducts(limit);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch on sale products');
    }
  }
);

// Initial state
const initialState = {
  products: [],
  currentProduct: null,
  productCollections: [],
  featuredProducts: [],
  relatedProducts: [],
  newArrivals: [],
  bestSellers: [],
  onSaleProducts: [],
  searchResults: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {
    search: '',
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  isLoading: false,
  error: null,
};

// Slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearProductCollections: (state) => {
      state.productCollections = null;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Products
      .addCase(getProducts.pending, (state) => {
                state.isLoading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
                state.isLoading = false;
        // Handle API response structure
        if (action.payload.data) {
          // API response structure: { success: true, data: { products: [...], pagination: {...} } }
          state.products = action.payload.data.products || [];
          state.pagination = {
            total: action.payload.data.pagination?.total || 0,
            page: action.payload.data.pagination?.page || 1,
            limit: action.payload.data.pagination?.limit || 10,
            totalPages: action.payload.data.pagination?.pages || 0,
          };
                  } else if (action.payload.products) {
          // Direct products array
          state.products = action.payload.products;
                  } else if (Array.isArray(action.payload)) {
          // Direct array fallback
          state.products = action.payload;
                  } else {
          // Fallback
          state.products = [];
                  }
        state.error = null;
              })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Product By Id
      .addCase(getProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload.product || action.payload.data?.product || action.payload;
        state.error = null;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.currentProduct = null;
      })
      // Get Related Products
      .addCase(getRelatedProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getRelatedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.relatedProducts = action.payload.products || action.payload.data?.products || action.payload;
        state.error = null;
      })
      .addCase(getRelatedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.relatedProducts = [];
      })
      // Get Product Collections
      .addCase(getProductCollections.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductCollections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productCollections = action.payload.collections || action.payload.data?.collections || action.payload;
        state.error = null;
      })
      .addCase(getProductCollections.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.unshift(action.payload.product || action.payload.data?.product || action.payload);
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.products.findIndex(p => p._id === (action.payload.product?._id || action.payload.data?.product?._id || action.payload._id));
        if (index !== -1) {
          state.products[index] = action.payload.product || action.payload.data?.product || action.payload;
        }
        if (state.currentProduct?._id === (action.payload.product?._id || action.payload.data?.product?._id || action.payload._id)) {
          state.currentProduct = action.payload.product || action.payload.data?.product || action.payload;
        }
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = state.products.filter(p => p._id !== action.payload);
        if (state.currentProduct?._id === action.payload) {
          state.currentProduct = null;
        }
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Search Products
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.products || action.payload.data?.products || action.payload;
        state.error = null;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Featured Products
      .addCase(getFeaturedProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featuredProducts = action.payload.products || action.payload.data?.products || action.payload;
        state.error = null;
      })
      .addCase(getFeaturedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get New Arrivals
      .addCase(getNewArrivals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getNewArrivals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.newArrivals = action.payload.products || action.payload.data?.products || action.payload;
        state.error = null;
      })
      .addCase(getNewArrivals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Best Sellers
      .addCase(getBestSellers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBestSellers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bestSellers = action.payload.products || action.payload.data?.products || action.payload;
        state.error = null;
      })
      .addCase(getBestSellers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get On Sale Products
      .addCase(getOnSaleProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOnSaleProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.onSaleProducts = action.payload.products || action.payload.data?.products || action.payload;
        state.error = null;
      })
      .addCase(getOnSaleProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  setFilters, 
  clearFilters, 
  clearError, 
  clearCurrentProduct, 
  clearProductCollections,
  setPagination,
  clearSearchResults
} = productSlice.actions;

export default productSlice.reducer;
