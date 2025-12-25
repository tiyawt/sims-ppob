import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/loginSchema";
import axios from "axios";
import Register from "./Register";
import { Link, useNavigate, Navigate } from "react-router-dom";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
    const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const [serverError, setServerError] = useState("");
  const token = localStorage.getItem("token")
  if (token) {
    return <Navigate to="/" replace />
  }
  const onSubmit = async (values) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/login`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("LOGIN SUCCESS:", res.data);

      const token = res.data?.data?.token;

      if (token) {
        localStorage.setItem("token", token);
        navigate("/", { replace: true })
      }
    } catch (error) {
      setServerError(
        error.response?.data?.message || "Login gagal"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Email</label>
        <input {...register("email")} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <div>
        <label>Password</label>
        <input type="password" {...register("password")} />
        {errors.password && <p>{errors.password.message}</p>}
      </div>

      {serverError && <p>{serverError}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Loading..." : "Login"}
      </button>
      <p>
        Belum punya akun? Registrasi{" "}
        <Link to="/register">di sini</Link>
      </p>
      </form>
  );
}
