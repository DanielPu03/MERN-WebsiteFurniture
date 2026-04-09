# Frontend Architecture Guide

## 🏗️ Architecture Overview

This frontend uses a modern, scalable architecture with **Redux Toolkit** for state management and **React Query** for server state management.

## 📁 Folder Structure

```
src/
  app/                   # App configuration
  |   store.js         # Redux store configuration
  |   axiosClient.js   # Axios instance
  |   router.jsx       # React Router configuration
  shared/               # Shared utilities and components
  |   components/       # Reusable UI components
  |   |   layout/      # Layout components (Header, Footer)
  |   |   Loading.jsx  # Loading component
  |   |   Button.jsx   # Button component
  |   |   Input.jsx    # Input component
  |   hooks/           # Custom hooks (Redux, utilities)
  |   |   useRedux.js  # Redux hooks (useAppDispatch, useAppSelector)
  |   utils/           # Utility functions
  |   |   index.js    # Formatters, validators, helpers
  |   constants/       # App constants
  |   |   index.js    # API endpoints, app constants
  features/            # Feature-based modules
  |   home/            # Home page feature
  |   |   pages/
  |   |   |   HomePage.jsx
  |   |   hooks/
  |   |   |   useHome.js
  |   |   index.js
  |   products/        # Products feature
  |   |   pages/
  |   |   |   ProductPage.jsx
  |   |   |   ProductDetailPage.jsx
  |   |   |   index.js
  |   |   hooks/
  |   |   |   useProduct.js
  |   |   api/
  |   |   |   productAPI.js
  |   |   |   index.js
  |   |   store/
  |   |   |   productSlice.js
  |   |   |   index.js
  |   |   index.js
  |   auth/            # Authentication feature
  |   |   pages/
  |   |   |   LoginPage.jsx
  |   |   |   RegisterPage.jsx
  |   |   |   ProfilePage.jsx
  |   |   hooks/
  |   |   |   useAuth.js
  |   |   api/
  |   |   |   authAPI.js
  |   |   store/
  |   |   |   authSlice.js
  |   |   index.js
  |   cart/            # Cart feature
  |   |   pages/
  |   |   |   CartPage.jsx
  |   |   hooks/
  |   |   |   useCart.js
  |   |   api/
  |   |   |   cartAPI.js
  |   |   store/
  |   |   |   cartSlice.js
  |   |   index.js
  |   order/           # Orders feature
  |   |   pages/
  |   |   |   OrderPage.jsx
  |   |   hooks/
  |   |   |   useOrder.js
  |   |   api/
  |   |   |   orderAPI.js
  |   |   store/
  |   |   |   orderSlice.js
  |   |   index.js
  |   admin/           # Admin features
  |   |   pages/
  |   |   |   AdminDashboard.jsx
  |   |   hooks/
  |   |   |   useAdmin.js
  |   |   index.js
  layouts/             # Layout components
  |   MainLayout.jsx   # Main app layout
  |   AdminLayout.jsx  # Admin layout
  styles/              # Global styles
  |   index.css       # Tailwind CSS imports
  main.jsx            # React app entry point
  index.js            # DOM rendering
```

## 🔧 State Management

### Redux Toolkit (Client State)
- **Authentication**: User data, tokens, auth status
- **Cart**: Shopping cart state, optimistic updates
- **UI State**: Loading states, error states, modals

### React Query (Server State)
- **Products**: Product listings, details, filters
- **Collections**: Collections and product relationships
- **Orders**: Order history and management
- **Reviews**: Product reviews and ratings

## 🎯 Separation of Concerns

### UI Layer
```typescript
// Pure UI components
components/
├── Button.tsx
├── Modal.tsx
├── Loading.tsx
└── Form.tsx
```

### State Layer
```typescript
// Redux slices for client state
features/
├── auth/authSlice.ts
├── cart/cartSlice.ts
└── orders/orderSlice.ts
```

### API Layer
```typescript
// API services with React Query
shared/services/
├── api.ts
├── productsApi.ts
└── authApi.ts
```

### Business Logic Layer
```typescript
// Custom hooks combining state and API
features/
├── auth/hooks/useAuth.ts
├── products/hooks/useProducts.ts
└── cart/hooks/useCart.ts
```

## 🔄 Data Flow

### Authentication Flow
1. **UI Component** → `useAuth()` hook
2. **useAuth()** → Redux action (`loginAsync`)
3. **Redux** → API service (`authApi.login`)
4. **API** → Backend response
5. **Redux** → State update
6. **UI Component** → Re-render with new state

### Product Listing Flow
1. **UI Component** → `useProducts()` hook (React Query)
2. **React Query** → API service (`productsApi.getProducts`)
3. **API** → Backend response
4. **React Query** → Cache + state
5. **UI Component** → Re-render with data

