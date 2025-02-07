import { z } from "zod";
export const messageValidation = z.object({
    message: z
        .string()
        .min(1, { message: "message cannot be empty" })
});