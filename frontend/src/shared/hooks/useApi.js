import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const get = useCallback(async (endpoint, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
          ...options.headers
        },
        ...options
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      return data;
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Lỗi khi lấy dữ liệu!');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const post = useCallback(async (endpoint, body, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
          ...options.headers
        },
        body: JSON.stringify(body),
        ...options
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      return data;
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Lỗi khi gửi dữ liệu!');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const put = useCallback(async (endpoint, body, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
          ...options.headers
        },
        body: JSON.stringify(body),
        ...options
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      return data;
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Lỗi khi cập nhật dữ liệu!');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const del = useCallback(async (endpoint, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
          ...options.headers
        },
        ...options
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      return data;
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Lỗi khi xóa dữ liệu!');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const patch = useCallback(async (endpoint, body, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
          ...options.headers
        },
        body: JSON.stringify(body),
        ...options
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      return data;
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Lỗi khi cập nhật dữ liệu!');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    get,
    post,
    put,
    del,
    patch
  };
};
