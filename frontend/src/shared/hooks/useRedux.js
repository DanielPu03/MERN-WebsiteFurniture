import { useDispatch, useSelector } from 'react-redux';
import * as authActions from '../../features/auth/authSlice';
import * as productActions from '../../features/products/store/productSlice';
import * as cartActions from '../../features/cart/cartSlice';
import * as orderActions from '../../features/order/orderSlice';
import { addToCart, updateCartItem, removeFromCart, clearCart, getCart } from '../../features/cart/cartSlice';

// Custom hooks for Redux
export const useAppDispatch = () => useDispatch();
export const useAppSelector = (selector) => useSelector(selector);

// Auth hooks
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(state => state.auth);
  
  return {
    ...auth,
    dispatch,
    ...authActions,
  };
};

// Product hooks
export const useProduct = () => {
  const dispatch = useAppDispatch();
  const product = useAppSelector(state => state.product);
  
  return {
    ...product,
    dispatch,
    ...productActions,
  };
};

// Cart hooks
export const useCart = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(state => state.cart);
  
  
  return {
    ...cart,
    dispatch,
    addToCart: (productId, quantity) => dispatch(addToCart({ productId, quantity })),
    updateCartItem: (productId, quantity) => dispatch(updateCartItem({ productId, quantity })),
    removeFromCart: (productId) => dispatch(removeFromCart(productId)),
    clearCart: () => dispatch(clearCart()),
    getCart: () => dispatch(getCart()),
    items: cart.items || [],
    totalAmount: cart.totalAmount || 0,
    itemCount: cart.itemCount || 0,
    isLoading: cart.isLoading || false,
  };
};

// Order hooks
export const useOrder = () => {
  const dispatch = useAppDispatch();
  const order = useAppSelector(state => state.order);

  return {
    orders: order.orders,
    currentOrder: order.currentOrder,
    pagination: order.pagination,
    isLoading: order.isLoading,
    error: order.error,
    dispatch,
    ...orderActions,
  };
};

export default {
  useAppDispatch,
  useAppSelector,
  useAuth,
  useProduct,
  useCart,
  useOrder,
};
