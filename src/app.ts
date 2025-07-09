// src/app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import feedbackRoutes from "./routes/feedback.route";
import authRoutes from "./routes/auth.route";
import { limiter } from "./middlewares/rateLimiter";
import { swaggerSpec } from "./docs/swagger";
import { swaggerUiHandler, swaggerDocHandler } from "./docs/swagger";
import swaggerUi from "swagger-ui-express";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Porta do seu frontend Vite
    credentials: true,
  })
);
app.use(express.json());
app.use(helmet());
app.use(limiter);

app.use("/feedback", feedbackRoutes);
app.use("/auth", authRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/docs", swaggerUiHandler, swaggerDocHandler);

app.get("/", (req, res) => {
  res.send("FeedbackHub API rodando 🚀");
});

export default app;
