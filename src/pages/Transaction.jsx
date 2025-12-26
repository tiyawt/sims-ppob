import UserSummary from "../components/UserSummary";
import BalanceCard from "../components/BalanceCard";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBalance } from "../store/balanceSlice";

export default function Transaction() {
      const dispatch = useDispatch();
      const { value: balanceState, isLoading: isBalanceLoading } = useSelector(
        (s) => s.balance
      );
    
      const [showBalance, setShowBalance] = useState(false);

    useEffect(() => {
        dispatch(fetchBalance());
    }, [dispatch]);

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
            </div>
        </div>
    );
}