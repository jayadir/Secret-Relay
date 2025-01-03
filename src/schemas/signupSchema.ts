import { z } from "zod"

export const usernameValidation = z.string()
    .min(3, "minimum of 3 characters are required")
    .max(20, "maximum of 20 characters are allowed")
    .regex(/^[a-zA-Z0-9_]*$/, "only alphanumeric characters and underscore are allowed")
export const emailValidation = z.string().email({ message: "invalid email address" })
export const passwordValidation = z.string().min(8,{message:"minimum of 8 characters are required"})
export const signUpValidation=z.object({
    name: usernameValidation,
    email: emailValidation,
    password: passwordValidation
})