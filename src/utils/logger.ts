// src/utils/logger.ts
import pino from "pino";

export const logger = pino({
  transport: {
    target: "pino-pretty", // Formata logs no terminal (dev only)
    options: {
      colorize: true, // Cores no terminal
      translateTime: "SYS:standard", // Formata o timestamp
      ignore: "pid,hostname", // Remove dados desnecessários
    },
  },
});
