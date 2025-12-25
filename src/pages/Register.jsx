import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/registerSchema";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faUser,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

import ilustrasiLogin from "../assets/IllustrasiLogin.png"
import logo from "../assets/Logo.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Register() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/registration`, values);
      toast.success(res.data?.message || "Registrasi berhasil");
      navigate("/login", { replace: true });
    } catch (error) {
      const message = error.response?.data?.message;

      if (message === "Email sudah terdaftar") {
        setError("email", {
          type: "server",
          message: "Email sudah terdaftar",
        });
      } else {
        toast.error(message || "Registrasi gagal");
      }
    }
  };

  return (
    <div className="min-h-screen min-w-screen bg-white">
      <div className="mx-auto grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* LEFT: form */}
        <div className="flex items-center justify-center lg:px-20">
          <div className="w-full max-w-sm">
            {/* Header */}
            <div className="mb-3">
              <div className="mb-2 flex items-center gap-2 justify-center">
                <div className="flex h-7 w-7 items-center justify-center">
                  <img src={logo} alt="Logo" />
                </div>
                <span className="text-base font-bold text-gray-900">SIMS PPOB</span>
              </div>

              <p className="text-center mb-14 lg:text-3xl text-xl font-bold leading-tight text-gray-800">
                Lengkapi data untuk
                <br />
                membuat akun
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              {/* Email */}
              <div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                    <FontAwesomeIcon icon={faEnvelope} className="text-base" />
                  </span>
                  <input
                    className={`w-full border rounded-md bg-white px-4 py-2 pl-12 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition
                      ${
                        errors.email
                          ? "border-red-500"
                          : "border-gray-200 focus:border-red-600"
                      }`}
                    placeholder="masukan email anda"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500 text-right">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* First name */}
              <div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                    <FontAwesomeIcon icon={faUser} className="text-base" />
                  </span>
                  <input
                    className={`w-full rounded-md border bg-white px-4 py-2 pl-12 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition
                      ${
                        errors.first_name
                          ? "border-red-500"
                          : "border-gray-200 focus:border-red-600"
                      }`}
                    placeholder="nama depan"
                    {...register("first_name")}
                  />
                </div>
                {errors.first_name && (
                  <p className="mt-1 text-xs text-red-500 text-right">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              {/* Last name */}
              <div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                    <FontAwesomeIcon icon={faUser} className="text-base" />
                  </span>
                  <input
                    className={`w-full rounded-md border bg-white px-4 py-2 pl-12 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition
                      ${
                        errors.last_name
                          ? "border-red-500"
                          : "border-gray-200 focus:border-red-600"
                      }`}
                    placeholder="nama belakang"
                    {...register("last_name")}
                  />
                </div>
                {errors.last_name && (
                  <p className="mt-1 text-xs text-red-500 text-right">
                    {errors.last_name.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                    <FontAwesomeIcon icon={faLock} className="text-base" />
                  </span>

                  <input
                    type={showPass ? "text" : "password"}
                    className={`w-full rounded-md border bg-white px-4 py-2 pl-12 pr-12 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition
                      ${
                        errors.password
                          ? "border-red-500"
                          : "border-gray-200 focus:border-red-600"
                      }`}
                    placeholder="buat password"
                    {...register("password")}
                  />

                  <span
                    onClick={() => setShowPass((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setShowPass((p) => !p)}
                  >
                    <FontAwesomeIcon icon={showPass ? faEyeSlash : faEye} className="text-base" />
                  </span>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500 text-right">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                    <FontAwesomeIcon icon={faLock} className="text-base" />
                  </span>

                  <input
                    type={showConfirm ? "text" : "password"}
                    className={`w-full rounded-md border bg-white px-4 py-2 pl-12 pr-12 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition
                      ${
                        errors.confirm_password
                          ? "border-red-500"
                          : "border-gray-200 focus:border-red-600"
                      }`}
                    placeholder="konfirmasi password"
                    {...register("confirm_password")}
                  />

                  <span
                    onClick={() => setShowConfirm((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setShowConfirm((p) => !p)}
                  >
                    <FontAwesomeIcon icon={showConfirm ? faEyeSlash : faEye} className="text-base" />
                  </span>
                </div>
                {errors.confirm_password && (
                  <p className="mt-1 text-xs text-red-500 text-right">
                    {errors.confirm_password.message}
                  </p>
                )}
              </div>

              {/* Button */}
              <button
                style={{background:"red"}}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 text-base font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Loading..." : "Registrasi"}
              </button>

              {/* Link */}
              <p className="text-center text-sm mt-5 text-gray-600">
                sudah punya akun? login{" "}
                <Link to="/login" className="link-red">
                  di sini
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* RIGHT: illustration */}
        <div className="hidden items-center justify-center bg-[#FFF5F5] lg:flex">
          <img
            src={ilustrasiLogin}
            alt="Ilustrasi"
            className="h-auto w-full max-w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}