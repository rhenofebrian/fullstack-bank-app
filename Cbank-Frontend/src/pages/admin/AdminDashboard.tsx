import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUsers, FiDollarSign, FiCreditCard } from "react-icons/fi";
import { adminService } from "../../services/adminApi";
import { useToast } from "../../components/toast";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBalance: 0,
    totalTransactions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch users
        const usersResponse = await adminService.getAllUsers();

        // Fetch transactions
        const transactionsResponse = await adminService.getTransactions();

        // Calculate total balance from all users
        const totalBalance = usersResponse.users.reduce(
          (sum: number, user: any) => sum + (user.balance || 0),
          0
        );

        setStats({
          totalUsers: usersResponse.users.length,
          totalBalance,
          totalTransactions: transactionsResponse.transactions.length,
        });
      } catch (error) {
        console.error("Error fetching admin data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Remove the automatic polling to prevent rate limiting
    // We'll rely on manual refresh instead
  }, [navigate, toast]);

  const handleLogout = () => {
    adminService.logout();
    navigate("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader onLogout={handleLogout} />

        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto"
          >
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Overview of all users and transactions
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-4">
                      <FiUsers className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total Users
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.totalUsers}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 hover:bg-green-50 dark:hover:bg-green-900/20">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-4">
                      <FiDollarSign className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total Balance
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(stats.totalBalance)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mr-4">
                      <FiCreditCard className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total Transactions
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.totalTransactions}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate("/admin/users")}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-left"
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    Manage Users
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    View all users, add balance, and manage accounts
                  </p>
                </button>
                <button
                  onClick={() => navigate("/admin/transactions")}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-left"
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    View Transactions
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Monitor all transactions across the platform
                  </p>
                </button>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
