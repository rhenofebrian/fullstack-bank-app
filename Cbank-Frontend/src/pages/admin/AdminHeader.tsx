import { useState } from "react";
import {
  FiMenu,
  FiX,
  FiUser,
  FiBell,
  FiDollarSign,
  FiUsers,
  FiLogOut,
} from "react-icons/fi";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface AdminHeaderProps {
  admin?: any;
}

export default function AdminHeader({ admin }: AdminHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <FiX className="h-5 w-5" />
          ) : (
            <FiMenu className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle Menu</span>
        </Button>

        {/* Search (placeholder) */}
        <div className="flex-1 md:ml-4">
          <div className="relative hidden md:block max-w-md">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-100 dark:bg-gray-700 border-none rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                className="h-4 w-4 text-gray-400 dark:text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <FiBell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            <span className="sr-only">Notifications</span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <FiUser className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {admin?.fullName || "Administrator"}
                  </p>
                  <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                    {admin?.email || "admin@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 dark:text-red-400"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <nav className="flex flex-col space-y-2">
            <a
              href="/admin/transfer"
              className="flex items-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiDollarSign className="h-5 w-5 mr-3" />
              Transfer to User
            </a>
            <a
              href="/admin/users"
              className="flex items-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiUsers className="h-5 w-5 mr-3" />
              User Management
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
            >
              <FiLogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
