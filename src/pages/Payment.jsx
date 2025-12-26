import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle, faWallet } from "@fortawesome/free-solid-svg-icons";
import UserSummary from "../components/UserSummary";
import BalanceCard from "../components/BalanceCard";
import { fetchBalance } from "../store/balanceSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const service = location.state?.service;

  const { value: balanceState, isLoading: isBalanceLoading } = useSelector((s) => s.balance);
  const [showBalance, setShowBalance] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!service) {
      navigate("/", { replace: true });
    }
    dispatch(fetchBalance());
  }, [dispatch, service, navigate]);

  if (!service) {
    return null;
  }

  const amount = service.tariff || 0;

  const handlePaymentClick = () => {
    if (!amount || parseInt(amount) <= 0) {
      toast.error("Nominal pembayaran tidak valid");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmPayment = async () => {
    setShowConfirmModal(false);
    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/transaction`,
        {
          service_code: service.service_code,
          transaction_type: "PAYMENT",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPaymentSuccess(true);
      setShowResultModal(true);
      dispatch(fetchBalance());
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentSuccess(false);
      setShowResultModal(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseResult = () => {
    setShowResultModal(false);
    navigate("/", { replace: true });
  };

  const handleCancelPayment = () => {
    setShowConfirmModal(false);
    setPaymentSuccess(false);
    setShowResultModal(true);
  };

  const formatCurrency = (val) => {
    if (!val) return "Rp 0";
    return `Rp${parseInt(val).toLocaleString("id-ID")}`;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-[1200px] px-4 py-6 md:py-12">
        {/* Top row - User info & Balance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-16">
          <UserSummary />
          <BalanceCard
            balanceState={balanceState}
            isLoading={isBalanceLoading}
            showBalance={showBalance}
            onToggle={() => setShowBalance((p) => !p)}
            className="md:col-span-2"
          />
        </div>

        {/* Payment Form */}
        <div className="max-w-full">
          <h2 className="text-sm md:text-base lg:text-lg font-normal text-gray-900 mb-4 md:mb-6">PemBayaran</h2>

          {/* Service Display */}
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            {service.icon ? (
              <img src={service.icon} alt={service.title} className="w-6 h-6 md:w-8 md:h-8 object-contain" />
            ) : (
              <FontAwesomeIcon icon={faWallet} className="text-gray-500 text-xl md:text-2xl" />
            )}
            <span className="text-xs md:text-sm lg:text-base font-medium text-gray-900">{service.title}</span>
          </div>

          {/* Amount Input */}
          <div className="relative mb-4 md:mb-6">
            <span className="absolute inset-y-0 left-3 md:left-4 flex items-center text-gray-500 text-xs md:text-sm">
              <FontAwesomeIcon icon={faWallet} />
            </span>
            <input
              type="text"
              value={amount.toLocaleString("id-ID")}
              readOnly
              className="w-full rounded-md border border-gray-300 pl-10 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 text-xs md:text-sm text-gray-900 bg-gray-100 cursor-default pointer-events-none"
            />
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePaymentClick}
            disabled={isProcessing || !amount || parseInt(amount) <= 0}
            className={`w-full rounded-md bg-red-500 text-white font-semibold py-2 md:py-3 text-sm md:text-base transition-colors ${
              isProcessing || !amount || parseInt(amount) <= 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-red-600"
            }`}
          >
            {isProcessing ? "Memproses..." : "Bayar"}
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
          <div className="bg-white rounded-xl shadow-xl w-[320px] p-6 text-center relative">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white">
              <FontAwesomeIcon icon={faWallet} size="lg" />
            </div>
            <p className="text-gray-700 text-sm mb-1">Beli {service.title} senilai</p>
            <p className="text-xl font-bold text-gray-900 mb-4">
              {formatCurrency(amount)} ?
            </p>
            <div className="space-y-3">
              <button
                className="w-full py-2 rounded-lg font-semibold text-red-600 bg-transparent hover:text-red-900 transition-colors"
                onClick={handleConfirmPayment}
              >
                Ya, lanjutkan Bayar
              </button>
              <button
                className="w-full py-2 rounded-lg font-semibold text-gray-500 hover:text-gray-700"
                onClick={handleCancelPayment}
              >
                Batalkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {showResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
          <div className="bg-white rounded-xl shadow-xl w-[320px] p-6 text-center relative">
            <div
              className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-white ${
                paymentSuccess ? "bg-green-500" : "bg-red-500"
              }`}
            >
              <FontAwesomeIcon
                icon={paymentSuccess ? faCheckCircle : faTimesCircle}
                size="lg"
              />
            </div>
            <p className="text-gray-700 text-sm">Pembayaran {service.title} sebesar</p>
            <p className="text-xl font-bold text-gray-900 mb-1">
              {formatCurrency(amount)}
            </p>
            <p className="text-gray-700 text-sm mb-4">
              {paymentSuccess ? "berhasil" : "gagal"}
            </p>
            <button
              className="text-sm font-semibold text-red-600 hover:text-red-700"
              onClick={handleCloseResult}
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
