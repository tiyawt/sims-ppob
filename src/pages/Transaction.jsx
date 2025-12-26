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
  const [offset, setOffset] = useState(0);
  const limit = 5;

  const fetchTransactions = useCallback(async (currentOffset = 0) => {
    setIsLoadingTransactions(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE_URL}/transaction/history?offset=${currentOffset}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = res.data?.data?.records || res.data?.data || [];
      const newTransactions = Array.isArray(data) ? data : [];
      
      if (currentOffset === 0) {
        setTransactions(newTransactions);
      } else {
        setTransactions((prev) => [...prev, ...newTransactions]);
      }
      setOffset(currentOffset + limit);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      if (currentOffset === 0) {
        setTransactions([]);
      }
    } finally {
      setIsLoadingTransactions(false);
    }
  }, [limit]);

  useEffect(() => {
    dispatch(fetchBalance());
    fetchTransactions(0);
  }, [dispatch, fetchTransactions]);

  const formatDate = (dateString) => {
    if (!dateString) return "Tanggal tidak tersedia";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Tanggal tidak valid";
      const day = date.getDate();
      const month = date.toLocaleDateString("id-ID", { month: "long" });
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${day} ${month} ${year}     ${hours}:${minutes} WIB`;
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
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Semua Transaksi</h2>

          {isLoadingTransactions ? (
            <div className="p-8 text-center text-gray-500">
              Memuat transaksi...
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Belum ada transaksi
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx, idx) => (
                <div
                  key={tx.invoice_number || idx}
                  className="bg-white rounded-lg border border-gray-200 px-6 py-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p
                        className={`text-xl font-bold mb-1 ${
                          tx.transaction_type === "TOPUP"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {tx.transaction_type === "TOPUP" ? "+" : "-"} Rp.
                        {(tx.total_amount || tx.amount || 0).toLocaleString(
                          "id-ID"
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(tx.created_on || tx.transaction_date)}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm text-gray-900">
                        {tx.description || tx.service_name || (tx.transaction_type === "TOPUP" ? "Top Up Saldo" : "Transaksi")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Show More Button */}
        {transactions.length > 0 && !isLoadingTransactions && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => fetchTransactions(offset)}
              className="text-red-500 font-semibold hover:text-red-600 transition-colors"
            >
              Show more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
