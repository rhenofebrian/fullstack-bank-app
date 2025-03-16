import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUsers, FiDollarSign } from "react-icons/fi";
import { AdminSidebar } from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { StatCard } from "../../components/dashboard/StatCard";
import { authService } from "../../services/api";

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Check if admin is logged in
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    // Fetch admin data from backend
    const fetchAdminData = async () => {
      try {
        // This would be replaced with your actual admin auth service
        const response = await authService.getCurrentUser(); // Replace with admin-specific endpoint
        setAdmin(response.user);
      } catch (error) {
        console.error("Authentication error:", error);
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

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
        <AdminHeader admin={admin} />

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
                Welcome to the admin control panel.
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <StatCard
                  title="Total Users"
                  value="1,248"
                  change="+12.5%"
                  isPositive={true}
                  icon={<FiUsers />}
                  className="hover:shadow-lg transition-shadow duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <StatCard
                  title="Total Transactions"
                  value="Rp 8.453.670.000"
                  change="+8.2%"
                  isPositive={true}
                  icon={<FiDollarSign />}
                  className="hover:shadow-lg transition-shadow duration-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                />
              </motion.div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Recent Activity
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center">
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                            <FiUsers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              New user registered
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              User ID: #USR{1000 + item}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {item} hour{item !== 1 ? "s" : ""} ago
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
