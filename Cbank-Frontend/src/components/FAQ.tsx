import { useState } from "react";
import { Plus, Minus, Shield, Users, Clock, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { faqData } from "../data";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col lg:flex-row gap-12 lg:gap-24">
        {/* Left Column - Cbank Highlights */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 sticky top-8 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex flex-col">
              {/* Logo and Brand */}
              <div className="mb-8 flex items-center">
                <div className="w-12 h-12 bg-blue-600 dark:bg-blue-700 rounded-xl flex items-center justify-center mr-4">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-gray-900 dark:text-white text-2xl font-bold">
                  <span className="text-blue-600">C</span>bank
                </h3>
              </div>

              <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-6">
                Why choose <span className="text-blue-600">C</span>bank?
              </h2>

              {/* Stats/Highlights */}
              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-white dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4 mt-1">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 dark:text-white text-lg font-semibold">
                      10M+ Users
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Join our growing community of satisfied customers
                      worldwide.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4 mt-1">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 dark:text-white text-lg font-semibold">
                      100% Secure
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Bank-grade encryption and advanced security protocols.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4 mt-1">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 dark:text-white text-lg font-semibold">
                      24/7 Support
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Our dedicated team is always ready to assist you.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - FAQ Section */}
        <div className="lg:w-2/3">
          <h1 className="text-gray-900 dark:text-white text-6xl font-bold mb-12">
            FAQ
          </h1>
          <div className="space-y-4">
            {faqData.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm"
              >
                <motion.button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-6 text-left"
                  whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                >
                  <h3 className="text-gray-900 dark:text-white text-xl pr-8">
                    {item.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <div className="w-12 h-12 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
                        <Minus className="w-6 h-6 text-white" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <Plus className="w-6 h-6 text-gray-900 dark:text-white" />
                      </div>
                    )}
                  </div>
                </motion.button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6">
                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
