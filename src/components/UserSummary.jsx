import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfilePhoto from "../assets/ProfilePhoto.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function UserSummary({ user: userProp, className = "" }) {
  const [fetchedUser, setFetchedUser] = useState(null);
  const [error, setError] = useState(null);
  const user = userProp || fetchedUser;

  useEffect(() => {
    if (userProp) return;
    
    const token = localStorage.getItem("token");
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFetchedUser(res.data.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(error.response?.status || "Error");
      }
    };
    
    fetchProfile();
  }, [userProp]);

  if (error) {
    return (
      <div className={className}>
        <p className="text-red-500 text-sm font-semibold">
          Error {error}: Token tidak valid
        </p>
      </div>
    );
  }

  if (!user) return <p className="text-gray-500 text-sm">Loading...</p>;

  return (
    <div className={"flex flex-col"}>
      <img
        src={user.profile_image || ProfilePhoto}
        alt="Avatar"
        className="w-[60px] h-[60px] rounded-full object-cover mb-4"
        onError={(e) => (e.currentTarget.src = ProfilePhoto)}
      />
      <div>
        <p className="text-gray-900 text-base">Selamat datang,</p>
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
          {user.first_name} {user.last_name}
        </h1>
      </div>
    </div>
  );
}