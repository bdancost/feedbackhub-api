// src/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import feedbackRoutes from "./routes/feedback.route";
import authRoutes from "./routes/auth.route";
import { limiter } from "./middlewares/rateLimiter";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";
import { swaggerDocHandler, swaggerUiHandler } from "./docs/swagger";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/feedback", feedbackRoutes);
app.use("/auth", authRoutes);
app.use(limiter);
app.use(helmet()); // Protege contra vulnerabilidades comuns
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/docs", swaggerUiHandler, swaggerDocHandler);

const PORT = process.env.PORT || 3333;

app.get("/", (req, res) => {
  res.send("FeedbackHub API rodando 🚀");
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
