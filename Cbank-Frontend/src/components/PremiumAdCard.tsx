import type React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiStar, FiX } from "react-icons/fi";
import { motion } from "framer-motion";

export default function PremiumAdCard() {
  const [dismissed, setDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Tampilkan iklan setelah 2 detik
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDismissed(true);
  };

  if (dismissed || !isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-4 left-4 z-50"
    >
      <div className="relative w-64 overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-600" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=200&width=300')] opacity-10 bg-cover" />

        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-white/80 hover:text-white p-1.5 rounded-full hover:bg-black/20 transition-colors z-10"
          aria-label="Dismiss"
        >
          <FiX size={18} />
        </button>

        <div className="relative p-4">
          <div className="flex items-center mb-3">
            <FiStar className="text-white mr-2 h-5 w-5" />
            <h3 className="text-white font-bold">Premium Membership</h3>
          </div>

          <div className="mb-4">
            <p className="text-white/90 text-sm mb-2">
              Unlock exclusive features and benefits with our premium plan!
            </p>
            <ul className="text-white/80 text-xs space-y-1">
              <li className="flex items-center">
                <span className="mr-1">✓</span> No transaction fees
              </li>
              <li className="flex items-center">
                <span className="mr-1">✓</span> Priority customer support
              </li>
              <li className="flex items-center">
                <span className="mr-1">✓</span> Advanced analytics
              </li>
            </ul>
          </div>

          <Link
            to="/login"
            className="block w-full py-2 px-4 bg-white text-amber-600 font-medium text-center rounded-md hover:bg-white/90 transition-colors hover:scale-105 transform duration-200"
          >
            Upgrade Now
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>
    </motion.div>
  );
}
