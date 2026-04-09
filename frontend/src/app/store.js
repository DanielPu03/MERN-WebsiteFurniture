import { configureStore } from '@reduxjs/toolkit';

// Import slices (default exports)
import authSlice from '../features/auth/authSlice';
import { productSlice } from '../features/products';
import cartSlice from '../features/cart/cartSlice';
import orderSlice from '../features/order/orderSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    product: productSlice,
    cart: cartSlice,
    order: orderSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;
