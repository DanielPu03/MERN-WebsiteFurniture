import { useProduct } from '../../products/hooks/useProduct';

export const useHome = () => {
  const { products, isLoading, error, getProducts, dispatch } = useProduct();

  const loadFeaturedProducts = (limit = 8) => {
    return dispatch(getProducts({ limit }));
  };

  return {
    featuredProducts: products,
    isLoading,
    error,
    loadFeaturedProducts,
  };
};
