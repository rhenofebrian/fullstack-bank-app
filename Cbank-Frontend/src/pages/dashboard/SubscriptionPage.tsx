import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCheck, FiLoader, FiStar, FiArrowLeft } from "react-icons/fi";
import { DashboardSidebar } from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import { Button } from "../../components/ui/button";
import { useToast } from "../../components/toast";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function SubscriptionPage() {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(
    user?.subscription?.type || "standard"
  );
  const { toast } = useToast();

  // Update localStorage when subscription changes
  useEffect(() => {
    if (user && currentPlan) {
      // Store the subscription status in localStorage so other components can access it
      localStorage.setItem("subscriptionType", currentPlan);

      // Update user object in localStorage if it exists
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        parsedUser.subscription = { type: currentPlan };
        localStorage.setItem("user", JSON.stringify(parsedUser));
      }
    }
  }, [currentPlan, user]);

  const handleSubscriptionChange = async (newPlan: "standard" | "premium") => {
    if (newPlan === currentPlan) return;

    setIsLoading(true);

    try {
      // Simulate a brief loading state
      setTimeout(() => {
        // Update local state immediately without API call
        setCurrentPlan(newPlan);

        // Update user context if needed
        if (updateUser) {
          updateUser({
            ...user,
            subscription: { type: newPlan },
          });
        }

        // Force a refresh of the sidebar by dispatching a custom event
        window.dispatchEvent(
          new CustomEvent("subscription-changed", {
            detail: { type: newPlan },
          })
        );

        toast({
          title: "Subscription Updated",
          description:
            newPlan === "premium"
              ? "You've successfully upgraded to Premium!"
              : "Your subscription has been changed to Standard",
          type: "success",
        });

        setIsLoading(false);
      }, 800); // Short delay to show loading state
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Update Failed",
        description: "Failed to update subscription",
        type: "error",
      });
    }
  };

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
            <div className="mb-8 flex items-center">
              <Link to="/dashboard" className="mr-4">
                <Button variant="ghost" size="icon">
                  <FiArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Subscription
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your subscription plan
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Standard Plan */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border-2 ${
                  currentPlan === "standard"
                    ? "border-blue-500 dark:border-blue-400"
                    : "border-transparent"
                }`}
              >
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Standard Plan
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Basic features for standard users
                  </p>

                  <div className="mb-6">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      Free
                    </p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <FiCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Basic account features
                      </span>
                    </li>
                    <li className="flex items-start">
                      <FiCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Standard transaction limits
                      </span>
                    </li>
                    <li className="flex items-start">
                      <FiCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Email support
                      </span>
                    </li>
                  </ul>

                  <Button
                    className="w-full hover:bg-blue-600 transition-colors"
                    variant={currentPlan === "standard" ? "outline" : "default"}
                    disabled={currentPlan === "standard" || isLoading}
                    onClick={() => handleSubscriptionChange("standard")}
                  >
                    {isLoading && currentPlan === "premium" ? (
                      <FiLoader className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {currentPlan === "standard" ? "Current Plan" : "Downgrade"}
                  </Button>
                </div>
              </motion.div>

              {/* Premium Plan */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className={`rounded-xl shadow-md overflow-hidden border-2 ${
                  currentPlan === "premium"
                    ? "border-amber-500 dark:border-amber-400"
                    : "border-transparent"
                }`}
              >
                <div className="bg-gradient-to-br from-amber-400 to-yellow-600 p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold text-white">
                      Premium Plan
                    </h2>
                    <FiStar className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-white/80 mb-4">
                    Enhanced features and benefits
                  </p>

                  <div className="mb-6">
                    <p className="text-3xl font-bold text-white">
                      Free<span className="text-lg font-normal"> upgrade</span>
                    </p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <FiCheck className="h-5 w-5 text-white mr-2 mt-0.5" />
                      <span className="text-white/90">
                        All standard features
                      </span>
                    </li>
                    <li className="flex items-start">
                      <FiCheck className="h-5 w-5 text-white mr-2 mt-0.5" />
                      <span className="text-white/90">No transaction fees</span>
                    </li>
                    <li className="flex items-start">
                      <FiCheck className="h-5 w-5 text-white mr-2 mt-0.5" />
                      <span className="text-white/90">
                        Priority customer support
                      </span>
                    </li>
                    <li className="flex items-start">
                      <FiCheck className="h-5 w-5 text-white mr-2 mt-0.5" />
                      <span className="text-white/90">Advanced analytics</span>
                    </li>
                    <li className="flex items-start">
                      <FiCheck className="h-5 w-5 text-white mr-2 mt-0.5" />
                      <span className="text-white/90">
                        Higher transaction limits
                      </span>
                    </li>
                  </ul>

                  <Button
                    className={`w-full ${
                      currentPlan === "premium"
                        ? "bg-white/20 hover:bg-white/30 text-white"
                        : "bg-white text-amber-600 hover:bg-white/90 hover:scale-105 transform"
                    }`}
                    variant="ghost"
                    disabled={currentPlan === "premium" || isLoading}
                    onClick={() => handleSubscriptionChange("premium")}
                  >
                    {isLoading && currentPlan === "standard" ? (
                      <FiLoader className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {currentPlan === "premium" ? "Current Plan" : "Upgrade Now"}
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Subscription Information */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Subscription Information
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Current Plan
                    </p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {currentPlan === "premium" ? "Premium" : "Standard"}
                    </p>
                  </div>
                  {currentPlan === "premium" && (
                    <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-medium">
                      Premium
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentPlan === "premium"
                      ? "You are enjoying premium benefits. You can downgrade to standard at any time."
                      : "Upgrade to Premium to unlock all features and benefits. It's completely free!"}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
