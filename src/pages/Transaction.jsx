import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { fetchBalance } from "../store/balanceSlice";
import UserSummary from "../components/UserSummary";

export default function Transaction() {
    const dispatch = useDispatch();
    const { value: balance, isLoading } = useSelector((state) => state.balance);
    const [showBalance, setShowBalance] = useState(false);

    useEffect(() => {
        dispatch(fetchBalance());
    }, [dispatch]);

    const displayBalance = isLoading
        ? "Loading..."
        : showBalance
        ? balance?.balance ?? 0
        : "••••••";

    return (
        <div style={{ paddingTop: 32 }}>
            <div
                style={{
                    background: "#EF3D3D",
                    color: "white",
                    borderRadius: 12,
                    padding: "16px 20px",
                    maxWidth: 520,
                    marginBottom: 24,
                }}
            >
                <p style={{ margin: 0, fontSize: 14 }}>Saldo anda</p>
                <p style={{ margin: "8px 0 4px", fontSize: 24, fontWeight: 700 }}>Rp {displayBalance}</p>
                <button
                    type="button"
                    onClick={() => setShowBalance((p) => !p)}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        background: "transparent",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                        padding: 0,
                        fontSize: 12,
                    }}
                >
                    {showBalance ? "Tutup Saldo" : "Lihat Saldo"} <FontAwesomeIcon icon={showBalance ? faEyeSlash : faEye} />
                </button>
            </div>

            <p style={{ fontSize: 24, fontWeight: 700 }}>Semua Transaksi</p>
            
            <UserSummary />
        </div>
    );
}