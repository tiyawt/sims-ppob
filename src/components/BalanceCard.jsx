import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import bgSaldo from "../assets/Background Saldo.png";

export default function BalanceCard({
  balanceState,
  isLoading,
  showBalance,
  onToggle,
  className = "",
}) {
  const balanceNumber =
    typeof balanceState === "number"
      ? balanceState
      : balanceState?.balance ?? 0;

  const displayBalance = isLoading
    ? "Loading..."
    : showBalance
    ? balanceNumber.toLocaleString("id-ID")
    : "●●●●●●●";

  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl p-8 text-white justify-center items-start bg-cover bg-bottom bg-no-repeat ${className}`}
      style={{ backgroundImage: `url(${bgSaldo})` }}
    >
      <p className="text-base opacity-90">Saldo anda</p>
      <p className="text-xl font-bold tracking-tight">Rp {displayBalance}</p>
      <button
        type="button"
        className="flex items-center gap-2 text-sm font-medium opacity-90 border-0 bg-transparent p-0 hover:opacity-100 transition-opacity cursor-pointer text-white"
        onClick={onToggle}
      >
        {showBalance ? "Tutup Saldo" : "Lihat Saldo"}
        <FontAwesomeIcon icon={showBalance ? faEyeSlash : faEye} size="sm" />
      </button>
    </div>
  );
}
