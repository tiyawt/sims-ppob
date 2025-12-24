import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/registerSchema";
import axios from "axios";

const API_BASE_URL = "https://take-home-test-api.nutech-integrasi.com";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/registration`, values, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("SUCCESS:", res.data);
    } catch (error) {
      console.log("ERROR:", error.response?.data || error.message);
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
    </form>
  );
}
