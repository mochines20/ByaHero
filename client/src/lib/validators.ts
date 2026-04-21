import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
    confirmPassword: z.string().min(8),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const tripSchema = z.object({
  origin: z.string().min(2),
  destination: z.string().min(2),
  transportType: z.enum(["jeepney", "mrt", "lrt", "bus", "etrike", "walk", "grab"]),
  fare: z.coerce.number().min(0),
  travelTime: z.coerce.number().int().min(1),
  tripDate: z.string().min(1),
  notes: z.string().max(500).optional(),
});
