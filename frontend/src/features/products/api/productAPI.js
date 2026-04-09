import axiosClient from '../../../app/axiosClient';
import { API_ENDPOINTS } from '../../../shared/constants';

// Product API functions
const productAPI = {
  // Get all products with filters
  getProducts: async (filters = {}) => {
    const response = await axiosClient.get(API_ENDPOINTS.PRODUCTS.GET_ALL, { params: filters });
    return response.data;
  },

  // Get product by ID
  getProductById: async (id) => {
    const url = API_ENDPOINTS.PRODUCTS.GET_BY_ID.replace(':id', id);
    const response = await axiosClient.get(url);
    return response.data;
  },

  // Get product collections
  getProductCollections: async () => {
    const response = await axiosClient.get(API_ENDPOINTS.PRODUCTS.GET_COLLECTIONS);
    return response.data;
  },

  // Create product (admin)
  createProduct: async (productData) => {
    const response = await axiosClient.post(API_ENDPOINTS.PRODUCTS.CREATE, productData);
    return response.data;
  },

  // Update product (admin)
  updateProduct: async (id, productData) => {
    const url = API_ENDPOINTS.PRODUCTS.UPDATE.replace(':id', id);
    const response = await axiosClient.put(url, productData);
    return response.data;
  },

  // Delete product (admin)
  deleteProduct: async (id) => {
    const url = API_ENDPOINTS.PRODUCTS.DELETE.replace(':id', id);
    const response = await axiosClient.delete(url);
    return response.data;
  },

  // Search products
  searchProducts: async (query) => {
    const response = await axiosClient.get(API_ENDPOINTS.PRODUCTS.SEARCH, { params: { q: query } });
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (categoryId, filters = {}) => {
    const response = await axiosClient.get(API_ENDPOINTS.PRODUCTS.GET_BY_CATEGORY.replace(':id', categoryId), { params: filters });
    return response.data;
  },

  // Get products by brand
  getProductsByBrand: async (brandId, filters = {}) => {
    const response = await axiosClient.get(API_ENDPOINTS.PRODUCTS.GET_BY_BRAND.replace(':id', brandId), { params: filters });
    return response.data;
  },

  // Get related products
  getRelatedProducts: async (productId, limit = 4) => {
    const response = await axiosClient.get(API_ENDPOINTS.PRODUCTS.GET_RELATED.replace(':id', productId), { params: { limit } });
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async (limit = 8) => {
    const response = await axiosClient.get(API_ENDPOINTS.PRODUCTS.GET_FEATURED, { params: { limit } });
    return response.data;
  },

  // Get new arrivals
  getNewArrivals: async (limit = 8) => {
    const response = await axiosClient.get(API_ENDPOINTS.PRODUCTS.GET_NEW_ARRIVALS, { params: { limit } });
    return response.data;
  },

  // Get best sellers
  getBestSellers: async (limit = 8) => {
    const response = await axiosClient.get(API_ENDPOINTS.PRODUCTS.GET_BEST_SELLERS, { params: { limit } });
    return response.data;
  },

  // Get on sale products
  getOnSaleProducts: async (limit = 8) => {
    const response = await axiosClient.get(API_ENDPOINTS.PRODUCTS.GET_ON_SALE, { params: { limit } });
    return response.data;
  },

  // Get products by category (for related products)
  getProductsByCategory: async (categoryId, limit = 4, excludeId = null) => {
    const params = { limit };
    if (excludeId) {
      params.exclude = excludeId;
    }
    const response = await axiosClient.get(`/categories/${categoryId}/products`, { params });
    return response.data;
  },
};

export default productAPI;
