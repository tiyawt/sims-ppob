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
      className={`flex flex-col gap-2 md:gap-3 rounded-2xl p-4 md:p-8 text-white justify-center items-start bg-center lg:bg-cover bg-bottom-left lg:bg-bottom bg-no-repeat ${className}`}
      style={{ backgroundImage: `url(${bgSaldo})` }}
    >
      <p className="text-xs md:text-base opacity-90">Saldo anda</p>
      <p className="text-base md:text-xl font-bold tracking-tight break-words">Rp {displayBalance}</p>
      <button
        type="button"
        className="flex items-center gap-2 text-xs md:text-sm font-medium opacity-90 border-0 bg-transparent p-0 hover:opacity-100 transition-opacity cursor-pointer text-white"
        onClick={onToggle}
      >
        {showBalance ? "Tutup Saldo" : "Lihat Saldo"}
        </button>
    </div>
  );
}
