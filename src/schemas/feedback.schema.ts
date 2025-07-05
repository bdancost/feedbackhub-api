// src/schemas/feedback.schema.ts
import { z } from "zod";

export const feedbackSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("Email inválido"),
  message: z.string().min(5, "Mensagem muito curta"),
  rating: z.number().min(1).max(5),
});
