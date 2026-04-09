import { useAppDispatch, useAppSelector } from '../../../shared/hooks/useRedux';
import * as productActions from '../store';

export const useProduct = () => {
  const dispatch = useAppDispatch();
  const product = useAppSelector(state => state.product);
  
  return {
    ...product,
    dispatch,
    ...productActions,
  };
};
