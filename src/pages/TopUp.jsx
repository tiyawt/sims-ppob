import UserSummary from "../components/UserSummary";
import BalanceCard from "../components/BalanceCard";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBalance } from "../store/balanceSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBillWave, faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function TopUp() {
  const dispatch = useDispatch();
  const { value: balanceState, isLoading: isBalanceLoading } = useSelector(
    (s) => s.balance
  );

  const [showBalance, setShowBalance] = useState(false);
  const [nominalInput, setNominalInput] = useState("");
  const [selectedNominal, setSelectedNominal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState("success"); // "success" | "error"
  const [modalAmount, setModalAmount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchBalance());
  }, [dispatch]);

  const nominalOptions = [10000, 20000, 50000, 100000, 250000, 500000];

  const handleNominalClick = (nominal) => {
    setSelectedNominal(nominal);
    setNominalInput(nominal.toString());
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setNominalInput(value);
    setSelectedNominal(null);
  };

  const isInputValid =
    nominalInput &&
    parseInt(nominalInput) >= 10000 &&
    parseInt(nominalInput) <= 1000000;

  const handleConfirmYes = async () => {
    setConfirmOpen(false);
    await submitTopUp();
  };

  const handleConfirmCancel = () => {
    setConfirmOpen(false);
    setModalStatus("error");
    setModalOpen(true);
  };

  const submitTopUp = async () => {
    if (!isInputValid || isSubmitting) return;

    const amount = parseInt(nominalInput);
    setIsSubmitting(true);
    setModalAmount(amount);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/topup`,
        { top_up_amount: amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setModalStatus("success");
      setModalOpen(true);
      setSelectedNominal(null);
      setNominalInput("");
      dispatch(fetchBalance());
    } catch (error) {
      console.error("Top up error", error);
      setModalStatus("error");
      setModalOpen(true);
    } finally {
      setIsSubmitting(false);
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

        {/* Main content - Form & Info */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Silahkan masukan
        </h2>
        <h3 className="text-xl font-bold text-gray-900 mb-6">
            Nominal Top Up
        </h3>
        <div className="grid grid-cols-3 gap-8">
          {/* Left - Form Section */}
          <div className="col-span-2">
            {/* Input field */}
            <div className="mb-4 space-y-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                  <FontAwesomeIcon icon={faMoneyBillWave} />
                </span>
                <input
                  type="text"
                  placeholder="masukan nominal Top Up"
                  value={
                    nominalInput
                      ? `${parseInt(nominalInput).toLocaleString("id-ID")}`
                      : ""
                  }
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              {nominalInput && !isInputValid && (
                <p className="text-sm text-red-600">
                  Nominal minimal Rp10.000 dan maksimal Rp1.000.000
                </p>
              )}
            </div>
            {/* Top Up Button */}
            <button
              disabled={!isInputValid || isSubmitting}
              onClick={() => {
                if (isInputValid && !isSubmitting) {
                  setModalAmount(parseInt(nominalInput));
                  setConfirmOpen(true);
                }
              }}
              className={`w-full py-3 px-3 rounded-lg font-bold text-white transition-all ${
                isInputValid && !isSubmitting
                  ? "bg-red-500 hover:bg-red-600 cursor-pointer"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Memproses..." : "Top Up"}
            </button>
          </div>

          {/* Right - Info Section */}
          <div>
              {/* Nominal options */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {nominalOptions.map((nominal) => (
                <button
                  key={nominal}
                  onClick={() => handleNominalClick(nominal)}
                  className={`py-3.5 px-3 rounded-lg font-semibold text-sm transition-all ${
                    selectedNominal === nominal
                      ? "bg-red-500 text-white"
                      : "bg-white border border-gray-300 text-gray-900 hover:border-red-500"
                  }`}
                >
                  Rp{nominal.toLocaleString("id-ID")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Confirm */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
          <div className="bg-white rounded-xl shadow-xl w-[320px] p-6 text-center relative">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white">
              <FontAwesomeIcon icon={faMoneyBillWave} size="lg" />
            </div>
            <p className="text-gray-700 text-sm mb-1">Anda yakin untuk Top Up sebesar</p>
            <p className="text-xl font-bold text-gray-900 mb-4">
              Rp{modalAmount.toLocaleString("id-ID")}
            </p>
            <div className="space-y-3">
              <button
                className="w-full py-2 rounded-lg font-semibold text-red-600 bg-transparent hover:text-red-900 transition-colors"
                onClick={handleConfirmYes}
              >
                Ya, lanjutkan Top Up
              </button>
              <button
                className="w-full py-2 rounded-lg font-semibold text-gray-500 hover:text-gray-700"
                onClick={handleConfirmCancel}
              >
                Batalkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Success / Error */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
          <div className="bg-white rounded-xl shadow-xl w-[320px] p-6 text-center relative">
            <div
              className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-white ${
                modalStatus === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              <FontAwesomeIcon
                icon={modalStatus === "success" ? faCheck : faTimes}
                size="lg"
              />
            </div>

            <p className="text-gray-700 text-sm">Top Up sebesar</p>
            <p className="text-xl font-bold text-gray-900 mb-1">
              Rp{modalAmount.toLocaleString("id-ID")}
            </p>
            <p className="text-gray-700 text-sm mb-4">
              {modalStatus === "success" ? "berhasil" : "gagal"}
            </p>

            <button
              className="text-sm font-semibold text-red-600 hover:text-red-700"
              onClick={() => {
                setModalOpen(false);
                navigate("/");
              }}
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
