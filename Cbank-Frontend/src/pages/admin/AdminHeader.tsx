import { useState } from "react";
import { FiMenu, FiUser, FiLogOut, FiMoon, FiSun } from "react-icons/fi";
import { Link } from "react-router-dom";
import useDarkMode from "../../hooks/useDarkMode";

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  const [darkMode, setDarkMode] = useDarkMode();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <span className="sr-only">Open main menu</span>
              <FiMenu className="h-6 w-6" />
            </button>
            <div className="md:hidden flex-shrink-0 flex items-center ml-4">
              <Link to="/admin/dashboard" className="flex items-center">
                <h1 className="text-xl font-bold">
                  <span className="text-blue-600">C</span>
                  <span className="text-gray-900 dark:text-white">Bank</span>
                  <span className="text-red-500 ml-1">Admin</span>
                </h1>
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {/* Dark Mode Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 transition 
                          hover:bg-blue-500 dark:hover:bg-blue-600"
            >
              {darkMode ? (
                <FiSun className="text-yellow-400 transition duration-300" />
              ) : (
                <FiMoon />
              )}
            </button>

            <div className="ml-3 relative">
              <div>
                <button
                  type="button"
                  className="flex items-center max-w-xs rounded-full bg-white dark:bg-gray-800 text-sm focus:outline-none"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <FiUser className="h-5 w-5" />
                  </div>
                </button>
              </div>

              {showProfileMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <button
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                  >
                    <div className="flex items-center">
                      <FiLogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/admin/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700"
              onClick={() => setShowMobileMenu(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/users"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setShowMobileMenu(false)}
            >
              Users
            </Link>
            <Link
              to="/admin/transactions"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setShowMobileMenu(false)}
            >
              Transactions
            </Link>
            <Link
              to="/admin/settings"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setShowMobileMenu(false)}
            >
              Settings
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;
