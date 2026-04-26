# TÀI LIỆU HƯỚNG DẪN DỰ ÁN BÀN ĐỒ NỘI THẤT

## 📋 MỤC LỤC

1. [Tổng quan dự án](#tổng-quan-dự-án)
2. [Cấu trúc dự án](#cấu-trúc-dự-án)
3. [Công nghệ sử dụng](#công-nghệ-sử-dụng)
4. [Luồng hoạt động chung](#luồng-hoạt-động-chung)
5. [Chi tiết các trang và chức năng](#chi-tiết-các-trang-và-chức-năng)
6. [Backend API](#backend-api)
7. [Database Schema](#database-schema)
8. [Cách chạy dự án](#cách-chạy-dự-án)

---

## TỔNG QUAN DỰ ÁN

**Tên dự án:** havyStore - Website bán đồ nội thất

**Mô tả:** Website thương mại điện tử bán đồ nội thất với đầy đủ tính năng cho cả khách hàng và quản trị viên.

**Các tính năng chính:**
- Xem và tìm kiếm sản phẩm
- Giỏ hàng và đặt hàng
- Quản lý danh sách yêu thích (Wishlist)
- Quản lý đơn hàng
- Quản lý người dùng
- Quản lý sản phẩm, danh mục, thương hiệu, bộ sưu tập
- Dashboard thống kê cho admin

---

## CẤU TRÚC DỰ ÁN

```
bandonoithat-fullstack/
├── backend/                    # Backend (Node.js + Express)
│   ├── controllers/           # Controllers xử lý logic
│   ├── models/               # Database models (Mongoose)
│   ├── routes/               # API routes
│   ├── middleware/           # Middleware (auth, admin)
│   ├── server.js             # Entry point backend
│   └── .env                  # Environment variables
├── frontend/                  # Frontend (React)
│   ├── src/
│   │   ├── app/              # App configuration
│   │   │   ├── router.jsx    # React Router
│   │   │   └── store.js      # Redux store
│   │   ├── features/         # Feature-based modules
│   │   │   ├── home/         # Trang chủ
│   │   │   ├── products/     # Sản phẩm
│   │   │   ├── auth/         # Đăng nhập/Đăng ký
│   │   │   ├── cart/         # Giỏ hàng
│   │   │   ├── order/        # Đơn hàng
│   │   │   ├── wishlist/     # Danh sách yêu thích
│   │   │   ├── collections/  # Bộ sưu tập
│   │   │   └── admin/        # Quản trị
│   │   ├── layouts/          # Layout components
│   │   ├── shared/           # Shared components & utils
│   │   │   ├── components/   # Reusable UI components
│   │   │   ├── hooks/        # Custom hooks
│   │   │   ├── utils/        # Utility functions
│   │   │   └── constants/    # App constants
│   │   └── main.jsx          # Entry point frontend
│   └── .env                  # Environment variables
└── README.md
```

---

## CÔNG NGHỆ SỬ DỤNG

### Frontend
- **React 18** - UI Library
- **React Router** - Routing
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload

---

## LUỒNG HOẠT ĐỘNG CHUNG (ĐƠN GIẢN)

### 1. Luồng Đăng nhập

**Bước 1: User nhập thông tin**
- **File:** `frontend/src/features/auth/pages/LoginPage.jsx`
- **Cần gì:** Email và password
- **Hành động:** User điền vào form → Click "Đăng nhập"

**Bước 2: Frontend validation**
- **File:** `frontend/src/features/auth/pages/LoginPage.jsx`
- **Xác thực:** 
  - Email không rỗng, đúng format
  - Password không rỗng, ít nhất 6 ký tự
- **Nếu lỗi:** Hiển thị lỗi → Dừng
- **Nếu OK:** Gửi dữ liệu đi

**Bước 3: Gửi request đến Backend**
- **File:** `frontend/src/features/auth/authAPI.js`
- **Action:** `authAPI.login(credentials)`
- **Request:** POST `/api/auth/login` với body `{ email, matKhau }`

**Bước 4: Backend nhận request**
- **File:** `backend/routes/auth.js` → `backend/controllers/authController.js`
- **Action:** `authController.login()`
- **Xác thực:**
  - Kiểm tra email & password có đủ không
  - Tìm user trong MongoDB: `User.findOne({ email })`
  - So sánh password: `user.comparePassword(matKhau)`
  - Kiểm tra tài khoản có active không: `user.trangThai`

**Bước 5: Generate JWT Token**
- **File:** `backend/controllers/authController.js`
- **Action:** `jwt.sign({ id: user._id }, secret, { expiresIn: '30d' })`
- **Kết quả:** Tạo token 30 ngày

**Bước 6: Return response**
- **File:** `backend/controllers/authController.js`
- **Response:** 
  ```json
  {
    success: true,
    data: { user: {...}, token: "jwt_token_here" }
  }
  ```

**Bước 7: Redux nhận response**
- **File:** `frontend/src/features/auth/authSlice.js`
- **Action:** `login` async thunk fulfilled
- **Lưu:** 
  - Token vào localStorage
  - User vào Redux state
  - isAuthenticated = true

**Bước 8: Điều hướng**
- **File:** `frontend/src/features/auth/pages/LoginPage.jsx`
- **Action:** `navigate('/')`
- **Kết quả:** User về trang chủ, đã đăng nhập

---

### 2. Luồng Xem Sản phẩm

**Bước 1: User navigate đến trang sản phẩm**
- **File:** `frontend/src/features/products/pages/ProductPage.jsx`
- **URL:** `/products?category=...&price=...&search=...`

**Bước 2: Frontend gửi request**
- **File:** `frontend/src/features/products/pages/ProductPage.jsx`
- **Request:** GET `/api/products?category=...&price=...&search=...&sortBy=...`

**Bước 3: Backend xử lý query**
- **File:** `backend/controllers/productController.js`
- **Action:** `getProducts()`
- **Xử lý:**
  - Parse query parameters
  - Build MongoDB query với filters
  - Populate: danhMucId, thuongHieuId, boSuuTapIds
  - Sort theo sortBy
  - Pagination: limit & skip

**Bước 4: Query MongoDB**
- **File:** `backend/controllers/productController.js`
- **Query:** `SanPham.find(query).populate(...).sort(...).limit(...).skip(...)`

**Bước 5: Return response**
- **File:** `backend/controllers/productController.js`
- **Response:** 
  ```json
  {
    success: true,
    data: { products: [...], pagination: {...} }
  }
  ```

**Bước 6: Frontend hiển thị**
- **File:** `frontend/src/features/products/pages/ProductPage.jsx`
- **Component:** `ProductGrid.jsx`
- **Hiển thị:** Danh sách sản phẩm với pagination

---

### 3. Luồng Thêm vào Giỏ hàng

**Bước 1: User click "Thêm vào giỏ"**
- **File:** `frontend/src/features/products/components/ProductGrid.jsx` hoặc `ProductDetailPage.jsx`
- **Action:** `onAddToCart(product)`

**Bước 2: Dispatch Redux action**
- **File:** `frontend/src/features/cart/cartSlice.js`
- **Action:** `addToCart({ productId, quantity })`
- **State:** `isUpdating = true`

**Bước 3: Gửi request**
- **File:** `frontend/src/features/cart/cartAPI.js`
- **Request:** POST `/api/cart/add`
- **Body:** `{ sanPhamId: productId, soLuong: quantity }`
- **Headers:** `Authorization: Bearer {token}`

**Bước 4: Middleware xác thực**
- **File:** `backend/middleware/auth.js`
- **Action:** `protect()` middleware
- **Xác thực:** Verify JWT token → Attach user vào req.user

**Bước 5: Backend xử lý**
- **File:** `backend/controllers/cartController.js`
- **Action:** `addToCart()`
- **Xử lý:**
  - Tìm cart: `GioHang.findOne({ nguoiDungId })`
  - Nếu chưa có → Tạo mới
  - Nếu sản phẩm đã có → Update số lượng
  - Nếu chưa có → Thêm mới
  - Lưu cart

**Bước 6: Populate cart**
- **File:** `backend/controllers/cartController.js`
- **Action:** `cart.populate('danhSachSanPham.sanPhamId', 'tenSanPham gia hinhAnh soLuongTon trangThai')`

**Bước 7: Return response**
- **File:** `backend/controllers/cartController.js`
- **Response:** 
  ```json
  {
    success: true,
    data: { cart: populatedCart }
  }
  ```

**Bước 8: Redux update state**
- **File:** `frontend/src/features/cart/cartSlice.js`
- **Transform:** Convert populated data sang format frontend
- **Update:** items, totalAmount, itemCount
- **State:** `isUpdating = false`

**Bước 9: Frontend hiển thị**
- **File:** Frontend components
- **Action:** Re-render, show toast, update cart badge

---

### 4. Luồng Đặt hàng

**Bước 1: User đi đến trang thanh toán**
- **File:** `frontend/src/features/order/pages/CheckoutPage.jsx`
- **URL:** `/checkout`
- **Load:** Cart items, default addresses

**Bước 2: User điền thông tin giao hàng**
- **File:** `frontend/src/features/order/pages/CheckoutPage.jsx`
- **Form:** fullName, phone, email, address, city, district, ward, notes
- **Chọn:** Payment method (COD)

**Bước 3: Frontend validation**
- **File:** `frontend/src/features/order/pages/CheckoutPage.jsx`
- **Check:** Các trường bắt buộc, cart không rỗng, user đã login
- **Nếu lỗi:** Show toast → Dừng

**Bước 4: Build order data**
- **File:** `frontend/src/features/order/pages/CheckoutPage.jsx`
- **Data:** 
  ```javascript
  {
    nguoiDungId: user._id,
    chiTietDonHang: items.map(...),
    diaChiGiaoHang: "...",
    ghiChu: "...",
    phiVanChuyen: 0,
    phuongThucThanhToan: "COD"
  }
  ```

**Bước 5: Dispatch createOrder**
- **File:** `frontend/src/features/order/orderSlice.js`
- **Action:** `createOrder(orderData)`
- **State:** `isLoading = true`

**Bước 6: Gửi request**
- **File:** `frontend/src/features/order/orderAPI.js`
- **Request:** POST `/api/orders`
- **Headers:** `Authorization: Bearer {token}`

**Bước 7: Middleware xác thực**
- **File:** `backend/middleware/auth.js`
- **Action:** `protect()` middleware
- **Xác thực:** Verify JWT token

**Bước 8: Backend validate stock**
- **File:** `backend/controllers/orderController.js`
- **Action:** Loop qua từng item
- **Check:** `SanPham.findById(item.sanPhamId)`
- **Validate:** `soLuongTon >= soLuong`
- **Nếu lỗi:** Return 400 "Insufficient stock"

**Bước 9: Backend tạo order**
- **File:** `backend/controllers/orderController.js`
- **Action:** `DonHang.create({ nguoiDungId, tongTien, diaChiGiaoHang, chiTietDonHang, ... })`

**Bước 10: Backend update stock**
- **File:** `backend/controllers/orderController.js`
- **Action:** Loop qua items
- **Update:** `SanPham.findByIdAndUpdate(item.sanPhamId, { $inc: { soLuongTon: -item.soLuong } })`

**Bước 11: Backend clear cart**
- **File:** `backend/controllers/orderController.js`
- **Action:** `GioHang.findOneAndUpdate({ nguoiDungId }, { danhSachSanPham: [] })`

**Bước 12: Populate order**
- **File:** `backend/controllers/orderController.js`
- **Action:** `DonHang.findById(order._id).populate('chiTietDonHang.sanPhamId', 'tenSanPham hinhAnh moTa')`

**Bước 13: Return response**
- **File:** `backend/controllers/orderController.js`
- **Response:** 
  ```json
  {
    success: true,
    data: { order: populatedOrder }
  }
  ```

**Bước 14: Redux update state**
- **File:** `frontend/src/features/order/orderSlice.js`
- **Update:** `orders.unshift(order)`, `currentOrder = order`
- **Clear:** Dispatch `clearCart()`
- **State:** `isLoading = false`

**Bước 15: Điều hướng**
- **File:** `frontend/src/features/order/pages/CheckoutPage.jsx`
- **Action:** `navigate('/orders')`
- **Kết quả:** User đến trang đơn hàng

---

### 5. Luồng Admin Thêm Sản phẩm

**Bước 1: Admin navigate đến trang quản lý sản phẩm**
- **File:** `frontend/src/features/admin/pages/ProductManagement.jsx`
- **URL:** `/admin/products`
- **Check:** Middleware adminOnly (role = 1)

**Bước 2: Load products**
- **File:** `frontend/src/features/admin/pages/ProductManagement.jsx`
- **Request:** GET `/api/products?admin=true`
- **Backend:** Không filter theo trangThai (xem tất cả)

**Bước 3: User click "Thêm sản phẩm"**
- **File:** `frontend/src/features/admin/pages/ProductManagement.jsx`
- **Action:** Open ProductModal

**Bước 4: User điền form**
- **File:** `frontend/src/features/admin/components/ProductForm.jsx`
- **Fields:** tenSanPham, gia, soLuongTon, danhMucId, thuongHieuId, boSuuTapIds, moTa, hinhAnh

**Bước 5: Frontend validation**
- **File:** `frontend/src/features/admin/pages/ProductManagement.jsx`
- **Check:** Các trường bắt buộc

**Bước 6: Upload images (nếu có)**
- **File:** `frontend/src/features/admin/pages/ProductManagement.jsx`
- **Action:** Upload lên server → Nhận URLs

**Bước 7: Build product data**
- **File:** `frontend/src/features/admin/pages/ProductManagement.jsx`
- **Data:** `{ tenSanPham, gia, soLuongTon, danhMucId, thuongHieuId, boSuuTapIds, moTa, hinhAnh, trangThai: true }`

**Bước 8: Gửi request**
- **File:** `frontend/src/features/admin/pages/ProductManagement.jsx`
- **Request:** POST `/api/products`
- **Headers:** `Authorization: Bearer {token}`, `Content-Type: multipart/form-data`

**Bước 9: Middleware xác thực & authorize**
- **File:** `backend/middleware/auth.js`
- **Action:** `protect()` → Verify token
- **File:** `backend/middleware/admin.js`
- **Action:** `adminOnly()` → Check role = 1

**Bước 10: Backend tạo product**
- **File:** `backend/controllers/productController.js`
- **Action:** `createProduct()`
- **Process:** Extract fields, process images
- **Create:** `SanPham.create(productData)`

**Bước 11: Populate product**
- **File:** `backend/controllers/productController.js`
- **Action:** Populate với danhMucId, thuongHieuId, boSuuTapIds

**Bước 12: Return response**
- **File:** `backend/controllers/productController.js`
- **Response:** 
  ```json
  {
    success: true,
    data: { product: populatedProduct }
  }
  ```

**Bước 13: Frontend reload**
- **File:** `frontend/src/features/admin/pages/ProductManagement.jsx`
- **Action:** `loadProducts()` → Reload list
- **Result:** ProductTable re-render với sản phẩm mới

---

## CHI TIẾT CÁC TRANG VÀ CHỨC NĂNG

### 1. TRANG CHỦ (HomePage)

**File:** `frontend/src/features/home/pages/HomePage.jsx`

**Chức năng:**
- Hiển thị banner quảng cáo
- Hiển thị sản phẩm nổi bật
- Hiển thị danh mục sản phẩm
- Điều hướng đến các trang khác

**Component con:**
- `FeaturedProducts.jsx` - Hiển thị sản phẩm nổi bật
- `HeroSection.jsx` - Banner quảng cáo
- `CategorySection.jsx` - Danh mục sản phẩm

**Luồng hoạt động:**
```
HomePage mounts → useEffect() → Fetch featured products
→ API: GET /api/products?noiBat=true → Display in grid
→ User clicks product → Navigate to ProductDetailPage
```

---

### 2. TRANG SẢN PHẨM (ProductPage)

**File:** `frontend/src/features/products/pages/ProductPage.jsx`

**Chức năng:**
- Hiển thị danh sách tất cả sản phẩm
- Tìm kiếm sản phẩm
- Lọc theo danh mục, thương hiệu, giá
- Sắp xếp sản phẩm

**Component con:**
- `ProductGrid.jsx` - Grid hiển thị sản phẩm
- `ProductFilters.jsx` - Bộ lọc sản phẩm

**Luồng hoạt động:**
```
ProductPage mounts → Fetch products with filters
→ API: GET /api/products?category=...&price=...&search=...
→ Display in ProductGrid → User applies filter
→ Re-fetch with new filters → Update display
```

---

### 3. TRANG CHI TIẾT SẢN PHẨM (ProductDetailPage)

**File:** `frontend/src/features/products/pages/ProductDetailPage.jsx`

**Chức năng:**
- Hiển thị chi tiết sản phẩm
- Xem hình ảnh sản phẩm
- Thêm vào giỏ hàng
- Thêm vào danh sách yêu thích

**Component con:**
- `ProductInfo.jsx` - Thông tin sản phẩm
- `ProductImages.jsx` - Hình ảnh sản phẩm
- `ProductActions.jsx` - Nút hành động

**Luồng hoạt động:**
```
User navigates to /product/:id → ProductDetailPage mounts
→ API: GET /api/products/:id → Fetch product details
→ Display product info → User clicks "Thêm vào giỏ"
→ useCart() hook → Add to cart → Show toast notification
```

---

### 4. TRANG GIỎ HÀNG (CartPage)

**File:** `frontend/src/features/cart/pages/CartPage.jsx`

**Chức năng:**
- Hiển thị các sản phẩm trong giỏ
- Cập nhật số lượng
- Xóa sản phẩm khỏi giỏ
- Tính tổng tiền
- Điều hướng đến thanh toán

**Component con:**
- `CartItem.jsx` - Item trong giỏ hàng
- `CartSummary.jsx` - Tổng kết giỏ hàng

**Luồng hoạt động:**
```
CartPage mounts → useCart() hook → Fetch cart from API
→ API: GET /api/cart → Display cart items
→ User updates quantity → API: PUT /api/cart/update
→ User removes item → API: DELETE /api/cart/remove/:id
→ User clicks "Thanh toán" → Navigate to CheckoutPage
```

---

### 5. TRANG THANH TOÁN (CheckoutPage)

**File:** `frontend/src/features/order/pages/CheckoutPage.jsx`

**Chức năng:**
- Nhập thông tin giao hàng
- Chọn phương thức thanh toán
- Xem tóm tắt đơn hàng
- Đặt hàng

**Component con:**
- `ShippingForm.jsx` - Form thông tin giao hàng
- `PaymentMethodSelector.jsx` - Chọn phương thức thanh toán
- `OrderSummary.jsx` - Tóm tắt đơn hàng
- `AddressSelectModal.jsx` - Chọn địa chỉ đã lưu

**Luồng hoạt động:**
```
CheckoutPage mounts → Load cart items → Load user addresses
→ User fills shipping info → Selects payment method
→ Click "Đặt hàng" → validateForm() → API: POST /api/orders
→ Backend: Create order → Update stock → Clear cart
→ Navigate to OrderPage → Show confirmation
```

---

### 6. TRANG ĐƠN HÀNG (OrderPage)

**File:** `frontend/src/features/order/pages/OrderPage.jsx`

**Chức năng:**
- Hiển thị danh sách đơn hàng
- Xem chi tiết đơn hàng
- Hủy đơn hàng

**Component con:**
- `OrderList.jsx` - Danh sách đơn hàng
- `OrderDetail.jsx` - Chi tiết đơn hàng

**Luồng hoạt động:**
```
OrderPage mounts → Fetch user orders
→ API: GET /api/orders → Display order list
→ User clicks order → Show order details
→ User cancels order → API: PUT /api/orders/:id/cancel
```

---

### 7. TRANG DANH SÁCH YÊU THÍCH (WishlistPage)

**File:** `frontend/src/features/wishlist/pages/WishlistPage.jsx`

**Chức năng:**
- Hiển thị sản phẩm yêu thích
- Xóa sản phẩm khỏi danh sách
- Thêm sản phẩm vào giỏ hàng

**Component con:**
- `WishlistGrid.jsx` - Grid sản phẩm yêu thích

**Luồng hoạt động:**
```
WishlistPage mounts → Fetch wishlist
→ API: GET /api/wishlist → Display wishlist items
→ User removes item → API: DELETE /api/wishlist/remove/:id
→ User adds to cart → useCart() hook → Add to cart
```

---

### 8. TRANG ĐĂNG NHẬP (LoginPage)

**File:** `frontend/src/features/auth/pages/LoginPage.jsx`

**Chức năng:**
- Đăng nhập với email/password
- Điều hướng đến trang đăng ký
- Lưu token và user info

**Luồng hoạt động:**
```
User enters credentials → Click "Đăng nhập"
→ useAuth() hook → API: POST /api/auth/login
→ Backend: Verify credentials → Generate JWT
→ Return token & user → Redux: Update auth state
→ Save to localStorage → Navigate to home
```

---

### 9. TRANG ĐĂNG KÝ (RegisterPage)

**File:** `frontend/src/features/auth/pages/RegisterPage.jsx`

**Chức năng:**
- Đăng ký tài khoản mới
- Validate form
- Tự động đăng nhập sau khi đăng ký

**Luồng hoạt động:**
```
User fills registration form → Click "Đăng ký"
→ API: POST /api/auth/register → Backend: Create user
→ Hash password → Save to MongoDB → Return user
→ Auto login → Navigate to home
```

---

### 10. TRANG HỒ SƠ (ProfilePage)

**File:** `frontend/src/features/auth/pages/ProfilePage.jsx`

**Chức năng:**
- Xem thông tin cá nhân
- Cập nhật thông tin
- Đổi mật khẩu
- Xem địa chỉ đã lưu

**Luồng hoạt động:**
```
ProfilePage mounts → Load user info
→ API: GET /api/auth/me → Display user info
→ User updates info → API: PUT /api/auth/profile
→ User changes password → API: PUT /api/auth/password
```

---

### 11. TRANG ADMIN DASHBOARD (AdminDashboard)

**File:** `frontend/src/features/admin/pages/AdminDashboard.jsx`

**Chức năng:**
- Hiển thị thống kê tổng quan
- Biểu đồ doanh thu
- Sản phẩm bán chạy
- Đơn hàng gần đây
- Sản phẩm sắp hết hàng

**Component con:**
- `DashboardOverviewCards.jsx` - Thẻ thống kê
- `DashboardCharts.jsx` - Biểu đồ
- `DashboardTopProducts.jsx` - Sản phẩm bán chạy
- `DashboardRecentActivity.jsx` - Hoạt động gần đây
- `DashboardLowStock.jsx` - Sản phẩm sắp hết hàng
- `TimeFilter.jsx` - Bộ lọc thời gian

**Luồng hoạt động:**
```
AdminDashboard mounts → Fetch dashboard stats
→ API: GET /api/admin/dashboard?timeFilter=...
→ Display stats in cards and charts
→ User changes time filter → Re-fetch with new filter
→ Update display
```

---

### 12. TRANG QUẢN LÝ SẢN PHẨM (ProductManagement)

**File:** `frontend/src/features/admin/pages/ProductManagement.jsx`

**Chức năng:**
- Xem danh sách sản phẩm
- Thêm sản phẩm mới
- Sửa sản phẩm
- Xóa sản phẩm
- Bật/tắt bán sản phẩm

**Component con:**
- `ProductTable.jsx` - Bảng sản phẩm
- `ProductModal.jsx` - Modal thêm/sửa sản phẩm
- `ProductForm.jsx` - Form sản phẩm
- `SearchFilter.jsx` - Tìm kiếm/lọc
- `Pagination.jsx` - Phân trang

**Luồng hoạt động:**
```
ProductManagement mounts → Fetch products
→ API: GET /api/products?admin=true → Display in ProductTable
→ User clicks "Thêm sản phẩm" → Open ProductModal
→ Fill form → Submit → API: POST /api/products
→ Backend: Create product → Upload images → Save
→ Reload product list → Display new product
→ User clicks "Dừng bán" → API: PATCH /api/products/:id/status
→ Update product status → Reload list
```

---

### 13. TRANG QUẢN LÝ DANH MỤC (CategoryManagement)

**File:** `frontend/src/features/admin/pages/CategoryManagement.jsx`

**Chức năng:**
- Xem danh sách danh mục
- Thêm danh mục mới
- Sửa danh mục
- Xóa danh mục

**Component con:**
- `CategoryTable.jsx` - Bảng danh mục
- `CategoryModal.jsx` - Modal thêm/sửa danh mục
- `CategoryForm.jsx` - Form danh mục

**Luồng hoạt động:**
```
CategoryManagement mounts → Fetch categories
→ API: GET /api/categories → Display in CategoryTable
→ User adds category → API: POST /api/categories
→ Backend: Create category → Save to MongoDB
→ Reload category list
```

---

### 14. TRANG QUẢN LÝ ĐƠN HÀNG (OrderManagement)

**File:** `frontend/src/features/admin/pages/OrderManagement.jsx`

**Chức năng:**
- Xem danh sách đơn hàng
- Xem chi tiết đơn hàng
- Cập nhật trạng thái đơn hàng
- Tìm kiếm/lọc đơn hàng

**Component con:**
- `OrderTable.jsx` - Bảng đơn hàng
- `OrderDetailModal.jsx` - Modal chi tiết đơn hàng
- `SearchFilter.jsx` - Tìm kiếm/lọc
- `TimeFilter.jsx` - Bộ lọc thời gian

**Luồng hoạt động:**
```
OrderManagement mounts → Fetch orders
→ API: GET /api/orders/admin → Display in OrderTable
→ User clicks order → Open OrderDetailModal
→ User updates status → API: PUT /api/orders/:id
→ Backend: Update order status → Save
→ Reload order list
```

---

### 15. TRANG QUẢN LÝ NGƯỜI DÙNG (UserManagement)

**File:** `frontend/src/features/admin/pages/UserManagement.jsx`

**Chức năng:**
- Xem danh sách người dùng
- Sửa thông tin người dùng
- Xóa người dùng
- Tìm kiếm người dùng

**Component con:**
- `UserTable.jsx` - Bảng người dùng
- `UserModal.jsx` - Modal sửa người dùng
- `UserForm.jsx` - Form người dùng
- `SearchFilter.jsx` - Tìm kiếm

**Luồng hoạt động:**
```
UserManagement mounts → Fetch users
→ API: GET /api/users/admin → Display in UserTable
→ User edits user → API: PUT /api/users/:id
→ Backend: Update user → Save
→ Reload user list
```

---

### 16. TRANG QUẢN LÝ BỘ SƯU TẬP (CollectionsManagement)

**File:** `frontend/src/features/admin/pages/CollectionsManagement.jsx`

**Chức năng:**
- Xem danh sách bộ sưu tập
- Thêm bộ sưu tập mới
- Sửa bộ sưu tập
- Xóa bộ sưu tập
- Thêm/xóa sản phẩm vào bộ sưu tập

**Component con:**
- `CollectionTable.jsx` - Bảng bộ sưu tập
- `CollectionModal.jsx` - Modal thêm/sửa bộ sưu tập
- `CollectionForm.jsx` - Form bộ sưu tập

**Luồng hoạt động:**
```
CollectionsManagement mounts → Fetch collections
→ API: GET /api/collections → Display in CollectionTable
→ User adds collection → API: POST /api/collections
→ Backend: Create collection → Save
→ Reload collection list
```

---

### 17. TRANG QUẢN LÝ WISHLIST (WishlistManagement)

**File:** `frontend/src/features/admin/pages/WishlistManagement.jsx`

**Chức năng:**
- Xem danh sách yêu thích của khách hàng
- Xóa mục yêu thích
- Tìm kiếm/lọc

**Component con:**
- `WishlistTable.jsx` - Bảng wishlist
- `SearchFilter.jsx` - Tìm kiếm/lọc

**Luồng hoạt động:**
```
WishlistManagement mounts → Fetch all wishlists
→ API: GET /api/wishlist/all → Display in WishlistTable
→ User removes item → API: DELETE /api/wishlist/admin/:id
→ Backend: Remove from wishlist → Save
→ Reload wishlist list
```

---

### 18. TRANG CÀI ĐẶT (Settings)

**File:** `frontend/src/features/admin/pages/Settings.jsx`

**Chức năng:**
- Cấu hình thông tin website
- Cài đặt thông báo
- Chính sách bảo mật
- Điều khoản sử dụng

**Luồng hoạt động:**
```
Settings mounts → Fetch settings
→ API: GET /api/settings → Display in form
→ User updates settings → API: PUT /api/settings
→ Backend: Update settings → Save
→ Show success toast
```

---

## BACKEND API

### Authentication Routes
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `GET /api/auth/me` - Lấy thông tin user hiện tại
- `PUT /api/auth/profile` - Cập nhật profile
- `PUT /api/auth/password` - Đổi mật khẩu

### Product Routes
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm (admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (admin)
- `PATCH /api/products/:id/status` - Cập nhật trạng thái (admin)

### Category Routes
- `GET /api/categories` - Lấy danh sách danh mục
- `GET /api/categories/:id` - Lấy chi tiết danh mục
- `POST /api/categories` - Tạo danh mục (admin)
- `PUT /api/categories/:id` - Cập nhật danh mục (admin)
- `DELETE /api/categories/:id` - Xóa danh mục (admin)

### Cart Routes
- `GET /api/cart` - Lấy giỏ hàng
- `POST /api/cart/add` - Thêm vào giỏ hàng
- `PUT /api/cart/update` - Cập nhật giỏ hàng
- `DELETE /api/cart/remove/:id` - Xóa khỏi giỏ hàng
- `DELETE /api/cart/clear` - Xóa toàn bộ giỏ hàng

### Order Routes
- `GET /api/orders` - Lấy đơn hàng của user
- `GET /api/orders/:id` - Lấy chi tiết đơn hàng
- `POST /api/orders` - Tạo đơn hàng
- `PUT /api/orders/:id` - Cập nhật đơn hàng (admin)
- `PUT /api/orders/:id/cancel` - Hủy đơn hàng
- `GET /api/orders/admin` - Lấy tất cả đơn hàng (admin)

### Wishlist Routes
- `GET /api/wishlist` - Lấy wishlist
- `POST /api/wishlist/add` - Thêm vào wishlist
- `DELETE /api/wishlist/remove/:id` - Xóa khỏi wishlist
- `DELETE /api/wishlist/clear` - Xóa toàn bộ wishlist
- `GET /api/wishlist/all` - Lấy tất cả wishlist (admin)
- `DELETE /api/wishlist/admin/:id` - Xóa wishlist item (admin)

### User Routes
- `GET /api/users` - Lấy thông tin user
- `PUT /api/users/:id` - Cập nhật user
- `GET /api/users/admin` - Lấy tất cả users (admin)
- `DELETE /api/users/:id` - Xóa user (admin)

### Collection Routes
- `GET /api/collections` - Lấy danh sách bộ sưu tập
- `GET /api/collections/:id` - Lấy chi tiết bộ sưu tập
- `POST /api/collections` - Tạo bộ sưu tập (admin)
- `PUT /api/collections/:id` - Cập nhật bộ sưu tập (admin)
- `DELETE /api/collections/:id` - Xóa bộ sưu tập (admin)

### Address Routes
- `GET /api/addresses` - Lấy địa chỉ
- `POST /api/addresses` - Thêm địa chỉ
- `PUT /api/addresses/:id` - Cập nhật địa chỉ
- `DELETE /api/addresses/:id` - Xóa địa chỉ
- `PUT /api/addresses/:id/default` - Đặt làm mặc định

### Admin Routes
- `GET /api/admin/dashboard` - Lấy thống kê dashboard
- `GET /api/admin/stats` - Lấy thống kê chi tiết

---

## DATABASE SCHEMA

### User (NguoiDung)
```javascript
{
  tenNguoiDung: String,
  email: String (unique),
  matKhau: String (hashed),
  soDienThoai: String,
  diaChi: String,
  role: Number (0: user, 1: admin),
  ngayTao: Date,
  ngayCapNhat: Date
}
```

### Product (SanPham)
```javascript
{
  tenSanPham: String,
  gia: Number,
  soLuongTon: Number,
  danhMucId: ObjectId (ref: DanhMuc),
  thuongHieuId: ObjectId (ref: ThuongHieu),
  boSuuTapIds: [ObjectId] (ref: BoSuuTap),
  moTa: String,
  hinhAnh: [Object],
  trangThai: Boolean,
  noiBat: Boolean,
  ngayTao: Date,
  ngayCapNhat: Date
}
```

### Category (DanhMuc)
```javascript
{
  tenDanhMuc: String,
  moTa: String,
  hinhAnh: String,
  ngayTao: Date,
  ngayCapNhat: Date
}
```

### Brand (ThuongHieu)
```javascript
{
  tenThuongHieu: String,
  moTa: String,
  logo: String,
  ngayTao: Date,
  ngayCapNhat: Date
}
```

### Collection (BoSuuTap)
```javascript
{
  tenBoSuuTap: String,
  moTa: String,
  hinhAnh: String,
  sanPhamIds: [ObjectId] (ref: SanPham),
  ngayTao: Date,
  ngayCapNhat: Date
}
```

### Order (DonHang)
```javascript
{
  nguoiDungId: ObjectId (ref: NguoiDung),
  chiTietDonHang: [{
    sanPhamId: ObjectId (ref: SanPham),
    soLuong: Number,
    gia: Number
  }],
  tongTien: Number,
  diaChiGiaoHang: String,
  ghiChu: String,
  phiVanChuyen: Number,
  phuongThucThanhToan: String,
  trangThai: Number (0: pending, 1: confirmed, 2: shipping, 3: completed, 4: cancelled),
  ngayTao: Date,
  ngayCapNhat: Date
}
```

### Cart (GioHang)
```javascript
{
  nguoiDungId: ObjectId (ref: NguoiDung),
  danhSachSanPham: [{
    sanPhamId: ObjectId (ref: SanPham),
    soLuong: Number,
    gia: Number
  }],
  ngayTao: Date,
  ngayCapNhat: Date
}
```

### Wishlist (YeuThich)
```javascript
{
  nguoiDungId: ObjectId (ref: NguoiDung),
  danhSachSanPham: [{
    sanPhamId: ObjectId (ref: SanPham),
    ngayThem: Date
  }],
  ngayTao: Date,
  ngayCapNhat: Date
}
```

### Address (DiaChi)
```javascript
{
  nguoiDungId: ObjectId (ref: NguoiDung),
  tenNguoiNhan: String,
  soDienThoai: String,
  tinhThanh: String,
  quanHuyen: String,
  phuongXa: String,
  diaChiCuThe: String,
  macDinh: Boolean,
  ngayTao: Date,
  ngayCapNhat: Date
}
```

---

## CÁCH CHẠY DỰ ÁN

### 1. Cài đặt dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Cấu hình Environment Variables

**Backend (.env):**
```
MONGODB_CONNECTIONSTRING=mongodb://localhost:27017/havyStore
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=havyStore
```

### 3. Chạy MongoDB

Đảm bảo MongoDB đang chạy trên port 27017.

### 4. Chạy Backend

```bash
cd backend
npm start
```

Backend sẽ chạy trên http://localhost:5000

### 5. Chạy Frontend

```bash
cd frontend
npm start
```

Frontend sẽ chạy trên http://localhost:3000

### 6. Truy cập ứng dụng

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **API Documentation:** http://localhost:5000

---

## TÀI KHOẢN TEST

### Admin Account
- Email: admin@admin.com
- Password: 123456
- Role: Admin

### User Account
- Email: user@example.com
- Password: user123
- Role: User

---

## LƯU Ý QUAN TRỌNG

1. **Authentication:** Tất cả API routes bảo vệ cần JWT token trong header: `Authorization: Bearer <token>`

2. **Admin Routes:** Các route admin cần cả authentication và authorization (role = 1)

3. **Image Upload:** Hình ảnh sản phẩm được upload lên server và lưu đường dẫn trong database

4. **Stock Management:** Khi đặt hàng, số lượng tồn kho sẽ tự động giảm

5. **Order Status:** Admin có thể cập nhật trạng thái đơn hàng từ pending → confirmed → shipping → completed

6. **Pagination:** Các API list đều hỗ trợ pagination với `page` và `limit` parameters

---

## KẾT LUẬN

Dự án havyStore là một website thương mại điện tử hoàn chỉnh với đầy đủ tính năng cho cả khách hàng và quản trị viên. Dự án sử dụng kiến trúc MERN (MongoDB, Express, React, Node.js) với separation of concerns rõ ràng, dễ dàng mở rộng và bảo trì.

**Tác giả:** DanielPu03
**Ngày hoàn thành:** 2026
