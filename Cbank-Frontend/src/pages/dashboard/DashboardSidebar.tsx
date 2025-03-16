import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiHome, FiSend, FiSettings, FiUser, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import SubscriptionCard from "../../components/SubscriptionCard";

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { user } = useAuth();

  // State to track subscription type
  const [subscriptionType, setSubscriptionType] = useState<
    "standard" | "premium"
  >(
    (user?.subscription?.type ||
      localStorage.getItem("subscriptionType") ||
      "standard") as "standard" | "premium"
  );

  // Listen for subscription changes
  useEffect(() => {
    const handleSubscriptionChange = (event: CustomEvent) => {
      setSubscriptionType(event.detail.type);
    };

    // Check localStorage on mount
    const storedType = localStorage.getItem("subscriptionType");
    if (storedType === "premium" || storedType === "standard") {
      setSubscriptionType(storedType);
    }

    // Add event listener for subscription changes
    window.addEventListener(
      "subscription-changed",
      handleSubscriptionChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "subscription-changed",
        handleSubscriptionChange as EventListener
      );
    };
  }, []);

  // Update when user changes
  useEffect(() => {
    if (user?.subscription?.type) {
      setSubscriptionType(user.subscription.type);
    }
  }, [user]);

  const navItems = [
    {
      name: "Dashboard",
      icon: <FiHome className="h-5 w-5" />,
      path: "/dashboard",
    },
    {
      name: "Transfer",
      icon: <FiSend className="h-5 w-5" />,
      path: "/dashboard/transfer",
    },
    {
      name: "Profile",
      icon: <FiUser className="h-5 w-5" />,
      path: "/dashboard/profile",
    },
    {
      name: "Settings",
      icon: <FiSettings className="h-5 w-5" />,
      path: "/dashboard/settings",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove session token
    localStorage.removeItem("user"); // Remove user data
    localStorage.removeItem("subscriptionType"); // Remove subscription data
    navigate("/"); // Navigate to home page
  };

  return (
    <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <Link to="/dashboard" className="flex items-center">
          <h1 className="text-2xl font-bold">
            <span className="text-blue-600">C</span>
            <span className="text-gray-900 dark:text-white">Bank</span>
          </h1>
        </Link>
      </div>

      {/* Subscription Card */}
      <SubscriptionCard type={subscriptionType} />

      <nav className="flex-1 p-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              currentPath === item.path
                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50 hover:translate-x-1"
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg transition-all duration-200 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 hover:translate-x-1"
        >
          <FiLogOut className="mr-3 h-5 w-5" /> Logout
        </button>
      </div>
    </div>
  );
}
