import { useState } from "react";
import { motion } from "framer-motion";

export default function LoanSimulator() {
  const [loanAmount, setLoanAmount] = useState<string>("10000000"); // Default 10 million
  const [interestRate, setInterestRate] = useState<number>(5); // Default 5% per year
  const [tenor, setTenor] = useState<number>(12); // Default 12 months
  const [installment, setInstallment] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Function to format number to Rupiah
  const formatRupiah = (value: number) =>
    value.toLocaleString("id-ID", { style: "currency", currency: "IDR" });

  // Function to clean input (only numbers)
  const cleanNumber = (value: string) => value.replace(/\D/g, ""); // Extract only digits

  // Function to calculate monthly installment
  const calculateInstallment = () => {
    const cleanLoanAmount = Number(cleanNumber(loanAmount));

    if (cleanLoanAmount <= 0 || interestRate <= 0 || tenor <= 0) {
      alert("Please enter valid numbers!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const monthlyRate = interestRate / 100 / 12;
      const installmentAmount =
        (cleanLoanAmount * monthlyRate) /
        (1 - Math.pow(1 + monthlyRate, -tenor));

      setInstallment(installmentAmount);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 px-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md overflow-hidden">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Loan Simulator
        </h2>

        {/* Input Form */}
        <div className="space-y-4">
          {/* Loan Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Loan Amount (Rp)
            </label>
            <input
              type="text"
              value={loanAmount}
              onChange={(e) => setLoanAmount(cleanNumber(e.target.value))}
              onBlur={() =>
                setLoanAmount(Number(loanAmount).toLocaleString("id-ID"))
              }
              className="mt-1 p-2 w-full border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-right"
            />
          </div>

          {/* Interest Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Interest Rate (% per year)
            </label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="mt-1 p-2 w-full border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-right"
              min={1}
            />
          </div>

          {/* Tenor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tenor (months)
            </label>
            <input
              type="number"
              value={tenor}
              onChange={(e) => setTenor(Number(e.target.value))}
              className="mt-1 p-2 w-full border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-right"
              min={1}
            />
          </div>

          {/* Calculate Button */}
          <button
            onClick={calculateInstallment}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition flex justify-center"
          >
            {loading ? "Calculating..." : "Calculate Installment"}
          </button>
        </div>

        {/* Calculation Result with Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={installment !== null ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center"
        >
          {installment !== null && (
            <>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Monthly Installment
              </h3>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {formatRupiah(installment)}
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
