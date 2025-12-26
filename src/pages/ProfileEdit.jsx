import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ProfilePhoto from "../assets/ProfilePhoto.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faUser } from "@fortawesome/free-solid-svg-icons";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProfileEdit() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data?.data || {};
        setUser(data);
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
      } catch (error) {
        console.error("Error fetching profile", error);
        toast.error("Gagal memuat profil");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    // Validate file size (max 100KB)
    if (file.size > 100 * 1024) {
      toast.error("Ukuran file maksimal 100KB");
      return;
    }

    setIsUploadingImage(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.put(`${API_BASE_URL}/profile/image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const newImage = res.data?.data?.profile_image;
      setUser((prev) => ({ ...prev, profile_image: newImage }));
      toast.success("Foto profil berhasil diperbarui");
    } catch (error) {
      console.error("Error uploading image", error);
      toast.error(error.response?.data?.message || "Gagal mengunggah foto");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/profile/update`,
        { first_name: firstName, last_name: lastName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Profil berhasil disimpan");
      navigate("/profile", { replace: true });
    } catch (error) {
      console.error("Error update profile", error);
      toast.error("Gagal menyimpan profil");
    } finally {
      setIsSaving(false);
    }
  };

  const avatar = user?.profile_image || ProfilePhoto;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-[1200px] px-4 py-12 flex flex-col items-center">
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-28 h-28 mb-4">
            <img
              src={avatar}
              alt="Avatar"
              className="w-28 h-28 rounded-full object-cover border border-gray-200 bg-white"
              onError={(e) => (e.currentTarget.src = ProfilePhoto)}
            />
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              disabled={isUploadingImage}
            />
            <label
              htmlFor="avatar-upload"
              className={`absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow ${
                isUploadingImage ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-gray-50"
              }`}
            >
              <FontAwesomeIcon icon={faPen} className="text-gray-500" size="xs" />
            </label>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            {isLoading ? "Memuat..." : `${firstName} ${lastName}`.trim() || "Edit Profil"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 text-sm">@</span>
              <input
                type="email"
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
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-3 text-sm text-gray-900"
                required
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
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-3 text-sm text-gray-900"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className={`w-full rounded-md bg-red-500 text-white font-semibold py-3 transition-colors ${
              isSaving ? "opacity-70 cursor-not-allowed" : "hover:bg-red-600"
            }`}
          >
            {isSaving ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </div>
    </div>
  );
}
