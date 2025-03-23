
import { z } from "zod";




export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).optional(),
    name: z.string().min(1),
    phone: z.string().min(10).optional(),
});


export const loginSchema = z.object({
    email: z.string().email(),
});