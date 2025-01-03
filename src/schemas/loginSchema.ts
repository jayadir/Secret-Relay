import { z } from "zod";
export const loginValidation = z.object({
    email: z.string().email({ message: "invalid email address" }),
    password: z.string().min(8, { message: "minimum of 8 characters are required" })
});