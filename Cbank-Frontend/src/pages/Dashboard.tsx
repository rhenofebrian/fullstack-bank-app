import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiDollarSign,
  FiArrowUp,
  FiArrowDown,
  FiRefreshCw,
  FiCalendar,
  FiClock,
} from "react-icons/fi";
import { DashboardSidebar } from "./dashboard/DashboardSidebar";
import DashboardHeader from "./dashboard/DashboardHeader";
import { StatCard } from "../components/dashboard/StatCard";
import { authService } from "../services/api";
import { transferService } from "../services/transferApi";
import { useToast } from "../components/toast";

interface Transaction {
  _id: string;
  userId: string;
  amount: number;
  type: "deposit" | "withdrawal" | "adjustment";
  description: string;
  status: "pending" | "completed" | "failed";
  createdAt: string;
  relatedUserId?: {
    fullName: string;
    email: string;
  };
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlySpending, setMonthlySpending] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [spendingChange, setSpendingChange] = useState(0);
  const [incomeChange, setIncomeChange] = useState(0);

  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchUserData = async () => {
    try {
      const response = await authService.getCurrentUser();
      setUser(response.user);
      return response.user;
    } catch (error) {
      console.error("Authentication error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await transferService.getTransferHistory();
      setTransactions(response.transactions || []);

      // Calculate monthly spending and income
      calculateMonthlyFinances(response.transactions || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const calculateMonthlyFinances = (transactions: Transaction[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Filter transactions for current month
    const currentMonthTransactions = transactions.filter((transaction) => {
      const date = new Date(transaction.createdAt);
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    });

    // Filter transactions for last month
    const lastMonthTransactions = transactions.filter((transaction) => {
      const date = new Date(transaction.createdAt);
      return (
        date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
      );
    });

    // Calculate current month spending and income
    const currentSpending = currentMonthTransactions
      .filter((t) => t.type === "withdrawal")
      .reduce((sum, t) => sum + t.amount, 0);

    const currentIncome = currentMonthTransactions
      .filter((t) => t.type === "deposit")
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate last month spending and income
    const lastSpending = lastMonthTransactions
      .filter((t) => t.type === "withdrawal")
      .reduce((sum, t) => sum + t.amount, 0);

    const lastIncome = lastMonthTransactions
      .filter((t) => t.type === "deposit")
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate percentage changes
    const spendingChange =
      lastSpending === 0
        ? 100
        : ((currentSpending - lastSpending) / lastSpending) * 100;

    const incomeChange =
      lastIncome === 0
        ? 100
        : ((currentIncome - lastIncome) / lastIncome) * 100;

    setMonthlySpending(currentSpending);
    setMonthlyIncome(currentIncome);
    setSpendingChange(Number.parseFloat(spendingChange.toFixed(1)));
    setIncomeChange(Number.parseFloat(incomeChange.toFixed(1)));
  };

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      await fetchUserData();
      await fetchTransactions();
    };

    loadData();

    // Set up polling to refresh user data every 30 seconds
    const intervalId = setInterval(() => {
      fetchUserData();
      fetchTransactions();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [navigate]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const updatedUser = await fetchUserData();
    await fetchTransactions();

    if (updatedUser) {
      toast({
        title: "Refreshed",
        description: "Your account information has been updated",
        type: "success",
      });
    }
    setIsRefreshing(false);
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "withdrawal":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "adjustment":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
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
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Welcome back, {user?.fullName || "User"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Here's what's happening with your account today.
                </p>
              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-colors"
                disabled={isRefreshing}
              >
                <FiRefreshCw
                  className={`mr-2 h-4 w-4 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <StatCard
                  title="Total Balance"
                  value={formatRupiah(user?.balance || 0)}
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
                  value={formatRupiah(monthlySpending)}
                  change={`${spendingChange > 0 ? "+" : ""}${spendingChange}%`}
                  isPositive={spendingChange <= 0}
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
                  value={formatRupiah(monthlyIncome)}
                  change={`${incomeChange > 0 ? "+" : ""}${incomeChange}%`}
                  isPositive={incomeChange >= 0}
                  icon={<FiArrowUp />}
                  className="hover:shadow-lg transition-shadow duration-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                />
              </motion.div>
            </div>

            {/* Recent Transactions */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Recent Transactions
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                {transactions.length === 0 ? (
                  <div className="p-6">
                    <p className="text-gray-600 dark:text-gray-400 text-center">
                      No recent transactions to display.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Type
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Amount
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {transactions.slice(0, 5).map((transaction) => (
                          <tr
                            key={transaction._id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col">
                                <div className="flex items-center text-sm text-gray-900 dark:text-white">
                                  <FiCalendar className="mr-2 h-4 w-4 text-gray-400" />
                                  {formatDate(transaction.createdAt)}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  <FiClock className="inline mr-1 h-3 w-3" />
                                  {formatTime(transaction.createdAt)}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTransactionTypeColor(
                                  transaction.type
                                )}`}
                              >
                                {transaction.type.charAt(0).toUpperCase() +
                                  transaction.type.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div
                                className={`text-sm font-medium ${
                                  transaction.type === "deposit"
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                }`}
                              >
                                {transaction.type === "deposit" ? "+" : "-"}{" "}
                                {formatRupiah(transaction.amount)}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {transaction.description}
                              </div>
                              {transaction.relatedUserId && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {transaction.type === "deposit"
                                    ? "From: "
                                    : "To: "}
                                  {transaction.relatedUserId.fullName}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {transactions.length > 5 && (
                  <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                    <button
                      onClick={() => navigate("/dashboard/transactions")}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      View all transactions
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
