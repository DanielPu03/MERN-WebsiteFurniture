// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

// Format date
export const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };
  return new Date(dateString).toLocaleDateString('vi-VN', defaultOptions);
};

// Format date time
export const formatDateTime = (dateString, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  };
  return new Date(dateString).toLocaleString('vi-VN', defaultOptions);
};

// Format phone number
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  // Format: 0123 456 789
  return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
};

// Generate slug from string
export const generateSlug = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[áàảạãăắằẳẵặâấầẩẫậ]/g, 'a')
    .replace(/[éèẻẽêếềểễệ]/g, 'e')
    .replace(/[íìỉĩị]/g, 'i')
    .replace(/[óòỏõôốồổỗộơớờởỡợ]/g, 'o')
    .replace(/[úùủũưứừửữự]/g, 'u')
    .replace(/[ýỳỷỹỵ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// Validate email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate phone number (10 digits)
export const isValidPhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone);
};

// Validate password (at least 6 chars, 1 uppercase, 1 lowercase, 1 number)
export const isValidPassword = (password) => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  return re.test(password);
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Get file extension
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

// Check if file is image
export const isImageFile = (filename) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const extension = getFileExtension(filename).toLowerCase();
  return imageExtensions.includes(extension);
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Get order status text
export const getOrderStatusText = (status) => {
  const statusMap = {
    0: 'Chờ xác nhận',
    1: 'Đã xác nhận',
    2: 'Đang giao hàng',
    3: 'Đã hoàn thành',
    4: 'Đã hủy',
  };
  return statusMap[status] || 'Không xác định';
};

// Get payment status text
export const getPaymentStatusText = (status) => {
  const statusMap = {
    0: 'Chờ thanh toán',
    1: 'Đã thanh toán',
    2: 'Thanh toán thất bại',
  };
  return statusMap[status] || 'Không xác định';
};

// Get shipping status text
export const getShippingStatusText = (status) => {
  const statusMap = {
    pending: 'Chờ xử lý',
    processing: 'Đang xử lý',
    shipped: 'Đang giao hàng',
    delivered: 'Đã giao hàng',
    cancelled: 'Đã hủy',
  };
  return statusMap[status] || 'Không xác định';
};

// Get payment method text
export const getPaymentMethodText = (method) => {
  const methodMap = {
    'COD': 'Thanh toán khi nhận hàng',
    'Bank Transfer': 'Chuyển khoản ngân hàng',
    'Credit Card': 'Thẻ tín dụng',
    'E-Wallet': 'Ví điện tử',
  };
  return methodMap[method] || method;
};

// Calculate discount percentage
export const calculateDiscountPercentage = (originalPrice, discountedPrice) => {
  if (!originalPrice || originalPrice <= 0) return 0;
  const discount = originalPrice - discountedPrice;
  return Math.round((discount / originalPrice) * 100);
};

// Generate random color
export const generateRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

// Scroll to top
export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

// Download file
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Check if device is mobile
export const isMobile = () => {
  return window.innerWidth <= 768;
};

// Get current breakpoint
export const getBreakpoint = () => {
  const width = window.innerWidth;
  if (width < 640) return 'sm';
  if (width < 768) return 'md';
  if (width < 1024) return 'lg';
  if (width < 1280) return 'xl';
  return '2xl';
};

export default {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatPhoneNumber,
  generateSlug,
  isValidEmail,
  isValidPhone,
  isValidPassword,
  truncateText,
  capitalize,
  getFileExtension,
  isImageFile,
  formatFileSize,
  debounce,
  throttle,
  getOrderStatusText,
  getPaymentStatusText,
  getShippingStatusText,
  getPaymentMethodText,
  calculateDiscountPercentage,
  generateRandomColor,
  scrollToTop,
  copyToClipboard,
  downloadFile,
  isMobile,
  getBreakpoint,
};
