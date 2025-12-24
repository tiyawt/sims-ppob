import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().email("Email tidak valid!"),
    first_name: z.string().min(1, "First name wajib diisi"),
    last_name: z.string().min(1, "Last name wajib diisi"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirm_password: z.string().min(8, "Konfirmasi password minimal 8 karakter"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Password tidak sama",
    path: ["confirm_password"],
  });
