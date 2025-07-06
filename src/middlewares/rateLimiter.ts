import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite por IP
  message: "Muitas requisições, tente novamente mais tarde.",
});
