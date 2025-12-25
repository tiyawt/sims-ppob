import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/registerSchema";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Register() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Email</label>
        <input {...register("email")} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <div>
        <label>First Name</label>
        <input {...register("first_name")} />
        {errors.first_name && <p>{errors.first_name.message}</p>}
      </div>

      <div>
        <label>Last Name</label>
        <input {...register("last_name")} />
        {errors.last_name && <p>{errors.last_name.message}</p>}
      </div>

      <div>
        <label>Password</label>
        <input type="password" {...register("password")} />
        {errors.password && <p>{errors.password.message}</p>}
      </div>

      <div>
        <label>Confirm Password</label>
        <input type="password" {...register("confirm_password")} />
        {errors.confirm_password && <p>{errors.confirm_password.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Loading..." : "Register"}
      </button>
      <p>
        Sudah punya akun? Login <Link to="/login">di sini</Link>
      </p>
    </form>
  );
}
