import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProfilePhoto from "../assets/ProfilePhoto.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faUser } from "@fortawesome/free-solid-svg-icons";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${API_BASE_URL}/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data?.data || null);
            } catch (error) {
                console.error("Error fetching profile", error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
    };

    const fullName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() : "";
    const avatar = user?.profile_image || ProfilePhoto;

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="mx-auto max-w-[1200px] px-4 py-12 flex flex-col items-center">
                {/* Avatar and name */}
                <div className="flex flex-col items-center mb-10">
                    <div className="relative w-32 h-32 mb-4">
                        <img
                            src={avatar}
                            alt="Avatar"
                            className="w-32 h-32 rounded-full object-cover border border-gray-200 bg-white"
                            onError={(e) => (e.currentTarget.src = ProfilePhoto)}
                        />
                        <div className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow">
                            <FontAwesomeIcon icon={faPen} className="text-gray-500" size="xs" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 text-center">
                        {isLoading ? "Memuat..." : fullName || "Profil"}
                    </h1>
                </div>

                {/* Form display */}
                <div className="w-full max-w-2xl space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm text-gray-600">Email</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 text-sm">@</span>
                            <input
                                type="text"
                                readOnly
                                value={user?.email || ""}
                                className="w-full rounded-md border border-gray-300 pl-8 pr-3 py-3 text-sm text-gray-900 bg-gray-100 cursor-default pointer-events-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm text-gray-600">Nama Depan</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 text-sm">
                                <FontAwesomeIcon icon={faUser} />
                            </span>
                            <input
                                type="text"
                                readOnly
                                value={user?.first_name || ""}
                                className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-3 text-sm text-gray-900 bg-gray-100 cursor-default pointer-events-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm text-gray-600">Nama Belakang</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 text-sm">
                                <FontAwesomeIcon icon={faUser} />
                            </span>
                            <input
                                type="text"
                                readOnly
                                value={user?.last_name || ""}
                                className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-3 text-sm text-gray-900 bg-gray-100 cursor-default pointer-events-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <button
                            
                            className="w-full rounded-md border border-red-500 text-red-600 font-semibold py-3 hover:bg-red-50 transition-colors mb-4"
                            onClick={() => navigate("/profile/edit")}
                        >
                            Edit Profil
                        </button>
                        <button
                            className="w-full rounded-md bg-red-500 hover:bg-red-600 text-white font-semibold py-3 transition-colors"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}