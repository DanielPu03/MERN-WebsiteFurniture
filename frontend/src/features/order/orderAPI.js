import axiosClient from '../../app/axiosClient';
import { API_ENDPOINTS } from '../../shared/constants';

// Order API functions
const orderAPI = {
  // Get all user orders
  getOrders: async () => {
    const response = await axiosClient.get(API_ENDPOINTS.ORDERS.GET_ALL);
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id) => {
    const url = API_ENDPOINTS.ORDERS.GET_BY_ID.replace(':id', id);
    const response = await axiosClient.get(url);
    return response.data;
  },

  // Create new order
  createOrder: async (orderData) => {
    const response = await axiosClient.post(API_ENDPOINTS.ORDERS.CREATE, orderData);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id) => {
    const url = API_ENDPOINTS.ORDERS.CANCEL.replace(':id', id);
    const response = await axiosClient.put(url);
    return response.data;
  },
};

export default orderAPI;
