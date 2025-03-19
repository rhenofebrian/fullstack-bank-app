import type React from "react";
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  isPositive,
  icon,
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </h3>
        <div
          className={`p-2 rounded-full ${
            isPositive
              ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {icon}
        </div>
      </div>
      <div className="flex items-baseline">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        <span
          className={`ml-2 text-sm font-medium ${
            isPositive
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  );
}
