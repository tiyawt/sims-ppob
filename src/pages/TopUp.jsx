import UserSummary from "../components/UserSummary";
import BalanceCard from "../components/BalanceCard";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBalance } from "../store/balanceSlice";

export default function TopUp() {
  const dispatch = useDispatch();
  const { value: balanceState, isLoading: isBalanceLoading } = useSelector(
    (s) => s.balance
  );

  const [showBalance, setShowBalance] = useState(false);
  const [nominalInput, setNominalInput] = useState("");
  const [selectedNominal, setSelectedNominal] = useState(null);

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
              <input
                type="text"
                placeholder="masukan nominal Top Up"
                value={
                  nominalInput
                    ? `Rp${parseInt(nominalInput).toLocaleString("id-ID")}`
                    : ""
                }
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              {nominalInput && !isInputValid && (
                <p className="text-sm text-red-600">
                  Nominal minimal Rp10.000 dan maksimal Rp1.000.000
                </p>
              )}
            </div>
            {/* Top Up Button */}
            <button
              disabled={!isInputValid}
              className={`w-full py-3 px-3 rounded-lg font-bold text-white transition-all ${
                isInputValid
                  ? "bg-red-500 hover:bg-red-600 cursor-pointer"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Top Up
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
    </div>
  );
}
