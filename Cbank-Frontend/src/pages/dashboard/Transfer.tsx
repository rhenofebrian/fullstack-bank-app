import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiDollarSign, FiSend, FiLoader } from "react-icons/fi";
import { DashboardSidebar } from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { useToast } from "../../components/toast";
import { transferService } from "../../services/transferApi";
import { authService } from "../../services/api";

export default function Transfer() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    email: "",
    amount: "",
    description: "",
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await authService.getCurrentUser();
        setUser(response.user);
      } catch (error) {
        console.error("Authentication error:", error);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Only allow numbers for the amount field
    if (name === "amount" && value !== "") {
      const regex = /^[0-9\b]+$/;
      if (!regex.test(value)) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatRupiah = (angka: string) => {
    const number = Number.parseInt(angka, 10);
    if (isNaN(number)) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate amount
    const amount = Number.parseInt(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    // Check if user has enough balance
    if (user && amount > user.balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance to make this transfer",
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    try {
      console.log("Sending transfer request:", {
        recipientEmail: formData.email,
        amount,
        description: formData.description || "Transfer from dashboard",
      });

      const response = await transferService.transferFunds({
        recipientEmail: formData.email,
        amount,
        description: formData.description || "Transfer from dashboard",
      });

      toast({
        title: "Transfer Successful",
        description: `${formatRupiah(formData.amount)} has been sent to ${
          formData.email
        }`,
        type: "success",
      });

      // Update user balance
      const updatedUser = await authService.getCurrentUser();
      setUser(updatedUser.user);

      // Reset form
      setFormData({
        email: "",
        amount: "",
        description: "",
      });
    } catch (error: any) {
      console.error("Transfer error:", error);
      toast({
        title: "Transfer Failed",
        description:
          error.response?.data?.message ||
          "An error occurred while processing the transfer.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            className="max-w-4xl mx-auto"
          >
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Fund Transfer
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Send money to another CBank user
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Recipient Email</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FiMail className="text-gray-400" />
                        </div>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="recipient@example.com"
                          className="pl-10 dark:text-gray-300"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (Rupiah)</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FiDollarSign className="text-gray-400" />
                        </div>
                        <Input
                          id="amount"
                          name="amount"
                          placeholder="100000"
                          className="pl-10 dark:text-gray-300"
                          value={formData.amount}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      {formData.amount && (
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {formatRupiah(formData.amount)}
                        </p>
                      )}
                      {user && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Your balance: {formatRupiah(user.balance.toString())}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">
                        Description (Optional)
                      </Label>
                      <Input
                        id="description"
                        name="description"
                        placeholder="What's this transfer for?"
                        className="dark:text-gray-300"
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                    <p className="text-blue-800 dark:text-blue-300 text-sm">
                      Please make sure the recipient's email is correct.
                      Transfers cannot be canceled once sent.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium py-2 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <FiLoader className="animate-spin mr-2" />
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <FiSend className="mr-2" />
                        Send Transfer
                      </div>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
