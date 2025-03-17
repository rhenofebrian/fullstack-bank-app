import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLock, FiSave, FiLoader } from "react-icons/fi";
import { DashboardSidebar } from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { useToast } from "../../components/toast";
import { userService } from "../../services/api";
import useDarkMode from "../../hooks/useDarkMode";

export default function Settings() {
  const [darkMode] = useDarkMode();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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

    // Fetch user data from backend
    const fetchUserData = async () => {
      try {
        const response = await userService.getProfile();
        setUser(response.user);
      } catch (error) {
        console.error("Authentication error:", error);
        toast({
          title: "Error",
          description: "Failed to load settings",
          type: "error",
        });
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, toast]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match",
        type: "error",
      });
      return;
    }

    setIsSaving(true);

    try {
      await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed",
        type: "success",
      });

      // Clear password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description:
          error.response?.data?.message || "Failed to update password",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      setIsDeleting(true);
      try {
        await userService.deleteAccount();
        toast({
          title: "Account Deleted",
          description: "Your account has been permanently deleted",
          type: "success",
        });
        localStorage.removeItem("token");
        navigate("/");
      } catch (error: any) {
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Failed to delete account",
          type: "error",
        });
      } finally {
        setIsDeleting(false);
      }
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
        <DashboardHeader />

        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your account settings
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <Tabs defaultValue="security" className="w-full">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <TabsList className="flex">
                    <TabsTrigger
                      value="security"
                      className="flex-1 py-4 dark:text-gray-300"
                    >
                      Security
                    </TabsTrigger>
                    <TabsTrigger
                      value="account"
                      className="flex-1 py-4 dark:text-gray-300"
                    >
                      Account
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-6">
                  {/* Security Settings */}
                  <TabsContent value="security" className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Change Password
                      </h3>

                      <form
                        onSubmit={handlePasswordSubmit}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">
                            Current Password
                          </Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <FiLock className="text-gray-400" />
                            </div>
                            <Input
                              id="currentPassword"
                              name="currentPassword"
                              type="password"
                              placeholder="••••••••"
                              className="pl-10 dark:text-gray-300"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <FiLock className="text-gray-400" />
                            </div>
                            <Input
                              id="newPassword"
                              name="newPassword"
                              type="password"
                              placeholder="••••••••"
                              className="pl-10 dark:text-gray-300"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              required
                              minLength={8}
                            />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Password must be at least 8 characters
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">
                            Confirm New Password
                          </Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <FiLock className="text-gray-400" />
                            </div>
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type="password"
                              placeholder="••••••••"
                              className="pl-10 dark:text-gray-300"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              required
                            />
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium py-2 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <div className="flex items-center justify-center">
                              <FiLoader className="animate-spin mr-2" />
                              Updating...
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <FiSave className="mr-2" />
                              Update Password
                            </div>
                          )}
                        </Button>
                      </form>
                    </div>
                  </TabsContent>

                  {/* Account Settings */}
                  <TabsContent value="account" className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Delete Account
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Permanently delete your account and all associated data.
                        This action cannot be undone.
                      </p>

                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                        <p className="text-red-800 dark:text-red-300 text-sm">
                          Warning: Deleting your account will remove all your
                          data and cannot be reversed.
                        </p>
                      </div>

                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="w-full"
                      >
                        {isDeleting ? (
                          <div className="flex items-center justify-center">
                            <FiLoader className="animate-spin mr-2" />
                            Deleting...
                          </div>
                        ) : (
                          "Delete Account"
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
