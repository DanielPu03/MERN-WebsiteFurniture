export const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price || 0);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatShortDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat('vi-VN').format(number || 0);
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const formatStatus = (status, type = 'order') => {
  if (type === 'order') {
    const statusMap = {
      0: 'Chờ xác nhận',
      1: 'Đang xử lý',
      2: 'Hoàn thành',
      3: 'Đã giao',
      4: 'Đã hủy'
    };
    return statusMap[status] || 'Không xác định';
  }
  if (type === 'product') {
    return status ? 'Đang bán' : 'Ngừng bán';
  }
  return status ? 'Hoạt động' : 'Không hoạt động';
};

export const getStatusColor = (status, type = 'order') => {
  if (type === 'order') {
    const colorMap = {
      0: 'bg-yellow-100 text-yellow-800',
      1: 'bg-blue-100 text-blue-800',
      2: 'bg-green-100 text-green-800',
      3: 'bg-green-100 text-green-800',
      4: 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  }
  if (type === 'product') {
    return status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }
  return status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
};

