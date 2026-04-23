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
    try {
      const response = await axiosClient.post(API_ENDPOINTS.CART.ADD, {
        sanPhamId: productId,
        soLuong: quantity,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
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
    try {
      // Replace :id placeholder with actual productId using string replace
      const removeUrl = API_ENDPOINTS.CART.REMOVE.replace(':id', productId);
      const response = await axiosClient.delete(removeUrl);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Clear entire cart
  clearCart: async () => {
    const response = await axiosClient.delete(API_ENDPOINTS.CART.CLEAR);
    return response.data;
  },
};

export default cartAPI;
