import { useState, useCallback } from 'react';
import { useApi } from './useApi';

export const useMutation = (endpoint, method = 'POST', options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { post, put, patch, del } = useApi();

  const mutate = useCallback(async (body, mutateOptions = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      switch (method.toUpperCase()) {
        case 'POST':
          response = await post(endpoint, body, { ...options, ...mutateOptions });
          break;
        case 'PUT':
          response = await put(endpoint, body, { ...options, ...mutateOptions });
          break;
        case 'PATCH':
          response = await patch(endpoint, body, { ...options, ...mutateOptions });
          break;
        case 'DELETE':
          response = await del(endpoint, { ...options, ...mutateOptions });
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      
      setData(response.data || response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, method, options, post, put, patch, del]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, mutate, reset };
};
