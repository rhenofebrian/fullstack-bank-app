import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiEdit,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiUserCheck,
  FiUserX,
} from "react-icons/fi";
import { AdminSidebar } from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useToast } from "../../components/toast";
import { Badge } from "../../components/ui/badge";

// Mock user data
const mockUsers = [
  {
    id: "USR1001",
    name: "John Doe",
    email: "john.doe@example.com",
    status: "active",
    subscription: "premium",
    balance: "Rp 12.450.000",
    lastLogin: "2 hours ago",
  },
  {
    id: "USR1002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    status: "active",
    subscription: "standard",
    balance: "Rp 8.320.000",
    lastLogin: "1 day ago",
  },
  {
    id: "USR1003",
    name: "Robert Johnson",
    email: "robert.j@example.com",
    status: "inactive",
    subscription: "standard",
    balance: "Rp 2.150.000",
    lastLogin: "2 weeks ago",
  },
  {
    id: "USR1004",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    status: "active",
    subscription: "premium",
    balance: "Rp 25.780.000",
    lastLogin: "3 hours ago",
  },
  {
    id: "USR1005",
    name: "Michael Wilson",
    email: "michael.w@example.com",
    status: "active",
    subscription: "standard",
    balance: "Rp 5.430.000",
    lastLogin: "5 days ago",
  },
  {
    id: "USR1006",
    name: "Sarah Brown",
    email: "sarah.b@example.com",
    status: "inactive",
    subscription: "standard",
    balance: "Rp 1.200.000",
    lastLogin: "1 month ago",
  },
];

export default function UserManagement() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusToggle = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user
      )
    );

    toast({
      title: "User Status Updated",
      description: "The user's status has been successfully updated.",
      type: "success",
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      setUsers(users.filter((user) => user.id !== userId));

      toast({
        title: "User Deleted",
        description: "The user has been successfully deleted.",
        type: "success",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  User Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  View and manage all registered users
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Add New User
                </Button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <Input
                    type="search"
                    placeholder="Search users by name, email or ID..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <div>
                  <Button variant="outline" className="w-full md:w-auto">
                    <FiFilter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700 text-left">
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Subscription
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Balance
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 dark:text-blue-400 font-medium">
                                  {user.name.charAt(0)}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {user.email}
                                </div>
                                <div className="text-xs text-gray-400 dark:text-gray-500">
                                  ID: {user.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              className={`${
                                user.status === "active"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              }`}
                            >
                              {user.status === "active" ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              className={`${
                                user.subscription === "premium"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {user.subscription === "premium"
                                ? "Premium"
                                : "Standard"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {user.balance}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {user.lastLogin}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleStatusToggle(user.id)}
                                title={
                                  user.status === "active"
                                    ? "Deactivate User"
                                    : "Activate User"
                                }
                              >
                                {user.status === "active" ? (
                                  <FiUserX className="h-4 w-4 text-red-500" />
                                ) : (
                                  <FiUserCheck className="h-4 w-4 text-green-500" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Edit User"
                              >
                                <FiEdit className="h-4 w-4 text-blue-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteUser(user.id)}
                                title="Delete User"
                              >
                                <FiTrash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                        >
                          No users found matching your search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing{" "}
                    <span className="font-medium">{filteredUsers.length}</span>{" "}
                    of <span className="font-medium">{users.length}</span> users
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Next
                    </Button>
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
