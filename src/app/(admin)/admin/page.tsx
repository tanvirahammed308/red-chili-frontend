// app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCurrentUser } from "@/redux/features/auth/auth.slice";
import type { IUser, IUpdateRoleData } from "@/redux/features/auth/auth.types";
import Swal from "sweetalert2";
import api from "@/lib/axios";

// React Icons
import { 
  FaUsers, 
  FaShoppingCart, 
  FaRupeeSign, 
  FaBox, 
  FaUserPlus,
  FaUserCheck,
  FaSpinner,
  FaEye,
  FaEdit,
  FaTrash,
  FaSearch,
  FaChartLine,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaWallet
} from "react-icons/fa";

// Local types using your existing IUser
interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "preparing" | "out-for-delivery" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
}

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  newUsersThisMonth: number;
  avgOrderValue: number;
}

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  
  // ✅ Admin only access using your hook
  const { user, loading: authLoading } = useAuthGuard(true);
  const { users: reduxUsers, totalCount } = useAppSelector((state) => state.auth);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "orders">("dashboard");
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    newUsersThisMonth: 0,
    avgOrderValue: 0
  });
  
  const [users, setUsers] = useState<IUser[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [updatingOrderStatus, setUpdatingOrderStatus] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch users using your existing API
        const usersResponse = await api.get("/auth");
        const usersList: IUser[] = usersResponse.data.users || [];
        setUsers(usersList);
        
        // Fetch orders
        try {
          const ordersResponse = await api.get("/orders/admin");
          const ordersList = ordersResponse.data.orders || [];
          setOrders(ordersList);
          
          // Calculate stats
          const totalUsers = usersList.length;
          const totalOrders = ordersList.length;
          const totalRevenue = ordersList.reduce((sum, order) => sum + order.totalAmount, 0);
          const pendingOrders = ordersList.filter(o => o.status === "pending").length;
          const deliveredOrders = ordersList.filter(o => o.status === "delivered").length;
          const cancelledOrders = ordersList.filter(o => o.status === "cancelled").length;
          const currentMonth = new Date().getMonth();
          const newUsersThisMonth = usersList.filter(u => new Date(u.createdAt).getMonth() === currentMonth).length;
          const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
          
          setStats({
            totalUsers,
            totalOrders,
            totalRevenue,
            pendingOrders,
            deliveredOrders,
            cancelledOrders,
            newUsersThisMonth,
            avgOrderValue
          });
          
        } catch (error) {
          console.error("Failed to fetch orders:", error);
          setOrders(getDemoOrders());
        }
        
      } catch (error: any) {
        console.error("Failed to fetch dashboard data:", error);
        // Use demo data if API not ready
        setUsers(getDemoUsers());
        setOrders(getDemoOrders());
        setStats({
          totalUsers: 145,
          totalOrders: 234,
          totalRevenue: 45678,
          pendingOrders: 12,
          deliveredOrders: 198,
          cancelledOrders: 24,
          newUsersThisMonth: 18,
          avgOrderValue: 195
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);

  // Update user role using your IUpdateRoleData type
  const handleUpdateRole = async (userId: string, newRole: "user" | "admin") => {
    setIsUpdatingRole(true);
    
    try {
      const updateData: IUpdateRoleData = { id: userId, role: newRole };
      const response = await api.put(`/auth/${userId}/role`, updateData);
      
      if (response.data.user) {
        // Update local users list
        setUsers(prev => prev.map(u => 
          u._id === userId ? { ...u, role: newRole } : u
        ));
        
        // Update Redux store if current user is updated
        if (user?._id === userId) {
          dispatch(setCurrentUser(response.data.user));
        }
        
        Swal.fire({
          icon: "success",
          title: "Role Updated",
          text: `User role changed to ${newRole}`,
          timer: 1500,
          showConfirmButton: false
        });
        
        setSelectedUser(null);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not update user role",
        confirmButtonColor: "#d33"
      });
    } finally {
      setIsUpdatingRole(false);
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    setUpdatingOrderStatus(orderId);
    
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      
      if (response.data.order) {
        setOrders(prev => prev.map(o => 
          o._id === orderId ? { ...o, status: newStatus } : o
        ));
        
        // Update stats
        const updatedOrders = orders.map(o => 
          o._id === orderId ? { ...o, status: newStatus } : o
        );
        
        const pendingOrders = updatedOrders.filter(o => o.status === "pending").length;
        const deliveredOrders = updatedOrders.filter(o => o.status === "delivered").length;
        
        setStats(prev => ({
          ...prev,
          pendingOrders,
          deliveredOrders
        }));
        
        Swal.fire({
          icon: "success",
          title: "Status Updated",
          text: `Order status changed to ${newStatus}`,
          timer: 1500,
          showConfirmButton: false
        });
        
        setSelectedOrder(null);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not update order status",
        confirmButtonColor: "#d33"
      });
    } finally {
      setUpdatingOrderStatus(null);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: string, userName: string) => {
    const result = await Swal.fire({
      title: "Delete User?",
      text: `Are you sure you want to delete ${userName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel"
    });
    
    if (result.isConfirmed) {
      try {
        await api.delete(`/auth/${userId}`);
        
        setUsers(prev => prev.filter(u => u._id !== userId));
        setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
        setSelectedUser(null);
        
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "User has been deleted",
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Could not delete user",
          confirmButtonColor: "#d33"
        });
      }
    }
  };

  // Filter users by search
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get status badge color
  const getStatusBadge = (status: Order["status"]) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: FaClock, text: "Pending" },
      confirmed: { color: "bg-blue-100 text-blue-800", icon: FaCheckCircle, text: "Confirmed" },
      preparing: { color: "bg-purple-100 text-purple-800", icon: FaSpinner, text: "Preparing" },
      "out-for-delivery": { color: "bg-orange-100 text-orange-800", icon: FaTruck, text: "Out for Delivery" },
      delivered: { color: "bg-green-100 text-green-800", icon: FaCheckCircle, text: "Delivered" },
      cancelled: { color: "bg-red-100 text-red-800", icon: FaBox, text: "Cancelled" }
    };
    
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="text-xs" />
        {config.text}
      </span>
    );
  };

  // Get role badge
  const getRoleBadge = (role: "user" | "admin") => {
    return role === "admin" 
      ? "bg-purple-100 text-purple-700" 
      : "bg-blue-100 text-blue-700";
  };

  // Demo data (remove when API is ready)
  const getDemoUsers = (): IUser[] => {
    return [
      { _id: "1", name: "John Doe", email: "john@example.com", firebaseUID: "firebase1", role: "user", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { _id: "2", name: "Jane Smith", email: "jane@example.com", firebaseUID: "firebase2", role: "user", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { _id: "3", name: "Admin User", email: "admin@example.com", firebaseUID: "firebase3", role: "admin", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { _id: "4", name: "Mike Johnson", email: "mike@example.com", firebaseUID: "firebase4", role: "user", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { _id: "5", name: "Sarah Williams", email: "sarah@example.com", firebaseUID: "firebase5", role: "user", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ];
  };

  const getDemoOrders = (): Order[] => {
    return [
      { _id: "1", orderNumber: "ORD-001", userId: "1", userName: "John Doe", totalAmount: 599, status: "delivered", paymentStatus: "paid", createdAt: new Date().toISOString() },
      { _id: "2", orderNumber: "ORD-002", userId: "2", userName: "Jane Smith", totalAmount: 899, status: "pending", paymentStatus: "pending", createdAt: new Date().toISOString() },
      { _id: "3", orderNumber: "ORD-003", userId: "1", userName: "John Doe", totalAmount: 349, status: "out-for-delivery", paymentStatus: "paid", createdAt: new Date().toISOString() },
      { _id: "4", orderNumber: "ORD-004", userId: "4", userName: "Mike Johnson", totalAmount: 1299, status: "confirmed", paymentStatus: "paid", createdAt: new Date().toISOString() },
      { _id: "5", orderNumber: "ORD-005", userId: "5", userName: "Sarah Williams", totalAmount: 449, status: "preparing", paymentStatus: "paid", createdAt: new Date().toISOString() }
    ];
  };

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If not admin, don't render (hook will redirect)
  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user.name}</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 bg-white rounded-t-lg px-4">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === "dashboard" 
                ? "text-blue-600 border-b-2 border-blue-600" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FaChartLine className="inline mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === "users" 
                ? "text-blue-600 border-b-2 border-blue-600" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FaUsers className="inline mr-2" />
            Users ({stats.totalUsers})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === "orders" 
                ? "text-blue-600 border-b-2 border-blue-600" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FaShoppingCart className="inline mr-2" />
            Orders ({stats.totalOrders})
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Users</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                  </div>
                  <FaUsers className="text-4xl text-blue-100" />
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <FaUserPlus className="text-green-500" />
                  <span className="text-green-600">+{stats.newUsersThisMonth} this month</span>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Orders</p>
                    <p className="text-3xl font-bold text-green-600">{stats.totalOrders}</p>
                  </div>
                  <FaShoppingCart className="text-4xl text-green-100" />
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm flex-wrap">
                  <FaClock className="text-yellow-500" />
                  <span className="text-yellow-600">{stats.pendingOrders} pending</span>
                  <span className="mx-1">•</span>
                  <FaTruck className="text-orange-500" />
                  <span className="text-orange-600">{stats.totalOrders - stats.pendingOrders - stats.deliveredOrders - stats.cancelledOrders} active</span>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold text-purple-600">₹{stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <FaRupeeSign className="text-4xl text-purple-100" />
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <FaWallet className="text-purple-500" />
                  <span className="text-purple-600">Avg order: ₹{stats.avgOrderValue.toFixed(0)}</span>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Completed</p>
                    <p className="text-3xl font-bold text-green-600">{stats.deliveredOrders}</p>
                  </div>
                  <FaCheckCircle className="text-4xl text-green-100" />
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <FaBox className="text-red-500" />
                  <span className="text-red-600">{stats.cancelledOrders} cancelled</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaUserCheck className="text-blue-600" />
                  Recent Users
                </h2>
                <div className="space-y-3">
                  {users.slice(0, 5).map(user => (
                    <div key={user._id} className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">{user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                  ))}
                  {users.length > 5 && (
                    <button
                      onClick={() => setActiveTab("users")}
                      className="text-blue-600 text-sm hover:underline mt-2"
                    >
                      View all {users.length} users →
                    </button>
                  )}
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaShoppingCart className="text-green-600" />
                  Recent Orders
                </h2>
                <div className="space-y-3">
                  {orders.slice(0, 5).map(order => (
                    <div key={order._id} className="flex items-center justify-between py-2 border-b">
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">{order.userName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{order.totalAmount}</p>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  ))}
                  {orders.length > 5 && (
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="text-blue-600 text-sm hover:underline mt-2"
                    >
                      View all {orders.length} orders →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex flex-wrap justify-between items-center gap-3">
              <div className="flex items-center gap-2">
                <FaSearch className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              <div className="text-sm text-gray-500">
                Total: {filteredUsers.length} users
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium">{user.name.charAt(0)}</span>
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleUpdateRole(user._id, user.role === "admin" ? "user" : "admin")}
                            className="text-green-600 hover:text-green-800"
                            disabled={isUpdatingRole}
                            title="Change Role"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id, user.name)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete User"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="font-semibold">All Orders ({orders.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{order.orderNumber}</td>
                      <td className="px-6 py-4">{order.userName}</td>
                      <td className="px-6 py-4 font-semibold">₹{order.totalAmount}</td>
                      <td className="px-6 py-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.paymentStatus === "paid" ? "bg-green-100 text-green-700" :
                          order.paymentStatus === "pending" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedUser(null)}>
          <div className="bg-white rounded-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white rounded-t-xl">
              <h2 className="text-xl font-bold">User Details</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-2xl font-medium">{selectedUser.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <p className="text-gray-500">{selectedUser.email}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Role</p>
                <span className={`inline-block px-2 py-1 rounded-full text-sm ${getRoleBadge(selectedUser.role)}`}>
                  {selectedUser.role === "admin" ? "Administrator" : "Regular User"}
                </span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Member Since</p>
                <p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">User ID</p>
                <p className="text-sm font-mono">{selectedUser._id}</p>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end gap-3">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleUpdateRole(selectedUser._id, selectedUser.role === "admin" ? "user" : "admin");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Change Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4 text-white rounded-t-xl sticky top-0">
              <h2 className="text-xl font-bold">Order Details</h2>
              <p className="text-green-100">Order #{selectedOrder.orderNumber}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Customer</p>
                  <p className="font-medium">{selectedOrder.userName}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Amount</p>
                  <p className="font-bold text-xl text-blue-600">₹{selectedOrder.totalAmount}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Status</p>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Payment Status</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    selectedOrder.paymentStatus === "paid" ? "bg-green-100 text-green-700" :
                    selectedOrder.paymentStatus === "pending" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Order Date</p>
                <p>{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              
              {/* Update Status Section */}
              <div className="border-t pt-4">
                <p className="text-gray-500 text-sm mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {["pending", "confirmed", "preparing", "out-for-delivery", "delivered", "cancelled"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdateOrderStatus(selectedOrder._id, status as Order["status"])}
                      disabled={updatingOrderStatus === selectedOrder._id}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                        selectedOrder.status === status
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}