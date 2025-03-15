import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiLock,
  FiSave,
  FiLoader,
  FiMoon,
  FiSun,
  FiBell,
  FiGlobe,
} from "react-icons/fi";
import { DashboardSidebar } from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
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
  const [darkMode, setDarkMode] = useDarkMode();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    twoFactorAuth: false,
    language: "english",
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

        // Initialize settings with user preferences if available
        if (response.user.settings) {
          setSettings(response.user.settings);
        }
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

    // Sync settings with dark mode state
    setSettings((prev) => ({ ...prev, darkMode }));
  }, [navigate, toast, darkMode]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSettingChange = (name: string, value: any) => {
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  // For the darkMode setting specifically
  const handleDarkModeChange = (checked: boolean) => {
    setDarkMode(checked);
    setSettings((prev) => ({ ...prev, darkMode: checked }));
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

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await userService.updateSettings(settings);

      toast({
        title: "Settings Updated",
        description: "Your settings have been successfully saved",
        type: "success",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description:
          error.response?.data?.message || "Failed to update settings",
        type: "error",
      });
    } finally {
      setIsSaving(false);
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
            className="max-w-4xl mx-auto"
          >
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your account settings and preferences
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <Tabs defaultValue="account" className="w-full">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <TabsList className="flex">
                    <TabsTrigger value="account" className="flex-1 py-4">
                      Account
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex-1 py-4">
                      Security
                    </TabsTrigger>
                    <TabsTrigger value="preferences" className="flex-1 py-4">
                      Preferences
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-6">
                  {/* Account Settings */}
                  <TabsContent value="account" className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Account Information
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        View and update your account details
                      </p>

                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <p className="text-blue-800 dark:text-blue-300 text-sm">
                          To update your personal information like name and
                          contact details, please visit the{" "}
                          <Button
                            variant="link"
                            className="p-0 h-auto text-blue-600 dark:text-blue-400"
                            onClick={() => navigate("/profile")}
                          >
                            Profile
                          </Button>{" "}
                          page.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              Delete Account
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Permanently delete your account and all associated
                              data
                            </p>
                          </div>
                          <Button variant="destructive" size="sm">
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

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
                              className="pl-10"
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
                              className="pl-10"
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
                              className="pl-10"
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

                      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                          Two-Factor Authentication
                        </h3>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              Enable 2FA
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <div className="flex items-center">
                            <Switch
                              id="twoFactorAuth"
                              checked={settings.twoFactorAuth}
                              onCheckedChange={(checked) =>
                                handleSettingChange("twoFactorAuth", checked)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Preferences Settings */}
                  <TabsContent value="preferences" className="space-y-6">
                    <form onSubmit={handleSettingsSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Appearance
                        </h3>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {settings.darkMode ? (
                              <FiMoon className="text-gray-900 dark:text-white" />
                            ) : (
                              <FiSun className="text-gray-900 dark:text-white" />
                            )}
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                Dark Mode
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Toggle between light and dark theme
                              </p>
                            </div>
                          </div>
                          <Switch
                            id="darkMode"
                            checked={darkMode}
                            onCheckedChange={handleDarkModeChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Notifications
                        </h3>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <FiBell className="text-gray-900 dark:text-white" />
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  Email Notifications
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Receive updates and alerts via email
                                </p>
                              </div>
                            </div>
                            <Switch
                              id="emailNotifications"
                              checked={settings.emailNotifications}
                              onCheckedChange={(checked) =>
                                handleSettingChange(
                                  "emailNotifications",
                                  checked
                                )
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <FiBell className="text-gray-900 dark:text-white" />
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  SMS Notifications
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Receive updates and alerts via SMS
                                </p>
                              </div>
                            </div>
                            <Switch
                              id="smsNotifications"
                              checked={settings.smsNotifications}
                              onCheckedChange={(checked) =>
                                handleSettingChange("smsNotifications", checked)
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Language
                        </h3>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <FiGlobe className="text-gray-900 dark:text-white" />
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                Preferred Language
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Select your preferred language for the
                                application
                              </p>
                            </div>
                          </div>
                          <select
                            value={settings.language}
                            onChange={(e) =>
                              handleSettingChange("language", e.target.value)
                            }
                            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2"
                          >
                            <option value="english">English</option>
                            <option value="spanish">Spanish</option>
                            <option value="french">French</option>
                            <option value="german">German</option>
                            <option value="chinese">Chinese</option>
                          </select>
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
                            Saving...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <FiSave className="mr-2" />
                            Save Preferences
                          </div>
                        )}
                      </Button>
                    </form>
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
