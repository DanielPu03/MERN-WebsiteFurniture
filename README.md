
## Frontend: https://mern-website-furniture.vercel.app/

## Backend API: https://mern-websitefurniture.onrender.com/




## Tài khoản test admin:
- Email: admin@admin.com
- Password: 123456

## Công nghệ sử dụng
- Frontend: React.js, Redux Toolkit, React Router, Tailwind CSS, Lucide React
- Backend: Node.js, Express.js, RESTful API, JWT Authentication
- Database: MongoDB, Mongoose
- Payment: VNPAY Integration

## Tính năng chính
 User Features
- Đăng ký/Đăng nhập với JWT Authentication
- Xem và tìm kiếm sản phẩm
- Quản lý giỏ hàng
- Đặt hàng và thanh toán online (VNPAY)
- Quản lý đơn hàng
- Wishlist (Danh sách yêu thích)
- Bộ sưu tập sản phẩm (Collections)
- Quản lý địa chỉ giao hàng
- Quản lý thông tin cá nhân

Admin Features
- Dashboard với thống kê doanh thu, đơn hàng, người dùng
- Quản lý sản phẩm (CRUD, upload ảnh, trạng thái)
- Quản lý danh mục
- Quản lý bộ sưu tập
- Quản lý đơn hàng (thay đổi trạng thái)
- Quản lý người dùng
- Quản lý wishlist của người dùng
- Cảnh báo sản phẩm sắp hết hàng

Security
- JWT token-based authentication
- Password hashing với bcryptjs
- Role-based access control (User/Admin)
- CORS configuration
- Rate limiting
- Helmet security headers

## Backend Setup (.env)

cd backend
npm install
cp .env.example   .env
npm run dev


## Frontend Setup

cd frontend
npm install
cp .env.example   .env
npm start


#  Tính năng nổi bật
1. Authentication System: JWT với refresh tokens, role-based access control
2. Shopping Cart: Thêm/xóa/sửa giỏ hàng, tính toán tổng tiền
3. Order Management: Đặt hàng, thanh toán COD/VNPAY, tracking trạng thái
4. Collection System: Many-to-many relationship với products
5. Admin Dashboard: Real-time analytics, low stock warnings
6. Image Upload: Multer middleware cho backend
7. Search & Filter: Tìm kiếm sản phẩm theo tên, danh mục, bộ sưu tập
8. Responsive Design: Tailwind CSS cho mobile-first design
