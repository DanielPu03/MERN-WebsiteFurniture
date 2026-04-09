import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCart } from '../../features/cart/cartSlice';
import { getProfile } from '../../features/auth/authSlice';

// Hook để tự động đồng bộ dữ liệu khi user đăng nhập
export const useAuthSync = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, token, user } = useSelector(state => state.auth);

  useEffect(() => {
    // Khi có token và user chưa được load, get profile
    if (token && !user) {
      dispatch(getProfile());
    }
  }, [token, user, dispatch]);

  useEffect(() => {
    // Khi user đã xác thực, load cart
    if (isAuthenticated && user) {
      dispatch(getCart());
    }
  }, [isAuthenticated, user, dispatch]);
};

export default useAuthSync;
