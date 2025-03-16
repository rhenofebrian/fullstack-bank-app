import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiUsers, FiDollarSign, FiLogOut, FiShield } from "react-icons/fi";
import { motion } from "framer-motion";

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const navItems = [
    {
      name: "Transfer to User",
      icon: <FiDollarSign className="h-5 w-5" />,
      path: "/admin/transfer",
    },
    {
      name: "User Management",
      icon: <FiUsers className="h-5 w-5" />,
      path: "/admin/users",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken"); // Remove admin session token
    navigate("/admin/login"); // Navigate to admin login page
  };

  return (
    <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <Link to="/admin" className="flex items-center">
          <FiShield className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold">
            <span className="text-blue-600">Admin</span>
            <span className="text-gray-900 dark:text-white">Panel</span>
          </h1>
        </Link>
      </div>

      {/* Admin Info Card */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
        className="mt-4 mx-4 rounded-lg overflow-hidden shadow-sm border bg-gradient-to-br from-blue-500 to-cyan-600 border-blue-400 dark:border-blue-700"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-white">Administrator</h3>
          </div>

          <div className="text-xs mb-3 text-white/80">
            You have full access to all admin features
          </div>
        </div>
      </motion.div>

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
