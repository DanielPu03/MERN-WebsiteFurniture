import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';

export const useFetchData = (endpoint, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { get } = useApi();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await get(endpoint, options);
      setData(response.data || response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, get, options]);

  useEffect(() => {
    fetchData();
  }, [...dependencies, endpoint, options]);

  return { data, loading, error, refetch: fetchData };
};
