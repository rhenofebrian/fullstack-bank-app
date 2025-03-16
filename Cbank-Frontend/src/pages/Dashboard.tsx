import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiDollarSign, FiArrowUp, FiArrowDown } from "react-icons/fi";
import { DashboardSidebar } from "./dashboard/DashboardSidebar";
import DashboardHeader from "./dashboard/DashboardHeader";
import { StatCard } from "../components/dashboard/StatCard";
import { authService } from "../services/api";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch user data from backend
    const fetchUserData = async () => {
      try {
        const response = await authService.getCurrentUser();
        setUser(response.user);
      } catch (error) {
        console.error("Authentication error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
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
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader user={user} />

        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto"
          >
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Welcome back, {user?.fullName || "User"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Here's what's happening with your accounts today.
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <StatCard
                  title="Total Balance"
                  value="Rp 368.430.000"
                  change="+2,3%"
                  isPositive={true}
                  icon={<FiDollarSign />}
                  className="hover:shadow-lg transition-shadow duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <StatCard
                  title="Monthly Spending"
                  value="Rp 53.130.000"
                  change="-0,5%"
                  isPositive={false}
                  icon={<FiArrowDown />}
                  className="hover:shadow-lg transition-shadow duration-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <StatCard
                  title="Monthly Income"
                  value="Rp 94.260.000"
                  change="+4,1%"
                  isPositive={true}
                  icon={<FiArrowUp />}
                  className="hover:shadow-lg transition-shadow duration-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                />
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
