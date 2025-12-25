import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Home() {
  const [user, setUser] = useState();
  const [balance, setBalance] = useState();
  const [showBalance, setShowBalance] = useState();
  //Mengambil first name dan last name
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, []);

  //Mengambil balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/balance`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBalance(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBalance();
  }, []);

  if (!user || !balance) return <p>Loading...</p>;
  return (
    <>
      <p>Ini halaman home</p>
      <p>Selamat datang,</p>
      <h1>
        {user.first_name} {user.last_name}
      </h1>
      <p>
        Balance = {showBalance ? balance.balance : "••••••"}
      </p>
      <p
        style={{ cursor: "pointer" }}
        onClick={() => setShowBalance((prev) => !prev)}
      >
        Lihat saldo <FontAwesomeIcon icon={showBalance ? faEyeSlash : faEye} />
      </p>
    </>
  );
}
