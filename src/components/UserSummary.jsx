import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function UserSummary() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(null);
  const [showBalance, setShowBalance] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchAll = async () => {
      try {
        const [profileRes, balanceRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/balance`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUser(profileRes.data.data);
        setBalance(balanceRes.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAll();
  }, []);

  if (!user || !balance) return <p>Loading...</p>;

  return (
    <div>
      <p>Selamat datang,</p>
      <h1>
        {user.first_name} {user.last_name}
      </h1>

      <p>Balance = {showBalance ? balance.balance : "••••••"}</p>

      <p
        style={{ cursor: "pointer" }}
        onClick={() => setShowBalance((prev) => !prev)}
      >
        Lihat saldo{" "}
        <FontAwesomeIcon icon={showBalance ? faEyeSlash : faEye} />
      </p>
    </div>
  );
}
