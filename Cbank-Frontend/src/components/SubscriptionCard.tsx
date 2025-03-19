import { FiStar } from "react-icons/fi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface SubscriptionCardProps {
  type: "standard" | "premium";
}

export default function SubscriptionCard({ type }: SubscriptionCardProps) {
  const isPremium = type === "premium";

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className={`mt-4 mx-4 rounded-lg overflow-hidden shadow-sm border ${
        isPremium
          ? "bg-gradient-to-br from-amber-400 to-yellow-600 border-amber-300 dark:border-amber-700"
          : "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3
            className={`font-medium ${
              isPremium ? "text-white" : "text-gray-800 dark:text-gray-200"
            }`}
          >
            {isPremium ? "Premium" : "Standard"} Plan
          </h3>
          {isPremium && <FiStar className="text-white h-4 w-4" />}
        </div>

        <div
          className={`text-xs mb-3 ${
            isPremium ? "text-white/80" : "text-gray-600 dark:text-gray-400"
          }`}
        >
          {isPremium
            ? "Enjoy all premium features and benefits"
            : "Basic features for standard users"}
        </div>

        <Link
          to="/dashboard/subscription"
          className={`flex items-center justify-center w-full py-1.5 px-3 rounded text-xs font-medium transition-all duration-200 ${
            isPremium
              ? "bg-white/20 text-white hover:bg-white/30 hover:scale-105 transform"
              : "bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 transform"
          }`}
        >
          {isPremium ? "Manage Subscription" : "Upgrade to Premium"}
        </Link>
      </div>
    </motion.div>
  );
}
