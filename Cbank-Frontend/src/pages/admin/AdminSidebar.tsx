import { Link, useLocation } from "react-router-dom";
import { FiHome, FiUsers, FiCreditCard } from "react-icons/fi";

export default function AdminSidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Link to="/admin/dashboard" className="flex items-center">
          <h1 className="text-xl font-bold">
            <span className="text-blue-600">C</span>
            <span className="text-gray-900 dark:text-white">Bank</span>
            <span className="text-red-500 ml-1">Admin</span>
          </h1>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          <Link
            to="/admin/dashboard"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
              isActive("/admin/dashboard")
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <FiHome className="mr-3 h-5 w-5" />
            Dashboard
          </Link>

          <Link
            to="/admin/users"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
              isActive("/admin/users")
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <FiUsers className="mr-3 h-5 w-5" />
            Users
          </Link>

          <Link
            to="/admin/transactions"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
              isActive("/admin/transactions")
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <FiCreditCard className="mr-3 h-5 w-5" />
            Transactions
          </Link>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            A
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Admin User
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              admin@cbank.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
