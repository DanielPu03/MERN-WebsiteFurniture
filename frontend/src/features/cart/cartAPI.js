import axiosClient from '../../app/axiosClient';
import { API_ENDPOINTS } from '../../shared/constants';

// Cart API functions
const cartAPI = {
  // Get user's cart
  getCart: async () => {
    const response = await axiosClient.get(API_ENDPOINTS.CART.GET);
    return response.data;
  },

  // Add product to cart
  addToCart: async (productId, quantity) => {
    const response = await axiosClient.post(API_ENDPOINTS.CART.ADD, {
      sanPhamId: productId,
      soLuong: quantity,
    });
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (productId, quantity) => {
    const response = await axiosClient.put(API_ENDPOINTS.CART.UPDATE, {
      sanPhamId: productId,
      soLuong: quantity,
    });
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (productId) => {
    const url = API_ENDPOINTS.CART.REPLACE(':id', productId);
    const response = await axiosClient.delete(url);
    return response.data;
  },

  // Clear entire cart
  clearCart: async () => {
    const response = await axiosClient.delete(API_ENDPOINTS.CART.CLEAR);
    return response.data;
  },
};

export default cartAPI;
