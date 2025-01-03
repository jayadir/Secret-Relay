import { z } from "zod";
export const acceptMessagesSchema = z.object({
    accept: z.boolean()
});