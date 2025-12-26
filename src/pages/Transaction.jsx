import UserSummary from "../components/UserSummary";
import BalanceCard from "../components/BalanceCard";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBalance } from "../store/balanceSlice";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Transaction() {
  const dispatch = useDispatch();
  const { value: balanceState, isLoading: isBalanceLoading } = useSelector(
    (s) => s.balance
  );

  const [showBalance, setShowBalance] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setIsLoadingTransactions(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/transaction/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data?.data?.records || res.data?.data || [];
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    } finally {
      setIsLoadingTransactions(false);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchBalance());
    fetchTransactions();
  }, [dispatch, fetchTransactions]);

  const formatDate = (dateString) => {
    if (!dateString) return "Tanggal tidak tersedia";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Tanggal tidak valid";
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Tanggal tidak tersedia";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-[1200px] px-4 py-12">
        {/* Top row - User info & Balance */}
        <div className="grid grid-cols-3 gap-6 mb-16">
          {/* Left - User Summary */}
          <UserSummary />

          {/* Right - Balance Card */}
          <BalanceCard
            balanceState={balanceState}
            isLoading={isBalanceLoading}
            showBalance={showBalance}
            onToggle={() => setShowBalance((p) => !p)}
            className="col-span-2"
          />
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Semua Transaksi</h2>
          </div>

          {isLoadingTransactions ? (
            <div className="p-8 text-center text-gray-500">
              Memuat transaksi...
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Belum ada transaksi
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {transactions.map((tx, idx) => (
                <div
                  key={tx.invoice_number || idx}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {tx.description || tx.service_name || "Transaksi"}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatDate(tx.created_on || tx.transaction_date)}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p
                        className={`font-bold ${
                          tx.transaction_type === "TOPUP"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {tx.transaction_type === "TOPUP" ? "+" : "-"}
                        Rp{(tx.total_amount || tx.amount || 0).toLocaleString(
                          "id-ID"
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {tx.status || "Berhasil"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
