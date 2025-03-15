import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCreditCard,
  FiDollarSign,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import { DashboardSidebar } from "../pages/dashboard/DashboardSidebar";
import DashboardHeader from "../pages/dashboard/DashboardHeader";
import { AccountCard } from "../components/dashboard/AccountCard";

import { StatCard } from "../components/dashboard/StatCard";
import { authService } from "../services/api";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Total Balance"
                value="$24,562.00"
                change="+2.3%"
                isPositive={true}
                icon={<FiDollarSign />}
              />
              <StatCard
                title="Monthly Spending"
                value="$3,542.00"
                change="-0.5%"
                isPositive={false}
                icon={<FiArrowDown />}
              />
              <StatCard
                title="Monthly Income"
                value="$6,284.00"
                change="+4.1%"
                isPositive={true}
                icon={<FiArrowUp />}
              />
            </div>

            {/* Accounts and Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Accounts Section */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    Your Accounts
                  </h2>
                  <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                    View All
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AccountCard
                    type="Checking Account"
                    number="**** 4832"
                    balance="$12,345.67"
                    color="from-blue-500 to-cyan-500"
                  />
                  <AccountCard
                    type="Savings Account"
                    number="**** 7291"
                    balance="$8,942.51"
                    color="from-purple-500 to-pink-500"
                  />
                  <AccountCard
                    type="Investment Account"
                    number="**** 1053"
                    balance="$3,274.00"
                    color="from-amber-500 to-orange-500"
                  />
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-center">
                    <button className="text-blue-600 dark:text-blue-400 flex items-center gap-2 font-medium">
                      <span className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <FiCreditCard className="text-blue-600 dark:text-blue-400" />
                      </span>
                      Add New Account
                    </button>
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