### Cart Operations Flow
1. **UI Component** → `useCart()` hook
2. **useCart()** → Optimistic update (Redux)
3. **useCart()** → API service (`cartApi.addToCart`)
4. **API** → Backend response
5. **Redux** → Confirm or rollback update

## 🧩 Component Architecture

### Feature Components
```typescript
// ProductCard.tsx - Small, focused component
interface ProductCardProps {
  product: Product;
  onAddToCart: (id: string) => void;
  onAddToWishlist: (id: string) => void;
  onViewDetails: (id: string) => void;
}
```

### Container Components
```typescript
// ProductList.tsx - Container with hooks
const ProductList: React.FC = () => {
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();
  
  // Business logic and data fetching
  
  return <ProductGrid products={products} onAddToCart={addToCart} />;
};
```

### Page Components
```typescript
// ProductsPage.tsx - Page-level component
const ProductsPage: React.FC = () => {
  return (
    <div>
      <ProductFilters />
      <ProductList />
      <Pagination />
    </div>
  );
};
```

## 🔌 API Integration

### Service Layer
```typescript
// shared/services/api.ts
export const productsApi = {
  getProducts: async (filters: ProductFilters) => {
    const response = await api.get('/products', { params: filters });
    return handleApiResponse(response);
  },
  // ... other methods
};
```

### React Query Hooks
```typescript
// features/products/hooks/useProductsQuery.ts
export const useProductsQuery = (filters: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

## 🎨 UI Component Guidelines

### Component Props
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

### Component Composition
```typescript
// Compose small components
const ProductCard = ({ product, onAddToCart }) => (
  <Card>
    <ProductImage src={product.image} />
    <ProductInfo name={product.name} price={product.price} />
    <ProductActions onAddToCart={onAddToCart} />
  </Card>
);
```

## 🔧 Custom Hooks

### Redux Hooks
```typescript
// shared/hooks/redux.ts
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

### Feature Hooks
```typescript
// features/auth/hooks/useAuth.ts
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  const login = async (credentials: LoginCredentials) => {
    return dispatch(loginAsync(credentials));
  };
  
  return { user, isAuthenticated, login };
};
```

## 🚀 Performance Optimizations

### React Query Optimizations
- **Caching**: Automatic caching with stale time
- **Background Refetching**: Keep data fresh
- **Pagination**: Efficient pagination with `useInfiniteQuery`
- **Optimistic Updates**: Instant UI feedback

### Redux Optimizations
- **Selector Memoization**: Efficient state selection
- **Normalizr**: Normalized data structure
- **Middleware**: Custom middleware for logging, persistence

### Component Optimizations
- **React.memo**: Prevent unnecessary re-renders
- **useMemo/useCallback**: Memoize expensive computations
- **Code Splitting**: Lazy load components

## 🧪 Testing Strategy

### Unit Tests
```typescript
// __tests__/components/Button.test.tsx
describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

### Integration Tests
```typescript
// __tests__/hooks/useAuth.test.ts
describe('useAuth', () => {
  it('logs in user successfully', async () => {
    const { result } = renderHook(() => useAuth());
    await act(() => result.current.login(credentials));
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

## 📋 Best Practices

### Code Organization
- **Feature-first**: Group by feature, not by file type
- **Single Responsibility**: Each component/hook has one purpose
- **Consistent Naming**: Use descriptive, consistent names
- **Type Safety**: Use TypeScript for all components

### State Management
- **Client State**: Redux Toolkit for UI state, forms, cart
- **Server State**: React Query for API data, caching
- **Local State**: useState for component-specific state

### API Design
- **Type Safety**: Strong typing for all API responses
- **Error Handling**: Consistent error handling across services
- **Optimistic Updates**: Provide instant feedback
- **Retry Logic**: Automatic retry for failed requests

### Component Design
- **Small Components**: Keep components focused and reusable
- **Props Interface**: Clear prop interfaces with TypeScript
- **Composition**: Compose components rather than inheritance
- **Accessibility**: Follow WCAG guidelines

## 🔧 Development Workflow

### Adding New Features
1. **Create Types**: Define TypeScript interfaces
2. **Create API Service**: Add API methods
3. **Create Redux Slice**: Add state management if needed
4. **Create Hooks**: Combine state and API logic
5. **Create Components**: Build UI components
6. **Create Pages**: Assemble components into pages
7. **Add Tests**: Write unit and integration tests

### Code Review Checklist
- [ ] TypeScript types are defined
- [ ] Components are small and focused
- [ ] State management is appropriate
- [ ] Error handling is implemented
- [ ] Loading states are handled
- [ ] Accessibility is considered
- [ ] Tests are written
- [ ] Documentation is updated

This architecture provides a solid foundation for building scalable, maintainable React applications with excellent developer experience.
