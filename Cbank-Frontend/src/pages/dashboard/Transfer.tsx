import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";

const TransferPage: React.FC = () => {
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Transfer sebesar Rp ${amount} ke rekening ${accountNumber} berhasil!`
    );
    setAmount("");
    setAccountNumber("");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <DashboardHeader />
      <main className="max-w-2xl mx-auto py-10 px-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-6">
          Transfer Dana
        </h2>
        <form
          onSubmit={handleTransfer}
          className="bg-white dark:bg-gray-800 p-6 shadow-lg rounded-lg"
        >
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Nomor Rekening Tujuan
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Jumlah Transfer (Rp)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Kirim
          </button>
        </form>
      </main>
    </div>
  );
};

export default TransferPage;
