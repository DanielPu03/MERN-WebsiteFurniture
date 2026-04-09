import { useAppDispatch, useAppSelector } from '../../../shared/hooks/useRedux';
import { getProductCollections } from '../../products/store/productSlice';

export const useCollections = () => {
  const dispatch = useAppDispatch();
  const collections = useAppSelector(state => state.product.productCollections);
  const isLoading = useAppSelector(state => state.product.isLoading);
  const error = useAppSelector(state => state.product.error);

  const loadCollections = () => {
    return dispatch(getProductCollections());
  };

  return {
    collections,
    isLoading,
    error,
    loadCollections,
  };
};
