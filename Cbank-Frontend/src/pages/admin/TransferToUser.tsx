import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiDollarSign, FiSend, FiAlertCircle } from "react-icons/fi";
import { AdminSidebar } from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useToast } from "../../components/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

// Mock user data
const mockUsers = [
  {
    id: "USR1001",
    name: "John Doe",
    email: "john.doe@example.com",
    balance: "Rp 12.450.000",
  },
  {
    id: "USR1002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    balance: "Rp 8.320.000",
  },
  {
    id: "USR1003",
    name: "Robert Johnson",
    email: "robert.j@example.com",
    balance: "Rp 2.150.000",
  },
  {
    id: "USR1004",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    balance: "Rp 25.780.000",
  },
  {
    id: "USR1005",
    name: "Michael Wilson",
    email: "michael.w@example.com",
    balance: "Rp 5.430.000",
  },
];

export default function TransferToUser() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedUser(null);
  };

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setSearchTerm("");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and format as currency
    const value = e.target.value.replace(/[^0-9]/g, "");
    setAmount(value);
  };

  const formattedAmount = () => {
    if (!amount) return "";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(parseInt(amount))
      .replace("IDR", "Rp");
  };

  const handleTransfer = () => {
    if (!selectedUser) {
      toast({
        title: "Error",
        description: "Please select a user to transfer to.",
        type: "error",
      });
      return;
    }

    if (!amount || parseInt(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Transfer Successful",
        description: `Successfully transferred ${formattedAmount()} to ${
          selectedUser.name
        }.`,
        type: "success",
      });
      setIsLoading(false);
      setSelectedUser(null);
      setAmount("");
      setDescription("");
    }, 1500);
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
            className="max-w-3xl mx-auto"
          >
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Transfer to User
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Send funds to a user's account
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="space-y-6">
                  {/* User Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="user-search">Select User</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FiSearch className="text-gray-400" />
                      </div>
                      <Input
                        id="user-search"
                        type="search"
                        placeholder="Search by name, email or ID..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                    </div>

                    {/* Search Results */}
                    {searchTerm && filteredUsers.length > 0 && (
                      <div className="mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        <ul className="py-1">
                          {filteredUsers.map((user) => (
                            <li key={user.id}>
                              <button
                                type="button"
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                onClick={() => handleSelectUser(user)}
                              >
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                                      {user.name.charAt(0)}
                                    </span>
                                  </div>
                                  <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                      {user.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {user.email} • {user.id}
                                    </p>
                                  </div>
                                </div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {searchTerm && filteredUsers.length === 0 && (
                      <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-center">
                        <p className="text-gray-500 dark:text-gray-400">
                          No users found
                        </p>
                      </div>
                    )}

                    {/* Selected User */}
                    {selectedUser && (
                      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 dark:text-blue-400 font-medium">
                              {selectedUser.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {selectedUser.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {selectedUser.email} • {selectedUser.id}
                            </p>
                          </div>
                          <div className="ml-auto">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Current Balance
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {selectedUser.balance}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FiDollarSign className="text-gray-400" />
                      </div>
                      <Input
                        id="amount"
                        type="text"
                        placeholder="Enter amount"
                        className="pl-10"
                        value={amount}
                        onChange={handleAmountChange}
                      />
                    </div>
                    {amount && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formattedAmount()}
                      </p>
                    )}
                  </div>

                  {/* Transfer Type */}
                  <div className="space-y-2">
                    <Label htmlFor="transfer-type">Transfer Type</Label>
                    <Select defaultValue="balance">
                      <SelectTrigger id="transfer-type">
                        <SelectValue placeholder="Select transfer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="balance">Balance Top-up</SelectItem>
                        <SelectItem value="bonus">Bonus Credit</SelectItem>
                        <SelectItem value="refund">Refund</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                      id="description"
                      placeholder="Enter a description for this transfer"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  {/* Warning */}
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FiAlertCircle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700 dark:text-yellow-400">
                          This action will immediately add funds to the user's
                          account. This operation cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={!selectedUser || !amount || isLoading}
                    onClick={handleTransfer}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiSend className="mr-2 h-4 w-4" />
                        Transfer Funds
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
