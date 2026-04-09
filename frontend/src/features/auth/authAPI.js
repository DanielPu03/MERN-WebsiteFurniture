import axiosClient from '../../app/axiosClient';
import { API_ENDPOINTS } from '../../shared/constants';

// Auth API functions
const authAPI = {
  // Login
  login: async (credentials) => {
    const response = await axiosClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  // Register
  register: async (userData) => {
    const response = await axiosClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await axiosClient.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  // Update profile
  updateProfile: async (userData) => {
    const response = await axiosClient.put(API_ENDPOINTS.AUTH.PROFILE, userData);
    return response.data;
  },

  // Change password
  changePassword: async (passwords) => {
    const response = await axiosClient.put(API_ENDPOINTS.AUTH.PASSWORD, passwords);
    return response.data;
  },
};

export default authAPI;
