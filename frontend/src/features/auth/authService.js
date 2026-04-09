import { VALIDATION_RULES } from '../../shared/constants';

// Validation functions
export const validateLoginForm = (formData) => {
  const errors = {};

  if (!formData.email?.trim()) {
    errors.email = 'Email là bắt buộc';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Email không hợp lệ';
  }

  if (!formData.matKhau?.trim()) {
    errors.matKhau = 'Mật khẩu là bắt buộc';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateRegisterForm = (formData) => {
  const errors = {};

  // Họ và tên
  if (!formData.hoTen?.trim()) {
    errors.hoTen = 'Họ và tên là bắt buộc';
  } else if (formData.hoTen.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
    errors.hoTen = `Họ và tên không được vượt quá ${VALIDATION_RULES.NAME_MAX_LENGTH} ký tự`;
  }

  // Email
  if (!formData.email?.trim()) {
    errors.email = 'Email là bắt buộc';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Email không hợp lệ';
  }

  // Mật khẩu
  if (!formData.matKhau?.trim()) {
    errors.matKhau = 'Mật khẩu là bắt buộc';
  } else if (formData.matKhau.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    errors.matKhau = `Mật khẩu phải có ít nhất ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} ký tự`;
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.matKhau)) {
    errors.matKhau = 'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số';
  }

  // Xác nhận mật khẩu
  if (!formData.xacNhanMatKhau?.trim()) {
    errors.xacNhanMatKhau = 'Xác nhận mật khẩu là bắt buộc';
  } else if (formData.matKhau !== formData.xacNhanMatKhau) {
    errors.xacNhanMatKhau = 'Mật khẩu xác nhận không khớp';
  }

  // Số điện thoại
  if (!formData.soDienThoai?.trim()) {
    errors.soDienThoai = 'Số điện thoại là bắt buộc';
  } else if (!/^[0-9]{10}$/.test(formData.soDienThoai)) {
    errors.soDienThoai = 'Số điện thoại phải có đúng 10 chữ số';
  }

  // Địa chỉ (optional)
  if (formData.diaChi && formData.diaChi.length > VALIDATION_RULES.ADDRESS_MAX_LENGTH) {
    errors.diaChi = `Địa chỉ không được vượt quá ${VALIDATION_RULES.ADDRESS_MAX_LENGTH} ký tự`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validatePasswordForm = (formData) => {
  const errors = {};

  if (!formData.matKhauCu?.trim()) {
    errors.matKhauCu = 'Mật khẩu cũ là bắt buộc';
  }

  if (!formData.matKhauMoi?.trim()) {
    errors.matKhauMoi = 'Mật khẩu mới là bắt buộc';
  } else if (formData.matKhauMoi.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    errors.matKhauMoi = `Mật khẩu mới phải có ít nhất ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} ký tự`;
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.matKhauMoi)) {
    errors.matKhauMoi = 'Mật khẩu mới phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số';
  }

  if (!formData.xacNhanMatKhauMoi?.trim()) {
    errors.xacNhanMatKhauMoi = 'Xác nhận mật khẩu mới là bắt buộc';
  } else if (formData.matKhauMoi !== formData.xacNhanMatKhauMoi) {
    errors.xacNhanMatKhauMoi = 'Mật khẩu xác nhận không khớp';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Format user data for API
export const formatUserData = (formData) => {
  return {
    hoTen: formData.hoTen?.trim() || '',
    email: formData.email?.trim() || '',
    matKhau: formData.matKhau || '',
    soDienThoai: formData.soDienThoai?.trim() || '',
    diaChi: formData.diaChi?.trim() || '',
  };
};

// Format profile data for API
export const formatProfileData = (formData) => {
  return {
    hoTen: formData.hoTen?.trim() || '',
    soDienThoai: formData.soDienThoai?.trim() || '',
    diaChi: formData.diaChi?.trim() || '',
  };
};

// Format password data for API
export const formatPasswordData = (formData) => {
  return {
    matKhauCu: formData.matKhauCu || '',
    matKhauMoi: formData.matKhauMoi || '',
  };
};

// Check if user is admin
export const isAdmin = (user) => {
  return user?.role === 1;
};

// Get user display name
export const getUserDisplayName = (user) => {
  return user?.hoTen || user?.email || 'Unknown User';
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

// Format date
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default {
  validateLoginForm,
  validateRegisterForm,
  validatePasswordForm,
  formatUserData,
  formatProfileData,
  formatPasswordData,
  isAdmin,
  getUserDisplayName,
  formatCurrency,
  formatDate,
};
