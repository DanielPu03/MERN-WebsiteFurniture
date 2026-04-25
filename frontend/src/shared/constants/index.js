// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    PROFILE: '/auth/profile',
    PASSWORD: '/auth/password',
  },
  
  // Products
  PRODUCTS: {
    GET_ALL: '/products',
    GET_BY_ID: '/products/:id',
    GET_COLLECTIONS: '/products/collections',
    CREATE: '/products',
    UPDATE: '/products/:id',
    DELETE: '/products/:id',
  },
  
  // Categories
  CATEGORIES: {
    GET_ALL: '/categories',
    GET_BY_ID: '/categories/:id',
    CREATE: '/categories',
    UPDATE: '/categories/:id',
    DELETE: '/categories/:id',
  },
  
  // Brands
  BRANDS: {
    GET_ALL: '/brands',
    GET_BY_ID: '/brands/:id',
    CREATE: '/brands',
    UPDATE: '/brands/:id',
    DELETE: '/brands/:id',
  },
  
  // Collections
  COLLECTIONS: {
    GET_ALL: '/collections',
    GET_BY_ID: '/collections/:id',
    CREATE: '/collections',
    UPDATE: '/collections/:id',
    DELETE: '/collections/:id',
  },
  
  // Cart
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    UPDATE: '/cart/update',
    REMOVE: '/cart/remove/:id',
    CLEAR: '/cart/clear',
    SUMMARY: '/cart/summary',
  },
  
  // Orders
  ORDERS: {
    GET_ALL: '/orders',
    GET_BY_ID: '/orders/:id',
    CREATE: '/orders',
    UPDATE: '/orders/:id',
    CANCEL: '/orders/:id/cancel',
  },
  
  // Wishlist
  WISHLIST: {
    GET: '/wishlist',
    ADD: '/wishlist/add',
    REMOVE: '/wishlist/remove/:id',
    CLEAR: '/wishlist/clear',
  },
  
  // Reviews
  REVIEWS: {
    GET_ALL: '/reviews',
    GET_BY_ID: '/reviews/:id',
    CREATE: '/reviews',
    UPDATE: '/reviews/:id',
    DELETE: '/reviews/:id',
  },
  
  // Users
  USERS: {
    GET_ALL: '/users',
    GET_BY_ID: '/users/:id',
    UPDATE: '/users/:id',
    DELETE: '/users/:id',
  },
  
  // Admin
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    STATS: '/admin/stats',
  },
};

// User Roles
export const USER_ROLES = {
  USER: 0,
  ADMIN: 1,
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 0,
  CONFIRMED: 1,
  SHIPPING: 2,
  COMPLETED: 3,
  CANCELLED: 4,
};

// Product Status
export const PRODUCT_STATUS = {
  INACTIVE: false,
  ACTIVE: true,
};

// Payment Methods
export const PAYMENT_METHODS = {
  COD: 'COD',
  BANK_TRANSFER: 'Bank Transfer',
  CREDIT_CARD: 'Credit Card',
  E_WALLET: 'E-Wallet',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 0,
  SUCCESS: 1,
  FAILED: 2,
};

// Shipping Status
export const SHIPPING_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Toast Messages
export const TOAST_MESSAGES = {
  LOGIN_SUCCESS: 'Đăng nhập thành công!',
  LOGIN_ERROR: 'Đăng nhập thất bại!',
  REGISTER_SUCCESS: 'Đăng ký thành công!',
  REGISTER_ERROR: 'Đăng ký thất bại!',
  LOGOUT_SUCCESS: 'Đăng xuất thành công!',
  ADD_TO_CART_SUCCESS: 'Thêm vào giỏ hàng thành công!',
  ADD_TO_CART_ERROR: 'Thêm vào giỏ hàng thất bại!',
  UPDATE_CART_SUCCESS: 'Cập nhật giỏ hàng thành công!',
  UPDATE_CART_ERROR: 'Cập nhật giỏ hàng thất bại!',
  REMOVE_CART_SUCCESS: 'Xóa sản phẩm thành công!',
  REMOVE_CART_ERROR: 'Xóa sản phẩm thất bại!',
  ORDER_SUCCESS: 'Đặt hàng thành công!',
  ORDER_ERROR: 'Đặt hàng thất bại!',
  UPDATE_PROFILE_SUCCESS: 'Cập nhật thông tin thành công!',
  UPDATE_PROFILE_ERROR: 'Cập nhật thông tin thất bại!',
  CHANGE_PASSWORD_SUCCESS: 'Đổi mật khẩu thành công!',
  CHANGE_PASSWORD_ERROR: 'Đổi mật khẩu thất bại!',
};

// Validation Rules
export const VALIDATION_RULES = {
  NAME_MAX_LENGTH: 55,
  EMAIL_MAX_LENGTH: 255,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 128,
  PHONE_LENGTH: 10,
  ADDRESS_MAX_LENGTH: 255,
  PRODUCT_NAME_MAX_LENGTH: 100,
  PRODUCT_DESCRIPTION_MAX_LENGTH: 500,
  CATEGORY_NAME_MAX_LENGTH: 100,
  CATEGORY_DESCRIPTION_MAX_LENGTH: 255,
  BRAND_NAME_MAX_LENGTH: 100,
  BRAND_DESCRIPTION_MAX_LENGTH: 255,
  COLLECTION_NAME_MAX_LENGTH: 100,
  COLLECTION_DESCRIPTION_MAX_LENGTH: 500,
  SHIPPING_UNIT_MAX_LENGTH: 100,
  SHIPPING_CODE_MAX_LENGTH: 50,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Image URLs
export const IMAGE_URLS = {
  DEFAULT_PRODUCT: '/images/default-product.jpg',
  DEFAULT_CATEGORY: '/images/default-category.jpg',
  DEFAULT_BRAND: '/images/default-brand.jpg',
  DEFAULT_COLLECTION: '/images/default-collection.jpg',
  DEFAULT_USER: '/images/default-user.jpg',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  CART: 'cart',
  WISHLIST: 'wishlist',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// App Config
export const APP_CONFIG = {
  NAME: 'havyStore',
  VERSION: '1.0.0',
  DESCRIPTION: 'Furniture E-commerce Platform',
  AUTHOR: 'Your Name',
  CONTACT_EMAIL: 'trunqphu.209@gmail.com',
  CONTACT_PHONE: '0832723534',
  ADDRESS: '180 Cao Lo, Phuong 4, Quan 8, HCM',
};

// Social Media
export const SOCIAL_MEDIA = {
  FACEBOOK: '#',
  INSTAGRAM: '#',
  YOUTUBE: '#',
  TWITTER: '#',
  ZALO: '#',
};

// Currency
export const CURRENCY = {
  CODE: 'VND',
  SYMBOL: '₫',
  LOCALE: 'vi-VN',
};

export default {
  API_ENDPOINTS,
  USER_ROLES,
  ORDER_STATUS,
  PRODUCT_STATUS,
  PAYMENT_METHODS,
  PAYMENT_STATUS,
  SHIPPING_STATUS,
  TOAST_MESSAGES,
  VALIDATION_RULES,
  PAGINATION,
  IMAGE_URLS,
  STORAGE_KEYS,
  APP_CONFIG,
  SOCIAL_MEDIA,
  CURRENCY,
};
