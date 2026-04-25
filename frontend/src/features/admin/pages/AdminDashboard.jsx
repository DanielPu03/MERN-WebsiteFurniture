import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useRedux';
import toast from 'react-hot-toast';
import DashboardOverviewCards from '../components/DashboardOverviewCards';
import DashboardOrderStats from '../components/DashboardOrderStats';
import DashboardCharts from '../components/DashboardCharts';
import DashboardTopProducts from '../components/DashboardTopProducts';
import DashboardRecentActivity from '../components/DashboardRecentActivity';
import DashboardLowStock from '../components/DashboardLowStock';
import TimeFilter from '../../../shared/components/TimeFilter';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');
  const [stats, setStats] = useState({
    overview: { totalProducts: 0, totalUsers: 0, totalOrders: 0, totalRevenue: 0 },
    orderStats: { today: 0, processing: 0, completed: 0, cancelled: 0 },
    topSellingProducts: [],
    topWishlistProducts: [],
    revenueChartData: [],
    ordersChartData: [],
    recentOrders: [],
    recentUsers: [],
    lowStockProducts: []
  });

  useEffect(() => {
    loadDashboardStats();
  }, [timeFilter]);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/admin/dashboard/stats?period=${timeFilter}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      } else {
        toast.error(data.message || 'Lỗi khi tải thống kê!');
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      toast.error('Lỗi khi tải thống kê!');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const timeFilterOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'today', label: 'Hôm nay' },
    { value: '7days', label: '7 ngày' },
    { value: '30days', label: '30 ngày' }
  ];

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Chào mừng quay trở lại, {user?.hoTen}!</p>
        </div>
        <div className="flex gap-2">
          <TimeFilter
            value={timeFilter}
            onChange={setTimeFilter}
            options={timeFilterOptions}
          />
        </div>
      </div>

      {/* Overview Statistics Cards */}
      <DashboardOverviewCards stats={stats.overview} onNavigate={navigate} />

      {/* Order Statistics */}
      <DashboardOrderStats stats={stats.orderStats} />

      {/* Charts Section */}
      <DashboardCharts revenueChartData={stats.revenueChartData} ordersChartData={stats.ordersChartData} />

      {/* Top Products Section */}
      <DashboardTopProducts 
        topSellingProducts={stats.topSellingProducts} 
        topWishlistProducts={stats.topWishlistProducts} 
        onNavigate={navigate} 
      />

      {/* Recent Activity */}
      <DashboardRecentActivity 
        recentOrders={stats.recentOrders} 
        recentUsers={stats.recentUsers} 
        onNavigate={navigate} 
      />

      {/* Low Stock Warning */}
      <DashboardLowStock lowStockProducts={stats.lowStockProducts} />
    </div>
  );
};

export default AdminDashboard;
