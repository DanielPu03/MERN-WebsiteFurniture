import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Check if it's token expiration or invalid credentials
      const errorMessage = error.response?.data?.message || '';
      
      if (errorMessage.includes('expired') || errorMessage.includes('hết hạn')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        console.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        console.error('Sai email hoặc mật khẩu. Vui lòng thử lại.');
      }
    } else if (error.response?.status === 403) {
      console.error('Bạn không có quyền truy cập trang này.');
    } else if (error.response?.status >= 500) {
      console.error('Lỗi server. Vui lòng thử lại sau.');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
export { API_BASE_URL };
