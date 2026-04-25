const SanPham = require('../models/SanPham');
const User = require('../models/User');
const DonHang = require('../models/DonHang');
const Wishlist = require('../models/Wishlist');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const { period = 'all' } = req.query;
    
    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date('2000-01-01'); // Default to very old date
    let filterDate = null;
    
    if (period === 'today') {
      startDate = new Date(now.setHours(0, 0, 0, 0));
      filterDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (period === '7days') {
      startDate = new Date(now.setDate(now.getDate() - 7));
      filterDate = new Date(now.setDate(now.getDate() - 7));
    } else if (period === '30days') {
      startDate = new Date(now.setDate(now.getDate() - 30));
      filterDate = new Date(now.setDate(now.getDate() - 30));
    }

    // Build date filter for orders
    const dateFilter = filterDate ? { ngayTao: { $gte: filterDate } } : {};

    // Overview statistics
    const totalProducts = await SanPham.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await DonHang.countDocuments(dateFilter);
    
    // Calculate total revenue
    const orders = await DonHang.find({ 
      tinhTrang: { $in: [2, 3] },
      ...dateFilter
    }); // Completed and delivered
    const totalRevenue = orders.reduce((sum, order) => sum + order.tongTien, 0);

    // Order statistics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const ordersToday = await DonHang.countDocuments({
      ngayTao: { $gte: today }
    });
    
    const ordersProcessing = await DonHang.countDocuments({ 
      tinhTrang: 1,
      ...dateFilter
    });
    const ordersCompleted = await DonHang.countDocuments({ 
      tinhTrang: 2,
      ...dateFilter
    });
    const ordersCancelled = await DonHang.countDocuments({ 
      tinhTrang: 4,
      ...dateFilter
    });

    // Top selling products
    const topSellingProducts = await DonHang.aggregate([
      { $match: dateFilter },
      { $unwind: '$chiTietDonHang' },
      {
        $group: {
          _id: '$chiTietDonHang.sanPhamId',
          totalSold: { $sum: '$chiTietDonHang.soLuong' },
          totalRevenue: { $sum: { $multiply: ['$chiTietDonHang.gia', '$chiTietDonHang.soLuong'] } }
        }
      },
      {
        $lookup: {
          from: 'sanphams',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 1,
          tenSanPham: '$product.tenSanPham',
          hinhAnh: '$product.hinhAnh',
          gia: '$product.gia',
          totalSold: 1,
          totalRevenue: 1
        }
      }
    ]);

    // Top wishlist products
    const topWishlistProducts = await Wishlist.aggregate([
      { $unwind: '$danhSachSanPham' },
      {
        $group: {
          _id: '$danhSachSanPham.sanPhamId',
          wishlistCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'sanphams',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      { $sort: { wishlistCount: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 1,
          tenSanPham: '$product.tenSanPham',
          hinhAnh: '$product.hinhAnh',
          gia: '$product.gia',
          wishlistCount: 1
        }
      }
    ]);

    // Revenue chart data (last 7 days)
    const revenueChartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayOrders = await DonHang.find({
        ngayTao: { $gte: date, $lt: nextDate },
        tinhTrang: { $in: [2, 3] }
      });
      
      const dayRevenue = dayOrders.reduce((sum, order) => sum + order.tongTien, 0);
      
      revenueChartData.push({
        date: date.toISOString().split('T')[0],
        revenue: dayRevenue
      });
    }

    // Orders chart data (last 7 days)
    const ordersChartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayOrdersCount = await DonHang.countDocuments({
        ngayTao: { $gte: date, $lt: nextDate }
      });
      
      ordersChartData.push({
        date: date.toISOString().split('T')[0],
        orders: dayOrdersCount
      });
    }

    // Recent orders
    const recentOrders = await DonHang.find(dateFilter)
      .populate('nguoiDungId', 'hoTen email')
      .sort({ ngayTao: -1 })
      .limit(5);

    // Recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Low stock products (less than 10)
    const lowStockProducts = await SanPham.find({ soLuongTon: { $lt: 10 } })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalProducts,
          totalUsers,
          totalOrders,
          totalRevenue
        },
        orderStats: {
          today: ordersToday,
          processing: ordersProcessing,
          completed: ordersCompleted,
          cancelled: ordersCancelled
        },
        topSellingProducts,
        topWishlistProducts,
        revenueChartData,
        ordersChartData,
        recentOrders,
        recentUsers,
        lowStockProducts
      }
    });
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getDashboardStats
};
