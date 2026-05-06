
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long"),

  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .toLowerCase(),

  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password too long"),

  confirmPassword: z.string()
    .min(6, "Confirm Password must be at least 6 characters")
    .max(100, "Confirm Password too long"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
});

export const loginSchema = z.object({
    email: z.string()
        .min(1, "Email is required")
        .email("Invalid email format")
        .toLowerCase(),

    password: z.string()
        .min(1, "Password is required"),
});
