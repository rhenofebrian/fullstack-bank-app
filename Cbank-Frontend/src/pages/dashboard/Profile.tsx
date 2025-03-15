import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSave,
  FiLoader,
} from "react-icons/fi";
import DashboardHeader from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { useToast } from "../../components/toast";
import { userService } from "../../services/api";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
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

        // Initialize form with user data
        setFormData({
          fullName: response.user.fullName || "",
          email: response.user.email || "",
          phone: response.user.phone || "",
          address: response.user.address || "",
          bio: response.user.bio || "",
        });
      } catch (error) {
        console.error("Authentication error:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          type: "error",
        });
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await userService.updateProfile(formData);

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
        type: "success",
      });

      // Update local user state
      setUser((prev: any) => ({ ...prev, ...formData }));
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description:
          error.response?.data?.message || "Failed to update profile",
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
                Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your personal information and account details
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Profile Picture Section */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-4xl font-bold">
                      {user.fullName?.charAt(0) || "U"}
                    </div>
                    <Button variant="outline" size="sm">
                      Change Photo
                    </Button>
                  </div>

                  {/* Profile Form */}
                  <div className="flex-1">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <FiUser className="text-gray-400" />
                            </div>
                            <Input
                              id="fullName"
                              name="fullName"
                              placeholder="John Doe"
                              className="pl-10"
                              value={formData.fullName}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <FiMail className="text-gray-400" />
                            </div>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="name@example.com"
                              className="pl-10"
                              value={formData.email}
                              onChange={handleChange}
                              disabled
                            />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Email cannot be changed. Contact support for
                            assistance.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <FiPhone className="text-gray-400" />
                            </div>
                            <Input
                              id="phone"
                              name="phone"
                              placeholder="+1 (555) 123-4567"
                              className="pl-10"
                              value={formData.phone}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <FiMapPin className="text-gray-400" />
                            </div>
                            <Input
                              id="address"
                              name="address"
                              placeholder="123 Main St, City, Country"
                              className="pl-10"
                              value={formData.address}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            name="bio"
                            placeholder="Tell us a little about yourself"
                            className="min-h-[100px]"
                            value={formData.bio}
                            onChange={handleChange}
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
                            Saving...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <FiSave className="mr-2" />
                            Save Changes
                          </div>
                        )}
                      </Button>
                    </form>
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
