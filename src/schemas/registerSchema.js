import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().min(1, "Email wajib diisi").email("Email tidak valid!"),
    first_name: z.string().min(1, "Nama depan wajib diisi"),
    last_name: z.string().min(1, "Nama belakang wajib diisi"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirm_password: z.string().min(1, "Password tidak sama"),
  })
  .refine((data) => data.confirm_password === "" || data.password === data.confirm_password, {
    message: "Password tidak sama",
    path: ["confirm_password"],
  });
